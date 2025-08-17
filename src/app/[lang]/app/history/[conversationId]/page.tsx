'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getLLMInfoById } from '@/lib/models'; // LLMInfo was unused, but getLLMInfoById is used
import { getVoiceById, type TTSProviderInfo } from '@/lib/tts_models'; // Import getVoiceById from the correct path
import { getImageModelById } from '@/lib/image_models';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Loader2, AlertTriangle, ArrowLeft, MessageCircle, Bot, Languages, Play, Pause, Volume2 } from 'lucide-react';
import { format, Locale } from 'date-fns';
import ReactDOM from 'react-dom';
import { enUS, fr, de, es, it, pt, ru, ja, ko, zhCN, ar, he, tr, pl, sv, da, fi, nl, cs, sk, hu, ro, bg, hr, sl, et, lv, lt, mk, sq, bs, sr, uk, ka, hy, el, th, vi, id, ms } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

const audioControlStyles = {
    position: 'fixed' as const,
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'hsl(var(--background))',
    padding: '8px 16px',
    borderRadius: '9999px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: 100,
    border: '1px solid hsl(var(--border))',
};

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
                    const utterance = new SpeechSynthesisUtterance(msg.content);
                    utteranceRef.current = utterance;
                    
                    utterance.onend = handleAudioEnd;
                    utterance.onerror = (event) => {
                        console.error('Speech synthesis error:', event);
                        handleAudioEnd();
                    };
                    
                    // Set the voice using getVoiceById
                    if (ttsConfig.voice) {
                        const voiceInfo = getVoiceById('browser', ttsConfig.voice);
                        if (voiceInfo) {
                            const voices = window.speechSynthesis.getVoices();
                            const voice = voices.find(v => v.voiceURI === voiceInfo.providerVoiceId);
                            if (voice) {
                                utterance.voice = voice;
                            }
                        }
                    }
                    
                    setAudioState({ isPlaying: true, isPaused: false });
                    setCurrentlyPlayingMsgId(msg.id);
                    window.speechSynthesis.speak(utterance);
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
        }, [msg, isAgentA, isAgentB, isCurrentPlaying, isCurrentPaused, details?.ttsSettings, handleAudioEnd]);

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
        
        // Get the currently playing message to determine the agent
        const currentMessage = details?.messages.find(msg => msg.id === currentlyPlayingMsgId);
        const isAgentA = currentMessage?.role === 'agentA';
        const isAgentB = currentMessage?.role === 'agentB';
        
        // Get agent name based on role
        let agentName = '';
        if (isAgentA) {
            agentName = agentALLMInfo?.name || 'Agent A';
        } else if (isAgentB) {
            agentName = agentBLLMInfo?.name || 'Agent B';
        }
        
        return (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 px-4 py-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {agentName} • {audioState.isPaused ? 'Paused' : 'Playing'}
                    </span>
                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-600"></div>
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
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label={audioState.isPaused ? 'Resume' : 'Pause'}
                    >
                        {audioState.isPaused ? (
                            <Play className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                        ) : (
                            <Pause className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                        )}
                    </button>
                    <button
                        onClick={() => {
                            if (audioRef.current) {
                                audioRef.current.pause();
                                audioRef.current.currentTime = 0;
                            }
                            if (utteranceRef.current) {
                                window.speechSynthesis.cancel();
                            }
                            setAudioState({ isPlaying: false, isPaused: false });
                            setCurrentlyPlayingMsgId(null);
                        }}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Stop"
                    >
                        <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
                <div className="w-full max-w-3xl space-y-6">
                    <div className="flex items-center justify-between mb-6">
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
                    {/* Resume Conversation Button */}
                    {details && details.conversationId && details.agentA_llm && details.agentB_llm && details.language && details.messages &&
                        details['status'] !== 'running' && (
                        <div className="mb-2 flex flex-col items-center">
                            <Button
                                variant="default"
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
                                aria-label={resumeLoading ? "Resuming conversation..." : "Resume this conversation"}
                                aria-describedby="resume-conversation-description"
                            >
                                {resumeLoading ? t.history.resuming : t.history.resumeConversation}
                            </Button>
                            <div id="resume-conversation-description" className="sr-only">
                                Click to continue this conversation from where it left off. This will create a new active session.
                            </div>
                            {resumeError && (
                                <p className="text-destructive-foreground text-sm mt-2">{resumeError}</p>
                            )}
                        </div>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>{t.history.sessionDetails}</CardTitle>
                            <CardDescription>{t.history.chatStartedOn.replace('{date}', formattedCreationDate)}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center">
                                <Bot className="mr-2 h-5 w-5 text-primary/80" />
                                <strong>{t.history.agentAModel}:</strong>
                                <span className="ml-2">{agentALLMInfo?.name || details.agentA_llm}</span>
                            </div>
                            <div className="flex items-center">
                                <Bot className="mr-2 h-5 w-5 text-primary/80" />
                                <strong>{t.history.agentBModel}:</strong>
                                <span className="ml-2">{agentBLLMInfo?.name || details.agentB_llm}</span>
                            </div>
                            <div className="flex items-center">
                                <Languages className="mr-2 h-5 w-5 text-primary/80" />
                                <strong>{t.history.language}:</strong>
                                <span className="ml-2">{details.language.toUpperCase()}</span>
                            </div>
                            <div className="space-y-4">
                            <Separator className="my-3" />

                                {details.ttsSettings?.enabled && (
                                    <div className="mt-4">
                                        <h3 className="text-sm font-medium mb-2">{t.history.ttsSettings}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2 p-3 bg-muted/20 rounded-md">
                                                <p className="font-medium">{t.history.agentATTS}:</p>
                                                <p className="text-sm"><span className="text-muted-foreground">{t.history.provider}:</span> {getProviderDisplayName(details.ttsSettings.agentA.provider)}</p>
                                                {details.ttsSettings.agentA.selectedTtsModelId && <p className="text-sm"><span className="text-muted-foreground">{t.history.model}:</span> {getModelDisplayName(details.ttsSettings.agentA.selectedTtsModelId)}</p>}
                                                {details.ttsSettings.agentA.voice && <p className="text-sm"><span className="text-muted-foreground">{t.history.voice}:</span> {getVoiceDisplayName(details.ttsSettings.agentA.provider, details.ttsSettings.agentA.voice)}</p>}
                                            </div>
                                            <div className="space-y-2 p-3 bg-muted/20 rounded-md">
                                                <p className="font-medium">{t.history.agentBTTS}:</p>
                                                <p className="text-sm"><span className="text-muted-foreground">{t.history.provider}:</span> {getProviderDisplayName(details.ttsSettings.agentB.provider)}</p>
                                                {details.ttsSettings.agentB.selectedTtsModelId && <p className="text-sm"><span className="text-muted-foreground">{t.history.model}:</span> {getModelDisplayName(details.ttsSettings.agentB.selectedTtsModelId)}</p>}
                                                {details.ttsSettings.agentB.voice && <p className="text-sm"><span className="text-muted-foreground">{t.history.voice}:</span> {getVoiceDisplayName(details.ttsSettings.agentB.provider, details.ttsSettings.agentB.voice)}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {!details.ttsSettings?.enabled && details.ttsSettings && (
                                    <p className="text-muted-foreground text-xs">TTS was not enabled for this session.</p>
                                )}
                                {details.imageGenSettings?.enabled && (
                                    <div className="mt-4 pt-4 border-t">
                                        <h3 className="text-sm font-medium mb-2 flex items-center">
                                            {t.history.imageGenerationSettings}
                                        </h3>
                                        <div className="space-y-2">
                                            <div>
                                                <h4 className="text-xs font-medium text-muted-foreground mb-1">{t.sessionSetupForm.imageModel}</h4>
                                                <p className="text-sm">
                                                    {getProviderDisplayName(details.imageGenSettings.provider)} - {getModelDisplayName(details.imageGenSettings.model)}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="text-xs font-medium text-muted-foreground mb-1">{t.sessionSetupForm.quality}</h4>
                                                    <p className="text-sm">{details.imageGenSettings.quality}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-medium text-muted-foreground mb-1">{t.sessionSetupForm.size}</h4>
                                                    <p className="text-sm">{details.imageGenSettings.size}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-medium text-muted-foreground mb-1">{t.sessionSetupForm.promptLLM}</h4>
                                                <p className="text-sm">
                                                    {getLLMInfoById(details.imageGenSettings.promptLlm)?.name || details.imageGenSettings.promptLlm}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
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
                                <div className="h-16"></div> {/* Spacer for the audio control */}
                            </div>
                            <AudioControl />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
} 