// src/lib/languages.ts
// Language configuration for internationalization

export interface Language {
    code: string;           // ISO 639-1 code (e.g., 'en', 'fr')
    name: string;           // English name
    nativeName: string;     // Name in the language itself
    direction: 'ltr' | 'rtl'; // Text direction
    supported: boolean;     // Whether Gemini supports this language
}

export const SUPPORTED_LANGUAGES: Language[] = [
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', supported: true },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr', supported: true },
    { code: 'bg', name: 'Bulgarian', nativeName: 'Български', direction: 'ltr', supported: true },
    { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr', supported: true },
    { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', direction: 'ltr', supported: true },
    { code: 'cs', name: 'Czech', nativeName: 'Čeština', direction: 'ltr', supported: true },
    { code: 'da', name: 'Danish', nativeName: 'Dansk', direction: 'ltr', supported: true },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', direction: 'ltr', supported: true },
    { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', supported: true },
    { code: 'et', name: 'Estonian', nativeName: 'Eesti', direction: 'ltr', supported: true },
    { code: 'fi', name: 'Finnish', nativeName: 'Suomi', direction: 'ltr', supported: true },
    { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', supported: true },
    { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr', supported: true },
    { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', direction: 'ltr', supported: true },
    { code: 'iw', name: 'Hebrew', nativeName: 'עברית', direction: 'rtl', supported: true },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', supported: true },
    { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', direction: 'ltr', supported: true },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', direction: 'ltr', supported: true },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', direction: 'ltr', supported: true },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr', supported: true },
    { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr', supported: true },
    { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', direction: 'ltr', supported: true },
    { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', direction: 'ltr', supported: true },
    { code: 'no', name: 'Norwegian', nativeName: 'Norsk', direction: 'ltr', supported: true },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', direction: 'ltr', supported: true },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', direction: 'ltr', supported: true },
    { code: 'ro', name: 'Romanian', nativeName: 'Română', direction: 'ltr', supported: true },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr', supported: true },
    { code: 'sr', name: 'Serbian', nativeName: 'Српски', direction: 'ltr', supported: true },
    { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', direction: 'ltr', supported: true },
    { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', direction: 'ltr', supported: true },
    { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', supported: true },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', direction: 'ltr', supported: true },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska', direction: 'ltr', supported: true },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', direction: 'ltr', supported: true },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', direction: 'ltr', supported: true },
    { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', direction: 'ltr', supported: true },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', direction: 'ltr', supported: true },
];

export function getLanguageByCode(code: string): Language | undefined {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}

export function getDefaultLanguage(): Language {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === 'en')!;
} 