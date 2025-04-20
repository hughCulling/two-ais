// functions/src/index.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

// LangChain Imports
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

// --- Define necessary interface/helpers locally ---
// (Assuming models.ts is not easily shared/deployed with functions)
interface LLMInfo {
  id: string;
  provider: "OpenAI" | "Google" | "Anthropic" | "Mistral" | "Cohere";
  apiKeySecretName: string; // The Secret Manager key version name expected by the backend/settings
}
// Basic helper to determine provider from ID prefix
function getProviderFromId(id: string): LLMInfo["provider"] | null {
     // FIX: Use double quotes
     if (id.startsWith("gpt-")) return "OpenAI";
     if (id.startsWith("gemini-")) return "Google";
     // Add checks for 'claude-', 'mistral-', etc. if you add those providers
     return null;
}
// Helper to get the Firestore key ID ('openai', 'google_ai') from provider
function getFirestoreKeyIdFromProvider(provider: LLMInfo["provider"] | null): string | null {
    // FIX: Use double quotes
    if (provider === "OpenAI") return "openai";
    if (provider === "Google") return "google_ai";
    // Add cases for 'Anthropic' -> 'anthropic', etc.
    return null;
}


// --- Initialization ---
if (admin.apps.length === 0) {
  admin.initializeApp();
  logger.info("Firebase Admin SDK Initialized in Cloud Function.");
}
const db = admin.firestore();
let secretManagerClient: SecretManagerServiceClient | null = null;
try {
    // Use default credentials provided by the Cloud Functions environment
    secretManagerClient = new SecretManagerServiceClient();
    logger.info("Secret Manager Client Initialized in Cloud Function.");
} catch(error) {
    logger.error("Failed to initialize Secret Manager Client in Cloud Function:", error);
}
const projectId = process.env.GCLOUD_PROJECT;
if (!projectId) {
    logger.warn("GCLOUD_PROJECT environment variable not set.");
}

// --- Helper Function: storeApiKeyAsSecret (Keep your existing function - check quotes within if needed) ---
async function storeApiKeyAsSecret(userId: string, service: string, apiKey: string): Promise<string> {
    // Check quotes within your original pasted function here if necessary
    // Example change (if you had single quotes):
    const currentProjectId = process.env.GCLOUD_PROJECT;
    if (!currentProjectId) {
        logger.error("GCLOUD_PROJECT env var missing inside storeApiKeyAsSecret.");
        // FIX: Use double quotes
        throw new HttpsError("internal", "Project ID not configured for Secret Manager.");
    }
     if (!secretManagerClient) {
        logger.error("Secret Manager Client is not initialized in storeApiKeyAsSecret.");
        try {
            secretManagerClient = new SecretManagerServiceClient();
             logger.info("Re-initialized Secret Manager Client in storeApiKeyAsSecret.");
        } catch (initError) {
             logger.error("Failed to re-initialize Secret Manager Client in storeApiKeyAsSecret:", initError);
             // FIX: Use double quotes
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
            if (grpcCode === 5) { // 5 = NOT_FOUND
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
            // FIX: Use double quotes
            payload: { data: Buffer.from(apiKey, "utf8") },
        });
        // FIX: Use double quotes
        if (!version.name) { throw new Error("Failed to get version name after adding secret version."); }
        logger.info(`Added new version ${version.name} for secret ${secretId}.`);
        return version.name;
    } catch (error) {
        logger.error(`Error interacting with Secret Manager for secret ${secretId}:`, error);
        // FIX: Use double quotes
        throw new HttpsError("internal", `Failed to securely store API key for ${service}.`);
    }
}

