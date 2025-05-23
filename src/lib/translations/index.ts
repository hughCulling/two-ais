import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';
import { ja } from './ja';
import { zh } from './zh';
import { ar } from './ar';
import { pt } from './pt';
import { hi } from './hi';

// Type for our translation structure
export type TranslationKeys = typeof en;

// All translations will follow the same structure as English
export const translations = {
    en,
    es,
    fr,
    de,
    ja,
    zh,
    ar,
    pt,
    hi,
    // Other languages will be added here as they're created
};

export type LanguageCode = keyof typeof translations;

export const getTranslation = (lang: LanguageCode) => {
    return translations[lang] || translations.en;
}; 