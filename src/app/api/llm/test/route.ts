import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { HumanMessage } from '@langchain/core/messages';
import { ChatMistralAI } from '@langchain/mistralai';
import { Ollama } from 'ollama';
import axios from 'axios';

import { getProviderFromId } from '@/lib/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

let firebaseAdminApp: App | null = null;
let dbAdmin: Firestore | null = null;
let secretManagerClient: SecretManagerServiceClient | null = null;

function initializeServices() {
    if (getApps().length > 0) {
        if (!firebaseAdminApp) firebaseAdminApp = getApps()[0];
        if (!dbAdmin) dbAdmin = getFirestore(firebaseAdminApp);
        if (!secretManagerClient) secretManagerClient = new SecretManagerServiceClient();
        return;
    }

    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountJson) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
    }

    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;
    const rawPrivateKey = (serviceAccount as { private_key?: unknown }).private_key;
    if (typeof rawPrivateKey === 'string') {
        (serviceAccount as { private_key?: string }).private_key = rawPrivateKey.replace(/\\n/g, '\n');
    }

    firebaseAdminApp = initializeApp({ credential: cert(serviceAccount) });
    dbAdmin = getFirestore(firebaseAdminApp);
    secretManagerClient = new SecretManagerServiceClient({
        credentials: {
            client_email: (serviceAccount as { client_email?: string }).client_email,
            private_key: (serviceAccount as { private_key?: string }).private_key,
        },
        projectId: (serviceAccount as { project_id?: string }).project_id,
    });
}

async function getApiKeyFromSecret(versionName: string): Promise<string> {
    if (!secretManagerClient) throw new Error('Secret Manager is not initialized.');
    const [version] = await secretManagerClient.accessSecretVersion({ name: versionName });
    const apiKey = version.payload?.data?.toString();
    if (!apiKey) throw new Error('Stored API key is empty.');
    return apiKey;
}

function getErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
            response?: {
                status?: number;
                statusText?: string;
                data?: unknown;
            };
            message?: string;
        };
        const status = axiosError.response?.status;
        const statusText = axiosError.response?.statusText;
        const data = axiosError.response?.data;
        const dataText = typeof data === 'string' ? data : data ? JSON.stringify(data) : '';
        return [status ? `HTTP ${status}` : null, statusText, axiosError.message, dataText]
            .filter(Boolean)
            .join(': ');
    }
    return error instanceof Error ? error.message : String(error);
}

function writeSse(controller: ReadableStreamDefaultController<Uint8Array>, payload: unknown) {
    const encoder = new TextEncoder();
    controller.enqueue(encoder.encode(`data: ${typeof payload === 'string' ? payload : JSON.stringify(payload)}\n\n`));
}