// --- Cloud Function: saveApiKey (Keep your existing function - check quotes within) ---
export const saveApiKey = onCall<{ service: string; apiKey: string }, Promise<{ message: string; service: string }>>(
    // FIX: Use double quotes
    { region: "us-central1" },
    async (request) => {
        // Check quotes within your original pasted function here if necessary
        // Example changes:
        logger.info("--- saveApiKey Function Execution Start ---", { structuredData: true });
        if (!request.auth?.uid) {
            logger.error("Authentication check failed: No auth context.");
            // FIX: Use double quotes
            throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
        }
        const userId = request.auth.uid;
        const { service, apiKey } = request.data;
        logger.info(`Processing saveApiKey for user: ${userId}, service: ${service}`);
        // FIX: Use double quotes
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
            logger.info("Secret version reference saved to Firestore.", { userId });
            // FIX: Use double quotes
            return { message: `API key version for ${service} saved securely.`, service: service };
        } catch (error) {
            logger.error(`Error processing saveApiKey for service ${service}:`, error, { userId });
            if (error instanceof HttpsError) throw error;
            logger.error("Caught unexpected error:", error);
            // FIX: Use double quotes
            throw new HttpsError("internal", `An unexpected error occurred while saving the ${service} API key version.`);
        }
    },
);


