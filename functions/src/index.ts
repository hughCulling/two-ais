import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

// --- LangChain Imports ---
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
// Import specific chat model classes
import { ChatOpenAI } from "@langchain/openai"; // Added
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"; // Added
import { BaseChatModel } from "@langchain/core/language_models/chat_models"; // Added

// --- Initialization ---
if (admin.apps.length === 0) {
  admin.initializeApp();
  logger.info("Firebase Admin SDK Initialized in Cloud Function.");
}
const db = admin.firestore();
let secretManagerClient: SecretManagerServiceClient | null = null;
try {
    secretManagerClient = new SecretManagerServiceClient();
    logger.info("Secret Manager Client Initialized in Cloud Function.");
} catch(error) {
    logger.error("Failed to initialize Secret Manager Client in Cloud Function:", error);
}
const projectId = process.env.GCLOUD_PROJECT;
if (!projectId) {
    logger.warn("GCLOUD_PROJECT environment variable not set.");
}

// --- Helper Function: storeApiKeyAsSecret ---
// Stores an API key in Secret Manager and returns the version name.
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
    // Sanitize userId and service for use in secretId
    const sanitizedUserId = userId.replace(/[^a-zA-Z0-9-_]/g, "_");
    const sanitizedService = service.replace(/[^a-zA-Z0-9-_]/g, "_");
    const secretId = `user-${sanitizedUserId}-${sanitizedService}-key`;
    const parent = `projects/${currentProjectId}`;
    const secretPath = `${parent}/secrets/${secretId}`;
    logger.info(`Attempting to store key in Secret Manager: ${secretPath}`);
    try {
        try {
            // Check if secret exists
            await secretManagerClient.getSecret({ name: secretPath });
            logger.info(`Secret ${secretId} already exists. Adding new version.`);
        } catch (error: unknown) {
            // Check if error is due to secret not found
            let grpcCode: number | undefined;
            if (typeof error === "object" && error !== null && "code" in error) {
                if (typeof (error as { code: unknown }).code === "number") {
                     grpcCode = (error as { code: number }).code;
                }
            }
            if (grpcCode === 5) { // 5 = NOT_FOUND
                logger.info(`Secret ${secretId} not found. Creating new secret.`);
                // Create the secret if it doesn't exist
                await secretManagerClient.createSecret({
                    parent: parent,
                    secretId: secretId,
                    secret: { replication: { automatic: {} } },
                });
                logger.info(`Secret ${secretId} created successfully.`);
            } else {
                // Rethrow unexpected errors
                logger.error(`Unexpected error getting secret ${secretId}:`, error);
                throw error;
            }
        }
        // Add the API key as a new secret version
        const [version] = await secretManagerClient.addSecretVersion({
            parent: secretPath,
            payload: { data: Buffer.from(apiKey, "utf8") },
        });
        if (!version.name) { throw new Error("Failed to get version name after adding secret version."); }
        logger.info(`Added new version ${version.name} for secret ${secretId}.`);
        return version.name; // Return the full version name (e.g., projects/.../secrets/.../versions/1)
    } catch (error) {
        logger.error(`Error interacting with Secret Manager for secret ${secretId}:`, error);
        throw new HttpsError("internal", `Failed to securely store API key for ${service}.`);
    }
}

