// src/app/api/conversation/start/route.ts
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Firebase Admin, Auth, Firestore, Secret Manager Setup
import { initializeApp, getApps, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, Firestore, FieldValue } from 'firebase-admin/firestore'; // No getDoc needed for Admin SDK
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// LangChain Imports
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatXAI } from "@langchain/xai";
import { ChatGroq } from "@langchain/groq";
// --- Added TogetherAI Import ---
import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";
// --- End Added TogetherAI Import ---

// --- Import LLM Info Helper ---
import { getLLMInfoById } from '@/lib/models'; // Use path alias

// --- Initialize Services (Keep existing logic) ---
let firebaseAdminApp: App | null = null;
let dbAdmin: Firestore | null = null;
let secretManagerClient: SecretManagerServiceClient | null = null;

function initializeServices() {
    // Check if services are already initialized to avoid re-initialization
     if (getApps().length > 0) {
        if (!firebaseAdminApp) firebaseAdminApp = getApps()[0];
        if (!dbAdmin) dbAdmin = getFirestore(firebaseAdminApp);
        if (!secretManagerClient) {
             console.warn("API Route: Attempting to initialize Secret Manager Client (might already exist).");
             try {
                 secretManagerClient = new SecretManagerServiceClient();
             } catch (error) {
                  console.error("API Route: Failed to initialize Secret Manager Client:", error);
                  secretManagerClient = null;
             }
        }
        return;
    }
    console.log("API Route: Attempting to initialize services...");
    try {
        const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (!serviceAccountJson) throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.");
        let serviceAccount: ServiceAccount;
        try {
             serviceAccount = JSON.parse(serviceAccountJson);
        } catch (parseError) {
             console.error("API Route: JSON PARSE ERROR:", parseError);
             throw new Error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON.");
        }
        // Handle escaped newlines in private key if necessary
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawPrivateKey = (serviceAccount as any).private_key;
        if (typeof rawPrivateKey === 'string') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (serviceAccount as any).private_key = rawPrivateKey.replace(/\\n/g, '\n');
        } else {
             throw new Error("Parsed service account key 'private_key' is not a string.");
        }
        // Basic validation of parsed key
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!serviceAccount || !(serviceAccount as any).client_email || !(serviceAccount as any).private_key || !(serviceAccount as any).project_id) {
            throw new Error("Parsed service account key is missing required fields after processing.");
        }
        // Initialize Firebase Admin
        firebaseAdminApp = initializeApp({ credential: cert(serviceAccount) });
        console.log("API Route: Firebase Admin SDK Initialized.");
        // Initialize Firestore
        dbAdmin = getFirestore(firebaseAdminApp);
        // Initialize Secret Manager Client
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
        console.log("API Route: Secret Manager Client Initialized.");
    } catch (error) {
        console.error("API Route: Failed to initialize services:", error);
        // Ensure services are null if initialization fails
        firebaseAdminApp = null;
        dbAdmin = null;
        secretManagerClient = null;
    }
}
// Initialize services when the module loads
initializeServices();


// --- getApiKeyFromSecret Helper (Keep existing logic) ---
async function getApiKeyFromSecret(secretVersionName: string): Promise<string | null> {
     // Check if client is available, attempt re-initialization if not
     if (!secretManagerClient) {
        console.error("API Route: Secret Manager Client not available when trying to get secret.");
         initializeServices(); // Attempt to re-initialize
         if (!secretManagerClient) {
             console.error("API Route: Re-initialization failed, Secret Manager Client still not available.");
             return null; // Still failed, return null
         }
         console.log("API Route: Secret Manager Client re-initialized successfully in getApiKeyFromSecret.");
    }
    // Validate input
    if (!secretVersionName) {
        console.warn("API Route: getApiKeyFromSecret called with empty secretVersionName.");
        return null;
    }
    try {
        // Access the secret version
        const [version] = await secretManagerClient.accessSecretVersion({ name: secretVersionName });
        const payloadData = version.payload?.data;
        // Check if payload exists
        if (!payloadData) {
            console.warn(`API Route: Secret version ${secretVersionName} payload is empty.`);
            return null;
        }
        // Decode the payload
        let apiKey: string;
        if (typeof payloadData === "string") {
            apiKey = payloadData; // Already a string
        } else if (payloadData instanceof Uint8Array) {
            apiKey = Buffer.from(payloadData).toString("utf8"); // Decode from buffer
        } else {
            // Handle unexpected payload type
            console.error(`API Route: Unexpected type for secret payload: ${typeof payloadData}`);
            return null;
        }
        return apiKey;
    } catch (error) {
        // Log errors during secret access
        console.error(`API Route: Failed to access secret version ${secretVersionName}:`, error);
        return null;
    }
}

