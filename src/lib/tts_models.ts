// src/lib/tts_models.ts
// Centralized definition for available Text-to-Speech providers and voices

// --- TTS Voice Interface ---
export interface TTSVoice {
    id: string;   // Provider-specific voice ID (e.g., 'alloy')
    name: string; // User-friendly display name
    gender?: 'Male' | 'Female' | 'Neutral'; // Optional gender information
    languageCodes?: string[]; // Optional BCP-47 language codes supported
}

// --- TTS Provider Interface ---
export interface TTSProviderInfo {
    // --- Removed 'elevenlabs' from the possible IDs ---
    id: 'openai'; // Only OpenAI remains for now
    name: string; // User-friendly display name
    requiresOwnKey: boolean; // Does it need a separate key in ApiKeyManager?
    apiKeyId?: string; // The key ID used in ApiKeyManager/Firestore (if requiresOwnKey is true)
    voices: TTSVoice[]; // List of available voices for this provider
    // Optional: Add pricing info, links, etc. later if needed
}

// --- AVAILABLE TTS PROVIDERS & VOICES ---
// Only OpenAI TTS is currently defined as functional.

export const AVAILABLE_TTS_PROVIDERS: TTSProviderInfo[] = [
    // --- Removed the 'browser' provider entry ---
    // --- Removed the 'google' provider entry ---
    // --- Removed the 'elevenlabs' provider entry ---
    // {
    //     id: 'elevenlabs',
    //     name: 'ElevenLabs TTS',
    //     requiresOwnKey: true,
    //     apiKeyId: 'elevenlabs', // This ID must match the key used in ApiKeyManager/Firestore
    //     voices: [
    //          // TODO: Add actual ElevenLabs voice IDs and names here when ready
    //          // Example: { id: 'Rachel', name: 'Rachel (American)'},
    //          { id: 'placeholder-elevenlabs-1', name: 'Placeholder ElevenLabs 1'}
    //     ],
    // },
    {
        id: 'openai',
        name: 'OpenAI TTS',
        requiresOwnKey: false, // Uses LLM key
        voices: [
            { id: 'alloy', name: 'Alloy' },
            { id: 'echo', name: 'Echo' },
            { id: 'fable', name: 'Fable' },
            { id: 'onyx', name: 'Onyx' },
            { id: 'nova', name: 'Nova' },
            { id: 'shimmer', name: 'Shimmer' },
        ],
    },
    // Add other providers like Google, ElevenLabs, PlayHT, Coqui, etc. back here when ready
];

// --- Helper Functions ---

/**
 * Finds TTS provider information by its unique ID.
 */
export function getTTSProviderInfoById(id: TTSProviderInfo['id']): TTSProviderInfo | undefined {
    // Since only OpenAI is left, this simplifies, but keep the find for future expansion
    return AVAILABLE_TTS_PROVIDERS.find(p => p.id === id);
}

/**
 * Gets the list of voices for a specific TTS provider ID.
 * Returns an empty array if the provider ID is not found.
 */
export function getVoicesForProvider(id: TTSProviderInfo['id']): TTSVoice[] {
    return getTTSProviderInfoById(id)?.voices || [];
}

/**
 * Gets the default voice for a given provider ID.
 * Returns the first voice in the list, or null if no voices are available.
 */
export function getDefaultVoiceForProvider(id: TTSProviderInfo['id']): TTSVoice | null {
    const voices = getVoicesForProvider(id);
    return voices.length > 0 ? voices[0] : null;
}