// --- Cloud Function: saveApiKey ---
// Callable function for clients to save their API keys securely.
export const saveApiKey = onCall<{ service: string; apiKey: string }, Promise<{ message: string; service: string }>>(
    { region: "us-central1" }, // Specify region if needed
    async (request) => {
        logger.info("--- saveApiKey Function Execution Start ---", { structuredData: true });
        // Check authentication
        if (!request.auth?.uid) {
            logger.error("Authentication check failed: No auth context.");
            throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
        }
        const userId = request.auth.uid;
        const { service, apiKey } = request.data;
        logger.info(`Processing saveApiKey for user: ${userId}, service: ${service}`);

        // Validate input
        if (!service || typeof service !== "string" || service.trim() === "") { throw new HttpsError("invalid-argument", "Service name is required."); }
        if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") { throw new HttpsError("invalid-argument", "API key for service '" + service + "' cannot be empty."); } // Use double quotes
        // Basic length check for API key sanity
        if (apiKey.length < 8 || apiKey.length > 4096) { throw new HttpsError("invalid-argument", "The API key for service '" + service + "' has an invalid length."); } // Use double quotes

        try {
            // Store the key in Secret Manager
            const secretVersionName = await storeApiKeyAsSecret(userId, service, apiKey);
            logger.info(`API key stored. Version: ${secretVersionName}`, { userId });

            // Save the reference (secret version name) to Firestore
            const userDocRef = db.collection("users").doc(userId);
            await userDocRef.set(
                {
                    apiSecretVersions: { [service]: secretVersionName }, // Store the specific key type
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                },
                { merge: true }, // Merge with existing data
            );
            logger.info("Secret version reference saved to Firestore.", { userId });

            // Return success message
            return { message: "API key for " + service + " saved securely.", service: service }; // Use double quotes
        } catch (error) {
            logger.error(`Error processing saveApiKey for service ${service}:`, error, { userId });
            // Rethrow HttpsError or wrap other errors
            if (error instanceof HttpsError) throw error;
            logger.error("Caught unexpected error:", error);
            throw new HttpsError("internal", "An unexpected error occurred while saving the " + service + " API key."); // Use double quotes
        }
    },
);


