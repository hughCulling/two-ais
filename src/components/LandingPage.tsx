import React, { useState } from "react";
import { useTheme } from 'next-themes';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslation, TranslationKeys } from '@/lib/translations';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { groupLLMsByProvider, LLMInfo, groupModelsByCategory } from '@/lib/models';
import { AVAILABLE_TTS_PROVIDERS } from '@/lib/tts_models';
import { isLanguageSupported } from '@/lib/model-language-support';
import { isTTSModelLanguageSupported } from '@/lib/tts_models';
import { BrainCircuit, KeyRound, Volume2, AlertTriangle, Info, ChevronDown, ChevronRight, Check, X } from "lucide-react";
import { cn } from '@/lib/utils';

   // Replace these with your actual base64 strings!
   const BLUR_DATA_URL_LIGHT = "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAACwAQCdASoKAAgAAgA0JaQAAuaagDgAAP71Xb6d+314jsHrzm9ej3y/fZ6USdOktwc5p4Kcf/Pu2GbRDRTt7Cf7uf+fUeXfxA+CAnT/g9AxVkfMAAA=";
   const BLUR_DATA_URL_DARK = "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAACwAQCdASoKAAgAAgA0JaQAAsaV+nuAAP79uYWGrQjZy8mqFTDgNKT3aIxwozIHbCZA1zRZacB6ZcAA";

// TruncatableNote component for pricing notes
const TruncatableNote: React.FC<{ noteText: string; tooltipMaxWidth?: string }> = ({ noteText, tooltipMaxWidth = "max-w-xs" }) => {
  const [isActuallyOverflowing, setIsActuallyOverflowing] = React.useState(false);
  const textRef = React.useRef<HTMLSpanElement>(null);
  const { language } = useLanguage();
  const t = getTranslation(language.code) as TranslationKeys;
  React.useEffect(() => {
    const el = textRef.current;
    const checkOverflow = () => {
      if (el) setIsActuallyOverflowing(el.scrollWidth > el.clientWidth);
    };
    checkOverflow();
    let resizeObserver: ResizeObserver | null = null;
    if (el && typeof window !== 'undefined' && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(checkOverflow);
      resizeObserver.observe(el);
    }
    return () => { if (resizeObserver && el) resizeObserver.disconnect(); };
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
  if (categoryKey.startsWith('modelCategory_Gemma') || categoryKey === 'modelCategory_GoogleGemma') return 'Google';
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

// --- YouTube Facade Component ---
const YOUTUBE_VIDEO_ID_LIGHT = "52oUvRFdaXE";
const YOUTUBE_VIDEO_ID_DARK = "pkN_uU-nDdk";

const YouTubeFacade: React.FC<{ mode: "light" | "dark"; title: string }> = ({ mode, title }) => {
  const [isPlayerActive, setIsPlayerActive] = useState(false);
  // Use local webp images for LCP
  const thumbnail = mode === "dark" ? "/landing-dark.webp" : "/landing-light.webp";
  const blurDataURL = mode === "dark" ? BLUR_DATA_URL_DARK : BLUR_DATA_URL_LIGHT;
  const videoId = mode === "dark" ? YOUTUBE_VIDEO_ID_DARK : YOUTUBE_VIDEO_ID_LIGHT;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  return (
    <div className="w-full aspect-video overflow-hidden rounded-lg shadow-md border bg-black relative group">
      {isPlayerActive ? (
        <iframe
          className="w-full h-full"
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      ) : (
        <button
          type="button"
          className="w-full h-full flex items-center justify-center focus:outline-none relative"
          aria-label={`Play video: ${title}`}
          onClick={() => setIsPlayerActive(true)}
        >
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            fetchPriority="high"
            placeholder="blur"
            blurDataURL={blurDataURL}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            style={{ zIndex: 0 }}
          />
          <span className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" aria-hidden="true" style={{ zIndex: 1 }} />
          <svg
            className="relative z-10 h-16 w-16 text-white drop-shadow-lg group-hover:scale-110 transition-transform"
            viewBox="0 0 68 48"
            width="68"
            height="48"
            aria-hidden="true"
            style={{ zIndex: 2 }}
          >
            <path d="M66.52 7.85a8 8 0 0 0-5.6-5.66C57.12 1.33 34 1.33 34 1.33s-23.12 0-26.92 0a8 8 0 0 0-5.6 5.66A83.2 83.2 0 0 0 0 24a83.2 83.2 0 0 0 1.48 16.15 8 8 0 0 0 5.6 5.66c3.8 1.33 26.92 1.33 26.92 1.33s23.12 0 26.92-1.33a8 8 0 0 0 5.6-5.66A83.2 83.2 0 0 0 68 24a83.2 83.2 0 0 0-1.48-16.15z" fill="#f00" />
            <path d="M45 24 27 14v20z" fill="#fff" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default function LandingPage() {
  const { resolvedTheme } = useTheme();
  const { language } = useLanguage();
  const t = getTranslation(language.code) as TranslationKeys;
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
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
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
          <div className="w-full aspect-video overflow-hidden rounded-lg shadow-md border">
            <YouTubeFacade
              mode={resolvedTheme === 'dark' ? 'dark' : 'light'}
              title={t.page_VideoTitle}
            />
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
              {Object.entries(groupLLMsByProvider()).map(([providerName, providerModels]: [string, LLMInfo[]]) => {
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
                            const key = (m.categoryKey || 'modelCategory_OtherModels');
                            const translated = (key in t && typeof t[key as keyof typeof t] === "string") ? t[key as keyof typeof t] as string : key;
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
                                      <span
                                        className="text-xs text-muted-foreground truncate min-w-0"
                                        title={`$${formatPrice(llm.pricing.input)} / $${formatPrice(llm.pricing.output)} per 1M Tokens`}
                                      >
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
                                          <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 cursor-help" />
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
              <CardTitle className="flex items-center justify-center text-xl">
                <Volume2 className="mr-2 h-5 w-5" />
                {t.page_AvailableTTSTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {AVAILABLE_TTS_PROVIDERS.length > 0 ? (
                AVAILABLE_TTS_PROVIDERS.map((provider) => {
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
        </div>
      </TooltipProvider>
    </main>
  );
} 