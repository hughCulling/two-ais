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
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { db } from '@/lib/firebase/clientApp';
import { getAllAvailableLLMs, getLLMInfoById, setOllamaModelsFromNames } from '@/lib/models';
// useOllama replaced with manual verify flow for ngrok support
import { useInvokeAI } from '@/hooks/useInvokeAI';
import { FreeTierBadge } from "@/components/ui/free-tier-badge";
import { IconTooltipBadge } from "@/components/ui/icon-tooltip-badge";
import {
    // AVAILABLE_TTS_PROVIDERS,
    TTSProviderInfo,
    TTSVoice,
    getTTSProviderInfoById,
    onVoicesLoaded
} from '@/lib/tts_models';
import { isLanguageSupported } from '@/lib/model-language-support';
import { isTTSModelLanguageSupported } from '@/lib/tts_models';
// import { AlertTriangle, Info, Check, X, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { AlertTriangle, Info, Check, X, Download, Save, ChevronDown, ChevronUp } from "lucide-react";
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

// --- Utility Functions ---
function isSafariBrowser(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }
    const userAgent = navigator.userAgent.toLowerCase();
    // Safari detection: has 'safari' but not 'chrome' or 'chromium'
    return userAgent.includes('safari') && !userAgent.includes('chrome') && !userAgent.includes('chromium');
}

// function isEdgeBrowser(): boolean {
//     if (typeof window === 'undefined' || typeof navigator === 'undefined') {
//         return false;
//     }
//     const userAgent = navigator.userAgent.toLowerCase();
//     return userAgent.includes('edg/') || userAgent.includes('edge/');
// }

function isChromeBrowser(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }
    const userAgent = navigator.userAgent.toLowerCase();
    // Chrome detection: has 'chrome' but not 'edg' (Edge) and not 'opr' (Opera)
    return userAgent.includes('chrome') && !userAgent.includes('edg') && !userAgent.includes('opr');
}

function isFirefoxBrowser(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('firefox');
}

function isOperaBrowser(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('opr/') || userAgent.includes('opera/');
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
    ollamaEndpoint?: string;
    imageGenSettings?: {
        enabled: boolean;
        provider: string;
        invokeaiEndpoint: string;
        promptLlm: string;
        promptSystemMessage: string;
    };
}

