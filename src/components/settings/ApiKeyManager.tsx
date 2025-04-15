// src/components/settings/ApiKeyManager.tsx
import React, { useState, useCallback } from 'react';
import { httpsCallable, FunctionsError } from 'firebase/functions';
import { useAuth } from '@/context/AuthContext';
import { app, auth as firebaseAuth, functions as initializedFunctions } from '@/lib/firebase/clientApp';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
    const { user, loading: authLoading } = useAuth();
    const [apiKeys, setApiKeys] = useState<ApiKeyInput[]>([
        { id: 'openai', label: 'OpenAI API Key', value: '' },
        { id: 'google_ai', label: 'Google AI API Key', value: '' },
        { id: 'elevenlabs', label: 'ElevenLabs API Key', value: '' },
        // Add more services as needed
    ]);
    const [statusMessages, setStatusMessages] = useState<Record<string, { type: 'success' | 'error'; message: string }>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [generalError, setGeneralError] = useState<string | null>(null);

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

    const saveKeys = useCallback(async () => {
        if (authLoading) {
            setGeneralError("Authentication status is loading. Please wait.");
            console.warn("Save attempt while auth is loading.");
            return;
        }
        const currentUser = user;
        if (!currentUser) {
            setGeneralError("You must be logged in to save API keys.");
            console.error("Save attempt failed: User not authenticated (from AuthContext).");
            return;
        }
         if (!firebaseAuth.currentUser || firebaseAuth.currentUser.uid !== currentUser.uid) {
             console.error("Save attempt failed: Auth inconsistency detected.");
             setGeneralError("Authentication inconsistency detected. Please refresh.");
             return;
         }
        if (!app) {
             setGeneralError("Firebase is not initialized correctly. Please refresh.");
             console.error("Save attempt failed: Firebase app not available.");
             return;
        }

        setIsSaving(true);
        setGeneralError(null);
        const currentStatusMessages: Record<string, { type: 'success' | 'error'; message: string }> = {};
        const saveApiKeyFunction = httpsCallable<SaveApiKeyRequest, SaveApiKeySuccessResponse | SaveApiKeyErrorResponse>(initializedFunctions, 'saveApiKey');
        const keysToSave = apiKeys.filter(key => key.value.trim() !== '');

        if (keysToSave.length === 0) {
            setGeneralError("No API keys entered to save.");
            setIsSaving(false);
            return;
        }

        try {
            await currentUser.getIdToken();
        } catch (tokenError) {
            console.error("Error retrieving ID token:", tokenError);
            setGeneralError("Failed to get authentication token. Please try logging out and back in.");
            setIsSaving(false);
            return;
        }

        const promises = keysToSave.map(async (apiKeyInput) => {
            const service = apiKeyInput.id;
            const apiKey = apiKeyInput.value;
            const dataToSend: SaveApiKeyRequest = { service, apiKey };

            try {
                console.log(`Calling saveApiKey function for: ${service}`);
                const result = await saveApiKeyFunction(dataToSend);
                const data = result.data;

                if (typeof data === 'object' && data !== null && 'error' in data) {
                    const errorData = data as SaveApiKeyErrorResponse;
                    console.error(`Error saving ${service} key (from function response):`, errorData.error);
                    currentStatusMessages[service] = { type: 'error', message: `Error saving ${service}: ${errorData.error}` };
                }
                else if (typeof data === 'object' && data !== null && 'message' in data) {
                    const successData = data as SaveApiKeySuccessResponse;
                    console.log(`Successfully saved ${service} key.`);
                    currentStatusMessages[service] = { type: 'success', message: successData.message };
                } else {
                     console.error(`Unexpected response structure for ${service}:`, data);
                     currentStatusMessages[service] = { type: 'error', message: `Unexpected response for ${service}.` };
                }

            } catch (error) {
                console.error(`Caught error calling function for ${service}:`, error);
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

        await Promise.all(promises);
        setStatusMessages(currentStatusMessages);
        setIsSaving(false);

        const hasErrors = Object.values(currentStatusMessages).some(status => status.type === 'error');
        if (hasErrors) {
            if (!generalError) {
                 setGeneralError("Some API keys could not be saved. See details below.");
            }
        } else {
            setGeneralError(null);
        }

    }, [apiKeys, user, authLoading, initializedFunctions, generalError]);

    // *** Root div no longer has padding, max-width, or mx-auto ***
    // These are now handled by the wrapping container in the page component
    return (
        <div className="space-y-6">
            {/* *** H2 Title Removed - Handled by the page component *** */}
            {/* <h2 className="text-2xl font-semibold text-center">Manage API Keys</h2> */}

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
                            type="password"
                            value={value}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(id, e.target.value)}
                            placeholder={`Enter your ${label}`}
                            disabled={isSaving || authLoading}
                            className="transition-colors duration-200 focus:border-primary focus:ring-primary"
                        />
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
                disabled={isSaving || authLoading || !user}
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
