// src/components/settings/ApiKeyManager.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { httpsCallable, FunctionsError } from 'firebase/functions';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
// Import firebase instances - assume these are stable references
import { app, auth as firebaseAuth, db, functions as initializedFunctions } from '@/lib/firebase/clientApp';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle } from "lucide-react";

// Interface for the structure of API key input fields
interface ApiKeyInput {
    id: string; // Unique identifier (e.g., 'openai', 'google_ai', 'anthropic')
    label: string; // User-friendly label for the input
    value: string; // Current value entered by the user
}

// Interface for the data sent to the Firebase Function
interface SaveApiKeyRequest {
    apiKey: string; // The API key string
    service: string; // The identifier of the service (e.g., 'openai', 'anthropic')
}

// Interface for a successful response from the Firebase Function
interface SaveApiKeySuccessResponse {
    message: string; // Success message
    service: string; // Identifier of the service that was saved
}

// Interface for an error response from the Firebase Function
interface SaveApiKeyErrorResponse {
    error: string; // Error message
    service: string; // Identifier of the service that failed
}

// Define initial structure for API key inputs outside the component
// This ensures it's a stable reference and doesn't cause re-renders
// --- MODIFIED: Added Anthropic ---
const initialApiKeys: ApiKeyInput[] = [
    { id: 'openai', label: 'OpenAI API Key', value: '' },
    { id: 'google_ai', label: 'Google AI API Key', value: '' },
    { id: 'anthropic', label: 'Anthropic API Key', value: '' }, // Added Anthropic
    // Example: Add other keys here if needed in the future
    // { id: 'elevenlabs', label: 'ElevenLabs API Key', value: '' },
];

