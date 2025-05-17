// src/components/session/SessionSetupForm.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
    // TTSModelDetail, // Removed unused import
    getTTSProviderInfoById
} from '@/lib/tts_models';
import { AlertTriangle, Info } from "lucide-react";

// --- Define TTS Types ---
type TTSProviderOptionId = TTSProviderInfo['id'] | 'none';

interface AgentTTSSettings {
    provider: TTSProviderOptionId;
    voice: string | null;
    selectedTtsModelId?: string;
}

// --- SessionConfig Interface ---
interface SessionConfig {
    agentA_llm: string;
    agentB_llm: string;
    ttsEnabled: boolean;
    agentA_tts: AgentTTSSettings;
    agentB_tts: AgentTTSSettings;
}

interface SessionSetupFormProps {
    onStartSession: (config: SessionConfig) => void;
    isLoading: boolean;
}

const groupedLLMOptions = groupLLMsByProvider();
const ALL_REQUIRED_KEY_IDS = ['openai', 'google_ai', 'anthropic', 'xai', 'together_ai', 'googleCloudApiKey'];

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

const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 3,
    });
};

function SessionSetupForm({ onStartSession, isLoading }: SessionSetupFormProps) {
    const { user, loading: authLoading } = useAuth();
    const [agentA_llm, setAgentA_llm] = useState<string>('');
    const [agentB_llm, setAgentB_llm] = useState<string>('');
    const [savedKeyStatus, setSavedKeyStatus] = useState<Record<string, boolean>>({});
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);
    const [statusError, setStatusError] = useState<string | null>(null);
    const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);

    const openAIProviderInfo = getTTSProviderInfoById('openai');
    const googleCloudProviderInfo = getTTSProviderInfoById('google-cloud');

    const getDefaultOpenAITTSModel = () => openAIProviderInfo?.models[0];
    const getDefaultOpenAIVoices = () => openAIProviderInfo?.availableVoices || [];
    const getDefaultOpenAIDefaultVoiceId = () => getDefaultOpenAIVoices()[0]?.id ?? null;

    const [agentATTSSettings, setAgentATTSSettings] = useState<AgentTTSSettings>({
        provider: 'openai',
        voice: getDefaultOpenAIDefaultVoiceId(),
        selectedTtsModelId: getDefaultOpenAITTSModel()?.id,
    });
    const [agentBTTSSettings, setAgentBTTSSettings] = useState<AgentTTSSettings>({
        provider: 'openai',
        voice: getDefaultOpenAIDefaultVoiceId(),
        selectedTtsModelId: getDefaultOpenAITTSModel()?.id,
    });

    const [currentVoicesA, setCurrentVoicesA] = useState<TTSVoice[]>(getDefaultOpenAIVoices());
    const [currentVoicesB, setCurrentVoicesB] = useState<TTSVoice[]>(getDefaultOpenAIVoices());

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

    const updateTTSConfigForProvider = useCallback((
        agentSettingsSetter: React.Dispatch<React.SetStateAction<AgentTTSSettings>>,
        voicesListSetter: React.Dispatch<React.SetStateAction<TTSVoice[]>>,
        providerId: TTSProviderOptionId
    ) => {
        if (providerId === 'none') {
            agentSettingsSetter(prev => ({ ...prev, provider: 'none', voice: null, selectedTtsModelId: undefined }));
            voicesListSetter([]);
        } else if (providerId === 'openai' && openAIProviderInfo) {
            const defaultModel = openAIProviderInfo.models[0];
            const voices = openAIProviderInfo.availableVoices;
            agentSettingsSetter(prev => ({
                ...prev,
                provider: 'openai',
                selectedTtsModelId: defaultModel?.id,
                voice: voices[0]?.id ?? null,
            }));
            voicesListSetter(voices);
        } else if (providerId === 'google-cloud' && googleCloudProviderInfo) {
            const defaultConceptualModel = googleCloudProviderInfo.models[0];
            let voices: TTSVoice[] = [];
            if (defaultConceptualModel?.voiceFilterCriteria && googleCloudProviderInfo.availableVoices) {
                voices = googleCloudProviderInfo.availableVoices.filter(defaultConceptualModel.voiceFilterCriteria);
            }
            agentSettingsSetter(prev => ({
                ...prev,
                provider: 'google-cloud',
                selectedTtsModelId: defaultConceptualModel?.id,
                voice: voices[0]?.id ?? null,
            }));
            voicesListSetter(voices);
        }
    }, [openAIProviderInfo, googleCloudProviderInfo]);

    useEffect(() => {
        // This effect runs when the provider for Agent A changes.
        // It updates the TTS model and voice list for Agent A based on the new provider.
        updateTTSConfigForProvider(setAgentATTSSettings, setCurrentVoicesA, agentATTSSettings.provider);
    }, [agentATTSSettings.provider, updateTTSConfigForProvider]); // ESLint warning was about missing agentATTSSettings. Added it to satisfy, but primary trigger is provider.

    useEffect(() => {
        // This effect runs when the provider for Agent B changes.
        // It updates the TTS model and voice list for Agent B based on the new provider.
        updateTTSConfigForProvider(setAgentBTTSSettings, setCurrentVoicesB, agentBTTSSettings.provider);
    }, [agentBTTSSettings.provider, updateTTSConfigForProvider]); // ESLint warning was about missing agentBTTSSettings. Added it.

    const updateVoicesForGoogleModel = useCallback((
        agentSettingsSetter: React.Dispatch<React.SetStateAction<AgentTTSSettings>>,
        voicesListSetter: React.Dispatch<React.SetStateAction<TTSVoice[]>>,
        settings: AgentTTSSettings // current settings for the agent
    ) => {
        if (settings.provider === 'google-cloud' && settings.selectedTtsModelId && googleCloudProviderInfo) {
            const conceptualModel = googleCloudProviderInfo.models.find(m => m.id === settings.selectedTtsModelId);
            let voices: TTSVoice[] = [];
            if (conceptualModel?.voiceFilterCriteria && googleCloudProviderInfo.availableVoices) {
                voices = googleCloudProviderInfo.availableVoices.filter(conceptualModel.voiceFilterCriteria);
            }
            voicesListSetter(voices);
            const currentVoiceIsValid = voices.some(v => v.id === settings.voice);
            if (!currentVoiceIsValid) {
                agentSettingsSetter(prev => ({ ...prev, voice: voices[0]?.id ?? null }));
            }
        }
    }, [googleCloudProviderInfo]);

    useEffect(() => {
        // This effect updates the voice list for Agent A when the selected Google conceptual model changes.
        if (agentATTSSettings.provider === 'google-cloud') {
            updateVoicesForGoogleModel(setAgentATTSSettings, setCurrentVoicesA, agentATTSSettings);
        }
    }, [agentATTSSettings.provider, agentATTSSettings.selectedTtsModelId, updateVoicesForGoogleModel, agentATTSSettings]);

    useEffect(() => {
        // This effect updates the voice list for Agent B when the selected Google conceptual model changes.
        if (agentBTTSSettings.provider === 'google-cloud') {
            updateVoicesForGoogleModel(setAgentBTTSSettings, setCurrentVoicesB, agentBTTSSettings);
        }
    }, [agentBTTSSettings.provider, agentBTTSSettings.selectedTtsModelId, updateVoicesForGoogleModel, agentBTTSSettings]);

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
            const validateAgentTTS = (settings: AgentTTSSettings, agentName: string): boolean => {
                if (settings.provider !== 'none' && !settings.voice) {
                    alert(`Please select a voice for ${agentName}'s TTS provider or disable TTS.`);
                    return false;
                }
                if (settings.provider !== 'none' && !settings.selectedTtsModelId) {
                     alert(`Please select a TTS model for ${agentName} or disable TTS.`);
                     return false;
                }
                return true;
            };

            if (!validateAgentTTS(agentATTSSettings, 'Agent A')) return;
            if (!validateAgentTTS(agentBTTSSettings, 'Agent B')) return;
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

    const handleTTSProviderChange = (agent: 'A' | 'B', newProviderId: TTSProviderOptionId) => {
        const setter = agent === 'A' ? setAgentATTSSettings : setAgentBTTSSettings;
        // Reset related fields when provider changes.
        // The useEffect for provider change will then set defaults for the new provider.
        setter(prev => ({
            ...prev,
            provider: newProviderId,
            selectedTtsModelId: undefined,
            voice: null,
        }));
    };

    const handleTTSModelChange = (agent: 'A' | 'B', ttsModelId: string) => {
        const setter = agent === 'A' ? setAgentATTSSettings : setAgentBTTSSettings;
        // Reset voice when model changes.
        // The useEffect for selectedTtsModelId (for Google) or provider (for OpenAI) will set default voice.
        setter(prev => ({
            ...prev,
            selectedTtsModelId: ttsModelId,
            voice: null,
        }));
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
        if (providerId === 'openai') {
            return isLoadingStatus || !savedKeyStatus['openai'];
        }
        return false;
    };

    const isStartDisabled = isLoading || isLoadingStatus || !agentA_llm || !agentB_llm || !user;

    const renderTTSConfigForAgent = (
        agentIdentifier: 'A' | 'B',
        currentAgentTTSSettings: AgentTTSSettings,
        currentAgentVoices: TTSVoice[]
    ) => {
        const agentIdentifierLowerCase = agentIdentifier.toLowerCase();
        const selectedProviderInfo = getTTSProviderInfoById(currentAgentTTSSettings.provider as TTSProviderInfo['id']);

        return (
            <div className="space-y-3 p-4 border rounded-md bg-background/50">
                <h3 className="font-semibold text-center mb-3">Agent {agentIdentifier} TTS</h3>
                <div className="space-y-2">
                    <Label htmlFor={`agent-${agentIdentifierLowerCase}-tts-provider`}>Provider</Label>
                    <Select
                        value={currentAgentTTSSettings.provider}
                        onValueChange={(value: TTSProviderOptionId) => handleTTSProviderChange(agentIdentifier, value)}
                        disabled={!user || isLoadingStatus}
                    >
                        <SelectTrigger id={`agent-${agentIdentifierLowerCase}-tts-provider`} className="w-full">
                            <SelectValue placeholder="Select TTS Provider" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
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

                {selectedProviderInfo && currentAgentTTSSettings.provider !== 'none' && (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor={`agent-${agentIdentifierLowerCase}-tts-model`}>
                                {selectedProviderInfo.name} Model
                            </Label>
                            <Select
                                value={currentAgentTTSSettings.selectedTtsModelId || ''}
                                onValueChange={(value: string) => handleTTSModelChange(agentIdentifier, value)}
                                disabled={!user || selectedProviderInfo.models.length === 0}
                            >
                                <SelectTrigger id={`agent-${agentIdentifierLowerCase}-tts-model`} className="w-full">
                                    <SelectValue placeholder={`Select ${selectedProviderInfo.name} Model`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedProviderInfo.models.map(m => (
                                        <SelectItem key={m.id} value={m.id}>{m.name} ({m.pricingText})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`agent-${agentIdentifierLowerCase}-voice`}>Voice</Label>
                            <Select
                                value={currentAgentTTSSettings.voice || ''}
                                onValueChange={(value) => handleExternalVoiceChange(agentIdentifier, value)}
                                disabled={!user || currentAgentVoices.length === 0 || !currentAgentTTSSettings.selectedTtsModelId}
                            >
                                <SelectTrigger id={`agent-${agentIdentifierLowerCase}-voice`} className="w-full">
                                    <SelectValue placeholder="Select Voice" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                    {currentAgentVoices.map(v => (
                                        <SelectItem key={v.id} value={v.id}>
                                            {v.name} {v.gender ? `(${v.gender.charAt(0)})` : ''}
                                            {v.status === 'Preview' ? <span className="text-xs text-orange-500 ml-1">(Preview)</span> : ''}
                                            {v.notes ? <span className="text-xs text-muted-foreground ml-1">({v.notes})</span> : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                )}
            </div>
        );
    };

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
                    {/* LLM Selection Section */}
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
                        {/* Explanation Notes */}
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

                    {/* TTS Configuration Section */}
                    <hr className="my-6" />
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="tts-enabled-checkbox" checked={ttsEnabled} onCheckedChange={handleTtsToggle} disabled={!user} />
                            <Label htmlFor="tts-enabled-checkbox" className="text-base font-medium">Enable Text-to-Speech (TTS)</Label>
                        </div>
                        {ttsEnabled && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                {renderTTSConfigForAgent('A', agentATTSSettings, currentVoicesA)}
                                {renderTTSConfigForAgent('B', agentBTTSSettings, currentVoicesB)}
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
