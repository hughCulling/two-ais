// functions/src/index.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { getStorage } from "firebase-admin/storage";

// --- TTS Utility Imports ---
import { getTTSInputChunks } from "./tts_utils";
import { getBackendTTSModelById } from "./tts_models";
import { onRequest } from "firebase-functions/v2/https";
import { triggerAgentResponse } from "./agentOrchestrator";

// --- Initialization of Firebase Admin and Clients ---
if (admin.apps.length === 0) {
  admin.initializeApp();
  logger.info("Firebase Admin SDK Initialized in Cloud Function.");
}
const db = admin.firestore();

let secretManagerClient: SecretManagerServiceClient | null = null;
try {
    secretManagerClient = new SecretManagerServiceClient();
    logger.info("Secret Manager Client Initialized globally.");
} catch(error) {
    logger.error("Failed to initialize Secret Manager Client globally:", error);
}


const defaultBucketName = process.env.FIREBASE_STORAGE_BUCKET || admin.app().options.storageBucket || "two-ais.appspot.com";
const storageBucket = getStorage().bucket(defaultBucketName);
logger.info(`Using Storage bucket: ${defaultBucketName}`);

const projectId = process.env.GCLOUD_PROJECT;
if (!projectId) {
    logger.warn("GCLOUD_PROJECT environment variable not set. Secret Manager operations might fail.");
}
// --- End Initialization ---


// --- Interfaces ---
interface AgentTTSSettingsBackend {
    provider: "openai" | "none" | "browser" | "google-cloud" | "elevenlabs" | "google-gemini";
    voice: string | null; // For OpenAI: 'alloy', etc. For Google: 'en-US-Wavenet-A', etc. For Eleven Labs: voice_id
    // This field comes from the frontend.
    // For OpenAI, it's 'openai-tts-1', 'openai-tts-1-hd', etc. (maps to actual API model).
    // For Google, it's the conceptual model ID like 'google-standard-voices'.
    // For Eleven Labs, it's e.g., 'elevenlabs-multilingual-v2'
    selectedTtsModelId?: string;
    ttsApiModelId?: string;      // API-specific ID, e.g., 'tts-1', 'gemini-2.5-flash-preview-tts'
}
export interface ConversationTTSSettingsBackend {
    enabled: boolean;
    agentA: AgentTTSSettingsBackend;
    agentB: AgentTTSSettingsBackend;
}
interface LLMInfo {
    id: string;
    provider: "OpenAI" | "Google" | "Anthropic" | "xAI" | "TogetherAI" | "DeepSeek" | "Mistral AI" | "Ollama";
    apiKeySecretName: string;
}
interface GcpError extends Error { code?: number | string; details?: string; }

// Interface for expected LLM error details
// interface LLMErrorDetails {
//     status?: number | string;
//     code?: number | string;
//     param?: string;
//     type?: string;
// }

const LOOKAHEAD_LIMIT = 3; // How many agent messages ahead can be generated
// --- ConversationData type for linter ---
type ConversationData = {
  agentA_llm: string;
  agentB_llm: string;
  turn: "agentA" | "agentB";
  apiSecretVersions: { [key: string]: string };
  status?: "running" | "stopped" | "error";
  userId?: string;
  ttsSettings?: ConversationTTSSettingsBackend;
  waitingForTTSEndSignal?: boolean;
  errorContext?: string;
  lastPlayedAgentMessageId?: string;
  initialSystemPrompt?: string;
  processingTurnFor?: "agentA" | "agentB" | null;
  ollamaEndpoint?: string;
};
// --- End Interfaces ---

// --- Helper Functions (Defined ONCE) ---

