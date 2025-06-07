'use client';

import { useLanguage } from '@/context/LanguageContext';
import { getTranslation, TranslationKeys } from '@/lib/translations';

export function useTranslation(): TranslationKeys {
    const { language } = useLanguage();
    return getTranslation(language.code);
} 