// --- Define TTS Types (Mirroring frontend) ---
const AVAILABLE_TTS_PROVIDERS = [
    { id: 'none', name: 'None' }, // Added name for consistency
    { id: 'browser', name: 'Browser Built-in' },
    { id: 'openai', name: 'OpenAI TTS' },
    // Add other providers like google, elevenlabs if they are defined in tts_models.ts
] as const;
type TTSProviderId = typeof AVAILABLE_TTS_PROVIDERS[number]['id'];
interface AgentTTSSettings {
    provider: TTSProviderId;
    voice: string | null;
    // No apiKey field needed here as keys are handled via LLM provider mapping or dedicated keys
}

// --- Updated Request Body Interface ---
// Now includes the full SessionConfig structure from the frontend
interface StartConversationRequest {
    agentA_llm: string;
    agentB_llm: string;
    ttsEnabled: boolean;
    agentA_tts: AgentTTSSettings;
    agentB_tts: AgentTTSSettings;
}

// --- POST Handler ---
export async function POST(request: NextRequest) {
    console.log("API route /api/conversation/start hit");

    // --- Service Initialization Check ---
    if (!dbAdmin || !firebaseAdminApp || !secretManagerClient) {
         console.error("API Route: Services not initialized at start of POST handler.");
         initializeServices(); // Attempt re-initialization
         if (!dbAdmin || !firebaseAdminApp || !secretManagerClient) {
            // If still not initialized, return server error
            console.error("API Route: Re-initialization failed again. Services unavailable.");
            return NextResponse.json({ error: "Server configuration error - services not initialized" }, { status: 500 });
         }
         console.log("API Route: Services successfully re-initialized within POST handler.");
    }

    try {
        // 1. Verify Firebase ID Token
        const authorization = request.headers.get("Authorization");
        if (!authorization?.startsWith("Bearer ")) {
            console.warn("API Route: Unauthorized - Missing Bearer token");
            return NextResponse.json({ error: "Unauthorized: Missing Bearer token" }, { status: 401 });
        }
        const idToken = authorization.split("Bearer ")[1];
        let decodedToken: DecodedIdToken;
        try {
            // Verify the token using Firebase Admin SDK
            decodedToken = await getAuth(firebaseAdminApp).verifyIdToken(idToken);
        } catch (error) {
            console.error("API Route: Error verifying ID token:", error);
            return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
        }
        const userId = decodedToken.uid;
        console.log(`API Route: Authenticated user: ${userId}`);

        // 2. Parse Request Body
        let requestBody: StartConversationRequest;
        try {
            requestBody = await request.json();
        } catch (e) {
            console.error("API Route: Error parsing request body:", e);
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }
        // Destructure all expected fields
        const { agentA_llm, agentB_llm, ttsEnabled, agentA_tts, agentB_tts } = requestBody;
        // Basic validation for required fields
        if (!agentA_llm || !agentB_llm || typeof ttsEnabled !== 'boolean' || !agentA_tts || !agentB_tts) {
            console.warn("API Route: Missing required configuration fields in request body.");
            return NextResponse.json({ error: "Missing required configuration fields (LLMs or TTS settings)" }, { status: 400 });
        }
         // Validate TTS provider IDs
         if (!AVAILABLE_TTS_PROVIDERS.some(p => p.id === agentA_tts.provider) || !AVAILABLE_TTS_PROVIDERS.some(p => p.id === agentB_tts.provider)) {
             console.warn(`API Route: Invalid TTS provider specified: A=${agentA_tts.provider}, B=${agentB_tts.provider}`);
             return NextResponse.json({ error: "Invalid TTS provider specified" }, { status: 400 });
         }
        console.log(`API Route: Received Full Config: AgentA=${agentA_llm}, AgentB=${agentB_llm}, TTS Enabled=${ttsEnabled}, AgentA TTS=${agentA_tts.provider}, AgentB TTS=${agentB_tts.provider}`);

        // 3. Get LLM Info and Required Key Names
        const agentALLMInfo = getLLMInfoById(agentA_llm);
        const agentBLLMInfo = getLLMInfoById(agentB_llm);

        // --- Added Debug Logging ---
        console.log(`API Route: Agent A LLM ID received: ${agentA_llm}`);
        console.log(`API Route: Agent A LLM Info found:`, agentALLMInfo); // Log the whole object
        console.log(`API Route: Agent B LLM ID received: ${agentB_llm}`);
        console.log(`API Route: Agent B LLM Info found:`, agentBLLMInfo); // Log the whole object
        // --- End Debug Logging ---

        // Check if model info was found
        if (!agentALLMInfo || !agentBLLMInfo) {
            console.error(`API Route: Invalid model ID received: A=${agentA_llm}, B=${agentB_llm}. Could not find info in models.ts.`);
            return NextResponse.json({ error: "Invalid LLM selection provided" }, { status: 400 });
        }

        // --- Get the required secret key name directly from the model info ---
        const agentARequiredKey = agentALLMInfo.apiKeySecretName;
        const agentBRequiredKey = agentBLLMInfo.apiKeySecretName;
        // --- End Get the required secret key name ---

        // --- Added Debug Logging ---
        console.log(`API Route: Agent A Required Key Name derived: ${agentARequiredKey}`);
        console.log(`API Route: Agent B Required Key Name derived: ${agentBRequiredKey}`);
        // --- End Debug Logging ---

        // Check if the key names were found (should always be present if models.ts is correct)
        if (!agentARequiredKey || !agentBRequiredKey) {
             // This log should now only trigger if models.ts is actually missing the apiKeySecretName for a model
             console.error(`API Route: Could not determine required API key secret name for one or both agents: A=${agentARequiredKey} (from provider ${agentALLMInfo.provider}), B=${agentBRequiredKey} (from provider ${agentBLLMInfo.provider})`);
             // Return the specific error message the user saw
             return NextResponse.json({ error: "Internal configuration error mapping provider to key ID." }, { status: 500 });
        }
        console.log(`API Route: Required Keys: Agent A (${agentALLMInfo.provider}) needs '${agentARequiredKey}', Agent B (${agentBLLMInfo.provider}) needs '${agentBRequiredKey}'`);


        // 4. Fetch Secret Version Names from Firestore
        let agentASecretVersion: string | null = null;
        let agentBSecretVersion: string | null = null;
        let userApiSecretVersions: Record<string, string> = {};
        try {
            // --- Make sure dbAdmin is not null before using it ---
            if (!dbAdmin) {
                throw new Error("Firestore Admin instance (dbAdmin) is not initialized.");
            }
            const userDocRef = dbAdmin.collection("users").doc(userId);
            // --- CORRECTED Firestore Fetch using Admin SDK ---
            const userDocSnap = await userDocRef.get();
            // --- END CORRECTION ---
            if (!userDocSnap.exists) {
                // Handle case where user document doesn't exist
                console.error(`API Route: User profile not found for userId: ${userId}`);
                // Depending on requirements, you might create the doc here or return error
                return NextResponse.json({ error: "User profile not found" }, { status: 404 });
            }
            // Get the stored secret versions, default to empty object if missing
            userApiSecretVersions = userDocSnap.data()?.apiSecretVersions || {};
            // Find the specific versions needed for the selected models
            agentASecretVersion = userApiSecretVersions[agentARequiredKey] || null;
            agentBSecretVersion = userApiSecretVersions[agentBRequiredKey] || null;

            // Check if the required secret versions were found in the user's document
            if (!agentASecretVersion) {
                console.error(`API Route: Missing secret version name for key type '${agentARequiredKey}' (Provider: ${agentALLMInfo.provider}) for user ${userId}`);
                return NextResponse.json({ error: `API key reference for ${agentALLMInfo.provider} not found in settings.` }, { status: 404 });
            }
             if (!agentBSecretVersion) {
                console.error(`API Route: Missing secret version name for key type '${agentBRequiredKey}' (Provider: ${agentBLLMInfo.provider}) for user ${userId}`);
                return NextResponse.json({ error: `API key reference for ${agentBLLMInfo.provider} not found in settings.` }, { status: 404 });
            }
            console.log(`API Route: Found secret versions: A=${agentASecretVersion}, B=${agentBSecretVersion}`);
        } catch (firestoreError) {
            console.error(`API Route: Firestore error fetching secret versions for user ${userId}:`, firestoreError);
            return NextResponse.json({ error: "Error retrieving API key configuration." }, { status: 500 });
        }

        // --- Check for external TTS provider keys if needed ---
        // (Keep existing logic or adapt as needed)


        // 5. Retrieve Actual API Keys from Secret Manager
        const apiKeyA = await getApiKeyFromSecret(agentASecretVersion);
        // Optimize: Only fetch Key B if it uses a different secret version than Key A
        const apiKeyB = (agentASecretVersion === agentBSecretVersion) ? apiKeyA : await getApiKeyFromSecret(agentBSecretVersion);

        // Check if keys were successfully retrieved
        if (!apiKeyA || !apiKeyB) {
            console.error(`API Route: Failed to retrieve API keys from Secret Manager. Key A found: ${!!apiKeyA}, Key B found: ${!!apiKeyB}`);
            return NextResponse.json({ error: "Failed to retrieve one or more API keys from secure storage." }, { status: 500 });
        }
        console.log("API Route: API Keys retrieved successfully.");

        // 6. Initialize LangChain Models for Validation
        try {
             console.log(`API Route: Initializing Agent A: ${agentALLMInfo.provider} with model ${agentA_llm}`);
             // Use a switch statement or if/else chain for clarity
             switch (agentALLMInfo.provider) {
                 case "OpenAI": new ChatOpenAI({ apiKey: apiKeyA, modelName: agentA_llm }); break;
                 case "Google": new ChatGoogleGenerativeAI({ apiKey: apiKeyA, model: agentA_llm }); break;
                 case "Anthropic": new ChatAnthropic({ apiKey: apiKeyA, modelName: agentA_llm }); break;
                 case "XAI": new ChatXAI({ apiKey: apiKeyA, model: agentA_llm }); break;
                 case "Groq": new ChatGroq({ apiKey: apiKeyA, model: agentA_llm }); break; // Use model
                 // --- Added TogetherAI ---
                 case "TogetherAI":
                     new ChatTogetherAI({ apiKey: apiKeyA, modelName: agentA_llm }); // Use modelName
                     break;
                 // --- End Added TogetherAI ---
                 default: throw new Error(`Unsupported provider for Agent A: ${agentALLMInfo.provider}`);
             }

             console.log(`API Route: Initializing Agent B: ${agentBLLMInfo.provider} with model ${agentB_llm}`);
             switch (agentBLLMInfo.provider) {
                 case "OpenAI": new ChatOpenAI({ apiKey: apiKeyB, modelName: agentB_llm }); break;
                 case "Google": new ChatGoogleGenerativeAI({ apiKey: apiKeyB, model: agentB_llm }); break;
                 case "Anthropic": new ChatAnthropic({ apiKey: apiKeyB, modelName: agentB_llm }); break;
                 case "XAI": new ChatXAI({ apiKey: apiKeyB, model: agentB_llm }); break;
                 case "Groq": new ChatGroq({ apiKey: apiKeyB, model: agentB_llm }); break; // Use model
                 // --- Added TogetherAI ---
                 case "TogetherAI":
                     new ChatTogetherAI({ apiKey: apiKeyB, modelName: agentB_llm }); // Use modelName
                     break;
                 // --- End Added TogetherAI ---
                 default: throw new Error(`Unsupported provider for Agent B: ${agentBLLMInfo.provider}`);
             }
             console.log("API Route: LangChain models initialized successfully for validation.");
        } catch (initError) {
             // Catch and log errors during model initialization
             console.error("API Route: Error initializing LangChain models:", initError);
             const errorDetail = initError instanceof Error ? initError.message : "Unknown initialization error";
             return NextResponse.json({ error: `Failed to validate AI models/keys: ${errorDetail}` }, { status: 500 });
        }

        // 7. Create Conversation Document in Firestore
        try {
            // --- Make sure dbAdmin is not null before using it ---
            if (!dbAdmin) {
                throw new Error("Firestore Admin instance (dbAdmin) is not initialized.");
            }
            // Reference to a new document in the 'conversations' collection
            const newConversationRef = dbAdmin.collection("conversations").doc();
            const conversationId = newConversationRef.id;

            // Prepare the data for the new conversation document
            const conversationData = {
                userId: userId,
                agentA_llm: agentA_llm,
                agentB_llm: agentB_llm,
                turn: "agentA", // Start with Agent A
                status: "running", // Initial status
                apiSecretVersions: userApiSecretVersions, // Store the map of secret versions used
                createdAt: FieldValue.serverTimestamp(), // Record creation time
                lastActivity: FieldValue.serverTimestamp(), // Record last activity time
                // Include TTS settings in the document
                ttsSettings: {
                    enabled: ttsEnabled,
                    agentA: agentA_tts, // Store { provider, voice }
                    agentB: agentB_tts, // Store { provider, voice }
                }
            };

            // Set the data for the new conversation document
            await newConversationRef.set(conversationData);
            console.log(`API Route: Created conversation document with TTS settings: ${conversationId}`);

            // Add an initial system message to kick off the conversation in the backend
            const initialPrompt = "Start the conversation.";
            await newConversationRef.collection("messages").add({
                role: "system",
                content: initialPrompt,
                timestamp: FieldValue.serverTimestamp(),
            });
             console.log(`API Route: Added initial system message for conversation: ${conversationId}`);

             // Return success response with the new conversation ID
             return NextResponse.json({
                 message: "Conversation created successfully.",
                 conversationId: conversationId,
             }, { status: 200 });

        } catch (firestoreError) {
             // Handle errors during Firestore operations
             console.error(`API Route: Error creating conversation document or initial message for user ${userId}:`, firestoreError);
             return NextResponse.json({ error: "Error initializing conversation." }, { status: 500 });
        }

    } catch (error) {
        // Catch any unexpected errors in the main try block
        console.error("API Route: Unhandled error in /api/conversation/start:", error);
        return NextResponse.json({ error: "Internal server error during session start" }, { status: 500 });
    }
}
