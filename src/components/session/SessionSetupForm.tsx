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
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/clientApp';
import { AVAILABLE_LLMS, LLMInfo, groupLLMsByProvider, getLLMInfoById } from '@/lib/models';
import {
    AVAILABLE_TTS_PROVIDERS,
    TTSProviderInfo,
    TTSVoice,
    getVoicesForProvider,
    getDefaultVoiceForProvider,
    TTSModelDetail, 
    getTTSProviderInfoById 
} from '@/lib/tts_models';
import { AlertTriangle, Info } from "lucide-react";

// --- Define TTS Types (using imported types) ---
type TTSProviderOptionId = TTSProviderInfo['id'] | 'none'; // Removed 'browser'

// Interface for storing TTS settings for one agent
interface AgentTTSSettings {
    provider: TTSProviderOptionId;
    voice: string | null; 
    ttsApiModelId?: TTSModelDetail['apiModelId']; 
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
    onStartSession: (config: SessionConfig) => void; 
    isLoading: boolean; 
}

// Pre-group LLM options for efficiency
const groupedLLMOptions = groupLLMsByProvider();

// --- Determine all potentially required API key IDs ---
const ALL_REQUIRED_KEY_IDS = ['openai', 'google_ai', 'anthropic', 'xai', 'together_ai']; // Removed 'groq'

// --- Determine if notes for special model characteristics should be shown ---
const ANY_OPENAI_REQUIRES_ORG_VERIFICATION = AVAILABLE_LLMS.some(
    llm => llm.provider === 'OpenAI' && llm.requiresOrgVerification
);
const ANY_OPENAI_USES_REASONING_TOKENS = AVAILABLE_LLMS.some(
    llm => llm.provider === 'OpenAI' && llm.usesReasoningTokens
);
const ANY_GOOGLE_MODEL_USES_THINKING = AVAILABLE_LLMS.some(
    llm => llm.provider === 'Google' && llm.usesReasoningTokens 
);
const ANY_ANTHROPIC_MODEL_USES_THINKING = AVAILABLE_LLMS.some(
    llm => llm.provider === 'Anthropic' && llm.usesReasoningTokens
);
const ANY_XAI_MODEL_USES_THINKING = AVAILABLE_LLMS.some( 
    llm => llm.provider === 'xAI' && llm.usesReasoningTokens
);
const ANY_QWEN_MODEL_USES_THINKING = AVAILABLE_LLMS.some( 
    llm => llm.provider === 'TogetherAI' && llm.category?.includes('Qwen') && llm.usesReasoningTokens
);


// Helper function to format pricing
const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 3,
    });
};

