// src/app/api/conversation/start/route.ts
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Firebase Admin, Auth, Firestore, Secret Manager Setup
import { initializeApp, getApps, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, Firestore, FieldValue } from 'firebase-admin/firestore';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// LangChain Imports - These were unused in this specific API route
// import { ChatOpenAI } from "@langchain/openai";
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { ChatAnthropic } from "@langchain/anthropic";
// import { ChatXAI } from "@langchain/xai";
// import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";

// --- Import LLM Info Helper ---
import { getLLMInfoById } from '@/lib/models';

// --- Initialize Services (Keep existing logic) ---
let firebaseAdminApp: App | null = null;
let dbAdmin: Firestore | null = null;
let secretManagerClient: SecretManagerServiceClient | null = null;

function initializeServices() {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawPrivateKey = (serviceAccount as any).private_key;
        if (typeof rawPrivateKey === 'string') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (serviceAccount as any).private_key = rawPrivateKey.replace(/\\n/g, '\n');
        } else {
            throw new Error("Parsed service account key 'private_key' is not a string.");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!serviceAccount || !(serviceAccount as any).client_email || !(serviceAccount as any).private_key || !(serviceAccount as any).project_id) {
            throw new Error("Parsed service account key is missing required fields after processing.");
        }
        firebaseAdminApp = initializeApp({ credential: cert(serviceAccount) });
        console.log("API Route: Firebase Admin SDK Initialized.");
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
        console.log("API Route: Secret Manager Client Initialized.");
    } catch (error) {
        console.error("API Route: Failed to initialize services:", error);
        firebaseAdminApp = null;
        dbAdmin = null;
        secretManagerClient = null;
    }
}
initializeServices();


// --- getApiKeyFromSecret Helper was removed as it's unused in this file ---

// --- Define conversation prompts in different languages ---
// const CONVERSATION_PROMPTS: Record<string, string> = {
//     en: "Start the conversation.",
//     ar: "ابدأ المحادثة.",
//     bn: "কথোপকথন শুরু করুন।",
//     bg: "Започнете разговора.",
//     zh: "开始对话。",
//     hr: "Započnite razgovor.",
//     cs: "Zahajte konverzaci.",
//     da: "Start samtalen.",
//     nl: "Start het gesprek.",
//     et: "Alustage vestlust.",
//     fi: "Aloita keskustelu.",
//     fr: "Commencez la conversation.",
//     de: "Beginnen Sie das Gespräch.",
//     el: "Ξεκινήστε τη συνομιλία.",
//     iw: "התחל את השיחה.",
//     hi: "बातचीत शुरू करें।",
//     hu: "Kezdje el a beszélgetést.",
//     id: "Mulai percakapan.",
//     it: "Inizia la conversazione.",
//     ja: "会話を始めてください。",
//     ko: "대화를 시작하세요。",
//     lv: "Sāciet sarunu.",
//     lt: "Pradėkite pokalbį.",
//     no: "Start samtalen.",
//     pl: "Rozpocznij rozmowę.",
//     pt: "Inicie a conversa.",
//     ro: "Începeți conversația.",
//     ru: "Начните разговор.",
//     sr: "Започните разговор.",
//     sk: "Začnite konverzáciu.",
//     sl: "Začnite pogovor.",
//     es: "Comienza la conversación.",
//     sw: "Anza mazungumzo.",
//     sv: "Starta konversationen.",
//     th: "เริ่มการสนทนา",
//     tr: "Konuşmayı başlatın.",
//     uk: "Почніть розмову.",
//     vi: "Bắt đầu cuộc trò chuyện.",
//     mt: "Ibda l-konversazzjoni.",
//     bs: "Započnite razgovor.",
//     ca: "Comença la conversa.",
//     gu: "વાતચીત શરૂ કરો.",
//     hy: "Սկսեք խոսակցությունը:",
//     is: "Byrjaðu samtalið.",
//     ka: "საუბრის დაწყება.",
//     kk: "Әңгімені бастаңыз.",
//     kn: "ಸಂಭಾಷಣೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ.",
//     mk: "Започнете го разговорот.",
//     ml: "സംഭാഷണം ആരംഭിക്കുക.",
//     mr: "संभाषण सुरू करा.",
//     ms: "Mulakan perbualan.",
//     my: "စကားစတင်ပါ။",
//     pa: "ਗੱਲਬਾਤ ਸ਼ੁਰੂ ਕਰੋ।",
//     so: "Bilow wada hadalka.",
//     sq: "Filloni bisedën.",
//     ta: "உரையாடலைத் தொடங்கு.",
//     te: "సంభాషణను ప్రారంభించండి.",
//     tl: "Simulan ang pag-uusap.",
//     ur: "گفتگو شروع کریں۔",
//     am: "ውይይቱን ጀምር።",
//     mn: "Яриаг эхлүүл.",
//     fa: "مکالمه را شروع کنید"
// };

