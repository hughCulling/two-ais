'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getLLMInfoById } from '@/lib/models'; // LLMInfo was unused, but getLLMInfoById is used
import { getVoiceById, findFallbackBrowserVoice, type TTSProviderInfo } from '@/lib/tts_models'; // Import getVoiceById from the correct path
import { getImageModelById } from '@/lib/image_models';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
// import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Loader2, AlertTriangle, ArrowLeft, MessageCircle, Play, Pause, Check } from 'lucide-react';
import { format, Locale } from 'date-fns';
import ReactDOM from 'react-dom';
import { enUS, fr, de, es, it, pt, ru, ja, ko, zhCN, ar, he, tr, pl, sv, da, fi, nl, cs, sk, hu, ro, bg, hr, sl, et, lv, lt, mk, sq, bs, sr, uk, ka, hy, el, th, vi, id, ms } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import removeMarkdown from 'remove-markdown';
import { removeEmojis } from '@/lib/utils';
import Image from 'next/image';

// Function to get the appropriate date-fns locale based on language code
function getLocale(languageCode: string) {
    const localeMap: Record<string, Locale> = {
        en: enUS,
        fr, de, es, it, pt, ru, ja, ko, zh: zhCN, ar, he, tr, pl, sv, da, fi, nl, cs, sk, hu, ro, bg, hr, sl, et, lv, lt, mk, sq, bs, sr, uk, ka, hy, el, th, vi, id, ms
    };
    return localeMap[languageCode] || enUS; // Fallback to English if locale not found
}

// Helper function to safely get voice display name
function getVoiceDisplayName(provider: string, voiceId: string | null | undefined): string {
    if (!voiceId) return 'Default';
    
    // Define valid TTS provider IDs based on TTSProviderInfo type
    const validProviders: TTSProviderInfo['id'][] = ['openai', 'google-cloud', 'elevenlabs', 'google-gemini', 'browser'];
    
    // Cast to valid provider type or default to 'google-cloud' if invalid
    const safeProvider = validProviders.includes(provider as TTSProviderInfo['id']) 
        ? provider as TTSProviderInfo['id']
        : 'google-cloud';
        
    const voice = getVoiceById(safeProvider, voiceId);
    return voice?.name || voiceId;
}

// Helper function to get model display name
function getModelDisplayName(modelId: string | null | undefined): string {
    if (!modelId) return 'Default';
    if (modelId === 'browser-tts') return 'Web Speech API';
    const model = getImageModelById(modelId);
    return model?.name || modelId;
}

// Helper function to get provider display name
function getProviderDisplayName(provider: string): string {
    const providerMap: Record<string, string> = {
        'openai': 'OpenAI',
        'google-cloud': 'Google Cloud',
        'elevenlabs': 'ElevenLabs',
        'google-gemini': 'Google Gemini',
        'browser': 'Browser TTS'  // Reverted back to original
    };
    return providerMap[provider] || provider;
}

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'human' | 'ai' | 'agentA' | 'agentB';
    content: string;
    timestamp: string; // ISO string
    imageUrl?: string | null;
    imageGenError?: string | null;
    isStreaming?: boolean;
    audioUrl?: string;
    ttsWasSplit?: boolean;
}

interface TTSConfig {
    provider: string;
    voice?: string | null;
    selectedTtsModelId?: string;
}

interface AgentTTSSettings {
    enabled: boolean;
    agentA: TTSConfig;
    agentB: TTSConfig;
}

interface ImageGenSettings {
    enabled: boolean;
    provider: string;
    model: string;
    quality: string;
    size: string;
    promptLlm: string;
    promptSystemMessage: string;
}

interface ConversationDetails {
    conversationId: string;
    createdAt: string; // ISO string
    agentA_llm: string;
    agentB_llm: string;
    language: string;
    ttsSettings?: AgentTTSSettings;
    imageGenSettings?: ImageGenSettings;
    messages: Message[];
    status: 'running' | 'completed' | 'failed';
}

interface AudioState {
    isPlaying: boolean;
    isPaused: boolean;
}

