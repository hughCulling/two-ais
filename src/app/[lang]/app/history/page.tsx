'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquareText, Loader2, AlertTriangle, Inbox } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { getLLMInfoById } from '@/lib/models';

interface ConversationSummary {
    conversationId: string;
    createdAt: string; // ISO string
    agentA_llm: string;
    agentB_llm: string;
    language: string;
}

// Helper to generate smart pagination with ellipses
function getPagination(current: number, total: number, delta = 2) {
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined = undefined;

    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
            range.push(i);
        }
    }
    for (let i = 0; i < range.length; i++) {
        if (l !== undefined) {
            if ((range[i] as number) - l === 2) {
                rangeWithDots.push(l + 1);
            } else if ((range[i] as number) - l > 2) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(range[i]);
        l = range[i] as number;
    }
    return rangeWithDots;
}

export default function HistoryPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { language } = useLanguage();
    const { t, loading: translationLoading } = useTranslation();

    const PAGE_SIZE = 20;
    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [totalCount, setTotalCount] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [pageLoading, setPageLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/');
        }
    }, [user, loading, router]);

    const fetchPage = useCallback(async (page: number) => {
        if (!user) return;
        if (page === 1) setHistoryLoading(true);
        else setPageLoading(true);
        setError(null);
        try {
            const idToken = await user.getIdToken();
            const offset = (page - 1) * PAGE_SIZE;
            const response = await fetch(`/api/conversations/history?limit=${PAGE_SIZE}&offset=${offset}`, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "An error occurred while fetching history." }));
                throw new Error(errorData.error || `Error fetching history: ${response.status}`);
            }
            const data = await response.json();
            setConversations(data.conversations);
            setTotalCount(data.totalCount);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred while fetching history.");
        }
        if (page === 1) setHistoryLoading(false);
        else setPageLoading(false);
    }, [user]);

    useEffect(() => {
        if (!user || loading) return;
        fetchPage(currentPage);
    }, [user, loading, currentPage, fetchPage]);

    const totalPages = totalCount ? Math.ceil(totalCount / PAGE_SIZE) : 1;

    const handlePageChange = (page: number) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Now safe to return early
    if (loading || translationLoading || !t) return null;
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
                        {t.history.conversationHistory}
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href={`/${language.code}/app`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t.history.backToMain}
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
                                <Link key={convo.conversationId} href={`/${language.code}/app/history/${convo.conversationId}`} passHref legacyBehavior>
                                    <a className="block hover:no-underline">
                                        <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
                                            <CardHeader>
                                                <CardTitle className="text-lg">
                                                    {t.history.chatWith
                                                        .replace('{agentA}', getLLMInfoById(convo.agentA_llm)?.name || convo.agentA_llm)
                                                        .replace('{agentB}', getLLMInfoById(convo.agentB_llm)?.name || convo.agentB_llm)
                                                    }
                                                </CardTitle>
                                                <CardDescription>
                                                    {`Started on ${formattedDate}`} - Language: {convo.language.toUpperCase()}
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </a>
                                </Link>
                            );
                        })}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6 gap-2 flex-wrap">
                                {getPagination(currentPage, totalPages, 2).map((item, idx) =>
                                    typeof item === 'number' ? (
                                        <Button
                                            key={item}
                                            variant={item === currentPage ? 'default' : 'outline'}
                                            onClick={() => handlePageChange(item)}
                                            disabled={pageLoading && item === currentPage}
                                            className={item === currentPage ? 'font-bold' : ''}
                                        >
                                            {item}
                                        </Button>
                                    ) : (
                                        <span key={`ellipsis-${idx}`} className="px-2 py-1 text-gray-400 select-none">{item}</span>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
} 