interface SessionSetupFormProps {
    onStartSession: (config: SessionConfig) => void;
    isLoading: boolean;
}

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

    // Group models by provider
    const allLLMs = getAllAvailableLLMs();
    const groupedByProvider: Record<string, typeof allLLMs> = {};

    allLLMs.forEach((llm) => {
        if (!groupedByProvider[llm.provider]) {
            groupedByProvider[llm.provider] = [];
        }
        groupedByProvider[llm.provider].push(llm);
    });

    // Sort providers alphabetically, but put Ollama last if it exists
    const sortedProviders = Object.keys(groupedByProvider).sort((a, b) => {
        if (a === 'Ollama') return 1;
        if (b === 'Ollama') return -1;
        return a.localeCompare(b);
    });

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
                <SelectContent className="max-h-96">
                    {sortedProviders.map((provider) => {
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

                        return (
                            <SelectGroup key={provider}>
                                <SelectLabel className="flex items-center gap-1.5">
                                    {provider}
                                    {allModelsSupport && (
                                        <IconTooltipBadge
                                            icon={<Check className="h-3 w-3 text-green-700 dark:text-green-300" />}
                                            tooltip={t.page_TooltipSupportsLanguage.replace("{languageName}", language.nativeName)}
                                        />
                                    )}
                                    {allHaveFreeTier && providerFreeTier && (
                                        <FreeTierBadge freeTier={providerFreeTier} t={t} />
                                    )}
                                </SelectLabel>
                                {groupedByProvider[provider].map((llm) => {
                                    const supportsLanguage = isLanguageSupported(llm.provider, language.code, llm.id);
                                    return (
                                        <SelectItem key={llm.id} value={llm.id} disabled={!supportsLanguage} className="pr-2 py-2 overflow-hidden">
                                            <div className="flex items-center w-full text-sm min-w-0 space-x-1.5 overflow-hidden">
                                                <span className="font-medium truncate" style={{ flexShrink: 0.5, minWidth: 0 }}>{llm.name}</span>
                                                {llm.status === 'preview' && <span className="text-xs text-orange-500 flex-shrink-0 whitespace-nowrap">({t?.page_BadgePreview || 'Preview'})</span>}
                                                {llm.status === 'beta' && <span className="text-xs text-blue-500 flex-shrink-0 whitespace-nowrap">(Beta)</span>}
                                                {llm.status === 'experimental' && <span className="text-xs text-purple-500 flex-shrink-0 whitespace-nowrap">({t?.page_BadgeExperimental || 'Experimental'})</span>}
                                                {/* Don't show pricing for Ollama models */}
                                                {llm.provider !== 'Ollama' && (
                                                    <span className="text-xs text-muted-foreground truncate" style={{ flexShrink: 2, minWidth: 0 }} title={
                                                        llm.pricing.note ?
                                                            (typeof llm.pricing.note === 'function' ? llm.pricing.note(t) : llm.pricing.note) :
                                                            `$${formatPrice(llm.pricing.input)} / $${formatPrice(llm.pricing.output)} ${t?.page_PricingPerTokens || 'per 1M tokens'}`
                                                    }>
                                                        ({llm.pricing.note ?
                                                            (typeof llm.pricing.note === 'function' ? llm.pricing.note(t) : llm.pricing.note) :
                                                            `$${formatPrice(llm.pricing.input)} / $${formatPrice(llm.pricing.output)} ${t?.page_PricingPerTokens || 'per 1M tokens'}`
                                                        })
                                                    </span>
                                                )}
                                                {/* Only show language support icon on individual models if not all models support the language */}
                                                {!allModelsSupport && (
                                                    supportsLanguage ? (
                                                        <IconTooltipBadge
                                                            icon={<Check className="h-3 w-3 text-green-700 dark:text-green-300" />}
                                                            tooltip={t.page_TooltipSupportsLanguage.replace("{languageName}", language.nativeName)}
                                                            className="flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <IconTooltipBadge
                                                            icon={<X className="h-3 w-3 text-red-700 dark:text-red-300" />}
                                                            tooltip={t.page_TooltipMayNotSupportLanguage.replace("{languageName}", language.nativeName)}
                                                            className="flex-shrink-0"
                                                        />
                                                    )
                                                )}
                                                {llm.usesReasoningTokens && (
                                                    <IconTooltipBadge
                                                        icon={<Info className="h-3 w-3 text-blue-500" />}
                                                        tooltip={
                                                            llm.provider === 'Anthropic'
                                                                ? t.page_TooltipAnthropicExtendedThinking
                                                                : llm.provider === 'xAI'
                                                                    ? t.page_TooltipXaiThinking
                                                                    : (llm.provider === 'TogetherAI' && llm.categoryKey?.includes('Qwen'))
                                                                        ? t.page_TooltipQwenReasoning
                                                                        : (llm.provider === 'TogetherAI' && llm.categoryKey?.includes('DeepSeek'))
                                                                            ? t.page_TooltipDeepSeekReasoning
                                                                            : t.page_TooltipGenericReasoning
                                                        }
                                                        className="flex-shrink-0"
                                                    />
                                                )}
                                                {llm.requiresOrgVerification && (
                                                    <IconTooltipBadge
                                                        icon={<AlertTriangle className="h-3 w-3 text-yellow-500" />}
                                                        tooltip={t.page_TooltipRequiresVerification}
                                                        className="flex-shrink-0"
                                                    />
                                                )}
                                                {/* Only show free tier badge on individual models if not all models in provider have it */}
                                                {!allHaveFreeTier && llm.pricing?.freeTier?.available && <FreeTierBadge freeTier={llm.pricing.freeTier} t={t} className="flex-shrink-0" />}
                                                {!supportsLanguage && <span className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">(No {language.nativeName})</span>}
                                            </div>
                                        </SelectItem>
                                    );
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

    // Ollama endpoint (ngrok URL) - manual verify flow
    const [ollamaEndpoint, setOllamaEndpoint] = useState<string>('');
    const [ollamaAvailable, setOllamaAvailable] = useState(false);
    const [ollamaLoading, setOllamaLoading] = useState(false);
    const [ollamaVerifyError, setOllamaVerifyError] = useState<string | null>(null);

    const handleVerifyOllama = async () => {
        const endpoint = ollamaEndpoint.trim().replace(/\/+$/, '');
        if (!endpoint) return;

        setOllamaLoading(true);
        setOllamaVerifyError(null);

        // Determine if we can attempt a direct browser-based verification
        const isHttps = endpoint.startsWith('https://');
        const isLocalHost = typeof window !== 'undefined' &&
            (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

        try {
            // Try direct browser verification first if it's HTTPS (ngrok) or LocalHost
            if (isHttps || isLocalHost) {
                try {
                    console.log(`[Ollama Verify] Attempting direct browser verify: ${endpoint}/api/tags`);
                    const directHeaders: Record<string, string> = {
                        'Accept': 'application/json',
                    };
                    if (isHttps) {
                        directHeaders['ngrok-skip-browser-warning'] = 'true';
                    }

                    const res = await fetch(`${endpoint}/api/tags`, {
                        method: 'GET',
                        headers: directHeaders,
                        // Use AbortSignal.timeout if supported, otherwise just proceed
                    });

                    if (res.ok) {
                        const data = await res.json() as { models?: { name: string }[] };
                        const models = data.models?.map((m) => m.name) || [];
                        setOllamaAvailable(true);
                        setOllamaModelsFromNames(models, endpoint);
                        console.log(`[Ollama Verify] Direct verify successful, found ${models.length} models`);
                        setOllamaLoading(false);
                        return;
                    }
                } catch (directError) {
                    console.warn(`[Ollama Verify] Direct verification failed, falling back to proxy:`, directError);
                }
            }

            // Proxy through server-side route to bypass ngrok CORS/browser warning (or as a fallback)
            console.log(`[Ollama Verify] Using proxy /api/ollama/verify for: ${endpoint}`);
            const res = await fetch('/api/ollama/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ endpoint }),
            });
            const data = await res.json();
            if (data.available) {
                setOllamaAvailable(true);
                // Use model names from server response (avoids client-side CORS issues)
                setOllamaModelsFromNames(data.models || [], endpoint);
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

    // Detect InvokeAI
    const [invokeaiEndpoint, setInvokeaiEndpoint] = useState<string>('http://localhost:9090');
    const { isAvailable: invokeaiAvailable, isLoading: invokeaiLoading } = useInvokeAI(invokeaiEndpoint);

    const [agentA_llm, setAgentA_llm] = useState<string>('');
    const [agentB_llm, setAgentB_llm] = useState<string>('');
    const [savedKeyStatus, setSavedKeyStatus] = useState<Record<string, boolean>>({});
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);
    const [statusError, setStatusError] = useState<string | null>(null);
    const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);
    const [showSafariWarning, setShowSafariWarning] = useState<boolean>(false);
    const [showEdgeRecommendation, setShowEdgeRecommendation] = useState<boolean>(false);
    const [initialSystemPrompt, setInitialSystemPrompt] = useState<string>(() => t?.sessionSetupForm?.startTheConversation || '');

    // Preset management state
    const [showOverwriteDialog, setShowOverwriteDialog] = useState<boolean>(false);
    const [hasExistingPreset, setHasExistingPreset] = useState<boolean>(false);
    const { toast } = useToast();

    // Collapse states for helper text
    const [collapseCardDescription, setCollapseCardDescription] = useState<boolean>(false);
    const [collapseInitialPromptDescription, setCollapseInitialPromptDescription] = useState<boolean>(false);
    const [collapseOllamaHelp, setCollapseOllamaHelp] = useState<boolean>(false);
    const [collapseInvokeAIDetails, setCollapseInvokeAIDetails] = useState<boolean>(false);
    const [collapseInvokeAINotDetected, setCollapseInvokeAINotDetected] = useState<boolean>(false);

    // --- Image Generation State ---
    const [imageGenEnabled, setImageGenEnabled] = useState(false);
    const [selectedPromptLlm, setSelectedPromptLlm] = useState<string>('');
    const [imagePromptSystemMessage, setImagePromptSystemMessage] = useState<string>(t?.sessionSetupForm?.defaultImagePromptSystemMessage || 'Create a prompt to give to the image generation model based on this paragraph: {paragraph}');

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
            ollamaEndpoint: ollamaEndpoint.trim() || undefined,
            imageGenSettings,
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
                imageGenSettings: imageGenEnabled ? {
                    enabled: true,
                    provider: "invokeai", // Signal to backend that InvokeAI (client-side) handles image generation
                    invokeaiEndpoint: invokeaiEndpoint,
                    promptLlm: selectedPromptLlm,
                    promptSystemMessage: imagePromptSystemMessage,
                } : undefined,
                collapseStates: {
                    cardDescription: collapseCardDescription,
                    initialPromptDescription: collapseInitialPromptDescription,
                    ollamaHelp: collapseOllamaHelp,
                    invokeAIDetails: collapseInvokeAIDetails,
                    invokeAINotDetected: collapseInvokeAINotDetected,
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

            // Load image generation settings if present
            if (preset.imageGenSettings) {
                setImageGenEnabled(preset.imageGenSettings.enabled);
                setInvokeaiEndpoint(preset.imageGenSettings.invokeaiEndpoint || 'http://localhost:9090');
                setSelectedPromptLlm(preset.imageGenSettings.promptLlm || '');
                setImagePromptSystemMessage(preset.imageGenSettings.promptSystemMessage || 'Create a prompt to give to the image generation model based on this paragraph: {paragraph}');
            }

            // Load collapse states if they exist
            if (preset.collapseStates) {
                setCollapseCardDescription(preset.collapseStates.cardDescription ?? false);
                setCollapseInitialPromptDescription(preset.collapseStates.initialPromptDescription ?? false);
                setCollapseOllamaHelp(preset.collapseStates.ollamaHelp ?? false);
                setCollapseInvokeAIDetails(preset.collapseStates.invokeAIDetails ?? false);
                setCollapseInvokeAINotDetected(preset.collapseStates.invokeAINotDetected ?? false);
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

        // Simplified version - only show voice selector since we only have browser TTS with one model
        return (
            <div className="space-y-3 p-4 border rounded-md bg-background/50">
                <h3 className="font-semibold text-center mb-3">Agent {agentIdentifier} TTS</h3>
                {shouldShowVoiceDropdown && (
                    <div className="space-y-2">
                        <Label htmlFor={`agent-${agentIdentifierLowerCase}-voice`} className="block text-center">{t?.sessionSetupForm?.voice}</Label>
                        <Select
                            value={currentAgentTTSSettings.voice || ''}
                            onValueChange={(value) => handleExternalVoiceChange(agentIdentifier, value)}
                            disabled={!user || currentAgentVoices.length === 0}
                        >
                            <SelectTrigger id={`agent-${agentIdentifierLowerCase}-voice`} className="w-full [&>span]:mx-auto [&>span]:text-center">
                                <SelectValue placeholder={currentAgentVoices.length > 0 ? t?.sessionSetupForm?.selectVoice : t?.sessionSetupForm?.noVoicesFor?.replace('{languageName}', language.nativeName)} />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                                {currentAgentVoices.map(v => {
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
    */

    return (
        <>
            <Card className="w-full max-w-2xl">
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

                    {/* Ollama Endpoint (ngrok URL) */}
                    <div className="pt-3 space-y-2 flex flex-col items-center">
                        <Label htmlFor="ollama-endpoint" className="text-sm">
                            {t?.page_OllamaEndpointLabel || 'Ollama Endpoint (ngrok URL)'}
                        </Label>
                        <button
                            onClick={() => setCollapseOllamaHelp(!collapseOllamaHelp)}
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            aria-expanded={!collapseOllamaHelp}
                        >
                            {collapseOllamaHelp ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                            <span className="text-xs">Help</span>
                        </button>
                        {!collapseOllamaHelp && (
                            <p className="text-xs text-muted-foreground text-center">
                                Run <code className="bg-muted px-1 rounded text-xs">{t?.page_OllamaStep3 || 'OLLAMA_ORIGINS=* ollama serve'}</code> then <code className="bg-muted px-1 rounded text-xs">{t?.page_OllamaStep3b || 'ngrok http 11434'}</code> and paste the forwarding URL here.
                            </p>
                        )}
                        <div className="flex gap-2 w-full max-w-sm">
                            <input
                                id="ollama-endpoint"
                                type="url"
                                value={ollamaEndpoint}
                                onChange={(e) => {
                                    setOllamaEndpoint(e.target.value);
                                    // Reset verification state when URL changes
                                    if (ollamaAvailable) {
                                        setOllamaAvailable(false);
                                    }
                                    setOllamaVerifyError(null);
                                }}
                                placeholder={t?.page_OllamaEndpointPlaceholder || 'e.g. https://abc123.ngrok-free.app'}
                                className="flex-1 px-3 py-1.5 text-sm border rounded-md bg-background"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleVerifyOllama();
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleVerifyOllama}
                                disabled={!ollamaEndpoint.trim() || ollamaLoading}
                            >
                                {ollamaLoading ? (t?.page_OllamaVerifying || 'Verifying...') : (t?.page_OllamaVerify || 'Verify')}
                            </Button>
                        </div>
                        {ollamaAvailable && (
                            <p className="text-sm text-green-600 dark:text-green-400">✓ {t?.page_OllamaVerifySuccess || 'Ollama connected!'}</p>
                        )}
                        {ollamaVerifyError && (
                            <p className="text-sm text-red-600 dark:text-red-400">{ollamaVerifyError}</p>
                        )}
                    </div>

                    {/* InvokeAI Status Indicator */}
                    {invokeaiLoading && (
                        <p className="text-sm text-muted-foreground pt-2">Checking for InvokeAI...</p>
                    )}
                    {!invokeaiLoading && invokeaiAvailable && (
                        <div className="pt-2 space-y-1 flex flex-col items-center">
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-green-600 dark:text-green-400">✓ InvokeAI detected</p>
                                <button
                                    onClick={() => setCollapseInvokeAIDetails(!collapseInvokeAIDetails)}
                                    className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                                    aria-expanded={!collapseInvokeAIDetails}
                                    aria-label="Toggle InvokeAI details"
                                >
                                    {collapseInvokeAIDetails ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                                </button>
                            </div>
                            {!collapseInvokeAIDetails && (
                                <p className="text-xs text-green-600 dark:text-green-400">Local image generation is available</p>
                            )}
                        </div>
                    )}
                    {!invokeaiLoading && !invokeaiAvailable && (
                        <div className="pt-2 space-y-1 flex flex-col items-center">
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-muted-foreground">InvokeAI not detected</p>
                                <button
                                    onClick={() => setCollapseInvokeAINotDetected(!collapseInvokeAINotDetected)}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                    aria-expanded={!collapseInvokeAINotDetected}
                                    aria-label="Toggle InvokeAI installation info"
                                >
                                    {collapseInvokeAINotDetected ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                                </button>
                            </div>
                            {!collapseInvokeAINotDetected && (
                                <p className="text-xs text-muted-foreground">You can <a href="https://invoke-ai.github.io/InvokeAI/installation/quick_start/" target="_blank" rel="noopener noreferrer" className="underline">install InvokeAI</a> for free local image generation.</p>
                            )}
                        </div>
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

                        {/* Safari Browser Warning */}
                        {ttsEnabled && showSafariWarning && (
                            <div className="bg-orange-50 dark:bg-orange-950 border-l-4 border-orange-400 p-4 rounded-md">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertTriangle className="h-5 w-5 text-orange-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                                            {t?.sessionSetupForm?.safariWarningTitle || 'Limited Voice Selection in Safari'}
                                        </p>
                                        <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                                            {t?.sessionSetupForm?.safariWarningMessage || 'Safari has limited voice selection. For the best experience, we recommend Microsoft Edge, which offers the most comprehensive voice options. Chrome, Firefox, and Opera also provide better selection than Safari.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Edge Recommendation for Chrome/Firefox/Opera */}
                        {ttsEnabled && showEdgeRecommendation && (
                            <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-400 p-4 rounded-md">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <Info className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                            {t?.sessionSetupForm?.edgeRecommendationTitle || 'Best Voice Selection Available'}
                                        </p>
                                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                            {t?.sessionSetupForm?.edgeRecommendationMessage || 'For the best voice selection with Browser TTS, we recommend using Microsoft Edge, which offers the most comprehensive range of voices.'}
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

                                {/* InvokeAI Endpoint */}
                                <div className="space-y-2">
                                    <Label htmlFor="invokeai-endpoint">InvokeAI Endpoint</Label>
                                    <input
                                        id="invokeai-endpoint"
                                        type="text"
                                        className="w-full border rounded-md p-2 text-sm"
                                        value={invokeaiEndpoint}
                                        onChange={e => setInvokeaiEndpoint(e.target.value)}
                                        placeholder="http://localhost:9090"
                                        disabled={!user}
                                    />
                                    <p className="text-xs text-muted-foreground">The URL where your InvokeAI server is running</p>
                                </div>

                                {/* Prompt LLM Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="prompt-llm-select">{t?.sessionSetupForm?.promptLLM || 'Prompt LLM'}</Label>
                                    <Select
                                        value={selectedPromptLlm}
                                        onValueChange={setSelectedPromptLlm}
                                        disabled={!user || isLoadingStatus}
                                    >
                                        <SelectTrigger id="prompt-llm-select" className="w-full">
                                            <SelectValue placeholder={t?.sessionSetupForm?.selectPromptLLM || 'Select LLM for prompt generation'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getAllAvailableLLMs().map(llm => (
                                                <SelectItem key={llm.id} value={llm.id}>{llm.name} ({llm.provider})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">The LLM used to generate image prompts from paragraphs</p>
                                </div>

                                {/* System Prompt for Image Prompt LLM */}
                                <div className="space-y-2">
                                    <Label htmlFor="image-prompt-system-message">{t?.sessionSetupForm?.imagePromptSystemMessage || 'Prompt System Message'}</Label>
                                    <textarea
                                        id="image-prompt-system-message"
                                        className="w-full border rounded-md p-2 text-sm min-h-[60px] text-center"
                                        value={imagePromptSystemMessage}
                                        onChange={e => setImagePromptSystemMessage(e.target.value)}
                                        placeholder="Create a prompt to give to the image generation model based on this paragraph: {paragraph}"
                                        aria-describedby="image-prompt-system-message-description"
                                        aria-label="System prompt for image prompt LLM"
                                        disabled={!user}
                                    />
                                    <p id="image-prompt-system-message-description" className="text-xs text-muted-foreground text-center">
                                        Use {"{paragraph}"} as a placeholder for the paragraph text
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
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
            </Card>

            {/* Overwrite Confirmation Dialog */}
            <AlertDialog open={showOverwriteDialog} onOpenChange={setShowOverwriteDialog}>
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
            </AlertDialog>
        </>
    );
};

export default SessionSetupForm;