// --- Cloud Function: orchestrateConversation ---
/**
 * Triggered when a new message document is created. Orchestrates the next turn.
 */
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
    logger.info("New message data:", { role: newMessageRole, content: newMessageData.content?.substring(0, 50) + "..." });

    // --- Step 1: Fetch conversation document details ---
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
             await conversationRef.update({ status: "error", errorContext: "Invalid conversation configuration." }).catch(err => logger.error("Failed to update status for invalid config:", err));
             return;
        }
        if (conversationData.status === "stopped" || conversationData.status === "error") {
            logger.info("Conversation " + conversationId + " is already stopped or in error state ('" + conversationData.status + "'). Exiting."); // Use double quotes
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
    } else if ((newMessageRole === "user" || newMessageRole === "system") && (currentTurn === "agentA" || currentTurn === "agentB")) {
        agentToRespond = currentTurn;
    } else {
        logger.info("No response needed. New message role '" + newMessageRole + "' does not require agent '" + currentTurn + "' to respond at this time."); // Use double quotes
        return;
    }
    logger.info(`Determined agent to respond: ${agentToRespond}`);

    // --- Step 3: Fetch recent message history for context ---
    const messagesRef = newMessageSnapshot.ref.parent;
    let historyMessages: BaseMessage[] = [];
    try {
        const historyQuery = messagesRef.orderBy("timestamp", "desc").limit(20);
        const historySnap = await historyQuery.get();
        const reversedHistory = historySnap.docs.map((doc) => {
             const data = doc.data() as { role: string; content: string };
             if (data.role === agentToRespond) {
                 return new AIMessage({ content: data.content });
             } else if (data.role === "agentA" || data.role === "agentB" || data.role === "user" || data.role === "system") { // Fixed quotes
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
        await conversationRef.update({ status: "error", errorContext: "Failed to fetch message history." }).catch(err => logger.error("Failed to update status for history fetch error:", err));
        return;
    }

    // --- Step 4: Get API Key for the responding agent ---
    const agentConfigKey = agentToRespond === "agentA" ? conversationData.agentA_llm : conversationData.agentB_llm;
    const providerKey = agentConfigKey.startsWith("openai") ? "openai" : (agentConfigKey.startsWith("google") ? "google_ai" : null);

    if (!providerKey) {
        logger.error(`Could not determine provider type for agent config key: ${agentConfigKey}`);
        await conversationRef.update({ status: "error", errorContext: "Invalid LLM configuration for " + agentToRespond + "." }).catch(err => logger.error("Failed to update status for invalid provider:", err)); // Use double quotes
        return;
    }
    const secretVersionName = conversationData.apiSecretVersions[providerKey];
    if (!secretVersionName) {
        logger.error(`Missing secret version name for key type '${providerKey}' in conversation data.`);
        await conversationRef.update({ status: "error", errorContext: "API key reference missing for " + agentToRespond + " (" + providerKey + ")." }).catch(err => logger.error("Failed to update status for missing secret ref:", err)); // Use double quotes
        return;
    }
    let apiKey: string | null = null;
    try {
        apiKey = await getApiKeyFromSecret(secretVersionName);
        if (!apiKey) { throw new Error(`getApiKeyFromSecret returned null for version ${secretVersionName}`); }
        logger.info(`Successfully retrieved API key for ${providerKey}.`);
    } catch(error) {
        logger.error(`Failed to retrieve API key using version ${secretVersionName}:`, error);
        await conversationRef.update({ status: "error", errorContext: "Failed to retrieve API key for " + agentToRespond + " (" + providerKey + "). Check Secret Manager access." }).catch(err => logger.error("Failed to update status for secret retrieval error:", err)); // Use double quotes
        return;
    }

    // --- Step 5: Initialize the LangChain model ---
    let chatModel: BaseChatModel;
    let modelName: string | undefined; // Define modelName variable, might be undefined if getModelName fails
    try {
        modelName = getModelName(agentConfigKey); // Attempt to get model name
        if (providerKey === "openai") {
            chatModel = new ChatOpenAI({ apiKey: apiKey, modelName: modelName });
        } else if (providerKey === "google_ai") {
            chatModel = new ChatGoogleGenerativeAI({ apiKey: apiKey, model: modelName });
        } else {
            throw new Error(`Unsupported provider key: ${providerKey}`);
        }
        logger.info(`Initialized ${providerKey} model: ${modelName} for ${agentToRespond}`);
    } catch (error) {
        logger.error(`Failed to initialize chat model ${agentConfigKey}:`, error);
        // Use double quotes for the error string
        await conversationRef.update({
             status: "error",
             errorContext: "Failed to initialize LLM using config '" + agentConfigKey + "' for " + agentToRespond + ". Check model name validity."
        }).catch(err => logger.error("Failed to update status for model init error:", err));
        return; // Exit
    }


    // --- Step 6: Call the LLM ---
    let responseContent: string | null = null;
    try {
        logger.info(`Invoking ${agentToRespond} (${agentConfigKey}) with ${historyMessages.length} history messages...`);
        const aiResponse = await chatModel.invoke(historyMessages);
        if (typeof aiResponse.content === "string") {
             responseContent = aiResponse.content;
        } else {
             logger.warn("AI response content was not a simple string:", aiResponse.content);
             responseContent = JSON.stringify(aiResponse.content);
        }
        if (!responseContent || responseContent.trim() === "") {
             throw new Error("LLM response content was empty or invalid.");
        }
        logger.info(`Received response from ${agentToRespond}: ${responseContent.substring(0,100)}...`);

    } catch (error) {
         const errorMessage = error instanceof Error ? error.message : String(error);
         logger.error(`Error invoking LLM ${agentConfigKey} for ${agentToRespond}:`, error);
         try {
             // --- UPDATED: Increased substring limit ---
             await conversationRef.update({
                 status: "error",
                 errorContext: "LLM call failed for " + agentToRespond + ". Please check API key and model validity. Error: " + errorMessage.substring(0, 1000), // Increased limit to 1000
                 lastActivity: admin.firestore.FieldValue.serverTimestamp()
             });
             // --- END UPDATE ---
             logger.info(`Updated conversation ${conversationId} status to 'error'.`);
         } catch (updateError) {
             logger.error(`Failed to update conversation ${conversationId} status to 'error' after LLM failure:`, updateError);
         }
         return;
    }


    // --- Step 7: Write the AI's response back to Firestore ---
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
         // Use double quotes for the error string
         await conversationRef.update({ status: "error", errorContext: "Failed to save " + agentToRespond + "'s response." }).catch(err => logger.error("Failed to update status for save error:", err));
         return;
    }

    // --- Step 8: Handle stopping conditions (Placeholder) ---
    // TODO: Implement stopping conditions

    logger.info("--- orchestrateConversation Finished Successfully ---");
    return null;
});


// --- Helper function to get API key from Secret Manager ---
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
             // Use double quotes for encoding
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


// --- Helper function to map frontend selection to model name ---
const getModelName = (frontendValue: string): string => {
    switch (frontendValue) {
        case "openai_gpt4o": return "gpt-4o";
        case "openai_gpt35": return "gpt-3.5-turbo";
        case "google_gemini15pro": return "gemini-1.5-pro-latest";
        case "google_gemini10pro": return "gemini-1.0-pro";
        default:
            logger.error(`Unknown LLM selection encountered in Cloud Function: ${frontendValue}`);
            // Use double quotes and concatenation
            throw new Error("Unknown LLM selection: " + frontendValue);
    }
};
