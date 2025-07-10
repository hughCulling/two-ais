'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquareText, Loader2, AlertTriangle, Inbox } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface ConversationSummary {
    conversationId: string;
    createdAt: string; // ISO string
    agentA_llm: string;
    agentB_llm: string;
    language: string;
}

export default function HistoryPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    // All hooks must be called before any return
    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (!user || loading) return;

        async function fetchHistory() {
            setHistoryLoading(true);
            setError(null);
            try {
                if (!user) throw new Error("User not available for fetching history.");
                const idToken = await user.getIdToken();
                const response = await fetch('/api/conversations/history', {
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: "An error occurred while fetching history." }));
                    throw new Error(errorData.error || `Error fetching history: ${response.status}`);
                }
                const data: ConversationSummary[] = await response.json();
                setConversations(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred while fetching history.");
            }
            setHistoryLoading(false);
        }

        fetchHistory();
    }, [user, loading]);

    // Now safe to return early
    if (loading) return null;
    if (!user) return null;

    if (loading || historyLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Loading history...</p>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
            <div className="w-full max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold flex items-center">
                        <MessageSquareText className="mr-3 h-8 w-8 text-primary" />
                        Conversation History
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Main
                        </Link>
                    </Button>
                </div>

                {error && (
                    <Card className="bg-destructive/10 border-destructive">
                        <CardHeader>
                            <CardTitle className="flex items-center text-destructive">
                                <AlertTriangle className="mr-2 h-5 w-5" />
                                Error
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-destructive-foreground">{error}</p>
                        </CardContent>
                    </Card>
                )}

                {!error && conversations.length === 0 && (
                    <Card className="text-center py-12">
                        <CardHeader>
                            <Inbox className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <CardTitle>No Conversations Yet</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">You haven&apos;t had any conversations yet. Start one to see it here!</p>
                        </CardContent>
                    </Card>
                )}

                {!error && conversations.length > 0 && (
                    <div className="space-y-4">
                        {conversations.map((convo) => {
                            let formattedDate = 'Invalid Date';
                            try {
                                formattedDate = format(new Date(convo.createdAt), 'PPP p', { locale: enUS });
                            } catch (e) {
                                console.error("Error formatting date:", e, "Input was:", convo.createdAt);
                            }
                            return (
                                <Link key={convo.conversationId} href={`/app/history/${convo.conversationId}`} passHref legacyBehavior>
                                    <a className="block hover:no-underline">
                                        <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
                                            <CardHeader>
                                                <CardTitle className="text-lg">{`Chat with ${convo.agentA_llm} & ${convo.agentB_llm}`}</CardTitle>
                                                <CardDescription>
                                                    {`Started on ${formattedDate}`} - Language: {convo.language.toUpperCase()}
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </a>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
} 