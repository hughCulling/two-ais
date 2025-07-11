'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
}

export function LanguageProvider({ children }: LanguageProviderProps) {
    const [language, setLanguageState] = useState<Language>(getDefaultLanguage());
    const [translation, setTranslation] = useState<TranslationKeys | null>(null);
    const [loading, setLoading] = useState(true);

    // Load language preference and translation from localStorage on mount
    useEffect(() => {
        const savedLanguageCode = localStorage.getItem('selectedLanguage');
        let initialLanguage = getDefaultLanguage();
        if (savedLanguageCode) {
            const savedLanguage = getLanguageByCode(savedLanguageCode);
            if (savedLanguage) {
                initialLanguage = savedLanguage;
                document.documentElement.dir = savedLanguage.direction;
            }
        }
        setLanguageState(initialLanguage);
        setLoading(true);
        getTranslationAsync(initialLanguage.code).then(t => {
            setTranslation(t);
            setLoading(false);
        });
    }, []);

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