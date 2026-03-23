// src/components/session/SessionSetupForm.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { db } from '@/lib/firebase/clientApp';
import { getAllAvailableLLMs, getLLMInfoById, groupLLMsByProvider, groupModelsByCategory, setOllamaModelsFromNames } from '@/lib/models';
// useOllama replaced with manual verify flow for ngrok support
import { FreeTierBadge } from "@/components/ui/free-tier-badge";
import { IconTooltipBadge } from "@/components/ui/icon-tooltip-badge";
import { SetupInstructions } from "@/components/setup/SetupInstructions";
import {
    TTSProviderInfo,
    TTSVoice,
    getTTSProviderInfoById,
    onVoicesLoaded,
    setLocalAIModels
} from '@/lib/tts_models';
import { getNextSelectedVoiceId } from '@/lib/tts-selection';
import { isLanguageSupported } from '@/lib/model-language-support';
import { isTTSModelLanguageSupported } from '@/lib/tts_models';
// import { AlertTriangle, Info, Check, X, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { AlertTriangle, Info, Check, X, Download, Save, ChevronDown, ChevronUp, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { saveSessionPreset, loadSessionPreset, SessionPreset } from '@/lib/firebase/sessionPreset';
// import { cn } from "@/lib/utils";
// import { AVAILABLE_IMAGE_MODELS, ImageModelQuality, ImageModelSize, ImageAspectRatio } from '@/lib/image_models';
import { isSafariBrowser, isChromeBrowser, isFirefoxBrowser, isOperaBrowser } from '@/lib/browser-utils';

// --- Define TTS Types ---
type TTSProviderOptionId = TTSProviderInfo['id'] | 'localai';

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
    ollamaEndpoint?: string;
    localaiEndpoint?: string;
    lookaheadLimit?: number;
    imageGenSettings?: {
        enabled: boolean;
        provider: string;
        invokeaiEndpoint: string;
        invokeaiModel?: string;
        negativePrompt?: string;
        steps?: number;
        guidanceScale?: number;
        width?: number;
        height?: number;
        seed?: number;
        scheduler?: string;
        clipSkip?: number;
        cfgRescaleMultiplier?: number;
        promptLlm: string;
        promptSystemMessage: string;
    };
}

interface SessionSetupFormProps {
    onStartSession: (config: SessionConfig) => void;
    isLoading: boolean;
}

const INVOKEAI_SCHEDULERS: { id: string; label: string }[] = [
    { id: 'ddim', label: 'DDIM' },
    { id: 'ddpm', label: 'DDPM' },
    { id: 'deis', label: 'DEIS' },
    { id: 'deis_k', label: 'DEIS Karras' },
    { id: 'dpm2', label: 'DPM 2' },
    { id: 'kdpm2', label: 'KDPM 2' },
    { id: 'kdpm2_k', label: 'KDPM 2 Karras' },
    { id: 'kdpm2_a', label: 'KDPM 2 Ancestral' },
    { id: 'kdpm2_a_k', label: 'KDPM 2 Ancestral Karras' },
    { id: 'dpmpp_2s', label: 'DPM++ 2S' },
    { id: 'dpmpp_2s_k', label: 'DPM++ 2S Karras' },
    { id: 'dpmpp_2m', label: 'DPM++ 2M' },
    { id: 'dpmpp_2m_k', label: 'DPM++ 2M Karras' },
    { id: 'dpmpp_2m_sde', label: 'DPM++ 2M SDE' },
    { id: 'dpmpp_2m_sde_k', label: 'DPM++ 2M SDE Karras' },
    { id: 'dpmpp_3m', label: 'DPM++ 3M' },
    { id: 'dpmpp_3m_k', label: 'DPM++ 3M Karras' },
    { id: 'dpmpp_sde', label: 'DPM++ SDE' },
    { id: 'dpmpp_sde_k', label: 'DPM++ SDE Karras' },
    { id: 'euler', label: 'Euler' },
    { id: 'euler_k', label: 'Euler Karras' },
    { id: 'euler_a', label: 'Euler Ancestral' },
    { id: 'heun', label: 'Heun' },
    { id: 'heun_k', label: 'Heun Karras' },
    { id: 'lcm', label: 'LCM' },
    { id: 'lms', label: 'LMS' },
    { id: 'lms_k', label: 'LMS Karras' },
    { id: 'pndm', label: 'PNDM' },
    { id: 'tcd', label: 'TCD' },
    { id: 'uni_pc', label: 'UniPC' },
    { id: 'uni_pc_k', label: 'UniPC Karras' },
    { id: 'uni_pc_bh2', label: 'UniPC BH2' },
];

const ALL_REQUIRED_KEY_IDS = ['openai', 'google_ai', 'anthropic', 'xai', 'together_ai', 'googleCloudApiKey', 'elevenlabs', 'gemini_api_key', 'deepseek', 'mistral'];

const ANY_OPENAI_REQUIRES_ORG_VERIFICATION = getAllAvailableLLMs().some(
    llm => llm.provider === 'OpenAI' && llm.requiresOrgVerification
);
const ANY_MODEL_USES_REASONING = getAllAvailableLLMs().some(
    llm => llm.usesReasoningTokens
);
const ANY_MODEL_HAS_FREE_TIER = getAllAvailableLLMs().some(
    llm => llm.pricing?.freeTier?.available
);

const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 3,
    });
};

// --- Custom LLM Selector Dropdown ---
// Simplified version similar to TTS selector - shows all models in a single dropdown
// The complex two-step provider selection is commented out below for future use
interface LLMSelectorProps {
    value: string;
    onChange: (id: string) => void;
    disabled?: boolean;
    label: string;
    placeholder?: string;
}

