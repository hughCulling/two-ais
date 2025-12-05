// src/lib/models.ts
// Centralized definition for available Large Language Models

import { TranslationKeys } from './translations';

export interface LLMInfo {
    id: string; // Unique identifier used in backend
    name: string; // User-friendly name
    provider: 'OpenAI' | 'Google' | 'Anthropic' | 'xAI' | 'TogetherAI' | 'DeepSeek' | 'Mistral AI' | 'Ollama';
    contextWindow: number; // Context window size in tokens
    pricing: {
        input: number; // Price per 1 million input tokens (in USD)
        output: number; // Price per 1 million output tokens (in USD)
        note?: string | ((t: TranslationKeys) => string); // Optional note for complex pricing (can be a string or a function that returns a string)
        freeTier?: {
            available: boolean; // Whether a free tier is available
            note?: string | ((t: TranslationKeys) => string); // Details about free tier limitations
        };
    };
    apiKeyInstructionsUrl: string; // Link to get API keys page for the provider
    apiKeySecretName: string; // The Secret Manager secret *key ID*
    status?: 'stable' | 'preview' | 'experimental' | 'beta';
    requiresOrgVerification?: boolean;
    usesReasoningTokens?: boolean; // Used for OpenAI reasoning, Google thinking, Anthropic/xAI extended thinking, Qwen/DeepSeek reasoning
    categoryKey?: string; // For categorizing models by purpose/capability/series
    knowledgeCutoff?: string; // Knowledge cutoff date for the model
    isOllamaModel?: boolean; // Indicates if this is a dynamically loaded Ollama model
    ollamaEndpoint?: string; // Custom Ollama endpoint (defaults to localhost:11434)
}

// --- AVAILABLE LARGE LANGUAGE MODELS ---

