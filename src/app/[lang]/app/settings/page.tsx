// src/app/settings/page.tsx
// This page now just redirects to the default settings section (Appearance)

'use client';

import { redirect } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function SettingsRootPage() {
    const { language } = useLanguage();
    // Redirect to the default settings section (Appearance)
    redirect(`/${language.code}/app/settings/appearance`);

    // This part usually won't render as the redirect happens server-side.
    // return null;
}