// Helper function to convert raw PCM data to WAV format
function createWavBuffer(pcmData: Buffer, channels = 1, sampleRate = 24000, bitsPerSample = 16): Buffer {
    const dataLength = pcmData.length;
    const bufferLength = 44 + dataLength; // WAV header is 44 bytes + data
    const buffer = Buffer.alloc(bufferLength);
    
    let offset = 0;
    
    // RIFF chunk descriptor
    buffer.write("RIFF", offset); offset += 4;
    buffer.writeUInt32LE(bufferLength - 8, offset); offset += 4; // File size - 8
    buffer.write("WAVE", offset); offset += 4;
    
    // fmt sub-chunk
    buffer.write("fmt ", offset); offset += 4;
    buffer.writeUInt32LE(16, offset); offset += 4; // Sub-chunk size (16 for PCM)
    buffer.writeUInt16LE(1, offset); offset += 2; // Audio format (1 for PCM)
    buffer.writeUInt16LE(channels, offset); offset += 2; // Number of channels
    buffer.writeUInt32LE(sampleRate, offset); offset += 4; // Sample rate
    buffer.writeUInt32LE(sampleRate * channels * bitsPerSample / 8, offset); offset += 4; // Byte rate
    buffer.writeUInt16LE(channels * bitsPerSample / 8, offset); offset += 2; // Block align
    buffer.writeUInt16LE(bitsPerSample, offset); offset += 2; // Bits per sample
    
    // data sub-chunk
    buffer.write("data", offset); offset += 4;
    buffer.writeUInt32LE(dataLength, offset); offset += 4; // Data size
    
    // Copy PCM data
    pcmData.copy(buffer, offset);
    
    return buffer;
}

function getProviderFromId(id: string): LLMInfo["provider"] | null {
     // Check for Ollama models first (format: "ollama:modelname")
     if (id.startsWith("ollama:")) {
         logger.info(`Detected Ollama model: ${id}`);
         return "Ollama";
     }
     // Check other providers
     if (id.startsWith("gpt-") || id === "o4-mini" || id === "o3" || id === "o3-mini" || id === "o1" || id === "chatgpt-4o-latest") return "OpenAI";
     if (id.startsWith("gemini-")) return "Google";
     if (id.startsWith("claude-")) return "Anthropic";
     if (id.startsWith("grok-")) return "xAI";
     if (id.startsWith("deepseek-")) return "DeepSeek";
     if (id.startsWith("mistral-") || id.startsWith("magistral-") || id.startsWith("ministral-") || id === "open-mistral-nemo") return "Mistral AI";
     if (id.includes("meta-llama/") || id.includes("google/") || id.includes("deepseek-ai/") || id.includes("Qwen/")) return "TogetherAI";
     logger.warn(`Could not determine provider from model ID: ${id}`);
     return null;
}

function getFirestoreKeyIdFromProvider(provider: LLMInfo["provider"] | null): string | null {
    if (provider === "OpenAI") return "openai";
    if (provider === "Google") return "google_ai"; // This is the key for Google LLMs (Gemini)
    if (provider === "Anthropic") return "anthropic";
    if (provider === "xAI") return "xai";
    if (provider === "TogetherAI") return "together_ai";
    if (provider === "DeepSeek") return "deepseek";
    if (provider === "Mistral AI") return "mistral";
    if (provider === "Ollama") return "ollama"; // Ollama doesn't need API key, but we need a placeholder
    logger.warn(`Could not map provider to Firestore key ID: ${provider}`);
    return null;
}

// Helper to get the API key ID for TTS based on provider
function getTTSApiKeyId(provider: AgentTTSSettingsBackend["provider"]): string | null {
    switch (provider) {
        case "openai":
            return "openai";
        case "google-cloud":
            return "google_ai"; // Changed from googleCloudApiKey to align with tts_models.ts
        case "elevenlabs":
            return "elevenlabs";
        case "google-gemini":
            return "google_ai"; // Changed from gemini_api_key to google_ai
        case "browser":
        case "none":
        default:
            return null;
    }
}


