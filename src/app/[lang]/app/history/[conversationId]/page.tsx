'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getLLMInfoById } from '@/lib/models'; // LLMInfo was unused, but getLLMInfoById is used
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Loader2, AlertTriangle, ArrowLeft, MessageCircle, Bot, Languages, Play, Pause } from 'lucide-react';
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

    // Add TranscriptMessageBubble component for consistent chat UI
    const TranscriptMessageBubble: React.FC<{
        msg: Message;
        agentALLMInfo?: { name?: string } | null;
        agentBLLMInfo?: { name?: string } | null;
    }> = ({ msg, agentALLMInfo, agentBLLMInfo }) => {
        const [fullScreenImageMsgId, setFullScreenImageMsgId] = useState<string | null>(null);
        const [imageLoadStatus, setImageLoadStatus] = useState<Record<string, 'loading' | 'loaded' | 'error'>>({});
        const [isPlaying, setIsPlaying] = useState(false);
        const audioRef = useRef<HTMLAudioElement | null>(null);
        const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

        // Handle audio playback for both pre-recorded and browser TTS
        const togglePlayPause = useCallback(() => {
            // Handle browser TTS
            if (!msg.audioUrl && (msg.role === 'agentA' || msg.role === 'agentB')) {
                const agentRole = msg.role as 'agentA' | 'agentB';
                const ttsConfig = details?.ttsSettings?.[agentRole];
                
                if (ttsConfig?.provider === 'browser') {
                    if (isPlaying) {
                        // Stop current playback
                        window.speechSynthesis.cancel();
                        setIsPlaying(false);
                    } else {
                        // Start new TTS playback
                        const utterance = new SpeechSynthesisUtterance(msg.content);
                        utterance.onend = () => setIsPlaying(false);
                        utterance.onerror = (e) => {
                            console.error('Speech synthesis error:', e);
                            setIsPlaying(false);
                        };
                        
                        // Try to find the voice if specified
                        if (ttsConfig.voice) {
                            const voices = window.speechSynthesis.getVoices();
                            const voice = voices.find(v => v.voiceURI === ttsConfig.voice);
                            if (voice) utterance.voice = voice;
                        }
                        
                        utteranceRef.current = utterance;
                        window.speechSynthesis.speak(utterance);
                        setIsPlaying(true);
                    }
                    return;
                }
            }
            
            // Handle pre-recorded audio
            if (!msg.audioUrl) return;
            
            if (!audioRef.current) {
                audioRef.current = new Audio(msg.audioUrl);
                audioRef.current.onended = () => setIsPlaying(false);
                audioRef.current.onpause = () => setIsPlaying(false);
            }
            
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(error => {
                    console.error('Error playing audio:', error);
                    setIsPlaying(false);
                });
            }
        }, [msg.audioUrl, msg.content, msg.role, isPlaying]);
        
        // Clean up TTS on unmount
        useEffect(() => {
            return () => {
                if (utteranceRef.current) {
                    window.speechSynthesis.cancel();
                    utteranceRef.current = null;
                }
            };
        }, []);

        // Clean up audio element on unmount
        useEffect(() => {
            return () => {
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current = null;
                }
            };
        }, []);
        
        const isAgentA = msg.role === 'agentA';
        const isAgentB = msg.role === 'agentB';
        const isUser = msg.role === 'user' || msg.role === 'human';
        const isSystem = msg.role === 'system';
        
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
                                aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                            >
                                {isPlaying ? (
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
                                    unoptimized={msg.imageUrl.includes('storage.googleapis.com') || msg.imageUrl.includes('googleapis.com/storage')}
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

    // Resume conversation handler
    const handleResumeConversation = async () => {
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
    };

    return (
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
                            onClick={handleResumeConversation}
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
                                            <p className="text-sm"><span className="text-muted-foreground">{t.history.provider}:</span> {details.ttsSettings.agentA.provider}</p>
                                            {details.ttsSettings.agentA.selectedTtsModelId && <p className="text-sm"><span className="text-muted-foreground">{t.history.model}:</span> {details.ttsSettings.agentA.selectedTtsModelId}</p>}
                                            {details.ttsSettings.agentA.voice && <p className="text-sm"><span className="text-muted-foreground">{t.history.voice}:</span> {details.ttsSettings.agentA.voice}</p>}
                                        </div>
                                        <div className="space-y-2 p-3 bg-muted/20 rounded-md">
                                            <p className="font-medium">{t.history.agentBTTS}:</p>
                                            <p className="text-sm"><span className="text-muted-foreground">{t.history.provider}:</span> {details.ttsSettings.agentB.provider}</p>
                                            {details.ttsSettings.agentB.selectedTtsModelId && <p className="text-sm"><span className="text-muted-foreground">{t.history.model}:</span> {details.ttsSettings.agentB.selectedTtsModelId}</p>}
                                            {details.ttsSettings.agentB.voice && <p className="text-sm"><span className="text-muted-foreground">{t.history.voice}:</span> {details.ttsSettings.agentB.voice}</p>}
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
                                                {details.imageGenSettings.provider} - {details.imageGenSettings.model}
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
                        <ScrollArea className="h-[500px] w-full pr-4" style={{ contain: 'layout style paint' }}>
                            <div className="space-y-4">
                                {details.messages.map((msg, index) => {
                                    const isSystem = msg.role === 'system';
                                    if (
                                        isSystem &&
                                        (msg.content.toLowerCase().includes("start the conversation") ||
                                            msg.content.toLowerCase().includes("beginnen sie das gespräch"))
                                    ) {
                                        if (details.messages.length > 1) return null;
                                    }
                                    return (
                                        <TranscriptMessageBubble
                                            key={msg.id || index}
                                            msg={msg}
                                            agentALLMInfo={agentALLMInfo}
                                            agentBLLMInfo={agentBLLMInfo}
                                        />
                                    );
                                })}
                                {details.messages.length === 0 && (
                                    <p className="text-center text-muted-foreground py-8">It looks like this conversation has no messages.</p>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
} 