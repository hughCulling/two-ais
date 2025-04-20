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
    id: string; // Unique identifier (e.g., 'openai', 'google_ai')
    label: string; // User-friendly label for the input
    value: string; // Current value entered by the user
}

// Interface for the data sent to the Firebase Function
interface SaveApiKeyRequest {
    apiKey: string; // The API key string
    service: string; // The identifier of the service (e.g., 'openai')
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
const initialApiKeys: ApiKeyInput[] = [
    { id: 'openai', label: 'OpenAI API Key', value: '' },
    { id: 'google_ai', label: 'Google AI API Key', value: '' },
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
    // --- FIX: Removed 'initialApiKeys' from dependency array ---
    // 'initialApiKeys' is defined outside the component and is stable.
    // It doesn't need to be listed as a dependency for this effect.
    }, [user, authLoading]); // Effect runs when user or authLoading state changes

    // Handler for input field changes
    const handleInputChange = (id: string, value: string) => {
        // Update the specific key's value in the apiKeys state
        setApiKeys(prevKeys =>
            prevKeys.map(key => (key.id === id ? { ...key, value } : key))
        );
        // Clear any previous status message for the changed input
        setStatusMessages(prev => {
            const newStatus = { ...prev };
            delete newStatus[id]; // Remove the status message for this id
            return newStatus;
        });
        setGeneralError(null); // Clear general error when user starts typing
    };

    // Callback function to handle saving the API keys via Firebase Function
    const saveKeys = useCallback(async () => {
         // Pre-checks: Ensure user is authenticated and Firebase services are ready
         // Note: initializedFunctions is used here but doesn't need to be a dependency as it's stable
         if (authLoading || !user || !firebaseAuth.currentUser || firebaseAuth.currentUser.uid !== user.uid || !app || !initializedFunctions) {
             setGeneralError("Authentication issue or Firebase services not ready. Please ensure you are logged in.");
             return;
        }

        setIsSaving(true); // Set saving state
        setGeneralError(null); // Clear previous general errors
        const currentStatusMessages: Record<string, { type: 'success' | 'error'; message: string }> = {}; // Track statuses for this save attempt

        // Get a reference to the Firebase Function (using the stable initializedFunctions)
        const saveApiKeyFunction = httpsCallable<SaveApiKeyRequest, SaveApiKeySuccessResponse | SaveApiKeyErrorResponse>(initializedFunctions, 'saveApiKey');

        // Filter out keys that have no value entered
        const keysToSave = apiKeys.filter(key => key.value.trim() !== '');

        // If no keys have new values, inform the user and stop
        if (keysToSave.length === 0) {
            setGeneralError("No new API keys entered to save.");
            setIsSaving(false);
            return;
        }

        // Force refresh the user's ID token before calling the function for security
        try {
            await user.getIdToken(true);
        } catch (tokenError) {
            console.error("Error refreshing ID token:", tokenError);
            setGeneralError("Failed to refresh authentication token. Please try logging out and back in.");
            setIsSaving(false);
            return;
        }

        const newlySavedKeys: Record<string, boolean> = {}; // Track keys successfully saved in this batch

        // Create promises for each key save operation
        const promises = keysToSave.map(async (apiKeyInput) => {
            const service = apiKeyInput.id;
            const apiKey = apiKeyInput.value;
            const dataToSend: SaveApiKeyRequest = { service, apiKey };

            try {
                console.log(`Calling saveApiKey function for service: ${service}`);
                // Call the Firebase Function
                const result = await saveApiKeyFunction(dataToSend);
                const data = result.data; // Extract data from the result

                // Check the structure of the response to determine success or error
                if (typeof data === 'object' && data !== null && 'message' in data && !('error' in data)) {
                    // Success case
                    const successData = data as SaveApiKeySuccessResponse;
                    console.log(`Successfully saved/updated key for service: ${successData.service}`);
                    currentStatusMessages[service] = { type: 'success', message: successData.message };
                    newlySavedKeys[service] = true; // Mark as saved
                    // Clear the input field upon successful save
                    setApiKeys(prev => prev.map(k => k.id === service ? { ...k, value: '' } : k));
                } else if (typeof data === 'object' && data !== null && 'error' in data) {
                    // Error case (returned by the function)
                    const errorMsg = (data as SaveApiKeyErrorResponse)?.error || 'Unknown error structure received.';
                    console.error(`Error saving key for ${service} (from function response):`, errorMsg);
                    currentStatusMessages[service] = { type: 'error', message: `Error: ${errorMsg}` };
                } else {
                     // Unexpected response structure
                     console.error(`Unexpected response structure received for ${service}:`, data);
                     currentStatusMessages[service] = { type: 'error', message: "Received an unexpected response from the server." };
                }

            } catch (error) {
                // Handle errors during the function call itself (e.g., network issues, permission errors)
                console.error(`Caught error calling function for service ${service}:`, error);
                let errorMessage = `Failed to save ${service} key.`;
                 if (error instanceof FunctionsError) {
                      // Firebase Functions specific error
                      errorMessage = `Function Error: ${error.message} (Code: ${error.code})`;
                 } else if (error instanceof Error) {
                     // Generic JavaScript error
                     errorMessage = `Error: ${error.message}`;
                 }
                currentStatusMessages[service] = { type: 'error', message: errorMessage };
            }
        });

        // Wait for all save operations to complete
        await Promise.all(promises);

        // Update the overall saved key status with newly saved keys
        setSavedKeyStatus(prevStatus => ({ ...prevStatus, ...newlySavedKeys }));
        // Update the status messages displayed to the user
        setStatusMessages(currentStatusMessages);
        setIsSaving(false); // Mark saving as complete

        // Check if any errors occurred during the save process
        const hasErrors = Object.values(currentStatusMessages).some(status => status.type === 'error');
        if (hasErrors) {
            // Set a general error message if specific errors occurred,
            // but only if a general error wasn't already set (e.g., by token refresh failure)
            if (!generalError) {
                 setGeneralError("Some API keys could not be saved. Please check the details below.");
            }
        } else {
            // If all saves were successful and no prior general error exists, clear the general error.
             if (!generalError) {
                 setGeneralError(null);
             }
        }
    // --- FIX: Removed 'initializedFunctions' from dependency array ---
    // 'initializedFunctions' is imported and stable. It doesn't need to be a dependency for useCallback.
    // Keep state variables and setters that are used within the callback.
    }, [apiKeys, user, authLoading, generalError, setGeneralError, setStatusMessages, setSavedKeyStatus, setApiKeys]); // Dependencies for useCallback


    // Display loading message while fetching initial key status
    if (isLoadingStatus && !authLoading) {
         return <p className="text-center text-sm text-muted-foreground p-4">Loading key status...</p>;
    }

    // Render the main component UI
    return (
        <div className="space-y-6">
            {/* Display General Error Alert */}
            {generalError && (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{generalError}</AlertDescription>
                </Alert>
            )}

            {/* API Key Input Section */}
            <div className="space-y-4">
                {/* Map through the defined API keys to create input fields */}
                {initialApiKeys.map(({ id, label }) => {
                    // Find the current value from state for this key ID
                    const currentKeyValue = apiKeys.find(k => k.id === id)?.value ?? '';
                    // Check if the key is marked as saved from Firestore status
                    const isSaved = savedKeyStatus[id] === true;
                    // Determine if the placeholder should indicate a saved key
                    const showSavedPlaceholder = isSaved && currentKeyValue === '';

                    return (
                        <div key={id} className="space-y-2">
                            <Label htmlFor={id}>{label}</Label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    id={id}
                                    type="password" // Use password type to obscure input
                                    value={currentKeyValue}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(id, e.target.value)}
                                    // Show different placeholder based on saved status
                                    placeholder={showSavedPlaceholder ? '•••••••• Key Saved (Enter new key to replace)' : `Enter your ${label}`}
                                    // Disable input while saving or loading
                                    disabled={isSaving || authLoading || isLoadingStatus}
                                    className="transition-colors duration-200 focus:border-primary focus:ring-primary flex-grow"
                                />
                                {/* Show checkmark icon if key is saved */}
                                {isSaved && (
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" aria-label="Key saved indicator"/>
                                )}
                            </div>
                             {/* Helper text */}
                             <p className="text-xs text-muted-foreground px-1">
                                 {isSaved ? "Entering a new key will overwrite the saved one." : "Your key will be stored securely using Google Secret Manager."}
                             </p>
                             {/* Display Success/Error Alert for this specific key */}
                            {statusMessages[id] && (
                                <Alert variant={statusMessages[id].type === 'success' ? 'default' : 'destructive'} className="mt-2">
                                    {/* Use appropriate icon */}
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
                // Disable button while saving, loading, or if user is not logged in
                disabled={isSaving || authLoading || !user || isLoadingStatus}
                className="w-full transition-opacity duration-200"
            >
                {isSaving ? 'Saving...' : 'Save / Update Keys'}
            </Button>

             {/* Display messages based on authentication status */}
             {authLoading && <p className="text-center text-sm text-muted-foreground">Checking authentication status...</p>}
             {!authLoading && !user && <p className="text-center text-sm text-destructive">Please log in to manage API keys.</p>}
        </div>
    );
};

export default ApiKeyManager;
