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

interface LanguageSelectorProps {
    showIcon?: boolean;
    className?: string;
}

export function LanguageSelector({ showIcon = true, className = '' }: LanguageSelectorProps) {
    const { language, setLanguage } = useLanguage();

    const handleLanguageChange = (languageCode: string) => {
        const selectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
        if (selectedLanguage) {
            setLanguage(selectedLanguage);
        }
    };

    return (
        <div className={`flex items-center ${className}`}>
            {showIcon && <Globe className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />}
            <Select value={language.code} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                            <span className="font-medium">{lang.nativeName}</span>
                            {lang.code !== language.code && (
                                <span className="ml-2 text-sm text-gray-500">({lang.name})</span>
                            )}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
} 