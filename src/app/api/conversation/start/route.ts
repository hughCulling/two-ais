// src/app/api/conversation/start/route.ts
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// --- Firebase Admin, Auth, Firestore, Secret Manager Setup ---
import { initializeApp, getApps, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// LangChain Imports
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

// --- Initialize Services ---
let firebaseAdminApp: App | null = null;
let dbAdmin: Firestore | null = null;
let secretManagerClient: SecretManagerServiceClient | null = null;

/**
 * Initializes Firebase Admin SDK and Google Cloud Secret Manager client
 * if they haven't been initialized already.
 * Reads the service account key from the FIREBASE_SERVICE_ACCOUNT_KEY environment variable.
 */
function initializeServices() {
    if (getApps().length > 0) {
        if (!firebaseAdminApp) firebaseAdminApp = getApps()[0];
        if (!dbAdmin) dbAdmin = getFirestore(firebaseAdminApp);
        if (!secretManagerClient) {
             console.warn("Secret Manager Client potentially not initialized on subsequent requests.");
             // Attempt re-init only if firebaseAdminApp exists
             if(firebaseAdminApp) {
                 // Clear potentially problematic state before retrying? Maybe not needed.
                 // Let's rely on the check in POST for now.
             }
        }
        return;
    }

    console.log("Attempting to initialize services...");
    try {
        const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (!serviceAccountJson) {
            throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.");
        }

        let serviceAccount: ServiceAccount; // Typed as ServiceAccount (expects camelCase)
        try {
             // Parse the JSON string (contains snake_case keys and escaped \\n in private_key)
             serviceAccount = JSON.parse(serviceAccountJson);
        } catch (parseError) {
             console.error("JSON PARSE ERROR:", parseError);
             console.error("String that failed to parse:", serviceAccountJson);
             throw new Error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON.");
        }

        // --- FIX: Convert escaped newlines \\n back to literal \n in the private_key ---
        // The cert() function and SecretManagerServiceClient need the key with actual newlines.
        // We access/modify using `as any` because the actual key is snake_case.
        const rawPrivateKey = (serviceAccount as any).private_key;
        if (typeof rawPrivateKey !== 'string') {
             throw new Error("Parsed service account key is missing the 'private_key' string property.");
        }
        const privateKeyWithNewlines = rawPrivateKey.replace(/\\n/g, '\n');
        // Assign the corrected key back to the object (using `as any` to satisfy TS)
        (serviceAccount as any).private_key = privateKeyWithNewlines;
        // --- END FIX ---

        // Validate using type assertion `as any` for snake_case keys
        // Now we check the object *after* potentially modifying the private_key
        if (!serviceAccount || !(serviceAccount as any).client_email || !(serviceAccount as any).private_key || !(serviceAccount as any).project_id) {
             console.error("Validation failed: Parsed object missing required snake_case fields (project_id, private_key, client_email). Actual keys:", Object.keys(serviceAccount));
            throw new Error("Parsed service account key is missing required fields after processing.");
        }
        console.log("Parsed service account key validation passed.");

        // Initialize Firebase Admin SDK - cert() needs the object with literal newlines in private_key
        firebaseAdminApp = initializeApp({ credential: cert(serviceAccount) }); // Line 71
        console.log("Firebase Admin SDK Initialized.");

        dbAdmin = getFirestore(firebaseAdminApp);

        // Initialize Secret Manager Client - It also needs the key with literal newlines
        secretManagerClient = new SecretManagerServiceClient({
            credentials: {
                client_email: (serviceAccount as any).client_email, // Use snake_case via `as any`
                private_key: (serviceAccount as any).private_key  // Use the already corrected key
            },
            projectId: (serviceAccount as any).project_id // Use snake_case via `as any`
        });
        console.log("Secret Manager Client Initialized.");

    } catch (error) {
        console.error("Failed to initialize services:", error);
        firebaseAdminApp = null;
        dbAdmin = null;
        secretManagerClient = null;
    }
}

// Initialize services when the module loads
initializeServices();

/**
 * Retrieves an API key from Google Cloud Secret Manager.
 */
async function getApiKeyFromSecret(secretVersionName: string): Promise<string | null> {
    if (!secretManagerClient) {
        console.error("Secret Manager Client not available when trying to get secret.");
         initializeServices();
         if (!secretManagerClient) {
             console.error("Re-initialization failed, Secret Manager Client still not available.");
             return null;
         }
         console.log("Secret Manager Client re-initialized successfully in getApiKeyFromSecret.");
    }

    if (!secretVersionName) {
        console.warn("getApiKeyFromSecret called with empty secretVersionName.");
        return null;
    }
    try {
        const [version] = await secretManagerClient.accessSecretVersion({ name: secretVersionName });
        if (!version.payload?.data) {
            console.warn(`Secret version ${secretVersionName} payload is empty.`);
            return null;
        }
        return version.payload.data.toString();
    } catch (error) {
        console.error(`Failed to access secret version ${secretVersionName}:`, error);
        return null;
    }
}

interface StartConversationRequest {
    agentA_llm: string;
    agentB_llm: string;
}

const getModelName = (frontendValue: string): string => {
    switch (frontendValue) {
        case 'openai_gpt4o': return 'gpt-4o';
        case 'openai_gpt35': return 'gpt-3.5-turbo';
        case 'google_gemini15pro': return 'gemini-1.5-pro-latest';
        case 'google_gemini10pro': return 'gemini-1.0-pro';
        default: throw new Error(`Unknown LLM selection: ${frontendValue}`);
    }
};

export async function POST(request: NextRequest) {
    console.log("API route /api/conversation/start hit");

    if (!dbAdmin || !firebaseAdminApp || !secretManagerClient) {
         console.error("Services not initialized at start of POST handler. Initialization might have failed.");
         return NextResponse.json({ error: 'Server configuration error - services not initialized' }, { status: 500 });
    }

    try {
        // 1. Verify Firebase ID Token
        const authorization = request.headers.get('Authorization');
        if (!authorization?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized: Missing Bearer token' }, { status: 401 });
        }
        const idToken = authorization.split('Bearer ')[1];
        let decodedToken: DecodedIdToken;
        try {
            decodedToken = await getAuth(firebaseAdminApp).verifyIdToken(idToken);
        } catch (error) {
            console.error("Error verifying ID token:", error);
            return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
        }
        const userId = decodedToken.uid;
        console.log(`Authenticated user: ${userId}`);

        // 2. Parse Request Body
        let requestBody: StartConversationRequest;
        try {
            requestBody = await request.json();
        } catch (e) {
            console.error("Error parsing request body:", e);
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }
        const { agentA_llm, agentB_llm } = requestBody;
        if (!agentA_llm || !agentB_llm) {
            return NextResponse.json({ error: 'Missing agent LLM selections' }, { status: 400 });
        }

        // 3. Determine Required API Key Types
        const agentARequiredKey = agentA_llm.startsWith('openai') ? 'openai' : (agentA_llm.startsWith('google') ? 'google_ai' : null);
        const agentBRequiredKey = agentB_llm.startsWith('openai') ? 'openai' : (agentB_llm.startsWith('google') ? 'google_ai' : null);
        if (!agentARequiredKey || !agentBRequiredKey) {
            return NextResponse.json({ error: 'Invalid LLM selection provided' }, { status: 400 });
        }

        // 4. Fetch Secret Version Names from Firestore
        let agentASecretVersion: string | null = null;
        let agentBSecretVersion: string | null = null;
        try {
            const userDocRef = dbAdmin.collection('users').doc(userId);
            const userDocSnap = await userDocRef.get();
            if (!userDocSnap.exists) {
                console.error(`User profile not found for userId: ${userId}`);
                return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
            }
            const secretVersions = userDocSnap.data()?.apiSecretVersions || {};
            agentASecretVersion = secretVersions[agentARequiredKey] || null;
            agentBSecretVersion = secretVersions[agentBRequiredKey] || null;

            if (!agentASecretVersion) {
                console.error(`Missing secret version name for key type '${agentARequiredKey}' for user ${userId}`);
                return NextResponse.json({ error: `API key reference for ${agentARequiredKey} not found.` }, { status: 404 });
            }
             if (!agentBSecretVersion) {
                console.error(`Missing secret version name for key type '${agentBRequiredKey}' for user ${userId}`);
                return NextResponse.json({ error: `API key reference for ${agentBRequiredKey} not found.` }, { status: 404 });
            }
            console.log(`Found secret versions: A=${agentASecretVersion}, B=${agentBSecretVersion}`);

        } catch (firestoreError) {
            console.error(`Firestore error fetching secret versions for user ${userId}:`, firestoreError);
            return NextResponse.json({ error: 'Error retrieving API key configuration.' }, { status: 500 });
        }

        // 5. Retrieve Actual API Keys from Secret Manager
        const apiKeyA = await getApiKeyFromSecret(agentASecretVersion);
        const apiKeyB = (agentASecretVersion === agentBSecretVersion) ? apiKeyA : await getApiKeyFromSecret(agentBSecretVersion);

        if (!apiKeyA || !apiKeyB) {
            console.error(`Failed to retrieve API keys from Secret Manager. Key A found: ${!!apiKeyA}, Key B found: ${!!apiKeyB}`);
            return NextResponse.json({ error: 'Failed to retrieve one or more API keys from secure storage.' }, { status: 500 });
        }
        console.log("API Keys retrieved successfully.");

        // 6. Initialize LangChain Models
        let llmA: BaseChatModel;
        let llmB: BaseChatModel;
        try {
             const modelNameA = getModelName(agentA_llm);
             const modelNameB = getModelName(agentB_llm);

             console.log(`Initializing Agent A: ${agentARequiredKey} with model ${modelNameA}`);
             if (agentARequiredKey === 'openai') {
                 llmA = new ChatOpenAI({ apiKey: apiKeyA, modelName: modelNameA });
             } else if (agentARequiredKey === 'google_ai') {
                 llmA = new ChatGoogleGenerativeAI({ apiKey: apiKeyA, model: modelNameA });
             } else {
                 throw new Error(`Unsupported provider for Agent A: ${agentARequiredKey}`);
             }

             console.log(`Initializing Agent B: ${agentBRequiredKey} with model ${modelNameB}`);
             if (agentBRequiredKey === 'openai') {
                 llmB = new ChatOpenAI({ apiKey: apiKeyB, modelName: modelNameB });
             } else if (agentBRequiredKey === 'google_ai') {
                 llmB = new ChatGoogleGenerativeAI({ apiKey: apiKeyB, model: modelNameB });
             } else {
                 throw new Error(`Unsupported provider for Agent B: ${agentBRequiredKey}`);
             }
             console.log("LangChain models initialized successfully.");

        } catch (initError) {
             console.error("Error initializing LangChain models:", initError);
             return NextResponse.json({ error: `Failed to initialize AI models: ${initError instanceof Error ? initError.message : 'Unknown error'}` }, { status: 500 });
        }

        // 7. TODO: Setup LangChain Conversation Logic
        console.log("LangChain conversation logic would go here, using llmA and llmB.");

        // --- Return Success (Placeholder for now) ---
        return NextResponse.json({
            message: "Session setup ready. Models initialized.",
            config: { agentA_llm, agentB_llm }
        }, { status: 200 });

    } catch (error) {
        console.error("Unhandled error in /api/conversation/start:", error);
        return NextResponse.json({ error: 'Internal server error during session start' }, { status: 500 });
    }
}
