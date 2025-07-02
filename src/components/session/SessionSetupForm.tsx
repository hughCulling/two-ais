// src/components/session/SessionSetupForm.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { db } from '@/lib/firebase/clientApp';
import { AVAILABLE_LLMS, LLMInfo, groupLLMsByProvider, getLLMInfoById, groupModelsByCategory } from '@/lib/models';
import {
    AVAILABLE_TTS_PROVIDERS,
    TTSProviderInfo,
    TTSVoice,
    getTTSProviderInfoById
} from '@/lib/tts_models';
import { isLanguageSupported } from '@/lib/model-language-support';
import { isTTSModelLanguageSupported } from '@/lib/tts_models';
import { AlertTriangle, Info, Check, X, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Define TTS Types ---
type TTSProviderOptionId = TTSProviderInfo['id'] | 'none';

interface AgentTTSSettings {
    provider: TTSProviderOptionId;
    voice: string | null;
    selectedTtsModelId?: string;
    ttsApiModelId?: string;
}

// --- SessionConfig Interface ---
interface SessionConfig {
    agentA_llm: string;
    agentB_llm: string;
    ttsEnabled: boolean;
    agentA_tts: AgentTTSSettings;
    agentB_tts: AgentTTSSettings;
    language?: string;
}

interface SessionSetupFormProps {
    onStartSession: (config: SessionConfig) => void;
    isLoading: boolean;
}

const groupedLLMOptions = groupLLMsByProvider();
const ALL_REQUIRED_KEY_IDS = ['openai', 'google_ai', 'anthropic', 'xai', 'together_ai', 'googleCloudApiKey', 'elevenlabs', 'gemini_api_key'];

const ANY_OPENAI_REQUIRES_ORG_VERIFICATION = AVAILABLE_LLMS.some(
    llm => llm.provider === 'OpenAI' && llm.requiresOrgVerification
);
const ANY_MODEL_USES_REASONING = AVAILABLE_LLMS.some(
    llm => llm.usesReasoningTokens
);

const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 3,
    });
};

// --- Custom LLM Selector Dropdown ---
interface LLMSelectorProps {
    value: string;
    onChange: (id: string) => void;
    disabled?: boolean;
    label: string;
    placeholder?: string;
}

