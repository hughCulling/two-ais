// src/app/page.tsx
// Main page: Shows welcome/login prompt, SessionSetupForm, or ChatInterface.

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/context/LanguageContext';
import SessionSetupForm from '@/components/session/SessionSetupForm';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { db } from '@/lib/firebase/clientApp';
import { doc, getDoc, FirestoreError } from 'firebase/firestore';
// --- Import Theme hook ---
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
// --- Import required icons ---
import { AlertCircle, BrainCircuit, KeyRound, Volume2, AlertTriangle, Info, ChevronDown, ChevronRight, Check, X, History } from "lucide-react";
// --- Import required UI components ---
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// --- Import LLM data and grouping function ---
import { groupLLMsByProvider, LLMInfo } from '@/lib/models';
// --- Import TTS data ---
import { AVAILABLE_TTS_PROVIDERS, TTSProviderInfo, TTSModelDetail } from '@/lib/tts_models';
// --- Import Collapsible components ---
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
// --- Import language support ---
import { isLanguageSupported } from '@/lib/model-language-support';
import { isTTSModelLanguageSupported } from '@/lib/tts_models';
import { getTranslation, TranslationKeys, LanguageCode as AppLanguageCode } from '@/lib/translations';
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Define a more specific type for model category translation keys
type ModelCategoryTranslationKey = Extract<keyof TranslationKeys, `modelCategory_${string}`>;

// --- Define TTS Types (Locally) ---
interface AgentTTSSettingsConfig {
    provider: TTSProviderInfo['id'] | 'browser' | 'none';
    voice: string | null;
    ttsApiModelId?: TTSModelDetail['apiModelId'];
}

// --- Updated SessionConfig Interface ---
interface SessionConfig {
    agentA_llm: string;
    agentB_llm: string;
    ttsEnabled: boolean;
    agentA_tts: AgentTTSSettingsConfig;
    agentB_tts: AgentTTSSettingsConfig;
    language?: string;
}

// Interface for the expected structure of the API response from /api/conversation/start
interface StartApiResponse {
    message: string;
    conversationId: string;
    config?: SessionConfig;
}

// Define structure for user data containing secret versions from Firestore
interface UserData {
    apiSecretVersions?: { [key: string]: string };
}

// Basic logger placeholder
const logger = {
    info: console.log,
    error: console.error,
    warn: console.warn,
    debug: console.debug,
};

// Get grouped LLM data outside the component
const groupedLLMsByProvider = groupLLMsByProvider();
// Get TTS providers outside the component
const availableTTSProviders = AVAILABLE_TTS_PROVIDERS;

// --- YouTube Video URLs ---
const YOUTUBE_VIDEO_URL_LIGHT_MODE = "https://www.youtube.com/embed/52oUvRFdaXE";
const YOUTUBE_VIDEO_URL_DARK_MODE = "https://www.youtube.com/embed/pkN_uU-nDdk";

// Helper function to format pricing
const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 3,
    });
};

