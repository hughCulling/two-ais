// src/app/settings/api-keys/page.tsx
// Page specifically for managing API keys (Auth handled by layout)

'use client'; // ApiKeyManager uses client hooks

import ApiKeyManager from '@/components/settings/ApiKeyManager'; // Adjust path if needed
import { useLanguage } from '@/context/LanguageContext'; // Added
import { getTranslation, TranslationKeys } from '@/lib/translations'; // Added
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ApiKeysPage() {
    const { language } = useLanguage(); // Added
    const t = getTranslation(language.code) as TranslationKeys; // Added
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace('/');
      }
    }, [user, loading, router]);

    if (loading) return null;
    if (!user) return null;

    // No useAuth, useEffect, loading, or redirect logic needed here.
    // The SettingsLayout ensures the user is authenticated before rendering this page.
    return (
        <div className="space-y-6 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                 <div className="space-y-1.5">
                     {/* Page title */}
                     <h1 className="text-2xl font-semibold leading-none tracking-tight">
                        {t.settings.apiKeys.title}
                     </h1>
                     <p className="text-sm text-muted-foreground">
                        {t.settings.apiKeys.description}
                     </p>
                 </div>

                 {/* Render the ApiKeyManager component */}
                 {/* IMPORTANT: Remember to remove internal H2 and padding/max-width from ApiKeyManager.tsx */}
                <ApiKeyManager />
            </div>
    );
}
