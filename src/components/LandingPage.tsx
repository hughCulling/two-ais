"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
// import Image from 'next/image';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { groupLLMsByProvider, LLMInfo, groupModelsByCategory } from '@/lib/models';
import { AVAILABLE_TTS_PROVIDERS } from '@/lib/tts_models';
import { useOllama } from '@/hooks/useOllama';
import { isLanguageSupported } from '@/lib/model-language-support';
import { isTTSModelLanguageSupported, onVoicesLoaded } from '@/lib/tts_models';
import { BrainCircuit, KeyRound, Volume2, AlertTriangle, Info, ChevronDown, ChevronRight, Check, X, Calendar, ExternalLink } from "lucide-react";
import { cn } from '@/lib/utils';
// import dynamic from 'next/dynamic';
import { useTranslation } from '@/hooks/useTranslation';
// import { AVAILABLE_IMAGE_MODELS } from '@/lib/image_models';
// import type { ImageModelInfo } from '@/lib/image_models';
import { FreeTierBadge } from './ui/free-tier-badge';

   // Replace these with your actual base64 strings!
  //  const BLUR_DATA_URL_LIGHT = "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAACwAQCdASoKAAgAAgA0JaQAAuaagDgAAP71Xb6d+314jsHrzm9ej3y/fZ6USdOktwc5p4Kcf/Pu2GbRDRTt7Cf7uf+fUeXfxA+CAnT/g9AxVkfMAAA=";
  //  const BLUR_DATA_URL_DARK = "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAACwAQCdASoKAAgAAgA0JaQAAsaV+nuAAP79uYWGrQjZy8mqFTDgNKT3aIxwozIHbCZA1zRZacB6ZcAA";

// TruncatableNote component for pricing notes
import type { TranslationKeys } from '@/lib/translations';

const TruncatableNote: React.FC<{ 
  noteText: string | ((t: TranslationKeys) => string);
  tooltipMaxWidth?: string;
}> = ({ noteText, tooltipMaxWidth = "max-w-xs" }) => {
  const [isActuallyOverflowing, setIsActuallyOverflowing] = React.useState(false);
  const textRef = React.useRef<HTMLSpanElement>(null);
  const { t, loading } = useTranslation();
  
  React.useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    
    // Simple debounced overflow check
    let timeoutId: NodeJS.Timeout;
    const checkOverflow = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (el) {
          setIsActuallyOverflowing(el.scrollWidth > el.clientWidth);
        }
      }, 100); // Increased debounce time to reduce reflows
    };
    
    // Initial check
    checkOverflow();
    
    // Use ResizeObserver with debouncing
    let resizeObserver: ResizeObserver | null = null;
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(checkOverflow);
      resizeObserver.observe(el);
    }
    
    return () => { 
      clearTimeout(timeoutId);
      if (resizeObserver && el) resizeObserver.disconnect(); 
    };
  }, [noteText]);
  if (loading || !t) return null;
  const noteSpan = (
    <span
      ref={textRef}
      className={cn(
        "text-xs text-muted-foreground block truncate min-w-0",
        isActuallyOverflowing && "cursor-help"
      )}
    >
      {t.page_TruncatableNoteFormat.replace('{noteText}', typeof noteText === 'function' ? noteText(t) : noteText)}
    </span>
  );
  if (isActuallyOverflowing) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{noteSpan}</TooltipTrigger>
        <TooltipContent side="top" className={`w-auto p-2 ${tooltipMaxWidth}`}>
          <p className="text-xs">{typeof noteText === 'function' ? noteText(t) : noteText}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
  return noteSpan;
};

// Helper for TogetherAI brand headings
const getTogetherAIBrandDisplay = (categoryKey: string | undefined): string | null => {
  if (!categoryKey) return null;
  if (categoryKey.startsWith('modelCategory_Llama') || categoryKey === 'modelCategory_MetaLlama') return 'Meta';
  if (
    categoryKey.startsWith('modelCategory_Gemma') ||
    categoryKey === 'modelCategory_GoogleGemma' ||
    categoryKey === 'Gemma 3n model' ||
    categoryKey === 'modelCategory_Gemma3n' // Add this line for Gemma 3N
  ) return 'Google';
  if (categoryKey.startsWith('modelCategory_DeepSeek')) return 'DeepSeek';
  if (categoryKey.startsWith('modelCategory_Qwen') || categoryKey === 'modelCategory_QwQwQ') return 'Qwen';
  return null;
};