// --- Define TTS Types (Mirroring frontend and backend expectations) ---
const VALID_TTS_PROVIDER_IDS_API = [
    "openai",
    "google-cloud",
    "elevenlabs",
    "google-gemini",
    "none",
    "browser"
] as const;
type TTSProviderIdApi = typeof VALID_TTS_PROVIDER_IDS_API[number];

interface AgentTTSSettingsApi {
    provider: TTSProviderIdApi;
    voice: string | null;
    selectedTtsModelId?: string;
    ttsApiModelId?: string;
}

// --- Updated Request Body Interface ---
interface StartConversationRequest {
    agentA_llm: string;
    agentB_llm: string;
    ttsEnabled: boolean;
    agentA_tts: AgentTTSSettingsApi;
    agentB_tts: AgentTTSSettingsApi;
    language?: string; // Add optional language parameter
    initialSystemPrompt?: string; // <-- Add this line
    ollamaEndpoint?: string; // ngrok URL for remote Ollama access
    imageGenSettings?: {
        enabled: boolean;
        invokeaiEndpoint: string;
        promptLlm: string;
        promptSystemMessage: string;
    };
}

// --- ConversationData type for Firestore documents ---
type ConversationData = {
    userId: string;
    agentA_llm: string;
    agentB_llm: string;
    turn: "agentA" | "agentB";
    status: "running" | "stopped" | "error";
    language: string;
    apiSecretVersions: { [key: string]: string };
    createdAt: FirebaseFirestore.FieldValue;
    lastActivity: FirebaseFirestore.FieldValue;
    errorMessage?: string;
    errorContext?: string;
    ttsSettings: {
        enabled: boolean;
        agentA: {
            provider: string;
            voice: string | null;
            selectedTtsModelId?: string;
            ttsApiModelId?: string;
        };
        agentB: {
            provider: string;
            voice: string | null;
            selectedTtsModelId?: string;
            ttsApiModelId?: string;
        };
    };
    initialSystemPrompt: string;
    ollamaEndpoint?: string;
    imageGenSettings?: {
        enabled: boolean;
        invokeaiEndpoint: string;
        promptLlm: string;
        promptSystemMessage: string;
    };
};

