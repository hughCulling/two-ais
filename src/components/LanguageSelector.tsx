'use client';

import { useLanguage } from '@/context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useId } from 'react';

interface LanguageSelectorProps {
    showIcon?: boolean;
    className?: string;
    id?: string;
}

export function LanguageSelector({ showIcon = true, className = '', id }: LanguageSelectorProps) {
    const { language, setLanguage } = useLanguage();
    const { t, loading } = useTranslation();
    const generatedId = useId();
    const labelId = id || `language-selector-label-${generatedId}`;

    const handleLanguageChange = (languageCode: string) => {
        const selectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
        if (selectedLanguage) {
            setLanguage(selectedLanguage);
        }
    };

    if (loading || !t) {
        return (
            <div className={`flex items-center ${className}`} role="status" aria-live="polite">
                <span>Loading...</span>
            </div>
        );
    }

    return (
        <div className={`flex items-center ${className}`} role="group" aria-labelledby={labelId}>
            {showIcon && (
                <Globe 
                    className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" 
                    aria-hidden="true"
                />
            )}
            <div id={labelId} className="sr-only">Language Selection</div>
            <Select value={language.code} onValueChange={handleLanguageChange}>
                <SelectTrigger 
                    className="w-[100px] relative justify-center pr-7 [&>span]:flex [&>span]:justify-center [&>span]:overflow-hidden [&>span]:text-ellipsis [&>span]:whitespace-nowrap [&>span]:max-w-[65px] [&>svg:last-child]:absolute [&>svg:last-child]:right-2 [&>svg:last-child]:left-auto" 
                    aria-label={`Current language: ${language.nativeName}. Click to change language.`}
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent role="listbox" aria-label="Available languages">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                        <SelectItem 
                            key={lang.code} 
                            value={lang.code}
                            role="option"
                            aria-label={`${lang.nativeName}${lang.code !== language.code ? ` (${t.languages[lang.code as keyof typeof t.languages] || lang.name})` : ''}`}
                            aria-selected={lang.code === language.code}
                        >
                            <span className="font-medium">{lang.nativeName}</span>
                            {lang.code !== language.code && (
                                <span className="ml-2 text-sm text-gray-500">
                                    ({t.languages[lang.code as keyof typeof t.languages] || lang.name})
                                </span>
                            )}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
} 