async function getApiKeyFromSecret(secretVersionName: string): Promise<string | null> {
     if (!secretManagerClient) {
        logger.error("Secret Manager Client is null in getApiKeyFromSecret. Attempting re-initialization.");
        try {
             secretManagerClient = new SecretManagerServiceClient();
             logger.info("Re-initialized Secret Manager Client in getApiKeyFromSecret.");
        } catch(error) {
             logger.error("Failed to re-initialize Secret Manager Client in getApiKeyFromSecret:", error);
             return null;
        }
    }
    if (!secretVersionName || typeof secretVersionName !== "string" || !secretVersionName.includes("/secrets/")) {
        logger.warn(`getApiKeyFromSecret called with invalid or empty secretVersionName: ${secretVersionName}`);
        return null;
    }
    try {
        logger.info(`Accessing secret version: ${secretVersionName}`);
        const [version] = await secretManagerClient.accessSecretVersion({ name: secretVersionName });
        const payloadData = version.payload?.data;
        if (!payloadData) {
            logger.warn(`Secret version ${secretVersionName} payload is empty.`);
            return null;
        }
        if (payloadData instanceof Uint8Array || Buffer.isBuffer(payloadData)) {
             const apiKey = Buffer.from(payloadData).toString("utf8");
             logger.info(`Successfully retrieved secret from version: ${secretVersionName}`);
             return apiKey;
        } else {
             logger.error(`Secret payload for ${secretVersionName} has unexpected type: ${typeof payloadData}`);
             if (typeof payloadData === "string") {
                 return payloadData;
             }
             return null;
        }
    } catch (error) {
        logger.error(`Failed to access secret version ${secretVersionName}:`, error);
        if (error instanceof Error && ("code" in error || "details" in error)) {
             const gcpError = error as GcpError;
             logger.error(`GCP Error Code: ${gcpError.code ?? "N/A"}, Details: ${gcpError.details ?? "N/A"}`);
        }
        return null;
    }
}
async function storeApiKeyAsSecret(userId: string, service: string, apiKey: string): Promise<string> {
    const currentProjectId = process.env.GCLOUD_PROJECT || projectId;
    if (!currentProjectId) {
        logger.error("GCLOUD_PROJECT env var missing inside storeApiKeyAsSecret.");
        throw new HttpsError("internal", "Project ID not configured for Secret Manager.");
    }
     if (!secretManagerClient) {
        logger.error("Secret Manager Client is not initialized in storeApiKeyAsSecret. Attempting re-initialization.");
        try {
            secretManagerClient = new SecretManagerServiceClient();
             logger.info("Re-initialized Secret Manager Client in storeApiKeyAsSecret.");
        } catch (initError) {
             logger.error("Failed to re-initialize Secret Manager Client in storeApiKeyAsSecret:", initError);
             throw new HttpsError("internal", "Secret Manager client failed to initialize.");
        }
    }
    const sanitizedUserId = userId.replace(/[^a-zA-Z0-9-_]/g, "_");
    const sanitizedService = service.replace(/[^a-zA-Z0-9-_]/g, "_");
    // Corrected line 115: Using double quotes for string concatenation
    const secretId = "user-" + sanitizedUserId + "-" + sanitizedService + "-key";
    const parent = `projects/${currentProjectId}`;
    const secretPath = `${parent}/secrets/${secretId}`;
    logger.info(`Attempting to store key in Secret Manager: ${secretPath}`);
    try {
        try {
            await secretManagerClient.getSecret({ name: secretPath });
            logger.info(`Secret ${secretId} already exists. Adding new version.`);
        } catch (error: unknown) {
            let grpcCode: number | undefined;
            if (typeof error === "object" && error !== null && "code" in error) {
                if (typeof (error as { code: unknown }).code === "number") {
                     grpcCode = (error as { code: number }).code;
                }
            }
            if (grpcCode === 5) {
                logger.info(`Secret ${secretId} not found. Creating new secret.`);
                await secretManagerClient.createSecret({
                    parent: parent,
                    secretId: secretId,
                    secret: { replication: { automatic: {} } },
                });
                logger.info(`Secret ${secretId} created successfully.`);
            } else {
                logger.error(`Unexpected error getting secret ${secretId}:`, error);
                throw error;
            }
        }
        const [version] = await secretManagerClient.addSecretVersion({
            parent: secretPath,
            payload: { data: Buffer.from(apiKey, "utf8") },
        });
        if (!version.name) { throw new Error("Failed to get version name after adding secret version."); }
        logger.info(`Added new version ${version.name} for secret ${secretId}.`);
        return version.name;
    } catch (error) {
        logger.error(`Error interacting with Secret Manager for secret ${secretId}:`, error);
        throw new HttpsError("internal", `Failed to securely store API key for ${service}. Check function logs and Secret Manager permissions.`);
    }
}
// --- End Helper Functions ---