const ApiKeyManager: React.FC = () => {
    const { user, loading: authLoading } = useAuth(); // Get user and auth loading state

    // State for the API key input fields, initialized from the stable definition
    const [apiKeys, setApiKeys] = useState<ApiKeyInput[]>(initialApiKeys);
    // State to hold success/error messages per API key ID
    const [statusMessages, setStatusMessages] = useState<Record<string, { type: 'success' | 'error'; message: string }>>({});
    // State to track if the save operation is in progress
    const [isSaving, setIsSaving] = useState(false);
    // State for displaying general errors (e.g., auth issues, load failures)
    const [generalError, setGeneralError] = useState<string | null>(null);
    // State to track which keys are already saved (based on Firestore check)
    const [savedKeyStatus, setSavedKeyStatus] = useState<Record<string, boolean>>({});
    // State to track if the initial key status load is happening
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);

    // Effect to fetch the saved status of API keys from Firestore when user changes
    useEffect(() => {
        const fetchKeyStatus = async () => {
            if (user) { // Only run if user is logged in
                setIsLoadingStatus(true);
                setGeneralError(null); // Clear previous errors
                try {
                    const userDocRef = doc(db, 'users', user.uid); // Reference to the user's document
                    const userDocSnap = await getDoc(userDocRef); // Fetch the document
                    const status: Record<string, boolean> = {}; // Initialize status object

                    if (userDocSnap.exists()) {
                        const data = userDocSnap.data(); // Get document data
                        // Safely access apiSecretVersions, default to empty object if null/undefined
                        const versions = data?.apiSecretVersions || {};
                        // Check each key defined in initialApiKeys
                        // --- This automatically includes 'anthropic' now ---
                        initialApiKeys.forEach(key => {
                            // A key is considered saved if its ID exists in versions and the value is a non-empty string
                            status[key.id] = !!(versions[key.id] && typeof versions[key.id] === 'string' && versions[key.id].length > 0);
                        });
                    } else {
                        // If user document doesn't exist, assume no keys are saved
                        initialApiKeys.forEach(key => { status[key.id] = false; });
                        console.log("User document does not exist yet for API key status check.");
                    }
                    setSavedKeyStatus(status); // Update the saved status state
                } catch (error) {
                    console.error("Error fetching user document for key status:", error);
                    setGeneralError("Could not load saved key status. Please try refreshing.");
                    // Reset status on error
                    const resetStatus: Record<string, boolean> = {};
                    initialApiKeys.forEach(key => { resetStatus[key.id] = false; });
                    setSavedKeyStatus(resetStatus);
                } finally {
                    setIsLoadingStatus(false); // Mark loading as complete
                }
            } else if (!authLoading) {
                // If no user and auth is not loading, reset status and loading state
                const resetStatus: Record<string, boolean> = {};
                initialApiKeys.forEach(key => { resetStatus[key.id] = false; });
                setSavedKeyStatus(resetStatus);
                setIsLoadingStatus(false);
            }
        };

        fetchKeyStatus();
    // Effect dependencies remain the same
    }, [user, authLoading]);

    // Handler for input field changes (no changes needed)
    const handleInputChange = (id: string, value: string) => {
        setApiKeys(prevKeys =>
            prevKeys.map(key => (key.id === id ? { ...key, value } : key))
        );
        setStatusMessages(prev => {
            const newStatus = { ...prev };
            delete newStatus[id];
            return newStatus;
        });
        setGeneralError(null);
    };

    // Callback function to handle saving the API keys via Firebase Function (no changes needed here)
    const saveKeys = useCallback(async () => {
         if (authLoading || !user || !firebaseAuth.currentUser || firebaseAuth.currentUser.uid !== user.uid || !app || !initializedFunctions) {
             setGeneralError("Authentication issue or Firebase services not ready. Please ensure you are logged in.");
             return;
        }

        setIsSaving(true);
        setGeneralError(null);
        const currentStatusMessages: Record<string, { type: 'success' | 'error'; message: string }> = {};

        // Reference to the Cloud Function (name is 'saveApiKey')
        const saveApiKeyFunction = httpsCallable<SaveApiKeyRequest, SaveApiKeySuccessResponse | SaveApiKeyErrorResponse>(initializedFunctions, 'saveApiKey');

        const keysToSave = apiKeys.filter(key => key.value.trim() !== '');

        if (keysToSave.length === 0) {
            setGeneralError("No new API keys entered to save.");
            setIsSaving(false);
            return;
        }

        try {
            await user.getIdToken(true); // Force token refresh
        } catch (tokenError) {
            console.error("Error refreshing ID token:", tokenError);
            setGeneralError("Failed to refresh authentication token. Please try logging out and back in.");
            setIsSaving(false);
            return;
        }

        const newlySavedKeys: Record<string, boolean> = {};

        // --- This loop now includes 'anthropic' if it has a value ---
        const promises = keysToSave.map(async (apiKeyInput) => {
            const service = apiKeyInput.id; // Will be 'openai', 'google_ai', or 'anthropic'
            const apiKey = apiKeyInput.value;
            const dataToSend: SaveApiKeyRequest = { service, apiKey };

            try {
                console.log(`Calling saveApiKey function for service: ${service}`);
                const result = await saveApiKeyFunction(dataToSend);
                const data = result.data;

                if (typeof data === 'object' && data !== null && 'message' in data && !('error' in data)) {
                    const successData = data as SaveApiKeySuccessResponse;
                    console.log(`Successfully saved/updated key for service: ${successData.service}`);
                    currentStatusMessages[service] = { type: 'success', message: successData.message };
                    newlySavedKeys[service] = true;
                    setApiKeys(prev => prev.map(k => k.id === service ? { ...k, value: '' } : k));
                } else if (typeof data === 'object' && data !== null && 'error' in data) {
                    const errorMsg = (data as SaveApiKeyErrorResponse)?.error || 'Unknown error structure received.';
                    console.error(`Error saving key for ${service} (from function response):`, errorMsg);
                    currentStatusMessages[service] = { type: 'error', message: `Error: ${errorMsg}` };
                } else {
                     console.error(`Unexpected response structure received for ${service}:`, data);
                     currentStatusMessages[service] = { type: 'error', message: "Received an unexpected response from the server." };
                }

            } catch (error) {
                console.error(`Caught error calling function for service ${service}:`, error);
                let errorMessage = `Failed to save ${service} key.`;
                 if (error instanceof FunctionsError) {
                      errorMessage = `Function Error: ${error.message} (Code: ${error.code})`;
                 } else if (error instanceof Error) {
                     errorMessage = `Error: ${error.message}`;
                 }
                currentStatusMessages[service] = { type: 'error', message: errorMessage };
            }
        });

        await Promise.all(promises);

        setSavedKeyStatus(prevStatus => ({ ...prevStatus, ...newlySavedKeys }));
        setStatusMessages(currentStatusMessages);
        setIsSaving(false);

        const hasErrors = Object.values(currentStatusMessages).some(status => status.type === 'error');
        if (hasErrors) {
            if (!generalError) {
                 setGeneralError("Some API keys could not be saved. Please check the details below.");
            }
        } else {
             if (!generalError) {
                 setGeneralError(null);
             }
        }
    // Dependencies remain the same
    }, [apiKeys, user, authLoading, generalError, setGeneralError, setStatusMessages, setSavedKeyStatus, setApiKeys]);


    // Display loading message while fetching initial key status (no change needed)
    if (isLoadingStatus && !authLoading) {
         return <p className="text-center text-sm text-muted-foreground p-4">Loading key status...</p>;
    }

    // Render the main component UI (no changes needed in structure, just maps over updated initialApiKeys)
    return (
        <div className="space-y-6">
            {/* General Error Alert */}
            {generalError && (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{generalError}</AlertDescription>
                </Alert>
            )}

            {/* API Key Input Section */}
            <div className="space-y-4">
                {/* --- This now automatically includes the Anthropic input field --- */}
                {initialApiKeys.map(({ id, label }) => {
                    const currentKeyValue = apiKeys.find(k => k.id === id)?.value ?? '';
                    const isSaved = savedKeyStatus[id] === true;
                    const showSavedPlaceholder = isSaved && currentKeyValue === '';

                    return (
                        <div key={id} className="space-y-2">
                            <Label htmlFor={id}>{label}</Label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    id={id}
                                    type="password"
                                    value={currentKeyValue}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(id, e.target.value)}
                                    placeholder={showSavedPlaceholder ? '•••••••• Key Saved (Enter new key to replace)' : `Enter your ${label}`}
                                    disabled={isSaving || authLoading || isLoadingStatus}
                                    className="transition-colors duration-200 focus:border-primary focus:ring-primary flex-grow"
                                />
                                {isSaved && (
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" aria-label="Key saved indicator"/>
                                )}
                            </div>
                             <p className="text-xs text-muted-foreground px-1">
                                 {isSaved ? "Entering a new key will overwrite the saved one." : "Your key will be stored securely using Google Secret Manager."}
                             </p>
                            {/* Status Alert for this key */}
                            {statusMessages[id] && (
                                <Alert variant={statusMessages[id].type === 'success' ? 'default' : 'destructive'} className="mt-2">
                                    {statusMessages[id].type === 'success' ? <CheckCircle className="h-4 w-4" /> : <Terminal className="h-4 w-4" />}
                                    <AlertTitle>{statusMessages[id].type === 'success' ? 'Success' : 'Error'}</AlertTitle>
                                    <AlertDescription>{statusMessages[id].message}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Save Button */}
            <Button
                onClick={saveKeys}
                disabled={isSaving || authLoading || !user || isLoadingStatus}
                className="w-full transition-opacity duration-200"
            >
                {isSaving ? 'Saving...' : 'Save / Update Keys'}
            </Button>

             {/* Auth Status Messages */}
             {authLoading && <p className="text-center text-sm text-muted-foreground">Checking authentication status...</p>}
             {!authLoading && !user && <p className="text-center text-sm text-destructive">Please log in to manage API keys.</p>}
        </div>
    );
};

export default ApiKeyManager;
