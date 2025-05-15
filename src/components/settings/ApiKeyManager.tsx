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
// --- Import Tooltip components ---
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
// --- Import Icons ---
import { Terminal, CheckCircle, Info, ExternalLink } from "lucide-react"; // Added ExternalLink

// Interface for the structure of API key input fields
interface ApiKeyInput {
    id: string; // Unique identifier (e.g., 'openai', 'google_ai', 'anthropic', 'xai', 'together_ai')
    label: string; // User-friendly label for the input
    value: string; // Current value entered by the user
    tooltip: string; // Tooltip help text
    learnMoreLink?: string; // Optional link for more details
}

// Interface for the data sent to the Firebase Function
interface SaveApiKeyRequest {
    apiKey: string; // The API key string
    service: string; // The identifier of the service (e.g., 'openai', 'anthropic', 'xai', 'together_ai')
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
const initialApiKeys: ApiKeyInput[] = [
    {
        id: 'openai',
        label: 'OpenAI API Key',
        value: '',
        tooltip: 'Used for OpenAI models (GPT series, TTS, etc.). Requires an OpenAI account. Usage may incur costs. Find keys at platform.openai.com/api-keys.',
        learnMoreLink: 'https://platform.openai.com/api-keys'
    },
    {
        id: 'google_ai', // This ID is used by SessionSetupForm (via tts_models.ts if apiKeyId is 'google_ai')
        label: 'Google Cloud API Key', // Updated label
        value: '',
        tooltip: "Your general Google Cloud API Key. Used for AI Studio (Gemini models) and other Google Cloud services like Text-to-Speech. Ensure relevant APIs (e.g., 'Vertex AI API' for Gemini, 'Cloud Text-to-Speech API' for TTS) are enabled in your Google Cloud Console project. Create keys in AI Studio or Google Cloud Console.",
        learnMoreLink: 'https://console.cloud.google.com/apis/library'
    },
    {
        id: 'anthropic',
        label: 'Anthropic API Key',
        value: '',
        tooltip: 'Used for Anthropic Claude models. Requires an Anthropic account. Usage typically incurs costs. Manage keys at console.anthropic.com/settings/keys.',
        learnMoreLink: 'https://console.anthropic.com/settings/keys'
    },
    {
        id: 'xai',
        label: 'XAI (Grok) API Key',
        value: '',
        tooltip: 'Used for Grok models from xAI. Requires an xAI account. Find keys at console.x.ai (or similar). Costs may apply.',
        learnMoreLink: 'https://console.x.ai' // Placeholder, actual link might differ
    },
    {
        id: 'together_ai',
        label: 'TogetherAI API Key',
        value: '',
        tooltip: 'Used for various open-source models hosted by TogetherAI. Find keys at api.together.ai/settings/api-keys.',
        learnMoreLink: 'https://api.together.ai/settings/api-keys'
    },
];

const ApiKeyManager: React.FC = () => {
    const { user, loading: authLoading } = useAuth();

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
                        const versions = data?.apiSecretVersions || {};
                        initialApiKeys.forEach(key => {
                            status[key.id] = !!(versions[key.id] && typeof versions[key.id] === 'string' && versions[key.id].length > 0);
                        });
                    } else {
                        initialApiKeys.forEach(key => { status[key.id] = false; });
                    }
                    setSavedKeyStatus(status);
                } catch (error) {
                    console.error("Error fetching user document for key status:", error);
                    setGeneralError("Could not load saved key status. Please try refreshing.");
                    const resetStatus: Record<string, boolean> = {};
                    initialApiKeys.forEach(key => { resetStatus[key.id] = false; });
                    setSavedKeyStatus(resetStatus);
                } finally {
                    setIsLoadingStatus(false);
                }
            } else if (!authLoading) {
                const resetStatus: Record<string, boolean> = {};
                initialApiKeys.forEach(key => { resetStatus[key.id] = false; });
                setSavedKeyStatus(resetStatus);
                setIsLoadingStatus(false);
            }
        };
        fetchKeyStatus();
    }, [user, authLoading]);

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
         if (authLoading || !user || !firebaseAuth.currentUser || firebaseAuth.currentUser.uid !== user.uid || !app || !initializedFunctions) {
             setGeneralError("Authentication issue or Firebase services not ready. Please ensure you are logged in.");
             return;
        }
        setIsSaving(true);
        setGeneralError(null);
        const currentStatusMessages: Record<string, { type: 'success' | 'error'; message: string }> = {};
        const saveApiKeyFunction = httpsCallable<SaveApiKeyRequest, SaveApiKeySuccessResponse | SaveApiKeyErrorResponse>(initializedFunctions, 'saveApiKey');
        const keysToSave = apiKeys.filter(key => key.value.trim() !== '');

        if (keysToSave.length === 0) {
            setGeneralError("No new API keys entered to save.");
            setIsSaving(false);
            return;
        }
        try {
            await user.getIdToken(true);
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
                const result = await saveApiKeyFunction(dataToSend);
                const data = result.data;
                if (typeof data === 'object' && data !== null && 'message' in data && !('error' in data)) {
                    const successData = data as SaveApiKeySuccessResponse;
                    currentStatusMessages[service] = { type: 'success', message: successData.message };
                    newlySavedKeys[service] = true;
                    setApiKeys(prev => prev.map(k => k.id === service ? { ...k, value: '' } : k));
                } else if (typeof data === 'object' && data !== null && 'error' in data) {
                    const errorMsg = (data as SaveApiKeyErrorResponse)?.error || 'Unknown error structure received.';
                    currentStatusMessages[service] = { type: 'error', message: `Error: ${errorMsg}` };
                } else {
                     currentStatusMessages[service] = { type: 'error', message: "Received an unexpected response from the server." };
                }
            } catch (error) {
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
        if (hasErrors && !generalError) {
            setGeneralError("Some API keys could not be saved. Please check the details below.");
        } else if (!hasErrors && !generalError) {
            setGeneralError(null);
        }
    }, [apiKeys, user, authLoading, generalError]);


    if (isLoadingStatus && !authLoading) {
         return <p className="text-center text-sm text-muted-foreground p-4">Loading key status...</p>;
    }

    return (
        <TooltipProvider delayDuration={100}>
            <div className="space-y-6">
                {generalError && (
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{generalError}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-4">
                    {initialApiKeys.map(({ id, label, tooltip, learnMoreLink }) => {
                        const currentKeyValue = apiKeys.find(k => k.id === id)?.value ?? '';
                        const isSaved = savedKeyStatus[id] === true;
                        const showSavedPlaceholder = isSaved && currentKeyValue === '';

                        return (
                            <div key={id} className="space-y-2 pb-2">
                                <div className="flex items-center space-x-1.5">
                                    <Label htmlFor={id}>{label}</Label>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                            <p className="text-xs">{tooltip}</p>
                                            {learnMoreLink && (
                                                <a
                                                    href={learnMoreLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-500 hover:text-blue-600 underline mt-1 flex items-center"
                                                >
                                                    Learn more <ExternalLink className="h-3 w-3 ml-1" />
                                                </a>
                                            )}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>

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

                                {/* Specific note for Google AI Key regarding TTS */}
                                {id === 'google_ai' && (
                                    <Alert variant="default" className="mt-2 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700">
                                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <AlertTitle className="text-blue-700 dark:text-blue-300">Using Google Text-to-Speech (TTS)</AlertTitle>
                                        <AlertDescription className="text-blue-600 dark:text-blue-400">
                                            To use Google TTS voices, ensure the <strong className="font-semibold">&quot;Cloud Text-to-Speech API&quot;</strong> is enabled
                                            in the same Google Cloud Project associated with this API key. You can manage APIs
                                            <a
                                                href="https://console.cloud.google.com/apis/library/texttospeech.googleapis.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline hover:text-blue-700 dark:hover:text-blue-200 font-medium"
                                            >
                                                &nbsp;here <ExternalLink className="inline h-3 w-3" />
                                            </a>.
                                        </AlertDescription>
                                    </Alert>
                                )}

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
        </TooltipProvider>
    );
};

export default ApiKeyManager;
