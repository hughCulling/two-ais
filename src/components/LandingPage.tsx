"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from 'next-themes';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { groupLLMsByProvider, LLMInfo, groupModelsByCategory } from '@/lib/models';
import { AVAILABLE_TTS_PROVIDERS } from '@/lib/tts_models';
import { isLanguageSupported } from '@/lib/model-language-support';
import { isTTSModelLanguageSupported } from '@/lib/tts_models';
import { BrainCircuit, KeyRound, Volume2, AlertTriangle, Info, ChevronDown, ChevronRight, Check, X, Image as ImageIcon } from "lucide-react";
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useTranslation } from '@/hooks/useTranslation';
import { AVAILABLE_IMAGE_MODELS } from '@/lib/image_models';

   // Replace these with your actual base64 strings!
   const BLUR_DATA_URL_LIGHT = "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAACwAQCdASoKAAgAAgA0JaQAAuaagDgAAP71Xb6d+314jsHrzm9ej3y/fZ6USdOktwc5p4Kcf/Pu2GbRDRTt7Cf7uf+fUeXfxA+CAnT/g9AxVkfMAAA=";
   const BLUR_DATA_URL_DARK = "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAACwAQCdASoKAAgAAgA0JaQAAsaV+nuAAP79uYWGrQjZy8mqFTDgNKT3aIxwozIHbCZA1zRZacB6ZcAA";

// TruncatableNote component for pricing notes
const TruncatableNote: React.FC<{ noteText: string; tooltipMaxWidth?: string }> = ({ noteText, tooltipMaxWidth = "max-w-xs" }) => {
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
      {t.page_TruncatableNoteFormat.replace('{noteText}', noteText)}
    </span>
  );
  if (isActuallyOverflowing) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{noteSpan}</TooltipTrigger>
        <TooltipContent side="top" className={`w-auto p-2 ${tooltipMaxWidth}`}>
          <p className="text-xs">{noteText}</p>
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



const YouTubeFacade = dynamic(() => import('./YouTubeFacade'), { ssr: false });

interface LandingPageProps {
  nonce: string;
}