// Helper function to group models by category within a provider
const groupModelsByCategory = (models: LLMInfo[], langCode: AppLanguageCode): { orderedCategories: string[], byCategory: Record<string, LLMInfo[]> } => {
    const t = getTranslation(langCode) as TranslationKeys;
    const openAICategoryOrder = [
        t.modelCategory_FlagshipChat,
        t.modelCategory_Reasoning,
        t.modelCategory_CostOptimized,
        t.modelCategory_OlderGPT,
    ];
    const googleCategoryOrder = [
        t.modelCategory_Gemini2_5,
        t.modelCategory_Gemini2_0,
        t.modelCategory_Gemini1_5,
    ];
    const anthropicCategoryOrder = [
        "Claude 4 Series",
        t.modelCategory_Claude3_7,
        t.modelCategory_Claude3_5,
        t.modelCategory_Claude3,
    ];
    const xAICategoryOrder = [
        t.modelCategory_Grok3,
        t.modelCategory_Grok3Mini,
    ];
    const togetherAICategoryOrder = [
        t.modelCategory_Llama4,
        t.modelCategory_Llama3_3,
        t.modelCategory_Llama3_2,
        t.modelCategory_Llama3_1,
        t.modelCategory_Llama3,
        t.modelCategory_LlamaVision,
        t.modelCategory_MetaLlama,
        t.modelCategory_Gemma2,
        t.modelCategory_Gemma,
        t.modelCategory_GoogleGemma,
        t.modelCategory_DeepSeekR1,
        t.modelCategory_DeepSeekV3,
        t.modelCategory_DeepSeekR1Distill,
        t.modelCategory_DeepSeekModels,
        t.modelCategory_Qwen3,
        t.modelCategory_QwQwQ,
        t.modelCategory_Qwen2_5,
        t.modelCategory_Qwen2_5Vision,
        t.modelCategory_Qwen2_5Coder,
        t.modelCategory_Qwen2,
        t.modelCategory_Qwen2Vision,
        t.modelCategory_QwenModels,
    ];


    const byCategory: Record<string, LLMInfo[]> = {};

    models.forEach(model => {
        const categoryKey = (model.categoryKey || 'modelCategory_OtherModels') as ModelCategoryTranslationKey;
        let translatedCategory: string;
        
        // Handle temporary Claude 4 category
        if ((categoryKey as string) === 'claude4_temp') {
            translatedCategory = "Claude 4 Series";
        } else {
            translatedCategory = t[categoryKey] || categoryKey;
        }
        
        if (!byCategory[translatedCategory]) {
            byCategory[translatedCategory] = [];
        }
        byCategory[translatedCategory].push(model);
    });

    let orderedCategories = Object.keys(byCategory);
    let currentProviderOrder: string[] = [];

    if (models.length > 0) {
        const providerName = models[0].provider;
        if (providerName === 'OpenAI') {
            currentProviderOrder = openAICategoryOrder;
        } else if (providerName === 'Google') {
            currentProviderOrder = googleCategoryOrder;
        } else if (providerName === 'Anthropic') {
            currentProviderOrder = anthropicCategoryOrder;
        } else if (providerName === 'xAI') {
            currentProviderOrder = xAICategoryOrder;
        } else if (providerName === 'TogetherAI') {
            currentProviderOrder = togetherAICategoryOrder;
        }
    }

    const translatedOtherModelsCategory = t.modelCategory_OtherModels;

    if (currentProviderOrder.length > 0) {
        const orderedKeysFromProviderList = currentProviderOrder.filter(cat => byCategory[cat]);
        const remainingKeys = orderedCategories.filter(cat => !currentProviderOrder.includes(cat) && cat !== translatedOtherModelsCategory).sort();
        orderedCategories = [...orderedKeysFromProviderList, ...remainingKeys];
        if (byCategory[translatedOtherModelsCategory] && !orderedCategories.includes(translatedOtherModelsCategory)) {
            orderedCategories.push(translatedOtherModelsCategory);
        }
    } else {
        orderedCategories.sort((a, b) => {
            if (a === translatedOtherModelsCategory) return 1;
            if (b === translatedOtherModelsCategory) return -1;
            return a.localeCompare(b);
        });
    }

    orderedCategories.forEach(cat => {
        if (byCategory[cat]) {
            byCategory[cat].sort((a, b) => {
                // Custom sorting for Claude models to order by power tier: Haiku → Sonnet → Opus
                if (a.provider === 'Anthropic' && b.provider === 'Anthropic') {
                    const getClaudeTier = (name: string) => {
                        if (name.includes('Haiku')) return 0;
                        if (name.includes('Sonnet')) return 1;
                        if (name.includes('Opus')) return 2;
                        return 3; // fallback for other Claude models
                    };
                    
                    const tierA = getClaudeTier(a.name);
                    const tierB = getClaudeTier(b.name);
                    
                    if (tierA !== tierB) {
                        return tierA - tierB;
                    }
                    // If same tier, sort alphabetically
                    return a.name.localeCompare(b.name);
                }
                
                // Default alphabetical sorting for non-Claude models
                return a.name.localeCompare(b.name);
            });
        }
    });

    return { orderedCategories, byCategory };
};

// Component for truncatable text with conditional tooltip
interface TruncatableNoteProps {
    noteText: string;
    tooltipMaxWidth?: string;
}

