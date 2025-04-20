// src/app/api/conversation/start/route.ts
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Firebase Admin, Auth, Firestore, Secret Manager Setup
import { initializeApp, getApps, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, Firestore, FieldValue } from 'firebase-admin/firestore'; // Import FieldValue
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// LangChain Imports
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// --- Import LLM Info Helper ---
// FIX: Use the path alias which should be configured in tsconfig.json
import { getLLMInfoById, LLMInfo } from '@/lib/models';

// --- Initialize Services (Keep your existing robust initialization logic) ---
let firebaseAdminApp: App | null = null;
let dbAdmin: Firestore | null = null;
let secretManagerClient: SecretManagerServiceClient | null = null;

function initializeServices() {
    // --- PASTE YOUR EXISTING initializeServices() function here ---
    // (Ensure it initializes firebaseAdminApp, dbAdmin, secretManagerClient)
     if (getApps().length > 0) {
        if (!firebaseAdminApp) firebaseAdminApp = getApps()[0];
        if (!dbAdmin) dbAdmin = getFirestore(firebaseAdminApp);
        // Secret Manager client might need careful handling in serverless envs
        if (!secretManagerClient) {
             console.warn("Attempting to initialize Secret Manager Client (might already exist).");
             try {
                 secretManagerClient = new SecretManagerServiceClient();
             } catch (error) {
                  console.error("Failed to initialize Secret Manager Client:", error);
                  secretManagerClient = null; // Ensure it's null on failure
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
        // Safely parse JSON
        let serviceAccount: ServiceAccount;
        try {
             serviceAccount = JSON.parse(serviceAccountJson);
        } catch (parseError) {
             console.error("JSON PARSE ERROR:", parseError);
             console.error("String that failed to parse:", serviceAccountJson);
             throw new Error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON.");
        }
        // Format private key
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawPrivateKey = (serviceAccount as any).private_key;
        if (typeof rawPrivateKey === 'string') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (serviceAccount as any).private_key = rawPrivateKey.replace(/\\n/g, '\n');
        } else {
             throw new Error("Parsed service account key 'private_key' is not a string.");
        }
        // Validate essential fields
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!serviceAccount || !(serviceAccount as any).client_email || !(serviceAccount as any).private_key || !(serviceAccount as any).project_id) {
            console.error("Parsed service account key missing required fields.");
            throw new Error("Parsed service account key is missing required fields after processing.");
        }

        firebaseAdminApp = initializeApp({ credential: cert(serviceAccount) });
        console.log("Firebase Admin SDK Initialized.");
        dbAdmin = getFirestore(firebaseAdminApp);

        secretManagerClient = new SecretManagerServiceClient({
            credentials: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                client_email: (serviceAccount as any).client_email,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                private_key: (serviceAccount as any).private_key
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            projectId: (serviceAccount as any).project_id
        });
        console.log("Secret Manager Client Initialized.");

    } catch (error) {
        console.error("Failed to initialize services:", error);
        // Ensure services are null if init fails
        firebaseAdminApp = null;
        dbAdmin = null;
        secretManagerClient = null;
    }
}
initializeServices();

// --- getApiKeyFromSecret Helper (Keep your existing robust helper) ---
async function getApiKeyFromSecret(secretVersionName: string): Promise<string | null> {
    // --- PASTE YOUR EXISTING getApiKeyFromSecret() function here ---
     if (!secretManagerClient) {
        console.error("Secret Manager Client not available when trying to get secret.");
         initializeServices(); // Attempt re-initialization
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
        const payloadData = version.payload?.data;
        if (!payloadData) {
            console.warn(`Secret version ${secretVersionName} payload is empty.`);
            return null;
        }
        // Handle string or Uint8Array explicitly
        let apiKey: string;
        if (typeof payloadData === "string") {
            apiKey = payloadData;
        } else if (payloadData instanceof Uint8Array) {
            apiKey = Buffer.from(payloadData).toString("utf8");
        } else {
            console.error(`Unexpected type for secret payload: ${typeof payloadData}`);
            return null;
        }
        return apiKey;
    } catch (error) {
        console.error(`Failed to access secret version ${secretVersionName}:`, error);
        return null;
    }
}

// --- Request Body Interface (receives backend IDs now) ---
interface StartConversationRequest {
    agentA_llm: string; // e.g., 'gpt-4o'
    agentB_llm: string; // e.g., 'gemini-1.5-pro-latest'
}