export default function ChatHistoryViewerPage() {
    const { user, loading: authLoading } = useAuth();
    const params = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const { t, loading: translationLoading } = useTranslation();
    const conversationId = params.conversationId as string;

    const [details, setDetails] = useState<ConversationDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [resumeLoading, setResumeLoading] = useState(false);
    const [resumeError, setResumeError] = useState<string | null>(null);

    const agentALLMInfo = useMemo(() => details ? getLLMInfoById(details.agentA_llm) : null, [details]);
    const agentBLLMInfo = useMemo(() => details ? getLLMInfoById(details.agentB_llm) : null, [details]);

    const [audioState, setAudioState] = useState<AudioState>({ isPlaying: false, isPaused: false });
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const [currentlyPlayingMsgId, setCurrentlyPlayingMsgId] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (utteranceRef.current) {
                window.speechSynthesis.cancel();
                utteranceRef.current = null;
            }
            setAudioState({ isPlaying: false, isPaused: false });
            setCurrentlyPlayingMsgId(null);
        };
    }, []);

    const handleAudioEnd = useCallback(() => {
        setAudioState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
        setCurrentlyPlayingMsgId(null);
    }, []);

    useEffect(() => {
        if (authLoading || !conversationId) return;

        if (!user) {
            setLoading(false);
            setError("Please log in to view conversation details.");
            return;
        }

        async function fetchDetails() {
            setLoading(true);
            setError(null);
            if (!user) {
                setError("User not available for fetching details.");
                setLoading(false);
                return;
            }
            try {
                const idToken = await user.getIdToken();
                const response = await fetch(`/api/conversation/${conversationId}/details`, {
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: "Could not load conversation details." }));
                    throw new Error(errorData.error || `Failed to fetch details: ${response.status}`);
                }
                const data: ConversationDetails = await response.json();
                setDetails(data);
            } catch (err) {
                console.error(`Failed to fetch details for conversation ${conversationId}:`, err);
                setError(err instanceof Error ? err.message : "Could not load conversation details.");
            }
            setLoading(false);
        }

        fetchDetails();
    }, [user, authLoading, conversationId]);

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/');
        }
    }, [user, loading, router]);

    if (authLoading || loading || translationLoading || !t) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">{t?.history?.loadingConversation}</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg bg-destructive/10 border-destructive">
                    <CardHeader>
                        <CardTitle className="flex items-center text-destructive">
                            <AlertTriangle className="mr-2 h-5 w-5" />
                            Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-destructive-foreground">{error}</p>
                        <Button 
                            variant="outline" 
                            onClick={() => router.push(`/${language.code}/app/history`)}
                            aria-label="Return to conversation history"
                            aria-describedby="back-to-history-description"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                            {t.history.backToPreviousChats}
                        </Button>
                        <div id="back-to-history-description" className="sr-only">
                            Click to return to the list of all previous conversations.
                        </div>
                    </CardContent>
                </Card>
            </main>
        );
    }

    if (!details) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                            Not Found
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>This conversation could not be found or is not accessible.</p>
                        <Button variant="outline" asChild>
                             <Link href={`/${language.code}/app/history`} aria-label="Return to conversation history">
                                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                                {t.history.backToPreviousChats}
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </main>
        );
    }

    const formattedCreationDate = format(new Date(details.createdAt), 'PPP p', { locale: getLocale(language.code) });

    const TranscriptMessageBubble: React.FC<{
        msg: Message;
        agentALLMInfo?: { name?: string } | null;
        agentBLLMInfo?: { name?: string } | null;
    }> = ({ msg, agentALLMInfo, agentBLLMInfo }) => {
        const [fullScreenImageMsgId, setFullScreenImageMsgId] = useState<string | null>(null);
        const [imageLoadStatus, setImageLoadStatus] = useState<Record<string, 'loading' | 'loaded' | 'error'>>({});
        
        const isAgentA = msg.role === 'agentA';
        const isAgentB = msg.role === 'agentB';
        const isUser = msg.role === 'user' || msg.role === 'human';
        const isSystem = msg.role === 'system';
        
        const isCurrentPlaying = currentlyPlayingMsgId === msg.id && audioState.isPlaying && !audioState.isPaused;
        const isCurrentPaused = currentlyPlayingMsgId === msg.id && audioState.isPaused;

        const togglePlayPause = useCallback(() => {
            // If this is the currently playing message and it's paused, resume it
            if (isCurrentPaused) {
                if (audioRef.current) {
                    audioRef.current.play().catch(console.error);
                } else if (utteranceRef.current) {
                    window.speechSynthesis.resume();
                }
                setAudioState(prev => ({ ...prev, isPaused: false }));
                return;
            }

            // If this is already playing, pause it
            if (isCurrentPlaying) {
                if (audioRef.current) {
                    audioRef.current.pause();
                } else if (utteranceRef.current) {
                    window.speechSynthesis.pause();
                }
                setAudioState(prev => ({ ...prev, isPaused: true }));
                return;
            }

            // Stop any current playback
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (utteranceRef.current) {
                window.speechSynthesis.cancel();
                utteranceRef.current = null;
            }

            // Handle browser TTS
            if (!msg.audioUrl && (isAgentA || isAgentB)) {
                const agentRole = msg.role as 'agentA' | 'agentB';
                const ttsConfig = details?.ttsSettings?.[agentRole];
                
                if (ttsConfig?.provider === 'browser') {
                    // Use the same markdown removal as in ChatInterface
                    const cleanedContent = removeEmojis(removeMarkdown(msg.content));
                    const utterance = new SpeechSynthesisUtterance(cleanedContent);
                    utteranceRef.current = utterance;
                    
                    utterance.onend = handleAudioEnd;
                    utterance.onerror = (event) => {
                        // Ignore 'canceled' and 'interrupted' errors as they're expected during normal operation
                        if (event.error === 'canceled' || event.error === 'interrupted') {
                            console.debug(`Speech synthesis ${event.error} (expected)`);
                        } else if (event.error === 'synthesis-failed') {
                            console.warn('Speech synthesis failed - this may be due to rapid playback attempts');
                        } else {
                            console.error('Speech synthesis error:', event.error);
                        }
                        handleAudioEnd();
                    };
                    
                    // Set the voice using getVoiceById with fallback
                    if (ttsConfig.voice) {
                        const voiceInfo = getVoiceById('browser', ttsConfig.voice);
                        let voice = null;
                        
                        if (voiceInfo) {
                            const voices = window.speechSynthesis.getVoices();
                            voice = voices.find(v => v.voiceURI === voiceInfo.providerVoiceId);
                        }
                        
                        // If voice not found, try fallback
                        if (!voice) {
                            console.warn(`Voice not found for ID: ${ttsConfig.voice}, trying fallback`);
                            voice = findFallbackBrowserVoice(details?.language || 'en');
                            if (voice) {
                                console.info(`Using fallback voice: ${voice.name} (${voice.lang})`);
                            }
                        }
                        
                        // Try to assign the voice with error handling
                        if (voice) {
                            try {
                                utterance.voice = voice;
                            } catch (error) {
                                console.warn(`Failed to assign voice ${voice.name}, trying fallback:`, error);
                                const fallbackVoice = findFallbackBrowserVoice(details?.language || 'en');
                                if (fallbackVoice) {
                                    utterance.voice = fallbackVoice;
                                    console.info(`Using fallback voice: ${fallbackVoice.name} (${fallbackVoice.lang})`);
                                }
                            }
                        }
                    }
                    
                    setAudioState({ isPlaying: true, isPaused: false });
                    setCurrentlyPlayingMsgId(msg.id);
                    
                    // Guard: Don't start new speech if already speaking
                    if (window.speechSynthesis.speaking) {
                        console.debug('Speech synthesis already speaking, cancelling first');
                        window.speechSynthesis.cancel();
                    }
                    
                    // Cancel any pending speech
                    window.speechSynthesis.cancel();
                    
                    // Longer delay for Edge browser to properly clean up
                    setTimeout(() => {
                        // Double-check we're not already speaking before starting
                        if (window.speechSynthesis.speaking) {
                            console.warn('Speech synthesis still speaking after cancel, forcing cancel');
                            window.speechSynthesis.cancel();
                            setTimeout(() => {
                                try {
                                    window.speechSynthesis.speak(utterance);
                                } catch (speakErr) {
                                    console.error('Error speaking utterance after forced cancel:', speakErr);
                                    handleAudioEnd();
                                }
                            }, 100);
                        } else {
                            try {
                                window.speechSynthesis.speak(utterance);
                            } catch (speakErr) {
                                console.error('Error speaking utterance:', speakErr);
                                handleAudioEnd();
                            }
                        }
                    }, 150); // Increased delay for Edge compatibility
                    return;
                }
            }
            
            // Handle pre-recorded audio
            if (msg.audioUrl) {
                const audio = new Audio(msg.audioUrl);
                audioRef.current = audio;
                
                audio.onended = handleAudioEnd;
                audio.onpause = () => setAudioState(prev => ({ ...prev, isPaused: true }));
                audio.onplay = () => {
                    setAudioState({ isPlaying: true, isPaused: false });
                    setCurrentlyPlayingMsgId(msg.id);
                };
                
                audio.play().catch(console.error);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [msg, isAgentA, isAgentB, isCurrentPlaying, isCurrentPaused, handleAudioEnd]);

        // Determine bubble styling and labels based on message role
        let bubbleClass = '';
        let label = '';
        let alignClass = '';
        
        if (isAgentA) {
            bubbleClass = 'bg-muted text-foreground';
            label = agentALLMInfo?.name ? `Agent A (${agentALLMInfo.name})` : 'Agent A';
            alignClass = 'justify-start';
        } else if (isAgentB) {
            bubbleClass = 'bg-primary text-primary-foreground';
            label = agentBLLMInfo?.name ? `Agent B (${agentBLLMInfo.name})` : 'Agent B';
            alignClass = 'justify-end';
        } else if (isUser) {
            bubbleClass = 'bg-secondary text-foreground';
            label = 'You';
            alignClass = 'justify-end';
        } else if (isSystem) {
            bubbleClass = 'bg-muted/60 text-muted-foreground italic';
            label = 'System';
            alignClass = 'justify-center';
        }

        // Handle full screen image close with escape key
        useEffect(() => {
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    setFullScreenImageMsgId(null);
                }
            };
            window.addEventListener('keydown', handleEscape);
            return () => window.removeEventListener('keydown', handleEscape);
        }, []);

        return (
            <div className={`flex ${alignClass}`}>
                <div className={`p-3 rounded-lg max-w-[75%] whitespace-pre-wrap shadow-sm relative ${bubbleClass}`} style={{ marginBottom: '0.5rem' }}>
                    {/* Role label */}
                    {(isAgentA || isAgentB || isUser) && (
                        <p className="text-xs font-bold mb-1">{label}</p>
                    )}

                    {/* Image display for agent messages */}
                    {(isAgentA || isAgentB) && (
                        <>
                            {msg.imageUrl && !msg.imageGenError && (
                                <div className="mb-2 flex flex-col items-center">
                                    <div className="relative">
                                        <Image
                                            src={msg.imageUrl}
                                            alt="Generated image for this turn"
                                            className="rounded-md max-w-full max-h-[40vh] cursor-pointer border border-muted-foreground/20 shadow"
                                            style={{ objectFit: 'contain' }}
                                            onClick={() => setFullScreenImageMsgId(msg.id)}
                                            onLoad={() => setImageLoadStatus(s => ({ ...s, [msg.id]: 'loaded' }))}
                                            onError={() => setImageLoadStatus(s => ({ ...s, [msg.id]: 'error' }))}
                                            tabIndex={0}
                                            width={800}
                                            height={600}
                                            unoptimized={msg.imageUrl?.includes('storage.googleapis.com') || msg.imageUrl?.includes('googleapis.com/storage')}
                                            aria-label="Show image in full screen"
                                        />
                                        {imageLoadStatus[msg.id] === 'loading' && (
                                            <div className="text-xs text-muted-foreground mt-1">Loading image...</div>
                                        )}
                                        {imageLoadStatus[msg.id] === 'error' && (
                                            <div className="text-xs text-destructive mt-1">Image failed to load.</div>
                                        )}
                                        {!imageLoadStatus[msg.id] && (
                                            <div className="text-xs text-muted-foreground mt-1">Loading image...</div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {msg.imageGenError && (
                                <div className="mb-2 text-xs text-destructive">
                                    Image could not be generated: {msg.imageGenError}
                                </div>
                            )}
                        </>
                    )}

                    {/* Message content */}
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                        </ReactMarkdown>
                    </div>

                    {/* TTS Playback Button - Show for both pre-recorded and browser TTS */}
                    {(msg.audioUrl || (details?.ttsSettings?.[msg.role as 'agentA' | 'agentB']?.provider === 'browser' && (isAgentA || isAgentB))) && (
                        <div className="mt-2 flex items-center">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    togglePlayPause();
                                }}
                                className={`flex items-center justify-center w-8 h-8 rounded-full ${isAgentA ? 'bg-muted-foreground/20 hover:bg-muted-foreground/30' : 'bg-primary/20 hover:bg-primary/30'} transition-colors`}
                                aria-label={isCurrentPlaying ? 'Pause audio' : 'Play audio'}
                            >
                                {isCurrentPlaying ? (
                                    <Pause className="h-4 w-4" />
                                ) : (
                                    <Play className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    )}

                    {/* Streaming indicator */}
                    {msg.isStreaming && (
                        <span className="ml-1 animate-pulse text-primary" aria-hidden="true">▍</span>
                    )}
                </div>

                {/* Full screen image modal */}
                {fullScreenImageMsgId === msg.id && msg.imageUrl &&
                    ReactDOM.createPortal(
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                            onClick={() => setFullScreenImageMsgId(null)}
                            tabIndex={0}
                            aria-modal="true"
                            role="dialog"
                        >
                            <div className="relative w-full h-full flex items-center justify-center">
                                <Image
                                    src={msg.imageUrl}
                                    alt="Generated image for this turn (full screen)"
                                    className="max-w-full max-h-full object-contain"
                                    width={1920}
                                    height={1080}
                                    unoptimized={msg.imageUrl?.includes('storage.googleapis.com') || msg.imageUrl?.includes('googleapis.com/storage')}
                                    onError={(e) => {
                                        console.error('Fullscreen image load error:', e);
                                        setFullScreenImageMsgId(null);
                                        setImageLoadStatus(s => ({ ...s, [msg.id]: 'error' }));
                                    }}
                                    priority
                                />
                                <button
                                    className="absolute top-4 right-4 bg-white/90 hover:bg-white text-black rounded-full p-2 shadow-lg transition-colors"
                                    onClick={e => { e.stopPropagation(); setFullScreenImageMsgId(null); }}
                                    aria-label="Close full screen image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>,
                        document.body
                    )
                }
            </div>
        );
    };

    const AudioControl = () => {
        if (!audioState.isPlaying && !audioState.isPaused) return null;
        
        return (
            <div className="sticky bottom-0 left-0 right-0 bg-background border-t pt-2 mt-4 z-50">
                <div className="flex items-center justify-center pb-2">
                    <button
                        onClick={() => {
                            if (audioState.isPaused) {
                                if (audioRef.current) {
                                    audioRef.current.play().catch(console.error);
                                } else if (utteranceRef.current) {
                                    window.speechSynthesis.resume();
                                }
                                setAudioState(prev => ({ ...prev, isPaused: false }));
                            } else {
                                if (audioRef.current) {
                                    audioRef.current.pause();
                                } else if (utteranceRef.current) {
                                    window.speechSynthesis.pause();
                                }
                                setAudioState(prev => ({ ...prev, isPaused: true }));
                            }
                        }}
                        className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        aria-label={audioState.isPaused ? 'Resume' : 'Pause'}
                    >
                        {audioState.isPaused ? (
                            <Play className="h-6 w-6" />
                        ) : (
                            <Pause className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
                <div className="w-full max-w-2xl space-y-6">
                    <div className="flex flex-col items-center gap-4 mb-6">
                        <h1 className="text-3xl font-bold flex items-center">
                            <MessageCircle className="mr-3 h-8 w-8 text-primary" />
                            {t.history.viewConversation}
                        </h1>
                        <Button variant="outline" asChild>
                            <Link href={`/${language.code}/app/history`} aria-label="Return to conversation history">
                                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                                {t.history.backToPreviousChats}
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle>{t.history.sessionDetails}</CardTitle>
                            <CardDescription>{t.history.chatStartedOn.replace('{date}', formattedCreationDate)}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* LLM Models Section - Side by Side */}
                            <div className="space-y-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="block text-center">{t.history.agentAModel}</Label>
                                        <div className="w-full px-3 py-2 border rounded-md bg-background text-center text-sm">
                                            {agentALLMInfo?.name || details.agentA_llm}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="block text-center">{t.history.agentBModel}</Label>
                                        <div className="w-full px-3 py-2 border rounded-md bg-background text-center text-sm">
                                            {agentBLLMInfo?.name || details.agentB_llm}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TTS Section */}
                            <hr className="my-6" />
                            <div className="space-y-4">
                                <div className="flex items-center justify-center space-x-2">
                                    <div className={`h-4 w-4 rounded-sm border ${details.ttsSettings?.enabled ? 'bg-primary border-primary' : 'border-input'} flex items-center justify-center`}>
                                        {details.ttsSettings?.enabled && (
                                            <Check className="h-3 w-3 text-primary-foreground" />
                                        )}
                                    </div>
                                    <Label className="text-base font-medium">
                                        {t?.sessionSetupForm?.enableTTS || 'Enable TTS'}
                                    </Label>
                                </div>

                                {details.ttsSettings?.enabled && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                        {/* Agent A TTS */}
                                        <div className="space-y-3 p-4 border rounded-md bg-background/50">
                                            <h3 className="font-semibold text-center mb-3">Agent A TTS</h3>
                                            <div className="space-y-2">
                                                <Label className="block text-center">{t?.sessionSetupForm?.voice || 'Voice'}</Label>
                                                <div className="w-full px-3 py-2 border rounded-md bg-background text-sm truncate">
                                                    {getVoiceDisplayName(details.ttsSettings.agentA.provider, details.ttsSettings.agentA.voice)}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Agent B TTS */}
                                        <div className="space-y-3 p-4 border rounded-md bg-background/50">
                                            <h3 className="font-semibold text-center mb-3">Agent B TTS</h3>
                                            <div className="space-y-2">
                                                <Label className="block text-center">{t?.sessionSetupForm?.voice || 'Voice'}</Label>
                                                <div className="w-full px-3 py-2 border rounded-md bg-background text-sm truncate">
                                                    {getVoiceDisplayName(details.ttsSettings.agentB.provider, details.ttsSettings.agentB.voice)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Image Generation Section */}
                            {details.imageGenSettings?.enabled && (
                                <>
                                    <Separator />
                                    <div className="space-y-4">
                                        <Label className="block text-center">{t.history.imageGenerationSettings}</Label>
                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                <Label className="text-sm text-center block">{t.sessionSetupForm.imageModel}</Label>
                                                <div className="w-full px-3 py-2 border rounded-md bg-muted text-center">
                                                    {getProviderDisplayName(details.imageGenSettings.provider)} - {getModelDisplayName(details.imageGenSettings.model)}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm text-center block">{t.sessionSetupForm.quality}</Label>
                                                    <div className="w-full px-3 py-2 border rounded-md bg-muted text-center">
                                                        {details.imageGenSettings.quality}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm text-center block">{t.sessionSetupForm.size}</Label>
                                                    <div className="w-full px-3 py-2 border rounded-md bg-muted text-center">
                                                        {details.imageGenSettings.size}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm text-center block">{t.sessionSetupForm.promptLLM}</Label>
                                                <div className="w-full px-3 py-2 border rounded-md bg-muted text-center">
                                                    {getLLMInfoById(details.imageGenSettings.promptLlm)?.name || details.imageGenSettings.promptLlm}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2">
                            {/* Resume Conversation Button */}
                            {details && details.conversationId && details.agentA_llm && details.agentB_llm && details.language && details.messages &&
                                details['status'] !== 'running' && (
                                <>
                                    <Button
                                        onClick={async () => {
                                            if (!details || !user) return;
                                            setResumeLoading(true);
                                            setResumeError(null);
                                            try {
                                                const idToken = await user.getIdToken();
                                                const response = await fetch(`/api/conversation/${details.conversationId}/resume`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Authorization': `Bearer ${idToken}`,
                                                    },
                                                });
                                                const result = await response.json();
                                                if (!response.ok) {
                                                    throw new Error(result.error || 'Failed to resume conversation.');
                                                }
                                                // Redirect to live chat interface (same as after session setup)
                                                router.push(`/${language.code}/app/?resume=${details.conversationId}`);
                                            } catch (err) {
                                                setResumeError(err instanceof Error ? err.message : String(err));
                                            } finally {
                                                setResumeLoading(false);
                                            }
                                        }}
                                        disabled={resumeLoading || !user}
                                        className="w-full"
                                        aria-label={resumeLoading ? "Resuming conversation..." : "Resume this conversation"}
                                        aria-describedby="resume-conversation-description"
                                    >
                                        {resumeLoading ? t.history.resuming : t.history.resumeConversation}
                                    </Button>
                                    <div id="resume-conversation-description" className="sr-only">
                                        Click to continue this conversation from where it left off. This will create a new active session.
                                    </div>
                                    {resumeError && (
                                        <p className="text-destructive text-sm text-center">{resumeError}</p>
                                    )}
                                </>
                            )}
                        </CardFooter>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.history.transcript}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative h-[calc(100vh-300px)] overflow-y-auto p-4">
                                <div className="space-y-4">
                                    {details.messages.length > 0 ? (
                                        details.messages.map((msg) => (
                                            <TranscriptMessageBubble
                                                key={msg.id}
                                                msg={msg}
                                                agentALLMInfo={agentALLMInfo}
                                                agentBLLMInfo={agentBLLMInfo}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-center text-muted-foreground py-8">It looks like this conversation has no messages.</p>
                                    )}
                                </div>
                                <AudioControl />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
} 