// --- POST Handler ---
export async function POST(request: NextRequest) {
    console.log("API route /api/conversation/start hit");

    if (!dbAdmin || !firebaseAdminApp || !secretManagerClient) {
        console.error("API Route: Services not initialized at start of POST handler.");
        initializeServices();
        if (!dbAdmin || !firebaseAdminApp || !secretManagerClient) {
            console.error("API Route: Re-initialization failed again. Services unavailable.");
            return NextResponse.json({ error: "Server configuration error - services not initialized" }, { status: 500 });
        }
        console.log("API Route: Services successfully re-initialized within POST handler.");
    }

    try {
        const authorization = request.headers.get("Authorization");
        if (!authorization?.startsWith("Bearer ")) {
            console.warn("API Route: Unauthorized - Missing Bearer token");
            return NextResponse.json({ error: "Unauthorized: Missing Bearer token" }, { status: 401 });
        }
        const idToken = authorization.split("Bearer ")[1];
        let decodedToken: DecodedIdToken;
        try {
            decodedToken = await getAuth(firebaseAdminApp).verifyIdToken(idToken);
        } catch (error) {
            console.error("API Route: Error verifying ID token:", error);
            return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
        }
        const userId = decodedToken.uid;
        console.log(`API Route: Authenticated user: ${userId}`);

        let requestBody: StartConversationRequest;
        try {
            requestBody = await request.json();
        } catch (e) {
            console.error("API Route: Error parsing request body:", e);
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }
        const { agentA_llm, agentB_llm, ttsEnabled, agentA_tts, agentB_tts, language = 'en', initialSystemPrompt = '', ollamaEndpoint, imageGenSettings } = requestBody;

        if (!agentA_llm || !agentB_llm || typeof ttsEnabled !== 'boolean' || !agentA_tts || !agentB_tts) {
            console.warn("API Route: Missing required configuration fields in request body.");
            return NextResponse.json({ error: "Missing required configuration fields (LLMs or TTS settings)" }, { status: 400 });
        }

        if (!VALID_TTS_PROVIDER_IDS_API.includes(agentA_tts.provider) || !VALID_TTS_PROVIDER_IDS_API.includes(agentB_tts.provider)) {
            console.warn(`API Route: Invalid TTS provider specified: AgentA=${agentA_tts.provider}, AgentB=${agentB_tts.provider}`);
            return NextResponse.json({ error: "Invalid TTS provider specified" }, { status: 400 });
        }

        if (ttsEnabled) {
            const validateAgentTtsApi = (settings: AgentTTSSettingsApi, agentName: string): string | null => {
                if (settings.provider !== "none") {
                    if (!settings.selectedTtsModelId) {
                        return `Missing TTS model selection for ${agentName} (${settings.provider}).`;
                    }
                    if (!settings.voice) {
                        return `Missing TTS voice selection for ${agentName} (${settings.provider}).`;
                    }
                }
                return null;
            };
            const agentAErr = validateAgentTtsApi(agentA_tts, "Agent A");
            if (agentAErr) return NextResponse.json({ error: agentAErr }, { status: 400 });
            const agentBErr = validateAgentTtsApi(agentB_tts, "Agent B");
            if (agentBErr) return NextResponse.json({ error: agentBErr }, { status: 400 });
        }

        console.log(`API Route: Received Full Config: AgentA=${agentA_llm}, AgentB=${agentB_llm}, TTS Enabled=${ttsEnabled}, AgentA TTS Prov=${agentA_tts.provider}, Model=${agentA_tts.selectedTtsModelId}, Voice=${agentA_tts.voice}, AgentB TTS Prov=${agentB_tts.provider}, Model=${agentB_tts.selectedTtsModelId}, Voice=${agentB_tts.voice}, Language=${language}`);

        // Get LLM info, handling Ollama models specially (they're loaded dynamically on client)
        let agentALLMInfo = getLLMInfoById(agentA_llm);
        let agentBLLMInfo = getLLMInfoById(agentB_llm);

        // If model ID starts with "ollama:", create a synthetic LLMInfo for it
        if (!agentALLMInfo && agentA_llm.startsWith('ollama:')) {
            agentALLMInfo = {
                id: agentA_llm,
                name: agentA_llm.replace('ollama:', ''),
                provider: 'Ollama',
                contextWindow: 0,
                pricing: { input: 0, output: 0, freeTier: { available: true, note: 'Local model' } },
                apiKeyInstructionsUrl: 'https://ollama.com',
                apiKeySecretName: 'ollama',
                status: 'stable',
                isOllamaModel: true,
            };
        }
        if (!agentBLLMInfo && agentB_llm.startsWith('ollama:')) {
            agentBLLMInfo = {
                id: agentB_llm,
                name: agentB_llm.replace('ollama:', ''),
                provider: 'Ollama',
                contextWindow: 0,
                pricing: { input: 0, output: 0, freeTier: { available: true, note: 'Local model' } },
                apiKeyInstructionsUrl: 'https://ollama.com',
                apiKeySecretName: 'ollama',
                status: 'stable',
                isOllamaModel: true,
            };
        }

        if (!agentALLMInfo || !agentBLLMInfo) {
            console.error(`API Route: Invalid model ID received: A=${agentA_llm}, B=${agentB_llm}. Could not find info in models.ts.`);
            return NextResponse.json({ error: "Invalid LLM selection provided" }, { status: 400 });
        }

        const agentARequiredKey = agentALLMInfo.apiKeySecretName;
        const agentBRequiredKey = agentBLLMInfo.apiKeySecretName;

        if (!agentARequiredKey || !agentBRequiredKey) {
            console.error(`API Route: Could not determine required API key secret name for one or both agents: A=${agentARequiredKey} (from provider ${agentALLMInfo.provider}), B=${agentBRequiredKey} (from provider ${agentBLLMInfo.provider})`);
            return NextResponse.json({ error: "Internal configuration error mapping provider to key ID." }, { status: 500 });
        }

        let userApiSecretVersions: Record<string, string> = {};
        try {
            if (!dbAdmin) {
                throw new Error("Firestore Admin instance (dbAdmin) is not initialized.");
            }
            const userDocRef = dbAdmin.collection("users").doc(userId);
            const userDocSnap = await userDocRef.get();
            if (!userDocSnap.exists) {
                console.error(`API Route: User profile not found for userId: ${userId}`);
                return NextResponse.json({ error: "User profile not found" }, { status: 404 });
            }
            userApiSecretVersions = userDocSnap.data()?.apiSecretVersions || {};

            // Skip API key validation for Ollama (doesn't need API keys)
            const agentASecretVersion = agentALLMInfo.provider === 'Ollama' ? 'ollama-local' : (userApiSecretVersions[agentARequiredKey] || null);
            const agentBSecretVersion = agentBLLMInfo.provider === 'Ollama' ? 'ollama-local' : (userApiSecretVersions[agentBRequiredKey] || null);

            if (!agentASecretVersion && agentALLMInfo.provider !== 'Ollama') {
                console.error(`API Route: Missing secret version name for key type '${agentARequiredKey}' (Provider: ${agentALLMInfo.provider}) for user ${userId}`);
                return NextResponse.json({ error: `API key reference for ${agentALLMInfo.provider} not found in settings.` }, { status: 404 });
            }
            if (!agentBSecretVersion && agentBLLMInfo.provider !== 'Ollama') {
                console.error(`API Route: Missing secret version name for key type '${agentBRequiredKey}' (Provider: ${agentBLLMInfo.provider}) for user ${userId}`);
                return NextResponse.json({ error: `API key reference for ${agentBLLMInfo.provider} not found in settings.` }, { status: 404 });
            }

            // Add Ollama placeholder to apiSecretVersions if needed
            if (agentALLMInfo.provider === 'Ollama') {
                userApiSecretVersions[agentARequiredKey] = 'ollama-local';
            }
            if (agentBLLMInfo.provider === 'Ollama') {
                userApiSecretVersions[agentBRequiredKey] = 'ollama-local';
            }
        } catch (firestoreError) {
            console.error(`API Route: Firestore error fetching secret versions for user ${userId}:`, firestoreError);
            return NextResponse.json({ error: "Error retrieving API key configuration." }, { status: 500 });
        }

        // Key validation is deferred to the Cloud Function.

        try {
            if (!dbAdmin) {
                throw new Error("Firestore Admin instance (dbAdmin) is not initialized.");
            }
            const newConversationRef = dbAdmin.collection("conversations").doc();
            const conversationId = newConversationRef.id;

            // When TTS is disabled, store minimal TTS settings
            const finalAgentATts = {
                provider: ttsEnabled ? agentA_tts.provider : 'none',
                voice: ttsEnabled ? agentA_tts.voice : null,
                ...(ttsEnabled && agentA_tts.selectedTtsModelId ? { selectedTtsModelId: agentA_tts.selectedTtsModelId } : {}),
                ...(ttsEnabled && agentA_tts.ttsApiModelId ? { ttsApiModelId: agentA_tts.ttsApiModelId } : {})
            };

            const finalAgentBTts = {
                provider: ttsEnabled ? agentB_tts.provider : 'none',
                voice: ttsEnabled ? agentB_tts.voice : null,
                ...(ttsEnabled && agentB_tts.selectedTtsModelId ? { selectedTtsModelId: agentB_tts.selectedTtsModelId } : {}),
                ...(ttsEnabled && agentB_tts.ttsApiModelId ? { ttsApiModelId: agentB_tts.ttsApiModelId } : {})
            };

            const conversationData: ConversationData = {
                userId: userId,
                agentA_llm: agentA_llm,
                agentB_llm: agentB_llm,
                turn: "agentA",
                status: "running",
                language: language, // Store the language for the conversation
                apiSecretVersions: userApiSecretVersions,
                createdAt: FieldValue.serverTimestamp(),
                lastActivity: FieldValue.serverTimestamp(),
                ttsSettings: {
                    enabled: ttsEnabled,
                    agentA: finalAgentATts,
                    agentB: finalAgentBTts,
                },
                initialSystemPrompt: initialSystemPrompt, // <-- Store in Firestore
            };
            if (ollamaEndpoint) {
                conversationData.ollamaEndpoint = ollamaEndpoint;
            }
            if (imageGenSettings !== undefined) {
                conversationData.imageGenSettings = imageGenSettings;
            }

            // Add log for imageGenSettings
            console.log("API Route: imageGenSettings to be stored:", imageGenSettings);
            await newConversationRef.set(conversationData);
            console.log(`API Route: Created conversation document with TTS settings and language: ${conversationId}`);

            // Use the provided initialSystemPrompt (even if empty)
            const initialPrompt = initialSystemPrompt;

            await newConversationRef.collection("messages").add({
                role: "system",
                content: initialPrompt,
                timestamp: FieldValue.serverTimestamp(),
            });
            console.log(`API Route: Added initial system message for conversation in ${language}: ${conversationId}`);

            return NextResponse.json({
                message: "Conversation created successfully.",
                conversationId: conversationId,
            }, { status: 200 });

        } catch (firestoreError) {
            console.error(`API Route: Error creating conversation document or initial message for user ${userId}:`, firestoreError);
            return NextResponse.json({ error: "Error initializing conversation." }, { status: 500 });
        }

    } catch (error) {
        console.error("API Route: Unhandled error in /api/conversation/start:", error);
        return NextResponse.json({ error: "Internal server error during session start" }, { status: 500 });
    }
}