// Helper function to format pricing (restored from original)
const formatPrice = (price: number) => {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  });
};

// Helper to group image models by provider
// function groupImageModelsByProvider(imageModels: ImageModelInfo[]): Record<string, ImageModelInfo[]> {
//   const grouped: Record<string, ImageModelInfo[]> = {};
//   imageModels.forEach((model: ImageModelInfo) => {
//     if (!grouped[model.provider]) grouped[model.provider] = [];
//     grouped[model.provider].push(model);
//   });
//   return grouped;
// }

// const YouTubeFacade = dynamic(() => import('./YouTubeFacade'), { ssr: false });

interface LandingPageProps {
  nonce: string;
}

export default function LandingPage({ nonce }: LandingPageProps) {
  const { resolvedTheme } = useTheme();
  const { language } = useLanguage();
  const { t, loading } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { isAvailable: ollamaAvailable, isLoading: ollamaLoading } = useOllama();
  // const [isPlayerActive, setIsPlayerActive] = useState(false);

  // Redirect authenticated users to the app
  useEffect(() => {
    if (!authLoading && user) {
      console.log('LandingPage: User authenticated, redirecting to app...');
      router.push(`/${language.code}/app`);
    }
  }, [user, authLoading, router, language.code]);

  useEffect(() => {
    setMounted(true);
    
    // Listen for voice loading events to update UI (force re-render when voices load)
    onVoicesLoaded(() => {
      // Force a re-render to update language support indicators
      console.log('Browser voices loaded, updating UI');
      // Trigger a custom event that components can listen to
      window.dispatchEvent(new CustomEvent('voices-loaded'));
    });
  }, []); // <-- Set mounted after mount
  const [openCollapsibles, setOpenCollapsibles] = useState<Record<string, boolean>>(
    () => {
      const initialOpenState: Record<string, boolean> = {};
      Object.keys(groupLLMsByProvider()).forEach(provider => {
        initialOpenState[`provider-${provider.replace(/\s+/g, '-')}`] = true;
      });
      AVAILABLE_TTS_PROVIDERS.forEach(ttsProvider => {
        initialOpenState[`tts-provider-${ttsProvider.id.replace(/\s+/g, '-')}`] = true;
      });
      return initialOpenState;
    }
  );
  const toggleCollapsible = (id: string) => {
    setOpenCollapsibles(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  // Show nothing while loading translations
  if (loading || !t) return null;
  
  // Don't render landing page if user is authenticated (redirect is in progress)
  if (!authLoading && user) return null;
  if (user) return null;
  // const GPT_IMAGE_1_TOKEN_PRICING_TOOLTIP = t?.gptImage1PricingTooltip
  //   ? t.gptImage1PricingTooltip
  //       .replace('{inputPrice}', '$10.00')
  //       .replace('{cachedInputPrice}', '$2.50')
  //       .replace('{outputPrice}', '$40.00')
  //   : 'Token pricing for GPT Image 1:\nInput: $10.00 / 1 Million tokens\nCached input: $2.50 / 1 Million tokens\nOutput: $40.00 / 1 Million tokens\nNote: Per-image prices above are for output image tokens only. Input text/image tokens are billed separately.';
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": "Two AIs Conversation Demo",
            "description": "A demo of Two AIs, a platform for listening to conversations between two LLMs using TTS.",
            "thumbnailUrl": "https://www.two-ais.com/landing-light.webp",
            "uploadDate": "2025-04-29T14:12:00+01:00",
            "contentUrl": "https://www.youtube.com/watch?v=52oUvRFdaXE",
            "embedUrl": "https://www.youtube.com/embed/52oUvRFdaXE?si=1RKDtEhp62ppXPVv",
            "publisher": {
              "name": "Two AIs",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.two-ais.com/icon.png"
              }
            }
          })
        }}
      />
      <TooltipProvider delayDuration={100}>
        <div className="w-full max-w-3xl flex flex-col items-center space-y-8 flex-grow pt-8 md:pt-12">
          <div className="p-6 bg-card text-card-foreground rounded-lg shadow-md space-y-4 text-center w-full">
            <h1 className="text-2xl font-bold">{t.page_WelcomeTitle}</h1>
            <p className="text-muted-foreground">{t.page_WelcomeSubtitle}</p>
            <div className="border border-theme-primary/50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <KeyRound className="h-4 w-4 text-theme-primary" />
                <h3 className="font-semibold text-base">{t.page_ApiKeysRequiredTitle}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t.page_ApiKeysRequiredDescription.split('{settingsLink}')[0]}
                <span className="text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap">
                  settings/api-key
                </span>
                {t.page_ApiKeysRequiredDescription.split('{settingsLink}')[1]}
              </p>
            </div>
            
            {/* Ollama Status */}
            {!ollamaLoading && ollamaAvailable && (
              <div className="border border-green-500/50 bg-green-50 dark:bg-green-950/20 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <h3 className="font-semibold text-base text-green-900 dark:text-green-100">{t.page_OllamaDetectedTitle}</h3>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200">
                  You can use LLMs through Ollama.
                </p>
              </div>
            )}
            {!ollamaLoading && !ollamaAvailable && (
              <div className="border border-blue-500/50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-base">{t.page_OllamaSetupTitle}</h3>
                </div>
                <div>
                  <div className="space-y-2">
                    <p>
                      {t.page_OllamaSetupDescription.split('{learnMoreLink}')[0]}
                      <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium underline inline-flex items-center gap-1">
                        {t.page_OllamaLearnMore}
                        <ExternalLink className="h-3 w-3" aria-label="(opens in new tab)" />
                      </a>
                    </p>
                    <div className="text-sm space-y-1 mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                      <p className="font-semibold">{t.page_OllamaSetupInstructions}:</p>
                      <p>
                        {t.page_OllamaStep1.split('ollama.com/download')[0]}
                        <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium underline inline-flex items-center gap-1">
                          ollama.com/download.
                          <ExternalLink className="h-3 w-3" aria-label="(opens in new tab)" />
                        </a>
                        {t.page_OllamaStep1.split('ollama.com/download.')[1]}
                      </p>
                      <p>
                        {t.page_OllamaStep2.split("'ollama pull llama2'")[0]}
                        <span className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 p-1 rounded">ollama pull llama2</span>
                        {t.page_OllamaStep2.split("'ollama pull llama2'")[1]}
                      </p>
                      <p>
                        <span>3. Then you can run this command in your terminal to allow Two AIs to connect to your local Ollama instance:</span>
                      </p>
                      <p className="ml-4">
                        <span className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 p-1 rounded inline-block">
                          {t.page_OllamaStep3.replace(/^3\.\s*/, '')}
                        </span>
                      </p>
                      <p>{t.page_OllamaStep4}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-muted-foreground pt-2">{t.page_SignInPrompt}</p>
          </div>
          <div className="w-full aspect-video overflow-hidden rounded-lg shadow-md border relative">
            {mounted && (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${resolvedTheme === 'dark' ? 'pkN_uU-nDdk' : '52oUvRFdaXE'}`}
                title={t.page_VideoTitle}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              ></iframe>
            )}
          </div>
          <Card className="w-full">
            <CardHeader>
              <h2 className="flex items-center justify-center text-xl font-semibold">
                <BrainCircuit className="mr-2 h-5 w-5" />
                {t.page_AvailableLLMsTitle}
              </h2>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {t.page_PricesLastVerifiedOn.replace('{date}', '2025-11-12')}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(groupLLMsByProvider()).map(([providerName, providerModels]: [string, LLMInfo[]]) => {
                const { orderedCategories, byCategory: modelsByCategory } = groupModelsByCategory(providerModels, t);
                const providerCollapsibleId = `provider-${providerName.replace(/\s+/g, '-')}`;
                const isProviderOpen = openCollapsibles[providerCollapsibleId] ?? true;
                let lastDisplayedBrand: string | null = null;
                
                // Check if all models in this provider support the current language
                const allModelsSupport = providerModels.every(llm => 
                  isLanguageSupported(llm.provider, language.code, llm.id)
                );
                
                return (
                  <Collapsible key={providerName} open={isProviderOpen} onOpenChange={() => toggleCollapsible(providerCollapsibleId)} className="space-y-1">
                    <div className="flex items-center justify-center w-full mb-2">
                      <CollapsibleTrigger 
                        className="relative flex items-center justify-center w-full text-xl font-semibold border-b pb-1 hover:bg-muted/50 p-2 rounded-md transition-colors focus-visible:ring-1 focus-visible:ring-ring"
                        aria-expanded={isProviderOpen}
                        aria-controls={`${providerCollapsibleId}-content`}
                        aria-label={`${isProviderOpen ? 'Collapse' : 'Expand'} ${providerName} models`}
                      >
                        <div className="relative inline-flex items-center">
                          <span>{providerName}</span>
                          <div className="absolute left-full ml-2 flex items-center gap-2 whitespace-nowrap">
                            {providerName === 'Mistral AI' && (
                              <FreeTierBadge 
                                freeTier={{
                                  available: true,
                                  note: (t) => t.pricing.mistralFreeTierNote
                                }} 
                                t={t} 
                              />
                            )}
                            {providerName === 'Ollama' && (
                              <FreeTierBadge 
                                freeTier={{
                                  available: true,
                                  note: (t) => t.pricing.ollamaFreeTierNote
                                }} 
                                t={t} 
                              />
                            )}
                            {allModelsSupport && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Check className="h-4 w-4 text-green-700 dark:text-green-300 flex-shrink-0" />
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p className="text-xs">{t.page_TooltipSupportsLanguage.replace("{languageName}", language.nativeName)}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                        <div className="absolute right-2">
                          {isProviderOpen ? <ChevronDown className="h-5 w-5" aria-hidden="true" /> : <ChevronRight className="h-5 w-5" aria-hidden="true" />}
                        </div>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent 
                      id={`${providerCollapsibleId}-content`}
                      className="space-y-3 pl-2 pt-1"
                      role="region"
                      aria-labelledby={`${providerCollapsibleId}-trigger`}
                    >
                      {orderedCategories.map((category, index) => {
                        const categoryModels = modelsByCategory[category];
                        if (!categoryModels) return null;
                        let brandHeadingElement = null;
                        if (providerName === 'TogetherAI') {
                          // Use the same translation logic as groupModelsByCategory for category matching
                          const modelCategoryKey = providerModels.find(m => {
                            let translatedCategory: string;
                            if (m.categoryKey === 'claude4_temp') {
                              translatedCategory = t.page_ModelCategoryModels.replace('{model}', 'Claude 4');
                            } else if (m.categoryKey === 'modelCategory_Grok4') {
                              translatedCategory = t.page_ModelCategoryModels.replace('{model}', 'Grok 4');
                            // } else if (m.categoryKey === 'modelCategory_Gemma3n') {
                            //   translatedCategory = t.page_ModelCategoryModels.replace('{model}', 'Gemma 3n');
                            } else {
                              const maybeTranslation = (m.categoryKey && m.categoryKey in t)
                                ? t[m.categoryKey as keyof typeof t]
                                : undefined;
                              translatedCategory = (typeof maybeTranslation === 'string') ? maybeTranslation : (m.categoryKey || 'modelCategory_OtherModels');
                            }
                            return translatedCategory === category;
                          })?.categoryKey;
                          const currentBrandName = modelCategoryKey ? getTogetherAIBrandDisplay(modelCategoryKey) : null;
                          if (currentBrandName && currentBrandName !== lastDisplayedBrand) {
                            brandHeadingElement = (
                              <div className="text-lg font-semibold text-primary mt-4 mb-2 border-b border-primary/30 pb-1 text-center">
                                {currentBrandName}
                              </div>
                            );
                            lastDisplayedBrand = currentBrandName;
                          }
                        }
                        return (
                          <React.Fragment key={`${category}-${index}`}>
                            {brandHeadingElement}
                            <div className={cn("flex flex-col items-center", brandHeadingElement ? "mt-1" : "mt-0")}>
                              <div className="text-md font-medium text-muted-foreground mb-1.5 mt-2 pb-0.5 text-center">{category}</div>
                              <ul className="space-y-1 text-sm w-full max-w-2xl">
                                {categoryModels.map((llm) => (
                                  <li key={llm.id} className="flex flex-col items-center py-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="whitespace-nowrap font-medium">{llm.name}</span>
                                      {llm.status === 'preview' && <Badge variant="preview" className="text-xs px-1.5 py-0.5 flex-shrink-0">{t.page_BadgePreview}</Badge>}
                                      {llm.status === 'experimental' && <Badge variant="experimental" className="text-xs px-1.5 py-0.5 flex-shrink-0">{t.page_BadgeExperimental}</Badge>}
                                      {llm.status === 'beta' && <Badge variant="beta" className="text-xs px-1.5 py-0.5 flex-shrink-0">{t.page_BadgeBeta}</Badge>}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                    {/* {llm.pricing?.freeTier?.available && <FreeTierBadge freeTier={llm.pricing.freeTier} t={t} className="ml-0.5" />} */}
                                    {/* Don't show pricing for Ollama models - it's shown in the provider header */}
                                    {llm.provider !== 'Ollama' && (llm.pricing.note ? (
                                      <TruncatableNote noteText={llm.pricing.note} />
                                    ) : (
                                      <span
                                        className="text-xs text-muted-foreground truncate min-w-0"
                                        title={`$${formatPrice(llm.pricing.input)} / $${formatPrice(llm.pricing.output)} ${t.page_PricingPerTokens.replace('{amount}', '1M')}`}
                                      >
                                        (${formatPrice(llm.pricing.input)} / ${formatPrice(llm.pricing.output)} {t.page_PricingPerTokens.replace('{amount}', '1M')})
                                      </span>
                                    ))}
                                    {/* Only show language support icon on individual models if not all models support the language */}
                                    {!allModelsSupport && (
                                      isLanguageSupported(llm.provider, language.code, llm.id) ? (
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Check className="h-3 w-3 text-green-700 dark:text-green-300 flex-shrink-0" />
                                          </TooltipTrigger>
                                          <TooltipContent side="top">
                                            <p className="text-xs">{t.page_TooltipSupportsLanguage.replace("{languageName}", language.nativeName)}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      ) : (
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <X className="h-3 w-3 text-red-700 dark:text-red-300 flex-shrink-0" />
                                          </TooltipTrigger>
                                          <TooltipContent side="top">
                                            <p className="text-xs">{t.page_TooltipMayNotSupportLanguage.replace("{languageName}", language.nativeName)}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      )
                                    )}
                                    {llm.usesReasoningTokens && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />
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
                                          <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="w-auto max-w-[200px] p-2">
                                          <p className="text-xs">
                                            {t.page_TooltipRequiresVerification.split("verify here")[0]}
                                            <a
                                              href="https://platform.openai.com/settings/organization/general"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="underline text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 ml-1"
                                            >
                                              {t.common_verifyHere}
                                            </a>
                                            {t.page_TooltipRequiresVerification.split("verify here")[1]}
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    )}
                                    {llm.pricing?.freeTier?.available && llm.provider !== 'Mistral AI' && llm.provider !== 'Ollama' && <FreeTierBadge freeTier={llm.pricing.freeTier} t={t} className="ml-0.5" />}
                                    {llm.knowledgeCutoff && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="flex items-center text-xs text-muted-foreground ml-2 max-w-[120px] overflow-hidden">
                                            <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                                            <span className="truncate" title={llm.knowledgeCutoff}>
                                              {llm.knowledgeCutoff}
                                            </span>
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                          <p className="text-xs">{t.page_TooltipKnowledgeCutoff}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    )}
                                    {/* {llm.pricing?.freeTier?.available && <FreeTierBadge freeTier={llm.pricing.freeTier} t={t} className="ml-0.5" />} */}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <h2 className="flex items-center justify-center text-xl font-semibold">
                <Volume2 className="mr-2 h-5 w-5" />
                {t.page_AvailableTTSTitle}
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {AVAILABLE_TTS_PROVIDERS.length > 0 ? (
                AVAILABLE_TTS_PROVIDERS.map((provider) => {
                  const providerCollapsibleId = `tts-provider-${provider.id.replace(/\s+/g, '-')}`;
                  const isProviderOpen = openCollapsibles[providerCollapsibleId] ?? true;
                  return (
                    <Collapsible key={provider.id} open={isProviderOpen} onOpenChange={() => toggleCollapsible(providerCollapsibleId)} className="space-y-1">
                      <CollapsibleTrigger 
                        className="relative flex items-center justify-center w-full text-lg font-semibold mb-2 border-b pb-1 hover:bg-muted/50 p-2 rounded-md transition-colors focus-visible:ring-1 focus-visible:ring-ring"
                        aria-expanded={isProviderOpen}
                        aria-controls={`${providerCollapsibleId}-content`}
                        aria-label={`${isProviderOpen ? 'Collapse' : 'Expand'} ${provider.name} TTS models`}
                      >
                        <span>{provider.name}</span>
                        <div className="absolute right-2">
                          {isProviderOpen ? <ChevronDown className="h-5 w-5" aria-hidden="true" /> : <ChevronRight className="h-5 w-5" aria-hidden="true" />}
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent 
                        id={`${providerCollapsibleId}-content`}
                        className="space-y-2 flex flex-col items-center"
                        role="region"
                        aria-labelledby={`${providerCollapsibleId}-trigger`}
                      >
                        <ul className="space-y-1 text-sm w-full max-w-2xl">
                          {provider.models.map((model) => {
                            const supportsLanguage = isTTSModelLanguageSupported(model.id, language.code);
                            return (
                              <li key={model.id} className="flex items-center justify-center space-x-2 py-0.5">
                                <div className="flex items-center space-x-1">
                                  <span className="whitespace-nowrap">{model.name}</span>
                                  {/* {model.freeTier?.available && (
                                    <FreeTierBadge
                                      freeTier={model.freeTier}
                                      t={t}
                                      className="ml-1"
                                    />
                                  )} */}
                                </div>
                                <span className="text-xs text-muted-foreground truncate min-w-0" title={model.description}>({typeof model.pricingText === 'function' ? (t ? model.pricingText(t) : 'Loading...') : model.pricingText})</span>
                                {supportsLanguage ? (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Check className="h-3 w-3 text-green-700 dark:text-green-300 flex-shrink-0" />
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                      <p className="text-xs">{t.page_TooltipSupportsLanguage.replace("{languageName}", language.nativeName)}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                ) : (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <X className="h-3 w-3 text-red-700 dark:text-red-300 flex-shrink-0" />
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                      <p className="text-xs">{t.page_TooltipMayNotSupportLanguage.replace("{languageName}", language.nativeName)}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                                {model.freeTier?.available && (
                                    <FreeTierBadge
                                      freeTier={model.freeTier}
                                      t={t}
                                      className="ml-1"
                                    />
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

          {/* IMAGE MODELS SECTION */}
          {/* <Card className="w-full">
            <CardHeader>
              <h2 className="flex items-center justify-center text-xl font-semibold">
                <ImageIcon className="mr-2 h-5 w-5" />
                {t.page_AvailableImageModelsTitle}
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {AVAILABLE_IMAGE_MODELS.length > 0 ? (
                Object.entries(groupImageModelsByProvider(AVAILABLE_IMAGE_MODELS)).map(([providerName, models]) => {
                  const typedModels = models as ImageModelInfo[];
                  const providerCollapsibleId = `image-provider-${providerName.replace(/\s+/g, '-')}`;
                  const isProviderOpen = openCollapsibles[providerCollapsibleId] ?? true;
                  return (
                    <Collapsible key={providerName} open={isProviderOpen} onOpenChange={() => toggleCollapsible(providerCollapsibleId)} className="space-y-1">
                      <CollapsibleTrigger
                        className="flex items-center justify-between w-full text-lg font-semibold mb-2 border-b pb-1 hover:bg-muted/50 p-2 rounded-md transition-colors focus-visible:ring-1 focus-visible:ring-ring"
                        aria-expanded={isProviderOpen}
                        aria-controls={`${providerCollapsibleId}-content`}
                        aria-label={`${isProviderOpen ? 'Collapse' : 'Expand'} ${providerName} image models`}
                      >
                        <span>{providerName}</span>
                        {isProviderOpen ? <ChevronDown className="h-5 w-5" aria-hidden="true" /> : <ChevronRight className="h-5 w-5" aria-hidden="true" />}
                      </CollapsibleTrigger>
                      <CollapsibleContent
                        id={`${providerCollapsibleId}-content`}
                        className="space-y-4 pl-2 pt-1"
                        role="region"
                        aria-labelledby={`${providerCollapsibleId}-trigger`}
                      >
                        {typedModels.map((model: ImageModelInfo) => (
                          <div key={model.id} className="border rounded-md p-4 bg-muted/30">
                            <div className="flex items-center mb-2">
                              <span className="font-semibold text-lg mr-2">{model.name}</span>
                              {model.id === 'gpt-image-1' && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-blue-500 flex-shrink-0 cursor-help ml-1" />
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="w-auto max-w-[260px] p-2">
                                    <p className="text-xs whitespace-pre-line">{GPT_IMAGE_1_TOKEN_PRICING_TOOLTIP}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {model.requiresOrgVerification && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 cursor-help ml-1" />
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="w-auto max-w-[200px] p-2">
                                    <p className="text-xs">
                                      {t.page_TooltipRequiresVerification.split("verify here")[0]}
                                      <a
                                        href="https://platform.openai.com/settings/organization/general"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 ml-1"
                                      >
                                        {t.common_verifyHere}
                                      </a>
                                      {t.page_TooltipRequiresVerification.split("verify here")[1]}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {model.status && (
                                <Badge variant={model.status} className="ml-2 text-xs px-1.5 py-0.5 flex-shrink-0">
                                  {(() => {
                                    if (!t) return model.status;
                                    const translationKey = `page_Badge${model.status.charAt(0).toUpperCase() + model.status.slice(1)}`;
                                    const translation = t[translationKey as keyof typeof t];
                                    return typeof translation === 'string' ? translation : model.status;
                                  })()}
                                </Badge>
                              )}
                            </div>
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-xs border-collapse">
                                <thead>
                                  <tr>
                                    {model.qualities.some(q => q.quality) && (
                                      <th className="px-2 py-1 border-b text-left">{t.imageModel_Quality}</th>
                                    )}
                                    <th className="px-2 py-1 border-b text-left">{t.imageModel_Size}</th>
                                    <th className="px-2 py-1 border-b text-left">{t.imageModel_PriceUSD}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {model.qualities.map((q) => (
                                    q.sizes.map((s) => (
                                      <tr key={`${q.quality || 'standard'}-${s.size}`}>
                                        {model.qualities.some(q => q.quality) && (
                                          <td className="px-2 py-1">
                                            {q.quality && (
                                              t?.imageQuality?.[q.quality as keyof typeof t.imageQuality] || 
                                              q.quality.charAt(0).toUpperCase() + q.quality.slice(1)
                                            )}
                                          </td>
                                        )}
                                        <td className="px-2 py-1">{s.size}</td>
                                        <td className="px-2 py-1">${s.price.toFixed(3)}</td>
                                      </tr>
                                    ))
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })
              ) : (
                <p className="text-center text-muted-foreground text-sm">{'No image models available.'}</p>
              )}
            </CardContent>
          </Card> */}
        </div>
      </TooltipProvider>
    </main>
  );
} 