// --- REMOVED getModelName function ---

export async function POST(request: NextRequest) {
    console.log("API route /api/conversation/start hit");

    // Check service initialization
    if (!dbAdmin || !firebaseAdminApp || !secretManagerClient) {
         console.error("Services not initialized at start of POST handler.");
         initializeServices(); // Attempt re-init
         if (!dbAdmin || !firebaseAdminApp || !secretManagerClient) {
            console.error("Re-initialization failed again. Services unavailable.");
            return NextResponse.json({ error: 'Server configuration error - services not initialized' }, { status: 500 });
         }
         console.log("Services successfully re-initialized within POST handler.");
    }

    try {
        // 1. Verify Firebase ID Token (Keep existing logic)
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

        // 2. Parse Request Body (Receives backend IDs now)
        let requestBody: StartConversationRequest;
        try {
            requestBody = await request.json();
        } catch (e) {
            console.error("Error parsing request body:", e);
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }
        // These are now backend IDs like 'gpt-4o'
        const { agentA_llm, agentB_llm } = requestBody;
        if (!agentA_llm || !agentB_llm) {
            return NextResponse.json({ error: 'Missing agent LLM selections' }, { status: 400 });
        }
        console.log(`Received LLM selections: AgentA=${agentA_llm}, AgentB=${agentB_llm}`);

        // 3. Get LLM Info and Required Key Names using the received backend IDs
        const agentALLMInfo = getLLMInfoById(agentA_llm);
        const agentBLLMInfo = getLLMInfoById(agentB_llm);

        // Validate that the received IDs correspond to known models
        if (!agentALLMInfo || !agentBLLMInfo) {
            console.error(`Invalid model ID received: A=${agentA_llm}, B=${agentB_llm}`);
            return NextResponse.json({ error: 'Invalid LLM selection provided' }, { status: 400 });
        }

        // Determine the Firestore key ID ('openai', 'google_ai') based on provider for lookup
        // This assumes your ApiKeyManager saves keys under these IDs in the user doc
        const agentARequiredKey = agentALLMInfo.provider === 'OpenAI' ? 'openai' : (agentALLMInfo.provider === 'Google' ? 'google_ai' : null); // Add other providers if needed
        const agentBRequiredKey = agentBLLMInfo.provider === 'OpenAI' ? 'openai' : (agentBLLMInfo.provider === 'Google' ? 'google_ai' : null); // Add other providers if needed

        if (!agentARequiredKey || !agentBRequiredKey) {
             console.error(`Could not map provider to Firestore key ID: A=${agentALLMInfo.provider}, B=${agentBLLMInfo.provider}`);
             return NextResponse.json({ error: 'Internal configuration error mapping provider to key ID.' }, { status: 500 });
        }

        // 4. Fetch Secret Version Names from Firestore using 'openai'/'google_ai' keys
        let agentASecretVersion: string | null = null;
        let agentBSecretVersion: string | null = null;
        let userApiSecretVersions: Record<string, string> = {}; // Store all versions for conversation doc
        try {
            const userDocRef = dbAdmin.collection('users').doc(userId);
            const userDocSnap = await userDocRef.get();
            if (!userDocSnap.exists) {
                console.error(`User profile not found for userId: ${userId}`);
                return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
            }
            userApiSecretVersions = userDocSnap.data()?.apiSecretVersions || {}; // Get the whole map
            agentASecretVersion = userApiSecretVersions[agentARequiredKey] || null; // Lookup using 'openai'/'google_ai'
            agentBSecretVersion = userApiSecretVersions[agentBRequiredKey] || null;

            // Check if the required secret versions were found in the user's document
            if (!agentASecretVersion) {
                console.error(`Missing secret version name for key type '${agentARequiredKey}' for user ${userId}`);
                return NextResponse.json({ error: `API key reference for ${agentALLMInfo.provider} not found in settings.` }, { status: 404 });
            }
             if (!agentBSecretVersion) {
                console.error(`Missing secret version name for key type '${agentBRequiredKey}' for user ${userId}`);
                return NextResponse.json({ error: `API key reference for ${agentBLLMInfo.provider} not found in settings.` }, { status: 404 });
            }
            console.log(`Found secret versions: A=${agentASecretVersion}, B=${agentBSecretVersion}`);

        } catch (firestoreError) {
            console.error(`Firestore error fetching secret versions for user ${userId}:`, firestoreError);
            return NextResponse.json({ error: 'Error retrieving API key configuration.' }, { status: 500 });
        }

        // 5. Retrieve Actual API Keys from Secret Manager (Keep existing logic)
        const apiKeyA = await getApiKeyFromSecret(agentASecretVersion);
        const apiKeyB = (agentASecretVersion === agentBSecretVersion) ? apiKeyA : await getApiKeyFromSecret(agentBSecretVersion);

        if (!apiKeyA || !apiKeyB) {
            console.error(`Failed to retrieve API keys from Secret Manager. Key A found: ${!!apiKeyA}, Key B found: ${!!apiKeyB}`);
            return NextResponse.json({ error: 'Failed to retrieve one or more API keys from secure storage.' }, { status: 500 });
        }
        console.log("API Keys retrieved successfully.");

        // 6. Initialize LangChain Models for Validation (using direct backend IDs)
        try {
             // No translation needed - agentA_llm IS the backend ID now
             console.log(`Initializing Agent A: ${agentALLMInfo.provider} with model ${agentA_llm}`);
             if (agentALLMInfo.provider === 'OpenAI') {
                 // Attempt initialization to validate key/model combo
                 new ChatOpenAI({ apiKey: apiKeyA, modelName: agentA_llm });
             } else if (agentALLMInfo.provider === 'Google') {
                 // Attempt initialization to validate key/model combo
                 new ChatGoogleGenerativeAI({ apiKey: apiKeyA, model: agentA_llm });
             } else {
                 // Add other providers if needed
                 throw new Error(`Unsupported provider for Agent A: ${agentALLMInfo.provider}`);
             }

             console.log(`Initializing Agent B: ${agentBLLMInfo.provider} with model ${agentB_llm}`);
             if (agentBLLMInfo.provider === 'OpenAI') {
                 new ChatOpenAI({ apiKey: apiKeyB, modelName: agentB_llm });
             } else if (agentBLLMInfo.provider === 'Google') {
                 new ChatGoogleGenerativeAI({ apiKey: apiKeyB, model: agentB_llm });
             } else {
                  // Add other providers if needed
                 throw new Error(`Unsupported provider for Agent B: ${agentBLLMInfo.provider}`);
             }
             console.log("LangChain models initialized successfully for validation.");

        } catch (initError) {
             console.error("Error initializing LangChain models:", initError);
             // Provide a more specific error if possible
             const errorDetail = initError instanceof Error ? initError.message : 'Unknown initialization error';
             return NextResponse.json({ error: `Failed to validate AI models/keys: ${errorDetail}` }, { status: 500 });
        }

        // 7. Create Conversation Document in Firestore
        try {
            const newConversationRef = dbAdmin.collection('conversations').doc(); // Auto-generate ID
            const conversationId = newConversationRef.id;
            const conversationData = {
                userId: userId,
                agentA_llm: agentA_llm, // Save backend ID
                agentB_llm: agentB_llm, // Save backend ID
                turn: "agentA", // Agent A starts by default
                status: "running", // Initial status
                // Save the map of ALL secret versions fetched from user doc
                // The Cloud Function will use this map and the provider to get the right version name
                apiSecretVersions: userApiSecretVersions,
                createdAt: FieldValue.serverTimestamp(),
                lastActivity: FieldValue.serverTimestamp(),
            };

            // Set the data for the new conversation document
            await newConversationRef.set(conversationData);
            console.log(`Created conversation document: ${conversationId}`);

            // Add initial system message to trigger the Cloud Function
            // You might want to make this configurable or pass from frontend
            const initialPrompt = "Start the conversation.";
            await newConversationRef.collection('messages').add({
                role: "system",
                content: initialPrompt,
                timestamp: FieldValue.serverTimestamp(),
            });
             console.log(`Added initial system message for conversation: ${conversationId}`);

             // Return success with the new conversation ID
             return NextResponse.json({
                 message: "Conversation created successfully.",
                 conversationId: conversationId, // Send back the ID
                 config: { agentA_llm, agentB_llm } // Echo back the config used
             }, { status: 200 });

        } catch (firestoreError) {
             console.error(`Error creating conversation document or initial message for user ${userId}:`, firestoreError);
             return NextResponse.json({ error: 'Error initializing conversation.' }, { status: 500 });
        }

    } catch (error) {
        console.error("Unhandled error in /api/conversation/start:", error);
        return NextResponse.json({ error: 'Internal server error during session start' }, { status: 500 });
    }
}
