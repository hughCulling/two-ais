// src/components/session/SessionSetupForm.tsx
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
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/clientApp';
import { AVAILABLE_LLMS, LLMInfo, groupLLMsByProvider } from '@/lib/models';
// --- Import updated TTS types and data (only OpenAI left) ---
import {
    AVAILABLE_TTS_PROVIDERS,
    TTSProviderInfo,
    TTSVoice,
    getVoicesForProvider,
    getDefaultVoiceForProvider
} from '@/lib/tts_models'; // Adjust path if needed

// --- Define TTS Types (using imported types) ---
// TTSProviderId now correctly only includes 'openai'
type TTSProviderId = TTSProviderInfo['id'];

// Interface for storing TTS settings for one agent
interface AgentTTSSettings {
    provider: TTSProviderId;
    voice: string | null; // Stores the voice ID or name
}

// --- SessionConfig Interface ---
// Defines the overall configuration for a new session
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
// Now only includes LLM keys as OpenAI TTS uses the LLM key
const ALL_REQUIRED_KEY_IDS = ['openai', 'google_ai', 'anthropic'];


export default function SessionSetupForm({ onStartSession, isLoading }: SessionSetupFormProps) {
    const { user, loading: authLoading } = useAuth(); // Get user and auth loading state

    // --- State Variables ---
    // LLM Selection
    const [agentA_llm, setAgentA_llm] = useState<string>(''); // Selected LLM ID for Agent A
    const [agentB_llm, setAgentB_llm] = useState<string>(''); // Selected LLM ID for Agent B

    // API Key Status
    const [savedKeyStatus, setSavedKeyStatus] = useState<Record<string, boolean>>({}); // Tracks if required keys are saved
    const [isLoadingStatus, setIsLoadingStatus] = useState(true); // Loading state for key status check
    const [statusError, setStatusError] = useState<string | null>(null); // Error state for key status check

    // TTS Configuration
    const [ttsEnabled, setTtsEnabled] = useState<boolean>(true); // Whether TTS is globally enabled

    // --- Default TTS provider to the only available one ('openai') ---
    const defaultTTSProvider = AVAILABLE_TTS_PROVIDERS[0]?.id || 'openai'; // Should always be 'openai' now
    const defaultVoiceA = getDefaultVoiceForProvider(defaultTTSProvider)?.id ?? null;
    const defaultVoiceB = getDefaultVoiceForProvider(defaultTTSProvider)?.id ?? null; // Can refine B's default later

    const [agentATTSSettings, setAgentATTSSettings] = useState<AgentTTSSettings>({
        provider: defaultTTSProvider, voice: defaultVoiceA,
    });
    const [agentBTTSSettings, setAgentBTTSSettings] = useState<AgentTTSSettings>({
        provider: defaultTTSProvider, voice: defaultVoiceB,
    });
    // State for the list of voices for the currently selected provider
    const [currentExternalVoicesA, setCurrentExternalVoicesA] = useState<TTSVoice[]>([]);
    const [currentExternalVoicesB, setCurrentExternalVoicesB] = useState<TTSVoice[]>([]);
    // --- End State Variables ---


    // --- Effects ---
    // Effect to Fetch API Key Status from Firestore
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
                        // Check status only for LLM keys now
                        ALL_REQUIRED_KEY_IDS.forEach(keyId => {
                            const versionValue = versions[keyId];
                            status[keyId] = !!(versionValue && typeof versionValue === 'string' && versionValue.length > 0);
                        });
                    } else {
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
                const resetStatus: Record<string, boolean> = {};
                ALL_REQUIRED_KEY_IDS.forEach(keyId => { resetStatus[keyId] = false; });
                setSavedKeyStatus(resetStatus);
                setIsLoadingStatus(false);
            }
        };
        fetchKeyStatus();
    }, [user, authLoading]); // Re-run when user or auth loading state changes


    // Effect to update available voices list when the selected provider changes for Agent A
    useEffect(() => {
        const voices = getVoicesForProvider(agentATTSSettings.provider);
        setCurrentExternalVoicesA(voices);
        // Set default voice if needed
        if (agentATTSSettings.voice && !voices.some(v => v.id === agentATTSSettings.voice)) {
            setAgentATTSSettings(prev => ({ ...prev, voice: voices[0]?.id ?? null }));
        } else if (!agentATTSSettings.voice && voices.length > 0) {
            setAgentATTSSettings(prev => ({ ...prev, voice: voices[0]?.id ?? null }));
        }
    // Added agentATTSSettings.voice to dependency array
    }, [agentATTSSettings.provider, agentATTSSettings.voice]);

    // Effect to update available voices list when the selected provider changes for Agent B
    useEffect(() => {
        const voices = getVoicesForProvider(agentBTTSSettings.provider);
        setCurrentExternalVoicesB(voices);
        // Set default voice if needed
        if (agentBTTSSettings.voice && !voices.some(v => v.id === agentBTTSSettings.voice)) {
            setAgentBTTSSettings(prev => ({ ...prev, voice: voices[0]?.id ?? null }));
        } else if (!agentBTTSSettings.voice && voices.length > 0) {
            setAgentBTTSSettings(prev => ({ ...prev, voice: voices[0]?.id ?? null }));
        }
    // Added agentBTTSSettings.voice to dependency array
    }, [agentBTTSSettings.provider, agentBTTSSettings.voice]);
    // --- End Effects ---


    // --- Event Handlers ---
    // Handle start button click: Validate selections and call onStartSession prop
    const handleStartClick = () => {
        const agentAOption = AVAILABLE_LLMS.find(llm => llm.id === agentA_llm);
        const agentBOption = AVAILABLE_LLMS.find(llm => llm.id === agentB_llm);

        if (!agentAOption || !agentBOption) {
            alert("Please select a model for both Agent A and Agent B.");
            return;
        }

        // LLM API Key Checks
        const agentARequiredLLMKey = agentAOption.provider === 'OpenAI' ? 'openai' : agentAOption.provider === 'Google' ? 'google_ai' : agentAOption.provider === 'Anthropic' ? 'anthropic' : null;
        const agentBRequiredLLMKey = agentBOption.provider === 'OpenAI' ? 'openai' : agentBOption.provider === 'Google' ? 'google_ai' : agentBOption.provider === 'Anthropic' ? 'anthropic' : null;

        if (!agentARequiredLLMKey || !agentBRequiredLLMKey) {
             alert("Internal error: Could not map selected LLM models to required API keys.");
             return;
        }
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

        // TTS Sanity Checks (only if TTS is enabled)
        if (ttsEnabled) {
             // Check if a voice is selected for the chosen provider
             if (!agentATTSSettings.voice) {
                 alert(`Please select a voice for Agent A's TTS provider (${agentATTSSettings.provider}) or disable TTS.`); return;
             }
             if (!agentBTTSSettings.voice) {
                  alert(`Please select a voice for Agent B's TTS provider (${agentBTTSSettings.provider}) or disable TTS.`); return;
             }
             // No need to check for external TTS keys anymore if only OpenAI is left
        }

        // If all checks pass, call the onStartSession prop
        onStartSession({
            agentA_llm, agentB_llm, ttsEnabled,
            agentA_tts: agentATTSSettings, agentB_tts: agentBTTSSettings,
        });
    };

    // Helper function to check if a specific LLM option should be disabled
    const isLLMOptionDisabled = (llm: LLMInfo): boolean => {
         const requiredKey = llm.provider === 'OpenAI' ? 'openai' : llm.provider === 'Google' ? 'google_ai' : llm.provider === 'Anthropic' ? 'anthropic' : null;
        if (!requiredKey) return true;
        return isLoadingStatus || !savedKeyStatus[requiredKey];
    };

    // --- TTS Event Handlers ---
    const handleTtsToggle = (checked: boolean | 'indeterminate') => {
         setTtsEnabled(Boolean(checked));
    };

    // Handles changing the TTS provider for an agent
    const handleTTSProviderChange = (agent: 'A' | 'B', providerId: TTSProviderId) => {
         const setter = agent === 'A' ? setAgentATTSSettings : setAgentBTTSSettings;
         const voices = getVoicesForProvider(providerId);
         const defaultVoice = voices.length > 0 ? voices[0].id : null;
         setter({ provider: providerId, voice: defaultVoice });
    };

    // Handles changing the selected voice for external providers
    const handleExternalVoiceChange = (agent: 'A' | 'B', voiceId: string) => {
         const setter = agent === 'A' ? setAgentATTSSettings : setAgentBTTSSettings;
        setter(prev => ({ ...prev, voice: voiceId }));
    };

    // Helper function to determine if a TTS provider option should be disabled
    const isTTSProviderDisabled = (provider: TTSProviderInfo): boolean => {
        // Disable OpenAI TTS if OpenAI LLM key is missing
        if (provider.id === 'openai') {
            return isLoadingStatus || !savedKeyStatus['openai'];
        }
        // No other providers currently require specific checks
        return false;
    };
    // --- End Event Handlers ---

    // Determine if the start button should be disabled
    const isStartDisabled = isLoading || isLoadingStatus || !agentA_llm || !agentB_llm || !user;

    // --- Render the form ---
    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Start a New Conversation</CardTitle>
                <CardDescription>Select the LLM and optional Text-to-Speech settings for each agent.</CardDescription>
                {statusError && <p className="text-sm text-destructive pt-2">{statusError}</p>}
                {isLoadingStatus && !authLoading && !statusError && <p className="text-sm text-muted-foreground pt-2">Loading API key status...</p>}
            </CardHeader>
            <CardContent className="space-y-6">
                {/* --- LLM Selection Section --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Agent A LLM Selector */}
                    <div className="space-y-2"> {/* Consistent spacing */}
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
                                                        <div className="flex flex-col items-start mr-2 overflow-hidden">
                                                            <span className="truncate font-medium" title={llm.name}>
                                                                {llm.name}
                                                                {llm.status === 'preview' && <span className="ml-1 text-xs text-orange-500">(Preview)</span>}
                                                            </span>
                                                            {isDisabled && !isLoadingStatus && <span className="text-xs text-muted-foreground">(LLM Key Missing)</span>}
                                                        </div>
                                                        {!isDisabled && (
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
                    {/* Agent B LLM Selector */}
                    <div className="space-y-2"> {/* Consistent spacing */}
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
                                                        <div className="flex flex-col items-start mr-2 overflow-hidden">
                                                            <span className="truncate font-medium" title={llm.name}>
                                                                {llm.name}
                                                                {llm.status === 'preview' && <span className="ml-1 text-xs text-orange-500">(Preview)</span>}
                                                            </span>
                                                            {isDisabled && !isLoadingStatus && <span className="text-xs text-muted-foreground">(LLM Key Missing)</span>}
                                                        </div>
                                                        {!isDisabled && (
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

                {/* --- TTS Configuration Section --- */}
                <hr className="my-6" />
                <div className="space-y-4">
                     {/* Global TTS Toggle */}
                     <div className="flex items-center space-x-2">
                        <Checkbox id="tts-enabled-checkbox" checked={ttsEnabled} onCheckedChange={handleTtsToggle} disabled={!user} />
                        <Label htmlFor="tts-enabled-checkbox" className="text-base font-medium">Enable Text-to-Speech (TTS)</Label>
                    </div>
                    {/* Conditional rendering for TTS settings */}
                    {ttsEnabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            {/* Agent A TTS Settings */}
                            <div className="space-y-3 p-4 border rounded-md bg-background/50">
                                 <h3 className="font-semibold text-center mb-3">Agent A TTS Voice</h3>
                                {/* TTS Provider Selection - Now only shows OpenAI */}
                                <div className="space-y-2"> {/* Consistent spacing */}
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

                                {/* Voice Selection */}
                                {agentATTSSettings.provider && (
                                    <div className="space-y-2"> {/* Consistent spacing */}
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
                                <div className="space-y-2"> {/* Consistent spacing */}
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

                                {/* Voice Selection */}
                                 {agentBTTSSettings.provider && (
                                     <div className="space-y-2"> {/* Consistent spacing */}
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
                {/* Start Conversation Button */}
                <Button onClick={handleStartClick} disabled={isStartDisabled} className="w-full max-w-xs">
                    {isLoading ? 'Starting...' : 'Start Conversation'}
                </Button>
                {/* Prompt to sign in if user is not authenticated */}
                {!user && !authLoading && (
                    <p className="text-center text-sm text-destructive mt-4">Please sign in to start a conversation.</p>
                )}
            </CardFooter>
        </Card>
    );
}
