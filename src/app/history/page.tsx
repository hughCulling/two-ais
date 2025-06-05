'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslation, TranslationKeys, LanguageCode as AppLanguageCode } from '@/lib/translations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquareText, Loader2, AlertTriangle, Inbox } from 'lucide-react';
import { format } from 'date-fns'; // For formatting dates
import { enUS } from 'date-fns/locale'; // Import enUS locale

interface ConversationSummary {
    conversationId: string;
    createdAt: string; // ISO string
    agentA_llm: string;
    agentB_llm: string;
    language: string;
}

export default function HistoryPage() {
    const { user, loading: authLoading } = useAuth();
    const { language } = useLanguage();
    // const t = getTranslation(language.code as AppLanguageCode) as TranslationKeys;

    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return; // Wait for auth state to resolve

        if (!user) {
            setLoading(false);
            // Potentially redirect to login or show a message
            // For now, just stop loading if no user.
            setError("You must be logged in to view history.");
            return;
        }

        async function fetchHistory() {
            setLoading(true);
            setError(null);
            if (!user) { // More explicit check
                setError("User not available for fetching history.");
                setLoading(false);
                return;
            }
            try {
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
                console.error("Failed to fetch conversation history:", err);
                setError(err instanceof Error ? err.message : "An error occurred while fetching history.");
            }
            setLoading(false);
        }

        fetchHistory();
    }, [user, authLoading]); // Removed t from dependencies

    if (authLoading || loading) {
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
                            <p className="text-muted-foreground">You haven't had any conversations yet. Start one to see it here!</p>
                        </CardContent>
                    </Card>
                )}

                {!error && conversations.length > 0 && (
                    <div className="space-y-4">
                        {conversations.map((convo) => {
                            let formattedDate = 'Invalid Date';
                            try {
                                formattedDate = format(new Date(convo.createdAt), 'PPP p', { locale: enUS }); // Use enUS
                            } catch (e) {
                                console.error("Error formatting date:", e, "Input was:", convo.createdAt);
                            }
                            return (
                                <Link key={convo.conversationId} href={`/history/${convo.conversationId}`} passHref legacyBehavior>
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