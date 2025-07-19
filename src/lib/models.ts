// src/lib/models.ts
// Centralized definition for available Large Language Models

import { TranslationKeys } from './translations';

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
    usesReasoningTokens?: boolean; // Used for OpenAI reasoning, Google thinking, Anthropic/xAI extended thinking, Qwen/DeepSeek reasoning
    categoryKey?: string; // For categorizing models by purpose/capability/series
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
        categoryKey: 'modelCategory_FlagshipChat',
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
        categoryKey: 'modelCategory_FlagshipChat',
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
        categoryKey: 'modelCategory_CostOptimized',
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
        categoryKey: 'modelCategory_FlagshipChat',
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
        categoryKey: 'modelCategory_CostOptimized',
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
        categoryKey: 'modelCategory_CostOptimized',
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
        categoryKey: 'modelCategory_OlderGPT',
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
        categoryKey: 'modelCategory_OlderGPT',
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
        categoryKey: 'modelCategory_OlderGPT',
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
        categoryKey: 'modelCategory_Reasoning',
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
        categoryKey: 'modelCategory_Reasoning',
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
        categoryKey: 'modelCategory_Reasoning', 
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
        categoryKey: 'modelCategory_Reasoning',
    },

    // === Google ===
    {
        id: 'gemini-2.5-pro', 
        name: 'Gemini 2.5 Pro',
        provider: 'Google', 
        contextWindow: 2000000,
        pricing: { 
            input: 1.25, 
            output: 10.00, 
            note: '$1.25 (≤200k tkns), $2.50 (>200k tkns) / $10.00 (≤200k tkns), $15.00 (>200k tkns) per 1M Tokens' 
        },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'stable',
        usesReasoningTokens: true, 
        categoryKey: 'modelCategory_Gemini2_5',
    },
    {
        id: 'gemini-2.5-flash', 
        name: 'Gemini 2.5 Flash',
        provider: 'Google',
        contextWindow: 2000000,
        pricing: { 
            input: 0.15, 
            output: 3.50, 
            note: '$0.15 / $0.60 (non-thinking), $3.50 (thinking) per 1M Tokens' // Removed trailing period
        },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'stable',
        usesReasoningTokens: true, 
        categoryKey: 'modelCategory_Gemini2_5',
    },
    {
        id: 'gemini-2.0-flash-001',
        name: 'Gemini 2.0 Flash',
        provider: 'Google',
        contextWindow: 0, 
        pricing: { input: 0.10, output: 0.40 },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'stable',
        categoryKey: 'modelCategory_Gemini2_0',
    },
    {
        id: 'gemini-2.0-flash-lite-001',
        name: 'Gemini 2.0 Flash-Lite',
        provider: 'Google',
        contextWindow: 0, 
        pricing: { input: 0.075, output: 0.30 },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'stable',
        categoryKey: 'modelCategory_Gemini2_0',
    },
    {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'Google',
        contextWindow: 1000000,
        pricing: { 
            input: 1.25, 
            output: 5.00, 
            note: '$1.25 (≤128k tkns), $2.50 (>128k tkns) / $5.00 (≤128k tkns), $10.00 (>128k tkns) per 1M Tokens'
        },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'stable',
        categoryKey: 'modelCategory_Gemini1_5',
    },
    {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        provider: 'Google',
        contextWindow: 1000000,
        pricing: { 
            input: 0.075, 
            output: 0.30, 
            note: '$0.075 (≤128k tkns), $0.15 (>128k tkns) / $0.30 (≤128k tkns), $0.60 (>128k tkns) per 1M Tokens'
        },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'stable',
        categoryKey: 'modelCategory_Gemini1_5',
    },
    {
        id: 'gemini-1.5-flash-8b',
        name: 'Gemini 1.5 Flash-8B',
        provider: 'Google',
        contextWindow: 0, 
        pricing: { 
            input: 0.0375, 
            output: 0.15,  
            note: '$0.0375 (≤128k tkns), $0.075 (>128k tkns) / $0.15 (≤128k tkns), $0.30 (>128k tkns) per 1M Tokens'
        },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'stable',
        categoryKey: 'modelCategory_Gemini1_5',
    },
    {
        id: 'gemini-2.5-flash-lite-preview-06-17',
        name: 'Gemini 2.5 Flash Lite Preview',
        provider: 'Google',
        contextWindow: 1000000,
        pricing: {
            input: 0.10,
            output: 0.40,
        },
        apiKeyInstructionsUrl: 'https://aistudio.google.com/app/apikey',
        apiKeySecretName: 'google_ai',
        status: 'preview',
        usesReasoningTokens: true,
        categoryKey: 'modelCategory_Gemini2_5',
    },

    // === Anthropic ===
    {
        id: 'claude-opus-4-20250514',
        name: 'Claude Opus 4',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { input: 15.00, output: 75.00 },
        apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
        apiKeySecretName: 'anthropic',
        status: 'stable',
        usesReasoningTokens: true,
        categoryKey: 'modelCategory_Claude4',
    },
    {
        id: 'claude-sonnet-4-20250514',
        name: 'Claude Sonnet 4',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { input: 3.00, output: 15.00 },
        apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
        apiKeySecretName: 'anthropic',
        status: 'stable',
        usesReasoningTokens: true,
        categoryKey: 'modelCategory_Claude4',
    },
    {
        id: 'claude-3-7-sonnet-20250219',
        name: 'Claude Sonnet 3.7',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { input: 3.00, output: 15.00 }, 
        apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
        apiKeySecretName: 'anthropic',
        status: 'stable', 
        usesReasoningTokens: true,
        categoryKey: 'modelCategory_Claude3_7',
    },
    {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude Haiku 3.5',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { input: 0.80, output: 4.00 },
        apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
        apiKeySecretName: 'anthropic',
        status: 'stable',
        categoryKey: 'modelCategory_Claude3_5',
    },
    {
        id: 'claude-3-5-sonnet-20241022', 
        name: 'Claude Sonnet 3.5',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { input: 3.00, output: 15.00 },
        apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
        apiKeySecretName: 'anthropic',
        status: 'stable',
        requiresOrgVerification: false,
        categoryKey: 'modelCategory_Claude3_5',
    },
    {
        id: 'claude-3-opus-20240229',
        name: 'Claude Opus 3',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { input: 15.00, output: 75.00 },
        apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
        apiKeySecretName: 'anthropic',
        status: 'stable',
        categoryKey: 'modelCategory_Claude3',
    },
     {
        id: 'claude-3-haiku-20240307',
        name: 'Claude Haiku 3',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { input: 0.25, output: 1.25 },
        apiKeyInstructionsUrl: 'https://console.anthropic.com/settings/keys',
        apiKeySecretName: 'anthropic',
        status: 'stable',
        categoryKey: 'modelCategory_Claude3',
    },

    // === xAI (Grok) ===
    {
        id: 'grok-3-latest',
        name: 'Grok 3',
        provider: 'xAI', 
        contextWindow: 131072,
        pricing: { input: 3.00, output: 15.00 },
        apiKeyInstructionsUrl: 'https://docs.x.ai/',
        apiKeySecretName: 'xai', 
        status: 'stable',
        categoryKey: 'modelCategory_Grok3',
        usesReasoningTokens: false, 
    },
    {
        id: 'grok-3-fast-latest',
        name: 'Grok 3 Fast',
        provider: 'xAI', 
        contextWindow: 131072,
        pricing: { input: 5.00, output: 25.00 },
        apiKeyInstructionsUrl: 'https://docs.x.ai/',
        apiKeySecretName: 'xai',
        status: 'stable',
        categoryKey: 'modelCategory_Grok3', 
        usesReasoningTokens: false, 
    },
    {
        id: 'grok-3-mini-latest',
        name: 'Grok 3 Mini',
        provider: 'xAI', 
        contextWindow: 131072,
        pricing: { input: 0.30, output: 0.50 },
        apiKeyInstructionsUrl: 'https://docs.x.ai/',
        apiKeySecretName: 'xai',
        status: 'stable',
        categoryKey: 'modelCategory_Grok3Mini',
        usesReasoningTokens: true, 
    },
    {
        id: 'grok-3-mini-fast-latest',
        name: 'Grok 3 Mini Fast',
        provider: 'xAI', 
        contextWindow: 131072,
        pricing: { input: 0.60, output: 4.00 },
        apiKeyInstructionsUrl: 'https://docs.x.ai/',
        apiKeySecretName: 'xai',
        status: 'stable',
        categoryKey: 'modelCategory_Grok3Mini', 
        usesReasoningTokens: true, 
    },
    {
        id: 'grok-4-latest',
        name: 'Grok 4',
        provider: 'xAI',
        contextWindow: 256000,
        pricing: { input: 3.00, output: 15.00 },
        apiKeyInstructionsUrl: 'https://docs.x.ai/',
        apiKeySecretName: 'xai',
        status: 'stable',
        categoryKey: 'modelCategory_Grok4',
        usesReasoningTokens: true,
    },

    // === Together.ai ===
    // Removing Llama models not available on the Llama API, even though still using Together.ai.
    {
        id: 'meta-llama/Llama-4-Scout-17B-16E-Instruct',
        name: 'Llama 4 Scout Instruct (17Bx16E)',
        provider: 'TogetherAI',
        contextWindow: 1048576, 
        pricing: { input: 0.18, output: 0.59 },
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable', 
        categoryKey: 'modelCategory_Llama4',
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
        categoryKey: 'modelCategory_Llama4',
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
        categoryKey: 'modelCategory_Llama3_3',
    },
    { 
        id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
        name: 'Meta Llama 3.3 70B Instruct Turbo Free',
        provider: 'TogetherAI',
        contextWindow: 131072, 
        pricing: { input: 0.00, output: 0.00, note: 'Free' }, 
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable',
        categoryKey: 'modelCategory_Llama3_3',
    },
    // Google Gemma Models via TogetherAI
    {
        id: 'google/gemma-2-27b-it',
        name: 'Gemma-2 Instruct (27B)',
        provider: 'TogetherAI',
        contextWindow: 8192,
        pricing: { input: 0.80, output: 0.80 }, 
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable', 
        categoryKey: 'modelCategory_Gemma2',
    },
    {
        id: 'google/gemma-3n-E4B-it',
        name: 'Gemma 3N E4B Instruct',
        provider: 'TogetherAI',
        contextWindow: 32000, // 32K tokens, per documentation
        pricing: { input: 0.02, output: 0.04 },
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable',
        categoryKey: 'modelCategory_Gemma3n', // New category for Gemma 3N models
    },
    // DeepSeek Models via TogetherAI
    {
        id: 'deepseek-ai/DeepSeek-R1',
        name: 'DeepSeek R1-0528',
        provider: 'TogetherAI',
        contextWindow: 128000, 
        pricing: { input: 3.00, output: 7.00 },
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable', 
        categoryKey: 'modelCategory_DeepSeekR1',
        usesReasoningTokens: true, 
    },
    {
        id: 'deepseek-ai/DeepSeek-V3', 
        name: 'DeepSeek V3-0324',
        provider: 'TogetherAI',
        contextWindow: 128000, 
        pricing: { input: 1.25, output: 1.25 },
        apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
        apiKeySecretName: 'together_ai',
        status: 'stable', 
        categoryKey: 'modelCategory_DeepSeekV3',
    },
    // {
    //     id: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B',
    //     name: 'DeepSeek R1 Distill Llama 70B',
    //     provider: 'TogetherAI',
    //     contextWindow: 131072, 
    //     pricing: { input: 2.00, output: 2.00 },
    //     apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
    //     apiKeySecretName: 'together_ai',
    //     status: 'stable', 
    //     categoryKey: 'modelCategory_DeepSeekR1Distill',
    // },
    // {
    //     id: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B',
    //     name: 'DeepSeek R1 Distill Qwen 14B',
    //     provider: 'TogetherAI',
    //     contextWindow: 131072, 
    //     pricing: { input: 1.60, output: 1.60 },
    //     apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
    //     apiKeySecretName: 'together_ai',
    //     status: 'stable', 
    //     categoryKey: 'modelCategory_DeepSeekR1Distill',
    // },
    // {
    //     id: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B',
    //     name: 'DeepSeek R1 Distill Qwen 1.5B',
    //     provider: 'TogetherAI',
    //     contextWindow: 131072, 
    //     pricing: { input: 0.18, output: 0.18 },
    //     apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
    //     apiKeySecretName: 'together_ai',
    //     status: 'stable', 
    //     categoryKey: 'modelCategory_DeepSeekR1Distill',
    // },
    // {
    //     id: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free',
    //     name: 'DeepSeek R1 Distill Llama 70B Free',
    //     provider: 'TogetherAI',
    //     contextWindow: 131072, 
    //     pricing: { input: 0.00, output: 0.00, note: 'Free' },
    //     apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
    //     apiKeySecretName: 'together_ai',
    //     status: 'stable', 
    //     categoryKey: 'modelCategory_DeepSeekR1Distill',
    // },
    // Qwen Models via TogetherAI
    // {
    //     id: 'Qwen/Qwen3-235B-A22B',
    //     name: 'Qwen3 235B A22B',
    //     provider: 'TogetherAI',
    //     contextWindow: 40960,
    //     pricing: { input: 0.20, output: 0.60 },
    //     apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
    //     apiKeySecretName: 'together_ai',
    //     status: 'stable', 
    //     categoryKey: 'modelCategory_Qwen3',
    //     usesReasoningTokens: true, 
    // },
    // {
    //     id: 'Qwen/Qwen3-30B-A3B',
    //     name: 'Qwen3 30B A3B',
    //     provider: 'TogetherAI',
    //     contextWindow: 32768,
    //     pricing: { input: 1.20, output: 1.20 },
    //     apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
    //     apiKeySecretName: 'together_ai',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_QwQwQ',
    //     usesReasoningTokens: true, 
    // },
    // {
    //     id: 'Qwen/Qwen2.5-VL-72B-Instruct',
    //     name: 'Qwen2.5-VL (72B) Instruct',
    //     provider: 'TogetherAI',
    //     contextWindow: 32768,
    //     pricing: { input: 1.95, output: 8.00 },
    //     apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
    //     apiKeySecretName: 'together_ai',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_Qwen2_5Vision',
    // },
    // {
    //     id: 'Qwen/Qwen2-VL-72B-Instruct',
    //     name: 'Qwen2-VL (72B) Instruct',
    //     provider: 'TogetherAI',
    //     contextWindow: 32768,
    //     pricing: { input: 1.20, output: 1.20 },
    //     apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
    //     apiKeySecretName: 'together_ai',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_Qwen2Vision',
    // },
    // {
    //     id: 'Qwen/Qwen2.5-Coder-32B-Instruct',
    //     name: 'Qwen 2.5 Coder 32B Instruct',
    //     provider: 'TogetherAI',
    //     contextWindow: 32768,
    //     pricing: { input: 0.80, output: 0.80 },
    //     apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
    //     apiKeySecretName: 'together_ai',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_Qwen2_5Coder',
    // },
    // {
    //     id: 'Qwen/Qwen2.5-72B-Instruct-Turbo',
    //     name: 'Qwen2.5 72B Instruct Turbo',
    //     provider: 'TogetherAI',
    //     contextWindow: 32768,
    //     pricing: { input: 1.20, output: 1.20 },
    //     apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
    //     apiKeySecretName: 'together_ai',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_Qwen2_5',
    // },
    // {
    //     id: 'Qwen/Qwen2.5-7B-Instruct-Turbo',
    //     name: 'Qwen2.5 7B Instruct Turbo',
    //     provider: 'TogetherAI',
    //     contextWindow: 32768,
    //     pricing: { input: 0.30, output: 0.30 },
    //     apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
    //     apiKeySecretName: 'together_ai',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_Qwen2_5',
    // },
    // {
    //     id: 'Qwen/Qwen2-72B-Instruct',
    //     name: 'Qwen 2 Instruct (72B)',
    //     provider: 'TogetherAI',
    //     contextWindow: 32768,
    //     pricing: { input: 0.90, output: 0.90 },
    //     apiKeyInstructionsUrl: 'https://api.together.ai/settings/api-keys',
    //     apiKeySecretName: 'together_ai',
    //     status: 'stable',
    //     categoryKey: 'modelCategory_Qwen2',
    // },
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

// Helper function to group models by category within a provider
export const groupModelsByCategory = (models: LLMInfo[], t: TranslationKeys): { orderedCategories: string[], byCategory: Record<string, LLMInfo[]> } => {
    const openAICategoryOrder = [
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
        // } else if (categoryKey === 'modelCategory_Grok4') {
        //     translatedCategory = "Grok 4 models";
        // } else if (categoryKey === 'modelCategory_Gemma3n') {
        //     translatedCategory = "Gemma 3n model";
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
            } else if (byCategory[cat][0]?.provider === 'Anthropic' && byCategory[cat][0]?.provider === 'Anthropic') {
                const anthropicOrder = ['Opus', 'Sonnet', 'Haiku'];
                const getAnthropicTier = (name: string) => {
                    for (let i = 0; i < anthropicOrder.length; i++) {
                        if (name.includes(anthropicOrder[i])) return i;
                    }
                    return anthropicOrder.length;
                };
                byCategory[cat].sort((a, b) => {
                    const tierA = getAnthropicTier(a.name);
                    const tierB = getAnthropicTier(b.name);
                    if (tierA !== tierB) return tierA - tierB;
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
        }
    });

    return { orderedCategories, byCategory };
};