export default function LandingPage({ nonce }: LandingPageProps) {
  const { resolvedTheme } = useTheme();
  const { language } = useLanguage();
  const { t, loading } = useTranslation();
  const [mounted, setMounted] = useState(false); // <-- Add mounted state
  const [isPlayerActive, setIsPlayerActive] = useState(false);

  useEffect(() => {
    setMounted(true);
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
  if (loading || !t) return null;
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
            <Alert variant="default" className="text-left border-theme-primary/50">
              <KeyRound className="h-4 w-4 text-theme-primary" />
              <AlertTitle className="font-semibold">{t.page_ApiKeysRequiredTitle}</AlertTitle>
              <AlertDescription>
                {t.page_ApiKeysRequiredDescription}
              </AlertDescription>
            </Alert>
            <p className="text-muted-foreground pt-2">{t.page_SignInPrompt}</p>
          </div>
          <div className="w-full aspect-video overflow-hidden rounded-lg shadow-md border relative">
            {!isPlayerActive && (
              <>
                <Image
                  src="/landing-dark.webp"
                  alt={t.page_VideoTitle}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                  fetchPriority="high"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL_DARK}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  draggable={false}
                  style={{ zIndex: 0 }}
                />
                <Image
                  src="/landing-light.webp"
                  alt={t.page_VideoTitle}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                  fetchPriority="high"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL_LIGHT}
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                    mounted && resolvedTheme === 'light' ? "opacity-100" : "opacity-0"
                  )}
                  draggable={false}
                  style={{ zIndex: 1 }}
                />
              </>
            )}
            {mounted && (
              <YouTubeFacade
                mode={resolvedTheme === 'dark' ? 'dark' : 'light'}
                title={t.page_VideoTitle}
                isPlayerActive={isPlayerActive}
                onActivatePlayer={() => setIsPlayerActive(true)}
              />
            )}
          </div>
          <Card className="w-full">
            <CardHeader>
              <h2 className="flex items-center justify-center text-xl font-semibold">
                <BrainCircuit className="mr-2 h-5 w-5" />
                {t.page_AvailableLLMsTitle}
              </h2>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {t.page_PricesLastVerifiedOn.replace('{date}', '2025-06-04')}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(groupLLMsByProvider()).map(([providerName, providerModels]: [string, LLMInfo[]]) => {
                const { orderedCategories, byCategory: modelsByCategory } = groupModelsByCategory(providerModels, t);
                const providerCollapsibleId = `provider-${providerName.replace(/\s+/g, '-')}`;
                const isProviderOpen = openCollapsibles[providerCollapsibleId] ?? true;
                let lastDisplayedBrand: string | null = null;
                return (
                  <Collapsible key={providerName} open={isProviderOpen} onOpenChange={() => toggleCollapsible(providerCollapsibleId)} className="space-y-1">
                    <CollapsibleTrigger 
                      className="flex items-center justify-between w-full text-xl font-semibold mb-2 border-b pb-1 hover:bg-muted/50 p-2 rounded-md transition-colors focus-visible:ring-1 focus-visible:ring-ring"
                      aria-expanded={isProviderOpen}
                      aria-controls={`${providerCollapsibleId}-content`}
                      aria-label={`${isProviderOpen ? 'Collapse' : 'Expand'} ${providerName} models`}
                    >
                      <span>{providerName}</span>
                      {isProviderOpen ? <ChevronDown className="h-5 w-5" aria-hidden="true" /> : <ChevronRight className="h-5 w-5" aria-hidden="true" />}
                    </CollapsibleTrigger>
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
                              <div className="text-lg font-semibold text-primary mt-4 mb-2 border-b border-primary/30 pb-1 ml-0">
                                {currentBrandName}
                              </div>
                            );
                            lastDisplayedBrand = currentBrandName;
                          }
                        }
                        return (
                          <React.Fragment key={`${category}-${index}`}>
                            {brandHeadingElement}
                            <div className={cn("ml-2", brandHeadingElement ? "mt-1" : "mt-0")}>
                              <div className="text-md font-medium text-muted-foreground mb-1.5 mt-2 pb-0.5">{category}</div>
                              <ul className="space-y-1 list-disc list-inside text-sm pl-2">
                                {categoryModels.map((llm) => (
                                  <li key={llm.id} className="ml-2 flex items-center space-x-2 py-0.5">
                                    <span className="whitespace-nowrap">{llm.name}</span>
                                    {llm.status === 'preview' && <Badge variant="preview" className="text-xs px-1.5 py-0.5 flex-shrink-0">{t.page_BadgePreview}</Badge>}
                                    {llm.status === 'experimental' && <Badge variant="experimental" className="text-xs px-1.5 py-0.5 flex-shrink-0">{t.page_BadgeExperimental}</Badge>}
                                    {llm.status === 'beta' && <Badge variant="beta" className="text-xs px-1.5 py-0.5 flex-shrink-0">{t.page_BadgeBeta}</Badge>}
                                    {llm.pricing.note ? (
                                      <TruncatableNote noteText={llm.pricing.note} />
                                    ) : (
                                      <span
                                        className="text-xs text-muted-foreground truncate min-w-0"
                                        title={`$${formatPrice(llm.pricing.input)} / $${formatPrice(llm.pricing.output)} ${t.page_PricingPerTokens.replace('{amount}', '1M')}`}
                                      >
                                        (${formatPrice(llm.pricing.input)} / ${formatPrice(llm.pricing.output)} {t.page_PricingPerTokens.replace('{amount}', '1M')})
                                      </span>
                                    )}
                                    {isLanguageSupported(llm.provider, language.code, llm.id) ? (
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
                                          <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 cursor-help" />
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
                        className="flex items-center justify-between w-full text-lg font-semibold mb-2 border-b pb-1 hover:bg-muted/50 p-2 rounded-md transition-colors focus-visible:ring-1 focus-visible:ring-ring"
                        aria-expanded={isProviderOpen}
                        aria-controls={`${providerCollapsibleId}-content`}
                        aria-label={`${isProviderOpen ? 'Collapse' : 'Expand'} ${provider.name} TTS models`}
                      >
                        <span>{provider.name}</span>
                        {isProviderOpen ? <ChevronDown className="h-5 w-5" aria-hidden="true" /> : <ChevronRight className="h-5 w-5" aria-hidden="true" />}
                      </CollapsibleTrigger>
                      <CollapsibleContent 
                        id={`${providerCollapsibleId}-content`}
                        className="space-y-2 pl-4"
                        role="region"
                        aria-labelledby={`${providerCollapsibleId}-trigger`}
                      >
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
          <Card className="w-full">
            <CardHeader>
              <h2 className="flex items-center justify-center text-xl font-semibold">
                <ImageIcon className="mr-2 h-5 w-5" />
                {t.page_AvailableImageModelsTitle}
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {AVAILABLE_IMAGE_MODELS.length > 0 ? (
                AVAILABLE_IMAGE_MODELS.map((model) => (
                  <div key={model.id} className="border rounded-md p-4 bg-muted/30">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold text-lg mr-2">{model.name}</span>
                      <span className="text-xs text-muted-foreground">{model.provider}</span>
                      {model.status && (
                        <Badge variant={model.status} className="ml-2 text-xs px-1.5 py-0.5 flex-shrink-0">{model.status}</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">{model.description}</div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs border-collapse">
                        <thead>
                          <tr>
                            <th className="px-2 py-1 border-b text-left">Quality</th>
                            <th className="px-2 py-1 border-b text-left">Size</th>
                            <th className="px-2 py-1 border-b text-left">Price (USD)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {model.qualities.map(q => (
                            q.sizes.map(s => (
                              <tr key={q.quality + s.size}>
                                <td className="px-2 py-1">{q.quality.charAt(0).toUpperCase() + q.quality.slice(1)}</td>
                                <td className="px-2 py-1">{s.size}</td>
                                <td className="px-2 py-1">${s.price.toFixed(3)}</td>
                              </tr>
                            ))
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {model.pricingNote && (
                      <div className="text-xs text-muted-foreground mt-2">{model.pricingNote}</div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground text-sm">{'No image models available.'}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    </main>
  );
} 