// --- Cloud Function: orchestrateConversation (Refactored) ---
// FIX: Use double quotes for trigger path
export const orchestrateConversation = onDocumentCreated("conversations/{conversationId}/messages/{messageId}", async (event) => {
    logger.info("--- orchestrateConversation Triggered ---");
    const { conversationId, messageId } = event.params;
    logger.info(`Conversation ID: ${conversationId}, Message ID: ${messageId}`);

    const newMessageSnapshot = event.data;
    if (!newMessageSnapshot) {
        logger.error("No data associated with the event trigger.");
        return;
    }
    const newMessageData = newMessageSnapshot.data() as { role: string; content: string; timestamp?: admin.firestore.Timestamp };
    const newMessageRole = newMessageData.role;
    // FIX: Use double quotes
    logger.info("New message data:", { role: newMessageRole, content: newMessageData.content?.substring(0, 50) + "..." });

    // --- Step 1: Fetch conversation document details ---
    // FIX: Use double quotes
    const conversationRef = db.collection("conversations").doc(conversationId);
    let conversationData;
    try {
        const conversationSnap = await conversationRef.get();
        if (!conversationSnap.exists) {
            logger.error(`Conversation document ${conversationId} not found.`);
            return;
        }
        conversationData = conversationSnap.data() as {
            agentA_llm: string;
            agentB_llm: string;
            turn: "agentA" | "agentB";
            apiSecretVersions: { [key: string]: string };
            status?: string;
            userId?: string;
        };
        logger.info("Conversation data fetched:", conversationData);
        if (!conversationData?.agentA_llm || !conversationData?.agentB_llm || !conversationData?.turn || !conversationData?.apiSecretVersions) {
             logger.error(`Conversation document ${conversationId} is missing required configuration fields.`);
             // FIX: Use double quotes
             await conversationRef.update({ status: "error", errorContext: "Invalid conversation configuration." }).catch(err => logger.error("Failed to update status for invalid config:", err));
             return;
        }
        // FIX: Use double quotes
        if (conversationData.status === "stopped" || conversationData.status === "error") {
            logger.info(`Conversation ${conversationId} is already stopped or in error state ('${conversationData.status}'). Exiting.`);
            return;
        }
    } catch (error) {
        logger.error(`Failed to fetch conversation document ${conversationId}:`, error);
        return;
    }

    // --- Step 2: Determine which agent should respond NOW ---
    let agentToRespond: "agentA" | "agentB" | null = null;
    const currentTurn = conversationData.turn;
    if (newMessageRole === "agentA" && currentTurn === "agentB") {
        agentToRespond = "agentB";
    } else if (newMessageRole === "agentB" && currentTurn === "agentA") {
        agentToRespond = "agentA";
    // FIX: Use double quotes
    } else if ((newMessageRole === "user" || newMessageRole === "system") && (currentTurn === "agentA" || currentTurn === "agentB")) {
        agentToRespond = currentTurn;
    } else {
        // FIX: Use double quotes
        logger.info(`No response needed. New message role "${newMessageRole}" does not require agent "${currentTurn}" to respond.`);
        return;
    }
    logger.info(`Determined agent to respond: ${agentToRespond}`);

    // --- Step 3: Fetch recent message history for context ---
    const messagesRef = newMessageSnapshot.ref.parent;
    let historyMessages: BaseMessage[] = [];
    try {
        // FIX: Use double quotes
        const historyQuery = messagesRef.orderBy("timestamp", "desc").limit(20);
        const historySnap = await historyQuery.get();
        const reversedHistory = historySnap.docs.map((doc) => {
             const data = doc.data() as { role: string; content: string };
             if (data.role === agentToRespond) {
                 return new AIMessage({ content: data.content });
             // FIX: Use double quotes in array
             } else if (["agentA", "agentB", "user", "system"].includes(data.role)) {
                 return new HumanMessage({ content: data.content });
             } else {
                 logger.warn(`Unknown role found in history: ${data.role}`);
                 return null;
             }
        });
        historyMessages = reversedHistory.filter((msg): msg is BaseMessage => msg !== null).reverse();
        logger.info(`Fetched ${historyMessages.length} messages for history.`);

    } catch (error) {
        logger.error(`Failed to fetch message history for ${conversationId}:`, error);
        // FIX: Use double quotes
        await conversationRef.update({ status: "error", errorContext: "Failed to fetch message history." }).catch(err => logger.error("Failed to update status for history fetch error:", err));
        return;
    }

    // --- Step 4: Get API Key for the responding agent ---
    // FIX: Use double quotes
    const agentModelId = agentToRespond === "agentA" ? conversationData.agentA_llm : conversationData.agentB_llm;
    const provider = getProviderFromId(agentModelId);
    const firestoreKeyId = getFirestoreKeyIdFromProvider(provider);

    if (!provider || !firestoreKeyId) {
        logger.error(`Could not determine provider or Firestore key ID for model ID: ${agentModelId}`);
        // FIX: Use double quotes
        await conversationRef.update({ status: "error", errorContext: `Invalid LLM configuration ID "${agentModelId}" for ${agentToRespond}.` }).catch(err => logger.error("Failed to update status for invalid provider:", err));
        return;
    }

    const secretVersionName = conversationData.apiSecretVersions[firestoreKeyId];
    if (!secretVersionName) {
        logger.error(`Missing secret version name for key type '${firestoreKeyId}' in conversation data.`);
        // FIX: Use double quotes
        await conversationRef.update({ status: "error", errorContext: `API key reference missing for ${agentToRespond} (${provider}).` }).catch(err => logger.error("Failed to update status for missing secret ref:", err));
        return;
    }

    let apiKey: string | null = null;
    try {
        apiKey = await getApiKeyFromSecret(secretVersionName);
        // FIX: Use double quotes
        if (!apiKey) { throw new Error(`getApiKeyFromSecret returned null for version ${secretVersionName}`); }
        logger.info(`Successfully retrieved API key for ${provider}.`);
    } catch(error) {
        logger.error(`Failed to retrieve API key using version ${secretVersionName}:`, error);
        // FIX: Use double quotes
        await conversationRef.update({ status: "error", errorContext: `Failed to retrieve API key for ${agentToRespond} (${provider}). Check Secret Manager access.` }).catch(err => logger.error("Failed to update status for secret retrieval error:", err));
        return;
    }

    // --- Step 5: Initialize the LangChain model ---
    let chatModel: BaseChatModel;
    try {
        const modelName = agentModelId;
        // FIX: Use double quotes
        if (provider === "OpenAI") {
            chatModel = new ChatOpenAI({ apiKey: apiKey, modelName: modelName });
        // FIX: Use double quotes
        } else if (provider === "Google") {
            // FIX: Use double quotes
            chatModel = new ChatGoogleGenerativeAI({ apiKey: apiKey, model: modelName });
        } else {
            throw new Error(`Unsupported provider: ${provider}`);
        }
        logger.info(`Initialized ${provider} model: ${modelName} for ${agentToRespond}`);
    } catch (error) {
        logger.error(`Failed to initialize chat model ${agentModelId}:`, error);
        // FIX: Use double quotes
        await conversationRef.update({
             status: "error",
             errorContext: `Failed to initialize LLM using config "${agentModelId}" for ${agentToRespond}. Check model name validity.`
        }).catch(err => logger.error("Failed to update status for model init error:", err));
        return;
    }

    // --- Step 6: Call the LLM ---
    let responseContent: string | null = null;
    try {
        logger.info(`Invoking ${agentToRespond} (${agentModelId}) with ${historyMessages.length} history messages...`);
        const aiResponse = await chatModel.invoke(historyMessages);
        if (typeof aiResponse.content === "string") {
             responseContent = aiResponse.content;
        } else if (Array.isArray(aiResponse.content)) {
             logger.warn("AI response content was an array, attempting to stringify:", aiResponse.content);
             responseContent = JSON.stringify(aiResponse.content);
        } else {
             logger.warn("AI response content was not a simple string or array:", aiResponse.content);
             responseContent = String(aiResponse.content);
        }
        // FIX: Use double quotes
        if (!responseContent || responseContent.trim() === "") {
             logger.warn(`LLM response content from ${agentModelId} was empty.`);
             responseContent = ""; // Handle empty response
        }
        logger.info(`Received response from ${agentToRespond}: ${responseContent.substring(0,100)}...`);

    } catch (error) {
         const errorMessage = error instanceof Error ? error.message : String(error);
         logger.error(`Error invoking LLM ${agentModelId} for ${agentToRespond}:`, error);
         try {
             // FIX: Use double quotes
             await conversationRef.update({
                 status: "error",
                 errorContext: `LLM call failed for ${agentToRespond} (${agentModelId}). Check API key/model validity. Error: ${errorMessage.substring(0, 1000)}`,
                 lastActivity: admin.firestore.FieldValue.serverTimestamp()
             });
             logger.info(`Updated conversation ${conversationId} status to "error".`);
         } catch (updateError) {
             logger.error(`Failed to update conversation ${conversationId} status to "error" after LLM failure:`, updateError);
         }
         return;
    }

    // --- Step 7: Write the AI's response back to Firestore ---
    // FIX: Use double quotes
    const nextTurn = agentToRespond === "agentA" ? "agentB" : "agentA";
    const responseMessage = {
        role: agentToRespond,
        content: responseContent,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    try {
        await messagesRef.add(responseMessage);
        await conversationRef.update({
            turn: nextTurn,
            lastActivity: admin.firestore.FieldValue.serverTimestamp()
        });
        logger.info(`Agent ${agentToRespond} response saved. Turn updated to ${nextTurn}.`);
    } catch (error) {
         logger.error(`Error saving response or updating turn for conversation ${conversationId}:`, error);
         // FIX: Use double quotes
         await conversationRef.update({ status: "error", errorContext: `Failed to save ${agentToRespond}'s response.` }).catch(err => logger.error("Failed to update status for save error:", err));
         return;
    }

    // --- Step 8: Handle stopping conditions (Placeholder) ---
    // TODO: Implement stopping conditions

    logger.info("--- orchestrateConversation Finished Successfully ---");
    return null;
});


// --- Helper function to get API key from Secret Manager (Keep your existing robust helper - check quotes within) ---
async function getApiKeyFromSecret(secretVersionName: string): Promise<string | null> {
    // Check quotes within your original pasted function here if necessary
    // Example change:
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
     if (!secretVersionName) {
        logger.warn("getApiKeyFromSecret called with empty secretVersionName.");
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
        if (typeof payloadData === "string") {
             logger.warn(`Secret payload for ${secretVersionName} was unexpectedly a string.`);
             return payloadData;
        } else if (payloadData instanceof Uint8Array || Buffer.isBuffer(payloadData)) {
             // FIX: Use double quotes
             const apiKey = Buffer.from(payloadData).toString("utf8");
             logger.info(`Successfully retrieved secret from version: ${secretVersionName}`);
             return apiKey;
        } else {
             logger.error(`Secret payload for ${secretVersionName} has unexpected type: ${typeof payloadData}`);
             return null;
        }
    } catch (error) {
        logger.error(`Failed to access secret version ${secretVersionName}:`, error);
        return null;
    }
}


// --- REMOVED getModelName function ---