// --- Cloud Function: saveApiKey ---
export const saveApiKey = onCall<{ service: string; apiKey: string }, Promise<{ message: string; service: string }>>(
    { region: "us-central1", memory: "512MiB", timeoutSeconds: 60 },
    async (request) => {
        logger.info("--- saveApiKey Function Execution Start ---", { structuredData: true });
        if (!request.auth?.uid) {
            logger.error("Authentication check failed: No auth context.");
            throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
        }
        const userId = request.auth.uid;
        const { service, apiKey } = request.data;
        logger.info(`Processing saveApiKey for user: ${userId}, service: ${service}`);
        if (!service || typeof service !== "string" || service.trim() === "") { throw new HttpsError("invalid-argument", "Service name is required."); }
        if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") { throw new HttpsError("invalid-argument", `API key for service "${service}" cannot be empty.`); }
        if (apiKey.length < 8 || apiKey.length > 4096) { throw new HttpsError("invalid-argument", `The API key for service "${service}" has an invalid length.`); }
        try {
            const secretVersionName = await storeApiKeyAsSecret(userId, service, apiKey);
            logger.info(`API key stored. Version: ${secretVersionName}`, { userId });
            const userDocRef = db.collection("users").doc(userId);
            await userDocRef.set(
                {
                    apiSecretVersions: { [service]: secretVersionName },
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                },
                { merge: true },
            );
            logger.info(`Secret version reference saved to Firestore field "apiSecretVersions.${service}".`, { userId });
            return { message: `API key for ${service} saved securely.`, service: service };
        } catch (error) {
            logger.error(`Error processing saveApiKey for service ${service}:`, error, { userId });
            if (error instanceof HttpsError) throw error;
            logger.error("Caught unexpected error:", error);
            throw new HttpsError("internal", `An unexpected error occurred while saving the ${service} API key.`);
        }
    },
);
// --- End saveApiKey ---


// --- Cloud Function: orchestrateConversation ---
export const orchestrateConversation = onDocumentCreated(
    { document: "conversations/{conversationId}/messages/{messageId}", region: "us-central1", memory: "512MiB", timeoutSeconds: 300 },
    async (event) => {
    logger.info("--- orchestrateConversation Triggered ---");
    const { conversationId, messageId } = event.params;
    logger.info(`Conversation ID: ${conversationId}, Message ID: ${messageId}`);

    const newMessageSnapshot = event.data;
    if (!newMessageSnapshot) { logger.error("No data associated with the event trigger."); return; }
    const newMessageData = newMessageSnapshot.data() as { role: string; content: string; timestamp?: admin.firestore.Timestamp; audioUrl?: string };
    const newMessageRole = newMessageData.role;
    const newMessageContent = newMessageData.content;
    logger.info("New message data:", { role: newMessageRole, content: newMessageContent?.substring(0, 50) + "..." });

    if (newMessageRole === "system" && newMessageContent === "SYSTEM_TRIGGER_NEXT_TURN") {
        logger.info(`Ignoring system trigger message ${messageId}.`);
        return;
    }

    const conversationRef = db.collection("conversations").doc(conversationId) as DocumentReference<ConversationData>;
    const messagesRef = conversationRef.collection("messages");
    let conversationData: ConversationData;
    try {
        const conversationSnap = await conversationRef.get();
        if (!conversationSnap.exists) { logger.error(`Conversation document ${conversationId} not found.`); return; }
        conversationData = conversationSnap.data()!;
        logger.info("Conversation data fetched:", conversationData);
        if (!conversationData?.agentA_llm || !conversationData?.agentB_llm || !conversationData?.turn || !conversationData?.apiSecretVersions) {
             logger.error(`Conversation document ${conversationId} is missing required LLM configuration fields.`);
             await conversationRef.update({ status: "error", errorContext: "Invalid conversation LLM configuration." }).catch(err => logger.error("Failed to update status:", err));
             return;
        }
        if (conversationData.status !== "running") {
            logger.info(`Conversation ${conversationId} status is not 'running' ("${conversationData.status}"). Exiting.`);
            return;
        }
    } catch (error) { logger.error(`Failed to fetch conversation document ${conversationId}:`, error); return; }

    let agentToRespond: "agentA" | "agentB" | null = null;
    const currentTurn = conversationData.turn;
    if (newMessageRole === "agentA" && currentTurn === "agentB") agentToRespond = "agentB";
    else if (newMessageRole === "agentB" && currentTurn === "agentA") agentToRespond = "agentA";
    else if ((newMessageRole === "user" || newMessageRole === "system") && (currentTurn === "agentA" || currentTurn === "agentB")) agentToRespond = currentTurn;
    else { logger.info(`No response needed by orchestrator trigger. New Message Role: "${newMessageRole}", Current Turn: "${currentTurn}".`); return; }
    logger.info(`Orchestrator determined agent to respond: ${agentToRespond}`);

    // Check if the agent uses Ollama - if so, skip Cloud Function execution
    // Ollama models should be handled client-side via the Next.js API route
    const agentModelId = agentToRespond === "agentA" ? conversationData.agentA_llm : conversationData.agentB_llm;
    if (agentModelId.startsWith("ollama:")) {
        logger.info(`Skipping Cloud Function execution for Ollama model: ${agentModelId}. Client-side handling expected.`);
        return;
    }

    await triggerAgentResponse(conversationId, agentToRespond, conversationRef, messagesRef);

    logger.info("--- orchestrateConversation (onDocumentCreated) Finished ---");
    return null;
});
// --- End orchestrateConversation ---


