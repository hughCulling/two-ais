// src/lib/models.ts
// Centralized definition for available Large Language Models

export interface LLMInfo {
id: string; // Unique identifier used in backend (e.g., 'gpt-4-turbo')
name: string; // User-friendly name (e.g., 'GPT-4 Turbo')
provider: 'OpenAI' | 'Google' | 'Anthropic' | 'Mistral' | 'Cohere'; // Add more providers as needed
contextWindow: number; // Optional: Context window size in tokens
pricing: {
    input: number; // Price per 1 million input tokens (in USD)
    output: number; // Price per 1 million output tokens (in USD)
    note?: string; // Optional note, e.g., for preview models or variable pricing
};
apiKeyInstructionsUrl: string; // Link to get API keys page for the provider
apiKeySecretName: string; // The Secret Manager key version name expected by the backend/settings
status?: 'stable' | 'preview' | 'experimental'; // Optional status indicator
}

// --- AVAILABLE LARGE LANGUAGE MODELS ---
// Pricing based on user-provided documents (April 2025) - Always verify official sources for current rates.
export const AVAILABLE_LLMS: LLMInfo[] = [
// === OpenAI ===
    {
    id: 'gpt-4o',
    name: 'GPT-4o (Omni)',
    provider: 'OpenAI',
    contextWindow: 128000,
    pricing: { input: 2.50, output: 10.00 }, // Updated GPT-4o pricing
    apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    apiKeySecretName: 'OPENAI_API_KEY_VERSION',
    status: 'stable',
},
{
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    provider: 'OpenAI',
    contextWindow: 1047576,
    pricing: { input: 2.00, output: 8.00 }, // Updated GPT-4.1 pricing
    apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    apiKeySecretName: 'OPENAI_API_KEY_VERSION',
    status: 'stable',
},
{
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    contextWindow: 128000,
    pricing: { input: 10.00, output: 30.00 }, // Updated GPT-4 Turbo pricing
    apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    apiKeySecretName: 'OPENAI_API_KEY_VERSION',
    status: 'stable',
},
{
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    contextWindow: 8192,
    pricing: { input: 30.00, output: 60.00 }, // Updated GPT-4 pricing
    apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    apiKeySecretName: 'OPENAI_API_KEY_VERSION',
    status: 'stable',
},
{
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    contextWindow: 16385,
    pricing: { input: 0.50, output: 1.50 }, // Updated GPT-3.5 Turbo pricing
    apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    apiKeySecretName: 'OPENAI_API_KEY_VERSION',
    status: 'stable',
},

// === Google ===
{
    // Using specific preview identifier from Google Docs
    id: 'gemini-2.5-pro-preview-03-25', // Or latest specific ID if different
    name: 'Gemini 2.5 Pro', // UI will add (Preview) based on status
    provider: 'Google',
    contextWindow: 2000000,
    // --- UPDATED PRICE ---
    // Using >200k token price for simplicity. CHECK OFFICIAL PRICING PAGE.
    pricing: { input: 2.50, output: 15.00, note: '>200k tokens rate' }, // Updated Gemini 2.5 Pro price
    apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
    apiKeySecretName: 'GEMINI_API_KEY_VERSION',
    status: 'preview',
},
{
    // Using specific preview identifier from Google Docs
    id: 'gemini-2.5-flash-preview-04-17', // Or latest specific ID if different
    name: 'Gemini 2.5 Flash', // UI will add (Preview) based on status
    provider: 'Google',
    contextWindow: 2000000,
    // --- UPDATED PRICE ---
    // Using text input rate and "Thinking" output rate. CHECK OFFICIAL PRICING PAGE.
    pricing: { input: 0.15, output: 3.50, note: 'Output uses Thinking rate' }, // Updated Gemini 2.5 Flash price
    apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
    apiKeySecretName: 'GEMINI_API_KEY_VERSION',
    status: 'preview',
},
{
    id: 'gemini-1.5-pro-latest',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    contextWindow: 1000000,
    // Using base rate (<=128k tokens) and adding note
    pricing: { input: 1.25, output: 5.00, note: 'Higher rate for >128k tokens' }, // Updated Gemini 1.5 Pro pricing
    apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
    apiKeySecretName: 'GEMINI_API_KEY_VERSION',
    status: 'stable',
},
    {
    id: 'gemini-1.5-flash-latest',
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    contextWindow: 1000000,
    // --- UPDATED PRICE ---
    // Using base rate (<=128k tokens) and adding note
    pricing: { input: 0.075, output: 0.30, note: 'Higher rate for >128k tokens' }, // Updated Gemini 1.5 Flash pricing
    apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
    apiKeySecretName: 'GEMINI_API_KEY_VERSION',
    status: 'stable',
},
// --- REMOVED Gemini 1.0 Pro ---

// === Anthropic (Example - Add Later) ===
// ...
];

// --- Helper Functions (Keep existing) ---
export function getLLMInfoById(id: string): LLMInfo | undefined {
    return AVAILABLE_LLMS.find(llm => llm.id === id);
}
export function getLLMInfoBySecretName(secretName: string): LLMInfo | undefined {
    return AVAILABLE_LLMS.find(llm => llm.apiKeySecretName === secretName);
}
export function groupLLMsByProvider(): Record<string, LLMInfo[]> {
    return AVAILABLE_LLMS.reduce((acc, llm) => {
        const providerKey = llm.provider;
        if (!acc[providerKey]) {
            acc[providerKey] = [];
        }
        acc[providerKey].push(llm);
        return acc;
    }, {} as Record<string, LLMInfo[]>);
}
