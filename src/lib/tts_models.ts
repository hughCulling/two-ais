// src/lib/tts_models.ts
// Centralized definition for available Text-to-Speech providers and voices

// --- TTS Voice Interface ---
export interface TTSVoice {
    id: string;   // Provider-specific voice ID (e.g., 'alloy')
    name: string; // User-friendly display name
    gender?: 'Male' | 'Female' | 'Neutral'; // Optional gender information
    languageCodes?: string[]; // Optional BCP-47 language codes supported
}

// --- Standard OpenAI Voices ---
// The TTS endpoint provides 11 built‑in voices
export const OPENAI_TTS_VOICES: TTSVoice[] = [
    { id: 'alloy', name: 'Alloy' },
    { id: 'ash', name: 'Ash' },         // Added
    { id: 'ballad', name: 'Ballad' },   // Added
    { id: 'coral', name: 'Coral' },     // Added
    { id: 'echo', name: 'Echo' },
    { id: 'fable', name: 'Fable' },
    { id: 'nova', name: 'Nova' },
    { id: 'onyx', name: 'Onyx' },
    { id: 'sage', name: 'Sage' },       // Added
    { id: 'shimmer', name: 'Shimmer' },
    // Note: The 11th voice mentioned in docs "Echo, Fable, Onyx, Nova, and Shimmer" are 5, plus alloy, ash, ballad, coral, sage = 10. 
    // The image shows 6. The text says 11. I will list the 10 explicitly named.
    // If there's an 11th specific one, we can add it.
];

// --- Interface for specific TTS model details within a provider ---
export interface TTSModelDetail {
    id: string; // Internal unique ID for this model variant for your app (e.g., "openai-tts-1")
    apiModelId: 'tts-1' | 'tts-1-hd' | 'gpt-4o-mini-tts'; // Actual model ID for the API call
    name: string; // User-friendly display name, e.g., "TTS-1"
    description: string;
    pricingText: string; // Formatted pricing string for display
}

// --- TTS Provider Interface ---
export interface TTSProviderInfo {
    id: 'openai'; // For now, only OpenAI. Expandable to 'google-tts', 'elevenlabs' etc.
    name: string; // User-friendly display name, e.g., "OpenAI TTS"
    requiresOwnKey: boolean; 
    apiKeyId?: string; 
    models: TTSModelDetail[]; // List of specific models under this provider
    availableVoices: TTSVoice[]; // Voices applicable to these models
}

// --- AVAILABLE TTS PROVIDERS & VOICES ---
export const AVAILABLE_TTS_PROVIDERS: TTSProviderInfo[] = [
    {
        id: 'openai',
        name: 'OpenAI',
        requiresOwnKey: false, // Uses the main OpenAI LLM key
        models: [
            { 
                id: 'openai-gpt-4o-mini-tts',
                apiModelId: 'gpt-4o-mini-tts', 
                name: 'GPT-4o mini TTS', 
                description: 'Powered by GPT-4o mini. Max 2000 input tokens.',
                // OpenAI docs: "$0.60 / 1M input tokens", "$12.00 / 1M output audio tokens"
                // This is unusual for TTS. For simplicity, we'll represent the primary cost.
                // Or use a note to explain both if the UI supports it well.
                // For now, using a combined note as the pricing structure is different.
                pricingText: '$0.60/M input text tokens + $12/M output audio tokens (approx.)' 
            },
            { 
                id: 'openai-tts-1',
                apiModelId: 'tts-1',
                name: 'TTS-1', 
                description: 'Optimized for speed.',
                pricingText: '$15.00 / 1M input characters (approx.)' // Standard TTS pricing is per character.
            },
            { 
                id: 'openai-tts-1-hd',
                apiModelId: 'tts-1-hd',
                name: 'TTS-1 HD', 
                description: 'Optimized for quality.',
                pricingText: '$30.00 / 1M input characters (approx.)'
            },
        ],
        availableVoices: OPENAI_TTS_VOICES,
    },
    // Add other providers here when ready
];

// --- Helper Functions ---

/**
 * Finds TTS provider information by its unique ID.
 */
export function getTTSProviderInfoById(id: TTSProviderInfo['id']): TTSProviderInfo | undefined {
    return AVAILABLE_TTS_PROVIDERS.find(p => p.id === id);
}

/**
 * Gets the list of voices for a specific TTS provider ID.
 * Returns an empty array if the provider ID is not found.
 */
export function getVoicesForProvider(id: TTSProviderInfo['id']): TTSVoice[] {
    const provider = getTTSProviderInfoById(id);
    return provider ? provider.availableVoices : [];
}

/**
 * Gets the default voice for a given provider ID.
 * Returns the first voice in the list, or null if no voices are available.
 */
export function getDefaultVoiceForProvider(id: TTSProviderInfo['id']): TTSVoice | null {
    const voices = getVoicesForProvider(id);
    return voices.length > 0 ? voices[0] : null;
}

/**
 * Gets a specific TTS model detail by its unique app ID (e.g., 'openai-tts-1').
 */
export function getTTSModelDetailByAppId(appModelId: string): { provider: TTSProviderInfo, model: TTSModelDetail } | undefined {
    for (const provider of AVAILABLE_TTS_PROVIDERS) {
        const foundModel = provider.models.find(m => m.id === appModelId);
        if (foundModel) {
            return { provider, model: foundModel };
        }
    }
    return undefined;
}

/**
 * Gets a specific TTS model detail by its API model ID (e.g., 'tts-1').
 * This might be useful if the backend only knows the apiModelId.
 */
export function getTTSModelDetailByApiModelId(apiModelId: string): { provider: TTSProviderInfo, model: TTSModelDetail } | undefined {
    for (const provider of AVAILABLE_TTS_PROVIDERS) {
        const foundModel = provider.models.find(m => m.apiModelId === apiModelId);
        if (foundModel) {
            return { provider, model: foundModel };
        }
    }
    return undefined;
}