// --- Add requestNextTurn callable function ---
export const requestNextTurn = onCall<{ conversationId: string }, Promise<{ message: string }>>( 
    { region: "us-central1", memory: "512MiB", timeoutSeconds: 300 },
    async (request) => {
        logger.info("--- requestNextTurn Function Execution Start ---", { structuredData: true });
        const conversationId = request.data.conversationId;
        if (!conversationId || typeof conversationId !== "string") {
            logger.error("requestNextTurn: Missing or invalid conversationId");
            throw new HttpsError("invalid-argument", "Missing or invalid conversationId");
        }
        const conversationRef = db.collection("conversations").doc(conversationId) as DocumentReference<ConversationData>;
        const messagesRef = conversationRef.collection("messages");
        let conversationData: ConversationData;
        try {
            const conversationSnap = await conversationRef.get();
            if (!conversationSnap.exists) {
                logger.error(`requestNextTurn: Conversation document ${conversationId} not found.`);
                throw new HttpsError("not-found", "Conversation not found");
            }
            conversationData = conversationSnap.data() as ConversationData;
            if (!conversationData?.agentA_llm || !conversationData?.agentB_llm || !conversationData?.turn || !conversationData?.apiSecretVersions) {
                logger.error(`requestNextTurn: Conversation document ${conversationId} is missing required LLM configuration fields.`);
                throw new HttpsError("failed-precondition", "Conversation missing required configuration");
            }
            if (conversationData.status !== "running") {
                logger.info(`requestNextTurn: Conversation ${conversationId} status is not 'running' ("${conversationData.status}"). Exiting.`);
                return { message: "Conversation not running." };
            }
        } catch (error) {
            logger.error(`requestNextTurn: Failed to fetch conversation document ${conversationId}:`, error);
            throw new HttpsError("internal", "Failed to fetch conversation");
        }
        // --- Lookahead logic: count agent messages ahead ---
        const allMessagesSnap = await messagesRef.orderBy("timestamp", "asc").get();
        const allMessages: { id: string; role: string }[] = allMessagesSnap.docs.map(doc => {
            const data = doc.data() as { role: string };
            return { id: doc.id, role: data.role };
        });
        let lastPlayedIdx = -1;
        if (conversationData.lastPlayedAgentMessageId) {
            lastPlayedIdx = allMessages.findIndex(m => m.id === conversationData.lastPlayedAgentMessageId);
        }
        let agentMessagesAhead = 0;
        for (let i = lastPlayedIdx + 1; i < allMessages.length; i++) {
            if (allMessages[i].role === "agentA" || allMessages[i].role === "agentB") {
                agentMessagesAhead++;
            }
        }
        if (agentMessagesAhead >= LOOKAHEAD_LIMIT) {
            logger.info(`[requestNextTurn] ${agentMessagesAhead} agent messages ahead of user. Limit is ${LOOKAHEAD_LIMIT}. Skipping agent response generation.`);
            return { message: "Lookahead buffer full." };
        }
        // --- Determine which agent should respond next ---
        const currentTurn = conversationData.turn;
        if (currentTurn !== "agentA" && currentTurn !== "agentB") {
            logger.error(`requestNextTurn: Invalid turn value: ${currentTurn}`);
            throw new HttpsError("failed-precondition", "Invalid turn value");
        }
        
        // Check if the agent uses Ollama - if so, skip Cloud Function execution
        const agentModelId = currentTurn === "agentA" ? conversationData.agentA_llm : conversationData.agentB_llm;
        if (agentModelId.startsWith("ollama:")) {
            logger.info(`requestNextTurn: Skipping Cloud Function execution for Ollama model: ${agentModelId}. Client-side handling expected.`);
            return { message: "Ollama models handled client-side." };
        }
        
        logger.info(`requestNextTurn: Triggering agent response for ${currentTurn}`);
        await triggerAgentResponse(conversationId, currentTurn, conversationRef, messagesRef);
        return { message: `Agent ${currentTurn} response triggered.` };
    }
);
// --- End requestNextTurn ---

/**
 * Firestore onUpdate trigger for conversation document.
 * Detects changes to lastPlayedAgentMessageId and triggers lookahead logic.
 */
