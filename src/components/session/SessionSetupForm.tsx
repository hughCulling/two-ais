// src/components/session/SessionSetupForm.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { db } from '@/lib/firebase/clientApp';
import { AVAILABLE_LLMS, LLMInfo, groupLLMsByProvider, getLLMInfoById, groupModelsByCategory } from '@/lib/models';
import { FreeTierBadge } from "@/components/ui/free-tier-badge";
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
import { AVAILABLE_IMAGE_MODELS, ImageModelQuality, ImageModelSize, ImageAspectRatio } from '@/lib/image_models';

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
    imageGenSettings?: {
        enabled: boolean;
        provider: string;
        model: string;
        quality: ImageModelQuality;
        size: ImageModelSize | ImageAspectRatio;
        promptLlm: string;
        promptSystemMessage: string;
    };
}

interface SessionSetupFormProps {
    onStartSession: (config: SessionConfig) => void;
    isLoading: boolean;
}

const ALL_REQUIRED_KEY_IDS = ['openai', 'google_ai', 'anthropic', 'xai', 'together_ai', 'googleCloudApiKey', 'elevenlabs', 'gemini_api_key', 'deepseek', 'mistral'];

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
    const { t, loading } = useTranslation();
    const [open, setOpen] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listboxRef = useRef<HTMLDivElement>(null);
    const groupedLLMs = groupLLMsByProvider();

    // Generate unique IDs for ARIA relationships
    const listboxId = `llm-selector-${label.toLowerCase().replace(/\s+/g, '-')}-listbox`;
    const buttonId = `llm-selector-${label.toLowerCase().replace(/\s+/g, '-')}-button`;

    // All hooks above; now check for loading/t

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

    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
                setSelectedProvider(null);
                buttonRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open]);

    // Instead of returning null, render a placeholder UI if loading or t is missing
    if (loading || !t) {
        return (
            <div className="w-full" ref={dropdownRef}>
                <label className="block mb-1 font-medium text-sm">{label}</label>
                <div className="w-full px-3 py-2 border rounded-md bg-muted text-muted-foreground text-sm" role="status" aria-live="polite">Loading...</div>
            </div>
        );
    }

    // Find selected LLM info
    const selectedLLM = value ? getLLMInfoById(value) : undefined;

    // Group models by category for a provider
    const getModelsByCategory = (provider: string) => {
        const models = groupedLLMs[provider] || [];
        // Use the same grouping as landing page
        // Use groupModelsByCategory from main page
        // We'll import it at the top
        const { orderedCategories, byCategory } = groupModelsByCategory(models, t);
        return { orderedCategories, byCategory };
    };

    return (
        <div className="w-full" ref={dropdownRef} role="combobox" aria-expanded={open} aria-haspopup="listbox" aria-controls={listboxId}>
            <label className="block mb-1 font-medium text-sm" htmlFor={buttonId}>{label}</label>
            <button
                ref={buttonRef}
                id={buttonId}
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
                aria-describedby={listboxId}
                aria-label={`${label}: ${selectedLLM ? `${selectedLLM.name} (${selectedLLM.provider})` : (placeholder || 'Select LLM')}`}
                aria-controls={listboxId}
            >
                <span className="truncate">
                    {selectedLLM ? `${selectedLLM.name} (${selectedLLM.provider})` : (placeholder || 'Select LLM')}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 opacity-60" aria-hidden="true" />
            </button>
            {open && (
                <div 
                    ref={listboxRef}
                    id={listboxId}
                    className="absolute z-50 mt-2 w-full max-w-md bg-popover border rounded-md shadow-lg overflow-auto max-h-96 animate-in fade-in-0" 
                    role="listbox"
                    aria-labelledby={`${buttonId}-label`}
                    aria-activedescendant={selectedLLM ? `option-${selectedLLM.id}` : undefined}
                >
                    {!selectedProvider ? (
                        // Provider selection view
                        <div>
                            <div className="p-2 border-b font-semibold text-base" role="heading" aria-level={2}>Select Provider</div>
                            <ul role="group" aria-label="AI Providers">
                                {Object.keys(groupedLLMs).map((provider) => (
                                    <li key={provider} role="none">
                                        <button
                                            className="w-full text-left px-4 py-3 hover:bg-accent focus:bg-accent transition-colors flex items-center justify-between"
                                            onClick={() => setSelectedProvider(provider)}
                                            tabIndex={0}
                                            role="option"
                                            aria-selected={false}
                                            aria-label={`Select ${provider} provider`}
                                            aria-describedby={`provider-${provider}-description`}
                                        >
                                            <span className="font-medium">{provider}</span>
                                            <ChevronRight className="h-4 w-4 opacity-60" aria-hidden="true" />
                                        </button>
                                        <div id={`provider-${provider}-description`} className="sr-only">
                                            Click to view models from {provider}
                                        </div>
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
                                    aria-describedby="back-button-description"
                                >
                                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                                </button>
                                <span className="font-semibold text-base" role="heading" aria-level={2}>{selectedProvider}</span>
                                <div id="back-button-description" className="sr-only">
                                    Click to go back to provider selection
                                </div>
                            </div>
                            <div className="overflow-y-auto max-h-80" role="group" aria-label={`${selectedProvider} models`}>
                                {(() => {
                                    const { orderedCategories, byCategory } = getModelsByCategory(selectedProvider);
                                    return orderedCategories.map((cat: string) => (
                                        <div key={cat} className="pt-2 pb-1 px-4" role="group" aria-labelledby={`category-${cat}-label`}>
                                            <div id={`category-${cat}-label`} className="text-xs font-semibold text-muted-foreground mb-1" role="heading" aria-level={3}>{cat}</div>
                                            <ul role="group" aria-label={`${cat} models`}>
                                                {byCategory[cat].map((llm: LLMInfo) => {
                                                    const supportsLanguage = isLanguageSupported(llm.provider, language.code, llm.id);
                                                    const isSelected = llm.id === value;
                                                    return (
                                                        <li key={llm.id} role="none">
                                                            <button
                                                                id={`option-${llm.id}`}
                                                                className={cn(
                                                                    "w-full text-left px-2 py-2 rounded flex items-center justify-between",
                                                                    isSelected ? 'bg-primary/10 font-bold' : 'hover:bg-accent',
                                                                    !supportsLanguage && 'opacity-50 cursor-not-allowed'
                                                                )}
                                                                onClick={() => supportsLanguage && onChange(llm.id)}
                                                                disabled={!supportsLanguage}
                                                                tabIndex={0}
                                                                role="option"
                                                                aria-selected={isSelected}
                                                                aria-label={`${llm.name} (${llm.provider})${!supportsLanguage ? ' - Not supported for current language' : ''}`}
                                                                aria-describedby={`model-${llm.id}-description`}
                                                            >
                                                                <span className="flex-shrink-0 flex items-center min-w-0">
                                                                    <span className="truncate font-medium" style={{ maxWidth: '16rem' }}>{llm.name}</span>
                                                                    {llm.status === 'preview' && <span className="ml-1 text-xs text-orange-500">({t?.page_BadgePreview || 'Preview'})</span>}
                                                                    {llm.status === 'beta' && <span className="ml-1 text-xs text-blue-500">(Beta)</span>}
                                                                    {llm.pricing?.freeTier?.available && <FreeTierBadge freeTier={llm.pricing.freeTier} t={t} className="ml-1" />}
                                                                </span>
                                                                <span className="flex items-center space-x-2 min-w-0 max-w-[14rem]">
                                                                    {llm.pricing.note ? (
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <span 
                                                                                    className="text-xs text-muted-foreground truncate max-w-[10rem] block" 
                                                                                    title={llm.pricing.note ? 
                                                                                        (typeof llm.pricing.note === 'function' ? llm.pricing.note(t) : llm.pricing.note) : 
                                                                                        `$${formatPrice(llm.pricing.input)} / $${formatPrice(llm.pricing.output)} ${t?.page_PricingPerTokens || 'per 1 Million Tokens'}`}>
                                                                                    {llm.pricing.note ? (
                                                                                        <span>({typeof llm.pricing.note === 'function' ? llm.pricing.note(t) : llm.pricing.note})</span>
                                                                                    ) : (
                                                                                        <span>(${formatPrice(llm.pricing.input)} / ${formatPrice(llm.pricing.output)} {t?.page_PricingPerTokens || 'per 1 Million Tokens'})</span>
                                                                                    )}
                                                                                </span>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="top">
                                                                                <span className="text-xs">
                                                                                    {llm.pricing.note ? 
                                                                                        (typeof llm.pricing.note === 'function' ? llm.pricing.note(t) : llm.pricing.note) : 
                                                                                        `$${formatPrice(llm.pricing.input)} / $${formatPrice(llm.pricing.output)} ${t?.page_PricingPerTokens || 'per 1 Million Tokens'}`}
                                                                                </span>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    ) : (
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <span className="text-xs text-muted-foreground truncate max-w-[10rem] block" title={`$${formatPrice(llm.pricing.input)} / $${formatPrice(llm.pricing.output)} ${t?.page_PricingPerTokens || 'per 1 Million Tokens'}`}>
                                                                                    (${formatPrice(llm.pricing.input)} / ${formatPrice(llm.pricing.output)} {t?.page_PricingPerTokens || 'per 1 Million Tokens'})
                                                                                </span>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="top">
                                                                                <span className="text-xs">${formatPrice(llm.pricing.input)} / ${formatPrice(llm.pricing.output)} {t?.page_PricingPerTokens || 'per 1 Million Tokens'}</span>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    )}
                                                                    {isLanguageSupported(llm.provider, language.code, llm.id) ? (
                                                                        <Check className="h-3 w-3 text-green-700 dark:text-green-300" aria-hidden="true" />
                                                                    ) : (
                                                                        <X className="h-3 w-3 text-red-700 dark:text-red-300" aria-hidden="true" />
                                                                    )}
                                                                </span>
                                                            </button>
                                                            <div id={`model-${llm.id}-description`} className="sr-only">
                                                                {llm.name} from {llm.provider}. 
                                                                {supportsLanguage ? 'Supports current language.' : 'Does not support current language.'}
                                                                {llm.status === 'preview' ? ` ${t?.page_BadgePreview || 'Preview'} model.` : ''}
                                                                {llm.status === 'beta' ? ' Beta model.' : ''}
                                                                Pricing: {llm.pricing.note ? 
                                                                    (typeof llm.pricing.note === 'function' ? llm.pricing.note(t) : llm.pricing.note) : 
                                                                    `$${formatPrice(llm.pricing.input)} / $${formatPrice(llm.pricing.output)} ${t?.page_PricingPerTokens || 'per 1 Million Tokens'}`}.
                                                            </div>
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
    const { t, loading: translationLoading } = useTranslation();
    const [agentA_llm, setAgentA_llm] = useState<string>('');
    const [agentB_llm, setAgentB_llm] = useState<string>('');
    const [savedKeyStatus, setSavedKeyStatus] = useState<Record<string, boolean>>({});
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);
    const [statusError, setStatusError] = useState<string | null>(null);
    const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);
    const [initialSystemPrompt, setInitialSystemPrompt] = useState<string>(() => t?.sessionSetupForm?.startTheConversation || '');

    // --- Image Generation State ---
    const [imageGenEnabled, setImageGenEnabled] = useState(false);
    const [selectedImageModelId, setSelectedImageModelId] = useState<string>('');
    const [selectedImageQuality, setSelectedImageQuality] = useState<ImageModelQuality>('medium');
    const [selectedImageSize, setSelectedImageSize] = useState<ImageModelSize | ImageAspectRatio>('1024x1024');
    const [selectedPromptLlm, setSelectedPromptLlm] = useState<string>('');
    const [imagePromptSystemMessage, setImagePromptSystemMessage] = useState<string>(t?.sessionSetupForm?.defaultImagePromptSystemMessage || 'Create a prompt to give to the image generation model based on this turn: {turn}');

    // Update quality/size when model changes
    useEffect(() => {
        if (!selectedImageModelId) return;
        const model = AVAILABLE_IMAGE_MODELS.find(m => m.id === selectedImageModelId);
        if (model) {
            // Default to first quality/size if not set
            const firstQuality = model.qualities[0]?.quality || 'medium';
            setSelectedImageQuality(firstQuality);
            const firstSize = model.qualities[0]?.sizes[0]?.size || '1024x1024';
            setSelectedImageSize(firstSize);
        }
    }, [selectedImageModelId]);

    // Update size when quality changes
    useEffect(() => {
        if (!selectedImageModelId) return;
        
        const model = AVAILABLE_IMAGE_MODELS.find(m => m.id === selectedImageModelId);
        if (!model) return;
        
        // If no quality is selected, use the first available quality or proceed without one
        if (!selectedImageQuality) {
            // Find first defined quality or use the first quality object if all qualities are undefined
            const firstQuality = model.qualities.find(q => q.quality)?.quality || 
                               (model.qualities[0]?.sizes[0] ? 'standard' : undefined);
            
            if (firstQuality) {
                setSelectedImageQuality(firstQuality);
            }
            return;
        }
        
        // Find the quality object that matches the selected quality
        const qualityObj = model.qualities.find(q => q.quality === selectedImageQuality);
        
        // If we found a matching quality with sizes, update the size
        if (qualityObj?.sizes && qualityObj.sizes.length > 0) {
            setSelectedImageSize(qualityObj.sizes[0].size);
        } else if (model.qualities.length > 0 && model.qualities[0]?.sizes?.length > 0) {
            // Fallback to first available size if the selected quality has no sizes
            setSelectedImageSize(model.qualities[0].sizes[0].size);
        }
    }, [selectedImageModelId, selectedImageQuality]);

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

        // Image generation validation
        let imageGenSettings: SessionConfig['imageGenSettings'] = undefined;
        if (imageGenEnabled) {
            const model = AVAILABLE_IMAGE_MODELS.find(m => m.id === selectedImageModelId);
            if (!model) {
                alert('Please select an image model.');
                return;
            }
            
            // Check if the model has any quality settings
            const hasQualitySettings = model.qualities.some(q => q.quality);
            
            // Only require quality if the model has quality settings
            if (hasQualitySettings && !selectedImageQuality) {
                alert('Please select an image quality.');
                return;
            }
            
            if (!selectedImageSize) {
                alert('Please select an image size.');
                return;
            }
            
            if (!selectedPromptLlm) {
                alert('Please select a prompt LLM for image generation.');
                return;
            }
            
            if (!imagePromptSystemMessage) {
                alert('Please provide a system prompt for the image prompt LLM.');
                return;
            }
            
            // Use 'standard' as default quality if the model doesn't have quality settings
            const qualityToUse = hasQualitySettings ? selectedImageQuality : 'standard';
            
            imageGenSettings = {
                enabled: true,
                provider: model.provider,
                model: model.id,
                quality: qualityToUse as ImageModelQuality, // Safe to cast since we provide a default
                size: selectedImageSize,
                promptLlm: selectedPromptLlm,
                promptSystemMessage: imagePromptSystemMessage,
            };
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
            initialSystemPrompt,
            imageGenSettings,
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
                                            // Only show gender letter if provider is not Google Cloud or Google Gemini
                                            const providerId = currentAgentTTSSettings.provider;
                                            const showGender = providerId !== 'google-cloud' && providerId !== 'google-gemini';
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
                        {/* Agent A LLM Selector */}
                        <div className="space-y-2">
                            <LLMSelector
                                value={agentA_llm}
                                onChange={setAgentA_llm}
                                disabled={isLoading || isLoadingStatus || !user}
                                label={t?.sessionSetupForm?.agentAModel || ''}
                                placeholder={t?.sessionSetupForm?.selectLLMForAgentA || ''}
                            />
                        </div>
                        {/* Agent B LLM Selector */}
                        <div className="space-y-2">
                            <LLMSelector
                                value={agentB_llm}
                                onChange={setAgentB_llm}
                                disabled={isLoading || isLoadingStatus || !user}
                                label={t?.sessionSetupForm?.agentBModel || ''}
                                placeholder={t?.sessionSetupForm?.selectLLMForAgentB || ''}
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
                    {ANY_MODEL_USES_REASONING && (
                         <p className="text-xs text-muted-foreground px-1 pt-1 flex items-center">
                            <Info className="h-3 w-3 text-blue-500 mr-1 flex-shrink-0"/>
                            {t && t.sessionSetupForm.reasoningNote}
                        </p>
                    )}
                    {ANY_OPENAI_REQUIRES_ORG_VERIFICATION && (
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
                    )}
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
                <div className="space-y-4">
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
                            <div id="image-gen-settings-label" className="sr-only">Image Generation Settings</div>
                            {/* Image Model Selection */}
                            <div className="space-y-2">
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
                            </div>
                            {/* Quality Selection */}
                            <div className="space-y-2">
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
                            </div>
                            {/* Size Selection */}
                            <div className="space-y-2">
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
                            </div>
                            {/* Prompt LLM Selection */}
                            <div className="space-y-2">
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
                            </div>
                            {/* System Prompt for Image Prompt LLM */}
                            <div className="space-y-2 col-span-1 md:col-span-2">
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
                </div>
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