export const AVAILABLE_LLMS: LLMInfo[] = [

    // // === OpenAI ===
    // {
    //     id: 'gpt-5',
    //     name: 'GPT-5',
    //     provider: 'OpenAI',
    //     contextWindow: 400000,
    //     pricing: { 
    //         input: 1.25, 
    //         output: 10.00,
    //         // note: (t) => `$${1.25} / 1M input tokens, $${10.00} / 1M output tokens`
    //     },
    //     apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    //     apiKeySecretName: 'openai',
    //     status: 'stable',
    //     // requiresOrgVerification: true,
    //     usesReasoningTokens: true,
    //     categoryKey: 'modelCategory_Frontier',
    //     knowledgeCutoff: '2024-10-01',
    // },
    // {
    //     id: 'gpt-5-mini',
    //     name: 'GPT-5 mini',
    //     provider: 'OpenAI',
    //     contextWindow: 400000,
    //     pricing: { 
    //         input: 0.25, 
    //         output: 2.00,
    //         // note: (t) => `$${0.25} / 1M input tokens, $${2.00} / 1M output tokens`
    //     },
    //     apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    //     apiKeySecretName: 'openai',
    //     status: 'stable',
    //     // requiresOrgVerification: true,
    //     usesReasoningTokens: true,
    //     categoryKey: 'modelCategory_Frontier',
    //     knowledgeCutoff: '2024-05-31',
    // },
    // {
    //     id: 'gpt-5-nano',
    //     name: 'GPT-5 nano',
    //     provider: 'OpenAI',
    //     contextWindow: 400000,
    //     pricing: { 
    //         input: 0.05, 
    //         output: 0.40,
    //         // note: (t) => `$${0.05} / 1M input tokens, $${0.40} / 1M output tokens`
    //     },
    //     apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    //     apiKeySecretName: 'openai',
    //     status: 'stable',
    //     // requiresOrgVerification: true,
    //     usesReasoningTokens: true,
    //     categoryKey: 'modelCategory_Frontier',
    //     knowledgeCutoff: '2024-05-31',
    // },
    // {
    //     id: 'gpt-5-chat-latest',
    //     name: 'GPT-5 Chat',
    //     provider: 'OpenAI',
    //     contextWindow: 400000,
    //     pricing: { 
    //         input: 1.25, 
    //         output: 10.00,
    //         // note: (t) => `$${1.25} / 1M input tokens, $${10.00} / 1M output tokens`
    //     },
    //     apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    //     apiKeySecretName: 'openai',
    //     status: 'stable',
    //     // requiresOrgVerification: true,
    //     usesReasoningTokens: true,
    //     categoryKey: 'modelCategory_Frontier',
    //     knowledgeCutoff: '2024-09-30',
    // },
    // {
    //     id: 'chatgpt-4o-latest',
    //     name: 'ChatGPT-4o',
    //     provider: 'OpenAI',
    //     contextWindow: 128000,
    //     pricing: { input: 5.00, output: 15.00 },
    //     apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    //     apiKeySecretName: 'openai',
    //     status: 'stable',
    //     requiresOrgVerification: false,
    //     categoryKey: 'modelCategory_FlagshipChat',
    //     knowledgeCutoff: '2023-10-01',
    // },
    // {
    //     id: 'gpt-4o',
    //     name: 'GPT-4o',
    //     provider: 'OpenAI',
    //     contextWindow: 128000,
    //     pricing: { input: 2.50, output: 10.00 },
    //     apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    //     apiKeySecretName: 'openai',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_FlagshipChat',
    //     knowledgeCutoff: '2023-10-01',
    // },
    // {
    //     id: 'gpt-4o-mini',
    //     name: 'GPT-4o mini',
    //     provider: 'OpenAI',
    //     contextWindow: 128000,
    //     pricing: { input: 0.15, output: 0.60 },
    //     apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    //     apiKeySecretName: 'openai',
    //     status: 'stable',
    //     requiresOrgVerification: false,
    //     categoryKey: 'modelCategory_CostOptimized',
    //     knowledgeCutoff: '2023-10-01',
    // },
    // {
    //     id: 'gpt-4.1',
    //     name: 'GPT-4.1',
    //     provider: 'OpenAI',
    //     contextWindow: 1047576,
    //     pricing: { input: 2.00, output: 8.00 },
    //     apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    //     apiKeySecretName: 'openai',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_FlagshipChat',
    //     knowledgeCutoff: '2024-06-01',
    // },
    //  {
    //     id: 'gpt-4.1-mini',
    //     name: 'GPT-4.1 mini',
    //     provider: 'OpenAI',
    //     contextWindow: 1047576,
    //     pricing: { input: 0.40, output: 1.60 },
    //     apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    //     apiKeySecretName: 'openai',
    //     status: 'stable',
    //     requiresOrgVerification: false,
    //     categoryKey: 'modelCategory_CostOptimized',
    //     knowledgeCutoff: '2024-06-01',
    // },
    // {
    //     id: 'gpt-4.1-nano',
    //     name: 'GPT-4.1 nano',
    //     provider: 'OpenAI',
    //     contextWindow: 1047576,
    //     pricing: { input: 0.10, output: 0.40 },
    //     apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    //     apiKeySecretName: 'openai',
    //     status: 'stable',
    //     requiresOrgVerification: false,
    //     categoryKey: 'modelCategory_CostOptimized',
    //     knowledgeCutoff: '2024-06-01',
    // },
    // {
    //     id: 'gpt-4-turbo',
    //     name: 'GPT-4 Turbo',
    //     provider: 'OpenAI',
    //     contextWindow: 128000,
    //     pricing: { input: 10.00, output: 30.00 },
    //     apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    //     apiKeySecretName: 'openai',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_OlderGPT',
    //     knowledgeCutoff: '2023-12-01',
    // },
    // {
    //     id: 'gpt-4',
    //     name: 'GPT-4',
    //     provider: 'OpenAI',
    //     contextWindow: 8192,
    //     pricing: { input: 30.00, output: 60.00 },
    //     apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    //     apiKeySecretName: 'openai',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_OlderGPT',
    //     knowledgeCutoff: '2023-12-01',
    // },
    // {
    //     id: 'gpt-3.5-turbo',
    //     name: 'GPT-3.5 Turbo',
    //     provider: 'OpenAI',
    //     contextWindow: 16385,
    //     pricing: { input: 0.50, output: 1.50 },
    //     apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    //     apiKeySecretName: 'openai',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_OlderGPT',
    //     knowledgeCutoff: '2021-09-01',
    // },
    // {
    //     id: 'o4-mini',
    //     name: 'o4-mini',
    //     provider: 'OpenAI',
    //     contextWindow: 200000,
    //     pricing: { input: 1.10, output: 4.40 },
    //     apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    //     apiKeySecretName: 'openai',
    //     status: 'stable',
    //     usesReasoningTokens: true,
    //     categoryKey: 'modelCategory_Reasoning',
    //     knowledgeCutoff: '2024-06-01',
    // },
    // {
    //     id: 'o3',
    //     name: 'o3',
    //     provider: 'OpenAI',
    //     contextWindow: 200000,
    //     pricing: { input: 10.00, output: 40.00 },
    //     apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    //     apiKeySecretName: 'openai',
    //     status: 'stable',
    //     requiresOrgVerification: true,
    //     usesReasoningTokens: true,
    //     categoryKey: 'modelCategory_Reasoning',
    //     knowledgeCutoff: '2024-06-01',
    // },
    // {
    //     id: 'o3-mini',
    //     name: 'o3-mini',
    //     provider: 'OpenAI',
    //     contextWindow: 200000,
    //     pricing: { input: 1.10, output: 4.40 },
    //     apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    //     apiKeySecretName: 'openai',
    //     status: 'stable',
    //     requiresOrgVerification: false,
    //     usesReasoningTokens: true,
    //     categoryKey: 'modelCategory_Reasoning',
    //     knowledgeCutoff: '2023-10-01',
    // },
    // {
    //     id: 'o1',
    //     name: 'o1',
    //     provider: 'OpenAI',
    //     contextWindow: 200000,
    //     pricing: { input: 15.00, output: 60.00 },
    //     apiKeyInstructionsUrl: 'https://platform.openai.com/api-keys',
    //     apiKeySecretName: 'openai',
    //     status: 'stable',
    //     requiresOrgVerification: false,
    //     usesReasoningTokens: true,
    //     categoryKey: 'modelCategory_Reasoning',
    //     knowledgeCutoff: '2023-10-01',
    // },

    // // === Google ===
    // {
    //     id: 'gemini-2.5-pro', 
    //     name: 'Gemini 2.5 Pro',
    //     provider: 'Google', 
    //     contextWindow: 2000000,
    //     pricing: { 
    //         input: 1.25, 
    //         output: 10.00, 
    //         note: (t: TranslationKeys) => `$1.25 (≤200k ${t.pricing.tokens}), $2.50 (>200k ${t.pricing.tokens}) / $10.00 (≤200k ${t.pricing.tokens}), $15.00 (>200k ${t.pricing.tokens}) ${t.pricing.perMillionTokens}`,
    //         freeTier: {
    //             available: true,
    //             note: (t: TranslationKeys) => t.pricing.geminiFreeTierNote
    //         }
    //     },
    //     apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
    //     apiKeySecretName: 'google_ai',
    //     status: 'stable',
    //     usesReasoningTokens: true,
    //     categoryKey: 'modelCategory_Gemini2_5',
    //     knowledgeCutoff: '2025-01',
    // },
    // {
    //     id: 'gemini-2.5-flash',
    //     name: 'Gemini 2.5 Flash',
    //     provider: 'Google',
    //     contextWindow: 2000000,
    //     pricing: { 
    //         input: 0.30, 
    //         output: 2.50,
    //         freeTier: {
    //             available: true,
    //             note: (t: TranslationKeys) => t.pricing.geminiFreeTierNote
    //         }
    //     },
    //     apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
    //     apiKeySecretName: 'google_ai',
    //     status: 'stable',
    //     usesReasoningTokens: true, 
    //     categoryKey: 'modelCategory_Gemini2_5',
    //     knowledgeCutoff: '2025-01',
    // },
    // {
    //     id: 'gemini-2.0-flash-001',
    //     name: 'Gemini 2.0 Flash',
    //     provider: 'Google',
    //     contextWindow: 0, 
    //     pricing: { input: 0.10, output: 0.40,          
    //         freeTier: {
    //             available: true,
    //             note: (t: TranslationKeys) => t.pricing.geminiFreeTierNote
    //         } },
    //     apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
    //     apiKeySecretName: 'google_ai',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_Gemini2_0',
    //     knowledgeCutoff: '2024-08',
    // },
    // {
    //     id: 'gemini-2.0-flash-lite-001',
    //     name: 'Gemini 2.0 Flash-Lite',
    //     provider: 'Google',
    //     contextWindow: 0, 
    //     pricing: { 
    //         input: 0.075, 
    //         output: 0.30,
    //         freeTier: {
    //             available: true,
    //             note: (t: TranslationKeys) => t.pricing.geminiFreeTierNote
    //         }
    //     },
    //     apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
    //     apiKeySecretName: 'google_ai',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_Gemini2_0',
    //     knowledgeCutoff: '2024-08',
    // },
    // {
    //     id: 'gemini-1.5-pro',
    //     name: 'Gemini 1.5 Pro',
    //     provider: 'Google',
    //     contextWindow: 1000000,
    //     pricing: { 
    //         input: 1.25, 
    //         output: 5.00, 
    //         note: (t: TranslationKeys) => `$1.25 (≤128k ${t.pricing.tokens}), $2.50 (>128k ${t.pricing.tokens}) / $5.00 (≤128k ${t.pricing.tokens}), $10.00 (>128k ${t.pricing.tokens}) ${t.pricing.perMillionTokens}`,
    //         freeTier: {
    //             available: true,
    //             note: (t: TranslationKeys) => t.pricing.geminiFreeTierNote
    //         }
    //     },
    //     apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
    //     apiKeySecretName: 'google_ai',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_Gemini1_5',
    // },
    // {
    //     id: 'gemini-1.5-flash',
    //     name: 'Gemini 1.5 Flash',
    //     provider: 'Google',
    //     contextWindow: 1000000,
    //     pricing: { 
    //         input: 0.075, 
    //         output: 0.30, 
    //         note: (t: TranslationKeys) => `$0.075 (≤128k ${t.pricing.tokens}), $0.15 (>128k ${t.pricing.tokens}) / $0.30 (≤128k ${t.pricing.tokens}), $0.60 (>128k ${t.pricing.tokens}) ${t.pricing.perMillionTokens}`,
    //         freeTier: {
    //             available: true,
    //             note: (t: TranslationKeys) => t.pricing.geminiFreeTierNote
    //         }
    //     },
    //     apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
    //     apiKeySecretName: 'google_ai',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_Gemini1_5',
    // },
    // {
    //     id: 'gemini-1.5-flash-8b',
    //     name: 'Gemini 1.5 Flash-8B',
    //     provider: 'Google',
    //     contextWindow: 0, 
    //     pricing: { 
    //         input: 0.0375, 
    //         output: 0.15,  
    //         note: (t: TranslationKeys) => `$0.0375 (≤128k ${t.pricing.tokens}), $0.075 (>128k ${t.pricing.tokens}) / $0.15 (≤128k ${t.pricing.tokens}), $0.30 (>128k ${t.pricing.tokens}) ${t.pricing.perMillionTokens}`,
    //         freeTier: {
    //             available: true,
    //             note: (t: TranslationKeys) => t.pricing.geminiFreeTierNote
    //         }
    //     },
    //     apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
    //     apiKeySecretName: 'google_ai',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_Gemini1_5',
    // },
    // {
    //     id: 'gemini-2.5-flash-lite',
    //     name: 'Gemini 2.5 Flash-Lite',
    //     provider: 'Google',
    //     contextWindow: 1000000,
    //     pricing: {
    //         input: 0.10,
    //         output: 0.40,
    //         freeTier: {
    //             available: true,
    //             note: (t: TranslationKeys) => t.pricing.geminiFreeTierNote
    //         }
    //     },
    //     apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
    //     apiKeySecretName: 'google_ai',
    //     status: 'stable',
    //     usesReasoningTokens: true,
    //     categoryKey: 'modelCategory_Gemini2_5',
    //     knowledgeCutoff: '2025-01',
    // },

    // // === Anthropic ===
    // {
    //     id: 'claude-opus-4-1-20250805',
    //     name: 'Claude Opus 4.1',
    //     provider: 'Anthropic',
    //     contextWindow: 200000,
    //     pricing: { 
    //         input: 15.00, 
    //         output: 75.00,
    //         // note: (t: TranslationKeys) => `$${15.00} / 1M input tokens, $${75.00} / 1M output tokens`
    //     },
    //     apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
    //     apiKeySecretName: 'anthropic',
    //     status: 'stable',
    //     usesReasoningTokens: true,
    //     categoryKey: 'modelCategory_Claude4',
    //     knowledgeCutoff: '2025-03',
    // },
    // {
    //     id: 'claude-opus-4-20250514',
    //     name: 'Claude Opus 4',
    //     provider: 'Anthropic',
    //     contextWindow: 200000,
    //     pricing: { input: 15.00, output: 75.00 },
    //     apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
    //     apiKeySecretName: 'anthropic',
    //     status: 'stable',
    //     usesReasoningTokens: true,
    //     categoryKey: 'modelCategory_Claude4',
    //     knowledgeCutoff: '2025-03',
    // },
    // {
    //     id: 'claude-sonnet-4-20250514',
    //     name: 'Claude Sonnet 4',
    //     provider: 'Anthropic',
    //     contextWindow: 200000,
    //     pricing: { input: 3.00, output: 15.00 },
    //     apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
    //     apiKeySecretName: 'anthropic',
    //     status: 'stable',
    //     usesReasoningTokens: true,
    //     categoryKey: 'modelCategory_Claude4',
    //     knowledgeCutoff: '2025-03',
    // },
    // {
    //     id: 'claude-3-7-sonnet-20250219',
    //     name: 'Claude Sonnet 3.7',
    //     provider: 'Anthropic',
    //     contextWindow: 200000,
    //     pricing: { input: 3.00, output: 15.00 }, 
    //     apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
    //     apiKeySecretName: 'anthropic',
    //     status: 'stable', 
    //     usesReasoningTokens: true,
    //     categoryKey: 'modelCategory_Claude3_7',
    //     knowledgeCutoff: '2024-10',
    // },
    // {
    //     id: 'claude-3-5-haiku-20241022',
    //     name: 'Claude Haiku 3.5',
    //     provider: 'Anthropic',
    //     contextWindow: 200000,
    //     pricing: { input: 0.80, output: 4.00 },
    //     apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
    //     apiKeySecretName: 'anthropic',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_Claude3_5',
    //     knowledgeCutoff: '2024-07',
    // },
    // {
    //     id: 'claude-3-5-sonnet-20241022', 
    //     name: 'Claude Sonnet 3.5',
    //     provider: 'Anthropic',
    //     contextWindow: 200000,
    //     pricing: { input: 3.00, output: 15.00 },
    //     apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
    //     apiKeySecretName: 'anthropic',
    //     status: 'stable',
    //     requiresOrgVerification: false,
    //     categoryKey: 'modelCategory_Claude3_5',
    //     knowledgeCutoff: '2024-04',
    // },
    // {
    //     id: 'claude-3-opus-20240229',
    //     name: 'Claude Opus 3',
    //     provider: 'Anthropic',
    //     contextWindow: 200000,
    //     pricing: { input: 15.00, output: 75.00 },
    //     apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
    //     apiKeySecretName: 'anthropic',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_Claude3',
    // },
    //  {
    //     id: 'claude-3-haiku-20240307',
    //     name: 'Claude Haiku 3',
    //     provider: 'Anthropic',
    //     contextWindow: 200000,
    //     pricing: { input: 0.25, output: 1.25 },
    //     apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
    //     apiKeySecretName: 'anthropic',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_Claude3',
    //     knowledgeCutoff: '2023-08',
    // },

    // // === xAI (Grok) ===
    // {
    //     id: 'grok-3-latest',
    //     name: 'Grok 3',
    //     provider: 'xAI', 
    //     contextWindow: 131072,
    //     pricing: { input: 3.00, output: 15.00 },
    //     apiKeyInstructionsUrl: 'https://docs.x.ai/',
    //     apiKeySecretName: 'xai', 
    //     status: 'stable',
    //     categoryKey: 'modelCategory_Grok3',
    //     usesReasoningTokens: false, 
    //     knowledgeCutoff: '2024-11',
    // },
    // {
    //     id: 'grok-3-mini-latest',
    //     name: 'Grok 3 Mini',
    //     provider: 'xAI', 
    //     contextWindow: 131072,
    //     pricing: { input: 0.30, output: 0.50 },
    //     apiKeyInstructionsUrl: 'https://docs.x.ai/',
    //     apiKeySecretName: 'xai',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_Grok3Mini',
    //     usesReasoningTokens: true, 
    //     knowledgeCutoff: '2024-11',
    // },
    // {
    //     id: 'grok-4-latest',
    //     name: 'Grok 4',
    //     provider: 'xAI',
    //     contextWindow: 256000,
    //     pricing: { input: 3.00, output: 15.00 },
    //     apiKeyInstructionsUrl: 'https://docs.x.ai/',
    //     apiKeySecretName: 'xai',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_Grok4',
    //     usesReasoningTokens: true,
    //     knowledgeCutoff: '2024-11',
    // },

    // // === DeepSeek ===
    // {
    //     id: 'deepseek-chat',
    //     name: 'DeepSeek V3',
    //     provider: 'DeepSeek',
    //     contextWindow: 64000,
    //     pricing: { 
    //         input: 0.27, // Cache miss price (worst case)
    //         output: 1.10,
    //         // note: 'Off-peak pricing (50% off) available 16:30-00:30 UTC. Cache hits are cheaper.'
    //     },
    //     apiKeyInstructionsUrl: 'https://platform.deepseek.com/api-keys',
    //     apiKeySecretName: 'deepseek',
    //     status: 'stable',
    //     requiresOrgVerification: false,
    //     usesReasoningTokens: false,
    //     categoryKey: 'modelCategory_DeepSeekV3',
    // },
    // {
    //     id: 'deepseek-reasoner',
    //     name: 'DeepSeek R1',
    //     provider: 'DeepSeek',
    //     contextWindow: 64000,
    //     pricing: { 
    //         input: 0.55, // Cache miss price (worst case)
    //         output: 2.19,
    //         // note: 'Off-peak pricing (75% off) available 16:30-00:30 UTC. Cache hits are cheaper.'
    //     },
    //     apiKeyInstructionsUrl: 'https://platform.deepseek.com/api-keys',
    //     apiKeySecretName: 'deepseek',
    //     status: 'stable',
    //     requiresOrgVerification: false,
    //     usesReasoningTokens: true,
    //     categoryKey: 'modelCategory_DeepSeekR1',
    // },
    // === Mistral AI === // I only included models which appeared both on the models page and the pricing page therefore only include the latest versions.
    // Premier Models
    {
        id: 'magistral-medium-latest',
        name: 'Magistral Medium 1.2',
        provider: 'Mistral AI',
        contextWindow: 128000,
        pricing: { 
            input: 2.00, 
            output: 5.00,
            freeTier: {
                available: true,
                note: (t) => t.pricing.mistralFreeTierNote
            }
        },
        apiKeyInstructionsUrl: 'https://console.mistral.ai/api-keys/',
        apiKeySecretName: 'mistral',
        status: 'stable',
        usesReasoningTokens: true,
        categoryKey: 'modelCategory_MistralAIPremierModels',
    },
    {
        id: 'mistral-medium-latest',
        name: 'Mistral Medium 3.1',
        provider: 'Mistral AI',
        contextWindow: 128000,
        pricing: { 
            input: 0.40, 
            output: 2.00,
            freeTier: {
                available: true,
                note: (t) => t.pricing.mistralFreeTierNote
            }
        },
        apiKeyInstructionsUrl: 'https://console.mistral.ai/api-keys/',
        apiKeySecretName: 'mistral',
        status: 'stable',
        categoryKey: 'modelCategory_MistralAIPremierModels',
    },
    {
        id: 'mistral-large-2411',
        name: 'Mistral Large 2.1',
        provider: 'Mistral AI',
        contextWindow: 128000,
        pricing: { 
            input: 2.00, 
            output: 6.00,
            freeTier: {
                available: true,
                note: (t) => t.pricing.mistralFreeTierNote
            }
        },
        apiKeyInstructionsUrl: 'https://console.mistral.ai/api-keys/',
        apiKeySecretName: 'mistral',
        status: 'stable',
        categoryKey: 'modelCategory_MistralAIPremierModels',
    },
    {
        id: 'ministral-3b-latest',
        name: 'Ministral 3B',
        provider: 'Mistral AI',
        contextWindow: 128000,
        pricing: { 
            input: 0.04, 
            output: 0.04,
            freeTier: {
                available: true,
                note: (t) => t.pricing.mistralFreeTierNote
            }
        },
        apiKeyInstructionsUrl: 'https://console.mistral.ai/api-keys/',
        apiKeySecretName: 'mistral',
        status: 'stable',
        categoryKey: 'modelCategory_MistralAIPremierModels',
    },
    {
        id: 'ministral-8b-latest',
        name: 'Ministral 8B',
        provider: 'Mistral AI',
        contextWindow: 128000,
        pricing: { 
            input: 0.10, 
            output: 0.10,
            freeTier: {
                available: true,
                note: (t) => t.pricing.mistralFreeTierNote
            }
        },
        apiKeyInstructionsUrl: 'https://console.mistral.ai/api-keys/',
        apiKeySecretName: 'mistral',
        status: 'stable',
        categoryKey: 'modelCategory_MistralAIPremierModels',
    },
    {
        id: 'magistral-small-latest',
        name: 'Magistral Small 1.2',
        provider: 'Mistral AI',
        contextWindow: 128000,
        pricing: { 
            input: 0.50, 
            output: 1.50,
            freeTier: {
                available: true,
                note: (t) => t.pricing.mistralFreeTierNote
            }
        },
        apiKeyInstructionsUrl: 'https://console.mistral.ai/api-keys/',
        apiKeySecretName: 'mistral',
        status: 'stable',
        usesReasoningTokens: true,
        categoryKey: 'modelCategory_MistralAIOpenModels',
    },
    {
        id: 'mistral-small-latest',
        name: 'Mistral Small 3.2',
        provider: 'Mistral AI',
        contextWindow: 128000,
        pricing: { 
            input: 0.10, 
            output: 0.30,
            freeTier: {
                available: true,
                note: (t) => t.pricing.mistralFreeTierNote
            }
        },
        apiKeyInstructionsUrl: 'https://console.mistral.ai/api-keys/',
        apiKeySecretName: 'mistral',
        status: 'stable',
        categoryKey: 'modelCategory_MistralAIOpenModels',
    },
    {
        id: 'open-mistral-nemo',
        name: 'Mistral Nemo 12B',
        provider: 'Mistral AI',
        contextWindow: 128000,
        pricing: { 
            input: 0.15, 
            output: 0.15,
            freeTier: {
                available: true,
                note: (t) => t.pricing.mistralFreeTierNote
            }
        },
        apiKeyInstructionsUrl: 'https://console.mistral.ai/api-keys/',
        apiKeySecretName: 'mistral',
        status: 'stable',
        categoryKey: 'modelCategory_MistralAIOpenModels',
    },

    // === Ollama ===
    // Note: Ollama models are dynamically loaded from the user's local Ollama instance
    // This is a placeholder entry to show Ollama as an available provider
];

