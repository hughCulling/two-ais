// src/components/settings/ApiKeyManager.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { httpsCallable, FunctionsError } from 'firebase/functions';
// --- LINT FIX: Removed unused DocumentData import ---
import { doc, getDoc } from 'firebase/firestore';
// --- END LINT FIX ---
import { useAuth } from '@/context/AuthContext';
import { app, auth as firebaseAuth, db, functions as initializedFunctions } from '@/lib/firebase/clientApp';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle } from "lucide-react";

// Interfaces remain the same...
interface ApiKeyInput { id: string; label: string; value: string; }
interface SaveApiKeyRequest { apiKey: string; service: string; }
interface SaveApiKeySuccessResponse { message: string; service: string; }
interface SaveApiKeyErrorResponse { error: string; service: string; }

// Define outside component so it's stable
const initialApiKeys: ApiKeyInput[] = [
    { id: 'openai', label: 'OpenAI API Key', value: '' },
    { id: 'google_ai', label: 'Google AI API Key', value: '' },
    { id: 'elevenlabs', label: 'ElevenLabs API Key', value: '' }, // Assuming you might add this later
];

const ApiKeyManager: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    // Initialize state from the stable initialApiKeys
    const [apiKeys, setApiKeys] = useState<ApiKeyInput[]>(initialApiKeys);
    const [statusMessages, setStatusMessages] = useState<Record<string, { type: 'success' | 'error'; message: string }>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [savedKeyStatus, setSavedKeyStatus] = useState<Record<string, boolean>>({});
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);

    useEffect(() => {
        const fetchKeyStatus = async () => {
            if (user) {
                setIsLoadingStatus(true);
                setGeneralError(null);
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    const status: Record<string, boolean> = {};

                    if (userDocSnap.exists()) {
                        const data = userDocSnap.data();
                        const versions = data.apiSecretVersions || {};
                        initialApiKeys.forEach(key => {
                            if (versions[key.id] && typeof versions[key.id] === 'string' && versions[key.id].length > 0) {
                                status[key.id] = true;
                            } else {
                                status[key.id] = false;
                            }
                        });
                    } else {
                        initialApiKeys.forEach(key => { status[key.id] = false; });
                        console.log("User document does not exist yet.");
                    }
                    setSavedKeyStatus(status);
                } catch (error) {
                    console.error("Error fetching user document for key status:", error);
                    setGeneralError("Could not load saved key status.");
                    setSavedKeyStatus({});
                } finally {
                    setIsLoadingStatus(false);
                }
            } else if (!authLoading) {
                setSavedKeyStatus({});
                setIsLoadingStatus(false);
            }
        };

        fetchKeyStatus();
    // --- LINT FIX: Added initialApiKeys to satisfy exhaustive-deps ---
    // Although stable, adding it satisfies the rule without disabling.
    }, [user, authLoading, initialApiKeys]);

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
         if (authLoading || !user || !firebaseAuth.currentUser || firebaseAuth.currentUser.uid !== user.uid || !app || !initializedFunctions) { // Added check for initializedFunctions
             setGeneralError("Authentication issue or Firebase not ready.");
             return;
        }

        setIsSaving(true);
        setGeneralError(null); // Clear general error before attempting saves
        const currentStatusMessages: Record<string, { type: 'success' | 'error'; message: string }> = {};

        const saveApiKeyFunction = httpsCallable<SaveApiKeyRequest, SaveApiKeySuccessResponse | SaveApiKeyErrorResponse>(initializedFunctions, 'saveApiKey');
        const keysToSave = apiKeys.filter(key => key.value.trim() !== '');

        if (keysToSave.length === 0) {
            setGeneralError("No new API keys entered to save.");
            setIsSaving(false);
            return;
        }

        try {
            await user.getIdToken(true); // Force refresh
        } catch (tokenError) {
            console.error("Error refreshing ID token:", tokenError);
            setGeneralError("Failed to refresh authentication token. Please try logging out and back in.");
            setIsSaving(false);
            return;
        }

        const newlySavedKeys: Record<string, boolean> = {};

        const promises = keysToSave.map(async (apiKeyInput) => {
            const service = apiKeyInput.id;
            const apiKey = apiKeyInput.value;
            const dataToSend: SaveApiKeyRequest = { service, apiKey };

            try {
                console.log(`Calling saveApiKey function for: ${service}`);
                const result = await saveApiKeyFunction(dataToSend);
                const data = result.data;

                if (typeof data === 'object' && data !== null && 'message' in data && !('error' in data)) {
                    const successData = data as SaveApiKeySuccessResponse;
                    console.log(`Successfully saved/updated ${service} key.`);
                    currentStatusMessages[service] = { type: 'success', message: successData.message };
                    newlySavedKeys[service] = true;
                    setApiKeys(prev => prev.map(k => k.id === service ? { ...k, value: '' } : k));
                } else if (typeof data === 'object' && data !== null && 'error' in data) {
                    const errorMsg = (data as SaveApiKeyErrorResponse)?.error || 'Unknown error structure.';
                    console.error(`Error saving ${service} key (from function response):`, errorMsg);
                    currentStatusMessages[service] = { type: 'error', message: `Error: ${errorMsg}` };
                } else {
                     console.error(`Unexpected response structure for ${service}:`, data);
                     currentStatusMessages[service] = { type: 'error', message: "Unexpected response from server." };
                }

            } catch (error) {
                console.error(`Caught error calling function for ${service}:`, error);
                let errorMessage = `Failed to save ${service} key.`;
                 if (error instanceof FunctionsError) {
                      errorMessage = `Function error: ${error.message} (Code: ${error.code})`;
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
            // Set general error only if it wasn't already set by auth/token issues
            // Check generalError state *before* setting it again
            if (!generalError) {
                 setGeneralError("Some API keys could not be saved. See details below.");
            }
        } else {
            // Clear general error only if all saves were successful AND no prior general error exists
             if (!generalError) { // Avoid clearing auth/token errors
                 setGeneralError(null);
             }
        }
    // --- LINT FIX: Added generalError and setters, removed app ---
    // Include state variables read *or written* inside the callback.
    // Exclude stable imports like 'app'.
    }, [apiKeys, user, authLoading, generalError, setGeneralError, setStatusMessages, setSavedKeyStatus, setApiKeys, initializedFunctions]); // Added initializedFunctions back as it IS used


    if (isLoadingStatus && !authLoading) {
         return <p className="text-center text-sm text-muted-foreground">Loading key status...</p>;
    }

    return (
        <div className="space-y-6">
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
                                    placeholder={showSavedPlaceholder ? '•••••••• Key Saved' : `Enter your ${label}`}
                                    disabled={isSaving || authLoading || isLoadingStatus}
                                    className="transition-colors duration-200 focus:border-primary focus:ring-primary flex-grow"
                                />
                                {isSaved && (
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" aria-label="Key saved indicator"/>
                                )}
                            </div>
                             <p className="text-xs text-muted-foreground px-1">
                                 {isSaved ? "Entering a new key will overwrite the saved one." : "Your key will be stored securely."}
                             </p>
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

             {authLoading && <p className="text-center text-sm text-muted-foreground">Checking authentication status...</p>}
             {!authLoading && !user && <p className="text-center text-sm text-destructive">Please log in to manage API keys.</p>}
        </div>
    );
};

export default ApiKeyManager;
