// src/lib/models.ts
// Centralized definition for available Large Language Models

export interface LLMInfo {
    id: string; // Unique identifier used in backend (e.g., 'claude-3-opus-20240229')
    name: string; // User-friendly name (e.g., 'Claude 3 Opus')
    // Ensure 'Anthropic' is included in the provider list
    provider: 'OpenAI' | 'Google' | 'Anthropic' | 'Mistral' | 'Cohere'; // Add more providers as needed
    contextWindow: number; // Context window size in tokens
    pricing: {
        input: number; // Price per 1 million input tokens (in USD)
        output: number; // Price per 1 million output tokens (in USD)
        note?: string; // Optional note, e.g., for preview models or variable pricing
    };
    apiKeyInstructionsUrl: string; // Link to get API keys page for the provider
    // The Secret Manager secret *key ID* expected by the backend/settings.
    // This should match the key used in ApiKeyManager (e.g., 'openai', 'google_ai')
    apiKeySecretName: string;
    status?: 'stable' | 'preview' | 'experimental'; // Optional status indicator
}

// --- AVAILABLE LARGE LANGUAGE MODELS ---
// Pricing verified against user-provided Anthropic docs (April 2025) - Always double-check official sources.
export const AVAILABLE_LLMS: LLMInfo[] = [
    // === OpenAI ===
    {
        id: 'gpt-4o',
        name: 'GPT-4o', // Changed from 'GPT-4o (Omni)'
        provider: 'OpenAI',
        contextWindow: 128000,
        pricing: { input: 2.50, output: 10.00 }, // Example pricing - Please verify
        apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
        apiKeySecretName: 'openai', // Use the key ID 'openai'
        status: 'stable',
    },
    {
        id: 'gpt-4.1', // Assuming this exists and is different from gpt-4-turbo
        name: 'GPT-4.1',
        provider: 'OpenAI',
        contextWindow: 1047576, // Verify this large context window
        pricing: { input: 2.00, output: 8.00 }, // Example pricing - Please verify
        apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
        apiKeySecretName: 'openai',
        status: 'stable',
    },
    {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'OpenAI',
        contextWindow: 128000,
        pricing: { input: 10.00, output: 30.00 }, // Example pricing - Please verify
        apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
        apiKeySecretName: 'openai',
        status: 'stable',
    },
    {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'OpenAI',
        contextWindow: 8192, // Note: Older context window, check if intended
        pricing: { input: 30.00, output: 60.00 }, // Example pricing - Please verify
        apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
        apiKeySecretName: 'openai',
        status: 'stable',
    },
    {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'OpenAI',
        contextWindow: 16385,
        pricing: { input: 0.50, output: 1.50 }, // Example pricing - Please verify
        apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
        apiKeySecretName: 'openai',
        status: 'stable',
    },
    // --- Added o4-mini ---
    {
        id: 'o4-mini', // Model ID
        name: 'o4-mini', // Display Name
        provider: 'OpenAI',
        contextWindow: 200000, // Context window from provided text
        pricing: { input: 1.10, output: 4.40 }, // Pricing from provided text
        apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys', // Standard OpenAI key URL
        apiKeySecretName: 'openai', // Uses the standard OpenAI key ID
        status: 'stable', // Assuming stable status
    },
    // --- End Added o4-mini ---

    // === Google ===
    {
        id: 'gemini-2.5-pro-preview-03-25', // Example ID - Verify actual ID if needed
        name: 'Gemini 2.5 Pro',
        provider: 'Google',
        contextWindow: 2000000,
        pricing: { input: 2.50, output: 15.00, note: '>200k tokens rate' }, // Example pricing - Please verify
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai', // Use the key ID 'google_ai'
        status: 'preview',
    },
    {
        id: 'gemini-2.5-flash-preview-04-17', // Example ID - Verify actual ID if needed
        name: 'Gemini 2.5 Flash',
        provider: 'Google',
        contextWindow: 2000000,
        pricing: { input: 0.15, output: 3.50, note: 'Output uses Thinking rate' }, // Example pricing - Please verify
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'preview',
    },
    {
        id: 'gemini-1.5-pro-latest',
        name: 'Gemini 1.5 Pro',
        provider: 'Google',
        contextWindow: 1000000,
        pricing: { input: 1.25, output: 5.00, note: 'Higher rate for >128k tokens' }, // Example pricing - Please verify
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'stable',
    },
    {
        id: 'gemini-1.5-flash-latest',
        name: 'Gemini 1.5 Flash',
        provider: 'Google',
        contextWindow: 1000000,
        pricing: { input: 0.075, output: 0.30, note: 'Higher rate for >128k tokens' }, // Example pricing - Please verify
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'stable',
    },

    // === Anthropic ===
    // Model IDs, Context Windows (200K for all listed), and Pricing ($/MTok) based on user-provided docs [cite: 1]
    {
        // Most intelligent model (as of Feb 2025 docs)
        id: 'claude-3-7-sonnet-20250219', // Verify actual ID if needed
        name: 'Claude 3.7 Sonnet',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { input: 3.00, output: 15.00 },
        apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
        apiKeySecretName: 'anthropic', // Use the key ID 'anthropic'
        status: 'stable', // Assuming stable based on docs
    },
    {
        // Previous most intelligent model (as of Oct 2024 docs)
        id: 'claude-3-5-sonnet-20240620', // Using the specific version ID
        name: 'Claude 3.5 Sonnet',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { input: 3.00, output: 15.00 },
        apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
        apiKeySecretName: 'anthropic',
        status: 'stable',
    },
     {
        // Fastest model (as of Oct 2024 docs)
        id: 'claude-3-5-haiku-20241022', // Verify actual ID if needed
        name: 'Claude 3.5 Haiku',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { input: 0.80, output: 4.00 },
        apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
        apiKeySecretName: 'anthropic',
        status: 'stable', // Assuming stable based on docs
    },
    {
        // Powerful model for complex tasks
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
        // Fastest and most compact model (original Haiku)
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku', // Added clarification
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { input: 0.25, output: 1.25 },
        apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
        apiKeySecretName: 'anthropic',
        status: 'stable',
    },
    // Note: The original Claude 3 Sonnet (claude-3-sonnet-20240229) was not listed.
    // Add it here if needed, ensuring you have correct pricing.
];

// --- Helper Functions (Keep existing) ---

/**
 * Finds LLM information by its unique backend ID.
 * @param id The backend ID of the LLM (e.g., 'gpt-4o', 'claude-3-opus-20240229').
 * @returns The LLMInfo object or undefined if not found.
 */
export function getLLMInfoById(id: string): LLMInfo | undefined {
    return AVAILABLE_LLMS.find(llm => llm.id === id);
}

/**
 * Finds LLM information by the Secret Manager secret *key ID* associated with its API key.
 * @param secretName The secret key ID (e.g., 'openai', 'anthropic').
 * @returns The first matching LLMInfo object or undefined if not found.
 */
export function getLLMInfoBySecretName(secretName: string): LLMInfo | undefined {
    // This will return the first match if multiple models share the same secret name (which is expected per provider)
    return AVAILABLE_LLMS.find(llm => llm.apiKeySecretName === secretName);
}

/**
 * Groups available LLMs by their provider.
 * @returns An object where keys are provider names and values are arrays of LLMInfo objects for that provider, sorted by name.
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
