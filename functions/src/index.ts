// functions/src/index.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { FieldValue, DocumentReference, CollectionReference } from "firebase-admin/firestore"; // Correct import
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { getStorage } from "firebase-admin/storage";

// --- TTS Client Imports ---
import OpenAI from "openai";

// LangChain Imports
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

// --- Interfaces ---
type TTSProviderId = "openai"; // Only OpenAI is left for now
interface AgentTTSSettings { provider: TTSProviderId; voice: string | null; }
interface ConversationTTSSettings { enabled: boolean; agentA: AgentTTSSettings; agentB: AgentTTSSettings; }
interface LLMInfo { id: string; provider: "OpenAI" | "Google" | "Anthropic" | "Mistral" | "Cohere"; apiKeySecretName: string; }
interface GcpError extends Error { code?: number | string; details?: string; }
interface ConversationData {
    agentA_llm: string; agentB_llm: string; turn: "agentA" | "agentB";
    apiSecretVersions: { [key: string]: string }; status?: "running" | "stopped" | "error";
    userId?: string; ttsSettings?: ConversationTTSSettings; waitingForTTSEndSignal?: boolean;
    errorContext?: string;
}
// --- End Interfaces ---

// --- Helper Functions (Defined ONCE) ---
// Determines the LLM provider based on the model ID prefix
function getProviderFromId(id: string): LLMInfo["provider"] | null {
     // Using exact match for o3 and o4-mini for clarity
     if (id.startsWith("gpt-") || id === "o4-mini" || id === "o3") return "OpenAI";
     if (id.startsWith("gemini-")) return "Google";
     if (id.startsWith("claude-")) return "Anthropic";
     logger.warn(`Could not determine provider from model ID prefix/name: ${id}`);
     return null;
}
// Maps the LLM provider to the key ID used in Firestore/Secret Manager
function getFirestoreKeyIdFromProvider(provider: LLMInfo["provider"] | null): string | null {
    if (provider === "OpenAI") return "openai";
    if (provider === "Google") return "google_ai";
    if (provider === "Anthropic") return "anthropic";
    logger.warn(`Could not map provider to Firestore key ID: ${provider}`);
    return null;
}
// Fetches an API key from Google Secret Manager using its version name
async function getApiKeyFromSecret(secretVersionName: string): Promise<string | null> {
     if (!secretManagerClient) {
        logger.error("Secret Manager Client is null in getApiKeyFromSecret.");
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
// Stores an API key in Google Secret Manager and returns the version name
async function storeApiKeyAsSecret(userId: string, service: string, apiKey: string): Promise<string> {
    const currentProjectId = process.env.GCLOUD_PROJECT;
    if (!currentProjectId) {
        logger.error("GCLOUD_PROJECT env var missing inside storeApiKeyAsSecret.");
        throw new HttpsError("internal", "Project ID not configured for Secret Manager.");
    }
     if (!secretManagerClient) {
        logger.error("Secret Manager Client is not initialized in storeApiKeyAsSecret.");
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
    const secretId = `user-${sanitizedUserId}-${sanitizedService}-key`;
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
            if (grpcCode === 5) { // GRPC code 5 = NOT_FOUND
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

// --- Initialization ---
if (admin.apps.length === 0) {
  admin.initializeApp();
  logger.info("Firebase Admin SDK Initialized in Cloud Function.");
}
const db = admin.firestore();
const defaultBucketName = process.env.FIREBASE_STORAGE_BUCKET || "two-ais.firebasestorage.app";
const storageBucket = getStorage().bucket(defaultBucketName);
logger.info(`Using Storage bucket: ${defaultBucketName}`);

let secretManagerClient: SecretManagerServiceClient | null = null;
try {
    secretManagerClient = new SecretManagerServiceClient();
    logger.info("Secret Manager Client Initialized.");
} catch(error) {
    logger.error("Failed to initialize Secret Manager Client:", error);
}
const projectId = process.env.GCLOUD_PROJECT;
if (!projectId) {
    logger.warn("GCLOUD_PROJECT environment variable not set.");
}
// --- End Initialization ---


// --- Cloud Function: saveApiKey ---
export const saveApiKey = onCall<{ service: string; apiKey: string }, Promise<{ message: string; service: string }>>(
    { region: "us-central1" },
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

    let conversationData: ConversationData;
    let llmApiKey: string | null = null; // Separate key for LLM

    try {
        // 1. Get Conversation Data
        const conversationSnap = await conversationRef.get();
        if (!conversationSnap.exists) {
            logger.error(`Conversation ${conversationId} not found in _triggerAgentResponse.`);
            return;
        }
        conversationData = conversationSnap.data()!;

        // 2. Check Status & TTS Signal
        if (conversationData.status !== "running" || conversationData.waitingForTTSEndSignal === true) {
             logger.info(`Conversation ${conversationId} status is ${conversationData.status} or waitingForTTSEndSignal is true. Aborting _triggerAgentResponse.`);
             return;
        }

        // 3. Fetch Message History
        let historyMessages: BaseMessage[] = [];
        try {
            const historyQuery = messagesRef.orderBy("timestamp", "desc").limit(20);
            const historySnap = await historyQuery.get();
            historyMessages = historySnap.docs.map((doc) => {
                const data = doc.data() as { role: string; content: string };
                if (data.role === agentToRespond) return new AIMessage({ content: data.content });
                if (["agentA", "agentB", "user", "system"].includes(data.role)) return new HumanMessage({ content: data.content });
                logger.warn(`Unknown role found in history: ${data.role}`); return null;
            }).filter((msg): msg is BaseMessage => msg !== null).reverse();
            logger.info(`Fetched ${historyMessages.length} messages for history in _triggerAgentResponse.`);
        } catch (error) { throw new Error(`Failed to fetch message history: ${error}`); }

        // 4. Get LLM API Key
        const agentModelId = agentToRespond === "agentA" ? conversationData.agentA_llm : conversationData.agentB_llm;
        const llmProvider = getProviderFromId(agentModelId); // Uses updated function
        const llmFirestoreKeyId = getFirestoreKeyIdFromProvider(llmProvider);
        if (!llmProvider || !llmFirestoreKeyId) { throw new Error(`Invalid LLM configuration ID "${agentModelId}" for ${agentToRespond}.`); }
        const llmSecretVersionName = conversationData.apiSecretVersions[llmFirestoreKeyId];
        if (!llmSecretVersionName) { throw new Error(`API key reference missing for ${agentToRespond} (${llmProvider}). Check Firestore user data.`); }
        try {
            llmApiKey = await getApiKeyFromSecret(llmSecretVersionName);
            if (!llmApiKey) { throw new Error(`getApiKeyFromSecret returned null for LLM version ${llmSecretVersionName}`); }
            logger.info(`Successfully retrieved API key for LLM provider ${llmProvider} in _triggerAgentResponse.`);
        } catch(error) { throw new Error(`Failed to retrieve API key for ${agentToRespond} (${llmProvider}): ${error}`); }

        // 5. Initialize LLM Model
        let chatModel: BaseChatModel;
        try {
            const modelName = agentModelId;
            if (llmProvider === "OpenAI") chatModel = new ChatOpenAI({ apiKey: llmApiKey, modelName: modelName });
            else if (llmProvider === "Google") chatModel = new ChatGoogleGenerativeAI({ apiKey: llmApiKey, model: modelName });
            else if (llmProvider === "Anthropic") chatModel = new ChatAnthropic({ apiKey: llmApiKey, modelName: modelName });
            else throw new Error(`Unsupported provider configuration: ${llmProvider}`);
            logger.info(`Initialized ${llmProvider} model: ${modelName} for ${agentToRespond} in _triggerAgentResponse`);
        } catch (error) { throw new Error(`Failed to initialize LLM "${agentModelId}" for ${agentToRespond}: ${error}`); }

        // 6. Call LLM
        let responseContent: string | null = null;
        try {
            logger.info(`Invoking ${agentToRespond} (${agentModelId}) with ${historyMessages.length} history messages in _triggerAgentResponse...`);
            const aiResponse = await chatModel.invoke(historyMessages);
            if (typeof aiResponse.content === "string") responseContent = aiResponse.content;
            else if (Array.isArray(aiResponse.content)) responseContent = aiResponse.content.map(item => typeof item === "string" ? item : JSON.stringify(item)).join("\n");
            else responseContent = String(aiResponse.content);
            if (!responseContent || responseContent.trim() === "") responseContent = "(No content returned)";
            logger.info(`Received response from ${agentToRespond} in _triggerAgentResponse: ${responseContent.substring(0,100)}...`);
        } catch (error) {
            // --- Enhanced LLM Error Logging ---
            logger.error(`LLM call failed for ${agentToRespond} (${agentModelId}). Raw Error:`, error); // Log the raw error object
            const errorMessage = error instanceof Error ? error.message : String(error);
            // Log specific properties if available (e.g., from OpenAI errors)
            if (error && typeof error === "object") {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const errorDetails = error as any;
                // --- LINT FIX: Changed template literal to string concatenation ---
                logger.error("LLM Error Details: Status=" + errorDetails.status + ", Code=" + errorDetails.code + ", Param=" + errorDetails.param + ", Type=" + errorDetails.type);
            }
            // Throw a new error with combined info
            throw new Error(`LLM call failed for ${agentToRespond} (${agentModelId}). Error: ${errorMessage}`);
            // --- End Enhanced LLM Error Logging ---
        }

        // 6.5: Generate TTS Audio (if enabled and configured)
        let audioUrl: string | null = null;
        let ttsGenerated = false;
        const ttsSettings = conversationData.ttsSettings;
        const agentSettings = agentToRespond === "agentA" ? ttsSettings?.agentA : ttsSettings?.agentB;

        // --- Enhanced Logging Start ---
        logger.info(`[TTS Check] Agent: ${agentToRespond}, Global TTS Enabled: ${ttsSettings?.enabled}, Agent Provider: ${agentSettings?.provider}`);
        // Check if TTS should proceed
        if (ttsSettings?.enabled && agentSettings && agentSettings.provider === "openai") {
            const textToSpeak = responseContent;
            const selectedVoice = agentSettings.voice;
            logger.info(`[TTS Attempt] Provider: ${agentSettings.provider}, Voice: ${selectedVoice}, Text Length: ${textToSpeak?.length}`);
            try {
                let audioBuffer: Buffer | null = null;
                let ttsApiKey: string | null = null;
                // --- Explicitly get the 'openai' key reference ---
                const ttsSecretVersionName = conversationData.apiSecretVersions["openai"];
                logger.info(`[TTS Key Check] Looking for OpenAI key version: ${ttsSecretVersionName}`);

                if (!ttsSecretVersionName) {
                    logger.error("[TTS Error] OpenAI TTS selected, but OpenAI API key reference ('openai') missing in apiSecretVersions. Skipping TTS.");
                } else {
                    ttsApiKey = await getApiKeyFromSecret(ttsSecretVersionName);
                    if (!ttsApiKey) {
                        logger.error(`[TTS Error] Failed to retrieve OpenAI API key for TTS (version: ${ttsSecretVersionName}). Skipping TTS.`);
                    } else {
                         logger.info("[TTS Key Check] Successfully retrieved OpenAI API key for TTS.");
                    }
                }

                if (ttsApiKey && selectedVoice) {
                    logger.info("[TTS API Call] Initializing OpenAI client for TTS...");
                    let openai: OpenAI | null = null; // Declare outside try
                    try {
                        openai = new OpenAI({ apiKey: ttsApiKey });
                        logger.info("[TTS API Call] OpenAI client initialized. Calling audio.speech.create...");
                        const mp3 = await openai.audio.speech.create({
                            model: "tts-1",
                            voice: selectedVoice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer",
                            input: textToSpeak,
                            response_format: "mp3",
                        });
                        logger.info("[TTS API Call] audio.speech.create successful.");
                        audioBuffer = Buffer.from(await mp3.arrayBuffer());
                        logger.info(`[TTS Success] OpenAI TTS generated for ${agentToRespond}. Voice: ${selectedVoice}`);
                    } catch (openaiClientError) {
                         logger.error("[TTS API Call Error] Error during OpenAI client init or speech creation:", openaiClientError);
                         if (openaiClientError instanceof Error) {
                             logger.error(`[TTS API Call Error Details] Name: ${openaiClientError.name}, Message: ${openaiClientError.message}, Stack: ${openaiClientError.stack}`);
                         }
                         audioBuffer = null; // Ensure buffer is null on error
                    }
                } else {
                    if (!selectedVoice) logger.warn("[TTS Skip] OpenAI TTS selected but no voice specified.");
                    if (!ttsApiKey) logger.warn("[TTS Skip] OpenAI TTS selected but API key was not retrieved.");
                }
                // --- End Enhanced Logging ---

                // Upload audio buffer to Firebase Storage if generated
                if (audioBuffer) {
                    logger.info("[TTS Upload] Attempting to upload audio buffer...");
                    const currentMessageId = admin.firestore().collection("dummy").doc().id;
                    const audioFileName = `conversations/${conversationId}/audio/${currentMessageId}_${agentToRespond}.mp3`;
                    const file = storageBucket.file(audioFileName);
                    await file.save(audioBuffer, { metadata: { contentType: "audio/mpeg" } });
                    await file.makePublic();
                    audioUrl = file.publicUrl();
                    ttsGenerated = true;
                    logger.info(`[TTS Upload Success] TTS audio uploaded for ${agentToRespond} to: ${audioUrl}`);
                } else {
                     logger.warn("[TTS Upload Skip] No audio buffer generated, skipping upload.");
                }
            } catch (ttsError) { // Catch errors specifically in the TTS block
                logger.error(`[TTS Block Error] Error during TTS generation or upload for ${agentToRespond} (${agentSettings.provider}):`, ttsError);
                audioUrl = null; ttsGenerated = false; // Reset on error
            }
        } else {
             logger.info(`[TTS Skip] Conditions not met. Global enabled: ${ttsSettings?.enabled}, Provider: ${agentSettings?.provider}`);
        }

        // 7. Write Response & Update Conversation State
        const nextTurn = agentToRespond === "agentA" ? "agentB" : "agentA";
        const responseMessage: { role: string; content: string; timestamp: FieldValue; audioUrl?: string | null } = {
            role: agentToRespond, content: responseContent, timestamp: admin.firestore.FieldValue.serverTimestamp(),
        };
        if (audioUrl) { responseMessage.audioUrl = audioUrl; }

        try {
            const messageDocRef = await messagesRef.add(responseMessage);
            logger.info(`Agent ${agentToRespond} response saved (message ID: ${messageDocRef.id}). TTS generated: ${ttsGenerated}`);
            const updateData: { lastActivity: FieldValue; turn?: string; waitingForTTSEndSignal?: boolean } = {
                lastActivity: admin.firestore.FieldValue.serverTimestamp()
            };
            if (ttsGenerated) {
                updateData.waitingForTTSEndSignal = true;
                logger.info(`Setting waitingForTTSEndSignal = true for conversation ${conversationId}.`);
            } else {
                updateData.turn = nextTurn;
                updateData.waitingForTTSEndSignal = false;
                logger.info(`No TTS generated or TTS disabled. Updating turn to ${nextTurn} immediately.`);
            }
            await conversationRef.update(updateData);
            logger.info(`Conversation ${conversationId} updated after ${agentToRespond}'s turn. Waiting for TTS signal: ${ttsGenerated}`);
        } catch (error) { throw new Error(`Failed to save ${agentToRespond}'s response or update conversation state: ${error}`); }

        // 8. Handle Stopping Conditions (Placeholder)

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
    }
}
// --- End _triggerAgentResponse ---


// --- Cloud Function: orchestrateConversation ---
export const orchestrateConversation = onDocumentCreated("conversations/{conversationId}/messages/{messageId}", async (event) => {
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
         if (conversationData.waitingForTTSEndSignal === true) {
            logger.info(`Conversation ${conversationId} is waiting for TTS end signal. Exiting orchestrator (onDocumentCreated).`);
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


// --- Cloud Function: requestNextTurn ---
export const requestNextTurn = onCall<{ conversationId: string }, Promise<{ success: boolean; message: string }>>(
    { region: "us-central1" },
    async (request) => {
        logger.info("--- requestNextTurn Function Execution Start ---", { structuredData: true });

        if (!request.auth?.uid) {
            logger.error("Authentication check failed: No auth context.");
            throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
        }
        const userId = request.auth.uid;
        const { conversationId } = request.data;

        if (!conversationId || typeof conversationId !== "string") {
            throw new HttpsError("invalid-argument", "Conversation ID is required.");
        }

        logger.info(`Processing requestNextTurn for user: ${userId}, conversation: ${conversationId}`);
        const conversationRef = db.collection("conversations").doc(conversationId) as DocumentReference<ConversationData>;
        const messagesRef = conversationRef.collection("messages");

        try {
            let nextTurn: "agentA" | "agentB" | null = null;

            await db.runTransaction(async (transaction) => {
                const convSnap = await transaction.get(conversationRef);
                if (!convSnap.exists) {
                    logger.error(`Conversation document ${conversationId} not found in transaction.`);
                    throw new HttpsError("not-found", "Conversation not found.");
                }

                const data = convSnap.data();
                if (!data) {
                     logger.error(`Conversation document ${conversationId} has no data in transaction.`);
                     throw new HttpsError("internal", "Conversation data missing.");
                }

                if (data.userId !== userId) {
                     logger.error(`User ${userId} attempted to trigger next turn for conversation ${conversationId} owned by ${data.userId}.`);
                     throw new HttpsError("permission-denied", "You do not have permission to modify this conversation.");
                }

                if (data.waitingForTTSEndSignal !== true) {
                    logger.warn(`Received next turn request for ${conversationId}, but it wasn't waiting for a TTS signal (flag is ${data.waitingForTTSEndSignal}). Ignoring.`);
                    nextTurn = null;
                    return;
                }

                const messagesQuery = messagesRef.orderBy("timestamp", "desc").limit(1);
                const lastMessageSnap = await transaction.get(messagesQuery);

                if (lastMessageSnap.empty) {
                     logger.warn(`No messages found in ${conversationId} when determining next turn after TTS signal. Defaulting to agentA.`);
                     nextTurn = "agentA";
                } else {
                     const lastMessageRole = lastMessageSnap.docs[0].data().role;
                     nextTurn = lastMessageRole === "agentA" ? "agentB" : "agentA";
                }
                logger.info(`Determined next turn for ${conversationId} after TTS signal is: ${nextTurn}`);

                transaction.update(conversationRef, {
                    waitingForTTSEndSignal: false,
                    turn: nextTurn,
                    lastActivity: admin.firestore.FieldValue.serverTimestamp()
                });
                logger.info(`Cleared waitingForTTSEndSignal flag and set turn to ${nextTurn} for conversation ${conversationId}.`);
            }); // End Transaction

            if (nextTurn !== null) {
                 logger.info(`Signalling agent ${nextTurn} to respond for ${conversationId} via requestNextTurn.`);
                 await _triggerAgentResponse(conversationId, nextTurn, conversationRef, messagesRef);
            } else {
                 logger.info("No next turn determined or state not updated in transaction, not triggering agent response.");
            }

            return { success: true, message: "Conversation turn advanced and next agent triggered." };

        } catch (error) {
            logger.error(`Error processing requestNextTurn for conversation ${conversationId}:`, error);
            if (error instanceof HttpsError) throw error;
            throw new HttpsError("internal", "An unexpected error occurred while advancing the conversation turn.");
        }
    }
);
// --- End requestNextTurn ---