const TruncatableNote: React.FC<TruncatableNoteProps> = ({
    noteText,
    tooltipMaxWidth = "max-w-xs"
}) => {
    const [isActuallyOverflowing, setIsActuallyOverflowing] = useState(false);
    const textRef = useRef<HTMLSpanElement>(null);
    const { language } = useLanguage();
    const t = getTranslation(language.code as AppLanguageCode) as TranslationKeys;

    useEffect(() => {
        const checkOverflow = () => {
            if (textRef.current) {
                if ((textRef.current.offsetWidth > 0 || textRef.current.offsetHeight > 0) &&
                    textRef.current.scrollWidth > textRef.current.clientWidth) {
                    setIsActuallyOverflowing(true);
                } else {
                    setIsActuallyOverflowing(false);
                }
            }
        };

        const timeoutId = setTimeout(checkOverflow, 150);
        window.addEventListener('resize', checkOverflow);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', checkOverflow);
        };
    }, [noteText]);

    const noteSpan = (
        <span
            ref={textRef}
            className={cn(
                "text-xs text-muted-foreground block truncate min-w-0",
                isActuallyOverflowing && "cursor-help"
            )}
        >
            {t.page_TruncatableNoteFormat.replace('{noteText}', noteText)}
        </span>
    );

    if (isActuallyOverflowing) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    {noteSpan}
                </TooltipTrigger>
                <TooltipContent side="top" className={`w-auto p-2 ${tooltipMaxWidth}`}>
                    <p className="text-xs">{noteText}</p>
                </TooltipContent>
            </Tooltip>
        );
    }

    return noteSpan;
};

// Helper to determine the "brand" for TogetherAI categories
const getTogetherAIBrandDisplay = (categoryKey: string | undefined): string | null => {
    if (!categoryKey) return null;
    // const t = getTranslation(langCode) as TranslationKeys; // t is not used here currently
    // We need to compare with the *keys* now, not the translated display names
    if (categoryKey.startsWith('modelCategory_Llama') || categoryKey === 'modelCategory_MetaLlama') return 'Meta';
    if (categoryKey.startsWith('modelCategory_Gemma') || categoryKey === 'modelCategory_GoogleGemma') return 'Google';
    if (categoryKey.startsWith('modelCategory_DeepSeek')) return 'DeepSeek';
    if (categoryKey.startsWith('modelCategory_Qwen') || categoryKey === 'modelCategory_QwQwQ') return 'Qwen';
    return null;
};


