// src/components/ApiKeyManager.tsx
import React, { useState, /* useEffect removed */ useCallback } from 'react';
// getFunctions removed, FunctionsError still needed if used in catch block explicitly
import { httpsCallable, FunctionsError } from 'firebase/functions';
// Corrected import path for AuthContext
import { useAuth } from '@/context/AuthContext'; // Assuming src/context/AuthContext.tsx
// Ensure app is correctly imported from your clientApp configuration
import { app, auth as firebaseAuth, functions as initializedFunctions } from '@/lib/firebase/clientApp'; // Import initialized functions and auth
// Imports for shadcn/ui components - Ensure these are installed & path alias is correct
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Import for lucide-react icons - Ensure this is installed
import { Terminal } from "lucide-react";

// Define the structure for API key inputs
interface ApiKeyInput {
    id: string;
    label: string;
    value: string;
}

// Define the expected request structure for the Cloud Function
interface SaveApiKeyRequest {
    apiKey: string;
    service: string;
}

// Define the expected success response structure (can be expanded)
interface SaveApiKeySuccessResponse {
    message: string;
    service: string;
}

// Define the expected error response structure
interface SaveApiKeyErrorResponse {
    error: string;
    service: string;
}

const ApiKeyManager: React.FC = () => {
    const { user, loading: authLoading } = useAuth(); // Get user and auth loading state from context
    const [apiKeys, setApiKeys] = useState<ApiKeyInput[]>([
        { id: 'openai', label: 'OpenAI API Key', value: '' },
        { id: 'google_ai', label: 'Google AI API Key', value: '' },
        { id: 'elevenlabs', label: 'ElevenLabs API Key', value: '' },
        // Add more services as needed
    ]);
    const [statusMessages, setStatusMessages] = useState<Record<string, { type: 'success' | 'error'; message: string }>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [generalError, setGeneralError] = useState<string | null>(null);

    // --- Fetch existing keys (placeholder) ---
    // useEffect(() => {
    //   if (user) {
    //     // Fetch indication if keys are saved for this user
    //     // e.g., fetch which services have a secretVersionName stored in Firestore
    //   }
    // }, [user]);
    // --- End Fetch ---

    // Add explicit type for the event parameter 'e'
    const handleInputChange = (id: string, value: string) => {
        setApiKeys(prevKeys =>
            prevKeys.map(key => (key.id === id ? { ...key, value } : key))
        );
        // Clear status message for the specific key being edited
        setStatusMessages(prev => {
            const newStatus = { ...prev };
            delete newStatus[id];
            return newStatus;
        });
        setGeneralError(null); // Clear general error on input change
    };

    const saveKeys = useCallback(async () => {
        // **Crucial Auth Check:** Ensure user is loaded and logged in before proceeding.
        if (authLoading) {
            setGeneralError("Authentication status is loading. Please wait.");
            console.warn("Save attempt while auth is loading.");
            return;
        }
        // Use the user object from the AuthContext
        const currentUser = user;
        if (!currentUser) {
            setGeneralError("You must be logged in to save API keys.");
            console.error("Save attempt failed: User not authenticated (from AuthContext).");
            return;
        }
         // Double check directly with firebaseAuth instance
         if (!firebaseAuth.currentUser || firebaseAuth.currentUser.uid !== currentUser.uid) {
             console.error("Save attempt failed: Auth inconsistency detected.");
             setGeneralError("Authentication inconsistency detected. Please refresh.");
             return;
         }

        // Ensure the Firebase app instance is available before proceeding
        if (!app) {
             setGeneralError("Firebase is not initialized correctly. Please refresh.");
             console.error("Save attempt failed: Firebase app not available.");
             return;
        }

        setIsSaving(true);
        setGeneralError(null);
        const currentStatusMessages: Record<string, { type: 'success' | 'error'; message: string }> = {};

        // Use the initialized functions instance directly from clientApp
        const saveApiKeyFunction = httpsCallable<SaveApiKeyRequest, SaveApiKeySuccessResponse | SaveApiKeyErrorResponse>(initializedFunctions, 'saveApiKey');

        // Filter keys that have a value entered
        const keysToSave = apiKeys.filter(key => key.value.trim() !== '');

        if (keysToSave.length === 0) {
            setGeneralError("No API keys entered to save.");
            setIsSaving(false);
            return;
        }

        // Optional: Check token retrieval here if needed, but removed the verbose logging
        try {
            await currentUser.getIdToken(); // Verify token can be retrieved
        } catch (tokenError) {
            console.error("Error retrieving ID token:", tokenError);
            setGeneralError("Failed to get authentication token. Please try logging out and back in.");
            setIsSaving(false);
            return;
        }

        const promises = keysToSave.map(async (apiKeyInput) => {
            const service = apiKeyInput.id;
            const apiKey = apiKeyInput.value;
            const dataToSend: SaveApiKeyRequest = { service, apiKey }; // Prepare data payload

            try {
                console.log(`Calling saveApiKey function for: ${service}`); // Keep basic call log
                const result = await saveApiKeyFunction(dataToSend);
                const data = result.data;

                // Check response structure
                if (typeof data === 'object' && data !== null && 'error' in data) {
                    const errorData = data as SaveApiKeyErrorResponse;
                    console.error(`Error saving ${service} key (from function response):`, errorData.error);
                    currentStatusMessages[service] = { type: 'error', message: `Error saving ${service}: ${errorData.error}` };
                }
                else if (typeof data === 'object' && data !== null && 'message' in data) {
                    const successData = data as SaveApiKeySuccessResponse;
                    console.log(`Successfully saved ${service} key.`); // Keep success log
                    currentStatusMessages[service] = { type: 'success', message: successData.message };
                    // Optionally clear the input field on success
                    // setApiKeys(prev => prev.map(k => k.id === service ? { ...k, value: '' } : k));
                } else {
                     console.error(`Unexpected response structure for ${service}:`, data);
                     currentStatusMessages[service] = { type: 'error', message: `Unexpected response for ${service}.` };
                }

            } catch (error) {
                console.error(`Caught error calling function for ${service}:`, error); // Keep raw error log
                let errorMessage = `Failed to save ${service} key.`;
                if (error instanceof FunctionsError) {
                     if (error.code === 'unauthenticated') {
                         errorMessage = `Authentication error saving ${service}. Please ensure you are logged in. The server rejected the call.`;
                    } else {
                         errorMessage = `Function error saving ${service}: ${error.message} (Code: ${error.code})`;
                    }
                } else if (error instanceof Error) {
                    errorMessage = `Generic error saving ${service}: ${error.message}`;
                }
                currentStatusMessages[service] = { type: 'error', message: errorMessage };
            }
        });

        // Wait for all save attempts to complete
        await Promise.all(promises);

        setStatusMessages(currentStatusMessages);
        setIsSaving(false);

        // Check if any errors occurred overall
        const hasErrors = Object.values(currentStatusMessages).some(status => status.type === 'error');
        if (hasErrors) {
            // Add generalError check here to satisfy exhaustive-deps
            if (!generalError) {
                 setGeneralError("Some API keys could not be saved. See details below.");
            }
        } else {
            setGeneralError(null); // Clear general error if all succeeded
        }

    // Added generalError to dependency array
    }, [apiKeys, user, authLoading, initializedFunctions, generalError]); // Dependencies

    return (
        <div className="space-y-6 p-4 md:p-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold text-center">Manage API Keys</h2>

            {/* General Error Display */}
            {generalError && (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{generalError}</AlertDescription>
                </Alert>
            )}

            {/* API Key Inputs */}
            <div className="space-y-4">
                {apiKeys.map(({ id, label, value }) => (
                    <div key={id} className="space-y-2">
                        <Label htmlFor={id}>{label}</Label>
                        <Input
                            id={id}
                            type="password" // Use password type to obscure input
                            value={value}
                            // Add explicit type React.ChangeEvent<HTMLInputElement> for 'e'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(id, e.target.value)}
                            placeholder={`Enter your ${label}`}
                            disabled={isSaving || authLoading} // Disable while saving or auth loading
                            className="transition-colors duration-200 focus:border-primary focus:ring-primary"
                        />
                        {/* Individual Status Messages */}
                        {statusMessages[id] && (
                            <Alert variant={statusMessages[id].type === 'success' ? 'default' : 'destructive'} className="mt-2">
                                <Terminal className="h-4 w-4" />
                                <AlertTitle>{statusMessages[id].type === 'success' ? 'Success' : 'Error'}</AlertTitle>
                                <AlertDescription>{statusMessages[id].message}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                ))}
            </div>

            {/* Save Button */}
            <Button
                onClick={saveKeys}
                disabled={isSaving || authLoading || !user} // Disable if saving, auth loading, or not logged in
                className="w-full transition-opacity duration-200"
            >
                {isSaving ? 'Saving...' : 'Save API Keys'}
            </Button>

             {/* Auth Loading Indicator */}
             {authLoading && <p className="text-center text-sm text-muted-foreground">Checking authentication status...</p>}
             {!authLoading && !user && <p className="text-center text-sm text-destructive">Please log in to manage API keys.</p>}
        </div>
    );
};

export default ApiKeyManager;
