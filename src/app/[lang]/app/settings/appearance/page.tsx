// src/app/settings/appearance/page.tsx
// Page specifically for appearance settings (Auth handled by layout)

'use client'; // ThemeSwitcher requires client component

import { ThemeSwitcher } from '@/components/theme-switcher'; // Adjust path if needed
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { AGENT_B_BUBBLE_CLASS } from '@/lib/chat-theme';

export default function AppearancePage() {
    const { t, loading: translationLoading } = useTranslation();
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/');
        }
    }, [user, loading, router]);

    if (loading || translationLoading || !t) return null;
    if (!user) return null;

    // No useAuth, useEffect, loading, or redirect logic needed here.
    // The SettingsLayout ensures the user is authenticated before rendering this page.
    return (
        <div className="space-y-6 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <div className="space-y-1.5">
                        <h1 className="text-2xl font-semibold leading-none tracking-tight">
                            {t.settings.sections.appearance}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t.settings.appearance.description}
                        </p>
                </div>

                {/* Theme setting row */}
                <div className="flex items-center justify-between rounded-md border p-4">
                        <span className="font-medium">{t.settings.appearance.theme}</span>
                        <ThemeSwitcher />
                </div>

                <div className="rounded-md border p-4 space-y-3">
                        <p className="text-sm font-medium">Chat Bubble Preview</p>
                        <div className="space-y-3">
                                <div className="flex justify-start">
                                        <div className="p-3 rounded-lg max-w-[75%] min-w-0 whitespace-pre-wrap shadow-sm bg-muted text-foreground">
                                                Agent A preview message
                                        </div>
                                </div>
                                <div className="flex justify-end">
                                        <div className={`p-3 rounded-lg max-w-[75%] min-w-0 whitespace-pre-wrap shadow-sm ${AGENT_B_BUBBLE_CLASS}`}>
                                                Agent B preview message
                                        </div>
                                </div>
                        </div>
                </div>
            </div>
    );
}
