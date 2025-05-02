// src/components/settings/SessionSetupForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/clientApp';
import { AVAILABLE_LLMS, LLMInfo, groupLLMsByProvider } from '@/lib/models';
import {
    AVAILABLE_TTS_PROVIDERS,
    TTSProviderInfo,
    TTSVoice,
    getVoicesForProvider,
    getDefaultVoiceForProvider
} from '@/lib/tts_models';
import { AlertTriangle } from "lucide-react";

// --- Define TTS Types (using imported types) ---
type TTSProviderId = TTSProviderInfo['id'];

// Interface for storing TTS settings for one agent
interface AgentTTSSettings {
    provider: TTSProviderId;
    voice: string | null; // Stores the voice ID or name
}

// --- SessionConfig Interface ---
interface SessionConfig {
    agentA_llm: string;
    agentB_llm: string;
    ttsEnabled: boolean;
    agentA_tts: AgentTTSSettings;
    agentB_tts: AgentTTSSettings;
}

// Props for the SessionSetupForm component
interface SessionSetupFormProps {
    onStartSession: (config: SessionConfig) => void; // Callback when the user starts a session
    isLoading: boolean; // Indicates if the session start process is ongoing
}

// Pre-group LLM options for efficiency
const groupedLLMOptions = groupLLMsByProvider();

// --- Determine all potentially required API key IDs ---
// Updated to include 'together_ai'
const ALL_REQUIRED_KEY_IDS = ['openai', 'google_ai', 'anthropic', 'xai', 'groq', 'together_ai'];


