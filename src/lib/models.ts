// src/lib/models.ts
// Centralized definition for available Large Language Models

export interface LLMInfo {
    id: string; // Unique identifier used in backend (e.g., 'llama3-70b-8192')
    name: string; // User-friendly name (e.g., 'Llama 3 70B (Groq)')
    provider: 'OpenAI' | 'Google' | 'Anthropic' | 'XAI' | 'Groq'; // Added Groq, removed Replicate, Mistral, Cohere for now
    contextWindow: number; // Context window size in tokens
    pricing: {
        input: number; // Price per 1 million input tokens (in USD)
        output: number; // Price per 1 million output tokens (in USD)
        note?: string; // Optional note, e.g., for preview models or variable pricing
    };
    apiKeyInstructionsUrl: string; // Link to get API keys page for the provider
    apiKeySecretName: string; // The Secret Manager secret *key ID* (e.g., 'openai', 'google_ai', 'xai', 'groq')
    status?: 'stable' | 'preview' | 'experimental' | 'beta'; // Optional status indicator
    requiresOrgVerification?: boolean; // Flag for models requiring organization verification
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
        requiresOrgVerification: true, // Requires verification
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
    },

    // === Google ===
    {
        id: 'gemini-2.5-pro-preview-03-25',
        name: 'Gemini 2.5 Pro',
        provider: 'Google',
        contextWindow: 2000000,
        pricing: { input: 1.25, output: 10.00, note: 'Higher rate for >200k tokens' },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'preview',
    },
    {
        id: 'gemini-2.5-flash-preview-04-17',
        name: 'Gemini 2.5 Flash',
        provider: 'Google',
        contextWindow: 2000000,
        pricing: { input: 0.15, output: 3.50, note: 'Output uses Thinking rate' },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'preview',
    },
    {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        provider: 'Google',
        contextWindow: 0, // Placeholder - Needs verification
        pricing: { input: 0.10, output: 0.40 },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'experimental', // Assuming experimental/preview
    },
    {
        id: 'gemini-2.0-flash-lite',
        name: 'Gemini 2.0 Flash-Lite',
        provider: 'Google',
        contextWindow: 0, // Placeholder - Needs verification
        pricing: { input: 0.075, output: 0.30 },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'experimental', // Assuming experimental/preview
    },
    {
        id: 'gemini-1.5-pro-latest',
        name: 'Gemini 1.5 Pro',
        provider: 'Google',
        contextWindow: 1000000,
        pricing: { input: 1.25, output: 5.00, note: 'Higher rate for >128k tokens' },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'stable',
    },
    {
        id: 'gemini-1.5-flash-latest',
        name: 'Gemini 1.5 Flash',
        provider: 'Google',
        contextWindow: 1000000,
        pricing: { input: 0.075, output: 0.30, note: 'Higher rate for >128k tokens' },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'stable',
    },
    {
        id: 'gemini-1.5-flash-8b',
        name: 'Gemini 1.5 Flash-8B',
        provider: 'Google',
        contextWindow: 0, // Placeholder - Needs verification
        pricing: { input: 0.0375, output: 0.15, note: 'Higher rate for >128k tokens' },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'stable',
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
    },
    {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet v2',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { input: 3.00, output: 15.00, note: 'Pricing assumed same as 2024-06-20 version' },
        apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
        apiKeySecretName: 'anthropic',
        status: 'stable',
        requiresOrgVerification: false,
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
    },

    // === XAI (Grok) ===
    {
        id: 'grok-3-beta',
        name: 'Grok 3 Beta',
        provider: 'XAI',
        contextWindow: 131072,
        pricing: { input: 3.00, output: 15.00 },
        apiKeyInstructionsUrl: 'https://docs.x.ai/',
        apiKeySecretName: 'xai',
        status: 'beta',
    },
    {
        id: 'grok-3-fast-beta',
        name: 'Grok 3 Fast Beta',
        provider: 'XAI',
        contextWindow: 131072,
        pricing: { input: 5.00, output: 25.00 },
        apiKeyInstructionsUrl: 'https://docs.x.ai/',
        apiKeySecretName: 'xai',
        status: 'beta',
    },
    {
        id: 'grok-3-mini-beta',
        name: 'Grok 3 Mini Beta',
        provider: 'XAI',
        contextWindow: 131072,
        pricing: { input: 0.30, output: 0.50 },
        apiKeyInstructionsUrl: 'https://docs.x.ai/',
        apiKeySecretName: 'xai',
        status: 'beta',
    },
    {
        id: 'grok-3-mini-fast-beta',
        name: 'Grok 3 Mini Fast Beta',
        provider: 'XAI',
        contextWindow: 131072,
        pricing: { input: 0.60, output: 4.00 },
        apiKeyInstructionsUrl: 'https://docs.x.ai/',
        apiKeySecretName: 'xai',
        status: 'beta',
    },
    {
        id: 'grok-2-1212',
        name: 'Grok 2',
        provider: 'XAI',
        contextWindow: 131072,
        pricing: { input: 2.00, output: 10.00, note: 'Pricing needs official source confirmation' },
        apiKeyInstructionsUrl: 'https://docs.x.ai/',
        apiKeySecretName: 'xai',
        status: 'stable',
    },

    // === Groq (Llama) ===
    {
        id: 'llama3-70b-8192',
        name: 'Llama 3 70B (Groq)',
        provider: 'Groq',
        contextWindow: 8192,
        pricing: { input: 0.59, output: 0.79 }, // From Groq pricing table
        apiKeyInstructionsUrl: 'https://console.groq.com/keys',
        apiKeySecretName: 'groq', // Use 'groq' as the key name
        status: 'stable',
    },
    {
        id: 'llama3-8b-8192',
        name: 'Llama 3 8B (Groq)',
        provider: 'Groq',
        contextWindow: 8192,
        pricing: { input: 0.05, output: 0.08 }, // From Groq pricing table
        apiKeyInstructionsUrl: 'https://console.groq.com/keys',
        apiKeySecretName: 'groq',
        status: 'stable',
    },
    {
        id: 'llama-3.1-8b-instant', // ID from Groq table
        name: 'Llama 3.1 8B Instant (Groq)',
        provider: 'Groq',
        contextWindow: 131072, // From user list
        pricing: { input: 0.05, output: 0.08 }, // From Groq pricing table
        apiKeyInstructionsUrl: 'https://console.groq.com/keys',
        apiKeySecretName: 'groq',
        status: 'stable',
    },
     {
        id: 'llama-3.3-70b-versatile', // ID from Groq table
        name: 'Llama 3.3 70B Versatile (Groq)',
        provider: 'Groq',
        contextWindow: 131072, // From user list
        pricing: { input: 0.59, output: 0.79 }, // From Groq pricing table
        apiKeyInstructionsUrl: 'https://console.groq.com/keys',
        apiKeySecretName: 'groq',
        status: 'stable',
    },
    {
        id: 'llama-guard-3-8b', // ID from Groq table
        name: 'Llama Guard 3 8B (Groq)',
        provider: 'Groq',
        contextWindow: 8192, // From user list
        pricing: { input: 0.20, output: 0.20 }, // From Groq pricing table (Note: Safety model)
        apiKeyInstructionsUrl: 'https://console.groq.com/keys',
        apiKeySecretName: 'groq',
        status: 'stable',
    },
    // --- Removed Replicate Models ---
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
