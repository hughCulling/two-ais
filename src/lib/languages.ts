// src/lib/languages.ts
// Language configuration for internationalization
import type { LanguageCode } from '../lib/translations'; // Adjusted import path

export interface Language {
    code: LanguageCode;     // ISO 639-1 code (e.g., 'en', 'fr')
    name: string;           // English name
    nativeName: string;     // Name in the language itself
    direction: 'ltr' | 'rtl'; // Text direction
    supported: boolean;     // Whether the language is generally supported by models/TTS
    isRtl?: boolean;        // Explicit RTL check, can be derived from direction
}

export const SUPPORTED_LANGUAGES: Language[] = [
    { code: 'sq', name: 'Albanian', nativeName: 'Shqip', direction: 'ltr', supported: true, isRtl: false },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', direction: 'ltr', supported: true, isRtl: false },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', supported: true, isRtl: true },
    { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', direction: 'ltr', supported: true, isRtl: false },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr', supported: true },
    { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', direction: 'ltr', supported: true, isRtl: false },
    { code: 'bg', name: 'Bulgarian', nativeName: 'Български', direction: 'ltr', supported: true },
    { code: 'my', name: 'Burmese', nativeName: 'မြန်မာဘာသာ', direction: 'ltr', supported: true, isRtl: false },
    { code: 'ca', name: 'Catalan', nativeName: 'Català', direction: 'ltr', supported: true, isRtl: false },
    { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr', supported: true },
    { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', direction: 'ltr', supported: true },
    { code: 'cs', name: 'Czech', nativeName: 'Čeština', direction: 'ltr', supported: true },
    { code: 'da', name: 'Danish', nativeName: 'Dansk', direction: 'ltr', supported: true },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', direction: 'ltr', supported: true },
    { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', supported: true },
    { code: 'et', name: 'Estonian', nativeName: 'Eesti', direction: 'ltr', supported: true },
    { code: 'fi', name: 'Finnish', nativeName: 'Suomi', direction: 'ltr', supported: true },
    { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', supported: true },
    { code: 'ka', name: 'Georgian', nativeName: 'ქართული', direction: 'ltr', supported: true, isRtl: false },
    { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr', supported: true },
    { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', direction: 'ltr', supported: true },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', direction: 'ltr', supported: true, isRtl: false },
    { code: 'iw', name: 'Hebrew', nativeName: 'עברית', direction: 'rtl', supported: true, isRtl: true },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', supported: true },
    { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', direction: 'ltr', supported: true },
    { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', direction: 'ltr', supported: true, isRtl: false },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', direction: 'ltr', supported: true },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', direction: 'ltr', supported: true },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr', supported: true },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', direction: 'ltr', supported: true, isRtl: false },
    { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ тілі', direction: 'ltr', supported: true, isRtl: false },
    { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr', supported: true },
    { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', direction: 'ltr', supported: true },
    { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', direction: 'ltr', supported: true },
    { code: 'mk', name: 'Macedonian', nativeName: 'Македонски јазик', direction: 'ltr', supported: true, isRtl: false },
    { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', direction: 'ltr', supported: true, isRtl: false },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', direction: 'ltr', supported: true, isRtl: false },
    { code: 'mt', name: 'Maltese', nativeName: 'Malti', direction: 'ltr', supported: true, isRtl: false },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', direction: 'ltr', supported: true, isRtl: false },
    { code: 'mn', name: 'Mongolian', nativeName: 'Монгол хэл', direction: 'ltr', supported: true, isRtl: false },
    { code: 'no', name: 'Norwegian', nativeName: 'Norsk', direction: 'ltr', supported: true },
    { code: 'fa', name: 'Persian', nativeName: 'فارسی', direction: 'rtl', supported: true, isRtl: true },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', direction: 'ltr', supported: true },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', direction: 'ltr', supported: true },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', direction: 'ltr', supported: true, isRtl: false },
    { code: 'ro', name: 'Romanian', nativeName: 'Română', direction: 'ltr', supported: true },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr', supported: true },
    { code: 'sr', name: 'Serbian', nativeName: 'Српски', direction: 'ltr', supported: true },
    { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', direction: 'ltr', supported: true },
    { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', direction: 'ltr', supported: true },
    { code: 'so', name: 'Somali', nativeName: 'Soomaali', direction: 'ltr', supported: true, isRtl: false },
    { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', supported: true },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', direction: 'ltr', supported: true },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska', direction: 'ltr', supported: true },
    { code: 'tl', name: 'Tagalog', nativeName: 'Tagalog', direction: 'ltr', supported: true, isRtl: false },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', direction: 'ltr', supported: true, isRtl: false },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', direction: 'ltr', supported: true, isRtl: false },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', direction: 'ltr', supported: true },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', direction: 'ltr', supported: true },
    { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', direction: 'ltr', supported: true },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', direction: 'rtl', supported: true, isRtl: true },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', direction: 'ltr', supported: true }
];

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.find(lang => lang.code === 'en')!; // English

export function getLanguageByCode(code: string): Language | undefined {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}

export function getDefaultLanguage(): Language {
    // We need to find English in the potentially re-ordered list.
    const englishLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === 'en');
    if (!englishLanguage) {
        // Fallback or error handling if English is somehow missing
        console.error("English language definition not found!");
        return SUPPORTED_LANGUAGES[0]; // Return the first available language as a fallback
    }
    return englishLanguage;
} 