// --- Main Component Definition ---
function SessionSetupForm({ onStartSession, isLoading }: SessionSetupFormProps) {
    const { user, loading: authLoading } = useAuth(); // Get user and auth loading state

    // --- State Variables ---
    const [agentA_llm, setAgentA_llm] = useState<string>('');
    const [agentB_llm, setAgentB_llm] = useState<string>('');
    const [savedKeyStatus, setSavedKeyStatus] = useState<Record<string, boolean>>({});
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);
    const [statusError, setStatusError] = useState<string | null>(null);
    const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);
    // Ensure AVAILABLE_TTS_PROVIDERS is not empty before accessing index 0
    const defaultTTSProvider = AVAILABLE_TTS_PROVIDERS.length > 0 ? AVAILABLE_TTS_PROVIDERS[0].id : 'openai'; // Fallback if empty
    const defaultVoiceA = getDefaultVoiceForProvider(defaultTTSProvider)?.id ?? null;
    const defaultVoiceB = getDefaultVoiceForProvider(defaultTTSProvider)?.id ?? null;
    const [agentATTSSettings, setAgentATTSSettings] = useState<AgentTTSSettings>({
        provider: defaultTTSProvider, voice: defaultVoiceA,
    });
    const [agentBTTSSettings, setAgentBTTSSettings] = useState<AgentTTSSettings>({
        provider: defaultTTSProvider, voice: defaultVoiceB,
    });
    const [currentExternalVoicesA, setCurrentExternalVoicesA] = useState<TTSVoice[]>([]);
    const [currentExternalVoicesB, setCurrentExternalVoicesB] = useState<TTSVoice[]>([]);

    // --- Effects ---
    useEffect(() => {
        const fetchKeyStatus = async () => {
            if (user) {
                setIsLoadingStatus(true);
                setStatusError(null);
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    const status: Record<string, boolean> = {};
                    if (userDocSnap.exists()) {
                        const data: DocumentData = userDocSnap.data();
                        const versions: Record<string, string> = data?.apiSecretVersions || {};
                        // Check status for all defined required keys
                        ALL_REQUIRED_KEY_IDS.forEach(keyId => {
                            const versionValue = versions[keyId];
                            status[keyId] = !!(versionValue && typeof versionValue === 'string' && versionValue.length > 0);
                        });
                    } else {
                        // If doc doesn't exist, all keys are considered missing
                        ALL_REQUIRED_KEY_IDS.forEach(keyId => { status[keyId] = false; });
                    }
                    setSavedKeyStatus(status);
                    console.log("Fetched Key Status:", status);
                } catch (error) {
                    console.error("Error fetching key status:", error);
                    setStatusError("Could not load API key status.");
                    const resetStatus: Record<string, boolean> = {};
                    ALL_REQUIRED_KEY_IDS.forEach(keyId => { resetStatus[keyId] = false; });
                    setSavedKeyStatus(resetStatus);
                } finally {
                    setIsLoadingStatus(false);
                }
            } else if (!authLoading) {
                // Reset if no user and auth isn't loading
                const resetStatus: Record<string, boolean> = {};
                ALL_REQUIRED_KEY_IDS.forEach(keyId => { resetStatus[keyId] = false; });
                setSavedKeyStatus(resetStatus);
                setIsLoadingStatus(false);
            }
        };
        fetchKeyStatus();
    }, [user, authLoading]); // Dependencies

    // Effect to update available voices when TTS provider changes for Agent A
    useEffect(() => {
        const voices = getVoicesForProvider(agentATTSSettings.provider);
        setCurrentExternalVoicesA(voices);
        // Reset voice selection if current voice is not available for the new provider
        if (agentATTSSettings.voice && !voices.some(v => v.id === agentATTSSettings.voice)) {
            setAgentATTSSettings(prev => ({ ...prev, voice: voices[0]?.id ?? null }));
        } else if (!agentATTSSettings.voice && voices.length > 0) {
            // Set default voice if none is selected
            setAgentATTSSettings(prev => ({ ...prev, voice: voices[0]?.id ?? null }));
        }
    }, [agentATTSSettings.provider, agentATTSSettings.voice]); // Dependencies

    // Effect to update available voices when TTS provider changes for Agent B
    useEffect(() => {
        const voices = getVoicesForProvider(agentBTTSSettings.provider);
        setCurrentExternalVoicesB(voices);
        // Reset voice selection if current voice is not available for the new provider
        if (agentBTTSSettings.voice && !voices.some(v => v.id === agentBTTSSettings.voice)) {
            setAgentBTTSSettings(prev => ({ ...prev, voice: voices[0]?.id ?? null }));
        } else if (!agentBTTSSettings.voice && voices.length > 0) {
            // Set default voice if none is selected
            setAgentBTTSSettings(prev => ({ ...prev, voice: voices[0]?.id ?? null }));
        }
    }, [agentBTTSSettings.provider, agentBTTSSettings.voice]); // Dependencies

    // --- Event Handlers ---
    const handleStartClick = () => {
        // Find the selected LLM info objects
        const agentAOption = AVAILABLE_LLMS.find(llm => llm.id === agentA_llm);
        const agentBOption = AVAILABLE_LLMS.find(llm => llm.id === agentB_llm);

        // Basic validation: ensure models are selected
        if (!agentAOption || !agentBOption) {
            alert("Please select a model for both Agent A and Agent B.");
            return;
        }

        // --- Key Check using apiKeySecretName ---
        const agentARequiredLLMKey = agentAOption.apiKeySecretName;
        const agentBRequiredLLMKey = agentBOption.apiKeySecretName;

        // Check if the required keys are present based on fetched status
        const isAgentALLMKeyMissing = !savedKeyStatus[agentARequiredLLMKey];
        const isAgentBLLMKeyMissing = !savedKeyStatus[agentBRequiredLLMKey];

        if (isAgentALLMKeyMissing || isAgentBLLMKeyMissing) {
            let missingKeysMsg = "Missing required LLM API key in Settings for: ";
            const missingProviders = new Set<string>();
            if (isAgentALLMKeyMissing) missingProviders.add(agentAOption.provider);
            if (isAgentBLLMKeyMissing) missingProviders.add(agentBOption.provider);
            missingKeysMsg += Array.from(missingProviders).join(' and ');
            alert(missingKeysMsg + ".");
            return;
        }
        // --- End Key Check ---

        // TTS validation (if enabled)
        if (ttsEnabled) {
             if (!agentATTSSettings.voice) {
                 alert(`Please select a voice for Agent A's TTS provider (${agentATTSSettings.provider}) or disable TTS.`);
                 return;
             }
             if (!agentBTTSSettings.voice) {
                  alert(`Please select a voice for Agent B's TTS provider (${agentBTTSSettings.provider}) or disable TTS.`);
                  return;
             }
        }

        // Call the parent component's start function with the full config
        onStartSession({
            agentA_llm,
            agentB_llm,
            ttsEnabled,
            agentA_tts: agentATTSSettings,
            agentB_tts: agentBTTSSettings,
        });
    };

    // Function to check if an LLM option should be disabled based on key status
    const isLLMOptionDisabled = (llm: LLMInfo): boolean => {
        const requiredKey = llm.apiKeySecretName; // Get the secret name directly
        if (!requiredKey) return true; // Should not happen if models.ts is correct
        return isLoadingStatus || !savedKeyStatus[requiredKey]; // Check status using the correct key ID
    };

    const handleTtsToggle = (checked: boolean | 'indeterminate') => {
         setTtsEnabled(Boolean(checked));
    };

    const handleTTSProviderChange = (agent: 'A' | 'B', providerId: TTSProviderId) => {
         const setter = agent === 'A' ? setAgentATTSSettings : setAgentBTTSSettings;
         const voices = getVoicesForProvider(providerId);
         const defaultVoice = voices.length > 0 ? voices[0].id : null;
         setter({ provider: providerId, voice: defaultVoice });
    };

    const handleExternalVoiceChange = (agent: 'A' | 'B', voiceId: string) => {
         const setter = agent === 'A' ? setAgentATTSSettings : setAgentBTTSSettings;
        setter(prev => ({ ...prev, voice: voiceId }));
    };

    const isTTSProviderDisabled = (provider: TTSProviderInfo): boolean => {
        // Example: Disable OpenAI TTS if the 'openai' key is missing
        if (provider.id === 'openai') {
            return isLoadingStatus || !savedKeyStatus['openai'];
        }
        // Add checks for other TTS providers requiring keys here
        // if (provider.id === 'elevenlabs') {
        //     return isLoadingStatus || !savedKeyStatus['elevenlabs']; // Assuming 'elevenlabs' is the key ID
        // }
        return false; // Default to enabled if no specific key check needed
    };

    const isStartDisabled = isLoading || isLoadingStatus || !agentA_llm || !agentB_llm || !user;

    // --- Render the form ---
    return (
        <TooltipProvider delayDuration={100}>
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Start a New Conversation</CardTitle>
                    <CardDescription>Select the LLM and optional Text-to-Speech settings for each agent.</CardDescription>
                    {statusError && <p className="text-sm text-destructive pt-2">{statusError}</p>}
                    {isLoadingStatus && !authLoading && !statusError && <p className="text-sm text-muted-foreground pt-2">Loading API key status...</p>}
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* --- LLM Selection Section --- */}
                    <div className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Agent A LLM Selector */}
                            <div className="space-y-2">
                                <Label htmlFor="agentA-llm">Agent A Model</Label>
                                <Select value={agentA_llm} onValueChange={setAgentA_llm} disabled={isLoading || isLoadingStatus || !user}>
                                    <SelectTrigger id="agentA-llm" className="w-full">
                                        <SelectValue placeholder="Select LLM for Agent A" className="truncate" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(groupedLLMOptions).map(([provider, llms]: [string, LLMInfo[]]) => (
                                            <SelectGroup key={provider}>
                                                <SelectLabel>{provider}</SelectLabel>
                                                {llms.map((llm: LLMInfo) => {
                                                    const isDisabled = isLLMOptionDisabled(llm);
                                                    return (
                                                        <SelectItem
                                                            key={llm.id}
                                                            value={llm.id}
                                                            disabled={isDisabled}
                                                            className="pr-2 py-2"
                                                        >
                                                            <div className="flex justify-between items-center w-full text-sm">
                                                                <div className="flex items-center space-x-1.5 mr-2 overflow-hidden">
                                                                    {/* --- Org Verification Warning Popover --- */}
                                                                    {llm.requiresOrgVerification && !isDisabled && (
                                                                        <Popover>
                                                                            <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                                                <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 cursor-help"/>
                                                                            </PopoverTrigger>
                                                                            <PopoverContent className="w-auto p-2" side="top">
                                                                                <p className="text-xs max-w-[200px]">
                                                                                    Requires verified OpenAI org.
                                                                                    <a
                                                                                        href="https://platform.openai.com/settings/organization/general"
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="underline text-blue-500 hover:text-blue-600 ml-1"
                                                                                    >
                                                                                        Verify here
                                                                                    </a>
                                                                                    .
                                                                                </p>
                                                                            </PopoverContent>
                                                                        </Popover>
                                                                    )}
                                                                    {/* --- End Org Verification Warning --- */}
                                                                    <span className="truncate font-medium" title={llm.name}>
                                                                        {llm.name}
                                                                        {llm.status === 'preview' && <span className="ml-1 text-xs text-orange-500">(Preview)</span>}
                                                                        {llm.status === 'beta' && <span className="ml-1 text-xs text-blue-500">(Beta)</span>}
                                                                    </span>
                                                                    {isDisabled && !isLoadingStatus && <span className="text-xs text-muted-foreground">(Key Missing)</span>}
                                                                </div>
                                                                {/* Display pricing note if available */}
                                                                {!isDisabled && llm.pricing.note && (
                                                                    <span className="text-xs text-muted-foreground whitespace-nowrap pl-2 flex-shrink-0" title={llm.pricing.note}>
                                                                        ({llm.pricing.note})
                                                                    </span>
                                                                )}
                                                                {/* Display token pricing if note doesn't exist */}
                                                                {!isDisabled && !llm.pricing.note && (
                                                                    <span className="text-xs text-muted-foreground whitespace-nowrap pl-2 flex-shrink-0">
                                                                        ${llm.pricing.input.toFixed(2)} / ${llm.pricing.output.toFixed(2)} MTok
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Agent B LLM Selector (Repeat the same logic) */}
                            <div className="space-y-2">
                                <Label htmlFor="agentB-llm">Agent B Model</Label>
                                <Select value={agentB_llm} onValueChange={setAgentB_llm} disabled={isLoading || isLoadingStatus || !user}>
                                    <SelectTrigger id="agentB-llm" className="w-full">
                                        <SelectValue placeholder="Select LLM for Agent B" className="truncate" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(groupedLLMOptions).map(([provider, llms]: [string, LLMInfo[]]) => (
                                            <SelectGroup key={provider}>
                                                <SelectLabel>{provider}</SelectLabel>
                                                {llms.map((llm: LLMInfo) => {
                                                    const isDisabled = isLLMOptionDisabled(llm);
                                                    return (
                                                        <SelectItem
                                                            key={llm.id}
                                                            value={llm.id}
                                                            disabled={isDisabled}
                                                            className="pr-2 py-2"
                                                        >
                                                            <div className="flex justify-between items-center w-full text-sm">
                                                                <div className="flex items-center space-x-1.5 mr-2 overflow-hidden">
                                                                     {/* --- Org Verification Warning Popover --- */}
                                                                    {llm.requiresOrgVerification && !isDisabled && (
                                                                        <Popover>
                                                                            <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                                                <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 cursor-help"/>
                                                                            </PopoverTrigger>
                                                                            <PopoverContent className="w-auto p-2" side="top">
                                                                                <p className="text-xs max-w-[200px]">
                                                                                    Requires verified OpenAI org.
                                                                                    <a
                                                                                        href="https://platform.openai.com/settings/organization/general"
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="underline text-blue-500 hover:text-blue-600 ml-1"
                                                                                    >
                                                                                        Verify here
                                                                                    </a>
                                                                                    .
                                                                                </p>
                                                                            </PopoverContent>
                                                                        </Popover>
                                                                    )}
                                                                     {/* --- End Org Verification Warning --- */}
                                                                    <span className="truncate font-medium" title={llm.name}>
                                                                        {llm.name}
                                                                        {llm.status === 'preview' && <span className="ml-1 text-xs text-orange-500">(Preview)</span>}
                                                                        {llm.status === 'beta' && <span className="ml-1 text-xs text-blue-500">(Beta)</span>}
                                                                    </span>
                                                                    {isDisabled && !isLoadingStatus && <span className="text-xs text-muted-foreground">(Key Missing)</span>}
                                                                </div>
                                                                 {/* Display pricing note if available */}
                                                                 {!isDisabled && llm.pricing.note && (
                                                                    <span className="text-xs text-muted-foreground whitespace-nowrap pl-2 flex-shrink-0" title={llm.pricing.note}>
                                                                        ({llm.pricing.note})
                                                                    </span>
                                                                )}
                                                                {/* Display token pricing if note doesn't exist */}
                                                                {!isDisabled && !llm.pricing.note && (
                                                                    <span className="text-xs text-muted-foreground whitespace-nowrap pl-2 flex-shrink-0">
                                                                        ${llm.pricing.input.toFixed(2)} / ${llm.pricing.output.toFixed(2)} MTok
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {/* --- Added Explanation Note for Warning Icon --- */}
                        <p className="text-xs text-muted-foreground px-1 flex items-center">
                             <AlertTriangle className="h-3 w-3 text-yellow-500 mr-1 flex-shrink-0"/>
                             Indicates model requires a verified OpenAI organization. You can
                             <a
                                href="https://platform.openai.com/settings/organization/general"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-blue-500 hover:text-blue-600 ml-1"
                            >
                                verify here
                            </a>.
                        </p>
                        {/* --- End Explanation Note --- */}
                    </div>


                    {/* --- TTS Configuration Section --- */}
                    <hr className="my-6" />
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="tts-enabled-checkbox" checked={ttsEnabled} onCheckedChange={handleTtsToggle} disabled={!user} />
                            <Label htmlFor="tts-enabled-checkbox" className="text-base font-medium">Enable Text-to-Speech (TTS)</Label>
                        </div>
                        {ttsEnabled && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                {/* Agent A TTS Settings */}
                                <div className="space-y-3 p-4 border rounded-md bg-background/50">
                                    <h3 className="font-semibold text-center mb-3">Agent A TTS Voice</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="agent-a-tts-provider">Provider</Label>
                                        <Select value={agentATTSSettings.provider} onValueChange={(value: TTSProviderId) => handleTTSProviderChange('A', value)} disabled={!user || isLoadingStatus || AVAILABLE_TTS_PROVIDERS.length === 0}>
                                            <SelectTrigger id="agent-a-tts-provider" className="w-full">
                                                <SelectValue placeholder="Select TTS Provider" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {AVAILABLE_TTS_PROVIDERS.length > 0 ? (
                                                    AVAILABLE_TTS_PROVIDERS.map(p => {
                                                        const isDisabled = isTTSProviderDisabled(p);
                                                        return (
                                                            <SelectItem key={p.id} value={p.id} disabled={isDisabled}>
                                                                {p.name}
                                                                {isDisabled && ' (Key Missing)'}
                                                            </SelectItem>
                                                        );
                                                    })
                                                ) : (
                                                    <SelectItem value="no-providers" disabled>No TTS providers available</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {agentATTSSettings.provider && (
                                        <div className="space-y-2">
                                            <Label htmlFor="agent-a-external-voice">Voice ({AVAILABLE_TTS_PROVIDERS.find(p=>p.id === agentATTSSettings.provider)?.name})</Label>
                                            <Select
                                                value={agentATTSSettings.voice || ''}
                                                onValueChange={(value) => handleExternalVoiceChange('A', value)}
                                                disabled={!user || currentExternalVoicesA.length === 0}
                                            >
                                                <SelectTrigger id="agent-a-external-voice" className="w-full">
                                                    <SelectValue placeholder="Select Voice" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                        {currentExternalVoicesA.length > 0 ? (
                                                            currentExternalVoicesA.map(v => (
                                                                <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem value="no-voices" disabled>No voices available</SelectItem>
                                                        )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                                {/* Agent B TTS Settings */}
                                <div className="space-y-3 p-4 border rounded-md bg-background/50">
                                    <h3 className="font-semibold text-center mb-3">Agent B TTS Voice</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="agent-b-tts-provider">Provider</Label>
                                        <Select value={agentBTTSSettings.provider} onValueChange={(value: TTSProviderId) => handleTTSProviderChange('B', value)} disabled={!user || isLoadingStatus || AVAILABLE_TTS_PROVIDERS.length === 0}>
                                            <SelectTrigger id="agent-b-tts-provider" className="w-full">
                                                <SelectValue placeholder="Select TTS Provider" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {AVAILABLE_TTS_PROVIDERS.length > 0 ? (
                                                    AVAILABLE_TTS_PROVIDERS.map(p => {
                                                        const isDisabled = isTTSProviderDisabled(p);
                                                        return (
                                                            <SelectItem key={p.id} value={p.id} disabled={isDisabled}>
                                                                {p.name}
                                                                {isDisabled && ' (Key Missing)'}
                                                            </SelectItem>
                                                        );
                                                    })
                                                ) : (
                                                    <SelectItem value="no-providers" disabled>No TTS providers available</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {agentBTTSSettings.provider && (
                                        <div className="space-y-2">
                                            <Label htmlFor="agent-b-external-voice">Voice ({AVAILABLE_TTS_PROVIDERS.find(p=>p.id === agentBTTSSettings.provider)?.name})</Label>
                                                <Select
                                                value={agentBTTSSettings.voice || ''}
                                                onValueChange={(value) => handleExternalVoiceChange('B', value)}
                                                disabled={!user || !agentBTTSSettings.provider || currentExternalVoicesB.length === 0}
                                            >
                                                <SelectTrigger id="agent-b-external-voice" className="w-full">
                                                    <SelectValue placeholder="Select Voice" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                        {currentExternalVoicesB.length > 0 ? (
                                                            currentExternalVoicesB.map(v => (
                                                                <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem value="no-voices" disabled>No voices available</SelectItem>
                                                        )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center pt-6">
                    <Button
                        onClick={handleStartClick}
                        disabled={isStartDisabled}
                        className="w-full max-w-xs"
                    >
                        {isLoading ? 'Starting...' : 'Start Conversation'}
                    </Button>
                    {!user && !authLoading && (
                        <p className="text-center text-sm text-destructive mt-4">Please sign in to start a conversation.</p>
                    )}
                </CardFooter>
            </Card>
        </TooltipProvider>
    );
};

// --- Ensure only ONE default export ---
export default SessionSetupForm;
