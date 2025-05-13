// src/app/page.tsx
// Main page: Shows welcome/login prompt, SessionSetupForm, or ChatInterface.

'use client';

import React, { useState, useEffect, useRef } from 'react'; 
import { useAuth } from '@/context/AuthContext';
import SessionSetupForm from '@/components/session/SessionSetupForm';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { db } from '@/lib/firebase/clientApp';
import { doc, getDoc, FirestoreError } from 'firebase/firestore';
// --- Import Theme hook ---
import { useTheme } from 'next-themes'; 
// --- Import Tooltip components ---
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
// --- Import required icons ---
import { AlertCircle, BrainCircuit, KeyRound, Volume2, AlertTriangle, Info, ChevronDown, ChevronRight } from "lucide-react"; 
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
import { AVAILABLE_TTS_PROVIDERS } from '@/lib/tts_models';
// --- Import Collapsible components ---
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils'; 

// --- Define TTS Types (Locally) ---
type LocalTTSProviderId = 'none' | 'browser' | 'openai' | 'google' | 'elevenlabs';
interface AgentTTSSettings { provider: LocalTTSProviderId; voice: string | null; }

// --- Updated SessionConfig Interface ---
interface SessionConfig {
    agentA_llm: string;
    agentB_llm: string;
    ttsEnabled: boolean;
    agentA_tts: AgentTTSSettings;
    agentB_tts: AgentTTSSettings;
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
const availableTTS = AVAILABLE_TTS_PROVIDERS;

// --- YouTube Video URLs ---
const YOUTUBE_VIDEO_URL_LIGHT_MODE = "https://www.youtube.com/embed/52oUvRFdaXE"; 
const YOUTUBE_VIDEO_URL_DARK_MODE = "https://www.youtube.com/watch?v=wLhDRFsTPGQ&t=1s"; 

// Helper function to format pricing
const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 3,
    });
};

