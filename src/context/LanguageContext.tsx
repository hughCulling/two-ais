'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Language, getLanguageByCode, getDefaultLanguage } from '@/lib/languages';
import { getTranslationAsync, TranslationKeys } from '@/lib/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    translation: TranslationKeys | null;
    loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
    lang?: string;
}

export function LanguageProvider({ children, lang }: LanguageProviderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [language, setLanguageState] = useState<Language>(() => {
        if (lang) {
            const urlLang = getLanguageByCode(lang);
            if (urlLang) return urlLang;
        }
        const savedLanguageCode = typeof window !== 'undefined' ? localStorage.getItem('selectedLanguage') : null;
        if (savedLanguageCode) {
            const savedLanguage = getLanguageByCode(savedLanguageCode);
            if (savedLanguage) return savedLanguage;
        }
        return getDefaultLanguage();
    });
    const [translation, setTranslation] = useState<TranslationKeys | null>(null);
    const [loading, setLoading] = useState(true);

    // Update language when URL lang prop changes
    useEffect(() => {
        if (lang) {
            const urlLang = getLanguageByCode(lang);
            if (urlLang && urlLang.code !== language.code) {
                setLanguageState(urlLang);
            }
        }
    }, [lang, language.code]);

    // Load translation when language changes
    useEffect(() => {
        setLoading(true);
        getTranslationAsync(language.code).then(t => {
            setTranslation(t);
            setLoading(false);
        });
        document.documentElement.dir = language.direction;
    }, [language]);

    const setLanguage = (newLanguage: Language) => {
        setLanguageState(newLanguage);
        localStorage.setItem('selectedLanguage', newLanguage.code);
        document.documentElement.dir = newLanguage.direction;

        // Construct the new URL with the selected language
        const pathSegments = pathname.split('/');
        const newPath = `/${newLanguage.code}/${pathSegments.slice(2).join('/')}`;
        router.push(newPath);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, translation, loading }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
} 