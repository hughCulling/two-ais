// src/components/settings/ApiKeyManager.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { httpsCallable, FunctionsError } from 'firebase/functions';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
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
        tooltip: 'Used for OpenAI models (GPT series, TTS, etc.). Requires an OpenAI account. Usage will incur costs. Find keys at platform.openai.com/api-keys.',
        learnMoreLink: 'https://platform.openai.com/api-keys'
    },
    {
        id: 'google_ai', // This ID is used by SessionSetupForm (via tts_models.ts if apiKeyId is 'google_ai')
        label: 'Google Cloud API Key', // Updated label
        value: '',
        tooltip: "Your general Google Cloud API Key. Used for AI Studio (Gemini models) and other Google Cloud services like Text-to-Speech. Ensure relevant APIs (e.g., 'Vertex AI API' for Gemini, 'Cloud Text-to-Speech API' for TTS) are enabled in your Google Cloud Console project. Create keys in AI Studio or Google Cloud Console.",
        learnMoreLink: 'https://console.cloud.google.com/apis/library'
    },
    // {
    //     id: 'elevenlabs',
    //     label: 'Eleven Labs API Key',
    //     value: '',
    //     tooltip: 'Used for Eleven Labs Text-to-Speech voices. Create a free account at elevenlabs.io to get started or upgrade for more features. Generate your API key from your Eleven Labs dashboard.',
    //     learnMoreLink: 'https://elevenlabs.io/app/settings/api-keys'
    // },
    {
        id: 'anthropic',
        label: 'Anthropic API Key',
        value: '',
        tooltip: 'Used for Anthropic Claude models. Requires an Anthropic account. Usage typically incurs costs. Manage keys at console.anthropic.com/settings/keys.',
        learnMoreLink: 'https://console.anthropic.com/settings/keys'
    },
    {
        id: 'xai',
        label: 'xAI API Key',
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
    {
        id: 'deepseek',
        label: 'DeepSeek API Key',
        value: '',
        tooltip: 'Used for DeepSeek models. Create an account and get your API key at platform.deepseek.com/api-keys. The API key is only visible once at creation, so save it securely.',
        learnMoreLink: 'https://platform.deepseek.com/api-keys'
    },
    {
        id: 'mistral',
        label: 'Mistral AI API Key',
        value: '',
        tooltip: 'Used for Mistral AI models (Mistral, Magistral, Ministral). Create an account and get your API key at console.mistral.ai/api-keys. The API key is only shown once at creation, so save it securely.',
        learnMoreLink: 'https://console.mistral.ai/api-keys'
    },
];