// Helper function to group models by category within a provider
const groupModelsByCategory = (models: LLMInfo[]): { orderedCategories: string[], byCategory: Record<string, LLMInfo[]> } => {
    const openAICategoryOrder = [ 
        'Flagship chat models',
        'Reasoning models',
        'Cost-optimized models',
        'Older GPT models',
    ];
    const googleCategoryOrder = [
        'Gemini 2.5 Series',
        'Gemini 2.0 Series',
        'Gemini 1.5 Series',
    ];
    const anthropicCategoryOrder = [ 
        'Claude 3.7 Series',
        'Claude 3.5 Series',
        'Claude 3 Series',
    ];
    const xAICategoryOrder = [ 
        'Grok 3 Series',
        'Grok 3 Mini Series',
    ];
    const togetherAICategoryOrder = [ 
        // Meta Llama Models - ordered by version/type
        'Llama 4 Series',
        'Llama 3.3 Series',
        'Llama 3.2 Series',
        'Llama 3.1 Series',
        'Llama 3 Series',
        'Llama Vision Models', 
        // Google Gemma Models
        'Gemma 2 Series',   
        'Gemma Series',     
        'Meta Llama Models', // Fallback for any other Meta models if not fitting a series
    ];


    const byCategory: Record<string, LLMInfo[]> = {};

    models.forEach(model => {
        const category = model.category || 'Other Models'; 
        if (!byCategory[category]) {
            byCategory[category] = [];
        }
        byCategory[category].push(model);
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

    if (currentProviderOrder.length > 0) {
        const orderedKeysFromProviderList = currentProviderOrder.filter(cat => byCategory[cat]);
        const remainingKeys = orderedCategories.filter(cat => !currentProviderOrder.includes(cat) && cat !== 'Other Models').sort();
        orderedCategories = [...orderedKeysFromProviderList, ...remainingKeys];
        if (byCategory['Other Models'] && !orderedCategories.includes('Other Models')) {
            orderedCategories.push('Other Models'); 
        }
    } else { 
        orderedCategories.sort((a, b) => {
            if (a === 'Other Models') return 1; 
            if (b === 'Other Models') return -1;
            return a.localeCompare(b);
        });
    }
    
    orderedCategories.forEach(cat => {
        if (byCategory[cat]) { 
            byCategory[cat].sort((a, b) => a.name.localeCompare(b.name));
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
            ({noteText})
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
const getTogetherAIBrandDisplay = (categoryName: string): string | null => {
    if (categoryName.startsWith('Llama') || categoryName.includes('Meta Llama')) return 'Meta Llama';
    if (categoryName.startsWith('Gemma') || categoryName.includes('Google Gemma')) return 'Google Gemma';
    // Add other brand checks here if you add more model families from TogetherAI (e.g., Qwen, DeepSeek)
    return null; 
};


export default function Page() {
    const { user, loading: authLoading } = useAuth();
    const { resolvedTheme } = useTheme(); 

    const [isStartingSession, setIsStartingSession] = useState(false);
    const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [userApiSecrets, setUserApiSecrets] = useState<{ [key: string]: string } | null>(null);
    const [secretsLoading, setSecretsLoading] = useState(true);
    const [pageError, setPageError] = useState<string | null>(null);
    const [currentVideoUrl, setCurrentVideoUrl] = useState(YOUTUBE_VIDEO_URL_LIGHT_MODE); 
    const [openCollapsibles, setOpenCollapsibles] = useState<Record<string, boolean>>(
        Object.keys(groupedLLMsByProvider).reduce((acc, provider) => {
            acc[`provider-${provider.replace(/\s+/g, '-')}`] = true;
            return acc;
        }, {} as Record<string, boolean>)
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
                    setPageError(`Failed to load user data: ${err.message}. Please try refreshing.`);
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
    }, [user, userApiSecrets, secretsLoading]);

    useEffect(() => {
        if (resolvedTheme) {
            setCurrentVideoUrl(resolvedTheme === 'dark' ? YOUTUBE_VIDEO_URL_DARK_MODE : YOUTUBE_VIDEO_URL_LIGHT_MODE);
        }
    }, [resolvedTheme]); 


    const handleStartSession = async (config: SessionConfig) => {
        if (!user) {
            setPageError("User not found. Please sign in again."); return;
        }
        if (userApiSecrets === null) {
            setPageError("User API key configuration could not be loaded. Please refresh or check settings."); return;
        }
        logger.info("Attempting to start session via API with full config:", config);
        setIsStartingSession(true);
        setPageError(null);
        setSessionConfig(null);
        setActiveConversationId(null);
        try {
            const idToken = await user.getIdToken();
            logger.info("Obtained ID Token for API call.");
            const response = await fetch('/api/conversation/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
                body: JSON.stringify(config),
            });
            if (!response.ok) {
                let errorMsg = `API Error: ${response.status} ${response.statusText}`;
                try { const errorData = await response.json(); errorMsg = errorData.error || errorMsg; }
                catch (parseError) { logger.warn("Could not parse error response JSON:", parseError); errorMsg = `API Error: ${response.status} ${response.statusText}`; }
                throw new Error(errorMsg);
            }
            const result: StartApiResponse = await response.json();
            logger.info("API Response received:", result);
            if (!result.conversationId) { throw new Error("API response successful but did not include a conversationId."); }
            logger.info(`Session setup successful via API. Conversation ID: ${result.conversationId}`);
            setSessionConfig(config);
            setActiveConversationId(result.conversationId);
        } catch (error) {
            logger.error("Failed to start session:", error);
            setPageError(`Error starting session: ${error instanceof Error ? error.message : String(error)}`);
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
                <p className="text-muted-foreground animate-pulse">Loading user data...</p>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
            {pageError && (
                 <Alert variant="destructive" className="mb-6 max-w-3xl w-full flex-shrink-0">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{pageError}</AlertDescription>
                </Alert>
            )}
            <div className="w-full max-w-3xl flex flex-col items-center space-y-8 flex-grow pt-8 md:pt-12">
                {user ? (
                    !sessionConfig || !activeConversationId ? (
                         <SessionSetupForm
                             onStartSession={handleStartSession}
                             isLoading={isStartingSession}
                         />
                    ) : (
                        <ChatInterface
                            conversationId={activeConversationId}
                            onConversationStopped={handleConversationStopped}
                        />
                    )
                ) : (
                    <TooltipProvider delayDuration={100}>
                        <div className="p-6 bg-card text-card-foreground rounded-lg shadow-md space-y-4 text-center w-full">
                             <h1 className="text-2xl font-bold">Welcome to Two AIs</h1>
                             <p className="text-muted-foreground">This website lets you listen to conversations between two LLMs.</p>
                             <Alert variant="default" className="text-left border-theme-primary/50">
                                <KeyRound className="h-4 w-4 text-theme-primary" />
                                <AlertTitle className="font-semibold">API Keys Required</AlertTitle>
                                <AlertDescription>
                                    To run conversations, you'll need to provide your own API keys for the AI models you wish to use (e.g., OpenAI, Google AI, Anthropic) after signing in.
                                    {' '}Detailed instructions for each provider can be found on the Settings / API Keys page after signing in.
                                </AlertDescription>
                             </Alert>
                             <p className="text-muted-foreground pt-2">To start your own session, you can sign in or create an account using the link in the header.</p>
                        </div>

                        <div className="w-full aspect-video overflow-hidden rounded-lg shadow-md border">
                            <iframe
                                className="w-full h-full"
                                key={currentVideoUrl} 
                                src={currentVideoUrl}
                                title="Two AIs Conversation Demo"
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
                                    Currently Available LLMs
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {Object.entries(groupedLLMsByProvider).map(([providerName, providerModels]: [string, LLMInfo[]]) => {
                                    const { orderedCategories, byCategory: modelsByCategory } = groupModelsByCategory(providerModels);
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
                                                        const currentBrandName = getTogetherAIBrandDisplay(category); 
                                                        if (currentBrandName && currentBrandName !== lastDisplayedBrand) {
                                                            brandHeadingElement = (
                                                                <h4 className="text-lg font-semibold text-primary mt-4 mb-2 border-b border-primary/30 pb-1 ml-0"> 
                                                                    {currentBrandName} Models
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
                                                                {categoryModels.map((llm) => {
                                                                    let displayName = llm.name;
                                                                    if (providerName === 'TogetherAI' && lastDisplayedBrand) {
                                                                        if (lastDisplayedBrand === 'Meta Llama' && (llm.name.toLowerCase().startsWith('meta llama') || llm.name.toLowerCase().startsWith('llama '))) {
                                                                            displayName = llm.name.replace(/^(meta\s+llama\s+|llama\s+)/i, '');
                                                                        } else if (lastDisplayedBrand === 'Google Gemma' && llm.name.toLowerCase().startsWith('gemma')) {
                                                                            displayName = llm.name.replace(/^gemma\s*-?\s*/i, '');
                                                                        }
                                                                    }

                                                                    return (
                                                                    <li key={llm.id} className="ml-2 flex items-center space-x-2 py-0.5">
                                                                        {llm.usesReasoningTokens && (
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Info className="h-4 w-4 text-blue-500 flex-shrink-0 cursor-help" />
                                                                                </TooltipTrigger>
                                                                                <TooltipContent side="top" className="w-auto max-w-[230px] p-2"> 
                                                                                    <p className="text-xs"> 
                                                                                        {llm.provider === 'Google' 
                                                                                            ? "This Google model uses a 'thinking budget'. The 'thinking' output is billed but is not visible in the chat."
                                                                                            : llm.provider === 'Anthropic'
                                                                                                ? "This Anthropic model uses 'extended thinking'. The 'thinking' output is billed but may not be visible in the chat."
                                                                                                : llm.provider === 'xAI' 
                                                                                                    ? "This xAI model uses 'thinking'. Thinking traces may be accessible and output is billed."
                                                                                                    : 'This model uses reasoning tokens that are not visible in the chat but are billed as output tokens.'
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
                                                                                        Requires verified OpenAI organization. You can
                                                                                        <a
                                                                                            href="https://platform.openai.com/settings/organization/general"
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="underline text-blue-500 hover:text-blue-600 ml-1"
                                                                                        >
                                                                                            verify here
                                                                                        </a>
                                                                                        .
                                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                                        <span className="whitespace-nowrap">{displayName}</span> 
                                                                        {llm.status === 'preview' && <Badge variant="outline" className="text-xs px-1.5 py-0.5 text-orange-600 border-orange-600 flex-shrink-0">Preview</Badge>} 
                                                                        {llm.status === 'experimental' && <Badge variant="outline" className="text-xs px-1.5 py-0.5 text-yellow-600 border-yellow-600 flex-shrink-0">Experimental</Badge>} 
                                                                        {llm.status === 'beta' && <Badge variant="outline" className="text-xs px-1.5 py-0.5 text-sky-600 border-sky-600 flex-shrink-0">Beta</Badge>} 
                                                                        
                                                                        {llm.pricing.note ? (
                                                                            <TruncatableNote noteText={llm.pricing.note} />
                                                                        ) : (
                                                                            <span className="text-xs text-muted-foreground">
                                                                                (${formatPrice(llm.pricing.input)} / ${formatPrice(llm.pricing.output)} MTok)
                                                                            </span>
                                                                        )}
                                                                    </li>
                                                                );
                                                                })}
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
                                    Currently Available TTS
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {availableTTS.length > 0 ? (
                                    <ul className="space-y-1 list-disc list-inside text-sm">
                                        {availableTTS.map((tts) => (
                                            <li key={tts.id} className="ml-4">
                                                {tts.name}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-center text-muted-foreground text-sm">No TTS options currently available.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TooltipProvider>
                )}
            </div>
        </main>
    );
}
