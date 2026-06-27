// Authenticated API route to convert a raw agent turn into presentation text.

import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

import { initializeApp, getApps, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

import { ChatMistralAI } from '@langchain/mistralai';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { BaseLanguageModelInput } from '@langchain/core/language_models/base';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

import { getProviderFromId, getLLMInfoById } from '@/lib/models';
import { DEFAULT_TURN_TRANSFORM_PROMPT } from '@/lib/turn-transform';

type RequestBody = {
  turn: string;
  transformLlmId: string;
  transformPrompt?: string;
};

let firebaseAdminApp: App | null = null;
let dbAdmin: Firestore | null = null;
let secretManagerClient: SecretManagerServiceClient | null = null;

function loadServiceAccount(): ServiceAccount {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
  }

  const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawPrivateKey = (serviceAccount as any).private_key;
  if (typeof rawPrivateKey === 'string') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (serviceAccount as any).private_key = rawPrivateKey.replace(/\\n/g, '\n');
  }
  return serviceAccount;
}

function createSecretManagerClient(serviceAccount: ServiceAccount): SecretManagerServiceClient {
  return new SecretManagerServiceClient({
    credentials: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      client_email: (serviceAccount as any).client_email,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      private_key: (serviceAccount as any).private_key,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    projectId: (serviceAccount as any).project_id,
  });
}

function initializeServices() {
  const serviceAccount = loadServiceAccount();

  if (getApps().length > 0) {
    if (!firebaseAdminApp) firebaseAdminApp = getApps()[0];
    if (!dbAdmin) dbAdmin = getFirestore(firebaseAdminApp);
    if (!secretManagerClient) secretManagerClient = createSecretManagerClient(serviceAccount);
    return;
  }

  firebaseAdminApp = initializeApp({ credential: cert(serviceAccount) });
  dbAdmin = getFirestore(firebaseAdminApp);
  secretManagerClient = createSecretManagerClient(serviceAccount);
}

async function getApiKeyFromSecret(secretVersionName: string): Promise<string | null> {
  if (!secretManagerClient) return null;
  const [version] = await secretManagerClient.accessSecretVersion({ name: secretVersionName });
  const payload = version.payload?.data?.toString();
  return payload || null;
}

function extractText(result: unknown): string {
  if (typeof result === 'string') return result;
  if (!result || typeof result !== 'object' || !('content' in result)) return '';

  const content = (result as { content: unknown }).content;
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((x: unknown) => (typeof x === 'string' ? x : JSON.stringify(x)))
      .join(' ');
  }
  return '';
}

export async function POST(request: NextRequest) {
  try {
    initializeServices();

    if (!firebaseAdminApp || !dbAdmin) {
      return NextResponse.json({ error: 'Server configuration error - services not initialized' }, { status: 500 });
    }

    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing Bearer token' }, { status: 401 });
    }

    const idToken = authorization.split('Bearer ')[1];
    let decodedToken: DecodedIdToken;
    try {
      decodedToken = await getAuth(firebaseAdminApp).verifyIdToken(idToken);
    } catch {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const userId = decodedToken.uid;
    const body = (await request.json()) as Partial<RequestBody>;
    const turn = (body.turn || '').trim();
    const transformLlmId = (body.transformLlmId || '').trim();
    const transformPrompt = (body.transformPrompt || DEFAULT_TURN_TRANSFORM_PROMPT).trim();

    if (!turn) {
      return NextResponse.json({ error: 'turn is required' }, { status: 400 });
    }
    if (!transformLlmId) {
      return NextResponse.json({ error: 'transformLlmId is required' }, { status: 400 });
    }
    if (!transformPrompt) {
      return NextResponse.json({ error: 'transformPrompt is required' }, { status: 400 });
    }

    const provider = getProviderFromId(transformLlmId);
    if (!provider) {
      return NextResponse.json({ error: `Could not determine provider from model id '${transformLlmId}'` }, { status: 400 });
    }
    if (provider === 'Ollama') {
      return NextResponse.json({ error: 'Ollama turn conversion should be handled client-side' }, { status: 400 });
    }

    const llmInfo = getLLMInfoById(transformLlmId);
    if (!llmInfo) {
      return NextResponse.json({ error: `Unknown model id '${transformLlmId}'` }, { status: 400 });
    }

    const userDoc = await dbAdmin.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const apiSecretVersions = (userDoc.data()?.apiSecretVersions || {}) as Record<string, string>;
    const secretVersionName = apiSecretVersions[llmInfo.apiKeySecretName];
    if (!secretVersionName) {
      return NextResponse.json({ error: `API key reference for ${provider} not found in settings.` }, { status: 404 });
    }

    const apiKey = await getApiKeyFromSecret(secretVersionName);
    if (!apiKey) {
      return NextResponse.json({ error: `Could not load API key for ${provider}` }, { status: 500 });
    }

    let model: BaseChatModel;
    if (provider === 'Mistral AI') {
      model = new ChatMistralAI({ apiKey, modelName: transformLlmId, temperature: 0.3 });
    } else {
      return NextResponse.json({ error: `Turn conversion not supported yet for provider '${provider}'` }, { status: 400 });
    }

    const systemMessage = transformPrompt.replace(/\{turn\}/g, turn);
    const messages = [
      new SystemMessage({ content: systemMessage }),
      new HumanMessage({ content: turn }),
    ];

    const result = await model.invoke(messages as BaseLanguageModelInput);
    const presentationContent = extractText(result).trim();

    if (!presentationContent) {
      return NextResponse.json({ error: 'Transform model returned empty response' }, { status: 500 });
    }

    return NextResponse.json({ presentationContent }, { status: 200 });
  } catch (error) {
    console.error('[turn-transform] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