// --- Main Component Definition ---
function SessionSetupForm({ onStartSession, isLoading }: SessionSetupFormProps) {
    const { user, loading: authLoading } = useAuth();

    // --- State Variables ---
    const [agentA_llm, setAgentA_llm] = useState<string>('');
    const [agentB_llm, setAgentB_llm] = useState<string>('');
    const [savedKeyStatus, setSavedKeyStatus] = useState<Record<string, boolean>>({});
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);
    const [statusError, setStatusError] = useState<string | null>(null);
    const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);
    
    const openAIProviderInfo = getTTSProviderInfoById('openai'); // Get OpenAI provider info
    const initialOpenAITTSModelId = openAIProviderInfo?.models[0]?.apiModelId; 

    const [agentATTSSettings, setAgentATTSSettings] = useState<AgentTTSSettings>({
        provider: 'openai', // Default to OpenAI or first available
        voice: getDefaultVoiceForProvider('openai')?.id ?? null,
        ttsApiModelId: initialOpenAITTSModelId,
    });
    const [agentBTTSSettings, setAgentBTTSSettings] = useState<AgentTTSSettings>({
        provider: 'openai', // Default to OpenAI or first available
        voice: getDefaultVoiceForProvider('openai')?.id ?? null,
        ttsApiModelId: initialOpenAITTSModelId,
    });

    const [currentExternalVoicesA, setCurrentExternalVoicesA] = useState<TTSVoice[]>(getVoicesForProvider('openai'));
    const [currentExternalVoicesB, setCurrentExternalVoicesB] = useState<TTSVoice[]>(getVoicesForProvider('openai'));


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
                        ALL_REQUIRED_KEY_IDS.forEach(keyId => {
                            const versionValue = versions[keyId];
                            status[keyId] = !!(versionValue && typeof versionValue === 'string' && versionValue.length > 0);
                        });
                    } else {
                        ALL_REQUIRED_KEY_IDS.forEach(keyId => { status[keyId] = false; });
                    }
                    setSavedKeyStatus(status);
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
    }, [user, authLoading]);

    
    const updateVoicesAndModelForAgent = (agentSetter: React.Dispatch<React.SetStateAction<AgentTTSSettings>>, providerId: TTSProviderOptionId) => {
        if (providerId === 'none') {
            agentSetter(prev => ({ ...prev, provider: providerId, voice: null, ttsApiModelId: undefined }));
            if (agentSetter === setAgentATTSSettings) setCurrentExternalVoicesA([]);
            else setCurrentExternalVoicesB([]);
        } else { // Assumes 'openai' or other future providers from AVAILABLE_TTS_PROVIDERS
            const voices = getVoicesForProvider(providerId as TTSProviderInfo['id']);
            const defaultVoice = voices[0]?.id ?? null;
            const providerInfo = getTTSProviderInfoById(providerId as TTSProviderInfo['id']);
            // Default to the first model of the selected provider
            const defaultApiModelId = providerInfo?.models[0]?.apiModelId;

            agentSetter(prev => ({ 
                ...prev, 
                provider: providerId, 
                voice: defaultVoice,
                ttsApiModelId: defaultApiModelId 
            }));

            if (agentSetter === setAgentATTSSettings) setCurrentExternalVoicesA(voices);
            else setCurrentExternalVoicesB(voices);
        }
    };
    
    useEffect(() => {
        updateVoicesAndModelForAgent(setAgentATTSSettings, agentATTSSettings.provider);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [agentATTSSettings.provider]);
    
    useEffect(() => {
        updateVoicesAndModelForAgent(setAgentBTTSSettings, agentBTTSSettings.provider);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [agentBTTSSettings.provider]);


    // --- Event Handlers ---
    const handleStartClick = () => {
        const agentAOption = getLLMInfoById(agentA_llm);
        const agentBOption = getLLMInfoById(agentB_llm);

        if (!agentAOption || !agentBOption) {
            alert("Please select a model for both Agent A and Agent B.");
            return;
        }

        const agentARequiredLLMKey = agentAOption.apiKeySecretName;
        const agentBRequiredLLMKey = agentBOption.apiKeySecretName;
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

        if (ttsEnabled) {
             if (agentATTSSettings.provider !== 'none' && !agentATTSSettings.voice) {
                 alert(`Please select a voice for Agent A's TTS provider (${agentATTSSettings.provider}) or disable TTS.`);
                 return;
             }
             if (agentATTSSettings.provider === 'openai' && !agentATTSSettings.ttsApiModelId) {
                alert(`Please select a specific TTS model for Agent A (OpenAI TTS).`);
                return;
             }
             if (agentBTTSSettings.provider !== 'none' && !agentBTTSSettings.voice) {
                  alert(`Please select a voice for Agent B's TTS provider (${agentBTTSSettings.provider}) or disable TTS.`);
                  return;
             }
             if (agentBTTSSettings.provider === 'openai' && !agentBTTSSettings.ttsApiModelId) {
                alert(`Please select a specific TTS model for Agent B (OpenAI TTS).`);
                return;
             }
        }

        onStartSession({
            agentA_llm,
            agentB_llm,
            ttsEnabled,
            agentA_tts: agentATTSSettings,
            agentB_tts: agentBTTSSettings,
        });
    };

    const isLLMOptionDisabled = (llm: LLMInfo): boolean => {
        const requiredKey = llm.apiKeySecretName;
        if (!requiredKey) return true;
        return isLoadingStatus || !savedKeyStatus[requiredKey];
    };

    const handleTtsToggle = (checked: boolean | 'indeterminate') => {
         setTtsEnabled(Boolean(checked));
    };

    const handleTTSProviderChange = (agent: 'A' | 'B', providerId: TTSProviderOptionId) => {
        const setter = agent === 'A' ? setAgentATTSSettings : setAgentBTTSSettings;
        updateVoicesAndModelForAgent(setter, providerId);
    };
    
    const handleOpenAITTSModelChange = (agent: 'A' | 'B', apiModelId: TTSModelDetail['apiModelId']) => {
        const setter = agent === 'A' ? setAgentATTSSettings : setAgentBTTSSettings;
        setter(prev => ({ ...prev, ttsApiModelId: apiModelId }));
    };

    const handleExternalVoiceChange = (agent: 'A' | 'B', voiceId: string) => {
         const setter = agent === 'A' ? setAgentATTSSettings : setAgentBTTSSettings;
        setter(prev => ({ ...prev, voice: voiceId }));
    };

    const isTTSProviderDisabled = (providerId: TTSProviderInfo['id']): boolean => {
        const providerInfo = getTTSProviderInfoById(providerId);
        if (providerInfo?.requiresOwnKey && providerInfo.apiKeyId) {
            return isLoadingStatus || !savedKeyStatus[providerInfo.apiKeyId];
        }
        if (providerId === 'openai') { // OpenAI TTS uses the main OpenAI LLM key
            return isLoadingStatus || !savedKeyStatus['openai'];
        }
        return false;
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
                                                                    {llm.usesReasoningTokens && !isDisabled && (
                                                                        <Info className="h-4 w-4 text-blue-500 flex-shrink-0"/>
                                                                    )}
                                                                    {llm.requiresOrgVerification && llm.provider === 'OpenAI' && !isDisabled && (
                                                                        <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0"/>
                                                                    )}
                                                                    <span className="truncate font-medium" title={llm.name}>
                                                                        {llm.name}
                                                                        {llm.status === 'preview' && <span className="ml-1 text-xs text-orange-500">(Preview)</span>}
                                                                        {llm.status === 'beta' && <span className="ml-1 text-xs text-blue-500">(Beta)</span>}
                                                                    </span>
                                                                    {isDisabled && !isLoadingStatus && <span className="text-xs text-muted-foreground">(Key Missing)</span>}
                                                                </div>
                                                                {!isDisabled && llm.pricing.note ? (
                                                                    <span className="text-xs text-muted-foreground whitespace-nowrap pl-2 flex-shrink-0" title={llm.pricing.note}>
                                                                        ({llm.pricing.note}) 
                                                                    </span>
                                                                ) : (
                                                                    !isDisabled && (
                                                                        <span className="text-xs text-muted-foreground whitespace-nowrap pl-2 flex-shrink-0">
                                                                            ${formatPrice(llm.pricing.input)} / ${formatPrice(llm.pricing.output)} MTok
                                                                        </span>
                                                                    )
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
                                                                    {llm.usesReasoningTokens && !isDisabled && (
                                                                        <Info className="h-4 w-4 text-blue-500 flex-shrink-0"/>
                                                                    )}
                                                                    {llm.requiresOrgVerification && llm.provider === 'OpenAI' && !isDisabled && (
                                                                        <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0"/>
                                                                    )}
                                                                    <span className="truncate font-medium" title={llm.name}>
                                                                        {llm.name}
                                                                        {llm.status === 'preview' && <span className="ml-1 text-xs text-orange-500">(Preview)</span>}
                                                                        {llm.status === 'beta' && <span className="ml-1 text-xs text-blue-500">(Beta)</span>}
                                                                    </span>
                                                                    {isDisabled && !isLoadingStatus && <span className="text-xs text-muted-foreground">(Key Missing)</span>}
                                                                </div>
                                                                {!isDisabled && llm.pricing.note ? (
                                                                    <span className="text-xs text-muted-foreground whitespace-nowrap pl-2 flex-shrink-0" title={llm.pricing.note}>
                                                                        ({llm.pricing.note}) 
                                                                    </span>
                                                                ) : (
                                                                    !isDisabled && (
                                                                        <span className="text-xs text-muted-foreground whitespace-nowrap pl-2 flex-shrink-0">
                                                                            ${formatPrice(llm.pricing.input)} / ${formatPrice(llm.pricing.output)} MTok
                                                                        </span>
                                                                    )
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
                        {/* --- Explanation Notes for Icons --- */}
                        {ANY_OPENAI_USES_REASONING_TOKENS && ( 
                             <p className="text-xs text-muted-foreground px-1 pt-1 flex items-center">
                                <Info className="h-3 w-3 text-blue-500 mr-1 flex-shrink-0"/>
                                Indicates an OpenAI model uses reasoning tokens (not visible in chat, billed as output).
                            </p>
                        )}
                        {ANY_GOOGLE_MODEL_USES_THINKING && ( 
                             <p className="text-xs text-muted-foreground px-1 pt-1 flex items-center">
                                <Info className="h-3 w-3 text-blue-500 mr-1 flex-shrink-0"/>
                                Indicates a Google model uses a &apos;thinking budget&apos;. The &apos;thinking&apos; output is billed but is not visible in the chat.
                            </p>
                        )}
                        {ANY_ANTHROPIC_MODEL_USES_THINKING && ( 
                             <p className="text-xs text-muted-foreground px-1 pt-1 flex items-center">
                                <Info className="h-3 w-3 text-blue-500 mr-1 flex-shrink-0"/>
                                Indicates an Anthropic model uses &apos;extended thinking&apos;. The &apos;thinking&apos; output is billed but may not be visible in the chat.
                            </p>
                        )}
                        {ANY_XAI_MODEL_USES_THINKING && ( 
                             <p className="text-xs text-muted-foreground px-1 pt-1 flex items-center">
                                <Info className="h-3 w-3 text-blue-500 mr-1 flex-shrink-0"/>
                                Indicates an xAI model uses &apos;thinking&apos;. Thinking traces may be accessible and output is billed.
                            </p>
                        )}
                         {ANY_QWEN_MODEL_USES_THINKING && ( 
                             <p className="text-xs text-muted-foreground px-1 pt-1 flex items-center">
                                <Info className="h-3 w-3 text-blue-500 mr-1 flex-shrink-0"/>
                                Indicates a Qwen model (via TogetherAI) uses &apos;reasoning/thinking&apos;. Output is billed accordingly.
                            </p>
                        )}
                        {ANY_OPENAI_REQUIRES_ORG_VERIFICATION && ( 
                            <p className="text-xs text-muted-foreground px-1 pt-1 flex items-center">
                                <AlertTriangle className="h-3 w-3 text-yellow-500 mr-1 flex-shrink-0"/>
                                Indicates an OpenAI model requires a verified organization. You can
                                <a
                                    href="https://platform.openai.com/settings/organization/general"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline text-blue-500 hover:text-blue-600 ml-1"
                                >
                                    verify here
                                </a>.
                            </p>
                        )}
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
                                    <h3 className="font-semibold text-center mb-3">Agent A TTS</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="agent-a-tts-provider">Provider</Label>
                                        <Select 
                                            value={agentATTSSettings.provider} 
                                            onValueChange={(value: TTSProviderOptionId) => handleTTSProviderChange('A', value)} 
                                            disabled={!user || isLoadingStatus}
                                        >
                                            <SelectTrigger id="agent-a-tts-provider" className="w-full">
                                                <SelectValue placeholder="Select TTS Provider" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                {/* <SelectItem value="browser">Browser Built-in</SelectItem> Removed */}
                                                {AVAILABLE_TTS_PROVIDERS.map(p => {
                                                    const isDisabled = isTTSProviderDisabled(p.id);
                                                    return (
                                                        <SelectItem key={p.id} value={p.id} disabled={isDisabled}>
                                                            {p.name}
                                                            {isDisabled && ' (Key Missing)'}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {agentATTSSettings.provider === 'openai' && openAIProviderInfo && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="agent-a-openai-tts-model">OpenAI TTS Model</Label>
                                                <Select
                                                    value={agentATTSSettings.ttsApiModelId || ''}
                                                    onValueChange={(value: TTSModelDetail['apiModelId']) => handleOpenAITTSModelChange('A', value)}
                                                    disabled={!user}
                                                >
                                                    <SelectTrigger id="agent-a-openai-tts-model" className="w-full">
                                                        <SelectValue placeholder="Select OpenAI TTS Model" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {openAIProviderInfo.models.map(m => (
                                                            <SelectItem key={m.id} value={m.apiModelId}>{m.name} ({m.pricingText})</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="agent-a-openai-voice">Voice</Label>
                                                <Select
                                                    value={agentATTSSettings.voice || ''}
                                                    onValueChange={(value) => handleExternalVoiceChange('A', value)}
                                                    disabled={!user || currentExternalVoicesA.length === 0}
                                                >
                                                    <SelectTrigger id="agent-a-openai-voice" className="w-full">
                                                        <SelectValue placeholder="Select Voice" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                            {currentExternalVoicesA.map(v => (
                                                                <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </>
                                    )}
                                </div>
                                {/* Agent B TTS Settings (mirrors Agent A) */}
                                <div className="space-y-3 p-4 border rounded-md bg-background/50">
                                    <h3 className="font-semibold text-center mb-3">Agent B TTS</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="agent-b-tts-provider">Provider</Label>
                                        <Select 
                                            value={agentBTTSSettings.provider} 
                                            onValueChange={(value: TTSProviderOptionId) => handleTTSProviderChange('B', value)} 
                                            disabled={!user || isLoadingStatus}
                                        >
                                            <SelectTrigger id="agent-b-tts-provider" className="w-full">
                                                <SelectValue placeholder="Select TTS Provider" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                {/* <SelectItem value="browser">Browser Built-in</SelectItem> Removed */}
                                                {AVAILABLE_TTS_PROVIDERS.map(p => {
                                                    const isDisabled = isTTSProviderDisabled(p.id);
                                                    return (
                                                        <SelectItem key={p.id} value={p.id} disabled={isDisabled}>
                                                            {p.name}
                                                            {isDisabled && ' (Key Missing)'}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {agentBTTSSettings.provider === 'openai' && openAIProviderInfo && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="agent-b-openai-tts-model">OpenAI TTS Model</Label>
                                                <Select
                                                    value={agentBTTSSettings.ttsApiModelId || ''}
                                                    onValueChange={(value: TTSModelDetail['apiModelId']) => handleOpenAITTSModelChange('B', value)}
                                                    disabled={!user}
                                                >
                                                    <SelectTrigger id="agent-b-openai-tts-model" className="w-full">
                                                        <SelectValue placeholder="Select OpenAI TTS Model" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {openAIProviderInfo.models.map(m => (
                                                            <SelectItem key={m.id} value={m.apiModelId}>{m.name} ({m.pricingText})</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="agent-b-openai-voice">Voice</Label>
                                                <Select
                                                    value={agentBTTSSettings.voice || ''}
                                                    onValueChange={(value) => handleExternalVoiceChange('B', value)}
                                                    disabled={!user || currentExternalVoicesB.length === 0}
                                                >
                                                    <SelectTrigger id="agent-b-openai-voice" className="w-full">
                                                        <SelectValue placeholder="Select Voice" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                            {currentExternalVoicesB.map(v => (
                                                                <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </>
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

export default SessionSetupForm;
