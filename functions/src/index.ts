// functions/src/index.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { ChatMistralAI } from "@langchain/mistralai";
import { FieldValue, DocumentReference, CollectionReference } from "firebase-admin/firestore";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { getStorage } from "firebase-admin/storage";
import axios from "axios";

// --- TTS Client Imports ---
import OpenAI from "openai";
import { TextToSpeechClient } from "@google-cloud/text-to-speech"; // Added Google TTS Client
import removeMarkdown from "remove-markdown";

// LangChain Imports
import { BaseMessage, HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenAI, PersonGeneration } from "@google/genai";

import { ChatAnthropic } from "@langchain/anthropic";
import { ChatDeepSeek } from "@langchain/deepseek";
import { ChatXAI } from "@langchain/xai";
import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";
import Together from "together-ai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { BaseLanguageModelInput } from "@langchain/core/language_models/base";

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

// --- RTDB Initialization for Streaming ---
const rtdb = admin.database();

let secretManagerClient: SecretManagerServiceClient | null = null;
try {
    secretManagerClient = new SecretManagerServiceClient();
    logger.info("Secret Manager Client Initialized globally.");
} catch(error) {
    logger.error("Failed to initialize Secret Manager Client globally:", error);
}

// Added Google TextToSpeechClient
let textToSpeechClient: TextToSpeechClient | null = null;
try {
    textToSpeechClient = new TextToSpeechClient();
    logger.info("Google TextToSpeech Client Initialized globally.");
} catch (error) {
    logger.error("Failed to initialize Google TextToSpeech Client globally:", error);
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
    provider: "OpenAI" | "Google" | "Anthropic" | "xAI" | "TogetherAI" | "DeepSeek" | "Mistral AI";
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

const LOOKAHEAD_LIMIT = 2; // How many agent messages ahead can be generated
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


// --- Internal Helper: _triggerAgentResponse ---
async function _triggerAgentResponse(
    conversationId: string,
    agentToRespond: "agentA" | "agentB",
    conversationRef: DocumentReference<ConversationData>,
    messagesRef: CollectionReference
): Promise<void> {
    logger.info(`_triggerAgentResponse called for ${agentToRespond} in conversation ${conversationId}`);

    // Set processing lock
    await conversationRef.update({
        processingTurnFor: agentToRespond
    });

    let conversationData: ConversationData;
    let llmApiKey: string | null = null;

    try {
        const conversationSnap = await conversationRef.get();
        if (!conversationSnap.exists) {
            logger.error(`Conversation ${conversationId} not found in _triggerAgentResponse.`);
            return;
        }
        conversationData = conversationSnap.data() as ConversationData;

        if (conversationData.status !== "running") {
             logger.info(`Conversation ${conversationId} status is ${conversationData.status}. Aborting _triggerAgentResponse.`);
             return;
        }

        // --- NEW: Enforce lookahead limit ---
        // Only if not forced (for future extensibility)
        // (This function is only called from orchestrateConversation, which doesn't force)
        // Fetch all messages ordered by timestamp
        const allMessagesSnap = await messagesRef.orderBy("timestamp", "asc").get();
        const allMessages: { id: string; role: string }[] = allMessagesSnap.docs.map(doc => {
            const data = doc.data() as { role: string };
            return { id: doc.id, role: data.role };
        });
        // Find the index of lastPlayedAgentMessageId
        let lastPlayedIdx = -1;
        if (conversationData.lastPlayedAgentMessageId) {
            lastPlayedIdx = allMessages.findIndex(m => m.id === conversationData.lastPlayedAgentMessageId);
        }
        // Count agent messages after lastPlayedIdx
        let agentMessagesAhead = 0;
        for (let i = lastPlayedIdx + 1; i < allMessages.length; i++) {
            if (allMessages[i].role === "agentA" || allMessages[i].role === "agentB") {
                agentMessagesAhead++;
            }
        }
        if (agentMessagesAhead >= LOOKAHEAD_LIMIT) {
            logger.info(`[Lookahead Limit] ${agentMessagesAhead} agent messages ahead of user. Limit is ${LOOKAHEAD_LIMIT}. Skipping agent response generation.`);
            return;
        }

        let historyMessages: BaseMessage[] = [];
        try {
            const historyQuery = messagesRef.orderBy("timestamp", "asc").limit(20); // Limit to 20 most recent messages in chronological order
            const historySnap = await historyQuery.get();
            const agentModelId = agentToRespond === "agentA" ? conversationData.agentA_llm : conversationData.agentB_llm;
            const llmProvider = getProviderFromId(agentModelId);
            if (llmProvider === "TogetherAI") {
                // Normalize roles for TogetherAI: system, user, assistant, user, assistant, ...
                const docs = historySnap.docs;
                if (docs.length === 1 && docs[0].data().role === "system") {
                    // History has only the system prompt. Use its content as the first human message.
                    const systemPromptContent = docs[0].data().content;
                    historyMessages.push(new SystemMessage({ content: systemPromptContent }));
                    historyMessages.push(new HumanMessage({ content: systemPromptContent }));
                } else if (docs.length === 0) {
                     // Handle empty history: add system prompt and a placeholder
                    const systemPrompt = conversationData.initialSystemPrompt || "You are a helpful assistant.";
                    historyMessages.push(new SystemMessage({ content: systemPrompt }));
                    historyMessages.push(new HumanMessage({ content: "Hello" }));
                } else {
                    let idx = 0;
                    if (docs[0].data().role === "system") {
                        // First message is system
                        historyMessages.push(new SystemMessage({ content: docs[0].data().content }));
                        idx = 1;
                    }
                    // Determine which agent is the 'user' for this turn
                    // The agent who is NOT about to respond is the 'user' in the last message
                    // For the rest, alternate: user, assistant, user, assistant ...
                    let isUser = true;
                    for (let i = idx; i < docs.length; i++) {
                        const data = docs[i].data() as { role: string; content: string };
                        if (isUser) {
                            // Message from the agent who is NOT about to respond
                            historyMessages.push(new HumanMessage({ content: data.content }));
                        } else {
                            // Message from the agent who IS about to respond
                            historyMessages.push(new AIMessage({ content: data.content }));
                        }
                        isUser = !isUser;
                    }
                }
            } else {
                // Existing logic for other providers
                historyMessages = historySnap.docs.map((doc) => {
                    const data = doc.data() as { role: string; content: string };
                    if (data.role === agentToRespond) return new AIMessage({ content: data.content });
                    if (["agentA", "agentB", "user", "system"].includes(data.role)) return new HumanMessage({ content: data.content });
                    logger.warn(`Unknown role found in history: ${data.role}`); return null;
                }).filter((msg): msg is BaseMessage => msg !== null);
            }
            logger.info(`Fetched ${historyMessages.length} messages for history in _triggerAgentResponse.`);
        } catch (error) { throw new Error(`Failed to fetch message history: ${error}`); }

        const agentModelId = agentToRespond === "agentA" ? conversationData.agentA_llm : conversationData.agentB_llm;
        const llmProvider = getProviderFromId(agentModelId);
        const llmFirestoreKeyId = getFirestoreKeyIdFromProvider(llmProvider);
        if (!llmProvider || !llmFirestoreKeyId) { throw new Error(`Invalid LLM configuration ID "${agentModelId}" for ${agentToRespond}.`); }
        const llmSecretVersionName = conversationData.apiSecretVersions[llmFirestoreKeyId];
        if (!llmSecretVersionName) { throw new Error(`API key reference missing for ${agentToRespond} (${llmProvider}). Check Firestore user data.`); }
        try {
            llmApiKey = await getApiKeyFromSecret(llmSecretVersionName);
            if (!llmApiKey) { throw new Error(`getApiKeyFromSecret returned null for LLM version ${llmSecretVersionName}`); }
            logger.info(`Successfully retrieved API key for LLM provider ${llmProvider} in _triggerAgentResponse.`);
        } catch(error) { throw new Error(`Failed to retrieve API key for ${agentToRespond} (${llmProvider}): ${error}`); }

        let chatModel: BaseChatModel;
        try {
            const modelName = agentModelId;
            if (llmProvider === "OpenAI") chatModel = new ChatOpenAI({ apiKey: llmApiKey, modelName: modelName });
            else if (llmProvider === "Google") chatModel = new ChatGoogleGenerativeAI({ apiKey: llmApiKey, model: modelName });
            else if (llmProvider === "Anthropic") chatModel = new ChatAnthropic({ apiKey: llmApiKey, modelName: modelName });
            else if (llmProvider === "xAI") chatModel = new ChatXAI({ apiKey: llmApiKey, model: modelName });
            else if (llmProvider === "TogetherAI") {
                 chatModel = new ChatTogetherAI({
                     apiKey: llmApiKey,
                     modelName: modelName,
                 });
            }
            else if (llmProvider === "DeepSeek") {
                chatModel = new ChatDeepSeek({
                    apiKey: llmApiKey,
                    modelName: modelName,
                    temperature: 0.7,
                });
            }
            else if (llmProvider === "Mistral AI") {
                chatModel = new ChatMistralAI({
                    apiKey: llmApiKey,
                    modelName: modelName,
                    temperature: 0.7,
                });
            }
            else throw new Error(`Unsupported provider configuration: ${llmProvider}`);
            logger.info(`Initialized ${llmProvider} model: ${modelName} for ${agentToRespond} in _triggerAgentResponse`);
        } catch (error) { throw new Error(`Failed to initialize LLM "${agentModelId}" for ${agentToRespond}: ${error}`); }

        // --- Streaming logic ---
        // Generate a messageId for both RTDB and Firestore
        const messageId = admin.firestore().collection("dummy").doc().id;
        const rtdbRef = rtdb.ref(`/streamingMessages/${conversationId}/${messageId}`);
        let responseContent = "";
        try {
            // Write initial RTDB entry
            await rtdbRef.set({
                role: agentToRespond,
                content: "",
                status: "streaming",
                timestamp: Date.now(),
            });
            // Use LangChain streaming API
            const stream = await chatModel.stream(historyMessages as BaseLanguageModelInput);
            for await (const chunk of stream) {
                let token = "";
                if (typeof chunk === "string") token = chunk;
                else if (chunk && typeof chunk.content === "string") token = chunk.content;
                else if (chunk && Array.isArray(chunk.content)) token = chunk.content.map(x => (typeof x === "string" ? x : JSON.stringify(x))).join("");
                else token = String(chunk);
                responseContent += token;
                // Update RTDB with new content
                await rtdbRef.update({ content: responseContent });
            }
            // Mark as complete
            await rtdbRef.update({ status: "complete" });
        } catch (error) {
            logger.error(`LLM streaming failed for ${agentToRespond} (${agentModelId}):`, error);
            await rtdbRef.update({ status: "error", error: error instanceof Error ? error.message : String(error) });
            throw new Error(`LLM streaming failed for ${agentToRespond} (${agentModelId}): ${error}`);
        }

        // --- TTS and Firestore logic (unchanged, but use messageId) ---
        // let audioUrl: string | null = null;
        // let ttsWasSplit = false; // New: flag for UI if audio was split
        const ttsSettings = conversationData.ttsSettings;
        const agentSettings = agentToRespond === "agentA" ? ttsSettings?.agentA : ttsSettings?.agentB;
        const textToSpeak = removeMarkdown(responseContent);

        // --- IMAGE GENERATION LOGIC (NEW) ---
        // Define a type that extends ConversationData with imageGenSettings
        type ConversationDataWithImageGen = ConversationData & {
            imageGenSettings?: {
                enabled: boolean;
                provider: string;
                model: string;
                quality: string;
                size: string;
                promptLlm: string;
                promptSystemMessage: string;
            };
        };
        const imageGenSettings = (conversationData as ConversationDataWithImageGen).imageGenSettings;
        async function runImageGen() {
            logger.info("[DEBUG] Entered runImageGen. imageGenSettings:", imageGenSettings);
            let imageUrl: string | null = null;
            let imageGenError: string | null = null;
            try {
                if (imageGenSettings && imageGenSettings.enabled) {
                    logger.info(`[ImageGen] Starting image generation for messageId: ${messageId}`);
                    const imageGenStart = Date.now();
                    try {
                        // 1. Generate image prompt using selected LLM
                        const promptLlmId = imageGenSettings.promptLlm;
                        const promptSystemMessage = imageGenSettings.promptSystemMessage || "Create a prompt to give to the image generation model based on this turn: {turn}";
                        const promptLlmProvider = getProviderFromId(promptLlmId);
                        const promptLlmFirestoreKeyId = getFirestoreKeyIdFromProvider(promptLlmProvider);
                        if (!promptLlmFirestoreKeyId) throw new Error(`Invalid Firestore key ID for image prompt LLM provider: ${promptLlmProvider}`);
                        const promptLlmSecretVersionName = conversationData.apiSecretVersions[promptLlmFirestoreKeyId];
                        if (!promptLlmSecretVersionName) throw new Error(`API key reference missing for image prompt LLM (${promptLlmProvider}).`);
                        const promptLlmApiKey = await getApiKeyFromSecret(promptLlmSecretVersionName);
                        if (!promptLlmApiKey) throw new Error(`getApiKeyFromSecret returned null for image prompt LLM version ${promptLlmSecretVersionName}`);
                        let promptLlmModel: BaseChatModel;
                        if (promptLlmProvider === "OpenAI") promptLlmModel = new ChatOpenAI({ apiKey: promptLlmApiKey, modelName: promptLlmId });
                        else if (promptLlmProvider === "Google") promptLlmModel = new ChatGoogleGenerativeAI({ apiKey: promptLlmApiKey, model: promptLlmId });
                        else if (promptLlmProvider === "Anthropic") promptLlmModel = new ChatAnthropic({ apiKey: promptLlmApiKey, modelName: promptLlmId });
                        else if (promptLlmProvider === "xAI") promptLlmModel = new ChatXAI({ apiKey: promptLlmApiKey, model: promptLlmId });
                        else if (promptLlmProvider === "TogetherAI") promptLlmModel = new ChatTogetherAI({ apiKey: promptLlmApiKey, modelName: promptLlmId });
                        else if (promptLlmProvider === "Mistral AI") promptLlmModel = new ChatMistralAI({ apiKey: promptLlmApiKey, modelName: promptLlmId });
                        else if (promptLlmProvider === "DeepSeek") promptLlmModel = new ChatDeepSeek({ apiKey: promptLlmApiKey, modelName: promptLlmId });    
                        else throw new Error(`Unsupported provider for image prompt LLM: ${promptLlmProvider}`);
                        // Compose system/user messages
                        const systemMsg = promptSystemMessage.replace("{turn}", responseContent);
                        const promptMessages = [
                            new SystemMessage({ content: systemMsg }),
                            new HumanMessage({ content: responseContent })
                        ];
                        // Use .invoke for single-turn prompt
                        const promptResult = await promptLlmModel.invoke(promptMessages as BaseLanguageModelInput);
                        let imagePrompt: string;
                        if (typeof promptResult === "string") {
                            imagePrompt = promptResult;
                        } else if (promptResult && typeof promptResult.content === "string") {
                            imagePrompt = promptResult.content;
                        } else if (promptResult && Array.isArray(promptResult.content)) {
                            imagePrompt = promptResult.content.map(x => (typeof x === "string" ? x : JSON.stringify(x))).join(" ");
                        } else {
                            imagePrompt = responseContent;
                        }
                        logger.info(`[ImageGen] Generated image prompt: ${imagePrompt}`);
                        // 2. Call image generation API
                        const provider = (imageGenSettings.provider || "").toLowerCase();
                        if (provider === "xai") {
                            const xaiApiKeyRef = conversationData.apiSecretVersions["xai"];
                            if (!xaiApiKeyRef) throw new Error("xAI API key reference not found for image generation.");
                            const xaiApiKey = await getApiKeyFromSecret(xaiApiKeyRef);
                            if (!xaiApiKey) throw new Error("getApiKeyFromSecret returned null for xAI image generation.");
                            
                            const xai = new OpenAI({
                                apiKey: xaiApiKey,
                                baseURL: "https://api.x.ai/v1"
                            });
                            
                            const model = imageGenSettings.model || "grok-2-image-1212";
                            
                            logger.info("[ImageGen] Calling xAI images.generate with model:", model);
                            const xaiResponse = await xai.images.generate({
                                model: model,
                                prompt: imagePrompt,
                                n: 1,
                                response_format: "url"
                            });

                            if (xaiResponse && xaiResponse.data && xaiResponse.data[0]) {
                                if (xaiResponse.data[0].url) {
                                    imageUrl = xaiResponse.data[0].url;
                                    logger.info(`[ImageGen] Image generated (url): ${imageUrl}`);
                                } else {
                                    throw new Error("No image URL returned from xAI image generation.");
                                }
                            } else {
                                throw new Error("No image data returned from xAI image generation.");
                            }
                        } else if (provider === "openai") {
                            const openaiApiKeyRef = conversationData.apiSecretVersions["openai"];
                            if (!openaiApiKeyRef) throw new Error("OpenAI API key reference not found for image generation.");
                            const openaiApiKey = await getApiKeyFromSecret(openaiApiKeyRef);
                            if (!openaiApiKey) throw new Error("getApiKeyFromSecret returned null for OpenAI image generation.");
                            const openai = new OpenAI({ apiKey: openaiApiKey });
                            const quality = imageGenSettings.quality;
                            const size = imageGenSettings.size;
                            const model = imageGenSettings.model || "dall-e-3";
                            // Build params for OpenAI image generation
                            const openaiParams: Record<string, unknown> = {
                                prompt: imagePrompt,
                                model,
                                n: 1,
                            };
                            if (model === "dall-e-3") {
                                openaiParams.quality = (["standard", "hd"].includes(quality)) ? (quality as "standard" | "hd") : "standard";
                                openaiParams.size = (["1024x1024", "1792x1024", "1024x1792"].includes(size)) ? (size as "1024x1024" | "1792x1024" | "1024x1792") : "1024x1024";
                                openaiParams.response_format = "url";
                            } else if (model === "dall-e-2") {
                                openaiParams.size = (["256x256", "512x512", "1024x1024"].includes(size)) ? (size as "256x256" | "512x512" | "1024x1024") : "1024x1024";
                                openaiParams.response_format = "url";
                            } else if (model === "gpt-image-1") {
                                // For gpt-image-1, do not assign response_format at all
                                openaiParams.quality = (["low", "medium", "high"].includes(quality)) ? quality : "low";
                                openaiParams.size = (["1024x1024", "1024x1536", "1536x1024"].includes(size)) ? size : "1024x1024";
                            } else {
                                throw new Error(`Unsupported OpenAI image model: '${model}'. Please use 'dall-e-2', 'dall-e-3', or 'gpt-image-1'.`);
                            }
                            logger.info("[ImageGen] Calling OpenAI images.generate with params:", openaiParams);
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const openaiRes = await openai.images.generate(openaiParams as any);
                            if (openaiRes && openaiRes.data && openaiRes.data[0]) {
                                if (openaiRes.data[0].url) {
                                    imageUrl = openaiRes.data[0].url;
                                    logger.info(`[ImageGen] Image generated (url): ${imageUrl}`);
                                } else if (openaiRes.data[0].b64_json) {
                                    // For gpt-image-1, upload the image to storage and return a public URL
                                    const imageBuffer = Buffer.from(openaiRes.data[0].b64_json, "base64");
                                    const imageFileName = `conversations/${conversationId}/images/${messageId}_${agentToRespond}.png`;
                                    const file = storageBucket.file(imageFileName);
                                    await file.save(imageBuffer, { metadata: { contentType: "image/png" } });
                                    await file.makePublic();
                                    imageUrl = file.publicUrl();
                                    logger.info(`[ImageGen] Image generated and uploaded for gpt-image-1: ${imageUrl}`);
                                } else {
                                    throw new Error("No image URL or b64_json returned from OpenAI image generation.");
                                }
                            } else {
                                throw new Error("No image data returned from OpenAI image generation.");
                            }
                        } else if (provider === "google") {
                            const googleApiKeyRef = conversationData.apiSecretVersions["google_ai"];
                            if (!googleApiKeyRef) throw new Error("Google AI API key reference not found for image generation.");
                            const googleApiKey = await getApiKeyFromSecret(googleApiKeyRef);
                            if (!googleApiKey) throw new Error("getApiKeyFromSecret returned null for Google AI image generation.");
    
                            const genAI = new GoogleGenAI({ apiKey: googleApiKey });
                            const model = imageGenSettings.model || "imagen-4.0-generate-preview-06-06";
                            const aspectRatio = imageGenSettings.size || "1:1";
                            
                            // Map quality to number of images (1-4)
                            // const qualityToImages: Record<string, number> = {
                            //     low: 4,
                            //     medium: 2,
                            //     high: 1
                            // };
                            // const numberOfImages = qualityToImages[imageGenSettings.quality] || 1;
    
                            // Generate images using the Imagen model with proper type safety
                            const response = await genAI.models.generateImages({
                                model: model,
                                prompt: imagePrompt,
                                config: {
                                    numberOfImages: 1, 
                                    aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
                                    personGeneration: PersonGeneration.ALLOW_ADULT // Using enum for type safety
                                },
                            });
    
                            // Process the response with proper null checks
                            if (!response.generatedImages || response.generatedImages.length === 0) {
                                throw new Error("No images were generated by Google Imagen.");
                            }
    
                            // Take the first image
                            const generatedImage = response.generatedImages[0];
                            if (!generatedImage?.image?.imageBytes) {
                                throw new Error("Generated image is missing required data.");
                            }
                            
                            // Upload to storage and get public URL
                            const imageBuffer = Buffer.from(generatedImage.image.imageBytes, "base64");
                                const imageFileName = `conversations/${conversationId}/images/${messageId}_${agentToRespond}.png`;
                                const file = storageBucket.file(imageFileName);
                                await file.save(imageBuffer, { 
                                    metadata: { 
                                        contentType: "image/png",
                                        metadata: {
                                            model: model,
                                            prompt: imagePrompt.substring(0, 100) + (imagePrompt.length > 100 ? "..." : "")
                                        }
                                    } 
                                });
                                await file.makePublic();
                                imageUrl = file.publicUrl();
                                logger.info(`[ImageGen] Image generated and uploaded for ${model}: ${imageUrl}`);
                        } else if (provider === "togetherai") {
                            const togetherAiApiKeyRef = conversationData.apiSecretVersions["together_ai"];
                            if (!togetherAiApiKeyRef) throw new Error("TogetherAI API key reference not found for image generation.");
                            const togetherAiApiKey = await getApiKeyFromSecret(togetherAiApiKeyRef);
                            if (!togetherAiApiKey) throw new Error("getApiKeyFromSecret returned null for TogetherAI image generation.");

                            const model = imageGenSettings.model || "black-forest-labs/FLUX.1-schnell-Free";
                            const steps = 4; // Default number of steps
                            const n = 1; // Number of images to generate
                            
                            logger.info(`[ImageGen] Initializing TogetherAI client for model: ${model}`);
                            const together = new Together({ apiKey: togetherAiApiKey });
                            
                            try {
                                logger.info(`[ImageGen] Generating image with TogetherAI (model: ${model}, steps: ${steps})`);
                                const response = await together.images.create({
                                    model: model,
                                    prompt: imagePrompt,
                                    steps: steps,
                                    n: n
                                });

                                if (response?.data?.[0]) {
                                    const imageData = response.data[0];
                                    
                                    // Define the expected response type
                                    type TogetherAIImageResponse = {
                                        url: string;
                                        // Add other fields if they exist in the response
                                    };

                                    // Check if we have a URL in the response
                                    const imageResponse = imageData as TogetherAIImageResponse;
                                    if (imageResponse?.url) {
                                        // Download the image from the URL
                                        const imageDownload = await axios.get(imageResponse.url, { responseType: "arraybuffer" });
                                        const imageBuffer = Buffer.from(imageDownload.data, "binary");
                                        const imageFileName = `conversations/${conversationId}/images/${messageId}_${agentToRespond}.png`;
                                        const file = storageBucket.file(imageFileName);
                                        await file.save(imageBuffer, { 
                                            metadata: { 
                                                contentType: "image/png",
                                                metadata: {
                                                    model: model,
                                                    prompt: imagePrompt.substring(0, 100) + (imagePrompt.length > 100 ? "..." : "")
                                                }
                                            } 
                                        });
                                        await file.makePublic();
                                        imageUrl = file.publicUrl();
                                        logger.info(`[ImageGen] Image generated and uploaded for ${model}: ${imageUrl}`);
                                    } else {
                                        throw new Error("No base64 image data returned from TogetherAI image generation.");
                                    }
                                } else {
                                    throw new Error("No image data returned from TogetherAI image generation.");
                                }
                            } catch (error) {
                                logger.error("[ImageGen] Error in TogetherAI image generation:", error);
                                throw new Error(`TogetherAI image generation failed: ${error instanceof Error ? error.message : String(error)}`);
                            }
                        } else {
                            throw new Error(`Image generation provider not implemented: ${imageGenSettings.provider}`);
                        }
                    } catch (err) {
                        imageGenError = err instanceof Error ? err.message : String(err);
                        logger.error("[ImageGen] Error:", err);
                        imageUrl = null;
                    }
                    const imageGenEnd = Date.now();
                    logger.info(`[ImageGen] Image generation for messageId: ${messageId} took ${imageGenEnd - imageGenStart}ms`);
                }
            } catch (err) {
                imageGenError = err instanceof Error ? err.message : String(err);
                logger.error("[ImageGen] Outer Error:", err);
                imageUrl = null;
            }
            return { imageUrl, imageGenError };
        }
        // --- END IMAGE GENERATION LOGIC ---

        // --- TTS LOGIC (existing, unchanged) ---
        async function runTTS() {
            let audioUrl: string | null = null;
            let ttsWasSplit = false;
            if (ttsSettings?.enabled && agentSettings && agentSettings.provider !== "none" && agentSettings.voice && textToSpeak) {
                let audioBuffer: Buffer | null = null;
                let ttsApiKey: string | null = null;
                const ttsApiKeyId = getTTSApiKeyId(agentSettings.provider); // Get the correct key ID for TTS
                if (!ttsApiKeyId) {
                    logger.error(`[TTS Error] Unsupported TTS provider or no API key ID mapping for: ${agentSettings.provider}. Skipping TTS.`);
                } else {
                    const ttsSecretVersionName = conversationData.apiSecretVersions[ttsApiKeyId];
                    logger.info(`[TTS Key Check] Provider: ${agentSettings.provider}, Key ID: ${ttsApiKeyId}, Version Ref: ${ttsSecretVersionName}`);
                    if (!ttsSecretVersionName) {
                        logger.error(`[TTS Error] TTS selected, but API key reference ('${ttsApiKeyId}') missing in apiSecretVersions. Skipping TTS.`);
                    } else {
                        ttsApiKey = await getApiKeyFromSecret(ttsSecretVersionName);
                        if (!ttsApiKey) {
                            logger.error(`[TTS Error] Failed to retrieve API key for TTS (provider: ${agentSettings.provider}, version: ${ttsSecretVersionName}). Skipping TTS.`);
                        } else {
                             logger.info(`[TTS Key Check] Successfully retrieved API key for TTS provider: ${agentSettings.provider}.`);
                        }
                    }
                }
                if (ttsApiKey && agentSettings && agentSettings.voice) {
                    // --- New: TTS Input Splitting Logic ---
                    const ttsModel = getBackendTTSModelById(agentSettings.selectedTtsModelId || agentSettings.ttsApiModelId || "");
                    let inputLimitType = "characters";
                    let inputLimitValue = 4096;
                    let encodingName = "cl100k_base";
                    if (ttsModel) {
                      inputLimitType = ttsModel.inputLimitType;
                      inputLimitValue = ttsModel.inputLimitValue;
                      if (ttsModel.encodingName) encodingName = ttsModel.encodingName;
                    }
                    // Split text as needed
                    const ttsChunks = getTTSInputChunks(
                      textToSpeak,
                      inputLimitType as import("./tts_models").TTSInputLimitType,
                      inputLimitValue,
                      encodingName as import("@dqbd/tiktoken").TiktokenEncoding | undefined
                    );
                    if (ttsChunks.length > 1) {
                      ttsWasSplit = true;
                      logger.info(`[TTS Split] Text for ${agentToRespond} split into ${ttsChunks.length} chunks for TTS model ${ttsModel?.name || agentSettings.selectedTtsModelId}`);
                    }
                    // Generate audio for each chunk and concatenate if possible
                    const audioBuffers: Buffer[] = [];
                    for (let i = 0; i < ttsChunks.length; i++) {
                      const chunkText = ttsChunks[i];
                      let chunkBuffer: Buffer | null = null;
                      try {
                        if (agentSettings.provider === "openai") {
                          const openAIVoice = agentSettings.voice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
                          const openAIModelApiId = agentSettings.selectedTtsModelId === "openai-tts-1-hd" ? "tts-1-hd" :
                                                   agentSettings.selectedTtsModelId === "openai-gpt-4o-mini-tts" ? "tts-1" :
                                                   "tts-1";
                          const openai = new OpenAI({ apiKey: ttsApiKey });
                          logger.info(`[TTS Debug] chunkText type: ${typeof chunkText}, isBuffer: ${Buffer.isBuffer(chunkText)}, value:`, chunkText);
                          const mp3 = await openai.audio.speech.create({
                            model: openAIModelApiId,
                            voice: openAIVoice,
                            input: chunkText,
                            response_format: "mp3",
                          });
                          chunkBuffer = Buffer.from(await mp3.arrayBuffer());
                        } else if (agentSettings.provider === "google-cloud") {
                          if (!textToSpeechClient) throw new Error("Google TextToSpeechClient not initialized");
                          const googleVoiceName = agentSettings.voice;
                          const languageCode = googleVoiceName.split("-").slice(0, 2).join("-");
                          const request = {
                            input: { text: chunkText },
                            voice: { languageCode: languageCode, name: googleVoiceName },
                            audioConfig: { audioEncoding: "MP3" as const },
                          };
                          const [response] = await textToSpeechClient.synthesizeSpeech(request);
                          if (response.audioContent instanceof Uint8Array) {
                            chunkBuffer = Buffer.from(response.audioContent);
                          } else {
                            throw new Error("Google TTS audio content is not Uint8Array");
                          }
                        } else if (agentSettings.provider === "google-gemini") {
                          const geminiVoiceId = agentSettings.voice;
                          const geminiModelApiId = agentSettings.ttsApiModelId || agentSettings.selectedTtsModelId;
                          const ttsModelName = geminiModelApiId && geminiModelApiId.includes("tts") ? geminiModelApiId : "gemini-2.5-flash-preview-tts";
                          const geminiTtsApiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${ttsModelName}:generateContent?key=${ttsApiKey}`;
                          const geminiTtsRequestBody = {
                            contents: [{ parts: [{ text: chunkText }] }],
                            generationConfig: {
                              responseModalities: ["AUDIO"],
                              speechConfig: {
                                voiceConfig: { prebuiltVoiceConfig: { voiceName: geminiVoiceId } }
                              }
                            }
                          };
                          const geminiResponse = await axios({
                            method: "post",
                            url: geminiTtsApiEndpoint,
                            headers: { "Content-Type": "application/json" },
                            data: geminiTtsRequestBody,
                            responseType: "json",
                            timeout: 300000,
                          });
                          if (geminiResponse.data &&
                            geminiResponse.data.candidates &&
                            geminiResponse.data.candidates[0] &&
                            geminiResponse.data.candidates[0].content &&
                            geminiResponse.data.candidates[0].content.parts &&
                            geminiResponse.data.candidates[0].content.parts[0] &&
                            geminiResponse.data.candidates[0].content.parts[0].inlineData &&
                            geminiResponse.data.candidates[0].content.parts[0].inlineData.data) {
                            const audioData = geminiResponse.data.candidates[0].content.parts[0].inlineData.data;
                            const rawPcmBuffer = Buffer.from(audioData, "base64");
                            chunkBuffer = createWavBuffer(rawPcmBuffer, 1, 24000, 16);
                          } else {
                            throw new Error("Gemini TTS: No audio data in response or invalid response structure");
                          }
                        } else if (agentSettings.provider === "elevenlabs") {
                          const elevenLabsVoiceId = agentSettings.voice;
                          let modelId = "eleven_multilingual_v2";
                          if (agentSettings.selectedTtsModelId === "elevenlabs-flash-v2-5") {
                            modelId = "eleven_flash_v2_5";
                          } else if (agentSettings.selectedTtsModelId === "elevenlabs-turbo-v2-5") {
                            modelId = "eleven_turbo_v2_5";
                          }
                          const elevenlabsApiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}`;
                          const headers = {
                            "xi-api-key": ttsApiKey,
                            "Content-Type": "application/json",
                            "Accept": "audio/mpeg"
                          };
                          const requestBody = {
                            text: chunkText,
                            model_id: modelId,
                            voice_settings: { stability: 0.5, similarity_boost: 0.75 }
                          };
                          const response = await axios({
                            method: "post",
                            url: elevenlabsApiUrl,
                            headers: headers,
                            data: requestBody,
                            responseType: "arraybuffer"
                          });
                          if (response.data) {
                            chunkBuffer = Buffer.from(response.data);
                          } else {
                            throw new Error("ElevenLabs TTS: No audio data returned");
                          }
                        }
                      } catch (err) {
                        logger.error(`[TTS Chunk Error] Failed to generate audio for chunk ${i + 1}/${ttsChunks.length}:`, err);
                        chunkBuffer = null;
                      }
                      if (chunkBuffer) audioBuffers.push(chunkBuffer);
                    }
                    // Concatenate audio buffers if possible (for MP3, just Buffer.concat; for WAV, also Buffer.concat)
                    if (audioBuffers.length > 0) {
                      audioBuffer = Buffer.concat(audioBuffers);
                      // ttsGenerated = true; // This line is removed as per the edit hint.
                    }
                }
                if (ttsApiKey && agentSettings && agentSettings.voice) {
                    if (audioBuffer) {
                        logger.info("[TTS Upload] Attempting to upload audio buffer...");
                        const currentMessageId = admin.firestore().collection("dummy").doc().id;
                        let fileExtension = "mp3";
                        let contentType = "audio/mpeg";
                        if (agentSettings.provider === "google-gemini") {
                            fileExtension = "wav";
                            contentType = "audio/wav";
                            logger.info("[TTS Upload] Using WAV format for Google Gemini TTS");
                        }
                        const audioFileName = `conversations/${conversationId}/audio/${currentMessageId}_${agentToRespond}.${fileExtension}`;
                        const file = storageBucket.file(audioFileName);
                        await file.save(audioBuffer, { metadata: { contentType: contentType } });
                        await file.makePublic();
                        audioUrl = file.publicUrl();
                        logger.info(`[TTS Upload Success] TTS audio uploaded for ${agentToRespond} to: ${audioUrl}`);
                    } else {
                        logger.warn("[TTS Upload Skip] No audio buffer generated, skipping upload.");
                    }
                }
            }
            return { audioUrl, ttsWasSplit };
        }
        // --- END TTS LOGIC ---

        // --- Run TTS and image generation in parallel ---
        const [ttsResult, imageResult] = await Promise.all([
            runTTS(),
            runImageGen()
        ]);
        // --- END PARALLEL ---
        logger.info(`[Orchestrator] TTS and image generation complete for messageId: ${messageId}`, { ttsResult, imageResult });

        // --- Write Firestore message only after both are ready ---
        const nextTurn = agentToRespond === "agentA" ? "agentB" : "agentA";
        const responseMessage: { role: string; content: string; timestamp: FieldValue; audioUrl?: string | null; ttsWasSplit?: boolean; imageUrl?: string | null; imageGenError?: string | null } = {
            role: agentToRespond, content: responseContent, timestamp: admin.firestore.FieldValue.serverTimestamp(),
        };
        if (ttsResult.audioUrl) { responseMessage.audioUrl = ttsResult.audioUrl; }
        if (ttsResult.ttsWasSplit) { responseMessage.ttsWasSplit = true; }
        if (imageResult.imageUrl !== undefined) { responseMessage.imageUrl = imageResult.imageUrl; }
        if (imageResult.imageGenError !== undefined) { responseMessage.imageGenError = imageResult.imageGenError; }
        logger.info(`[Orchestrator] Writing Firestore message for messageId: ${messageId}`, { responseMessage });
        // Fetch the last message
        const lastMsgSnap = await messagesRef.orderBy("timestamp", "desc").limit(1).get();
        const lastMessage = !lastMsgSnap.empty ? lastMsgSnap.docs[0].data() : null;
        if (lastMessage && lastMessage.role === agentToRespond) {
            logger.warn(`[Resume/Duplicate Prevention] Last message is already from ${agentToRespond}. Skipping agent response generation.`);
            return;
        }

        try {
            await messagesRef.doc(messageId).set(responseMessage);
            logger.info(`Agent ${agentToRespond} response saved to Firestore (message ID: ${messageId}). TTS and image generation complete.`);
            const updateData: { lastActivity: FieldValue; turn?: string } = {
                lastActivity: admin.firestore.FieldValue.serverTimestamp()
            };
            updateData.turn = nextTurn;
            logger.info(`Updating turn to ${nextTurn} for conversation ${conversationId}.`);
            await conversationRef.update(updateData);
            logger.info(`Conversation ${conversationId} updated after ${agentToRespond}'s turn.`);
        } catch (err) {
            logger.error(`Failed to write agent response to Firestore (message ID: ${messageId}):`, err);
            throw err; // Re-throw to be caught by the outer catch
        }
    } catch (error) {
        logger.error(`Error in _triggerAgentResponse for ${conversationId} (${agentToRespond}):`, error);
        try {
            await conversationRef.update({
                status: "error",
                errorContext: `Error during ${agentToRespond}'s turn: ${error instanceof Error ? error.message : String(error)}`.substring(0, 1000),
                lastActivity: admin.firestore.FieldValue.serverTimestamp()
            });
        } catch (updateError) {
            logger.error(`Failed to update conversation ${conversationId} status to "error" after processing failure:`, updateError);
        }
        throw error; // Re-throw to ensure the finally block runs
    } finally {
        // Clear processing lock
        try {
            await conversationRef.update({
                processingTurnFor: admin.firestore.FieldValue.delete()
            });
            logger.info(`Cleared processing lock for ${agentToRespond} in conversation ${conversationId}`);
        } catch (error) {
            logger.error(`Failed to clear processing lock for ${agentToRespond} in conversation ${conversationId}:`, error);
        }
    }
}
// --- End _triggerAgentResponse ---


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

    await _triggerAgentResponse(conversationId, agentToRespond, conversationRef, messagesRef);

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
        logger.info(`requestNextTurn: Triggering agent response for ${currentTurn}`);
        await _triggerAgentResponse(conversationId, currentTurn, conversationRef, messagesRef);
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
    logger.info(`onConversationProgressUpdate: Triggering agent response for ${currentTurn}`);
    await _triggerAgentResponse(conversationId, currentTurn, conversationRef, messagesRef);
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
