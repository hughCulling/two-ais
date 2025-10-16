// src/components/session/SessionSetupForm.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { db } from '@/lib/firebase/clientApp';
import { getLLMInfoById } from '@/lib/models';
import { ModelSelector } from './ModelSelector';
import { FreeTierBadge } from "@/components/ui/free-tier-badge";
import {
    AVAILABLE_TTS_PROVIDERS,
    TTSProviderInfo,
    TTSVoice,
    getTTSProviderInfoById,
    onVoicesLoaded
} from '@/lib/tts_models';
import { isLanguageSupported } from '@/lib/model-language-support';
import { isTTSModelLanguageSupported } from '@/lib/tts_models';
import { AlertTriangle, Check, X, Info, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { AVAILABLE_IMAGE_MODELS, ImageModelQuality, ImageModelSize, ImageAspectRatio } from '@/lib/image_models';

// --- Utility Functions ---
function isSafariBrowser(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }
    const userAgent = navigator.userAgent.toLowerCase();
    // Safari detection: has 'safari' but not 'chrome' or 'chromium'
    return userAgent.includes('safari') && !userAgent.includes('chrome') && !userAgent.includes('chromium');
}

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
    initialSystemPrompt: string;
    // imageGenSettings?: {
    //     enabled: boolean;
    //     provider: string;
    //     model: string;
    //     quality: ImageModelQuality;
    //     size: ImageModelSize | ImageAspectRatio;
    //     promptLlm: string;
    //     promptSystemMessage: string;
    // };
}

interface SessionSetupFormProps {
    onStartSession: (config: SessionConfig) => void;
    isLoading: boolean;
}

const ALL_REQUIRED_KEY_IDS = ['mistral']; // Only need Mistral API key now

// These are no longer needed as we're only using Mistral AI
// const ANY_OPENAI_REQUIRES_ORG_VERIFICATION = false;
// const ANY_MODEL_USES_REASONING = false;

const formatPrice = (price: number): string => {
    return price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 3,
    });
};

