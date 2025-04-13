import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
// Import the Secret Manager client library
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Initialize Secret Manager client
const secretManagerClient = new SecretManagerServiceClient();
// Get Project ID from environment variables (automatically populated in Cloud Functions)
const projectId = process.env.GCLOUD_PROJECT;
if (!projectId) {
    logger.error("GCLOUD_PROJECT environment variable not set.");
    // Handle error appropriately - maybe throw on startup?
}

// --- Helper Function to Store API Key in Secret Manager ---
async function storeApiKeyAsSecret(userId: string, service: string, apiKey: string): Promise<string> {
    if (!projectId) {
        throw new HttpsError("internal", "Project ID not configured for Secret Manager.");
    }

    // Define a predictable secret name based on user and service
    // Ensure the name adheres to Secret Manager naming conventions (letters, numbers, hyphens, underscores)
    // Using double quotes for strings as required by linter
    const secretId = `user-${userId}-${service}-key`.replace(/[^a-zA-Z0-9-_]/g, "_"); // Basic sanitization
    const parent = `projects/${projectId}`;
    const secretPath = `${parent}/secrets/${secretId}`;

    logger.info(`Attempting to store key in Secret Manager: ${secretPath}`);

    try {
        // 1. Try to get the secret to see if it exists
        try {
            await secretManagerClient.getSecret({ name: secretPath });
            logger.info(`Secret ${secretId} already exists. Adding new version.`);
        // Using 'unknown' type for caught error as required by linter
        } catch (error: unknown) {
            // Check if the error is an object with a 'code' property
            let grpcCode: number | undefined;
            if (typeof error === "object" && error !== null && "code" in error) {
                grpcCode = (error as { code: number }).code;
            }

            // If 'NOT_FOUND', create the secret
            if (grpcCode === 5) { // 5 = NOT_FOUND gRPC code
                logger.info(`Secret ${secretId} not found. Creating new secret.`);
                await secretManagerClient.createSecret({
                    parent: parent,
                    secretId: secretId,
                    secret: {
                        replication: { automatic: {} }, // Simple replication policy
                        // Add labels if needed, e.g., { labels: { userId: userId, service: service } }
                    },
                });
                logger.info(`Secret ${secretId} created successfully.`);
            } else {
                // Rethrow unexpected errors during getSecret
                logger.error(`Unexpected error getting secret ${secretId}:`, error);
                throw error; // Re-throw the original error object
            }
        }

        // 2. Add the API key as a new secret version
        const [version] = await secretManagerClient.addSecretVersion({
            parent: secretPath,
            payload: {
                // Using double quotes for strings as required by linter
                data: Buffer.from(apiKey, "utf8"), // Store the key as a buffer
            },
        });

        if (!version.name) {
            throw new Error("Failed to get version name after adding secret version.");
        }

        logger.info(`Added new version ${version.name} for secret ${secretId}.`);
        // Return the full resource name of the *version*
        return version.name;

    } catch (error) {
        logger.error(`Error interacting with Secret Manager for secret ${secretId}:`, error);
        // Using double quotes for strings as required by linter
        throw new HttpsError("internal", `Failed to securely store API key for ${service}.`);
    }
}

// --- Helper Function Placeholder for Retrieving/Decrypting ---
// Commented out as it's currently unused, causing a linting error.
// You will need this later when your backend needs to USE the key.
/*
async function getApiKeyFromSecret(secretVersionName: string): Promise<string> {
    try {
        logger.info(`Accessing secret version: ${secretVersionName}`);
        const [version] = await secretManagerClient.accessSecretVersion({
            // Using double quotes for strings as required by linter
            name: secretVersionName,
        });

        if (!version.payload?.data) {
            throw new Error("Secret version payload is empty.");
        }

        // Decode the secret payload
        // Using double quotes for strings as required by linter
        const apiKey = version.payload.data.toString("utf8");
        logger.info(`Successfully retrieved secret from version: ${secretVersionName}`);
        return apiKey;
    } catch (error) {
        logger.error(`Failed to access secret version ${secretVersionName}:`, error);
        // Using double quotes for strings as required by linter
        throw new HttpsError("internal", "Failed to retrieve API key.");
        // Consider more specific error handling based on the error code
    }
}
*/


// --- Cloud Function to Save API Key ---
export const saveApiKey = onCall<{ service: string; apiKey: string }, Promise<{ message: string; service: string }>>(
    {
        // Using double quotes for strings as required by linter
        region: "us-central1",
        // Consider adding memory/cpu options if needed
        // memory: "256MiB",
        // Add timeout, e.g., timeoutSeconds: 60,
    },
    async (request) => {
        // Using double quotes for strings as required by linter
        logger.info("--- saveApiKey Function Execution Start (v2 - Secret Manager) ---", { structuredData: true });

        // Authentication Check (remains crucial)
        if (!request.auth || !request.auth.uid) {
            logger.error("!!! Authentication check failed INSIDE function execution !!!", { /* ... */ });
            // Using double quotes for strings as required by linter
            throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
        }

        const userId = request.auth.uid;
        const { service, apiKey } = request.data;

        // Input Validation (remains important)
        // Using double quotes for strings as required by linter
        if (!service || typeof service !== "string" || service.trim() === "") {
            throw new HttpsError("invalid-argument", "Service is required.");
        }
        // Using double quotes for strings as required by linter
        if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") {
             throw new HttpsError("invalid-argument", `API key for service '${service}' cannot be empty.`);
        }
         if (apiKey.length > 4096) { // Adjust max length as needed (consider Secret Manager limits)
              // Using double quotes for strings as required by linter
              throw new HttpsError("invalid-argument", `The API key for service '${service}' is too long.`);
         }

        // Using double quotes for strings as required by linter
        logger.info(`Received request to save key for service: ${service}`, { userId });

        try {
            // ** Step 1: Store the API Key in Secret Manager **
            // This replaces the encryptData placeholder
            const secretVersionName = await storeApiKeyAsSecret(userId, service, apiKey);
            // Using double quotes for strings as required by linter
            logger.info(`API key for service '${service}' stored in Secret Manager. Version: ${secretVersionName}`, { userId });

            // ** Step 2: Save the Secret Version Name to Firestore **
            // Store the *reference* to the secret, not the secret itself.
            const userDocRef = db.collection("users").doc(userId);

            await userDocRef.set(
                {
                    // Using a map like 'apiSecretVersions' or similar might be clearer
                    // than reusing 'encryptedApiKeys' now that it holds references.
                    apiSecretVersions: {
                        [service]: secretVersionName, // Store the secret version resource name
                    },
                    // Optionally update a timestamp
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                },
                { merge: true } // Use merge: true to avoid overwriting other user data
            );

            // Using double quotes for strings as required by linter
            logger.info(`Secret version reference for service '${service}' saved successfully to Firestore.`, { userId });

            // ** Step 3: Return Success Response **
            // Using double quotes for strings as required by linter
            return { message: `API key for ${service} saved securely.`, service: service };

        } catch (error) {
            // Using double quotes for strings as required by linter
            logger.error(`Error processing saveApiKey for service ${service}:`, error, { userId });
            if (error instanceof HttpsError) {
                throw error; // Re-throw HttpsErrors directly (e.g., from storeApiKeyAsSecret)
            }
            // Using double quotes for strings as required by linter
            throw new HttpsError("internal", `An unexpected error occurred while saving the ${service} API key.`);
        }
    },
);
