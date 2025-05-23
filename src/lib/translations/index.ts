import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';
import { ja } from './ja';
import { zh } from './zh';
import { ar } from './ar';
import { pt } from './pt';
import { hi } from './hi';
import { bn } from './bn';
import { ru } from './ru';
import { it } from './it';
import { ko } from './ko';
import { tr } from './tr';
import { nl } from './nl';
import { sv } from './sv';
import { pl } from './pl';

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
    bn,
    ru,
    it,
    ko,
    tr,
    nl,
    sv,
    pl,
    // Other languages will be added here as they're created
};

export type LanguageCode = keyof typeof translations;

export const getTranslation = (lang: LanguageCode) => {
    return translations[lang] || translations.en;
}; 