export default function Page() {
    const { user, loading: authLoading } = useAuth();
    const { resolvedTheme } = useTheme();
    const { language } = useLanguage();
    const t = getTranslation(language.code) as TranslationKeys;

    const [isStartingSession, setIsStartingSession] = useState(false);
    const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [userApiSecrets, setUserApiSecrets] = useState<{ [key: string]: string } | null>(null);
    const [secretsLoading, setSecretsLoading] = useState(true);
    const [pageError, setPageError] = useState<string | null>(null);
    const [currentVideoUrl, setCurrentVideoUrl] = useState(YOUTUBE_VIDEO_URL_LIGHT_MODE);
    const [openCollapsibles, setOpenCollapsibles] = useState<Record<string, boolean>>(
        () => {
            const initialOpenState: Record<string, boolean> = {};
            Object.keys(groupedLLMsByProvider).forEach(provider => {
                initialOpenState[`provider-${provider.replace(/\s+/g, '-')}`] = true;
            });
            availableTTSProviders.forEach(ttsProvider => {
                 initialOpenState[`tts-provider-${ttsProvider.id.replace(/\s+/g, '-')}`] = true;
            });
            return initialOpenState;
        }
    );

    const toggleCollapsible = (id: string) => {
        setOpenCollapsibles(prev => ({ ...prev, [id]: !prev[id] }));
    };


    useEffect(() => {
        if (!user) {
            setUserApiSecrets(null);
            setSessionConfig(null);
            setActiveConversationId(null);
            setSecretsLoading(false);
            setPageError(null);
            return;
        }
        if (user && userApiSecrets === null) {
            setSecretsLoading(true);
            setPageError(null);
            const userDocRef = doc(db, "users", user.uid);
            logger.info("Fetching user data for API secrets...");
            getDoc(userDocRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data() as UserData;
                        setUserApiSecrets(data.apiSecretVersions || {});
                        logger.info("User API secret versions loaded.");
                    } else {
                        logger.warn(`User document not found for user ${user.uid}. Assuming no API keys saved yet.`);
                        setUserApiSecrets({});
                    }
                })
                .catch((err: FirestoreError) => {
                    logger.error("Error fetching user document:", err);
                    setPageError(t.page_ErrorLoadingUserData.replace("{errorMessage}", err.message));
                    setUserApiSecrets(null);
                })
                .finally(() => {
                    setSecretsLoading(false);
                });
        } else if (user && userApiSecrets !== null) {
             if (secretsLoading) {
                setSecretsLoading(false);
             }
        }
    }, [user, userApiSecrets, secretsLoading, t.page_ErrorLoadingUserData]);

    useEffect(() => {
        if (resolvedTheme) {
            setCurrentVideoUrl(resolvedTheme === 'dark' ? YOUTUBE_VIDEO_URL_DARK_MODE : YOUTUBE_VIDEO_URL_LIGHT_MODE);
        }
    }, [resolvedTheme]);


    const handleStartSession = async (config: SessionConfig) => {
        if (!user) {
            setPageError(t.page_ErrorUserNotFound); return;
        }
        if (userApiSecrets === null) {
            setPageError(t.page_ErrorUserApiKeyConfig); return;
        }
        logger.info("Attempting to start session via API with full config:", config);
        setIsStartingSession(true);
        setPageError(null);
        setSessionConfig(null);
        setActiveConversationId(null);
        try {
            const idToken = await user.getIdToken();
            logger.info("Obtained ID Token for API call.");
            
            // Add language to the config
            const configWithLanguage = {
                ...config,
                language: language.code
            };
            
            const response = await fetch('/api/conversation/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
                body: JSON.stringify(configWithLanguage),
            });
            if (!response.ok) {
                let errorMsg = t.page_ErrorStartingSessionAPI.replace("{status}", response.status.toString()).replace("{statusText}", response.statusText);
                try { const errorData = await response.json(); errorMsg = errorData.error || errorMsg; }
                catch (parseError) { logger.warn("Could not parse error response JSON:", parseError); errorMsg = t.page_ErrorStartingSessionAPI.replace("{status}", response.status.toString()).replace("{statusText}", response.statusText); }
                throw new Error(errorMsg);
            }
            const result: StartApiResponse = await response.json();
            logger.info("API Response received:", result);
            if (!result.conversationId) { throw new Error(t.page_ErrorSessionIdMissing); }
            logger.info(`Session setup successful via API. Conversation ID: ${result.conversationId}`);
            setSessionConfig(configWithLanguage);
            setActiveConversationId(result.conversationId);
        } catch (error) {
            logger.error("Failed to start session:", error);
            setPageError(t.page_ErrorStartingSessionGeneric.replace("{errorMessage}", error instanceof Error ? error.message : String(error)));
            setSessionConfig(null);
            setActiveConversationId(null);
        } finally {
            setIsStartingSession(false);
        }
    };

    const handleConversationStopped = () => {
        logger.info("Conversation stopped callback triggered on page.");
        setSessionConfig(null);
        setActiveConversationId(null);
        setPageError(null);
    };

    if (authLoading || secretsLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                <p className="text-muted-foreground animate-pulse">{t.page_LoadingUserData}</p>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
            {pageError && (
                 <Alert variant="destructive" className="mb-6 max-w-3xl w-full flex-shrink-0">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t.page_ErrorAlertTitle}</AlertTitle>
                  <AlertDescription>{pageError}</AlertDescription>
                </Alert>
            )}
            <div className="w-full max-w-3xl flex flex-col items-center space-y-8 flex-grow pt-8 md:pt-12">
                {user ? (
                    !sessionConfig || !activeConversationId ? (
                        <>
                            <SessionSetupForm
                                onStartSession={handleStartSession}
                                isLoading={isStartingSession}
                            />
                        </>
                    ) : (
                        <ChatInterface
                            conversationId={activeConversationId}
                            onConversationStopped={handleConversationStopped}
                        />
                    )
                ) : (
                    <TooltipProvider delayDuration={100}>
                        <div className="p-6 bg-card text-card-foreground rounded-lg shadow-md space-y-4 text-center w-full">
                             <h1 className="text-2xl font-bold">{t.page_WelcomeTitle}</h1>
                             <p className="text-muted-foreground">{t.page_WelcomeSubtitle}</p>
                             <Alert variant="default" className="text-left border-theme-primary/50">
                                <KeyRound className="h-4 w-4 text-theme-primary" />
                                <AlertTitle className="font-semibold">{t.page_ApiKeysRequiredTitle}</AlertTitle>
                                <AlertDescription>
                                    {t.page_ApiKeysRequiredDescription}
                                </AlertDescription>
                             </Alert>
                             <p className="text-muted-foreground pt-2">{t.page_SignInPrompt}</p>
                        </div>

                        <div className="w-full aspect-video overflow-hidden rounded-lg shadow-md border">
                            <iframe
                                className="w-full h-full"
                                key={currentVideoUrl}
                                src={currentVideoUrl}
                                title={t.page_VideoTitle}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-center text-xl">
                                    <BrainCircuit className="mr-2 h-5 w-5" />
                                    {t.page_AvailableLLMsTitle}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground text-center mt-1">
                                    Prices last verified on 2025-06-04
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {Object.entries(groupedLLMsByProvider).map(([providerName, providerModels]: [string, LLMInfo[]]) => {
                                    const { orderedCategories, byCategory: modelsByCategory } = groupModelsByCategory(providerModels, language.code);
                                    const providerCollapsibleId = `provider-${providerName.replace(/\s+/g, '-')}`;
                                    const isProviderOpen = openCollapsibles[providerCollapsibleId] ?? true;
                                    let lastDisplayedBrand: string | null = null;

                                    return (
                                        <Collapsible key={providerName} open={isProviderOpen} onOpenChange={() => toggleCollapsible(providerCollapsibleId)} className="space-y-1">
                                            <CollapsibleTrigger className="flex items-center justify-between w-full text-xl font-semibold mb-2 border-b pb-1 hover:bg-muted/50 p-2 rounded-md transition-colors focus-visible:ring-1 focus-visible:ring-ring">
                                                <span>{providerName}</span>
                                                {isProviderOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="space-y-3 pl-2 pt-1">
                                                {orderedCategories.map((category, index) => {
                                                    const categoryModels = modelsByCategory[category];
                                                    if (!categoryModels) return null;

                                                    let brandHeadingElement = null;
                                                    if (providerName === 'TogetherAI') {
                                                        const modelCategoryKey = providerModels.find(m => {
                                                            const key = (m.categoryKey || 'modelCategory_OtherModels') as ModelCategoryTranslationKey;
                                                            const translated = t[key] || key;
                                                            return translated === category;
                                                        })?.categoryKey;
                                                        const currentBrandName = modelCategoryKey ? getTogetherAIBrandDisplay(modelCategoryKey) : null;
                                                        if (currentBrandName && currentBrandName !== lastDisplayedBrand) {
                                                            brandHeadingElement = (
                                                                <h4 className="text-lg font-semibold text-primary mt-4 mb-2 border-b border-primary/30 pb-1 ml-0">
                                                                    {currentBrandName}
                                                                </h4>
                                                            );
                                                            lastDisplayedBrand = currentBrandName;
                                                        }
                                                    }

                                                    return (
                                                    <React.Fragment key={`${category}-${index}`}>
                                                        {brandHeadingElement}
                                                        <div className={cn("ml-2", brandHeadingElement ? "mt-1" : "mt-0")}>
                                                            <h5 className="text-md font-medium text-muted-foreground mb-1.5 mt-2 pb-0.5">{category}</h5>
                                                            <ul className="space-y-1 list-disc list-inside text-sm pl-2">
                                                                {categoryModels.map((llm) => (
                                                                    <li key={llm.id} className="ml-2 flex items-center space-x-2 py-0.5">
                                                                        <span className="whitespace-nowrap">{llm.name}</span>
                                                                        {llm.status === 'preview' && <Badge variant="outline" className="text-xs px-1.5 py-0.5 text-orange-600 border-orange-600 flex-shrink-0">{t.page_BadgePreview}</Badge>}
                                                                        {llm.status === 'experimental' && <Badge variant="outline" className="text-xs px-1.5 py-0.5 text-yellow-600 border-yellow-600 flex-shrink-0">{t.page_BadgeExperimental}</Badge>}
                                                                        {llm.status === 'beta' && <Badge variant="outline" className="text-xs px-1.5 py-0.5 text-sky-600 border-sky-600 flex-shrink-0">{t.page_BadgeBeta}</Badge>}

                                                                        {llm.pricing.note ? (
                                                                            <TruncatableNote noteText={llm.pricing.note} />
                                                                        ) : (
                                                                            <span className="text-xs text-muted-foreground truncate min-w-0">
                                                                                (${formatPrice(llm.pricing.input)} / ${formatPrice(llm.pricing.output)} per 1M Tokens)
                                                                            </span>
                                                                        )}
                                                                        {isLanguageSupported(llm.provider, language.code, llm.id) ? (
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                                                                                </TooltipTrigger>
                                                                                <TooltipContent side="top">
                                                                                    <p className="text-xs">{t.page_TooltipSupportsLanguage.replace("{languageName}", language.nativeName)}</p>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        ) : (
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <X className="h-3 w-3 text-red-600 flex-shrink-0" />
                                                                                </TooltipTrigger>
                                                                                <TooltipContent side="top">
                                                                                    <p className="text-xs">{t.page_TooltipMayNotSupportLanguage.replace("{languageName}", language.nativeName)}</p>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        )}
                                                                        {llm.usesReasoningTokens && (
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Info className="h-4 w-4 text-blue-500 flex-shrink-0 cursor-help" />
                                                                                </TooltipTrigger>
                                                                                <TooltipContent side="top" className="w-auto max-w-[230px] p-2">
                                                                                    <p className="text-xs">
                                                                                        {llm.provider === 'Google'
                                                                                            ? t.page_TooltipGoogleThinkingBudget
                                                                                            : llm.provider === 'Anthropic'
                                                                                                ? t.page_TooltipAnthropicExtendedThinking
                                                                                                : llm.provider === 'xAI'
                                                                                                    ? t.page_TooltipXaiThinking
                                                                                                    : (llm.provider === 'TogetherAI' && llm.categoryKey?.includes('Qwen'))
                                                                                                        ? t.page_TooltipQwenReasoning
                                                                                                        : (llm.provider === 'TogetherAI' && llm.categoryKey?.includes('DeepSeek'))
                                                                                                            ? t.page_TooltipDeepSeekReasoning
                                                                                                            : t.page_TooltipGenericReasoning
                                                                                        }
                                                                                    </p>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        )}
                                                                        {llm.requiresOrgVerification && (
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 cursor-help"/>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent side="top" className="w-auto max-w-[200px] p-2">
                                                                                    <p className="text-xs">
                                                                                        {t.page_TooltipRequiresVerification.split("verify here")[0]}
                                                                                        <a
                                                                                            href="https://platform.openai.com/settings/organization/general"
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="underline text-blue-500 hover:text-blue-600 ml-1"
                                                                                        >
                                                                                            verify here
                                                                                        </a>
                                                                                        {t.page_TooltipRequiresVerification.split("verify here")[1]}
                                                                                    </p>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        )}
                                                                        
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </React.Fragment>
                                                )})}
                                            </CollapsibleContent>
                                        </Collapsible>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-center text-xl">
                                    <Volume2 className="mr-2 h-5 w-5" />
                                    {t.page_AvailableTTSTitle}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {availableTTSProviders.length > 0 ? (
                                    availableTTSProviders.map((provider) => {
                                        const providerCollapsibleId = `tts-provider-${provider.id.replace(/\s+/g, '-')}`;
                                        const isProviderOpen = openCollapsibles[providerCollapsibleId] ?? true;

                                        return (
                                            <Collapsible key={provider.id} open={isProviderOpen} onOpenChange={() => toggleCollapsible(providerCollapsibleId)} className="space-y-1">
                                                <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold mb-2 border-b pb-1 hover:bg-muted/50 p-2 rounded-md transition-colors focus-visible:ring-1 focus-visible:ring-ring">
                                                    <span>{provider.name}</span>
                                                    {isProviderOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="space-y-2 pl-4">
                                                    <ul className="space-y-1 list-disc list-inside text-sm">
                                                        {provider.models.map((model) => {
                                                            const supportsLanguage = isTTSModelLanguageSupported(model.id, language.code);
                                                            return (
                                                                <li key={model.id} className="ml-2 flex items-center space-x-2 py-0.5">
                                                                    <span className="whitespace-nowrap">{model.name}</span>
                                                                    <span className="text-xs text-muted-foreground truncate min-w-0" title={model.description}>({model.pricingText})</span>
                                                                    {supportsLanguage ? (
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="top">
                                                                                <p className="text-xs">{t.page_TooltipSupportsLanguage.replace("{languageName}", language.nativeName)}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    ) : (
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <X className="h-3 w-3 text-red-600 flex-shrink-0" />
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="top">
                                                                                <p className="text-xs">{t.page_TooltipMayNotSupportLanguage.replace("{languageName}", language.nativeName)}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    )}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        );
                                    })
                                ) : (
                                    <p className="text-center text-muted-foreground text-sm">{t.page_NoTTSOptions}</p>
                                )}
                            </CardContent>
                        </Card>
                    </TooltipProvider>
                )}
            </div>
        </main>
    );
}
