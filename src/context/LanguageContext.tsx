'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getLanguageByCode, getDefaultLanguage } from '@/lib/languages';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
    const [language, setLanguageState] = useState<Language>(getDefaultLanguage());

    // Load language preference from localStorage on mount
    useEffect(() => {
        const savedLanguageCode = localStorage.getItem('selectedLanguage');
        if (savedLanguageCode) {
            const savedLanguage = getLanguageByCode(savedLanguageCode);
            if (savedLanguage) {
                setLanguageState(savedLanguage);
                // Update document direction for RTL languages
                document.documentElement.dir = savedLanguage.direction;
            }
        }
    }, []);

    const setLanguage = (newLanguage: Language) => {
        setLanguageState(newLanguage);
        localStorage.setItem('selectedLanguage', newLanguage.code);
        // Update document direction for RTL languages
        document.documentElement.dir = newLanguage.direction;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
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