const LLMSelector: React.FC<LLMSelectorProps> = ({ value, onChange, disabled, label, placeholder }) => {
    const { language } = useLanguage();
    const [open, setOpen] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const groupedLLMs = groupLLMsByProvider();
    const t = { nativeName: language.nativeName };

    // Find selected LLM info
    const selectedLLM = value ? getLLMInfoById(value) : undefined;
    const selectedProviderName = selectedLLM?.provider;

    // Handle outside click to close
    useEffect(() => {
        if (!open) return;
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
                setSelectedProvider(null);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    // Keyboard navigation: ESC closes
    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
                setSelectedProvider(null);
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open]);

    // Group models by category for a provider
    const getModelsByCategory = (provider: string) => {
        const models = groupedLLMs[provider] || [];
        // Use the same grouping as landing page
        // Use groupModelsByCategory from main page
        // We'll import it at the top
        // @ts-ignore
        const { orderedCategories, byCategory } = groupModelsByCategory(models, language.code);
        return { orderedCategories, byCategory };
    };

    return (
        <div className="w-full" ref={dropdownRef}>
            <label className="block mb-1 font-medium text-sm">{label}</label>
            <button
                type="button"
                className={cn(
                    "w-full flex items-center justify-between border rounded-md px-3 py-2 bg-background text-sm shadow-xs transition-colors",
                    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent',
                    open && 'ring-2 ring-primary'
                )}
                onClick={() => !disabled && setOpen((v) => !v)}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className="truncate">
                    {selectedLLM ? `${selectedLLM.name} (${selectedLLM.provider})` : (placeholder || 'Select LLM')}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 opacity-60" />
            </button>
            {open && (
                <div className="absolute z-50 mt-2 w-full max-w-md bg-popover border rounded-md shadow-lg overflow-auto max-h-96 animate-in fade-in-0" role="listbox">
                    {!selectedProvider ? (
                        // Provider selection view
                        <div>
                            <div className="p-2 border-b font-semibold text-base">Select Provider</div>
                            <ul>
                                {Object.keys(groupedLLMs).map((provider) => (
                                    <li key={provider}>
                                        <button
                                            className="w-full text-left px-4 py-3 hover:bg-accent focus:bg-accent transition-colors flex items-center justify-between"
                                            onClick={() => setSelectedProvider(provider)}
                                            tabIndex={0}
                                        >
                                            <span className="font-medium">{provider}</span>
                                            <ChevronRight className="h-4 w-4 opacity-60" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        // Category/model selection view
                        <div>
                            <div className="flex items-center border-b p-2">
                                <button
                                    className="mr-2 p-1 rounded hover:bg-accent"
                                    onClick={() => setSelectedProvider(null)}
                                    aria-label="Back to providers"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <span className="font-semibold text-base">{selectedProvider}</span>
                            </div>
                            <div className="overflow-y-auto max-h-80">
                                {(() => {
                                    const { orderedCategories, byCategory } = getModelsByCategory(selectedProvider);
                                    return orderedCategories.map((cat: string) => (
                                        <div key={cat} className="pt-2 pb-1 px-4">
                                            <div className="text-xs font-semibold text-muted-foreground mb-1">{cat}</div>
                                            <ul>
                                                {byCategory[cat].map((llm: LLMInfo) => {
                                                    const supportsLanguage = isLanguageSupported(llm.provider, language.code, llm.id);
                                                    return (
                                                        <li key={llm.id}>
                                                            <button
                                                                className={cn(
                                                                    "w-full text-left px-2 py-2 rounded flex items-center justify-between",
                                                                    llm.id === value ? 'bg-primary/10 font-bold' : 'hover:bg-accent',
                                                                    !supportsLanguage && 'opacity-50 cursor-not-allowed'
                                                                )}
                                                                onClick={() => supportsLanguage && onChange(llm.id)}
                                                                disabled={!supportsLanguage}
                                                                tabIndex={0}
                                                            >
                                                                <span className="flex-shrink-0 flex items-center min-w-0">
                                                                    <span className="truncate font-medium" style={{ maxWidth: '16rem' }}>{llm.name}</span>
                                                                    {llm.status === 'preview' && <span className="ml-1 text-xs text-orange-500">(Preview)</span>}
                                                                    {llm.status === 'beta' && <span className="ml-1 text-xs text-blue-500">(Beta)</span>}
                                                                </span>
                                                                <span className="flex items-center space-x-2 min-w-0 max-w-[14rem]">
                                                                    {llm.pricing.note ? (
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <span className="text-xs text-muted-foreground truncate max-w-[10rem] block" title={llm.pricing.note}>
                                                                                    ({llm.pricing.note})
                                                                                </span>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="top">
                                                                                <span className="text-xs">{llm.pricing.note}</span>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    ) : (
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <span className="text-xs text-muted-foreground truncate max-w-[10rem] block" title={`$${formatPrice(llm.pricing.input)} / $${formatPrice(llm.pricing.output)} per 1M`}>
                                                                                    ${formatPrice(llm.pricing.input)} / ${formatPrice(llm.pricing.output)} per 1M
                                                                                </span>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="top">
                                                                                <span className="text-xs">${formatPrice(llm.pricing.input)} / ${formatPrice(llm.pricing.output)} per 1M</span>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    )}
                                                                    {isLanguageSupported(llm.provider, language.code, llm.id) ? (
                                                                        <Check className="h-3 w-3 text-green-600" />
                                                                    ) : (
                                                                        <X className="h-3 w-3 text-red-600" />
                                                                    )}
                                                                </span>
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

function SessionSetupForm({ onStartSession, isLoading }: SessionSetupFormProps) {
    const { user, loading: authLoading } = useAuth();
    const { language } = useLanguage();
    const [agentA_llm, setAgentA_llm] = useState<string>('');
    const [agentB_llm, setAgentB_llm] = useState<string>('');
    const [savedKeyStatus, setSavedKeyStatus] = useState<Record<string, boolean>>({});
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);
    const [statusError, setStatusError] = useState<string | null>(null);
    const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);

    const openAIProviderInfo = getTTSProviderInfoById('openai');
    const googleCloudProviderInfo = getTTSProviderInfoById('google-cloud');
    const elevenLabsProviderInfo = getTTSProviderInfoById('elevenlabs');

    const getDefaultOpenAITTSModel = () => openAIProviderInfo?.models[0];
    const getDefaultOpenAIVoices = () => openAIProviderInfo?.availableVoices || [];
    const getDefaultOpenAIDefaultVoiceId = () => getDefaultOpenAIVoices()[0]?.id ?? null;

    const [agentATTSSettings, setAgentATTSSettings] = useState<AgentTTSSettings>({
        provider: 'openai',
        voice: getDefaultOpenAIDefaultVoiceId(),
        selectedTtsModelId: getDefaultOpenAITTSModel()?.id,
        ttsApiModelId: getDefaultOpenAITTSModel()?.apiModelId,
    });
    const [agentBTTSSettings, setAgentBTTSSettings] = useState<AgentTTSSettings>({
        provider: 'openai',
        voice: getDefaultOpenAIDefaultVoiceId(),
        selectedTtsModelId: getDefaultOpenAITTSModel()?.id,
        ttsApiModelId: getDefaultOpenAITTSModel()?.apiModelId,
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
        const simpleUserLangCode = language.code.split('-')[0];
        let voices: TTSVoice[] = [];

        if (providerId === 'none') {
            agentSettingsSetter(prev => ({ ...prev, provider: 'none', voice: null, selectedTtsModelId: undefined, ttsApiModelId: undefined }));
            voicesListSetter([]);
            return;
        }

        const providerInfo = getTTSProviderInfoById(providerId);
        if (!providerInfo) {
            agentSettingsSetter(prev => ({ ...prev, provider: providerId, voice: null, selectedTtsModelId: undefined, ttsApiModelId: undefined }));
            voicesListSetter([]);
            return;
        }

        const defaultModel = providerInfo.models[0];

        if (providerId === 'google-cloud' && googleCloudProviderInfo) {
            if (defaultModel?.voiceFilterCriteria && googleCloudProviderInfo.availableVoices) {
                const modelTypeVoices = googleCloudProviderInfo.availableVoices.filter(defaultModel.voiceFilterCriteria);
                voices = modelTypeVoices.filter(voice => 
                    voice.languageCodes?.some(code => code.split('-')[0] === simpleUserLangCode)
                );
            } else {
                voices = googleCloudProviderInfo.availableVoices.filter(voice => 
                    voice.languageCodes?.some(code => code.split('-')[0] === simpleUserLangCode)
                );
            }
        } else {
            voices = providerInfo.availableVoices || [];
        }
        
        agentSettingsSetter(prev => ({
            ...prev,
            provider: providerId,
            selectedTtsModelId: defaultModel?.id,
            ttsApiModelId: defaultModel?.apiModelId,
            voice: voices[0]?.id ?? null,
        }));
        voicesListSetter(voices);
    }, [googleCloudProviderInfo, language.code]);

    useEffect(() => {
        updateTTSConfigForProvider(setAgentATTSSettings, setCurrentVoicesA, agentATTSSettings.provider);
    }, [agentATTSSettings.provider, updateTTSConfigForProvider]);

    useEffect(() => {
        updateTTSConfigForProvider(setAgentBTTSSettings, setCurrentVoicesB, agentBTTSSettings.provider);
    }, [agentBTTSSettings.provider, updateTTSConfigForProvider]);

    const updateVoicesForGoogleModel = useCallback((
        agentSettingsSetter: React.Dispatch<React.SetStateAction<AgentTTSSettings>>,
        voicesListSetter: React.Dispatch<React.SetStateAction<TTSVoice[]>>,
        settings: AgentTTSSettings
    ) => {
        if (settings.provider === 'google-cloud' && settings.selectedTtsModelId && googleCloudProviderInfo) {
            const conceptualModel = googleCloudProviderInfo.models.find(m => m.id === settings.selectedTtsModelId);
            let voices: TTSVoice[] = [];
            if (conceptualModel?.voiceFilterCriteria && googleCloudProviderInfo.availableVoices) {
                const modelTypeVoices = googleCloudProviderInfo.availableVoices.filter(conceptualModel.voiceFilterCriteria);
                const simpleUserLangCode = language.code.split('-')[0];
                voices = modelTypeVoices.filter(voice => 
                    voice.languageCodes?.some(code => code.split('-')[0] === simpleUserLangCode)
                );
            }
            voicesListSetter(voices);
            const currentVoiceIsValid = voices.some(v => v.id === settings.voice);
            if (!currentVoiceIsValid) {
                agentSettingsSetter(prev => ({ ...prev, voice: voices[0]?.id ?? null }));
            }
        }
    }, [googleCloudProviderInfo, language.code]);

    const updateVoicesForElevenLabsModel = useCallback((
        agentSettingsSetter: React.Dispatch<React.SetStateAction<AgentTTSSettings>>,
        voicesListSetter: React.Dispatch<React.SetStateAction<TTSVoice[]>>,
        settings: AgentTTSSettings
    ) => {
        if (settings.provider === 'elevenlabs' && settings.selectedTtsModelId && elevenLabsProviderInfo) {
            const conceptualModel = elevenLabsProviderInfo.models.find(m => m.id === settings.selectedTtsModelId);
            let voices: TTSVoice[] = [];
            if (conceptualModel?.voiceFilterCriteria && elevenLabsProviderInfo.availableVoices) {
                voices = elevenLabsProviderInfo.availableVoices.filter(conceptualModel.voiceFilterCriteria);
            } else {
                voices = elevenLabsProviderInfo.availableVoices;
            }
            voicesListSetter(voices);
            const currentVoiceIsValid = voices.some(v => v.id === settings.voice);
            if (!currentVoiceIsValid) {
                agentSettingsSetter(prev => ({ ...prev, voice: voices[0]?.id ?? null }));
            }
        }
    }, [elevenLabsProviderInfo]);

    useEffect(() => {
        if (agentATTSSettings.provider === 'google-cloud') {
            updateVoicesForGoogleModel(setAgentATTSSettings, setCurrentVoicesA, agentATTSSettings);
        }
    }, [agentATTSSettings, updateVoicesForGoogleModel]);

    useEffect(() => {
        if (agentBTTSSettings.provider === 'google-cloud') {
            updateVoicesForGoogleModel(setAgentBTTSSettings, setCurrentVoicesB, agentBTTSSettings);
        }
    }, [agentBTTSSettings, updateVoicesForGoogleModel]);

    useEffect(() => {
        if (agentATTSSettings.provider === 'elevenlabs') {
            updateVoicesForElevenLabsModel(setAgentATTSSettings, setCurrentVoicesA, agentATTSSettings);
        }
    }, [agentATTSSettings, updateVoicesForElevenLabsModel]);

    useEffect(() => {
        if (agentBTTSSettings.provider === 'elevenlabs') {
            updateVoicesForElevenLabsModel(setAgentBTTSSettings, setCurrentVoicesB, agentBTTSSettings);
        }
    }, [agentBTTSSettings, updateVoicesForElevenLabsModel]);

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

        // ***FIX: Define a type-safe constant for the disabled state***
        const disabledTtsSettings: AgentTTSSettings = { provider: 'none', voice: null, selectedTtsModelId: undefined, ttsApiModelId: undefined };

        const sessionAgentATTSSettings = ttsEnabled ? agentATTSSettings : disabledTtsSettings;
        const sessionAgentBTTSSettings = ttsEnabled ? agentBTTSSettings : disabledTtsSettings;

        if (ttsEnabled) {
             if (sessionAgentATTSSettings.provider !== 'none' && !sessionAgentATTSSettings.voice) {
                alert(`Please select a TTS voice for Agent A or disable TTS.`);
                return;
             }
             if (sessionAgentBTTSSettings.provider !== 'none' && !sessionAgentBTTSSettings.voice) {
                alert(`Please select a TTS voice for Agent B or disable TTS.`);
                return;
             }
        }
        
        onStartSession({
            agentA_llm,
            agentB_llm,
            ttsEnabled,
            agentA_tts: sessionAgentATTSSettings,
            agentB_tts: sessionAgentBTTSSettings,
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
        const providerInfo = getTTSProviderInfoById(newProviderId as TTSProviderInfo['id']);
        const defaultModelForProvider = providerInfo?.models[0];

        setter(prev => ({
            ...prev,
            provider: newProviderId,
            selectedTtsModelId: defaultModelForProvider?.id,
            ttsApiModelId: defaultModelForProvider?.apiModelId,
            voice: null,
        }));
    };

    const handleTTSModelChange = (agent: 'A' | 'B', appTtsModelId: string) => {
        const setter = agent === 'A' ? setAgentATTSSettings : setAgentBTTSSettings;
        const currentProviderId = agent === 'A' ? agentATTSSettings.provider : agentBTTSSettings.provider;
        const providerInfo = getTTSProviderInfoById(currentProviderId as TTSProviderInfo['id']);
        const selectedModelDetail = providerInfo?.models.find(m => m.id === appTtsModelId);

        setter(prev => ({
            ...prev,
            selectedTtsModelId: appTtsModelId,
            ttsApiModelId: selectedModelDetail?.apiModelId,
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

    let isStartDisabled = isLoading || isLoadingStatus || !agentA_llm || !agentB_llm || !user;

    if (!isStartDisabled && ttsEnabled) {
        const checkAgentTTSValidity = (settings: AgentTTSSettings): boolean => {
            if (settings.provider !== 'none') {
                if (!settings.selectedTtsModelId) return true;
                if (!isTTSModelLanguageSupported(settings.selectedTtsModelId, language.code)) return true;
                if (!settings.voice) return true;
            }
            return false;
        };
        if (checkAgentTTSValidity(agentATTSSettings) || checkAgentTTSValidity(agentBTTSSettings)) {
            isStartDisabled = true;
        }
    }

    const renderTTSConfigForAgent = (
        agentIdentifier: 'A' | 'B',
        currentAgentTTSSettings: AgentTTSSettings,
        currentAgentVoices: TTSVoice[]
    ) => {
        const agentIdentifierLowerCase = agentIdentifier.toLowerCase();
        const selectedProviderInfo = getTTSProviderInfoById(currentAgentTTSSettings.provider as TTSProviderInfo['id']);

        const shouldShowVoiceDropdown = 
            selectedProviderInfo &&
            currentAgentTTSSettings.provider !== 'none' &&
            currentAgentTTSSettings.selectedTtsModelId &&
            isTTSModelLanguageSupported(currentAgentTTSSettings.selectedTtsModelId, language.code);

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
                                    {selectedProviderInfo.models.map(m => {
                                        const supportsLanguage = isTTSModelLanguageSupported(m.id, language.code);
                                        const isDisabled = !supportsLanguage;
                                        return (
                                            <SelectItem 
                                                key={m.id} 
                                                value={m.id} 
                                                disabled={isDisabled}
                                                className="pr-2 py-2"
                                            >
                                                <div className="flex justify-between items-center w-full text-sm">
                                                    <div className="flex items-center space-x-1.5 mr-2 overflow-hidden">
                                                        {supportsLanguage ? (
                                                            <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                                                        ) : (
                                                            <X className="h-3 w-3 text-red-600 flex-shrink-0" />
                                                        )}
                                                        <span className="truncate font-medium" title={m.name}>
                                                            {m.name}
                                                        </span>
                                                        {!supportsLanguage && <span className="text-xs text-muted-foreground">(No {language.nativeName})</span>}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap pl-2 flex-shrink-0" title={m.description}>
                                                        ({m.pricingText})
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        {shouldShowVoiceDropdown && (
                            <div className="space-y-2">
                                <Label htmlFor={`agent-${agentIdentifierLowerCase}-voice`}>Voice</Label>
                                <Select
                                    value={currentAgentTTSSettings.voice || ''}
                                    onValueChange={(value) => handleExternalVoiceChange(agentIdentifier, value)}
                                    disabled={!user || currentAgentVoices.length === 0}
                                >
                                    <SelectTrigger id={`agent-${agentIdentifierLowerCase}-voice`} className="w-full">
                                        <SelectValue placeholder={currentAgentVoices.length > 0 ? "Select Voice" : `No voices for ${language.nativeName}`} />
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
                        )}
                    </>
                )}
            </div>
        );
    };

    return (
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
                            <LLMSelector
                                value={agentA_llm}
                                onChange={setAgentA_llm}
                                disabled={isLoading || isLoadingStatus || !user}
                                label="Agent A Model"
                                placeholder="Select LLM for Agent A"
                            />
                        </div>
                        {/* Agent B LLM Selector */}
                        <div className="space-y-2">
                            <LLMSelector
                                value={agentB_llm}
                                onChange={setAgentB_llm}
                                disabled={isLoading || isLoadingStatus || !user}
                                label="Agent B Model"
                                placeholder="Select LLM for Agent B"
                            />
                        </div>
                    </div>
                    {/* Explanation Notes */}
                    <p className="text-xs text-muted-foreground px-1 pt-1 flex items-center">
                        <Check className="h-3 w-3 text-green-600 mr-1 flex-shrink-0"/>
                        <X className="h-3 w-3 text-red-600 mr-1 flex-shrink-0"/>
                        Language support indicators show model compatibility with {language.nativeName}. Models without support are disabled.
                    </p>
                    {ANY_MODEL_USES_REASONING && (
                         <p className="text-xs text-muted-foreground px-1 pt-1 flex items-center">
                            <Info className="h-3 w-3 text-blue-500 mr-1 flex-shrink-0"/>
                            Indicates a model uses &apos;thinking&apos; or &apos;reasoning&apos; tokens. This output is billed but is not visible in the chat.
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
                    {/* <p className="text-xs text-muted-foreground px-1 pt-1 flex items-center">
                        <Check className="h-3 w-3 text-green-600 mr-1 flex-shrink-0"/>
                        <X className="h-3 w-3 text-red-600 mr-1 flex-shrink-0"/>
                        Language support indicators show model compatibility with {language.nativeName}. Models without support are disabled.
                    </p> */}
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
    );
};

export default SessionSetupForm;