export default function ApiKeyManager() {
    const { user, loading: authLoading } = useAuth();
    const { t, loading } = useTranslation();

    // All hooks must be called before any return or conditional
    const [apiKeys, setApiKeys] = useState<ApiKeyInput[]>(() =>
        initialApiKeys.map(key => {
            const translatedLabel = key.label;
            const translatedTooltip = key.tooltip;

            // These will be updated after t is loaded, but that's fine for initial state
            return { ...key, label: translatedLabel, tooltip: translatedTooltip };
        })
    );
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
                    if (t) setGeneralError(t.page_ErrorLoadingUserData.replace('{errorMessage}', error instanceof Error ? error.message : String(error)));
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
    }, [user, authLoading, t]);

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
             if (t) setGeneralError(t.auth.errors.generic);
             return;
        }
        setIsSaving(true);
        setGeneralError(null);
        const currentStatusMessages: Record<string, { type: 'success' | 'error'; message: string }> = {};
        const saveApiKeyFunction = httpsCallable<SaveApiKeyRequest, SaveApiKeySuccessResponse | SaveApiKeyErrorResponse>(initializedFunctions, 'saveApiKey');
        const keysToSave = apiKeys.filter(key => key.value.trim() !== '');

        if (keysToSave.length === 0) {
            if (t) setGeneralError(t.settings.apiKeys.noNewKeys);
            setIsSaving(false);
            return;
        }
        try {
            await user.getIdToken(true);
        } catch (tokenError) {
            console.error("Error refreshing ID token:", tokenError);
            if (t) setGeneralError(t.auth.errors.generic + " (Token refresh failed)");
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
                    const errorMsg = (data as SaveApiKeyErrorResponse)?.error || (t ? t.common.error : 'Error');
                    currentStatusMessages[service] = { type: 'error', message: `${t ? t.common.error : 'Error'}: ${errorMsg}` };
                } else {
                     currentStatusMessages[service] = { type: 'error', message: t ? t.settings.apiKeys.unexpectedResponse : 'Unexpected response' };
                }
            } catch (error) {
                let errorMessage = t ? t.settings.apiKeys.failedToSaveKey.replace('{serviceName}', service) : 'Failed to save key';
                 if (error instanceof FunctionsError) {
                      errorMessage = `${t ? t.common.error : 'Error'}: ${error.message} (Code: ${error.code})`;
                 } else if (error instanceof Error) {
                     errorMessage = `${t ? t.common.error : 'Error'}: ${error.message}`;
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
            if (t) setGeneralError(t.settings.apiKeys.someKeysNotSaved);
        } else if (!hasErrors && !generalError) {
            setGeneralError(null);
        }
    }, [apiKeys, user, authLoading, generalError, t]);

    // Only after all hooks, check for loading/t
    if (loading || !t) return null;

    return (
        <TooltipProvider delayDuration={100}>
            <div className="space-y-6" role="main" aria-labelledby="api-keys-title">
                
                {generalError && (
                    <Alert variant="destructive" role="alert" aria-live="assertive">
                        <Terminal className="h-4 w-4" aria-hidden="true" />
                        <AlertTitle>{t.common.error}</AlertTitle>
                        <AlertDescription>{generalError}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-4" role="form" aria-labelledby="api-keys-title">
                    {apiKeys.map(({ id, label: initialLabel, tooltip, learnMoreLink }) => {
                        const currentKeyValue = apiKeys.find(k => k.id === id)?.value ?? '';
                        const isSaved = savedKeyStatus[id] === true;
                        const showSavedPlaceholder = isSaved && currentKeyValue === '';
                        
                        // Dynamically set the label text here based on translation and saved status
                        let displayLabel = isSaved ? t.settings.apiKeys.updateKey : t.settings.apiKeys.setKey;
                        // Append service name to the label (e.g., "Update OpenAI Key", "Set Google Cloud Key")
                        // This assumes initialApiKeys has the original English names for appending.
                        const serviceName = initialApiKeys.find(k => k.id === id)?.label.replace(' API Key', '') || id;
                        displayLabel += ` ${serviceName}`;

                        return (
                            <fieldset key={id} className="space-y-2 pb-2 border rounded-lg p-4" role="group" aria-labelledby={`${id}-legend`}>
                                <legend id={`${id}-legend`} className="text-lg font-semibold px-2">
                                    <div className="flex items-center space-x-1.5">
                                        <Label htmlFor={id}>{displayLabel}</Label>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info 
                                                    className="h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" 
                                                    aria-label={`Help information for ${serviceName} API key`}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-xs">
                                                <p className="text-xs">{tooltip}</p>
                                                {learnMoreLink && (
                                                    <a
                                                        href={learnMoreLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-blue-500 hover:text-blue-600 underline mt-1 flex items-center"
                                                        aria-label={`Learn more about ${serviceName} API key (opens in new tab)`}
                                                    >
                                                        Learn more <ExternalLink className="h-3 w-3 ml-1" aria-hidden="true" />
                                                    </a>
                                                )}
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </legend>

                                <div className="flex items-center space-x-2">
                                    <Input
                                        id={id}
                                        type="password"
                                        value={currentKeyValue}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(id, e.target.value)}
                                        placeholder={showSavedPlaceholder ? '•••••••• Key Saved (Enter new key to replace)' : `Enter your ${initialLabel}`}
                                        disabled={isSaving || authLoading || isLoadingStatus}
                                        className="transition-colors duration-200 focus:border-primary focus:ring-primary flex-grow"
                                        aria-describedby={`${id}-description ${id}-status`}
                                        aria-invalid={statusMessages[id]?.type === 'error'}
                                    />
                                    {isSaved && (
                                        <CheckCircle 
                                            className="h-5 w-5 text-green-500 flex-shrink-0" 
                                            aria-label="Key saved indicator"
                                            role="img"
                                            aria-describedby={`${id}-saved-status`}
                                        />
                                    )}
                                </div>
                                 <p id={`${id}-description`} className="text-xs text-muted-foreground px-1">
                                     {isSaved ? t.settings.apiKeys.enteringNewKeyOverwrites : t.settings.apiKeys.keyStoredSecurely}
                                 </p>
                                 {isSaved && (
                                     <div id={`${id}-saved-status`} className="sr-only">
                                         API key for {serviceName} is currently saved and active.
                                     </div>
                                 )}

                                {/* Specific note for Google AI Key regarding TTS */}
                                {id === 'google_ai' && (
                                    <Alert variant="default" className="mt-2 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700" role="note" aria-labelledby="google-tts-note">
                                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                                        <AlertTitle id="google-tts-note" className="text-blue-700 dark:text-blue-300">Using Google Text-to-Speech (TTS)</AlertTitle>
                                        <AlertDescription className="text-blue-600 dark:text-blue-400">
                                            To use Google TTS voices, ensure the <strong className="font-semibold">&quot;Cloud Text-to-Speech API&quot;</strong> is enabled
                                            in the same Google Cloud Project associated with this API key. You can manage APIs
                                            <a
                                                href="https://console.cloud.google.com/apis/library/texttospeech.googleapis.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline hover:text-blue-700 dark:hover:text-blue-200 font-medium"
                                                aria-label="Manage Google Cloud APIs (opens in new tab)"
                                            >
                                                &nbsp;here <ExternalLink className="inline h-3 w-3" aria-hidden="true" />
                                            </a>.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Specific note for Eleven Labs API key */}
                                {id === 'elevenlabs' && (
                                    <Alert variant="default" className="mt-2 bg-purple-50 border-purple-200 dark:bg-purple-900/30 dark:border-purple-700" role="note" aria-labelledby="elevenlabs-note">
                                        <Info className="h-4 w-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                                        <AlertTitle id="elevenlabs-note" className="text-purple-700 dark:text-purple-300">Using Eleven Labs Text-to-Speech</AlertTitle>
                                        <AlertDescription className="text-purple-600 dark:text-purple-400">
                                            Eleven Labs offers several models with different quality and speed. For best results, try the Multilingual V2 model for rich emotional expression or Flash V2.5 for ultra-low latency. Get your API key from your
                                            <a
                                                href="https://elevenlabs.io/app/settings/api-keys"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline hover:text-purple-700 dark:hover:text-purple-200 font-medium"
                                                aria-label="Eleven Labs dashboard (opens in new tab)"
                                            >
                                                &nbsp;Eleven Labs dashboard <ExternalLink className="inline h-3 w-3" aria-hidden="true" />
                                            </a>.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {statusMessages[id] && (
                                    <Alert 
                                        variant={statusMessages[id].type === 'success' ? 'default' : 'destructive'} 
                                        className="mt-2" 
                                        role="alert" 
                                        aria-live="polite"
                                        aria-labelledby={`${id}-status-title`}
                                    >
                                        {statusMessages[id].type === 'success' ? <CheckCircle className="h-4 w-4" aria-hidden="true" /> : <Terminal className="h-4 w-4" aria-hidden="true" />}
                                        <AlertTitle id={`${id}-status-title`}>{statusMessages[id].type === 'success' ? 'Success' : 'Error'}</AlertTitle>
                                        <AlertDescription id={`${id}-status`}>{statusMessages[id].message}</AlertDescription>
                                    </Alert>
                                )}
                            </fieldset>
                        );
                    })}
                </div>

                <Button
                    onClick={saveKeys}
                    disabled={isSaving || authLoading || !user || isLoadingStatus}
                    className="w-full transition-opacity duration-200"
                    aria-label={isSaving ? 'Saving API keys...' : 'Save or update all entered API keys'}
                    aria-describedby="save-button-description"
                >
                    {isSaving ? t.settings.apiKeys.saving : t.settings.apiKeys.saveUpdateKeys}
                </Button>
                <div id="save-button-description" className="sr-only">
                    Click to save or update all API keys that have been entered. Keys are stored securely and encrypted.
                </div>

                 {authLoading && <p className="text-center text-sm text-muted-foreground" role="status" aria-live="polite">Checking authentication status...</p>}
                 {!authLoading && !user && <p className="text-center text-sm text-destructive" role="alert" aria-live="assertive">Please log in to manage API keys.</p>}
            </div>
        </TooltipProvider>
    );
};