async function streamOllamaPreview(
    controller: ReadableStreamDefaultController<Uint8Array>,
    modelId: string,
    ollamaEndpoint: string | undefined,
    prompt: string
) {
    const endpoint = ollamaEndpoint?.trim() || 'http://127.0.0.1:11434';
    const model = modelId.replace(/^ollama:/, '');
    const messages = [{ role: 'user' as const, content: prompt }];
    const isRemoteEndpoint = !endpoint.includes('localhost') && !endpoint.includes('127.0.0.1');
    const isCloudModel = model.includes(':cloud');
    const isGeminiModel = model.toLowerCase().includes('gemini');

    const ollama = new Ollama({
        host: endpoint,
        headers: isRemoteEndpoint ? { 'ngrok-skip-browser-warning': 'true' } : undefined,
    });

    try {
        await ollama.list();
    } catch (connectError) {
        throw new Error(`Cannot connect to Ollama at ${endpoint}: ${connectError instanceof Error ? connectError.message : 'Unknown error'}.`);
    }

    if (!isCloudModel && !isGeminiModel) {
        const ollamaStream = await ollama.chat({
            model,
            messages,
            stream: true,
        });

        for await (const chunk of ollamaStream) {
            const token = chunk.message?.content || '';
            if (token) writeSse(controller, { token });
        }
        return;
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };
    if (isRemoteEndpoint) {
        headers['ngrok-skip-browser-warning'] = 'true';
    }

    const response = await fetch(`${endpoint}/api/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ model, messages, stream: true }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API returned ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body from Ollama.');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (value) buffer += decoder.decode(value, { stream: !done });
        if (done) buffer += decoder.decode();

        const lines = buffer.split('\n');
        buffer = done ? '' : (lines.pop() || '');

        for (const line of lines) {
            if (!line.trim()) continue;
            const chunk = JSON.parse(line);
            const token = chunk.message?.content || '';
            if (token) writeSse(controller, { token });
        }

        if (done) break;
    }
}

async function streamMistralPreview(
    controller: ReadableStreamDefaultController<Uint8Array>,
    modelId: string,
    apiKey: string,
    prompt: string
) {
    if (modelId.startsWith('magistral-')) {
        const response = await axios.post(
            'https://api.mistral.ai/v1/chat/completions',
            {
                model: modelId,
                messages: [{ role: 'user', content: prompt }],
                stream: true,
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                responseType: 'stream',
            }
        );

        const stream = response.data;
        let buffer = '';

        await new Promise<void>((resolve, reject) => {
            stream.on('data', (chunk: Buffer) => {
                buffer += chunk.toString();
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const data = line.slice(6).trim();
                    if (!data || data === '[DONE]') continue;

                    try {
                        const parsed = JSON.parse(data);
                        const delta = parsed.choices?.[0]?.delta;
                        const token = typeof delta?.content === 'string'
                            ? delta.content
                            : Array.isArray(delta?.content)
                                ? delta.content
                                    .filter((x: { type?: string }) => x.type === 'text')
                                    .map((x: { text?: string }) => x.text || '')
                                    .join('')
                                : '';
                        if (token) writeSse(controller, { token });
                    } catch {
                        // Ignore malformed partial SSE chunks.
                    }
                }
            });
            stream.on('end', resolve);
            stream.on('error', reject);
        });
        return;
    }

    const chatModel = new ChatMistralAI({
        apiKey,
        modelName: modelId,
        temperature: 0.7,
    });

    const stream = await chatModel.stream([new HumanMessage({ content: prompt })]);
    for await (const chunk of stream) {
        const token = typeof chunk.content === 'string'
            ? chunk.content
            : Array.isArray(chunk.content)
                ? chunk.content
                    .filter((x: unknown) => typeof x === 'object' && x !== null && (x as { type?: string }).type !== 'thinking')
                    .map((x: unknown) => (typeof x === 'string' ? x : ((x as { text?: string }).text || '')))
                    .join('')
                : String(chunk.content || '');
        if (token) writeSse(controller, { token });
    }
}

export async function POST(request: NextRequest) {
    try {
        initializeServices();
    } catch (error) {
        console.error('LLM test route service initialization failed:', error);
        return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    if (!firebaseAdminApp || !dbAdmin) {
        return NextResponse.json({ error: 'Server services unavailable.' }, { status: 500 });
    }

    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized: Missing Bearer token' }, { status: 401 });
    }

    let decodedToken: DecodedIdToken;
    try {
        decodedToken = await getAuth(firebaseAdminApp).verifyIdToken(authorization.split('Bearer ')[1]);
    } catch {
        return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    let body: { modelId?: string; ollamaEndpoint?: string; prompt?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const modelId = body.modelId?.trim();
    if (!modelId) {
        return NextResponse.json({ error: 'Model ID is required.' }, { status: 400 });
    }

    const provider = getProviderFromId(modelId);
    if (provider !== 'Ollama' && provider !== 'Mistral AI') {
        return NextResponse.json({ error: `LLM preview currently supports Ollama and Mistral only. Selected provider: ${provider || 'unknown'}.` }, { status: 400 });
    }

    const prompt = body.prompt?.trim() || 'Please reply with one short sentence confirming you are available for a conversation.';
    let mistralApiKey: string | null = null;

    if (provider === 'Mistral AI') {
        try {
            const userDoc = await dbAdmin.collection('users').doc(decodedToken.uid).get();
            const secretVersion = userDoc.data()?.apiSecretVersions?.mistral;
            if (!secretVersion) {
                return NextResponse.json({ error: 'Mistral API key reference was not found in Settings.' }, { status: 404 });
            }
            mistralApiKey = await getApiKeyFromSecret(secretVersion);
        } catch (error) {
            console.error('Failed to retrieve Mistral API key for preview:', error);
            return NextResponse.json({ error: `Failed to retrieve Mistral API key: ${getErrorMessage(error)}` }, { status: 500 });
        }
    }

    const stream = new ReadableStream({
        async start(controller) {
            try {
                if (provider === 'Ollama') {
                    await streamOllamaPreview(controller, modelId, body.ollamaEndpoint, prompt);
                } else {
                    await streamMistralPreview(controller, modelId, mistralApiKey!, prompt);
                }
                writeSse(controller, '[DONE]');
                controller.close();
            } catch (error) {
                console.error(`LLM preview failed for ${modelId}:`, error);
                writeSse(controller, { error: getErrorMessage(error) });
                controller.close();
            }
        },
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
