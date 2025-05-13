// src/lib/models.ts
// Centralized definition for available Large Language Models

export interface LLMInfo {
    id: string; // Unique identifier used in backend
    name: string; // User-friendly name
    provider: 'OpenAI' | 'Google' | 'Anthropic' | 'xAI' | 'TogetherAI';
    contextWindow: number; // Context window size in tokens
    pricing: {
        input: number; // Price per 1 million input tokens (in USD)
        output: number; // Price per 1 million output tokens (in USD)
        note?: string; // Optional note for complex pricing
    };
    apiKeyInstructionsUrl: string; // Link to get API keys page for the provider
    apiKeySecretName: string; // The Secret Manager secret *key ID*
    status?: 'stable' | 'preview' | 'experimental' | 'beta';
    requiresOrgVerification?: boolean;
    usesReasoningTokens?: boolean; // Used for OpenAI reasoning, Google thinking, Anthropic/xAI extended thinking
    category?: string; // For categorizing models by purpose/capability/series
}

// --- AVAILABLE LARGE LANGUAGE MODELS ---

export const AVAILABLE_LLMS: LLMInfo[] = [
    // === OpenAI ===
     {
        id: 'chatgpt-4o-latest',
        name: 'ChatGPT-4o',
        provider: 'OpenAI',
        contextWindow: 128000,
        pricing: { input: 5.00, output: 15.00 },
        apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
        apiKeySecretName: 'openai',
        status: 'stable',
        requiresOrgVerification: false,
        category: 'Flagship chat models',
    },
    {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'OpenAI',
        contextWindow: 128000,
        pricing: { input: 2.50, output: 10.00 },
        apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
        apiKeySecretName: 'openai',
        status: 'stable',
        category: 'Flagship chat models',
    },
    {
        id: 'gpt-4o-mini',
        name: 'GPT-4o mini',
        provider: 'OpenAI',
        contextWindow: 128000,
        pricing: { input: 0.15, output: 0.60 },
        apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
        apiKeySecretName: 'openai',
        status: 'stable',
        requiresOrgVerification: false,
        category: 'Cost-optimized models',
    },
    {
        id: 'gpt-4.1',
        name: 'GPT-4.1',
        provider: 'OpenAI',
        contextWindow: 1047576,
        pricing: { input: 2.00, output: 8.00 },
        apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
        apiKeySecretName: 'openai',
        status: 'stable',
        category: 'Flagship chat models',
    },
     {
        id: 'gpt-4.1-mini',
        name: 'GPT-4.1 mini',
        provider: 'OpenAI',
        contextWindow: 1047576,
        pricing: { input: 0.40, output: 1.60 },
        apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
        apiKeySecretName: 'openai',
        status: 'stable',
        requiresOrgVerification: false,
        category: 'Cost-optimized models',
    },
    {
        id: 'gpt-4.1-nano',
        name: 'GPT-4.1 nano',
        provider: 'OpenAI',
        contextWindow: 1047576,
        pricing: { input: 0.10, output: 0.40 },
        apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
        apiKeySecretName: 'openai',
        status: 'stable',
        requiresOrgVerification: false,
        category: 'Cost-optimized models',
    },
    {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'OpenAI',
        contextWindow: 128000,
        pricing: { input: 10.00, output: 30.00 },
        apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
        apiKeySecretName: 'openai',
        status: 'stable',
        category: 'Older GPT models',
    },
    {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'OpenAI',
        contextWindow: 8192,
        pricing: { input: 30.00, output: 60.00 },
        apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
        apiKeySecretName: 'openai',
        status: 'stable',
        category: 'Older GPT models',
    },
    {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'OpenAI',
        contextWindow: 16385,
        pricing: { input: 0.50, output: 1.50 },
        apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
        apiKeySecretName: 'openai',
        status: 'stable',
        category: 'Older GPT models',
    },
    {
        id: 'o4-mini',
        name: 'o4-mini',
        provider: 'OpenAI',
        contextWindow: 200000,
        pricing: { input: 1.10, output: 4.40 },
        apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
        apiKeySecretName: 'openai',
        status: 'stable',
        usesReasoningTokens: true,
        category: 'Reasoning models',
    },
    {
        id: 'o3',
        name: 'o3',
        provider: 'OpenAI',
        contextWindow: 200000,
        pricing: { input: 10.00, output: 40.00 },
        apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
        apiKeySecretName: 'openai',
        status: 'stable',
        requiresOrgVerification: true,
        usesReasoningTokens: true,
        category: 'Reasoning models',
    },
    {
        id: 'o3-mini',
        name: 'o3-mini',
        provider: 'OpenAI',
        contextWindow: 200000,
        pricing: { input: 1.10, output: 4.40 },
        apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
        apiKeySecretName: 'openai',
        status: 'stable',
        requiresOrgVerification: false,
        usesReasoningTokens: true,
        category: 'Reasoning models', 
    },
    {
        id: 'o1',
        name: 'o1',
        provider: 'OpenAI',
        contextWindow: 200000,
        pricing: { input: 15.00, output: 60.00 },
        apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
        apiKeySecretName: 'openai',
        status: 'stable',
        requiresOrgVerification: false,
        usesReasoningTokens: true,
        category: 'Reasoning models',
    },

    // === Google ===
    {
        id: 'gemini-2.5-pro-preview-03-25', 
        name: 'Gemini 2.5 Pro',
        provider: 'Google',
        contextWindow: 2000000,
        pricing: { 
            input: 1.25, 
            output: 10.00, 
            note: '$1.25 (≤200k tkns), $2.50 (>200k tkns) / $10.00 (≤200k tkns), $15.00 (>200k tkns) MTok' 
        },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'preview',
        usesReasoningTokens: true, 
        category: 'Gemini 2.5 Series',
    },
    {
        id: 'gemini-2.5-flash-preview-04-17', 
        name: 'Gemini 2.5 Flash',
        provider: 'Google',
        contextWindow: 2000000,
        pricing: { 
            input: 0.15, 
            output: 3.50, 
            note: '$0.15 / $0.60 (non-thinking), $3.50 (thinking) MTok.' 
        },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'preview',
        usesReasoningTokens: true, 
        category: 'Gemini 2.5 Series',
    },
    {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        provider: 'Google',
        contextWindow: 0, 
        pricing: { input: 0.10, output: 0.40 },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'experimental',
        category: 'Gemini 2.0 Series',
    },
    {
        id: 'gemini-2.0-flash-lite',
        name: 'Gemini 2.0 Flash-Lite',
        provider: 'Google',
        contextWindow: 0, 
        pricing: { input: 0.075, output: 0.30 },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'experimental',
        category: 'Gemini 2.0 Series',
    },
    {
        id: 'gemini-1.5-pro-latest',
        name: 'Gemini 1.5 Pro',
        provider: 'Google',
        contextWindow: 1000000,
        pricing: { 
            input: 1.25, 
            output: 5.00, 
            note: '$1.25 (≤128k tkns), $2.50 (>128k tkns) / $5.00 (≤128k tkns), $10.00 (>128k tkns) MTok'
        },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'stable',
        category: 'Gemini 1.5 Series',
    },
    {
        id: 'gemini-1.5-flash-latest',
        name: 'Gemini 1.5 Flash',
        provider: 'Google',
        contextWindow: 1000000,
        pricing: { 
            input: 0.075, 
            output: 0.30, 
            note: '$0.075 (≤128k tkns), $0.15 (>128k tkns) / $0.30 (≤128k tkns), $0.60 (>128k tkns) MTok'
        },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'stable',
        category: 'Gemini 1.5 Series',
    },
    {
        id: 'gemini-1.5-flash-8b',
        name: 'Gemini 1.5 Flash-8B',
        provider: 'Google',
        contextWindow: 0, 
        pricing: { 
            input: 0.0375, 
            output: 0.15,  
            note: '$0.0375 (≤128k tkns), $0.075 (>128k tkns) / $0.15 (≤128k tkns), $0.30 (>128k tkns) MTok'
        },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'stable',
        category: 'Gemini 1.5 Series',
    },

    // === Anthropic ===
    {
        id: 'claude-3-7-sonnet-20250219',
        name: 'Claude 3.7 Sonnet',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { input: 3.00, output: 15.00 }, 
        apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
        apiKeySecretName: 'anthropic',
        status: 'stable', 
        usesReasoningTokens: true,
        category: 'Claude 3.7 Series',
    },
    {
        id: 'claude-3-5-sonnet-20240620',
        name: 'Claude 3.5 Sonnet',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { input: 3.00, output: 15.00 },
        apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
        apiKeySecretName: 'anthropic',
        status: 'stable',
        category: 'Claude 3.5 Series',
    },
     {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { input: 0.80, output: 4.00 },
        apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
        apiKeySecretName: 'anthropic',
        status: 'stable',
        category: 'Claude 3.5 Series',
    },
    {
        id: 'claude-3-5-sonnet-20241022', 
        name: 'Claude 3.5 Sonnet v2',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { input: 3.00, output: 15.00 },
        apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
        apiKeySecretName: 'anthropic',
        status: 'stable',
        requiresOrgVerification: false,
        category: 'Claude 3.5 Series',
    },
    {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { input: 15.00, output: 75.00 },
        apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
        apiKeySecretName: 'anthropic',
        status: 'stable',
        category: 'Claude 3 Series',
    },
     {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { input: 0.25, output: 1.25 },
        apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
        apiKeySecretName: 'anthropic',
        status: 'stable',
        category: 'Claude 3 Series',
    },

    // === xAI (Grok) ===
    {
        id: 'grok-3-beta',
        name: 'Grok 3 Beta',
        provider: 'xAI', 
        contextWindow: 131072,
        pricing: { input: 3.00, output: 15.00 },
        apiKeyInstructionsUrl: 'https://docs.x.ai/',
        apiKeySecretName: 'xai', 
        status: 'beta',
        category: 'Grok 3 Series',
        usesReasoningTokens: false, 
    },
    {
        id: 'grok-3-fast-beta',
        name: 'Grok 3 Fast Beta',
        provider: 'xAI', 
        contextWindow: 131072,
        pricing: { input: 5.00, output: 25.00 },
        apiKeyInstructionsUrl: 'https://docs.x.ai/',
        apiKeySecretName: 'xai',
        status: 'beta',
        category: 'Grok 3 Series', 
        usesReasoningTokens: false, 
    },
    {
        id: 'grok-3-mini-beta',
        name: 'Grok 3 Mini Beta',
        provider: 'xAI', 
        contextWindow: 131072,
        pricing: { input: 0.30, output: 0.50 },
        apiKeyInstructionsUrl: 'https://docs.x.ai/',
        apiKeySecretName: 'xai',
        status: 'beta',
        category: 'Grok 3 Mini Series',
        usesReasoningTokens: true, 
    },
    {
        id: 'grok-3-mini-fast-beta',
        name: 'Grok 3 Mini Fast Beta',
        provider: 'xAI', 
        contextWindow: 131072,
        pricing: { input: 0.60, output: 4.00 },
        apiKeyInstructionsUrl: 'https://docs.x.ai/',
        apiKeySecretName: 'xai',
        status: 'beta',
        category: 'Grok 3 Mini Series', 
        usesReasoningTokens: true, 
    },

    // === Together.ai ===
    {
        id: 'meta-llama/Llama-4-Scout-17B-16E-Instruct',
        name: 'Llama 4 Scout Instruct (17Bx16E)',
        provider: 'TogetherAI',
        contextWindow: 1048576, 
        pricing: { input: 0.18, output: 0.59 },
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable', 
        category: 'Llama 4 Series',
    },
    {
        id: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
        name: 'Llama 4 Maverick Instruct (17Bx128E)',
        provider: 'TogetherAI',
        contextWindow: 1048576, 
        pricing: { input: 0.27, output: 0.85 },
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable',
        category: 'Llama 4 Series',
    },
    {
        id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
        name: 'Meta Llama 3.3 70B Instruct Turbo',
        provider: 'TogetherAI',
        contextWindow: 131072, 
        pricing: { input: 0.88, output: 0.88 }, 
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable',
        category: 'Llama 3.3 Series',
    },
    { 
        id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
        name: 'Meta Llama 3.3 70B Instruct Turbo Free',
        provider: 'TogetherAI',
        contextWindow: 131072, 
        pricing: { input: 0.00, output: 0.00, note: 'Free' }, // Updated note
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable',
        category: 'Llama 3.3 Series',
    },
    {
        id: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
        name: 'Meta Llama 3.1 405B Instruct Turbo',
        provider: 'TogetherAI',
        contextWindow: 130815, 
        pricing: { input: 3.50, output: 3.50 }, 
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable',
        category: 'Llama 3.1 Series',
    },
    {
        id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
        name: 'Meta Llama 3.1 8B Instruct Turbo',
        provider: 'TogetherAI',
        contextWindow: 131072, 
        pricing: { input: 0.18, output: 0.18 }, 
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable',
        category: 'Llama 3.1 Series',
    },
    { 
        id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
        name: 'Meta Llama 3.1 70B Instruct Turbo',
        provider: 'TogetherAI',
        contextWindow: 131072, 
        pricing: { input: 0.88, output: 0.88 },
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable',
        category: 'Llama 3.1 Series',
    },
    {
        id: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
        name: 'Meta Llama 3.2 3B Instruct Turbo',
        provider: 'TogetherAI',
        contextWindow: 131072, 
        pricing: { input: 0.06, output: 0.06 }, 
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable',
        category: 'Llama 3.2 Series',
    },
    { 
        id: 'meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo',
        name: 'Meta Llama 3.2 11B Vision Instruct Turbo',
        provider: 'TogetherAI',
        contextWindow: 131072, 
        pricing: { input: 0.18, output: 0.18 }, 
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable',
        category: 'Llama 3.2 Series', 
    },
    { 
        id: 'meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo',
        name: 'Meta Llama 3.2 90B Vision Instruct Turbo',
        provider: 'TogetherAI',
        contextWindow: 131072, 
        pricing: { input: 1.20, output: 1.20 }, 
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable',
        category: 'Llama 3.2 Series', 
    },
    {
        id: 'meta-llama/Meta-Llama-3-70B-Instruct-Turbo', 
        name: 'Meta Llama 3 70B Instruct Turbo', 
        provider: 'TogetherAI',
        contextWindow: 8192, 
        pricing: { input: 0.88, output: 0.88 }, 
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable',
        category: 'Llama 3 Series',
    },
    {
        id: 'meta-llama/Meta-Llama-3-8B-Instruct-Lite',
        name: 'Meta Llama 3 8B Instruct Lite',
        provider: 'TogetherAI',
        contextWindow: 8192, 
        pricing: { input: 0.10, output: 0.10 }, 
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable',
        category: 'Llama 3 Series',
    },
    {
        id: 'meta-llama/Llama-3-70b-chat-hf', 
        name: 'Meta Llama 3 70B Instruct Reference', 
        provider: 'TogetherAI',
        contextWindow: 8192, 
        pricing: { input: 0.88, output: 0.88 }, 
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable',
        category: 'Llama 3 Series',
    },
    {
        id: 'meta-llama/Llama-3-8b-chat-hf', 
        name: 'Meta Llama 3 8B Instruct Reference', 
        provider: 'TogetherAI',
        contextWindow: 8192, 
        pricing: { input: 0.20, output: 0.20 }, 
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable',
        category: 'Llama 3 Series',
    },
    { 
        id: 'meta-llama/Llama-Vision-Free',
        name: 'Meta Llama Vision Free',
        provider: 'TogetherAI',
        contextWindow: 8192, 
        pricing: { input: 0.00, output: 0.00, note: 'Free' }, // Updated note
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable',
        category: 'Llama Vision Models', 
    },
];

// --- Helper Functions ---

/**
 * Finds LLM information by its unique backend ID.
 */
export function getLLMInfoById(id: string): LLMInfo | undefined {
    return AVAILABLE_LLMS.find(llm => llm.id === id);
}

/**
 * Finds LLM information by the Secret Manager secret *key ID* associated with its API key.
 */
export function getLLMInfoBySecretName(secretName: string): LLMInfo | undefined {
    return AVAILABLE_LLMS.find(llm => llm.apiKeySecretName === secretName);
}

/**
 * Groups available LLMs by their provider.
 */
export function groupLLMsByProvider(): Record<string, LLMInfo[]> {
    const grouped = AVAILABLE_LLMS.reduce((acc, llm) => {
        const providerKey = llm.provider;
        if (!acc[providerKey]) {
            acc[providerKey] = [];
        }
        acc[providerKey].push(llm);
        return acc;
    }, {} as Record<string, LLMInfo[]>);

    // Sort models within each provider group alphabetically by name for consistent display
    for (const providerKey in grouped) {
        grouped[providerKey].sort((a, b) => a.name.localeCompare(b.name));
    }
    return grouped;
}
