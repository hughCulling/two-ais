// src/lib/model-language-support.ts
// Language support mapping for different AI providers

export interface LanguageSupport {
    provider: string;
    supportedLanguages: string[]; // ISO 639-1 codes
    notes?: string;
}

// Based on user-provided information and official documentation
export const MODEL_LANGUAGE_SUPPORT: LanguageSupport[] = [
    {
        provider: 'Google',
        // Gemini supports all 39 languages as documented
        supportedLanguages: [
            'ar', 'bn', 'bg', 'zh', 'hr', 'cs', 'da', 'nl', 'en', 'et',
            'fi', 'fr', 'de', 'el', 'iw', 'hi', 'hu', 'id', 'it', 'ja',
            'ko', 'lv', 'lt', 'no', 'pl', 'pt', 'ro', 'ru', 'sr', 'sk',
            'sl', 'es', 'sw', 'sv', 'th', 'tr', 'uk', 'vi'
        ],
        notes: 'Full support for all listed languages'
    },
    {
        provider: 'OpenAI',
        // Based on ChatGPT language selector
        supportedLanguages: [
            'en', 'mt', 'ar', 'bg', 'bn', 'bs', 'ca', 'cs', 'da', 'de',
            'el', 'es', 'et', 'fi', 'fr', 'gu', 'hi', 'hr', 'hu', 'hy',
            'id', 'is', 'it', 'ja', 'ka', 'kk', 'kn', 'ko', 'lt', 'lv',
            'mk', 'ml', 'mr', 'ms', 'my', 'no', 'nl', 'pa', 'pl', 'pt',
            'ro', 'ru', 'sk', 'sl', 'so', 'sq', 'sr', 'sv', 'sw', 'ta',
            'te', 'th', 'tl', 'tr', 'uk', 'ur', 'vi', 'zh', 'am', 'mn'
        ],
        notes: 'Based on ChatGPT interface languages'
    },
    {
        provider: 'Anthropic',
        // Languages with >80% performance relative to English
        supportedLanguages: [
            'en', 'es', 'pt', 'it', 'fr', 'id', 'de', 'ar', 'zh', 'ko',
            'ja', 'hi', 'bn', 'sw'
        ],
        notes: 'Languages with strong performance (>80% relative to English)'
    },
    {
        provider: 'xAI',
        // Based on Grok website language selector
        supportedLanguages: [
            'ar', 'bn', 'de', 'en', 'es', 'fa', 'tl', 'fr', 'id', 'it',
            'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'sv', 'tr', 'uk', 'vi',
            'zh'
        ],
        notes: 'Based on Grok interface languages'
    },
    {
        provider: 'TogetherAI',
        // Conservative estimate - most open models support major languages
        supportedLanguages: [
            'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko',
            'ar', 'hi', 'id', 'tr', 'vi', 'pl', 'nl', 'sv'
        ],
        notes: 'Support varies by model - major languages generally supported'
    }
];

export function isLanguageSupported(provider: string, languageCode: string): boolean {
    const support = MODEL_LANGUAGE_SUPPORT.find(s => s.provider === provider);
    return support ? support.supportedLanguages.includes(languageCode) : false;
}

export function getProviderLanguageSupport(provider: string): LanguageSupport | undefined {
    return MODEL_LANGUAGE_SUPPORT.find(s => s.provider === provider);
} 