function SessionSetupForm({ onStartSession, isLoading }: SessionSetupFormProps) {
    const { user, loading: authLoading } = useAuth();
    const { language } = useLanguage();
    const { t, loading: translationLoading } = useTranslation();
    const [agentA_llm, setAgentA_llm] = useState<string>('');
    const [agentB_llm, setAgentB_llm] = useState<string>('');
    const [savedKeyStatus, setSavedKeyStatus] = useState<Record<string, boolean>>({});
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);
    const [statusError, setStatusError] = useState<string | null>(null);
    const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);
    const [showSafariWarning, setShowSafariWarning] = useState<boolean>(false);
    const [initialSystemPrompt, setInitialSystemPrompt] = useState<string>(() => t?.sessionSetupForm?.startTheConversation || '');

    const openAIProviderInfo = getTTSProviderInfoById('openai');
    const googleCloudProviderInfo = getTTSProviderInfoById('google-cloud');
    const elevenLabsProviderInfo = getTTSProviderInfoById('elevenlabs');

    const [agentATTSSettings, setAgentATTSSettings] = useState<AgentTTSSettings>({
        provider: 'browser',
        voice: 'default',
        selectedTtsModelId: 'browser-default',
        ttsApiModelId: 'browser-default',
    });
    const [agentBTTSSettings, setAgentBTTSSettings] = useState<AgentTTSSettings>({
        provider: 'browser',
        voice: 'default',
        selectedTtsModelId: 'browser-default',
        ttsApiModelId: 'browser-default',
    });

    const [currentVoicesA, setCurrentVoicesA] = useState<TTSVoice[]>([]);
    const [currentVoicesB, setCurrentVoicesB] = useState<TTSVoice[]>([]);

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
        } else if (providerId === 'browser') {
            // For browser TTS, filter voices by the user's selected language
            voices = (providerInfo.availableVoices || []).filter(voice => {
                return voice.languageCodes?.some(code => 
                    code.startsWith(simpleUserLangCode) || 
                    code.split('-')[0] === simpleUserLangCode
                );
            });
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

    // Listen for voice loading events and update TTS config when voices are loaded
    useEffect(() => {
        const handleVoicesLoaded = () => {
            // Update TTS config for both agents if they're using browser TTS
            if (agentATTSSettings.provider === 'browser') {
                updateTTSConfigForProvider(setAgentATTSSettings, setCurrentVoicesA, 'browser');
            }
            if (agentBTTSSettings.provider === 'browser') {
                updateTTSConfigForProvider(setAgentBTTSSettings, setCurrentVoicesB, 'browser');
            }
        };

        onVoicesLoaded(handleVoicesLoaded);
    }, [agentATTSSettings.provider, agentBTTSSettings.provider, updateTTSConfigForProvider]);

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

    // Check if Safari is being used with browser TTS
    useEffect(() => {
        const isBrowserTTSSelected = agentATTSSettings.provider === 'browser' || agentBTTSSettings.provider === 'browser';
        const isSafari = isSafariBrowser();
        setShowSafariWarning(isBrowserTTSSelected && isSafari);
    }, [agentATTSSettings.provider, agentBTTSSettings.provider]);

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

        // Image generation validation
        // let imageGenSettings: SessionConfig['imageGenSettings'] = undefined;
        // if (imageGenEnabled) {
        //     const model = AVAILABLE_IMAGE_MODELS.find(m => m.id === selectedImageModelId);
        //     if (!model) {
        //         alert('Please select an image model.');
        //         return;
        //     }
            
        //     // Check if the model has any quality settings
        //     const hasQualitySettings = model.qualities.some(q => q.quality);
            
        //     // Only require quality if the model has quality settings
        //     if (hasQualitySettings && !selectedImageQuality) {
        //         alert('Please select an image quality.');
        //         return;
        //     }
            
        //     if (!selectedImageSize) {
        //         alert('Please select an image size.');
        //         return;
        //     }
            
        //     if (!selectedPromptLlm) {
        //         alert('Please select a prompt LLM for image generation.');
        //         return;
        //     }
            
        //     if (!imagePromptSystemMessage) {
        //         alert('Please provide a system prompt for the image prompt LLM.');
        //         return;
        //     }
            
        //     // Use 'standard' as default quality if the model doesn't have quality settings
        //     const qualityToUse = hasQualitySettings ? selectedImageQuality : 'standard';
            
        //     imageGenSettings = {
        //         enabled: true,
        //         provider: model.provider,
        //         model: model.id,
        //         quality: qualityToUse as ImageModelQuality, // Safe to cast since we provide a default
        //         size: selectedImageSize,
        //         promptLlm: selectedPromptLlm,
        //         promptSystemMessage: imagePromptSystemMessage,
        //     };
        // }

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
            initialSystemPrompt,
            // imageGenSettings,
        });
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
                    <Label htmlFor={`agent-${agentIdentifierLowerCase}-tts-provider`}>{t?.sessionSetupForm?.provider}</Label>
                    <Select
                        value={currentAgentTTSSettings.provider}
                        onValueChange={(value: TTSProviderOptionId) => handleTTSProviderChange(agentIdentifier, value)}
                        disabled={!user || isLoadingStatus}
                    >
                        <SelectTrigger id={`agent-${agentIdentifierLowerCase}-tts-provider`} className="w-full">
                            <SelectValue placeholder={t?.sessionSetupForm?.selectProvider} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">{t?.ttsNoneOption || 'None'}</SelectItem>
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
                                {t?.sessionSetupForm?.ttsProviderModel?.replace('{providerName}', selectedProviderInfo.name)}
                            </Label>
                            <Select
                                value={currentAgentTTSSettings.selectedTtsModelId || ''}
                                onValueChange={(value: string) => handleTTSModelChange(agentIdentifier, value)}
                                disabled={!user || selectedProviderInfo.models.length === 0}
                            >
                                <SelectTrigger id={`agent-${agentIdentifierLowerCase}-tts-model`} className="w-full">
                                    <SelectValue placeholder={t?.sessionSetupForm?.selectTtsProviderModel?.replace('{providerName}', selectedProviderInfo.name)} />
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
                                                <div className="flex justify-between items-center w-full text-sm min-w-0">
                                                    <div className="flex items-center space-x-1.5 mr-2 min-w-0 flex-1">
                                                        {supportsLanguage ? (
                                                            <Check className="h-3 w-3 text-green-700 dark:text-green-300 flex-shrink-0" />
                                                        ) : (
                                                            <X className="h-3 w-3 text-red-700 dark:text-red-300 flex-shrink-0" />
                                                        )}
                                                        <span className="truncate font-medium" style={{ maxWidth: '16rem' }}>{m.name}</span>
                                                        {!supportsLanguage && <span className="text-xs text-muted-foreground flex-shrink-0">(No {language.nativeName})</span>}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap pl-2 flex-shrink-0 truncate max-w-[8rem]" title={m.description}>
                                                        ({typeof m.pricingText === 'function' ? (t ? m.pricingText(t) : 'Loading...') : m.pricingText})
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
                                <Label htmlFor={`agent-${agentIdentifierLowerCase}-voice`}>{t?.sessionSetupForm?.voice}</Label>
                                <Select
                                    value={currentAgentTTSSettings.voice || ''}
                                    onValueChange={(value) => handleExternalVoiceChange(agentIdentifier, value)}
                                    disabled={!user || currentAgentVoices.length === 0}
                                >
                                    <SelectTrigger id={`agent-${agentIdentifierLowerCase}-voice`} className="w-full">
                                        <SelectValue placeholder={currentAgentVoices.length > 0 ? t?.sessionSetupForm?.selectVoice : t?.sessionSetupForm?.noVoicesFor?.replace('{languageName}', language.nativeName)} />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60">
                                        {currentAgentVoices.map(v => {
                                            // Don't show gender for browser voices (redundant) or Google providers
                                            const providerId = currentAgentTTSSettings.provider;
                                            const showGender = providerId !== 'google-cloud' && providerId !== 'google-gemini' && providerId !== 'browser';
                                            return (
                                                <SelectItem key={v.id} value={v.id}>
                                                    {v.name} {showGender && v.gender ? `(${v.gender.charAt(0)})` : ''}
                                                    {v.status === 'Preview' ? <span className="text-xs text-orange-500 ml-1">({t?.page_BadgePreview || 'Preview'})</span> : ''}
                                                    {v.notes ? <span className="text-xs text-muted-foreground ml-1">({v.notes})</span> : ''}
                                                </SelectItem>
                                            );
                                        })}
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
                {translationLoading || !t ? (
                    <CardTitle>...</CardTitle>
                ) : (
                    <CardTitle>{t.sessionSetupForm.title}</CardTitle>
                )}
                {t?.sessionSetupForm && t.sessionSetupForm.description && (
                    <CardDescription>{t.sessionSetupForm.description}</CardDescription>
                )}
                {statusError && <p className="text-sm text-destructive pt-2">{statusError}</p>}
                {isLoadingStatus && !authLoading && !statusError && <p className="text-sm text-muted-foreground pt-2">Loading API key status...</p>}
            </CardHeader>
            <CardContent className="space-y-6">
                {/* LLM Selection Section */}
                <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Agent A Model Selector */}
                        <div className="space-y-2">
                            <ModelSelector
                                value={agentA_llm}
                                onChange={setAgentA_llm}
                                disabled={isLoading || isLoadingStatus || !user}
                                label={t?.sessionSetupForm?.agentAModel || 'Agent A Model'}
                                placeholder={t?.sessionSetupForm?.selectLLMForAgentA || 'Select a model for Agent A'}
                            />
                        </div>
                        {/* Agent B Model Selector */}
                        <div className="space-y-2">
                            <ModelSelector
                                value={agentB_llm}
                                onChange={setAgentB_llm}
                                disabled={isLoading || isLoadingStatus || !user}
                                label={t?.sessionSetupForm?.agentBModel || 'Agent B Model'}
                                placeholder={t?.sessionSetupForm?.selectLLMForAgentB || 'Select a model for Agent B'}
                            />
                        </div>
                    </div>
                    {/* Explanation Notes */}
                    {t && (
                        <p className="text-xs text-muted-foreground px-1 pt-1 flex items-center">
                            <Check className="h-3 w-3 text-green-700 dark:text-green-300 mr-1 flex-shrink-0"/>
                            <X className="h-3 w-3 text-red-700 dark:text-red-300 mr-1 flex-shrink-0"/>
                            {t.sessionSetupForm.languageSupportNote.replace('{languageName}', language.nativeName)}
                        </p>
                    )}
                    {/* {ANY_MODEL_USES_REASONING && (
                         <p className="text-xs text-muted-foreground px-1 pt-1 flex items-center">
                            <Info className="h-3 w-3 text-blue-500 mr-1 flex-shrink-0"/>
                            {t && t.sessionSetupForm.reasoningNote}
                        </p>
                    )} */}
                    {/* {ANY_OPENAI_REQUIRES_ORG_VERIFICATION && (
                        <p className="text-xs text-muted-foreground px-1 pt-1 flex items-center">
                            <AlertTriangle className="h-3 w-3 text-yellow-500 mr-1 flex-shrink-0"/>
                            {t && t.sessionSetupForm.openaiOrgVerificationNote}
                            {t && (
                              <a
                                  href="https://platform.openai.com/settings/organization/general"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 ml-1"
                              >
                                  {t.common_verifyHere}
                              </a>
                            )}
                        </p>
                    )} */}
                </div>

                {/* TTS Configuration Section */}
                <hr className="my-6" />
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="tts-enabled-checkbox" 
                            checked={ttsEnabled} 
                            onCheckedChange={handleTtsToggle} 
                            disabled={!user}
                            aria-describedby="tts-checkbox-description"
                        />
                        <Label 
                            htmlFor="tts-enabled-checkbox" 
                            className="text-base font-medium"
                        >
                            {t?.sessionSetupForm?.enableTTS}
                        </Label>
                    </div>
                    <div id="tts-checkbox-description" className="sr-only">
                        Check this box to enable text-to-speech functionality. When enabled, AI messages will be converted to audio and played automatically.
                    </div>
                    
                    {/* Safari Browser Warning */}
                    {ttsEnabled && showSafariWarning && (
                        <div className="bg-orange-50 dark:bg-orange-950 border-l-4 border-orange-400 p-4 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-orange-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                                        Limited Voice Selection in Safari
                                    </p>
                                    <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                                        Safari shows fewer voices than other browsers. 
                                        For the best voice selection with Browser TTS, please use Chrome, Firefox, Edge, or Opera.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {ttsEnabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4" role="group" aria-labelledby="tts-settings-label">
                            <div id="tts-settings-label" className="sr-only">Text-to-Speech Settings</div>
                            {renderTTSConfigForAgent('A', agentATTSSettings, currentVoicesA)}
                            {renderTTSConfigForAgent('B', agentBTTSSettings, currentVoicesB)}
                        </div>
                    )}
                </div>
                {/* IMAGE GENERATION CONFIGURATION SECTION */}
                <hr className="my-6" />
                {/* <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="image-gen-enabled-checkbox" 
                            checked={imageGenEnabled} 
                            onCheckedChange={checked => setImageGenEnabled(Boolean(checked))} 
                            aria-describedby="image-gen-checkbox-description"
                        />
                        <Label 
                            htmlFor="image-gen-enabled-checkbox" 
                            className="text-base font-medium"
                        >
                            {t?.sessionSetupForm?.enableImageGen}
                        </Label>
                    </div>
                    <div id="image-gen-checkbox-description" className="sr-only">
                        Check this box to enable image generation for each turn. An image will be generated and shown for each agent message.
                    </div>
                    {imageGenEnabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4" role="group" aria-labelledby="image-gen-settings-label">
                            <div id="image-gen-settings-label" className="sr-only">Image Generation Settings</div> */}
                            {/* Image Model Selection */}
                            {/* <div className="space-y-2">
                                <Label htmlFor="image-model-select">{t?.sessionSetupForm?.imageModel}</Label>
                                <Select
                                    value={selectedImageModelId}
                                    onValueChange={setSelectedImageModelId}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t?.sessionSetupForm?.selectImageModel} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {AVAILABLE_IMAGE_MODELS.map(m => (
                                            <SelectItem key={m.id} value={m.id}>{m.name} ({m.provider})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div> */}
                            {/* Quality Selection */}
                            {/* <div className="space-y-2">
                                <Label htmlFor="image-quality-select">{t?.sessionSetupForm?.quality}</Label>
                                <Select
                                    value={selectedImageQuality}
                                    onValueChange={v => setSelectedImageQuality(v as ImageModelQuality)}
                                    disabled={!selectedImageModelId}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select quality" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(() => {
                                            const model = AVAILABLE_IMAGE_MODELS.find(m => m.id === selectedImageModelId);
                                            if (!model) return null;
                                            
                                            // Only include qualities that are defined
                                            const qualities = model.qualities
                                                .filter(q => q.quality) // Filter out undefined qualities
                                                .map(q => q.quality as string); // Cast to string since we filtered out undefined
                                            
                                            // If no qualities, return a default option
                                            if (qualities.length === 0) {
                                                return <SelectItem value="standard">Standard</SelectItem>;
                                            }
                                            
                                            return qualities.map(quality => (
                                                <SelectItem 
                                                    key={quality} 
                                                    value={quality}
                                                >
                                                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                                                </SelectItem>
                                            ));
                                        })()}
                                    </SelectContent>
                                </Select>
                            </div> */}
                            {/* Size Selection */}
                            {/* <div className="space-y-2">
                                <Label htmlFor="image-size-select">{t?.sessionSetupForm?.size}</Label>
                                <Select
                                    value={selectedImageSize}
                                    onValueChange={v => setSelectedImageSize(v as ImageModelSize)}
                                    disabled={!selectedImageModelId || (() => {
                                        const currentModel = AVAILABLE_IMAGE_MODELS.find(m => m.id === selectedImageModelId);
                                        return currentModel?.qualities.some((q: { quality?: string }) => q.quality) && !selectedImageQuality;
                                    })()}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(() => {
                                            const model = AVAILABLE_IMAGE_MODELS.find(m => m.id === selectedImageModelId);
                                            if (!model) return null;
                                            
                                            // For models without quality settings, use the first quality object
                                            if (model.qualities.length > 0 && !model.qualities.some(q => q.quality)) {
                                                return model.qualities[0].sizes.map(s => (
                                                    <SelectItem key={s.size} value={s.size}>{s.size}</SelectItem>
                                                ));
                                            }
                                            
                                            // For models with quality settings, find the selected quality
                                            const qualityObj = model.qualities.find(q => q.quality === selectedImageQuality);
                                            return qualityObj?.sizes.map(s => (
                                                <SelectItem key={s.size} value={s.size}>{s.size}</SelectItem>
                                            )) || null;
                                        })()}
                                    </SelectContent>
                                </Select>
                            </div> */}
                            {/* Prompt LLM Selection */}
                            {/* <div className="space-y-2">
                                <Label htmlFor="prompt-llm-select">{t?.sessionSetupForm?.promptLLM}</Label>
                                <Select
                                    value={selectedPromptLlm}
                                    onValueChange={setSelectedPromptLlm}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t?.sessionSetupForm?.selectPromptLLM} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {AVAILABLE_LLMS.map(llm => (
                                            <SelectItem key={llm.id} value={llm.id}>{llm.name} ({llm.provider})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div> */}
                            {/* System Prompt for Image Prompt LLM */}
                            {/* <div className="space-y-2 col-span-1 md:col-span-2">
                                <Label htmlFor="image-prompt-system-message">{t?.sessionSetupForm?.imagePromptSystemMessage}</Label>
                                <textarea
                                    id="image-prompt-system-message"
                                    className="w-full border rounded-md p-2 text-sm min-h-[60px]"
                                    value={imagePromptSystemMessage}
                                    onChange={e => setImagePromptSystemMessage(e.target.value)}
                                    placeholder="Create a prompt to give to the image generation model based on this turn: {turn}"
                                    aria-describedby="image-prompt-system-message-description"
                                    aria-label="System prompt for image prompt LLM"
                                />
                                <p id="image-prompt-system-message-description" className="text-xs text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: t?.sessionSetupForm?.imagePromptSystemMessageHelp || '' }} />
                            </div>
                        </div>
                    )}
                </div> */}
                {/* Move initial prompt section here */}
                <div className="mt-4">
                    <label htmlFor="initial-system-prompt" className="block font-medium mb-1">{t?.sessionSetupForm?.initialSystemPrompt}</label>
                    <textarea
                        id="initial-system-prompt"
                        className="w-full border rounded-md p-2 text-sm min-h-[60px]"
                        value={initialSystemPrompt}
                        onChange={e => setInitialSystemPrompt(e.target.value)}
                        placeholder={t?.sessionSetupForm?.startTheConversation || ''}
                        aria-describedby="initial-prompt-description"
                        aria-label="Initial system prompt for starting the conversation"
                    />
                    <p id="initial-prompt-description" className="text-xs text-muted-foreground mt-1">
                        {t?.sessionSetupForm?.initialPromptDescription}
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <Button 
                    onClick={handleStartClick} 
                    disabled={isStartDisabled} 
                    className="w-full"
                    aria-label={isStartDisabled ? "Cannot start session - please select models for both agents" : "Start a new conversation with the selected settings"}
                    aria-describedby="start-button-description"
                >
                    {isLoading ? t?.sessionSetupForm?.starting : t?.sessionSetupForm?.startConversation}
                </Button>
                <div id="start-button-description" className="sr-only">
                    Click to begin a new AI conversation with the selected language models and settings.
                </div>
            </CardFooter>
        </Card>
    );
};

export default SessionSetupForm;