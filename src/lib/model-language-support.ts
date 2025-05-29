// src/lib/model-language-support.ts
// Language support mapping for different AI providers

export interface ModelSpecificLanguageSupport {
    modelId: string; // Exact model ID from models.ts
    supportedLanguages: string[];
    notes?: string;
}

export interface LanguageSupport {
    provider: string;
    defaultSupportedLanguages?: string[]; // ISO 639-1 codes - General support for the provider
    modelOverrides?: ModelSpecificLanguageSupport[]; // Specific overrides for models within this provider
    notes?: string;
}

// Based on user-provided information and official documentation
export const MODEL_LANGUAGE_SUPPORT: LanguageSupport[] = [
    {
        provider: 'Google',
        // Gemini supports all 39 languages as documented
        defaultSupportedLanguages: [
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
        defaultSupportedLanguages: [
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
        defaultSupportedLanguages: [
            'en', 'es', 'pt', 'it', 'fr', 'id', 'de', 'ar', 'zh', 'ko',
            'ja', 'hi', 'bn', 'sw'
        ],
        notes: 'Languages with strong performance (>80% relative to English)'
    },
    {
        provider: 'xAI',
        // Based on Grok website language selector
        defaultSupportedLanguages: [
            'ar', 'bn', 'de', 'en', 'es', 'fa', 'tl', 'fr', 'id', 'it',
            'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'sv', 'tr', 'uk', 'vi',
            'zh'
        ],
        notes: 'Based on Grok interface languages'
    },
    {
        provider: 'TogetherAI',
        defaultSupportedLanguages: ['en'], // Default to English for TogetherAI models unless overridden
        modelOverrides: [
            {
                modelId: 'meta-llama/Llama-4-Scout-17B-16E-Instruct',
                supportedLanguages: ['ar', 'en', 'fr', 'de', 'hi', 'id', 'it', 'pt', 'es', 'tl', 'th', 'vi'],
                notes: 'Image understanding is English-only for Llama 4 models.'
            },
            {
                modelId: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
                supportedLanguages: ['ar', 'en', 'fr', 'de', 'hi', 'id', 'it', 'pt', 'es', 'tl', 'th', 'vi'],
                notes: 'Image understanding is English-only for Llama 4 models.'
            },
            {
                modelId: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
                supportedLanguages: ['en'],
                notes: 'Defaulted to English-only due to no specific multilingual documentation found.'
            },
            {
                modelId: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
                supportedLanguages: ['en'],
                notes: 'Defaulted to English-only due to no specific multilingual documentation found.'
            },
            {
                modelId: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
                supportedLanguages: ['en'],
                notes: 'Defaulted to English-only due to no specific multilingual documentation found.'
            },
            {
                modelId: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
                supportedLanguages: ['en'],
                notes: 'Defaulted to English-only due to no specific multilingual documentation found.'
            },
            {
                modelId: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
                supportedLanguages: ['en'],
                notes: 'Defaulted to English-only due to no specific multilingual documentation found.'
            },
            {
                modelId: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
                supportedLanguages: ['en'],
                notes: 'Defaulted to English-only due to no specific multilingual documentation found.'
            },
            {
                modelId: 'meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo',
                supportedLanguages: ['en'],
                notes: 'Defaulted to English-only due to no specific multilingual documentation found. Vision capabilities may also be language-specific.'
            },
            {
                modelId: 'meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo',
                supportedLanguages: ['en'],
                notes: 'Defaulted to English-only due to no specific multilingual documentation found. Vision capabilities may also be language-specific.'
            },
            {
                modelId: 'meta-llama/Meta-Llama-3-70B-Instruct-Turbo',
                supportedLanguages: ['en'],
                notes: 'Defaulted to English-only due to no specific multilingual documentation found.'
            },
            {
                modelId: 'meta-llama/Meta-Llama-3-8B-Instruct-Lite',
                supportedLanguages: ['en'],
                notes: 'Defaulted to English-only due to no specific multilingual documentation found.'
            },
            {
                modelId: 'meta-llama/Llama-3-70b-chat-hf',
                supportedLanguages: ['en'],
                notes: 'Defaulted to English-only due to no specific multilingual documentation found.'
            },
            {
                modelId: 'meta-llama/Llama-3-8b-chat-hf',
                supportedLanguages: ['en'],
                notes: 'Defaulted to English-only due to no specific multilingual documentation found.'
            },
            {
                modelId: 'meta-llama/Llama-Vision-Free',
                supportedLanguages: ['en'],
                notes: 'Defaulted to English-only due to no specific multilingual documentation found. Vision capabilities may also be language-specific.'
            },
            {
                modelId: 'google/gemma-2-27b-it',
                supportedLanguages: ['en'],
                notes: 'Assumed English-only based on available documentation.'
            },
            {
                modelId: 'google/gemma-2-9b-it',
                supportedLanguages: ['en'],
                notes: 'Assumed English-only based on available documentation.'
            },
            {
                modelId: 'google/gemma-2b-it',
                supportedLanguages: ['en'],
                notes: 'Assumed English-only based on available documentation.'
            },
            {
                modelId: 'deepseek-ai/DeepSeek-R1',
                supportedLanguages: ['en', 'zh'],
                notes: 'Based on website language options (English/Chinese).'
            },
            {
                modelId: 'deepseek-ai/DeepSeek-V3',
                supportedLanguages: ['en', 'zh'],
                notes: 'Based on website language options (English/Chinese).'
            },
            {
                modelId: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B',
                supportedLanguages: ['en', 'zh'],
                notes: 'Assumed English/Chinese based on parent model series website options.'
            },
            {
                modelId: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B',
                supportedLanguages: ['en', 'zh'],
                notes: 'Assumed English/Chinese based on parent model series website options.'
            },
            {
                modelId: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B',
                supportedLanguages: ['en', 'zh'],
                notes: 'Assumed English/Chinese based on parent model series website options.'
            },
            {
                modelId: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free',
                supportedLanguages: ['en', 'zh'],
                notes: 'Assumed English/Chinese based on parent model series website options.'
            },
            {
                modelId: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
                supportedLanguages: ['en', 'fr', 'it', 'de', 'es'],
                notes: 'Based on official Mistral AI documentation for Mixtral 8x7B.'
            },
            {
                modelId: 'mistralai/Mistral-Small-24B-Instruct-2501',
                supportedLanguages: ['en'],
                notes: 'Documented as multilingual (European, East Asian, Middle Eastern languages) but specific languages beyond English are not listed. Defaulting to English.'
            },
            {
                modelId: 'Qwen/Qwen3-235B-A22B-fp8-tput',
                supportedLanguages: ['zh', 'en', 'fr', 'es', 'pt', 'de', 'it', 'ru', 'ja', 'ko', 'vi', 'th', 'ar'],
                notes: 'Qwen3 series. Supports 100+ languages; explicitly listed are based on Qwen2.5 details. Check Qwen3 docs for full capabilities.'
            },
            {
                modelId: 'Qwen/QwQ-32B',
                supportedLanguages: ['zh', 'en', 'ja', 'fr', 'es'],
                notes: 'Based on language options in Qwen GitHub documentation.'
            },
            {
                modelId: 'Qwen/Qwen2.5-VL-72B-Instruct',
                supportedLanguages: ['zh', 'en', 'fr', 'es', 'pt', 'de', 'it', 'ru', 'ja', 'ko', 'vi', 'th', 'ar'],
                notes: 'Text capabilities based on Qwen2.5 series documentation (13+ languages); vision tasks may have different language specifics.'
            },
            {
                modelId: 'Qwen/Qwen2-VL-72B-Instruct',
                supportedLanguages: ['zh', 'en', 'ja', 'fr', 'es'],
                notes: 'Text capabilities based on Qwen GitHub documentation; vision tasks may have different language specifics.'
            },
            {
                modelId: 'Qwen/Qwen2.5-Coder-32B-Instruct',
                supportedLanguages: ['zh', 'en', 'fr', 'es', 'pt', 'de', 'it', 'ru', 'ja', 'ko', 'vi', 'th', 'ar'],
                notes: 'Assumed to follow general Qwen2.5 series language support (13+ languages). Primarily a code model.'
            },
            {
                modelId: 'Qwen/Qwen2.5-72B-Instruct-Turbo',
                supportedLanguages: ['zh', 'en', 'fr', 'es', 'pt', 'de', 'it', 'ru', 'ja', 'ko', 'vi', 'th', 'ar'],
                notes: 'Based on Qwen2.5 series documentation (supports these 13+ languages).'
            },
            {
                modelId: 'Qwen/Qwen2.5-7B-Instruct-Turbo',
                supportedLanguages: ['zh', 'en', 'fr', 'es', 'pt', 'de', 'it', 'ru', 'ja', 'ko', 'vi', 'th', 'ar'],
                notes: 'Based on Qwen2.5 series documentation (supports these 13+ languages).'
            },
            {
                modelId: 'Qwen/Qwen2-72B-Instruct',
                supportedLanguages: ['zh', 'en', 'ja', 'fr', 'es'],
                notes: 'Based on language options in Qwen GitHub documentation.'
            }
        ],
        notes: 'Language support varies by model. Explicit per-model listing is preferred. Models not explicitly listed default to English-only support based on general capabilities of underlying model architectures unless specified otherwise in their documentation.'
    }
];

export function isLanguageSupported(provider: string, languageCode: string, modelId?: string): boolean {
    const providerSupport = MODEL_LANGUAGE_SUPPORT.find(s => s.provider === provider);
    if (!providerSupport) return false;

    if (modelId && providerSupport.modelOverrides) {
        const modelOverride = providerSupport.modelOverrides.find(override => override.modelId === modelId);
        if (modelOverride) {
            return modelOverride.supportedLanguages.includes(languageCode);
        }
    }

    // Fallback to default provider languages if no specific model override matches or no modelId provided
    if (providerSupport.defaultSupportedLanguages) {
        return providerSupport.defaultSupportedLanguages.includes(languageCode);
    }
    
    // If provider has no defaultSupportedLanguages (e.g. TogetherAI after this change for non-overridden models)
    // and no override matched, this will effectively mean unsupported unless a default is set.
    // For TogetherAI, if a model is not in modelOverrides, it will return false here, which is desired.
    return false;
}

export function getProviderLanguageSupport(provider: string): LanguageSupport | undefined {
    return MODEL_LANGUAGE_SUPPORT.find(s => s.provider === provider);
} 