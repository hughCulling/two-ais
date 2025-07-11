'use client';

import { useLanguage } from '@/context/LanguageContext';
import { TranslationKeys } from '@/lib/translations';

export function useTranslation(): { t: TranslationKeys | null, loading: boolean } {
    const { translation, loading } = useLanguage();
    return { t: translation, loading };
} 