import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';
import { ja } from './ja';
import { zh } from './zh';
import { ar } from './ar';
import { pt } from './pt';

// Type for our translation structure
export type TranslationKeys = typeof en;

// All translations will follow the same structure as English
export const translations: Record<string, TranslationKeys> = {
    en,
    es,
    fr,
    de,
    ja,
    zh,
    ar,
    pt,
    // Other languages will be added here as they're created
};

// Get translation for a specific language code
export function getTranslation(languageCode: string): TranslationKeys {
    return translations[languageCode] || translations.en;
} 