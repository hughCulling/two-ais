'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getLLMInfoById } from '@/lib/models'; // LLMInfo was unused, but getLLMInfoById is used
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, Loader2, AlertTriangle, Languages, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from '@/components/ui/separator';

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'human' | 'ai' | 'agentA' | 'agentB';
    content: string;
    timestamp: string; // ISO string
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

interface ConversationDetails {
    conversationId: string;
    createdAt: string; // ISO string
    agentA_llm: string;
    agentB_llm: string;
    language: string;
    ttsSettings?: AgentTTSSettings;
    messages: Message[];
    status: 'running' | 'completed' | 'failed'; // Added status for resume logic
}

export default function ChatHistoryViewerPage() {
    const { user, loading: authLoading } = useAuth();
    const params = useParams();
    const router = useRouter();
    const { language } = useLanguage();
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


    if (authLoading || loading) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Loading conversation...</p>
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
                            Back to Previous Chats
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
                                Back to Previous Chats
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </main>
        );
    }

    const formattedCreationDate = format(new Date(details.createdAt), 'PPP p', { locale: enUS });

    // Add TranscriptMessageBubble component for consistent chat UI
    const TranscriptMessageBubble: React.FC<{
        msg: Message;
        agentALLMInfo?: { name?: string } | null;
        agentBLLMInfo?: { name?: string } | null;
    }> = ({ msg, agentALLMInfo, agentBLLMInfo }) => {
        const isAgentA = msg.role === 'agentA';
        const isAgentB = msg.role === 'agentB';
        const isUser = msg.role === 'user' || msg.role === 'human';
        const isSystem = msg.role === 'system';
        // Use same colors/labels as ChatInterface
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
        return (
            <div className={`flex ${alignClass}`}>
                <div className={`p-3 rounded-lg max-w-[75%] whitespace-pre-wrap shadow-sm relative ${bubbleClass}`}
                    style={{ marginBottom: '0.5rem' }}>
                    {(isAgentA || isAgentB) && (
                        <p className="text-xs font-bold mb-1">{label}</p>
                    )}
                    {isUser && (
                        <p className="text-xs font-bold mb-1">{label}</p>
                    )}
                    {msg.content}
                </div>
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
                        View Conversation
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href={`/${language.code}/app/history`} aria-label="Return to conversation history">
                            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                            Back to Previous Chats
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
                            {resumeLoading ? 'Resuming...' : 'Resume Conversation'}
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
                        <CardTitle>Session Details</CardTitle>
                        <CardDescription>{`Chat started on ${formattedCreationDate}`}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex items-center">
                            <Bot className="mr-2 h-5 w-5 text-primary/80" />
                            <strong>Agent A Model:</strong>
                            <span className="ml-2">{agentALLMInfo?.name || details.agentA_llm}</span>
                        </div>
                        <div className="flex items-center">
                            <Bot className="mr-2 h-5 w-5 text-primary/80" />
                            <strong>Agent B Model:</strong>
                            <span className="ml-2">{agentBLLMInfo?.name || details.agentB_llm}</span>
                        </div>
                        <div className="flex items-center">
                            <Languages className="mr-2 h-5 w-5 text-primary/80" />
                            <strong>Language:</strong>
                            <span className="ml-2">{details.language.toUpperCase()}</span>
                        </div>
                        {details.ttsSettings && (
                            <>
                                <Separator className="my-3" />
                                <h4 className="font-semibold text-md mb-1">TTS Settings</h4>
                                {details.ttsSettings.enabled ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                        <div>
                                            <p><strong>Agent A TTS:</strong></p>
                                            <p>Provider: {details.ttsSettings.agentA.provider}</p>
                                            {details.ttsSettings.agentA.selectedTtsModelId && <p>Model: {details.ttsSettings.agentA.selectedTtsModelId}</p>}
                                            {details.ttsSettings.agentA.voice && <p>Voice: {details.ttsSettings.agentA.voice}</p>}
                                        </div>
                                        <div>
                                            <p><strong>Agent B TTS:</strong></p>
                                            <p>Provider: {details.ttsSettings.agentB.provider}</p>
                                            {details.ttsSettings.agentB.selectedTtsModelId && <p>Model: {details.ttsSettings.agentB.selectedTtsModelId}</p>}
                                            {details.ttsSettings.agentB.voice && <p>Voice: {details.ttsSettings.agentB.voice}</p>}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-xs">TTS was not enabled for this session.</p>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Transcript</CardTitle>
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