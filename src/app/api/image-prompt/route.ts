// src/app/api/image-prompt/route.ts
// Authenticated API route to generate image prompts using the user's selected cloud LLM

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

type RequestBody = {
  paragraph: string;
  promptLlmId: string;
  promptSystemMessage: string;
};

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawPrivateKey = (serviceAccount as any).private_key;
  if (typeof rawPrivateKey === 'string') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (serviceAccount as any).private_key = rawPrivateKey.replace(/\\n/g, '\n');
  }

  firebaseAdminApp = initializeApp({ credential: cert(serviceAccount) });
  dbAdmin = getFirestore(firebaseAdminApp);
  secretManagerClient = new SecretManagerServiceClient({
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

async function getApiKeyFromSecret(secretVersionName: string): Promise<string | null> {
  if (!secretManagerClient) return null;
  const [version] = await secretManagerClient.accessSecretVersion({ name: secretVersionName });
  const payload = version.payload?.data?.toString();
  return payload || null;
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
    const paragraph = (body.paragraph || '').trim();
    const promptLlmId = (body.promptLlmId || '').trim();
    const promptSystemMessage = (body.promptSystemMessage || '').trim();

    if (!paragraph) {
      return NextResponse.json({ error: 'paragraph is required' }, { status: 400 });
    }
    if (!promptLlmId) {
      return NextResponse.json({ error: 'promptLlmId is required' }, { status: 400 });
    }
    if (!promptSystemMessage) {
      return NextResponse.json({ error: 'promptSystemMessage is required' }, { status: 400 });
    }

    const provider = getProviderFromId(promptLlmId);
    if (!provider) {
      return NextResponse.json({ error: `Could not determine provider from model id '${promptLlmId}'` }, { status: 400 });
    }
    if (provider === 'Ollama') {
      return NextResponse.json({ error: 'Ollama prompt LLM should be handled client-side' }, { status: 400 });
    }

    const llmInfo = getLLMInfoById(promptLlmId);
    if (!llmInfo) {
      return NextResponse.json({ error: `Unknown model id '${promptLlmId}'` }, { status: 400 });
    }

    const userDoc = await dbAdmin.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const apiSecretVersions = (userDoc.data()?.apiSecretVersions || {}) as Record<string, string>;
    const secretKeyId = llmInfo.apiKeySecretName;
    const secretVersionName = apiSecretVersions[secretKeyId];
    if (!secretVersionName) {
      return NextResponse.json({ error: `API key reference for ${provider} not found in settings.` }, { status: 404 });
    }

    const apiKey = await getApiKeyFromSecret(secretVersionName);
    if (!apiKey) {
      return NextResponse.json({ error: `Could not load API key for ${provider}` }, { status: 500 });
    }

    let model: BaseChatModel;
    if (provider === 'Mistral AI') {
      model = new ChatMistralAI({ apiKey, modelName: promptLlmId });
    } else {
      return NextResponse.json({ error: `Cloud prompt generation not supported yet for provider '${provider}'` }, { status: 400 });
    }

    const systemMessage = promptSystemMessage.replace('{paragraph}', paragraph).replace('{turn}', paragraph);
    const messages = [
      new SystemMessage({ content: systemMessage }),
      new HumanMessage({ content: paragraph }),
    ];

    const result = await model.invoke(messages as BaseLanguageModelInput);

    const resultAsUnknown = result as unknown;
    const resultWithContent =
      typeof resultAsUnknown === 'object' && resultAsUnknown !== null && 'content' in resultAsUnknown
        ? (resultAsUnknown as { content: unknown })
        : null;

    const content = typeof result === 'string'
      ? result
      : typeof resultWithContent?.content === 'string'
        ? resultWithContent.content
        : Array.isArray(resultWithContent?.content)
          ? resultWithContent.content
              .map((x: unknown) => (typeof x === 'string' ? x : JSON.stringify(x)))
              .join(' ')
          : '';

    const prompt = (content || '').trim();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt model returned empty response' }, { status: 500 });
    }

    return NextResponse.json({ prompt }, { status: 200 });
  } catch (error) {
    console.error('[image-prompt] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