export const onConversationProgressUpdate = onDocumentUpdated(
  {
    document: "conversations/{conversationId}",
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 300
  },
  async (event) => {
    const { conversationId } = event.params;
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();
    if (!before || !after) {
      logger.error("onConversationProgressUpdate: Missing before/after data");
      return;
    }
    if (before.lastPlayedAgentMessageId === after.lastPlayedAgentMessageId) {
      logger.info(`onConversationProgressUpdate: lastPlayedAgentMessageId unchanged (${after.lastPlayedAgentMessageId}), skipping.`);
      return;
    }
    if (after.status !== "running") {
      logger.info(`onConversationProgressUpdate: Conversation ${conversationId} status is not 'running' (${after.status}), skipping.`);
      return;
    }
    
    // Check if another response is already being processed
    if (after.processingTurnFor) {
      logger.info(`onConversationProgressUpdate: Another response is already being processed for ${after.processingTurnFor}, skipping.`);
      return;
    }
    logger.info(`onConversationProgressUpdate: Detected user progress update for conversation ${conversationId}. lastPlayedAgentMessageId: ${before.lastPlayedAgentMessageId} -> ${after.lastPlayedAgentMessageId}`);
    const conversationRef = db.collection("conversations").doc(conversationId) as DocumentReference<ConversationData>;
    const messagesRef = conversationRef.collection("messages");
    // --- Lookahead logic: count agent messages ahead ---
    const allMessagesSnap = await messagesRef.orderBy("timestamp", "asc").get();
    const allMessages: { id: string; role: string }[] = allMessagesSnap.docs.map(doc => {
      const data = doc.data() as { role: string };
      return { id: doc.id, role: data.role };
    });
    let lastPlayedIdx = -1;
    if (after.lastPlayedAgentMessageId) {
      lastPlayedIdx = allMessages.findIndex(m => m.id === after.lastPlayedAgentMessageId);
    }
    let agentMessagesAhead = 0;
    for (let i = lastPlayedIdx + 1; i < allMessages.length; i++) {
      if (allMessages[i].role === "agentA" || allMessages[i].role === "agentB") {
        agentMessagesAhead++;
      }
    }
    if (agentMessagesAhead >= LOOKAHEAD_LIMIT) {
      logger.info(`[onConversationProgressUpdate] ${agentMessagesAhead} agent messages ahead of user. Limit is ${LOOKAHEAD_LIMIT}. Skipping agent response generation.`);
      return;
    }
    // --- Determine which agent should respond next ---
    const currentTurn = after.turn;
    if (currentTurn !== "agentA" && currentTurn !== "agentB") {
      logger.error(`onConversationProgressUpdate: Invalid turn value: ${currentTurn}`);
      return;
    }
    
    // Check if the agent uses Ollama - if so, skip Cloud Function execution
    const agentModelId = currentTurn === "agentA" ? after.agentA_llm : after.agentB_llm;
    if (agentModelId && agentModelId.startsWith("ollama:")) {
      logger.info(`onConversationProgressUpdate: Skipping Cloud Function execution for Ollama model: ${agentModelId}. Client-side handling expected.`);
      return;
    }
    
    logger.info(`onConversationProgressUpdate: Triggering agent response for ${currentTurn}`);
    await triggerAgentResponse(conversationId, currentTurn, conversationRef, messagesRef);
    logger.info(`onConversationProgressUpdate: Agent ${currentTurn} response triggered.`);
  }
);

export { getProviderFromId, getFirestoreKeyIdFromProvider, getTTSApiKeyId, getApiKeyFromSecret, getBackendTTSModelById, getTTSInputChunks, createWavBuffer, storageBucket, triggerAgentResponse };

export const triggerAgentResponseHttp = onRequest(
  { region: "us-central1", memory: "512MiB", timeoutSeconds: 300 },
  async (req, res) => {
    const conversationId = req.body.conversationId || req.query.conversationId;
    const turn = req.body.turn || req.query.turn;
    const forceNextTurn = req.body.forceNextTurn === true || req.query.forceNextTurn === "true";
    if (!conversationId || !turn) {
      res.status(400).json({ error: "Missing conversationId or turn" });
      return;
    }
    try {
      const db = admin.firestore();
      const conversationRef = db.collection("conversations").doc(conversationId);
      const messagesRef = conversationRef.collection("messages");
      await triggerAgentResponse(conversationId, turn, conversationRef, messagesRef, forceNextTurn);
      res.status(200).json({ message: "Agent response triggered." });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  }
);
