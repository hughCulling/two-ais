'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslation, TranslationKeys, LanguageCode as AppLanguageCode } from '@/lib/translations';
import { getLLMInfoById, LLMInfo } from '@/lib/models'; // To display model names
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bot, UserCircle, Loader2, AlertTriangle, Info, Languages, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale'; // Import enUS locale
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from '@/components/ui/separator';

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'human' | 'ai' | 'agentA' | 'agentB';
    content: string;
    timestamp: string; // ISO string
    // agentId?: 'agentA' | 'agentB'; // If we decide to store which agent sent assistant messages
}

interface TTSConfig {
    provider: string;
    voice?: string | null;
    selectedTtsModelId?: string;
    // ttsApiModelId is also available but might not be needed for display
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
}

export default function ChatHistoryViewerPage() {
    const { user, loading: authLoading } = useAuth();
    const { language: appLanguage } = useLanguage();
    const params = useParams();
    const router = useRouter();
    const conversationId = params.conversationId as string;

    const [details, setDetails] = useState<ConversationDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            if (!user) { // More explicit check
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
    }, [user, authLoading, conversationId]); // Removed t from dependencies

    const getRoleDisplayName = (role: Message['role'], messageContent: string) => {
        if (role === 'system') return "System";
        if (role === 'user' || role === 'human') return "You";
        return "Assistant";
    };

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
                        <Button variant="outline" onClick={() => router.push('/history')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to History
                        </Button>
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
                             <Link href="/history">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to History
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </main>
        );
    }

    const formattedCreationDate = format(new Date(details.createdAt), 'PPP p', { locale: enUS }); // Use enUS

    return (
        <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
            <div className="w-full max-w-3xl space-y-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold flex items-center">
                        <MessageCircle className="mr-3 h-8 w-8 text-primary" />
                        View Conversation
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href="/history">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to History
                        </Link>
                    </Button>
                </div>

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
                        <ScrollArea className="h-[500px] w-full pr-4">
                            <div className="space-y-6">
                                {details.messages.map((msg, index) => {
                                    const isUser = msg.role === 'user' || msg.role === 'human';
                                    const isSystem = msg.role === 'system';
                                    // First system message styling could be different if needed
                                    // const isFirstSystemMessage = isSystem && index === 0;
                                    
                                    // Hide initial system prompt "Start the conversation."
                                    // This might need to be more robust based on actual system prompts
                                    if (isSystem && (msg.content.toLowerCase().includes("start the conversation") || msg.content.toLowerCase().includes("beginnen sie das gespräch"))) {
                                      if (details.messages.length > 1) return null; // only hide if there are other messages
                                    }

                                    const formattedTime = format(new Date(msg.timestamp), 'p', { locale: enUS }); // Use enUS

                                    return (
                                        <div key={msg.id || index} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                                            <div className={`flex items-end space-x-2 max-w-[85%]`}>
                                                {!isUser && !isSystem && <Bot className="h-6 w-6 mb-1 text-primary flex-shrink-0" />}
                                                {isSystem && <Info className="h-5 w-5 mb-0.5 text-muted-foreground flex-shrink-0"/>}
                                                
                                                <div className={`px-3 py-2 rounded-lg shadow-sm break-words whitespace-pre-wrap ${isUser ? 'bg-primary text-primary-foreground' : isSystem ? 'bg-muted/60 text-muted-foreground italic' : 'bg-secondary'}`}>
                                                    {msg.content}
                                                </div>
                                                {isUser && <UserCircle className="h-6 w-6 mb-1 text-muted-foreground flex-shrink-0" />}
                                           </div>
                                            <p className={`text-xs text-muted-foreground mt-1 ${isUser ? 'mr-8' : isSystem ? 'ml-0' : 'ml-8'}`}>
                                                {getRoleDisplayName(msg.role, msg.content)} - {formattedTime}
                                            </p>
                                        </div>
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