// Ollama-specific models will be added dynamically
export const OLLAMA_MODELS: LLMInfo[] = [];

// --- Helper Functions ---

/**
 * Finds LLM information by its unique backend ID.
 */
export function getLLMInfoById(id: string): LLMInfo | undefined {
    // Search in both AVAILABLE_LLMS and OLLAMA_MODELS
    const allLLMs = getAllAvailableLLMs();
    return allLLMs.find(llm => llm.id === id);
}

/**
 * Finds LLM information by the Secret Manager secret *key ID* associated with its API key.
 */
export function getLLMInfoBySecretName(secretName: string): LLMInfo | undefined {
    // Search in both AVAILABLE_LLMS and OLLAMA_MODELS
    const allLLMs = getAllAvailableLLMs();
    return allLLMs.find(llm => llm.apiKeySecretName === secretName);
}

/**
 * Groups available LLMs by their provider.
 */
export function groupLLMsByProvider(): Record<string, LLMInfo[]> {
    const allLLMs = getAllAvailableLLMs();
    const grouped = allLLMs.reduce((acc, llm) => {
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

// Helper function to group models by category within a provider
export const groupModelsByCategory = (models: LLMInfo[], t: TranslationKeys): { orderedCategories: string[], byCategory: Record<string, LLMInfo[]> } => {
    const openAICategoryOrder = [
        t.modelCategory_Frontier,
        t.modelCategory_Reasoning,
        t.modelCategory_FlagshipChat,
        t.modelCategory_CostOptimized,
        t.modelCategory_OlderGPT,
    ];
    const googleCategoryOrder = [
        t.modelCategory_Gemini2_5,
        t.modelCategory_Gemini2_0,
        t.modelCategory_Gemini1_5,
    ];
    const anthropicCategoryOrder = [
        t.modelCategory_Claude4,
        t.modelCategory_Claude3_7,
        t.modelCategory_Claude3_5,
        t.modelCategory_Claude3,
    ];
    const xAICategoryOrder = [
        t.modelCategory_Grok4,
        t.modelCategory_Grok3,
        t.modelCategory_Grok3Mini,
    ];
    const deepSeekCategoryOrder = [
        t.modelCategory_DeepSeekV3,
        t.modelCategory_DeepSeekR1,
    ];
    const mistralCategoryOrder = [
        t.modelCategory_MistralAIPremierModels,
        t.modelCategory_MistralAIOpenModels,
    ];
    const ollamaCategoryOrder = [
        t.modelCategory_Ollama,
    ];
    const togetherAICategoryOrder = [
        t.modelCategory_Llama4,
        t.modelCategory_Llama3_3,
        t.modelCategory_Llama3_2,
        t.modelCategory_Llama3_1,
        t.modelCategory_Llama3,
        t.modelCategory_LlamaVision,
        t.modelCategory_MetaLlama,
        t.modelCategory_GoogleGemma,
        // Place Gemma 3n above Gemma 2
        // 'Gemma 3n model',
        t.modelCategory_Gemma3n,
        t.modelCategory_Gemma2,
        t.modelCategory_Gemma,
        t.modelCategory_DeepSeekR1,
        t.modelCategory_DeepSeekV3,
        t.modelCategory_DeepSeekR1Distill,
        t.modelCategory_DeepSeekModels,
        t.modelCategory_Qwen3,
        t.modelCategory_QwQwQ,
        t.modelCategory_Qwen2_5,
        t.modelCategory_Qwen2_5Vision,
        t.modelCategory_Qwen2_5Coder,
        t.modelCategory_Qwen2,
        t.modelCategory_Qwen2Vision,
        t.modelCategory_QwenModels,
    ];

    const byCategory: Record<string, LLMInfo[]> = {};

    models.forEach(model => {
        const categoryKey = (model.categoryKey || 'modelCategory_OtherModels');
        let translatedCategory: string;
        if (categoryKey === 'claude4_temp') {
            translatedCategory = "Claude 4 models";
        } else {
            const maybeTranslation = (categoryKey in t)
                ? t[categoryKey as keyof TranslationKeys]
                : undefined;
            translatedCategory = (typeof maybeTranslation === 'string') ? maybeTranslation : categoryKey;
        }
        if (!byCategory[translatedCategory]) {
            byCategory[translatedCategory] = [];
        }
        byCategory[translatedCategory].push(model);
    });

    let orderedCategories = Object.keys(byCategory);
    let currentProviderOrder: string[] = [];

    if (models.length > 0) {
        const providerName = models[0].provider;
        if (providerName === 'OpenAI') {
            currentProviderOrder = openAICategoryOrder;
        } else if (providerName === 'Google') {
            currentProviderOrder = googleCategoryOrder;
        } else if (providerName === 'Anthropic') {
            currentProviderOrder = anthropicCategoryOrder;
        } else if (providerName === 'xAI') {
            currentProviderOrder = xAICategoryOrder;
        } else if (providerName === 'TogetherAI') {
            currentProviderOrder = togetherAICategoryOrder;
        } else if (providerName === 'DeepSeek') {
            currentProviderOrder = deepSeekCategoryOrder;
        } else if (providerName === 'Mistral AI') {
            currentProviderOrder = mistralCategoryOrder;
        } else if (providerName === 'Ollama') {
            currentProviderOrder = ollamaCategoryOrder;
        }
    }

    const translatedOtherModelsCategory = t.modelCategory_OtherModels;

    if (currentProviderOrder.length > 0) {
        const orderedKeysFromProviderList = currentProviderOrder.filter(cat => byCategory[cat]);
        const remainingKeys = orderedCategories.filter(cat => !currentProviderOrder.includes(cat) && cat !== translatedOtherModelsCategory).sort();
        orderedCategories = [...orderedKeysFromProviderList, ...remainingKeys];
        if (byCategory[translatedOtherModelsCategory] && !orderedCategories.includes(translatedOtherModelsCategory)) {
            orderedCategories.push(translatedOtherModelsCategory);
        }
    } else {
        orderedCategories.sort((a, b) => {
            if (a === translatedOtherModelsCategory) return 1;
            if (b === translatedOtherModelsCategory) return -1;
            return a.localeCompare(b);
        });
    }

    orderedCategories.forEach(cat => {
        if (byCategory[cat]) {
            // Custom sorting for OpenAI Flagship Chat models
            if (models.length > 0 && models[0].provider === 'OpenAI' && cat === t.modelCategory_FlagshipChat) {
                const openAIFlagshipOrder = ['gpt-4.1', 'gpt-4o', 'chatgpt-4o-latest'];
                byCategory[cat].sort((a, b) => {
                    const idxA = openAIFlagshipOrder.indexOf(a.id);
                    const idxB = openAIFlagshipOrder.indexOf(b.id);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return a.name.localeCompare(b.name);
                });
            } else if (models.length > 0 && models[0].provider === 'OpenAI' && cat === t.modelCategory_Reasoning) {
                const openAIReasoningOrder = ['o4-mini', 'o3', 'o3-mini', 'o1'];
                byCategory[cat].sort((a, b) => {
                    const idxA = openAIReasoningOrder.indexOf(a.id);
                    const idxB = openAIReasoningOrder.indexOf(b.id);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return a.name.localeCompare(b.name);
                });
            } else if (byCategory[cat][0]?.provider === 'Anthropic') {
                byCategory[cat].sort((a, b) => {
                    // First handle Claude 4 models specifically
                    const claude4Ids = ['claude-opus-4-1-20250805', 'claude-opus-4-20250514'];
                    const aIndex = claude4Ids.indexOf(a.id);
                    const bIndex = claude4Ids.indexOf(b.id);
                    
                    // If both are Claude 4 models, sort by our defined order
                    if (aIndex !== -1 && bIndex !== -1) {
                        return aIndex - bIndex;
                    }
                    
                    // For other Anthropic models, sort by tier (Opus > Sonnet > Haiku)
                    const anthropicOrder = ['Opus', 'Sonnet', 'Haiku'];
                    const getAnthropicTier = (name: string) => {
                        for (let i = 0; i < anthropicOrder.length; i++) {
                            if (name.includes(anthropicOrder[i])) return i;
                        }
                        return anthropicOrder.length;
                    };
                    
                    const tierA = getAnthropicTier(a.name);
                    const tierB = getAnthropicTier(b.name);
                    if (tierA !== tierB) return tierA - tierB;
                    
                    // If same tier, sort by name
                    return a.name.localeCompare(b.name);
                });
            } else {
                // Default alphabetical sorting for non-Claude models
                byCategory[cat].sort((a, b) => a.name.localeCompare(b.name));
            }
            // Custom sorting for OpenAI Older GPT models
            if (models.length > 0 && models[0].provider === 'OpenAI' && cat === t.modelCategory_OlderGPT) {
                const openAIOlderOrder = ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'];
                byCategory[cat].sort((a, b) => {
                    const idxA = openAIOlderOrder.indexOf(a.id);
                    const idxB = openAIOlderOrder.indexOf(b.id);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return a.name.localeCompare(b.name);
                });
            }
            // Custom sort for Gemini 2.5: Pro, Flash, then Flash Lite/Native
            if (models.length > 0 && models[0].provider === 'Google' && cat === t.modelCategory_Gemini2_5) {
                const gemini2_5Order = [
                    'gemini-2.5-pro',
                    'gemini-2.5-flash',
                    'gemini-2.5-flash-lite-preview-06-17'
                ];
                byCategory[cat].sort((a, b) => {
                    const idxA = gemini2_5Order.indexOf(a.id);
                    const idxB = gemini2_5Order.indexOf(b.id);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return a.name.localeCompare(b.name);
                });
            }
            // Custom sorting for Llama 4 models
            if (models.length > 0 && models[0].provider === 'TogetherAI' && cat === t.modelCategory_Llama4) {
                const llama4Order = [
                    'meta-llama/Llama-4-Scout-17B-16E-Instruct',
                    'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8'
                ];
                byCategory[cat].sort((a, b) => {
                    const idxA = llama4Order.indexOf(a.id);
                    const idxB = llama4Order.indexOf(b.id);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return a.name.localeCompare(b.name);
                });
            }
            // Custom sorting for Llama 3.2 models
            if (models.length > 0 && models[0].provider === 'TogetherAI' && cat === t.modelCategory_Llama3_2) {
                const llama32Order = [
                    'meta-llama/Llama-3.2-3B-Instruct-Turbo',
                    'meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo',
                    'meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo'
                ];
                byCategory[cat].sort((a, b) => {
                    const idxA = llama32Order.indexOf(a.id);
                    const idxB = llama32Order.indexOf(b.id);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return a.name.localeCompare(b.name);
                });
            }
            // Custom sorting for Llama 3.1 models
            if (models.length > 0 && models[0].provider === 'TogetherAI' && cat === t.modelCategory_Llama3_1) {
                const llama31Order = [
                    'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
                    'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
                    'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo'
                ];
                byCategory[cat].sort((a, b) => {
                    const idxA = llama31Order.indexOf(a.id);
                    const idxB = llama31Order.indexOf(b.id);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return a.name.localeCompare(b.name);
                });
            }
            
            // Custom sorting for Mistral AI Premier models, follows order in Pricing documentation
            if (models.length > 0 && models[0].provider === 'Mistral AI' && cat === t.modelCategory_MistralAIPremierModels) {
                const mistralPremierOrder = [
                    'magistral-medium-latest',
                    'mistral-medium-latest',
                    'mistral-large-2411',
                    'ministral-3b-latest',
                    'ministral-8b-latest',
                ];
                byCategory[cat].sort((a, b) => {
                    const idxA = mistralPremierOrder.indexOf(a.id);
                    const idxB = mistralPremierOrder.indexOf(b.id);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return a.name.localeCompare(b.name);
                });
            }
            
            // Custom sorting for Mistral AI Open models
            if (models.length > 0 && models[0].provider === 'Mistral AI' && cat === t.modelCategory_MistralAIOpenModels) {
                const mistralOpenOrder = [
                    'magistral-small-latest',
                    'mistral-small-latest',
                    'open-mistral-nemo'
                ];
                byCategory[cat].sort((a, b) => {
                    const idxA = mistralOpenOrder.indexOf(a.id);
                    const idxB = mistralOpenOrder.indexOf(b.id);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return a.name.localeCompare(b.name);
                });
            }
            
            // Custom sorting for Frontier models to ensure GPT-5 Chat appears last
            if (models.length > 0 && models[0].provider === 'OpenAI' && cat === t.modelCategory_Frontier) {
                const frontierOrder = [
                    'gpt-5',
                    'gpt-5-mini',
                    'gpt-5-nano',
                    'gpt-5-chat-latest'
                ];
                byCategory[cat].sort((a, b) => {
                    const idxA = frontierOrder.indexOf(a.id);
                    const idxB = frontierOrder.indexOf(b.id);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return a.name.localeCompare(b.name);
                });
            }
            // Custom sorting for Ollama models - prioritize cloud models
            if (models.length > 0 && models[0].provider === 'Ollama') {
                byCategory[cat].sort((a, b) => {
                    const aIsCloud = a.name.toLowerCase().includes('cloud');
                    const bIsCloud = b.name.toLowerCase().includes('cloud');
                    
                    // Cloud models come first
                    if (aIsCloud && !bIsCloud) return -1;
                    if (!aIsCloud && bIsCloud) return 1;
                    
                    // Within same group (both cloud or both non-cloud), sort alphabetically
                    return a.name.localeCompare(b.name);
                });
            }
        }
    });

    return { orderedCategories, byCategory };
};


// --- Ollama Helper Functions ---

export interface OllamaModel {
    name: string;
    model: string;
    modified_at: string;
    size: number;
    digest: string;
    details?: {
        parent_model?: string;
        format?: string;
        family?: string;
        families?: string[];
        parameter_size?: string;
        quantization_level?: string;
    };
}

export interface OllamaListResponse {
    models: OllamaModel[];
}

/**
 * Check if Ollama is available on the local machine
 */
export async function isOllamaAvailable(endpoint: string = 'http://localhost:11434'): Promise<boolean> {
    try {
        const response = await fetch(`${endpoint}/api/tags`, {
            method: 'GET',
            signal: AbortSignal.timeout(3000), // 3 second timeout
        });
        return response.ok;
    } catch (error) {
        console.debug('Ollama not available:', error);
        return false;
    }
}

/**
 * Fetch available models from local Ollama instance
 */
export async function fetchOllamaModels(endpoint: string = 'http://localhost:11434'): Promise<LLMInfo[]> {
    try {
        const response = await fetch(`${endpoint}/api/tags`, {
            method: 'GET',
            signal: AbortSignal.timeout(5000),
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch Ollama models: ${response.statusText}`);
        }
        
        const data: OllamaListResponse = await response.json();
        
        // Convert Ollama models to LLMInfo format
        const ollamaModels: LLMInfo[] = data.models.map(model => ({
            id: `ollama:${model.name}`,
            name: model.name,
            provider: 'Ollama' as const,
            contextWindow: 0, // Ollama doesn't provide this info via API
            pricing: {
                input: 0,
                output: 0,
                // No note here - pricing info shown in provider header instead
                freeTier: {
                    available: true,
                    note: (t) => t.pricing.ollamaFreeTierNote
                }
            },
            apiKeyInstructionsUrl: 'https://ollama.com/download',
            apiKeySecretName: 'ollama', // Not used for local Ollama
            status: 'stable' as const,
            categoryKey: 'modelCategory_Ollama',
            isOllamaModel: true,
            ollamaEndpoint: endpoint,
        }));
        
        return ollamaModels;
    } catch (error) {
        console.error('Error fetching Ollama models:', error);
        return [];
    }
}

/**
 * Update the global OLLAMA_MODELS array with available models
 */
export async function updateOllamaModels(endpoint: string = 'http://localhost:11434'): Promise<void> {
    const models = await fetchOllamaModels(endpoint);
    OLLAMA_MODELS.length = 0; // Clear existing
    OLLAMA_MODELS.push(...models);
}

/**
 * Get all available LLMs including dynamically loaded Ollama models
 */
export function getAllAvailableLLMs(): LLMInfo[] {
    return [...AVAILABLE_LLMS, ...OLLAMA_MODELS];
}

/**
 * Get provider from LLM ID
 */
export function getProviderFromId(id: string): LLMInfo["provider"] | null {
    // Check for Ollama models first (format: "ollama:modelname")
    if (id.startsWith("ollama:")) {
        return "Ollama";
    }
    // Check other providers
    if (id.startsWith("gpt-") || id === "o4-mini" || id === "o3" || id === "o3-mini" || id === "o1" || id === "chatgpt-4o-latest") return "OpenAI";
    if (id.startsWith("gemini-")) return "Google";
    if (id.startsWith("claude-")) return "Anthropic";
    if (id.startsWith("grok-")) return "xAI";
    if (id.startsWith("deepseek-")) return "DeepSeek";
    if (id.startsWith("mistral-") || id.startsWith("magistral-") || id.startsWith("ministral-") || id === "open-mistral-nemo") return "Mistral AI";
    if (id.includes("meta-llama/") || id.includes("google/") || id.includes("deepseek-ai/") || id.includes("Qwen/")) return "TogetherAI";
    // Try to find in available LLMs
    const llm = getLLMInfoById(id);
    if (llm) {
        return llm.provider;
    }
    return null;
}