// Simplified LLM Selector - similar to TTS selector
const LLMSelector: React.FC<LLMSelectorProps> = ({ value, onChange, disabled, label, placeholder }) => {
    const { language } = useLanguage();
    const { t, loading } = useTranslation();

    if (loading || !t) {
        return (
            <div className="space-y-2">
                <Label>{label}</Label>
                <div className="w-full px-3 py-2 border rounded-md bg-muted text-muted-foreground text-sm">Loading...</div>
            </div>
        );
    }

    const groupedByProvider = groupLLMsByProvider();
    const orderedProviders = Object.keys(groupedByProvider);

    // Get the selected model info to display only its name in the trigger
    const selectedLLM = value ? getLLMInfoById(value) : null;

    return (
        <div className="space-y-2">
            <Label htmlFor={`llm-select-${label.toLowerCase().replace(/\s+/g, '-')}`} className="block text-center">{label}</Label>
            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger id={`llm-select-${label.toLowerCase().replace(/\s+/g, '-')}`} className="w-full relative [&>span]:mx-auto [&>span]:text-center [&>svg]:absolute [&>svg]:right-3">
                    <SelectValue placeholder={placeholder || 'Select LLM'}>
                        {selectedLLM ? selectedLLM.name : placeholder || 'Select LLM'}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-96 liquid-glass-panel">
                    {orderedProviders.map((provider) => {
                        // Check if all models in this provider support the current language
                        const allModelsSupport = groupedByProvider[provider].every(llm =>
                            isLanguageSupported(llm.provider, language.code, llm.id)
                        );

                        // Check if all models in this provider have free tier
                        const allHaveFreeTier = groupedByProvider[provider].every(llm =>
                            llm.pricing?.freeTier?.available
                        );

                        // Get the free tier info from the first model (they should all be the same for the provider)
                        const providerFreeTier = allHaveFreeTier ? groupedByProvider[provider][0]?.pricing?.freeTier : null;

                        const { orderedCategories, byCategory } = groupModelsByCategory(groupedByProvider[provider], t);

                        return (
                            <SelectGroup key={provider}>
                                <SelectLabel className="flex items-center justify-center text-center">
                                    <div className="relative inline-flex items-center justify-center">
                                        <span>{provider}</span>
                                        <div className="absolute left-full ml-2 flex items-center gap-2 whitespace-nowrap">
                                            {allHaveFreeTier && providerFreeTier && (
                                                <FreeTierBadge freeTier={providerFreeTier} t={t} />
                                            )}
                                            {allModelsSupport && (
                                                <IconTooltipBadge
                                                    icon={<Check className="h-3 w-3 text-green-700 dark:text-green-300" />}
                                                    tooltip={t.page_TooltipSupportsLanguage.replace("{languageName}", language.nativeName)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </SelectLabel>
                                {orderedCategories.flatMap((category) => {
                                    const models = byCategory[category] || [];
                                    return models.map((llm) => {
                                        const supportsLanguage = isLanguageSupported(llm.provider, language.code, llm.id);
                                        const pricingText = llm.pricing.note
                                            ? (typeof llm.pricing.note === 'function' ? llm.pricing.note(t) : llm.pricing.note)
                                            : `$${formatPrice(llm.pricing.input)} / $${formatPrice(llm.pricing.output)} ${t?.page_PricingPerTokens || 'per 1M tokens'}`;

                                        return (
                                            <SelectItem
                                                key={llm.id}
                                                value={llm.id}
                                                disabled={!supportsLanguage}
                                                className="py-2 justify-center"
                                            >
                                                <div className="w-full flex flex-col items-center justify-center text-center">
                                                    <div className="w-full flex items-center justify-center gap-1.5 text-sm">
                                                        <span className="font-medium max-w-full truncate">{llm.name}</span>
                                                        {llm.status === 'preview' && <span className="text-xs text-orange-500 whitespace-nowrap">({t?.page_BadgePreview || 'Preview'})</span>}
                                                        {llm.status === 'beta' && <span className="text-xs text-blue-500 whitespace-nowrap">(Beta)</span>}
                                                        {llm.status === 'experimental' && <span className="text-xs text-purple-500 whitespace-nowrap">({t?.page_BadgeExperimental || 'Experimental'})</span>}
                                                    </div>

                                                    {llm.provider !== 'Ollama' && (
                                                        <div className="text-xs text-muted-foreground max-w-full truncate" title={pricingText}>
                                                            ({pricingText})
                                                        </div>
                                                    )}

                                                    {!allModelsSupport && (
                                                        <div className="pt-1">
                                                            {supportsLanguage ? (
                                                                <IconTooltipBadge
                                                                    icon={<Check className="h-3 w-3 text-green-700 dark:text-green-300" />}
                                                                    tooltip={t.page_TooltipSupportsLanguage.replace("{languageName}", language.nativeName)}
                                                                />
                                                            ) : (
                                                                <IconTooltipBadge
                                                                    icon={<X className="h-3 w-3 text-red-700 dark:text-red-300" />}
                                                                    tooltip={t.page_TooltipMayNotSupportLanguage.replace("{languageName}", language.nativeName)}
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        );
                                    });
                                })}
                            </SelectGroup>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
};

/* COMMENTED OUT: Complex two-step LLM selector - uncomment to restore original functionality
const LLMSelectorComplex: React.FC<LLMSelectorProps> = ({ value, onChange, disabled, label, placeholder }) => {
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
*/

function SessionSetupForm({ onStartSession, isLoading }: SessionSetupFormProps) {
    const { user, loading: authLoading } = useAuth();
    const { language } = useLanguage();
    const { t, loading: translationLoading } = useTranslation();

    const playVoiceSample = useCallback((voice: TTSVoice) => {
        if (!window.speechSynthesis) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Find the actual SpeechSynthesisVoice
        const voices = window.speechSynthesis.getVoices();

        // Try to match by URI first, then by name
        let browserVoice = voices.find(v => v.voiceURI === voice.providerVoiceId);
        if (!browserVoice) {
            // Note: voice.name often includes the language tag e.g., "Google US English (en-US)", while browser voice name might just be "Google US English"
            browserVoice = voices.find(v => v.name === voice.name.replace(/\s\([^)]+\)$/, ''));
        }

        if (browserVoice) {
            const utterance = new SpeechSynthesisUtterance("Hello, this is a preview of my voice.");
            utterance.voice = browserVoice;
            // Best effort language matching based on the voice's reported lang
            utterance.lang = browserVoice.lang || "en-US";
            window.speechSynthesis.speak(utterance);
        } else {
            console.warn("Could not find matching browser voice for preview:", voice);
        }
    }, []);

    const playLocalAIVoiceSample = useCallback(async (endpoint: string, model: string) => {
        if (!endpoint || !model) return;

        try {
            const res = await fetch('/api/localai/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint,
                    model,
                    input: "Hello, this is a test of the LocalAI voice model.",
                }),
            });

            if (!res.ok) throw new Error('Failed to generate TTS');

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.addEventListener('ended', () => URL.revokeObjectURL(url), { once: true });
            audio.addEventListener('error', () => URL.revokeObjectURL(url), { once: true });
            try {
                await audio.play();
            } catch (playError) {
                URL.revokeObjectURL(url);
                throw playError;
            }
        } catch (error) {
            console.error("LocalAI TTS preview failed:", error);
        }
    }, []);

    // Ollama endpoint (ngrok URL) - manual verify flow
    const [ollamaEndpoint, setOllamaEndpoint] = useState<string>('');
    const [ollamaAvailable, setOllamaAvailable] = useState(false);
    const [ollamaLoading, setOllamaLoading] = useState(false);
    const [ollamaVerifyError, setOllamaVerifyError] = useState<string | null>(null);
    const [ollamaHelperEnabled, setOllamaHelperEnabled] = useState<boolean>(false);
    const [ollamaSubdomain, setOllamaSubdomain] = useState<string>('');

    const handleVerifyOllama = async () => {
        const rawEndpoint = ollamaEndpoint.trim();
        const rawSubdomain = ollamaSubdomain.trim();

        if (!ollamaHelperEnabled) {
            if (!rawEndpoint) return;
        } else {
            if (!rawSubdomain) return;
        }

        let endpointToVerify = rawEndpoint;

        if (ollamaHelperEnabled) {
            let candidate = rawSubdomain;

            if (candidate && !candidate.startsWith('http://') && !candidate.startsWith('https://')) {
                if (!candidate.includes('.')) {
                    candidate = `https://${candidate}.ngrok-free.app`;
                } else {
                    candidate = `https://${candidate}`;
                }
            }

            endpointToVerify = candidate;

            if (endpointToVerify !== ollamaEndpoint) {
                setOllamaEndpoint(endpointToVerify);
            }
        }

        setOllamaLoading(true);
        setOllamaVerifyError(null);
        try {
            // Proxy through server-side route to bypass ngrok CORS/browser warning
            const res = await fetch('/api/ollama/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ endpoint: endpointToVerify }),
            });
            const data = await res.json();
            if (data.available) {
                setOllamaAvailable(true);
                // Use model names from server response (avoids client-side CORS issues)
                setOllamaModelsFromNames(data.models || [], endpointToVerify);
            } else {
                setOllamaAvailable(false);
                // Show the specific error from the proxy if available
                let errorMessage = data.error || t?.page_OllamaVerifyFail || 'Could not connect to Ollama at this endpoint.';
                if (errorMessage.includes('403')) {
                    errorMessage += ' (Wait! 403 Forbidden usually means you forgot the --host-header flag in your ngrok command)';
                }
                setOllamaVerifyError(errorMessage);
            }
        } catch {
            setOllamaAvailable(false);
            setOllamaVerifyError(t?.page_OllamaVerifyFail || 'Could not connect to Ollama at this endpoint.');
        } finally {
            setOllamaLoading(false);
        }
    };

    // InvokeAI endpoint (ngrok URL) - manual verify flow
    const [invokeaiEndpoint, setInvokeaiEndpoint] = useState<string>('');
    const [customInvokeaiAvailable, setCustomInvokeaiAvailable] = useState<boolean>(false);
    const [customInvokeaiLoading, setCustomInvokeaiLoading] = useState<boolean>(false);
    const [invokeaiVerifyError, setInvokeaiVerifyError] = useState<string | null>(null);
    const [invokeaiHelperEnabled, setInvokeaiHelperEnabled] = useState<boolean>(false);
    const [invokeaiSubdomain, setInvokeaiSubdomain] = useState<string>('');
    const [invokeaiModelNames, setInvokeaiModelNames] = useState<string[]>([]);

    const handleVerifyInvokeAI = async () => {
        const rawEndpoint = invokeaiEndpoint.trim();
        const rawSubdomain = invokeaiSubdomain.trim();

        if (!invokeaiHelperEnabled) {
            if (!rawEndpoint) return;
        } else {
            if (!rawSubdomain) return;
        }

        let endpointToVerify = rawEndpoint;

        if (invokeaiHelperEnabled) {
            let candidate = rawSubdomain;

            if (candidate && !candidate.startsWith('http://') && !candidate.startsWith('https://')) {
                if (!candidate.includes('.')) {
                    candidate = `https://${candidate}.ngrok-free.app`;
                } else {
                    candidate = `https://${candidate}`;
                }
            }

            endpointToVerify = candidate;

            if (endpointToVerify !== invokeaiEndpoint) {
                setInvokeaiEndpoint(endpointToVerify);
            }
        }

        setCustomInvokeaiLoading(true);
        setInvokeaiVerifyError(null);
        try {
            // Proxy through server-side route to bypass ngrok CORS/browser warning
            const res = await fetch('/api/invokeai/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ endpoint: endpointToVerify }),
            });
            const data = await res.json();
            if (data.available) {
                setCustomInvokeaiAvailable(true);
                setInvokeaiModelNames(Array.isArray(data.models) ? data.models : []);
            } else {
                setCustomInvokeaiAvailable(false);
                setInvokeaiModelNames([]);
                let errorMessage = data.error || 'Could not connect to InvokeAI at this endpoint.';
                if (errorMessage.includes('403')) {
                    errorMessage += ' (Wait! 403 Forbidden usually means you forgot the --host-header flag in your ngrok command)';
                }
                setInvokeaiVerifyError(errorMessage);
            }
        } catch {
            setCustomInvokeaiAvailable(false);
            setInvokeaiModelNames([]);
            setInvokeaiVerifyError('Could not connect to InvokeAI at this endpoint.');
        } finally {
            setCustomInvokeaiLoading(false);
        }
    };

    // LocalAI endpoint (ngrok URL) - manual verify flow
    const [localaiEndpoint, setLocalaiEndpoint] = useState<string>('');
    const [localaiAvailable, setLocalaiAvailable] = useState<boolean>(false);
    const [localaiLoading, setLocalaiLoading] = useState<boolean>(false);
    const [localaiVerifyError, setLocalaiVerifyError] = useState<string | null>(null);
    const [localaiHelperEnabled, setLocalaiHelperEnabled] = useState<boolean>(false);
    const [localaiSubdomain, setLocalaiSubdomain] = useState<string>('');
    const [localaiModelNames, setLocalaiModelNames] = useState<string[]>([]);


    const handleVerifyLocalAI = async () => {
        const rawEndpoint = localaiEndpoint.trim();
        const rawSubdomain = localaiSubdomain.trim();

        if (!localaiHelperEnabled) {
            if (!rawEndpoint) return;
        } else {
            if (!rawSubdomain) return;
        }

        let endpointToVerify = rawEndpoint;

        if (localaiHelperEnabled) {
            let candidate = rawSubdomain;

            if (candidate && !candidate.startsWith('http://') && !candidate.startsWith('https://')) {
                if (!candidate.includes('.')) {
                    candidate = `https://${candidate}.ngrok-free.app`;
                } else {
                    candidate = `https://${candidate}`;
                }
            }

            endpointToVerify = candidate;

            if (endpointToVerify !== localaiEndpoint) {
                setLocalaiEndpoint(endpointToVerify);
            }
        }

        setLocalaiLoading(true);
        setLocalaiVerifyError(null);
        try {
            const res = await fetch('/api/localai/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ endpoint: endpointToVerify }),
            });
            const data = await res.json();
            if (data.available) {
                setLocalaiAvailable(true);
                setLocalaiModelNames(Array.isArray(data.models) ? (data.models as string[]) : []);
                // Update TTS models in tts_models.ts
                setLocalAIModels(Array.isArray(data.models) ? (data.models as string[]) : []);
            } else {
                setLocalaiAvailable(false);
                setLocalaiModelNames([]);
                setLocalAIModels([]);
                let errorMessage = data.error || 'Could not connect to LocalAI at this endpoint.';
                if (errorMessage.includes('403')) {
                    errorMessage += ' (Wait! 403 Forbidden usually means you forgot the --host-header flag in your ngrok command)';
                }
                setLocalaiVerifyError(errorMessage);
            }
        } catch {
            setLocalaiAvailable(false);
            setLocalaiModelNames([]);
            setLocalaiVerifyError('Could not connect to LocalAI at this endpoint.');
        } finally {
            setLocalaiLoading(false);
        }
    };


    const [agentA_llm, setAgentA_llm] = useState<string>('');
    const [agentB_llm, setAgentB_llm] = useState<string>('');
    const [savedKeyStatus, setSavedKeyStatus] = useState<Record<string, boolean>>({});
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);
    const [statusError, setStatusError] = useState<string | null>(null);
    const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);
    const [showSafariWarning, setShowSafariWarning] = useState<boolean>(false);
    const [showEdgeRecommendation, setShowEdgeRecommendation] = useState<boolean>(false);
    const [initialSystemPrompt, setInitialSystemPrompt] = useState<string>(() => t?.sessionSetupForm?.startTheConversation || '');
    const [lookaheadLimit, setLookaheadLimit] = useState<number>(3);

    // Preset management state
    const [showOverwriteDialog, setShowOverwriteDialog] = useState<boolean>(false);
    const [hasExistingPreset, setHasExistingPreset] = useState<boolean>(false);
    const { toast } = useToast();

    // Collapse states for helper text
    const [collapseCardDescription, setCollapseCardDescription] = useState<boolean>(false);
    const [collapseInitialPromptDescription, setCollapseInitialPromptDescription] = useState<boolean>(false);
    const [collapseOllamaHelp, setCollapseOllamaHelp] = useState<boolean>(false);
    const [collapseInvokeAIHelp, setCollapseInvokeAIHelp] = useState<boolean>(false);

    const [openCollapsibles, setOpenCollapsibles] = useState<Record<string, boolean>>(() => ({
        'ollama-setup': false,
        'invokeai-setup': false,
        'localai-setup': false,
    }));

    const toggleCollapsible = (id: string) => {
        setOpenCollapsibles(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // const [copiedStep, setCopiedStep] = useState<string | null>(null);

    // const copyToClipboard = (text: string, stepId: string) => {
    //     navigator.clipboard.writeText(text).then(() => {
    //         setCopiedStep(stepId);
    //         setTimeout(() => setCopiedStep(null), 2000);
    //     });
    // };

    // const CopyButton = ({ text, stepId }: { text: string; stepId: string }) => (
    //     <button
    //         onClick={() => copyToClipboard(text, stepId)}
    //         className="ml-2 p-1 hover:bg-white/20 dark:hover:bg-black/20 rounded transition-all duration-200 inline-flex items-center gap-1 group active:scale-90"
    //         title="Copy to clipboard"
    //         type="button"
    //     >
    //         {copiedStep === stepId ? (
    //             <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
    //         ) : (
    //             <Copy className="h-3 w-3 text-blue-600 dark:text-blue-400 opacity-70 group-hover:opacity-100" />
    //         )}
    //     </button>
    // );

    // --- Image Generation State ---
    const [imageGenEnabled, setImageGenEnabled] = useState(false);
    const [selectedPromptLlm, setSelectedPromptLlm] = useState<string>('');
    const [imagePromptSystemMessage, setImagePromptSystemMessage] = useState<string>(t?.sessionSetupForm?.defaultImagePromptSystemMessage || 'Create a prompt to give to the image generation model based on this paragraph: {paragraph}');
    const [invokeaiSelectedModel, setInvokeaiSelectedModel] = useState<string>('');
    const [invokeaiNegativePrompt, setInvokeaiNegativePrompt] = useState<string>('');
    const [invokeaiSteps, setInvokeaiSteps] = useState<number>(20);
    const [invokeaiGuidanceScale, setInvokeaiGuidanceScale] = useState<number>(7.5);
    const [invokeaiWidth, setInvokeaiWidth] = useState<number>(512);
    const [invokeaiHeight, setInvokeaiHeight] = useState<number>(512);
    const [invokeaiSeed, setInvokeaiSeed] = useState<string>('');
    const [invokeaiScheduler, setInvokeaiScheduler] = useState<string>('dpmpp_3m_k');
    const [invokeaiClipSkip, setInvokeaiClipSkip] = useState<number>(0);
    const [invokeaiCfgRescaleMultiplier, setInvokeaiCfgRescaleMultiplier] = useState<number>(0);

    // Update quality/size when model changes
    // useEffect(() => {
    //     if (!selectedImageModelId) return;
    //     const model = AVAILABLE_IMAGE_MODELS.find(m => m.id === selectedImageModelId);
    //     if (model) {
    //         // Default to first quality/size if not set
    //         const firstQuality = model.qualities[0]?.quality || 'medium';
    //         setSelectedImageQuality(firstQuality);
    //         const firstSize = model.qualities[0]?.sizes[0]?.size || '1024x1024';
    //         setSelectedImageSize(firstSize);
    //     }
    // }, [selectedImageModelId]);

    // Update size when quality changes
    // useEffect(() => {
    //     if (!selectedImageModelId) return;

    //     const model = AVAILABLE_IMAGE_MODELS.find(m => m.id === selectedImageModelId);
    //     if (!model) return;

    //     // If no quality is selected, use the first available quality or proceed without one
    //     if (!selectedImageQuality) {
    //         // Find first defined quality or use the first quality object if all qualities are undefined
    //         const firstQuality = model.qualities.find(q => q.quality)?.quality || 
    //                            (model.qualities[0]?.sizes[0] ? 'standard' : undefined);

    //         if (firstQuality) {
    //             setSelectedImageQuality(firstQuality);
    //         }
    //         return;
    //     }

    //     // Find the quality object that matches the selected quality
    //     const qualityObj = model.qualities.find(q => q.quality === selectedImageQuality);

    //     // If we found a matching quality with sizes, update the size
    //     if (qualityObj?.sizes && qualityObj.sizes.length > 0) {
    //         setSelectedImageSize(qualityObj.sizes[0].size);
    //     } else if (model.qualities.length > 0 && model.qualities[0]?.sizes?.length > 0) {
    //         // Fallback to first available size if the selected quality has no sizes
    //         setSelectedImageSize(model.qualities[0].sizes[0].size);
    //     }
    // }, [selectedImageModelId, selectedImageQuality]);

    const openAIProviderInfo = getTTSProviderInfoById('openai');
    const googleCloudProviderInfo = getTTSProviderInfoById('google-cloud');
    const elevenLabsProviderInfo = getTTSProviderInfoById('elevenlabs');

    // const getDefaultOpenAITTSModel = () => openAIProviderInfo?.models[0];
    const getDefaultOpenAIVoices = () => openAIProviderInfo?.availableVoices || [];
    // const getDefaultOpenAIDefaultVoiceId = () => getDefaultOpenAIVoices()[0]?.id ?? null;

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



        if (providerId === 'localai') {
            agentSettingsSetter(prev => ({
                ...prev,
                provider: 'localai',
                // LocalAI TTS is model-only in this UI flow; do not carry browser voice IDs.
                voice: null,
                selectedTtsModelId: prev.selectedTtsModelId,
                ttsApiModelId: prev.ttsApiModelId,
            }));
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
            voice: getNextSelectedVoiceId(prev.voice, voices),
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

        const unsubscribe = onVoicesLoaded(handleVoicesLoaded);
        return unsubscribe;
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

    // Check browser type and show appropriate warnings for browser TTS
    useEffect(() => {
        const isBrowserTTSSelected = agentATTSSettings.provider === 'browser' || agentBTTSSettings.provider === 'browser';
        const isSafari = isSafariBrowser();
        // const isEdge = isEdgeBrowser();
        const isChrome = isChromeBrowser();
        const isFirefox = isFirefoxBrowser();
        const isOpera = isOperaBrowser();

        // Show Safari warning if using Safari with browser TTS
        setShowSafariWarning(isBrowserTTSSelected && isSafari);

        // Show Edge recommendation if using Chrome/Firefox/Opera with browser TTS
        setShowEdgeRecommendation(isBrowserTTSSelected && (isChrome || isFirefox || isOpera));
    }, [agentATTSSettings.provider, agentBTTSSettings.provider]);

    const handleStartClick = () => {
        const agentAOption = getLLMInfoById(agentA_llm);
        const agentBOption = getLLMInfoById(agentB_llm);

        if (!agentAOption || !agentBOption) {
            alert("Please select a model for both Agent A and Agent B.");
            return;
        }

        // Check API keys (skip for Ollama which doesn't need them)
        const agentARequiredLLMKey = agentAOption.apiKeySecretName;
        const agentBRequiredLLMKey = agentBOption.apiKeySecretName;
        const isAgentALLMKeyMissing = agentAOption.provider !== 'Ollama' && !savedKeyStatus[agentARequiredLLMKey];
        const isAgentBLLMKeyMissing = agentBOption.provider !== 'Ollama' && !savedKeyStatus[agentBRequiredLLMKey];

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
            if (!customInvokeaiAvailable || !invokeaiEndpoint.trim()) {
                alert('Please verify your InvokeAI endpoint above before enabling image generation.');
                return;
            }

            if (!invokeaiSelectedModel) {
                alert('Please select an InvokeAI model.');
                return;
            }

            if (!selectedPromptLlm) {
                alert('Please select a prompt LLM for image generation.');
                return;
            }

            if (!imagePromptSystemMessage || imagePromptSystemMessage.trim() === '') {
                alert('Please provide a system prompt for the image prompt LLM.');
                return;
            }

            // Check if prompt LLM requires API key (skip for Ollama)
            const promptLLMInfo = getLLMInfoById(selectedPromptLlm);
            if (promptLLMInfo && promptLLMInfo.provider !== 'Ollama') {
                const promptLLMKey = promptLLMInfo.apiKeySecretName;
                if (!savedKeyStatus[promptLLMKey]) {
                    alert(`Missing required API key for prompt LLM (${promptLLMInfo.provider}). Please add it in Settings.`);
                    return;
                }
            }

            imageGenSettings = {
                enabled: true,
                provider: "invokeai", // Signal to backend that InvokeAI (client-side) handles image generation
                invokeaiEndpoint: invokeaiEndpoint,
                invokeaiModel: invokeaiSelectedModel,
                negativePrompt: invokeaiNegativePrompt.trim() || undefined,
                steps: invokeaiSteps,
                guidanceScale: invokeaiGuidanceScale,
                width: invokeaiWidth,
                height: invokeaiHeight,
                seed: invokeaiSeed.trim() ? Number(invokeaiSeed.trim()) : undefined,
                scheduler: invokeaiScheduler.trim() || undefined,
                clipSkip: invokeaiClipSkip,
                cfgRescaleMultiplier: invokeaiCfgRescaleMultiplier,
                promptLlm: selectedPromptLlm,
                promptSystemMessage: imagePromptSystemMessage,
            };
        }

        // ***FIX: Define a type-safe constant for the disabled state***
        const disabledTtsSettings: AgentTTSSettings = { provider: 'browser', voice: null, selectedTtsModelId: undefined, ttsApiModelId: undefined };

        const sessionAgentATTSSettings = ttsEnabled ? agentATTSSettings : disabledTtsSettings;
        const sessionAgentBTTSSettings = ttsEnabled ? agentBTTSSettings : disabledTtsSettings;

        if (ttsEnabled) {
            const isAgentAUsingLocalAI = sessionAgentATTSSettings.provider === 'localai';
            const isAgentBUsingLocalAI = sessionAgentBTTSSettings.provider === 'localai';

            if (!isAgentAUsingLocalAI && !sessionAgentATTSSettings.voice) {
                alert(`Please select a TTS voice for Agent A or disable TTS.`);
                return;
            }
            if (!isAgentBUsingLocalAI && !sessionAgentBTTSSettings.voice) {
                alert(`Please select a TTS voice for Agent B or disable TTS.`);
                return;
            }

            const needsLocalAI = sessionAgentATTSSettings.provider === 'localai' || sessionAgentBTTSSettings.provider === 'localai';
            if (needsLocalAI) {
                if (!localaiAvailable || !localaiEndpoint.trim()) {
                    alert('Please verify your LocalAI endpoint above before using LocalAI TTS.');
                    return;
                }

                const checkLocalAISettings = (settings: AgentTTSSettings, agentLabel: string) => {
                    if (settings.provider !== 'localai') return true;
                    if (!settings.selectedTtsModelId || !settings.selectedTtsModelId.trim()) {
                        alert(`Please select a LocalAI model for Agent ${agentLabel}.`);
                        return false;
                    }
                    return true;
                };

                if (!checkLocalAISettings(sessionAgentATTSSettings, 'A')) return;
                if (!checkLocalAISettings(sessionAgentBTTSSettings, 'B')) return;
            }
        }

        onStartSession({
            agentA_llm,
            agentB_llm,
            ttsEnabled,
            agentA_tts: sessionAgentATTSSettings,
            agentB_tts: sessionAgentBTTSSettings,
            initialSystemPrompt,
            ollamaEndpoint: ollamaEndpoint.trim() || undefined,
            localaiEndpoint: localaiEndpoint.trim() || undefined,
            imageGenSettings,
            lookaheadLimit,
        });
    };

    const handleTtsToggle = (checked: boolean | 'indeterminate') => {
        setTtsEnabled(Boolean(checked));
    };

    // const handleTTSProviderChange = (agent: 'A' | 'B', newProviderId: TTSProviderOptionId) => {
    //     const setter = agent === 'A' ? setAgentATTSSettings : setAgentBTTSSettings;
    //     const providerInfo = getTTSProviderInfoById(newProviderId as TTSProviderInfo['id']);
    //     const defaultModelForProvider = providerInfo?.models[0];

    //     setter(prev => ({
    //         ...prev,
    //         provider: newProviderId,
    //         selectedTtsModelId: defaultModelForProvider?.id,
    //         ttsApiModelId: defaultModelForProvider?.apiModelId,
    //         voice: null,
    //     }));
    // };

    // const handleTTSModelChange = (agent: 'A' | 'B', appTtsModelId: string) => {
    //     const setter = agent === 'A' ? setAgentATTSSettings : setAgentBTTSSettings;
    //     const currentProviderId = agent === 'A' ? agentATTSSettings.provider : agentBTTSSettings.provider;
    //     const providerInfo = getTTSProviderInfoById(currentProviderId as TTSProviderInfo['id']);
    //     const selectedModelDetail = providerInfo?.models.find(m => m.id === appTtsModelId);

    //     setter(prev => ({
    //         ...prev,
    //         selectedTtsModelId: appTtsModelId,
    //         ttsApiModelId: selectedModelDetail?.apiModelId,
    //         voice: null,
    //     }));
    // };

    const handleExternalVoiceChange = (agent: 'A' | 'B', voiceId: string) => {
        const setter = agent === 'A' ? setAgentATTSSettings : setAgentBTTSSettings;
        setter(prev => ({ ...prev, voice: voiceId }));
    };

    const handleTTSProviderChange = (agent: 'A' | 'B', newProviderId: TTSProviderOptionId) => {
        const setter = agent === 'A' ? setAgentATTSSettings : setAgentBTTSSettings;

        if (newProviderId === 'localai') {
            setter(prev => ({
                ...prev,
                provider: 'localai',
                selectedTtsModelId: prev.selectedTtsModelId,
                ttsApiModelId: prev.ttsApiModelId,
                // LocalAI currently has no selectable voice in the session UI.
                voice: null,
            }));
            return;
        }

        setter(prev => ({
            ...prev,
            provider: newProviderId,
        }));
    };

    const handleLocalAIModelChange = (agent: 'A' | 'B', modelName: string) => {
        const setter = agent === 'A' ? setAgentATTSSettings : setAgentBTTSSettings;
        setter(prev => ({
            ...prev,
            provider: 'localai',
            selectedTtsModelId: modelName,
            ttsApiModelId: modelName,
        }));
    };

    // Preset management functions
    const handleSavePreset = async () => {
        if (!user) {
            toast({
                title: "Error",
                description: "You must be signed in to save a preset",
            });
            return;
        }

        // Check if preset already exists
        if (hasExistingPreset) {
            setShowOverwriteDialog(true);
            return;
        }

        await savePresetToDatabase();
    };

    const savePresetToDatabase = async () => {
        if (!user) return;

        try {
            const preset: SessionPreset = {
                agentA_llm,
                agentB_llm,
                ttsEnabled,
                agentA_tts: agentATTSSettings,
                agentB_tts: agentBTTSSettings,
                initialSystemPrompt,
                localaiEndpoint: localaiEndpoint.trim() || undefined,
                lookaheadLimit,
                imageGenSettings: imageGenEnabled ? {
                    enabled: true,
                    provider: "invokeai", // Signal to backend that InvokeAI (client-side) handles image generation
                    invokeaiEndpoint: invokeaiEndpoint,
                    invokeaiModel: invokeaiSelectedModel,
                    negativePrompt: invokeaiNegativePrompt.trim() || undefined,
                    steps: invokeaiSteps,
                    guidanceScale: invokeaiGuidanceScale,
                    width: invokeaiWidth,
                    height: invokeaiHeight,
                    seed: invokeaiSeed.trim() ? Number(invokeaiSeed.trim()) : undefined,
                    scheduler: invokeaiScheduler.trim() || undefined,
                    clipSkip: invokeaiClipSkip,
                    cfgRescaleMultiplier: invokeaiCfgRescaleMultiplier,
                    promptLlm: selectedPromptLlm,
                    promptSystemMessage: imagePromptSystemMessage,
                } : undefined,
                collapseStates: {
                    cardDescription: collapseCardDescription,
                    initialPromptDescription: collapseInitialPromptDescription,
                    ollamaHelp: collapseOllamaHelp,
                    invokeAIHelp: collapseInvokeAIHelp,
                },
            };

            await saveSessionPreset(user.uid, preset);
            setHasExistingPreset(true);
            setShowOverwriteDialog(false);

            toast({
                title: t?.sessionSetupForm?.presetSaved || "Preset saved",
                description: "Your session configuration has been saved",
            });
        } catch (error) {
            console.error('Error saving preset:', error);
            toast({
                title: "Error",
                description: "Failed to save preset",
            });
        }
    };

    const handleLoadPreset = async () => {
        if (!user) {
            toast({
                title: "Error",
                description: "You must be signed in to load a preset",
            });
            return;
        }

        try {
            const preset = await loadSessionPreset(user.uid);

            if (!preset) {
                toast({
                    title: t?.sessionSetupForm?.noPresetFound || "No preset found",
                    description: "You haven't saved a preset yet",
                });
                return;
            }

            // Load the preset values
            setAgentA_llm(preset.agentA_llm);
            setAgentB_llm(preset.agentB_llm);
            setTtsEnabled(preset.ttsEnabled);
            setAgentATTSSettings(preset.agentA_tts as AgentTTSSettings);
            setAgentBTTSSettings(preset.agentB_tts as AgentTTSSettings);
            setInitialSystemPrompt(preset.initialSystemPrompt);
            if (typeof (preset as unknown as { lookaheadLimit?: number }).lookaheadLimit === 'number') {
                setLookaheadLimit((preset as unknown as { lookaheadLimit: number }).lookaheadLimit);
            }
            if (typeof (preset as unknown as { localaiEndpoint?: unknown }).localaiEndpoint === 'string') {
                setLocalaiEndpoint((preset as unknown as { localaiEndpoint: string }).localaiEndpoint);
            }

            // Load InvokeAI image generation settings if they exist
            if (preset.imageGenSettings?.enabled) {
                setImageGenEnabled(true);
                setInvokeaiEndpoint(preset.imageGenSettings.invokeaiEndpoint);
                setInvokeaiSelectedModel(preset.imageGenSettings.invokeaiModel || '');
                setInvokeaiNegativePrompt(preset.imageGenSettings.negativePrompt || '');
                setInvokeaiSteps(preset.imageGenSettings.steps ?? 20);
                setInvokeaiGuidanceScale(preset.imageGenSettings.guidanceScale ?? 7.5);
                setInvokeaiWidth(preset.imageGenSettings.width ?? 512);
                setInvokeaiHeight(preset.imageGenSettings.height ?? 512);
                const loadedSeed = preset.imageGenSettings.seed;
                setInvokeaiSeed(typeof loadedSeed === 'number' ? String(loadedSeed) : '');
                setInvokeaiScheduler(preset.imageGenSettings.scheduler ?? 'dpmpp_3m_k');
                setInvokeaiClipSkip(preset.imageGenSettings.clipSkip ?? 0);
                setInvokeaiCfgRescaleMultiplier(preset.imageGenSettings.cfgRescaleMultiplier ?? 0);
                setSelectedPromptLlm(preset.imageGenSettings.promptLlm || '');
                setImagePromptSystemMessage(preset.imageGenSettings.promptSystemMessage || 'Create a prompt to give to the image generation model based on this paragraph: {paragraph}');
            } else {
                setImageGenEnabled(false);
            }

            // Load collapse states if they exist
            if (preset.collapseStates) {
                setCollapseCardDescription(preset.collapseStates.cardDescription ?? false);
                setCollapseInitialPromptDescription(preset.collapseStates.initialPromptDescription ?? false);
                setCollapseOllamaHelp(preset.collapseStates.ollamaHelp ?? false);
                setCollapseInvokeAIHelp((preset.collapseStates as { invokeAIHelp?: boolean }).invokeAIHelp ?? false);
            }

            toast({
                title: t?.sessionSetupForm?.presetLoaded || "Preset loaded",
                description: "Your saved configuration has been loaded",
            });
        } catch (error) {
            console.error('Error loading preset:', error);
            toast({
                title: "Error",
                description: t?.sessionSetupForm?.presetLoadFailed || "Failed to load preset",
            });
        }
    };

    // Check if user has an existing preset on mount
    useEffect(() => {
        const checkForPreset = async () => {
            if (user) {
                try {
                    const preset = await loadSessionPreset(user.uid);
                    setHasExistingPreset(preset !== null);
                } catch (error) {
                    console.error('Error checking for preset:', error);
                }
            }
        };
        checkForPreset();
    }, [user]);

    // const isTTSProviderDisabled = (providerId: TTSProviderInfo['id']): boolean => {
    //     const providerInfo = getTTSProviderInfoById(providerId);
    //     if (providerInfo?.requiresOwnKey && providerInfo.apiKeyId) {
    //         return isLoadingStatus || !savedKeyStatus[providerInfo.apiKeyId];
    //     }
    //     if (providerId === 'openai') {
    //         return isLoadingStatus || !savedKeyStatus['openai'];
    //     }
    //     return false;
    // };

    let isStartDisabled = isLoading || isLoadingStatus || !agentA_llm || !agentB_llm || !user;

    if (!isStartDisabled && ttsEnabled) {
        const checkAgentTTSValidity = (settings: AgentTTSSettings): boolean => {

            if (settings.provider === 'localai') {
                if (!settings.selectedTtsModelId || !settings.selectedTtsModelId.trim()) return true;
                return false;
            }

            if (!settings.selectedTtsModelId) return true;
            if (!isTTSModelLanguageSupported(settings.selectedTtsModelId, language.code)) return true;
            if (!settings.voice) return true;
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

        return (
            <div className="space-y-3 p-4 border rounded-md bg-background/50 text-center">
                <h3 className="font-semibold text-center mb-3">Agent {agentIdentifier} TTS</h3>

                <div className="space-y-2">
                    <Label htmlFor={`agent-${agentIdentifierLowerCase}-tts-provider`} className="block text-center">
                        {t?.sessionSetupForm?.provider || 'Provider'}
                    </Label>
                    <Select
                        value={currentAgentTTSSettings.provider}
                        onValueChange={(value: TTSProviderOptionId) => handleTTSProviderChange(agentIdentifier, value)}
                        disabled={!user || isLoadingStatus}
                    >
                        <SelectTrigger
                            id={`agent-${agentIdentifierLowerCase}-tts-provider`}
                            className="w-full max-w-md mx-auto relative [&>span]:mx-auto [&>span]:text-center [&>svg]:absolute [&>svg]:right-3"
                        >
                            <SelectValue placeholder={t?.sessionSetupForm?.selectProvider || 'Select provider'} />
                        </SelectTrigger>
                        <SelectContent className="liquid-glass-panel">

                            <SelectItem value="browser" className="justify-center">
                                <div className="w-full text-center">Web Speech API</div>
                            </SelectItem>
                            <SelectItem value="localai" className="justify-center">
                                <div className="w-full text-center">LocalAI</div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {currentAgentTTSSettings.provider === 'localai' && (
                    <div className="space-y-2">
                        <Label className="block text-center">LocalAI Model</Label>
                        <div className="flex items-center gap-2 max-w-md mx-auto">
                            <Select
                                value={currentAgentTTSSettings.selectedTtsModelId || ''}
                                onValueChange={(value) => handleLocalAIModelChange(agentIdentifier, value)}
                                disabled={!user || !localaiAvailable || localaiModelNames.length === 0}
                            >
                                <SelectTrigger className="flex-1 relative [&>span]:mx-auto [&>span]:text-center [&>svg]:absolute [&>svg]:right-3">
                                    <SelectValue placeholder={localaiAvailable ? 'Select model' : 'Verify LocalAI first'} />
                                </SelectTrigger>
                                <SelectContent className="max-h-60 liquid-glass-panel">
                                    {localaiModelNames.length > 0 ? (
                                        localaiModelNames.map((name) => (
                                            <SelectItem key={name} value={name} className="justify-center">
                                                <div className="w-full text-center">{name}</div>
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="__no_models" disabled className="justify-center">
                                            <div className="w-full text-center">No models detected</div>
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => playLocalAIVoiceSample(localaiEndpoint, currentAgentTTSSettings.selectedTtsModelId || '')}
                                disabled={!localaiAvailable || !currentAgentTTSSettings.selectedTtsModelId}
                                title="Play Sample"
                                className="flex-shrink-0"
                            >
                                <Play className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {currentAgentTTSSettings.provider === 'browser' && currentAgentVoices.length > 0 && (
                    <div className="space-y-2">
                        <Label htmlFor={`agent-${agentIdentifierLowerCase}-voice`} className="block text-center">{t?.sessionSetupForm?.voice}</Label>
                        <div className="flex items-center gap-2 max-w-md mx-auto">
                            <Select
                                value={currentAgentTTSSettings.voice || ''}
                                onValueChange={(value) => handleExternalVoiceChange(agentIdentifier, value)}
                                disabled={!user || currentAgentVoices.length === 0}
                            >
                                <SelectTrigger
                                    id={`agent-${agentIdentifierLowerCase}-voice`}
                                    className="flex-1 relative [&>span]:mx-auto [&>span]:text-left [&>span]:truncate [&>span]:px-6 [&>svg]:absolute [&>svg]:right-3"
                                >
                                    <SelectValue placeholder={t?.sessionSetupForm?.selectVoice}>
                                        {currentAgentTTSSettings.voice && currentAgentVoices.find(v => v.id === currentAgentTTSSettings.voice)?.name}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="max-h-60 w-[var(--radix-select-trigger-width)] liquid-glass-panel">
                                    {currentAgentVoices.map(v => (
                                        <SelectItem key={v.id} value={v.id} className="justify-center w-full">
                                            <div className="w-full text-center text-sm py-1">
                                                {v.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const v = currentAgentVoices.find(v => v.id === currentAgentTTSSettings.voice);
                                    if (v) playVoiceSample(v);
                                }}
                                disabled={!currentAgentTTSSettings.voice}
                                title="Play Sample"
                                className="flex-shrink-0"
                            >
                                <Play className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    /* COMMENTED OUT: Full TTS configuration with provider and model selection
     * Uncomment this section to restore provider and model selection dropdowns
     * 
    const renderTTSConfigForAgentFull = (
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
            <div className="space-y-3 p-4 border rounded-md liquid-glass-themed bg-theme-primary/10 dark:bg-card/50">
                <h3 className="font-semibold text-center mb-3">Agent {agentIdentifier} TTS</h3>
                <div className="space-y-2">
                    <Label htmlFor={`agent-${agentIdentifierLowerCase}-tts-provider`}>{t?.sessionSetupForm?.provider}</Label>
                    <Select
                        value={currentAgentTTSSettings.provider}
                        onValueChange={(value: TTSProviderOptionId) => handleTTSProviderChange(agentIdentifier, value)}
                        disabled={!user || isLoadingStatus}
                    >
                        <SelectTrigger id={`agent-${agentIdentifierLowerCase}-tts-provider`} className="w-full relative [&>span]:mx-auto [&>span]:text-center [&>svg]:absolute [&>svg]:right-3">
                            <SelectValue placeholder={t?.sessionSetupForm?.selectProvider} />
                        </SelectTrigger>
                        <SelectContent className="liquid-glass-panel">
                            <SelectItem value="none">{t?.ttsNoneOption || 'None'}</SelectItem>
                            {AVAILABLE_TTS_PROVIDERS.map(p => {
                                const isDisabled = isTTSProviderDisabled(p.id);
                                return (
                                    <SelectItem key={p.id} value={p.id} disabled={isDisabled} className="justify-center">
                                        <div className="w-full text-center">
                                            {p.name}
                                            {isDisabled && ' (Key Missing)'}
                                        </div>
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
                                <SelectTrigger id={`agent-${agentIdentifierLowerCase}-tts-model`} className="w-full relative [&>span]:mx-auto [&>span]:text-center [&>svg]:absolute [&>svg]:right-3">
                                    <SelectValue placeholder={t?.sessionSetupForm?.selectTtsProviderModel?.replace('{providerName}', selectedProviderInfo.name)} />
                                </SelectTrigger>
                                <SelectContent className="liquid-glass-panel">
                                    {selectedProviderInfo.models.map(m => {
                                        const supportsLanguage = isTTSModelLanguageSupported(m.id, language.code);
                                        const isDisabled = !supportsLanguage;
                                        return (
                                            <SelectItem
                                                key={m.id}
                                                value={m.id}
                                                disabled={isDisabled}
                                                className="pr-2 py-2 justify-center"
                                            >
                                                <div className="w-full flex flex-col items-center justify-center text-center">
                                                    <div className="flex items-center space-x-1.5 mr-2 min-w-0 flex-1">
                                                        {supportsLanguage ? (
                                                            <Check className="h-3 w-3 text-green-700 dark:text-green-300 flex-shrink-0" />
                                                        ) : (
                                                            <X className="h-3 w-3 text-red-700 dark:text-red-300 flex-shrink-0" />
                                                        )}
                                                        <span className="truncate font-medium" style={{ maxWidth: '16rem' }}>{m.name}</span>
                                                        {!supportsLanguage && <span className="text-xs text-muted-foreground flex-shrink-0">(No {language.nativeName})</span>}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground max-w-full truncate" title={m.description}>
                                                        ({typeof m.pricingText === 'function' ? (t ? m.pricingText(t) : 'Loading...') : m.pricingText})
                                                    </div>
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
                                    <SelectTrigger id={`agent-${agentIdentifierLowerCase}-voice`} className="w-full relative [&>span]:mx-auto [&>span]:text-center [&>svg]:absolute [&>svg]:right-3">
                                        <SelectValue placeholder={currentAgentVoices.length > 0 ? t?.sessionSetupForm?.selectVoice : t?.sessionSetupForm?.noVoicesFor?.replace('{languageName}', language.nativeName)} />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60 liquid-glass-panel">
                                        {currentAgentVoices.map(v => {
                                            const providerId = currentAgentTTSSettings.provider;
                                            const showGender = providerId !== 'google-cloud' && providerId !== 'google-gemini' && providerId !== 'browser';
                                            return (
                                                <SelectItem key={v.id} value={v.id} className="justify-center pl-0">
                                                    <div className="w-full text-center">
                                                        {v.name} {showGender && v.gender ? `(${v.gender.charAt(0)})` : ''}
                                                        {v.status === 'Preview' ? <span className="text-xs text-orange-500 ml-1">({t?.page_BadgePreview || 'Preview'})</span> : ''}
                                                        {v.notes ? <span className="text-xs text-muted-foreground ml-1">({v.notes})</span> : ''}
                                                    </div>
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
    */

    return (
        <>
            <Card className="w-full max-w-2xl liquid-glass-themed dark:bg-card/60">
                <CardHeader className="text-center">
                    {translationLoading || !t ? (
                        <CardTitle>...</CardTitle>
                    ) : (
                        <CardTitle>{t.sessionSetupForm.title}</CardTitle>
                    )}
                    {t?.sessionSetupForm && t.sessionSetupForm.description && (
                        <div className="space-y-1 flex flex-col items-center">
                            <button
                                onClick={() => setCollapseCardDescription(!collapseCardDescription)}
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                aria-expanded={!collapseCardDescription}
                            >
                                {collapseCardDescription ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                                <span className="text-xs">Help</span>
                            </button>
                            {!collapseCardDescription && (
                                <CardDescription>{t.sessionSetupForm.description}</CardDescription>
                            )}
                        </div>
                    )}

                    {/* Ollama Setup Instructions */}
                    <Collapsible
                        open={openCollapsibles['ollama-setup'] || false}
                        onOpenChange={() => toggleCollapsible('ollama-setup')}
                        className="liquid-glass-themed border border-blue-500/50 rounded-lg p-4 mt-4"
                    >
                        <CollapsibleTrigger className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
                            <div className="flex justify-center pt-1 relative group cursor-pointer">
                                <div className="relative">
                                    <div className="absolute right-full mr-2 translate-y-px">
                                        <div className="relative w-6 h-6 shrink-0 mix-blend-multiply dark:mix-blend-screen">
                                            <Image
                                                src="/ollama.svg"
                                                alt="Ollama Logo"
                                                fill
                                                className="object-contain dark:invert"
                                            />
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-base whitespace-nowrap">{t?.page_OllamaSetupTitle || 'Ollama Setup'}</h3>
                                </div>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-blue-500/70 group-hover:text-blue-500 transition-colors">
                                    {openCollapsibles['ollama-setup'] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                </div>
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="space-y-2 mt-4">

                                <div className="text-sm space-y-1 mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                                    <SetupInstructions type="ollama" />
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className="flex gap-2 w-full max-w-md">
                                            {ollamaHelperEnabled ? (
                                                <div className="flex-1 flex items-stretch rounded-md liquid-glass-input overflow-hidden">
                                                    <span className="px-2 py-1.5 text-xs bg-muted text-muted-foreground font-medium border-r border-border whitespace-nowrap">
                                                        https://
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={ollamaSubdomain}
                                                        onChange={(e) => {
                                                            setOllamaSubdomain(e.target.value);
                                                            if (ollamaAvailable) {
                                                                setOllamaAvailable(false);
                                                            }
                                                            setOllamaVerifyError(null);
                                                        }}
                                                        placeholder="e.g. abc123"
                                                        className="flex-1 px-2 py-1.5 text-sm bg-transparent outline-none"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                handleVerifyOllama();
                                                            }
                                                        }}
                                                    />
                                                    <span className="px-2 py-1.5 text-xs bg-muted text-muted-foreground font-medium border-l border-border whitespace-nowrap">
                                                        .ngrok-free.app
                                                    </span>
                                                </div>
                                            ) : (
                                                <input
                                                    type="url"
                                                    value={ollamaEndpoint}
                                                    onChange={(e) => {
                                                        setOllamaEndpoint(e.target.value);
                                                        if (ollamaAvailable) {
                                                            setOllamaAvailable(false);
                                                        }
                                                        setOllamaVerifyError(null);
                                                    }}
                                                    placeholder={t?.page_OllamaEndpointPlaceholder || 'e.g. https://abc123.ngrok-free.app'}
                                                    className="flex-1 px-3 py-1.5 text-sm rounded-md liquid-glass-input text-center"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleVerifyOllama();
                                                        }
                                                    }}
                                                />
                                            )}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleVerifyOllama}
                                                disabled={
                                                    ollamaLoading ||
                                                    (!ollamaHelperEnabled
                                                        ? !ollamaEndpoint.trim()
                                                        : !ollamaSubdomain.trim())
                                                }
                                                className="liquid-glass-button-primary h-auto py-1.5"
                                            >
                                                {ollamaLoading ? (t?.page_OllamaVerifying || 'Verifying...') : (t?.page_OllamaVerify || 'Verify')}
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 w-full max-w-md">
                                            <input
                                                id="ollama-helper-toggle"
                                                type="checkbox"
                                                checked={ollamaHelperEnabled}
                                                onChange={(e) => setOllamaHelperEnabled(e.target.checked)}
                                                className="h-3 w-3"
                                            />
                                            <label
                                                htmlFor="ollama-helper-toggle"
                                                className="text-xs text-muted-foreground cursor-pointer"
                                            >
                                                Add <span className="text-blue-600 dark:text-blue-400 font-medium">https://</span> and{' '}
                                                <span className="text-blue-600 dark:text-blue-400 font-medium">.ngrok-free.app</span>
                                            </label>
                                        </div>
                                        {ollamaAvailable && (
                                            <p className="text-sm text-green-600 dark:text-green-400">✓ {t?.page_OllamaVerifySuccess || 'Ollama connected!'}</p>
                                        )}
                                        {ollamaVerifyError && (
                                            <p className="text-xs text-red-600 dark:text-red-400 max-w-xs text-center">{ollamaVerifyError}</p>
                                        )}
                                    </div>
                                    {/* <p className="text-center">{t.page_OllamaStep4}</p> */}
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

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
                        {/* Explanation Notes - Only visible on mobile/touch devices */}
                        <div className="md:hidden space-y-1">
                            {t && (
                                <p className="text-xs text-muted-foreground px-1 pt-1 flex items-center">
                                    <Check className="h-3 w-3 text-green-700 dark:text-green-300 mr-1 flex-shrink-0" />
                                    <X className="h-3 w-3 text-red-700 dark:text-red-300 mr-1 flex-shrink-0" />
                                    {t.sessionSetupForm.languageSupportNote.replace('{languageName}', language.nativeName)}
                                </p>
                            )}
                            {ANY_MODEL_USES_REASONING && (
                                <p className="text-xs text-muted-foreground px-1 pt-1 flex items-center">
                                    <Info className="h-3 w-3 text-blue-500 mr-1 flex-shrink-0" />
                                    {t && t.sessionSetupForm.reasoningNote}
                                </p>
                            )}
                            {ANY_OPENAI_REQUIRES_ORG_VERIFICATION && (
                                <p className="text-xs text-muted-foreground px-1 pt-1 flex items-center">
                                    <AlertTriangle className="h-3 w-3 text-yellow-500 mr-1 flex-shrink-0" />
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
                            {ANY_MODEL_HAS_FREE_TIER && (
                                <p className="text-xs text-muted-foreground px-1 pt-1 flex items-center">
                                    <Info className="h-3.5 w-3.5 text-muted-foreground mr-1 flex-shrink-0" />
                                    {t && t.sessionSetupForm.freeTierNote}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* TTS Configuration Section */}
                    <hr className="my-6" />
                    <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-2">
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

                        {/* LocalAI Setup Instructions */}
                        {ttsEnabled && (
                            <Collapsible
                                open={openCollapsibles['localai-setup'] || false}
                                onOpenChange={() => toggleCollapsible('localai-setup')}
                                className="liquid-glass-themed border border-blue-500/50 rounded-lg p-4 mt-4 mb-4"
                            >
                                <CollapsibleTrigger className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
                                    <div className="flex justify-center pt-1 relative group cursor-pointer">
                                        <div className="relative">
                                            <div className="absolute right-full mr-2 translate-y-px">
                                                <div className="relative w-6 h-6 shrink-0">
                                                    <Image
                                                        src="/localai.svg"
                                                        alt="LocalAI Logo"
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            </div>
                                            <h3 className="font-semibold text-base whitespace-nowrap">LocalAI Setup</h3>
                                        </div>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-blue-500/70 group-hover:text-blue-500 transition-colors">
                                            {openCollapsibles['localai-setup'] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                        </div>
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className="space-y-2 mt-4">
                                        <div className="text-sm space-y-1 mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                                            <SetupInstructions type="localai" />
                                            <div className="flex flex-col items-center space-y-2">
                                                <div className="flex gap-2 w-full max-w-md">
                                                    {localaiHelperEnabled ? (
                                                        <div className="flex-1 flex items-stretch rounded-md liquid-glass-input overflow-hidden">
                                                            <span className="px-2 py-1.5 text-xs bg-muted text-muted-foreground font-medium border-r border-border whitespace-nowrap">
                                                                https://
                                                            </span>
                                                            <input
                                                                type="text"
                                                                value={localaiSubdomain}
                                                                onChange={(e) => {
                                                                    setLocalaiSubdomain(e.target.value);
                                                                    if (localaiAvailable) setLocalaiAvailable(false);
                                                                    setLocalaiVerifyError(null);
                                                                }}
                                                                placeholder="e.g. abc123"
                                                                className="flex-1 px-2 py-1.5 text-sm bg-transparent outline-none"
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                        handleVerifyLocalAI();
                                                                    }
                                                                }}
                                                            />
                                                            <span className="px-2 py-1.5 text-xs bg-muted text-muted-foreground font-medium border-l border-border whitespace-nowrap">
                                                                .ngrok-free.app
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <input
                                                            type="url"
                                                            value={localaiEndpoint}
                                                            onChange={(e) => {
                                                                setLocalaiEndpoint(e.target.value);
                                                                if (localaiAvailable) setLocalaiAvailable(false);
                                                                setLocalaiVerifyError(null);
                                                            }}
                                                            placeholder="e.g. https://abc123.ngrok-free.app"
                                                            className="flex-1 px-3 py-1.5 text-sm rounded-md liquid-glass-input text-center"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    handleVerifyLocalAI();
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleVerifyLocalAI}
                                                        disabled={
                                                            localaiLoading ||
                                                            (!localaiHelperEnabled
                                                                ? !localaiEndpoint.trim()
                                                                : !localaiSubdomain.trim())
                                                        }
                                                        className="liquid-glass-button-primary h-auto py-1.5"
                                                    >
                                                        {localaiLoading ? 'Verifying...' : 'Verify'}
                                                    </Button>
                                                </div>
                                                <div className="flex items-center justify-center gap-2 w-full max-w-md">
                                                    <input
                                                        id="localai-helper-toggle"
                                                        type="checkbox"
                                                        checked={localaiHelperEnabled}
                                                        onChange={(e) => setLocalaiHelperEnabled(e.target.checked)}
                                                        className="h-3 w-3"
                                                    />
                                                    <label
                                                        htmlFor="localai-helper-toggle"
                                                        className="text-xs text-muted-foreground cursor-pointer"
                                                    >
                                                        Add <span className="text-blue-600 dark:text-blue-400 font-medium">https://</span> and{' '}
                                                        <span className="text-blue-600 dark:text-blue-400 font-medium">.ngrok-free.app</span>
                                                    </label>
                                                </div>
                                                {localaiAvailable && (
                                                    <p className="text-sm text-green-600 dark:text-green-400">✓ LocalAI connected!</p>
                                                )}
                                                {localaiVerifyError && (
                                                    <p className="text-xs text-red-600 dark:text-red-400 max-w-xs text-center">{localaiVerifyError}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        )}

                        {/* Browser Voice Quality Info */}
                        {ttsEnabled && (showSafariWarning || showEdgeRecommendation) && (
                            <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-400 p-4 rounded-md flex flex-col items-center text-center">
                                <div className="flex flex-col items-center">
                                    <div className="relative mb-1">
                                        <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2">
                                            <Info className="h-4 w-4 text-blue-400" />
                                        </div>
                                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                            {t?.sessionSetupForm?.browserVoiceRecommendationTitle || 'Browser Voice Quality'}
                                        </p>
                                    </div>
                                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 max-w-md">
                                        {t?.sessionSetupForm?.browserVoiceRecommendationMessage || 'Microsoft Edge offers the best voice selection for Web Speech API. Chrome, Firefox, and Opera have good options, while Safari has more limited voice selection.'}
                                    </p>
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
                    <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-2">
                            <Checkbox
                                id="image-gen-enabled-checkbox"
                                checked={imageGenEnabled}
                                onCheckedChange={checked => setImageGenEnabled(Boolean(checked))}
                                disabled={!user}
                                aria-describedby="image-gen-checkbox-description"
                            />
                            <Label
                                htmlFor="image-gen-enabled-checkbox"
                                className="text-base font-medium"
                            >
                                {t?.sessionSetupForm?.enableImageGen || 'Enable Image Generation'}
                            </Label>
                        </div>
                        <div id="image-gen-checkbox-description" className="sr-only">
                            Check this box to enable image generation for each paragraph. An image will be generated and shown for each paragraph in agent messages.
                        </div>
                        {imageGenEnabled && (
                            <div className="space-y-4 pt-4" role="group" aria-labelledby="image-gen-settings-label">
                                <div id="image-gen-settings-label" className="sr-only">Image Generation Settings</div>

                                {/* Invoke Setup (LandingPage exact copy) */}
                                <Collapsible
                                    open={openCollapsibles['invokeai-setup'] || false}
                                    onOpenChange={() => toggleCollapsible('invokeai-setup')}
                                    className="liquid-glass-themed border border-blue-500/50 rounded-lg p-4"
                                >
                                    <CollapsibleTrigger className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
                                        <div className="flex justify-center pt-1 relative group cursor-pointer">
                                            <div className="relative">
                                                <div className="absolute right-full mr-2 translate-y-px">
                                                    <div className="relative w-6 h-6 shrink-0">
                                                        <Image
                                                            src="/invoke-ai.svg"
                                                            alt="InvokeAI Logo"
                                                            fill
                                                            className="object-contain brightness-0 dark:brightness-100"
                                                        />
                                                    </div>
                                                </div>
                                                <h3 className="font-semibold text-base whitespace-nowrap">Invoke Setup</h3>
                                            </div>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-blue-500/70 group-hover:text-blue-500 transition-colors">
                                                {openCollapsibles['invokeai-setup'] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                            </div>
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className="space-y-2 mt-4">
                                            <div className="text-sm space-y-1 mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                                                <SetupInstructions type="invokeai" />
                                                <div className="flex flex-col items-center space-y-2">
                                                    <div className="flex gap-2 w-full max-w-md">
                                                        {invokeaiHelperEnabled ? (
                                                            <div className="flex-1 flex items-stretch rounded-md liquid-glass-input overflow-hidden">
                                                                <span className="px-2 py-1.5 text-xs bg-muted text-muted-foreground font-medium border-r border-border whitespace-nowrap">
                                                                    https://
                                                                </span>
                                                                <input
                                                                    type="text"
                                                                    value={invokeaiSubdomain}
                                                                    onChange={(e) => {
                                                                        setInvokeaiSubdomain(e.target.value);
                                                                        if (customInvokeaiAvailable) {
                                                                            setCustomInvokeaiAvailable(false);
                                                                        }
                                                                        setInvokeaiVerifyError(null);
                                                                    }}
                                                                    placeholder="e.g. abc123"
                                                                    className="flex-1 px-2 py-1.5 text-sm bg-transparent outline-none"
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            e.preventDefault();
                                                                            handleVerifyInvokeAI();
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="px-2 py-1.5 text-xs bg-muted text-muted-foreground font-medium border-l border-border whitespace-nowrap">
                                                                    .ngrok-free.app
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <input
                                                                type="url"
                                                                value={invokeaiEndpoint}
                                                                onChange={(e) => {
                                                                    setInvokeaiEndpoint(e.target.value);
                                                                    if (customInvokeaiAvailable) {
                                                                        setCustomInvokeaiAvailable(false);
                                                                    }
                                                                    setInvokeaiVerifyError(null);
                                                                }}
                                                                placeholder="e.g. https://abc123.ngrok-free.app"
                                                                className="flex-1 px-3 py-1.5 text-sm rounded-md liquid-glass-input text-center"
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                        handleVerifyInvokeAI();
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handleVerifyInvokeAI}
                                                            disabled={
                                                                customInvokeaiLoading ||
                                                                (!invokeaiHelperEnabled
                                                                    ? !invokeaiEndpoint.trim()
                                                                    : !invokeaiSubdomain.trim())
                                                            }
                                                            className="liquid-glass-button-primary h-auto py-1.5"
                                                        >
                                                            {customInvokeaiLoading ? 'Verifying...' : 'Verify'}
                                                        </Button>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-2 w-full max-w-md">
                                                        <input
                                                            id="invokeai-helper-toggle"
                                                            type="checkbox"
                                                            checked={invokeaiHelperEnabled}
                                                            onChange={(e) => setInvokeaiHelperEnabled(e.target.checked)}
                                                            className="h-3 w-3"
                                                        />
                                                        <label
                                                            htmlFor="invokeai-helper-toggle"
                                                            className="text-xs text-muted-foreground cursor-pointer"
                                                        >
                                                            Add <span className="text-blue-600 dark:text-blue-400 font-medium">https://</span> and{' '}
                                                            <span className="text-blue-600 dark:text-blue-400 font-medium">.ngrok-free.app</span>
                                                        </label>
                                                    </div>
                                                    {customInvokeaiAvailable && (
                                                        <p className="text-sm text-green-600 dark:text-green-400">✓ Invoke connected!</p>
                                                    )}
                                                    {invokeaiVerifyError && (
                                                        <p className="text-xs text-red-600 dark:text-red-400 max-w-xs text-center">{invokeaiVerifyError}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>

                                {/* InvokeAI selection + advanced settings */}
                                <div className="space-y-2 flex flex-col items-center">
                                    <Label className="text-center">Invoke Model</Label>
                                    <Select
                                        value={invokeaiSelectedModel}
                                        onValueChange={setInvokeaiSelectedModel}
                                        disabled={!user || !customInvokeaiAvailable || invokeaiModelNames.length === 0}
                                    >
                                        <SelectTrigger className="w-full relative [&>span]:mx-auto [&>span]:text-center [&>svg]:absolute [&>svg]:right-3">
                                            <SelectValue placeholder={customInvokeaiAvailable ? 'Select model' : 'Verify Invoke first'} />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60 liquid-glass-panel">
                                            {invokeaiModelNames.length > 0 ? (
                                                invokeaiModelNames.map((name) => (
                                                    <SelectItem key={name} value={name} className="justify-center">
                                                        <div className="w-full text-center">{name}</div>
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="__no_models" disabled className="justify-center">
                                                    <div className="w-full text-center">No models detected</div>
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="block text-center">Steps</Label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={200}
                                            value={invokeaiSteps}
                                            onChange={(e) => setInvokeaiSteps(Number(e.target.value))}
                                            className="w-full px-3 py-2 rounded-md text-center liquid-glass-input"
                                            disabled={!user}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="block text-center">CFG Scale</Label>
                                        <input
                                            type="number"
                                            step={0.5}
                                            min={0}
                                            max={30}
                                            value={invokeaiGuidanceScale}
                                            onChange={(e) => setInvokeaiGuidanceScale(Number(e.target.value))}
                                            className="w-full px-3 py-2 rounded-md text-center liquid-glass-input"
                                            disabled={!user}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="block text-center">Width</Label>
                                        <input
                                            type="number"
                                            min={64}
                                            step={64}
                                            value={invokeaiWidth}
                                            onChange={(e) => setInvokeaiWidth(Number(e.target.value))}
                                            className="w-full px-3 py-2 rounded-md text-center liquid-glass-input"
                                            disabled={!user}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="block text-center">Height</Label>
                                        <input
                                            type="number"
                                            min={64}
                                            step={64}
                                            value={invokeaiHeight}
                                            onChange={(e) => setInvokeaiHeight(Number(e.target.value))}
                                            className="w-full px-3 py-2 rounded-md text-center liquid-glass-input"
                                            disabled={!user}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="block text-center">Seed (optional)</Label>
                                        <input
                                            type="text"
                                            value={invokeaiSeed}
                                            onChange={(e) => setInvokeaiSeed(e.target.value)}
                                            placeholder="Leave blank for random"
                                            className="w-full px-3 py-2 rounded-md text-center liquid-glass-input"
                                            disabled={!user}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="block text-center">Scheduler</Label>
                                        <Select value={invokeaiScheduler} onValueChange={setInvokeaiScheduler} disabled={!user}>
                                            <SelectTrigger className="w-full relative [&>span]:mx-auto [&>span]:text-center [&>svg]:absolute [&>svg]:right-3">
                                                <SelectValue placeholder="Select scheduler" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60 liquid-glass-panel">
                                                {INVOKEAI_SCHEDULERS.map((s) => (
                                                    <SelectItem key={s.id} value={s.id} className="justify-center">
                                                        <div className="w-full text-center">{s.label}</div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="block text-center">CLIP Skip</Label>
                                        <input
                                            type="number"
                                            min={0}
                                            max={12}
                                            value={invokeaiClipSkip}
                                            onChange={(e) => setInvokeaiClipSkip(Number(e.target.value))}
                                            className="w-full px-3 py-2 rounded-md text-center liquid-glass-input"
                                            disabled={!user}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="block text-center">CFG Rescale Multiplier</Label>
                                        <input
                                            type="number"
                                            step={0.1}
                                            min={0}
                                            max={10}
                                            value={invokeaiCfgRescaleMultiplier}
                                            onChange={(e) => setInvokeaiCfgRescaleMultiplier(Number(e.target.value))}
                                            className="w-full px-3 py-2 rounded-md text-center liquid-glass-input"
                                            disabled={!user}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="block text-center">Negative Prompt (optional)</Label>
                                    <textarea
                                        className="w-full px-3 py-2 rounded-md text-center liquid-glass-input min-h-[60px]"
                                        value={invokeaiNegativePrompt}
                                        onChange={(e) => setInvokeaiNegativePrompt(e.target.value)}
                                        placeholder="e.g. blurry, low quality"
                                        disabled={!user}
                                    />
                                </div>

                                {/* Prompt LLM Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="prompt-llm-select" className="block text-center">{t?.sessionSetupForm?.promptLLM || 'Prompt LLM'}</Label>
                                    <Select
                                        value={selectedPromptLlm}
                                        onValueChange={setSelectedPromptLlm}
                                        disabled={!user || isLoadingStatus}
                                    >
                                        <SelectTrigger id="prompt-llm-select" className="w-full relative [&>span]:mx-auto [&>span]:text-center [&>svg]:absolute [&>svg]:right-3">
                                            <SelectValue placeholder={t?.sessionSetupForm?.selectPromptLLM || 'Select LLM for prompt generation'} />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-96 liquid-glass-panel">
                                            {getAllAvailableLLMs().map(llm => (
                                                <SelectItem key={llm.id} value={llm.id}>
                                                    <div className="w-full text-center">{llm.name} ({llm.provider})</div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground text-center">The LLM used to generate image prompts from paragraphs</p>
                                </div>

                                {/* System Prompt for Image Prompt LLM */}
                                <div className="space-y-2">
                                    <Label htmlFor="image-prompt-system-message" className="block text-center">{t?.sessionSetupForm?.imagePromptSystemMessage || 'Prompt System Message'}</Label>
                                    <textarea
                                        id="image-prompt-system-message"
                                        className="w-full px-3 py-2 rounded-md text-center liquid-glass-input min-h-[60px]"
                                        value={imagePromptSystemMessage}
                                        onChange={e => setImagePromptSystemMessage(e.target.value)}
                                        placeholder="Create a prompt to give to the image generation model based on this paragraph: {paragraph}"
                                        aria-describedby="image-prompt-system-message-description"
                                        aria-label="System prompt for image prompt LLM"
                                        disabled={!user}
                                    />
                                    <p id="image-prompt-system-message-description" className="text-xs text-muted-foreground text-center">
                                        Use {"{paragraph}"} as a placeholder for the paragraph text.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <hr className="my-6" />

                    {/* Move initial prompt section here */}
                    <div className="mt-4">
                        <label htmlFor="initial-system-prompt" className="block font-medium mb-1 text-center">{t?.sessionSetupForm?.initialSystemPrompt}</label>
                        <textarea
                            id="initial-system-prompt"
                            className="w-full border rounded-md p-2 text-sm min-h-[60px] text-center"
                            value={initialSystemPrompt}
                            onChange={e => setInitialSystemPrompt(e.target.value)}
                            placeholder={t?.sessionSetupForm?.startTheConversation || ''}
                            aria-describedby="initial-prompt-description"
                            aria-label="Initial system prompt for starting the conversation"
                        />
                        <div className="mt-1 flex flex-col items-center">
                            <button
                                onClick={() => setCollapseInitialPromptDescription(!collapseInitialPromptDescription)}
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1"
                                aria-expanded={!collapseInitialPromptDescription}
                            >
                                {collapseInitialPromptDescription ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                                <span>Help</span>
                            </button>
                            {!collapseInitialPromptDescription && (
                                <p id="initial-prompt-description" className="text-xs text-muted-foreground text-center">
                                    {t?.sessionSetupForm?.initialPromptDescription}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Lookahead Limit */}
                    <div className="mt-4">
                        <label htmlFor="lookahead-limit" className="block font-medium mb-1 text-center">
                            Lookahead Limit
                        </label>
                        <div className="flex items-center justify-center gap-2">
                            <input
                                id="lookahead-limit"
                                type="number"
                                min="1"
                                max="10"
                                value={lookaheadLimit}
                                onChange={e => setLookaheadLimit(Math.max(1, Math.min(10, parseInt(e.target.value) || 3)))}
                                className="w-20 border rounded-md p-2 text-center"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-1">
                            Number of turns to generate in advance (default: 3)
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    {/* Preset Management Buttons */}
                    {user && t && (
                        <div className="flex gap-2 w-full">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleLoadPreset}
                                disabled={isLoading}
                                className="flex items-center gap-2 flex-1"
                            >
                                <Download className="h-4 w-4" />
                                {t.sessionSetupForm.loadPreset}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSavePreset}
                                disabled={isLoading}
                                className="flex items-center gap-2 flex-1"
                            >
                                <Save className="h-4 w-4" />
                                {t.sessionSetupForm.savePreset}
                            </Button>
                        </div>
                    )}
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
            </Card >

            {/* Overwrite Confirmation Dialog */}
            < AlertDialog open={showOverwriteDialog} onOpenChange={setShowOverwriteDialog} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t?.sessionSetupForm?.savePreset || "Save Preset"}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t?.sessionSetupForm?.confirmOverwritePreset || "This will replace your existing preset. Continue?"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t?.common?.cancel || "Cancel"}</AlertDialogCancel>
                        <AlertDialogAction onClick={savePresetToDatabase}>
                            {t?.common?.continue || "Continue"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog >
        </>
    );
};

export default SessionSetupForm;
