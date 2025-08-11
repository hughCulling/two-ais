// src/lib/tts_models.ts
// Centralized definition for available Text-to-Speech providers and voices
import { TranslationKeys } from '@/lib/translations';

// Browser TTS voice interface (extends base TTSVoice with browser-specific properties)
export interface BrowserTTSVoice extends TTSVoice {
  lang: string; // BCP-47 language tag (e.g., 'en-US', 'es-ES')
  localService?: boolean; // Whether the voice is a local system voice
  default?: boolean; // Whether this is the default voice for its language
}

// Browser TTS voices will be populated at runtime from the Web Speech API
export const BROWSER_TTS_VOICES: TTSVoice[] = [];

// Function to populate browser voices
export function populateBrowserVoices(): TTSVoice[] {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
        return [];
    }

    const voices = window.speechSynthesis.getVoices();
    const voiceMap = new Map<string, number>();
    
    return voices
        .filter(voice => voice.lang) // Filter out voices without a language
        .map(voice => {
            // Create a base ID from the voice URI or name
            const baseId = `browser-${voice.voiceURI || voice.name.replace(/\s+/g, '-').toLowerCase()}`;
            
            // Track how many times we've seen this voice ID
            const count = (voiceMap.get(baseId) || 0) + 1;
            voiceMap.set(baseId, count);
            
            // Append a number if we've seen this ID before
            const uniqueId = count > 1 ? `${baseId}-${count}` : baseId;
            
            // Create a friendly display name
            const displayName = `${voice.name} (${voice.lang}${voice.localService ? ', Local' : ''}${voice.default ? ', Default' : ''})`;
            
            // Map gender to match TTSVoice type
            const gender = voice.name.toLowerCase().includes('female') ? 'Female' : 
                         voice.name.toLowerCase().includes('male') ? 'Male' : 'Neutral';
            
            return {
                id: uniqueId,
                name: displayName,
                gender,
                languageCodes: [voice.lang],
                provider: 'browser',
                providerVoiceId: voice.voiceURI,
                voiceType: 'Browser',
                status: 'GA',
                lang: voice.lang,
                localService: voice.localService,
                default: voice.default
            } as TTSVoice;
        });
}

// Initialize browser voices when the page loads
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    // Populate voices when they are loaded
    const handleVoicesChanged = () => {
        const voices = populateBrowserVoices();
        BROWSER_TTS_VOICES.length = 0;
        BROWSER_TTS_VOICES.push(...voices);
    };
    
    // Some browsers fire the voiceschanged event when voices are loaded
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    
    // Also try to populate voices immediately in case they're already loaded
    handleVoicesChanged();
    
    // Set up a fallback in case voiceschanged doesn't fire
    setTimeout(handleVoicesChanged, 1000);
}

// --- TTS Voice Interface ---
export interface TTSVoice {
    id: string;   // Provider-specific voice ID (e.g., for OpenAI: 'alloy'; for Google: 'en-US-Wavenet-A')
    providerVoiceId?: string; // The actual voiceURI from the speech synthesis engine
    name: string; // User-friendly display name (e.g., "Alloy", "US WaveNet A (F) [WaveNet]")
    gender?: 'Male' | 'Female' | 'Neutral'; // Optional gender information
    languageCodes?: string[]; // Optional BCP-47 language codes supported (e.g., ['en-US'])
    voiceType?: string; // Optional: Specific type/tier of voice (e.g., "Standard", "WaveNet", "Chirp HD", "Polyglot", "Neural2 (Casual)", "Studio (News)")
    status?: 'GA' | 'Preview' | 'Experimental'; // Optional: Launch stage
    notes?: string; // Optional: Important considerations
}

// --- Standard OpenAI Voices ---
export const OPENAI_TTS_VOICES: TTSVoice[] = [
    { id: 'alloy', name: 'Alloy' },
    { id: 'ash', name: 'Ash' },
    { id: 'coral', name: 'Coral' },
    { id: 'echo', name: 'Echo' },
    { id: 'fable', name: 'Fable' },
    { id: 'nova', name: 'Nova' },
    { id: 'onyx', name: 'Onyx' },
    { id: 'sage', name: 'Sage' },
    { id: 'shimmer', name: 'Shimmer' },
];

// --- Google Cloud TTS Voices (ALL English voices) ---
const CHIRP3_HD_VARIANT_NAMES = [
    'Achernar', 'Achird', 'Algenib', 'Algieba', 'Alnilam', 'Aoede', 'Autonoe',
    'Callirrhoe', 'Charon', 'Despina', 'Enceladus', 'Erinome', 'Fenrir', 'Gacrux',
    'Iapetus', 'Kore', 'Laomedeia', 'Leda', 'Orus', 'Puck', 'Pulcherrima',
    'Rasalgethi', 'Sadachbia', 'Sadaltager', 'Schedar', 'Sulafat', 'Umbriel',
    'Vindemiatrix', 'Zephyr', 'Zubenelgenubi'
];

const getChirp3HDGender = (variantName: string): 'Male' | 'Female' => {
    const maleVariants = [
        'Achird', 'Algenib', 'Algieba', 'Alnilam', 'Charon', 'Enceladus', 'Fenrir',
        'Iapetus', 'Orus', 'Puck', 'Rasalgethi', 'Sadachbia', 'Sadaltager',
        'Schedar', 'Umbriel', 'Zubenelgenubi'
    ];
    return maleVariants.includes(variantName) ? 'Male' : 'Female';
};

// --- Voices for Google Gemini TTS ---
// These are the 30 prebuilt voices mentioned in Gemini 2.5 Flash Preview TTS documentation
// They share names with CHIRP3_HD_VARIANT_NAMES
export const GEMINI_TTS_VOICES: TTSVoice[] = CHIRP3_HD_VARIANT_NAMES.map(variantName => ({
    id: variantName, // API expects simple name like 'Kore'
    name: `${variantName} (${getChirp3HDGender(variantName).charAt(0)})`, // User-friendly name
    gender: getChirp3HDGender(variantName),
    voiceType: 'Gemini Prebuilt', // Specific type for Gemini
    status: 'Preview',
    // languageCodes are not set per voice here, as the Gemini TTS model detects language.
    // The model itself has a list of supported languages.
}));

// --- Comprehensive list of ALL Google Cloud TTS Voices ---
export const GOOGLE_TTS_VOICES: TTSVoice[] = [
    // Afrikaans (South Africa)
    { id: 'af-ZA-Standard-A', name: 'ZA Standard A (F)', gender: 'Female', languageCodes: ['af-ZA'], voiceType: 'Standard', status: 'GA' },

    // Arabic
    { id: 'ar-XA-Standard-A', name: 'XA Standard A (F)', gender: 'Female', languageCodes: ['ar-XA'], voiceType: 'Standard', status: 'GA' },
    { id: 'ar-XA-Standard-B', name: 'XA Standard B (M)', gender: 'Male', languageCodes: ['ar-XA'], voiceType: 'Standard', status: 'GA' },
    { id: 'ar-XA-Standard-C', name: 'XA Standard C (M)', gender: 'Male', languageCodes: ['ar-XA'], voiceType: 'Standard', status: 'GA' },
    { id: 'ar-XA-Standard-D', name: 'XA Standard D (F)', gender: 'Female', languageCodes: ['ar-XA'], voiceType: 'Standard', status: 'GA' },
    { id: 'ar-XA-Wavenet-A', name: 'XA Wavenet A (F)', gender: 'Female', languageCodes: ['ar-XA'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ar-XA-Wavenet-B', name: 'XA Wavenet B (M)', gender: 'Male', languageCodes: ['ar-XA'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ar-XA-Wavenet-C', name: 'XA Wavenet C (M)', gender: 'Male', languageCodes: ['ar-XA'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ar-XA-Wavenet-D', name: 'XA Wavenet D (F)', gender: 'Female', languageCodes: ['ar-XA'], voiceType: 'WaveNet', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `ar-XA-Chirp3-HD-${variant}`, name: `XA ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['ar-XA'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Basque (Spain)
    { id: 'eu-ES-Standard-A', name: 'ES Standard A (F)', gender: 'Female', languageCodes: ['eu-ES'], voiceType: 'Standard', status: 'GA' },
    { id: 'eu-ES-Standard-B', name: 'ES Standard B (F)', gender: 'Female', languageCodes: ['eu-ES'], voiceType: 'Standard', status: 'GA' },

    // Bengali (India)
    { id: 'bn-IN-Standard-A', name: 'IN Standard A (F)', gender: 'Female', languageCodes: ['bn-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'bn-IN-Standard-B', name: 'IN Standard B (M)', gender: 'Male', languageCodes: ['bn-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'bn-IN-Wavenet-A', name: 'IN Wavenet A (F)', gender: 'Female', languageCodes: ['bn-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'bn-IN-Wavenet-B', name: 'IN Wavenet B (M)', gender: 'Male', languageCodes: ['bn-IN'], voiceType: 'WaveNet', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `bn-IN-Chirp3-HD-${variant}`, name: `IN ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['bn-IN'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Bulgarian (Bulgaria)
    { id: 'bg-BG-Standard-A', name: 'BG Standard A (F)', gender: 'Female', languageCodes: ['bg-BG'], voiceType: 'Standard', status: 'GA' },

    // Catalan (Spain)
    { id: 'ca-ES-Standard-A', name: 'ES Standard A (F)', gender: 'Female', languageCodes: ['ca-ES'], voiceType: 'Standard', status: 'GA' },

    // Chinese (Hong Kong)
    { id: 'yue-HK-Standard-A', name: 'HK Standard A (F)', gender: 'Female', languageCodes: ['yue-HK'], voiceType: 'Standard', status: 'GA' },
    { id: 'yue-HK-Standard-B', name: 'HK Standard B (M)', gender: 'Male', languageCodes: ['yue-HK'], voiceType: 'Standard', status: 'GA' },
    { id: 'yue-HK-Standard-C', name: 'HK Standard C (F)', gender: 'Female', languageCodes: ['yue-HK'], voiceType: 'Standard', status: 'GA' },
    { id: 'yue-HK-Standard-D', name: 'HK Standard D (M)', gender: 'Male', languageCodes: ['yue-HK'], voiceType: 'Standard', status: 'GA' },

    // Czech (Czech Republic)
    { id: 'cs-CZ-Standard-A', name: 'CZ Standard A (F)', gender: 'Female', languageCodes: ['cs-CZ'], voiceType: 'Standard', status: 'GA' },
    { id: 'cs-CZ-Wavenet-A', name: 'CZ Wavenet A (F)', gender: 'Female', languageCodes: ['cs-CZ'], voiceType: 'WaveNet', status: 'GA' },

    // Danish (Denmark)
    { id: 'da-DK-Standard-A', name: 'DK Standard A (F)', gender: 'Female', languageCodes: ['da-DK'], voiceType: 'Standard', status: 'GA' },
    { id: 'da-DK-Wavenet-A', name: 'DK Wavenet A (F)', gender: 'Female', languageCodes: ['da-DK'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'da-DK-Standard-C', name: 'DK Standard C (M)', gender: 'Male', languageCodes: ['da-DK'], voiceType: 'Standard', status: 'GA' },
    { id: 'da-DK-Standard-D', name: 'DK Standard D (F)', gender: 'Female', languageCodes: ['da-DK'], voiceType: 'Standard', status: 'GA' },
    { id: 'da-DK-Standard-E', name: 'DK Standard E (F)', gender: 'Female', languageCodes: ['da-DK'], voiceType: 'Standard', status: 'GA' },

    // Dutch (Belgium)
    { id: 'nl-BE-Standard-A', name: 'BE Standard A (F)', gender: 'Female', languageCodes: ['nl-BE'], voiceType: 'Standard', status: 'GA' },
    { id: 'nl-BE-Standard-B', name: 'BE Standard B (M)', gender: 'Male', languageCodes: ['nl-BE'], voiceType: 'Standard', status: 'GA' },
    { id: 'nl-BE-Wavenet-A', name: 'BE Wavenet A (F)', gender: 'Female', languageCodes: ['nl-BE'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'nl-BE-Wavenet-B', name: 'BE Wavenet B (M)', gender: 'Male', languageCodes: ['nl-BE'], voiceType: 'WaveNet', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `nl-BE-Chirp3-HD-${variant}`, name: `BE ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['nl-BE'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Dutch (Netherlands)
    { id: 'nl-NL-Standard-A', name: 'NL Standard A (F)', gender: 'Female', languageCodes: ['nl-NL'], voiceType: 'Standard', status: 'GA' },
    { id: 'nl-NL-Standard-B', name: 'NL Standard B (M)', gender: 'Male', languageCodes: ['nl-NL'], voiceType: 'Standard', status: 'GA' },
    { id: 'nl-NL-Standard-C', name: 'NL Standard C (M)', gender: 'Male', languageCodes: ['nl-NL'], voiceType: 'Standard', status: 'GA' },
    { id: 'nl-NL-Standard-D', name: 'NL Standard D (F)', gender: 'Female', languageCodes: ['nl-NL'], voiceType: 'Standard', status: 'GA' },
    { id: 'nl-NL-Standard-E', name: 'NL Standard E (F)', gender: 'Female', languageCodes: ['nl-NL'], voiceType: 'Standard', status: 'GA' },
    { id: 'nl-NL-Wavenet-A', name: 'NL Wavenet A (F)', gender: 'Female', languageCodes: ['nl-NL'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'nl-NL-Wavenet-B', name: 'NL Wavenet B (M)', gender: 'Male', languageCodes: ['nl-NL'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'nl-NL-Wavenet-C', name: 'NL Wavenet C (M)', gender: 'Male', languageCodes: ['nl-NL'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'nl-NL-Wavenet-D', name: 'NL Wavenet D (F)', gender: 'Female', languageCodes: ['nl-NL'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'nl-NL-Wavenet-E', name: 'NL Wavenet E (F)', gender: 'Female', languageCodes: ['nl-NL'], voiceType: 'WaveNet', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `nl-NL-Chirp3-HD-${variant}`, name: `NL ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['nl-NL'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),
    
    // English (Australia)
    { id: 'en-AU-Standard-A', name: 'AU Standard A (F)', gender: 'Female', languageCodes: ['en-AU'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-AU-Standard-B', name: 'AU Standard B (M)', gender: 'Male', languageCodes: ['en-AU'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-AU-Standard-C', name: 'AU Standard C (F)', gender: 'Female', languageCodes: ['en-AU'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-AU-Standard-D', name: 'AU Standard D (M)', gender: 'Male', languageCodes: ['en-AU'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-AU-Wavenet-A', name: 'AU Wavenet A (F)', gender: 'Female', languageCodes: ['en-AU'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-AU-Wavenet-B', name: 'AU Wavenet B (M)', gender: 'Male', languageCodes: ['en-AU'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-AU-Wavenet-C', name: 'AU Wavenet C (F)', gender: 'Female', languageCodes: ['en-AU'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-AU-Wavenet-D', name: 'AU Wavenet D (M)', gender: 'Male', languageCodes: ['en-AU'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-AU-Neural2-A', name: 'AU Neural2 A (F)', gender: 'Female', languageCodes: ['en-AU'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-AU-Neural2-B', name: 'AU Neural2 B (M)', gender: 'Male', languageCodes: ['en-AU'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-AU-Neural2-C', name: 'AU Neural2 C (F)', gender: 'Female', languageCodes: ['en-AU'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-AU-Neural2-D', name: 'AU Neural2 D (M)', gender: 'Male', languageCodes: ['en-AU'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-AU-News-E', name: 'AU News E (F)', gender: 'Female', languageCodes: ['en-AU'], voiceType: 'Studio (News)', status: 'GA', notes: 'SSML limited (no mark, emphasis, prosody pitch, lang).' },
    { id: 'en-AU-News-F', name: 'AU News F (F)', gender: 'Female', languageCodes: ['en-AU'], voiceType: 'Studio (News)', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-AU-News-G', name: 'AU News G (M)', gender: 'Male', languageCodes: ['en-AU'], voiceType: 'Studio (News)', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-AU-Polyglot-1', name: 'AU Polyglot 1 (M)', gender: 'Male', languageCodes: ['en-AU', 'de-DE', 'en-US', 'es-ES', 'fr-FR', 'it-IT', 'pt-BR'], voiceType: 'Polyglot', status: 'GA' },
    { id: 'en-AU-Chirp-HD-D', name: 'AU Chirp HD D (M)', gender: 'Male', languageCodes: ['en-AU'], voiceType: 'Chirp HD', status: 'Preview', notes: 'Conversational. May hallucinate. No SSML/rate/pitch/A-Law.' },
    { id: 'en-AU-Chirp-HD-F', name: 'AU Chirp HD F (F)', gender: 'Female', languageCodes: ['en-AU'], voiceType: 'Chirp HD', status: 'Preview', notes: 'Conversational. May hallucinate. No SSML/rate/pitch/A-Law.' },
    { id: 'en-AU-Chirp-HD-O', name: 'AU Chirp HD O (F)', gender: 'Female', languageCodes: ['en-AU'], voiceType: 'Chirp HD', status: 'Preview', notes: 'Conversational. May hallucinate. No SSML/rate/pitch/A-Law.' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `en-AU-Chirp3-HD-${variant}`, name: `AU ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['en-AU'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // English (India)
    { id: 'en-IN-Standard-A', name: 'IN Standard A (F)', gender: 'Female', languageCodes: ['en-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-IN-Standard-B', name: 'IN Standard B (M)', gender: 'Male', languageCodes: ['en-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-IN-Standard-C', name: 'IN Standard C (M)', gender: 'Male', languageCodes: ['en-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-IN-Standard-D', name: 'IN Standard D (F)', gender: 'Female', languageCodes: ['en-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-IN-Wavenet-A', name: 'IN Wavenet A (F)', gender: 'Female', languageCodes: ['en-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-IN-Wavenet-B', name: 'IN Wavenet B (M)', gender: 'Male', languageCodes: ['en-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-IN-Wavenet-C', name: 'IN Wavenet C (M)', gender: 'Male', languageCodes: ['en-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-IN-Wavenet-D', name: 'IN Wavenet D (F)', gender: 'Female', languageCodes: ['en-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-IN-Neural2-A', name: 'IN Neural2 A (F)', gender: 'Female', languageCodes: ['en-IN'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-IN-Neural2-B', name: 'IN Neural2 B (M)', gender: 'Male', languageCodes: ['en-IN'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-IN-Neural2-C', name: 'IN Neural2 C (M)', gender: 'Male', languageCodes: ['en-IN'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-IN-Neural2-D', name: 'IN Neural2 D (F)', gender: 'Female', languageCodes: ['en-IN'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-IN-Chirp-HD-D', name: 'IN Chirp HD D (M)', gender: 'Male', languageCodes: ['en-IN'], voiceType: 'Chirp HD', status: 'Preview', notes: 'Conversational. May hallucinate. No SSML/rate/pitch/A-Law.' },
    { id: 'en-IN-Chirp-HD-F', name: 'IN Chirp HD F (F)', gender: 'Female', languageCodes: ['en-IN'], voiceType: 'Chirp HD', status: 'Preview', notes: 'Conversational. May hallucinate. No SSML/rate/pitch/A-Law.' },
    { id: 'en-IN-Chirp-HD-O', name: 'IN Chirp HD O (F)', gender: 'Female', languageCodes: ['en-IN'], voiceType: 'Chirp HD', status: 'Preview', notes: 'Conversational. May hallucinate. No SSML/rate/pitch/A-Law.' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `en-IN-Chirp3-HD-${variant}`, name: `IN ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['en-IN'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // English (UK)
    { id: 'en-GB-Standard-A', name: 'UK Standard A (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-GB-Standard-B', name: 'UK Standard B (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-GB-Standard-C', name: 'UK Standard C (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-GB-Standard-D', name: 'UK Standard D (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-GB-Standard-F', name: 'UK Standard F (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-GB-Wavenet-A', name: 'UK Wavenet A (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-GB-Wavenet-B', name: 'UK Wavenet B (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-GB-Wavenet-C', name: 'UK Wavenet C (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-GB-Wavenet-D', name: 'UK Wavenet D (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-GB-Wavenet-F', name: 'UK Wavenet F (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-GB-Neural2-A', name: 'UK Neural2 A (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-GB-Neural2-B', name: 'UK Neural2 B (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-GB-Neural2-C', name: 'UK Neural2 C (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-GB-Neural2-D', name: 'UK Neural2 D (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-GB-Neural2-F', name: 'UK Neural2 F (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-GB-News-G', name: 'UK News G (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Studio (News)', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-GB-News-H', name: 'UK News H (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Studio (News)', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-GB-News-I', name: 'UK News I (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Studio (News)', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-GB-News-J', name: 'UK News J (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'Studio (News)', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-GB-News-K', name: 'UK News K (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'Studio (News)', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-GB-News-L', name: 'UK News L (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'Studio (News)', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-GB-News-M', name: 'UK News M (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'Studio (News)', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-GB-Studio-B', name: 'UK Studio B (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'Studio', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-GB-Studio-C', name: 'UK Studio C (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Studio', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-GB-Chirp-HD-D', name: 'UK Chirp HD D (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'Chirp HD', status: 'Preview', notes: 'Conversational. May hallucinate. No SSML/rate/pitch/A-Law.' },
    { id: 'en-GB-Chirp-HD-F', name: 'UK Chirp HD F (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Chirp HD', status: 'Preview', notes: 'Conversational. May hallucinate. No SSML/rate/pitch/A-Law.' },
    { id: 'en-GB-Chirp-HD-O', name: 'UK Chirp HD O (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Chirp HD', status: 'Preview', notes: 'Conversational. May hallucinate. No SSML/rate/pitch/A-Law.' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `en-GB-Chirp3-HD-${variant}`, name: `UK ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['en-GB'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // English (US)
    { id: 'en-US-Standard-A', name: 'US Standard A (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-US-Standard-B', name: 'US Standard B (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-US-Standard-C', name: 'US Standard C (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-US-Standard-D', name: 'US Standard D (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-US-Standard-E', name: 'US Standard E (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-US-Standard-F', name: 'US Standard F (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-US-Standard-G', name: 'US Standard G (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-US-Standard-H', name: 'US Standard H (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-US-Standard-I', name: 'US Standard I (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-US-Standard-J', name: 'US Standard J (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-US-Wavenet-A', name: 'US Wavenet A (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-US-Wavenet-B', name: 'US Wavenet B (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-US-Wavenet-C', name: 'US Wavenet C (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-US-Wavenet-D', name: 'US Wavenet D (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-US-Wavenet-E', name: 'US Wavenet E (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-US-Wavenet-F', name: 'US Wavenet F (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-US-Wavenet-G', name: 'US Wavenet G (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-US-Wavenet-H', name: 'US Wavenet H (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-US-Wavenet-I', name: 'US Wavenet I (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-US-Wavenet-J', name: 'US Wavenet J (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-US-Neural2-A', name: 'US Neural2 A (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-US-Neural2-C', name: 'US Neural2 C (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-US-Neural2-D', name: 'US Neural2 D (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-US-Neural2-E', name: 'US Neural2 E (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-US-Neural2-F', name: 'US Neural2 F (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-US-Neural2-G', name: 'US Neural2 G (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-US-Neural2-H', name: 'US Neural2 H (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-US-Neural2-I', name: 'US Neural2 I (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-US-Neural2-J', name: 'US Neural2 J (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-US-News-K', name: 'US News K (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'Studio (News)', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-US-News-L', name: 'US News L (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'Studio (News)', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-US-News-M', name: 'US News M (M)', gender: 'Male', languageCodes: ['en-US', 'es-US'], voiceType: 'Studio (News)', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-US-News-N', name: 'US News N (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'Studio (News)', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-US-Studio-O', name: 'US Studio O (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'Studio', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-US-Studio-Q', name: 'US Studio Q (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'Studio', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-US-Casual-K', name: 'US Casual K (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'Neural2 (Casual)', status: 'GA' },
    { id: 'en-US-Polyglot-1', name: 'US Polyglot 1 (M)', gender: 'Male', languageCodes: ['en-US', 'de-DE', 'en-AU', 'es-ES', 'fr-FR', 'it-IT', 'pt-BR'], voiceType: 'Polyglot', status: 'GA' },
    { id: 'en-US-Chirp-HD-D', name: 'US Chirp HD D (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'Chirp HD', status: 'Preview', notes: 'Conversational. May hallucinate. No SSML/rate/pitch/A-Law.' },
    { id: 'en-US-Chirp-HD-F', name: 'US Chirp HD F (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'Chirp HD', status: 'Preview', notes: 'Conversational. May hallucinate. No SSML/rate/pitch/A-Law.' },
    { id: 'en-US-Chirp-HD-O', name: 'US Chirp HD O (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'Chirp HD', status: 'Preview', notes: 'Conversational. May hallucinate. No SSML/rate/pitch/A-Law.' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `en-US-Chirp3-HD-${variant}`, name: `US ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['en-US'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Filipino (Philippines)
    { id: 'fil-PH-Standard-A', name: 'PH Standard A (F)', gender: 'Female', languageCodes: ['fil-PH'], voiceType: 'Standard', status: 'GA' },
    { id: 'fil-PH-Standard-B', name: 'PH Standard B (F)', gender: 'Female', languageCodes: ['fil-PH'], voiceType: 'Standard', status: 'GA' },
    { id: 'fil-PH-Standard-C', name: 'PH Standard C (M)', gender: 'Male', languageCodes: ['fil-PH'], voiceType: 'Standard', status: 'GA' },
    { id: 'fil-PH-Standard-D', name: 'PH Standard D (M)', gender: 'Male', languageCodes: ['fil-PH'], voiceType: 'Standard', status: 'GA' },
    { id: 'fil-PH-Wavenet-A', name: 'PH Wavenet A (F)', gender: 'Female', languageCodes: ['fil-PH'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'fil-PH-Wavenet-B', name: 'PH Wavenet B (F)', gender: 'Female', languageCodes: ['fil-PH'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'fil-PH-Wavenet-C', name: 'PH Wavenet C (M)', gender: 'Male', languageCodes: ['fil-PH'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'fil-PH-Wavenet-D', name: 'PH Wavenet D (M)', gender: 'Male', languageCodes: ['fil-PH'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'fil-ph-Neural2-A', name: 'PH Neural2 A (F)', gender: 'Female', languageCodes: ['fil-PH'], voiceType: 'Neural2', status: 'GA' },
    { id: 'fil-ph-Neural2-D', name: 'PH Neural2 D (M)', gender: 'Male', languageCodes: ['fil-PH'], voiceType: 'Neural2', status: 'GA' },

    // Finnish (Finland)
    { id: 'fi-FI-Standard-A', name: 'FI Standard A (F)', gender: 'Female', languageCodes: ['fi-FI'], voiceType: 'Standard', status: 'GA' },
    { id: 'fi-FI-Wavenet-A', name: 'FI Wavenet A (F)', gender: 'Female', languageCodes: ['fi-FI'], voiceType: 'WaveNet', status: 'GA' },

    // French (Canada)
    { id: 'fr-CA-Standard-A', name: 'CA Standard A (F)', gender: 'Female', languageCodes: ['fr-CA'], voiceType: 'Standard', status: 'GA' },
    { id: 'fr-CA-Standard-B', name: 'CA Standard B (M)', gender: 'Male', languageCodes: ['fr-CA'], voiceType: 'Standard', status: 'GA' },
    { id: 'fr-CA-Standard-C', name: 'CA Standard C (F)', gender: 'Female', languageCodes: ['fr-CA'], voiceType: 'Standard', status: 'GA' },
    { id: 'fr-CA-Standard-D', name: 'CA Standard D (M)', gender: 'Male', languageCodes: ['fr-CA'], voiceType: 'Standard', status: 'GA' },
    { id: 'fr-CA-Wavenet-A', name: 'CA Wavenet A (F)', gender: 'Female', languageCodes: ['fr-CA'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'fr-CA-Wavenet-B', name: 'CA Wavenet B (M)', gender: 'Male', languageCodes: ['fr-CA'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'fr-CA-Wavenet-C', name: 'CA Wavenet C (F)', gender: 'Female', languageCodes: ['fr-CA'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'fr-CA-Wavenet-D', name: 'CA Wavenet D (M)', gender: 'Male', languageCodes: ['fr-CA'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'fr-CA-Neural2-A', name: 'CA Neural2 A (F)', gender: 'Female', languageCodes: ['fr-CA'], voiceType: 'Neural2', status: 'GA' },
    { id: 'fr-CA-Neural2-B', name: 'CA Neural2 B (M)', gender: 'Male', languageCodes: ['fr-CA'], voiceType: 'Neural2', status: 'GA' },
    { id: 'fr-CA-Neural2-C', name: 'CA Neural2 C (F)', gender: 'Female', languageCodes: ['fr-CA'], voiceType: 'Neural2', status: 'GA' },
    { id: 'fr-CA-Neural2-D', name: 'CA Neural2 D (M)', gender: 'Male', languageCodes: ['fr-CA'], voiceType: 'Neural2', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `fr-CA-Chirp3-HD-${variant}`, name: `CA ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['fr-CA'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // French (France)
    { id: 'fr-FR-Standard-A', name: 'FR Standard A (F)', gender: 'Female', languageCodes: ['fr-FR'], voiceType: 'Standard', status: 'GA' },
    { id: 'fr-FR-Standard-B', name: 'FR Standard B (M)', gender: 'Male', languageCodes: ['fr-FR'], voiceType: 'Standard', status: 'GA' },
    { id: 'fr-FR-Standard-C', name: 'FR Standard C (F)', gender: 'Female', languageCodes: ['fr-FR'], voiceType: 'Standard', status: 'GA' },
    { id: 'fr-FR-Standard-D', name: 'FR Standard D (M)', gender: 'Male', languageCodes: ['fr-FR'], voiceType: 'Standard', status: 'GA' },
    { id: 'fr-FR-Standard-E', name: 'FR Standard E (F)', gender: 'Female', languageCodes: ['fr-FR'], voiceType: 'Standard', status: 'GA' },
    { id: 'fr-FR-Wavenet-A', name: 'FR Wavenet A (F)', gender: 'Female', languageCodes: ['fr-FR'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'fr-FR-Wavenet-B', name: 'FR Wavenet B (M)', gender: 'Male', languageCodes: ['fr-FR'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'fr-FR-Wavenet-C', name: 'FR Wavenet C (F)', gender: 'Female', languageCodes: ['fr-FR'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'fr-FR-Wavenet-D', name: 'FR Wavenet D (M)', gender: 'Male', languageCodes: ['fr-FR'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'fr-FR-Wavenet-E', name: 'FR Wavenet E (F)', gender: 'Female', languageCodes: ['fr-FR'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'fr-FR-Neural2-A', name: 'FR Neural2 A (F)', gender: 'Female', languageCodes: ['fr-FR'], voiceType: 'Neural2', status: 'GA' },
    { id: 'fr-FR-Neural2-B', name: 'FR Neural2 B (M)', gender: 'Male', languageCodes: ['fr-FR'], voiceType: 'Neural2', status: 'GA' },
    { id: 'fr-FR-Neural2-C', name: 'FR Neural2 C (F)', gender: 'Female', languageCodes: ['fr-FR'], voiceType: 'Neural2', status: 'GA' },
    { id: 'fr-FR-Neural2-D', name: 'FR Neural2 D (M)', gender: 'Male', languageCodes: ['fr-FR'], voiceType: 'Neural2', status: 'GA' },
    { id: 'fr-FR-Neural2-E', name: 'FR Neural2 E (F)', gender: 'Female', languageCodes: ['fr-FR'], voiceType: 'Neural2', status: 'GA' },
    { id: 'fr-FR-Polyglot-1', name: 'FR Polyglot 1 (M)', gender: 'Male', languageCodes: ['fr-FR', 'de-DE', 'en-AU', 'en-US', 'es-ES', 'it-IT', 'pt-BR'], voiceType: 'Polyglot', status: 'GA' },
    { id: 'fr-FR-Studio-A', name: 'FR Studio A (F)', gender: 'Female', languageCodes: ['fr-FR'], voiceType: 'Studio', status: 'GA' },
    { id: 'fr-FR-Studio-D', name: 'FR Studio D (M)', gender: 'Male', languageCodes: ['fr-FR'], voiceType: 'Studio', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `fr-FR-Chirp3-HD-${variant}`, name: `FR ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['fr-FR'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Galician (Spain)
    { id: 'gl-ES-Standard-A', name: 'ES Standard A (F)', gender: 'Female', languageCodes: ['gl-ES'], voiceType: 'Standard', status: 'GA' },
    
    // German (Germany)
    { id: 'de-DE-Standard-A', name: 'DE Standard A (F)', gender: 'Female', languageCodes: ['de-DE'], voiceType: 'Standard', status: 'GA' },
    { id: 'de-DE-Standard-B', name: 'DE Standard B (M)', gender: 'Male', languageCodes: ['de-DE'], voiceType: 'Standard', status: 'GA' },
    { id: 'de-DE-Wavenet-A', name: 'DE Wavenet A (F)', gender: 'Female', languageCodes: ['de-DE'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'de-DE-Wavenet-B', name: 'DE Wavenet B (M)', gender: 'Male', languageCodes: ['de-DE'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'de-DE-Wavenet-C', name: 'DE Wavenet C (F)', gender: 'Female', languageCodes: ['de-DE'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'de-DE-Wavenet-D', name: 'DE Wavenet D (M)', gender: 'Male', languageCodes: ['de-DE'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'de-DE-Wavenet-E', name: 'DE Wavenet E (M)', gender: 'Male', languageCodes: ['de-DE'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'de-DE-Wavenet-F', name: 'DE Wavenet F (F)', gender: 'Female', languageCodes: ['de-DE'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'de-DE-Standard-C', name: 'DE Standard C (F)', gender: 'Female', languageCodes: ['de-DE'], voiceType: 'Standard', status: 'GA' },
    { id: 'de-DE-Standard-D', name: 'DE Standard D (M)', gender: 'Male', languageCodes: ['de-DE'], voiceType: 'Standard', status: 'GA' },
    { id: 'de-DE-Standard-E', name: 'DE Standard E (M)', gender: 'Male', languageCodes: ['de-DE'], voiceType: 'Standard', status: 'GA' },
    { id: 'de-DE-Standard-F', name: 'DE Standard F (F)', gender: 'Female', languageCodes: ['de-DE'], voiceType: 'Standard', status: 'GA' },
    { id: 'de-DE-Neural2-B', name: 'DE Neural2 B (M)', gender: 'Male', languageCodes: ['de-DE'], voiceType: 'Neural2', status: 'GA' },
    { id: 'de-DE-Neural2-C', name: 'DE Neural2 C (F)', gender: 'Female', languageCodes: ['de-DE'], voiceType: 'Neural2', status: 'GA' },
    { id: 'de-DE-Neural2-D', name: 'DE Neural2 D (M)', gender: 'Male', languageCodes: ['de-DE'], voiceType: 'Neural2', status: 'GA' },
    { id: 'de-DE-Neural2-F', name: 'DE Neural2 F (F)', gender: 'Female', languageCodes: ['de-DE'], voiceType: 'Neural2', status: 'GA' },
    { id: 'de-DE-Polyglot-1', name: 'DE Polyglot 1 (M)', gender: 'Male', languageCodes: ['de-DE', 'en-AU', 'en-US', 'es-ES', 'fr-FR', 'it-IT', 'pt-BR'], voiceType: 'Polyglot', status: 'GA' },
    { id: 'de-DE-Studio-B', name: 'DE Studio B (M)', gender: 'Male', languageCodes: ['de-DE'], voiceType: 'Studio', status: 'GA' },
    { id: 'de-DE-Studio-C', name: 'DE Studio C (F)', gender: 'Female', languageCodes: ['de-DE'], voiceType: 'Studio', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `de-DE-Chirp3-HD-${variant}`, name: `DE ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['de-DE'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Greek (Greece)
    { id: 'el-GR-Standard-A', name: 'GR Standard A (F)', gender: 'Female', languageCodes: ['el-GR'], voiceType: 'Standard', status: 'GA' },
    { id: 'el-GR-Wavenet-A', name: 'GR Wavenet A (F)', gender: 'Female', languageCodes: ['el-GR'], voiceType: 'WaveNet', status: 'GA' },

    // Gujarati (India)
    { id: 'gu-IN-Standard-A', name: 'IN Standard A (F)', gender: 'Female', languageCodes: ['gu-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'gu-IN-Standard-B', name: 'IN Standard B (M)', gender: 'Male', languageCodes: ['gu-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'gu-IN-Wavenet-A', name: 'IN Wavenet A (F)', gender: 'Female', languageCodes: ['gu-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'gu-IN-Wavenet-B', name: 'IN Wavenet B (M)', gender: 'Male', languageCodes: ['gu-IN'], voiceType: 'WaveNet', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `gu-IN-Chirp3-HD-${variant}`, name: `IN ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['gu-IN'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Hebrew (Israel)
    { id: 'he-IL-Standard-A', name: 'IL Standard A (F)', gender: 'Female', languageCodes: ['he-IL'], voiceType: 'Standard', status: 'GA' },
    { id: 'he-IL-Standard-B', name: 'IL Standard B (M)', gender: 'Male', languageCodes: ['he-IL'], voiceType: 'Standard', status: 'GA' },
    { id: 'he-IL-Standard-C', name: 'IL Standard C (F)', gender: 'Female', languageCodes: ['he-IL'], voiceType: 'Standard', status: 'GA' },
    { id: 'he-IL-Standard-D', name: 'IL Standard D (M)', gender: 'Male', languageCodes: ['he-IL'], voiceType: 'Standard', status: 'GA' },
    { id: 'he-IL-Wavenet-A', name: 'IL Wavenet A (F)', gender: 'Female', languageCodes: ['he-IL'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'he-IL-Wavenet-B', name: 'IL Wavenet B (M)', gender: 'Male', languageCodes: ['he-IL'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'he-IL-Wavenet-C', name: 'IL Wavenet C (F)', gender: 'Female', languageCodes: ['he-IL'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'he-IL-Wavenet-D', name: 'IL Wavenet D (M)', gender: 'Male', languageCodes: ['he-IL'], voiceType: 'WaveNet', status: 'GA' },

    // Hindi (India)
    { id: 'hi-IN-Standard-A', name: 'IN Standard A (F)', gender: 'Female', languageCodes: ['hi-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'hi-IN-Standard-B', name: 'IN Standard B (M)', gender: 'Male', languageCodes: ['hi-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'hi-IN-Standard-C', name: 'IN Standard C (M)', gender: 'Male', languageCodes: ['hi-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'hi-IN-Standard-D', name: 'IN Standard D (F)', gender: 'Female', languageCodes: ['hi-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'hi-IN-Wavenet-A', name: 'IN Wavenet A (F)', gender: 'Female', languageCodes: ['hi-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'hi-IN-Wavenet-B', name: 'IN Wavenet B (M)', gender: 'Male', languageCodes: ['hi-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'hi-IN-Wavenet-C', name: 'IN Wavenet C (M)', gender: 'Male', languageCodes: ['hi-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'hi-IN-Wavenet-D', name: 'IN Wavenet D (F)', gender: 'Female', languageCodes: ['hi-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'hi-IN-Neural2-A', name: 'IN Neural2 A (F)', gender: 'Female', languageCodes: ['hi-IN'], voiceType: 'Neural2', status: 'GA' },
    { id: 'hi-IN-Neural2-B', name: 'IN Neural2 B (M)', gender: 'Male', languageCodes: ['hi-IN'], voiceType: 'Neural2', status: 'GA' },
    { id: 'hi-IN-Neural2-C', name: 'IN Neural2 C (M)', gender: 'Male', languageCodes: ['hi-IN'], voiceType: 'Neural2', status: 'GA' },
    { id: 'hi-IN-Neural2-D', name: 'IN Neural2 D (F)', gender: 'Female', languageCodes: ['hi-IN'], voiceType: 'Neural2', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `hi-IN-Chirp3-HD-${variant}`, name: `IN ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['hi-IN'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Hungarian (Hungary)
    { id: 'hu-HU-Standard-A', name: 'HU Standard A (F)', gender: 'Female', languageCodes: ['hu-HU'], voiceType: 'Standard', status: 'GA' },
    { id: 'hu-HU-Wavenet-A', name: 'HU Wavenet A (F)', gender: 'Female', languageCodes: ['hu-HU'], voiceType: 'WaveNet', status: 'GA' },

    // Icelandic (Iceland)
    { id: 'is-IS-Standard-A', name: 'IS Standard A (F)', gender: 'Female', languageCodes: ['is-IS'], voiceType: 'Standard', status: 'GA' },

    // Indonesian (Indonesia)
    { id: 'id-ID-Standard-A', name: 'ID Standard A (F)', gender: 'Female', languageCodes: ['id-ID'], voiceType: 'Standard', status: 'GA' },
    { id: 'id-ID-Standard-B', name: 'ID Standard B (M)', gender: 'Male', languageCodes: ['id-ID'], voiceType: 'Standard', status: 'GA' },
    { id: 'id-ID-Standard-C', name: 'ID Standard C (M)', gender: 'Male', languageCodes: ['id-ID'], voiceType: 'Standard', status: 'GA' },
    { id: 'id-ID-Standard-D', name: 'ID Standard D (F)', gender: 'Female', languageCodes: ['id-ID'], voiceType: 'Standard', status: 'GA' },
    { id: 'id-ID-Wavenet-A', name: 'ID Wavenet A (F)', gender: 'Female', languageCodes: ['id-ID'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'id-ID-Wavenet-B', name: 'ID Wavenet B (M)', gender: 'Male', languageCodes: ['id-ID'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'id-ID-Wavenet-C', name: 'ID Wavenet C (M)', gender: 'Male', languageCodes: ['id-ID'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'id-ID-Wavenet-D', name: 'ID Wavenet D (F)', gender: 'Female', languageCodes: ['id-ID'], voiceType: 'WaveNet', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `id-ID-Chirp3-HD-${variant}`, name: `ID ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['id-ID'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Italian (Italy)
    { id: 'it-IT-Standard-A', name: 'IT Standard A (F)', gender: 'Female', languageCodes: ['it-IT'], voiceType: 'Standard', status: 'GA' },
    { id: 'it-IT-Wavenet-A', name: 'IT Wavenet A (F)', gender: 'Female', languageCodes: ['it-IT'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'it-IT-Standard-B', name: 'IT Standard B (F)', gender: 'Female', languageCodes: ['it-IT'], voiceType: 'Standard', status: 'GA' },
    { id: 'it-IT-Standard-C', name: 'IT Standard C (M)', gender: 'Male', languageCodes: ['it-IT'], voiceType: 'Standard', status: 'GA' },
    { id: 'it-IT-Standard-D', name: 'IT Standard D (M)', gender: 'Male', languageCodes: ['it-IT'], voiceType: 'Standard', status: 'GA' },
    { id: 'it-IT-Wavenet-B', name: 'IT Wavenet B (F)', gender: 'Female', languageCodes: ['it-IT'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'it-IT-Wavenet-C', name: 'IT Wavenet C (M)', gender: 'Male', languageCodes: ['it-IT'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'it-IT-Wavenet-D', name: 'IT Wavenet D (M)', gender: 'Male', languageCodes: ['it-IT'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'it-IT-Neural2-A', name: 'IT Neural2 A (F)', gender: 'Female', languageCodes: ['it-IT'], voiceType: 'Neural2', status: 'GA' },
    { id: 'it-IT-Neural2-C', name: 'IT Neural2 C (M)', gender: 'Male', languageCodes: ['it-IT'], voiceType: 'Neural2', status: 'GA' },
    { id: 'it-IT-Polyglot-1', name: 'IT Polyglot 1 (M)', gender: 'Male', languageCodes: ['it-IT', 'de-DE', 'en-AU', 'en-US', 'es-ES', 'fr-FR', 'pt-BR'], voiceType: 'Polyglot', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `it-IT-Chirp3-HD-${variant}`, name: `IT ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['it-IT'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Japanese (Japan)
    { id: 'ja-JP-Standard-A', name: 'JP Standard A (F)', gender: 'Female', languageCodes: ['ja-JP'], voiceType: 'Standard', status: 'GA' },
    { id: 'ja-JP-Standard-B', name: 'JP Standard B (F)', gender: 'Female', languageCodes: ['ja-JP'], voiceType: 'Standard', status: 'GA' },
    { id: 'ja-JP-Standard-C', name: 'JP Standard C (M)', gender: 'Male', languageCodes: ['ja-JP'], voiceType: 'Standard', status: 'GA' },
    { id: 'ja-JP-Standard-D', name: 'JP Standard D (M)', gender: 'Male', languageCodes: ['ja-JP'], voiceType: 'Standard', status: 'GA' },
    { id: 'ja-JP-Wavenet-A', name: 'JP Wavenet A (F)', gender: 'Female', languageCodes: ['ja-JP'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ja-JP-Wavenet-B', name: 'JP Wavenet B (F)', gender: 'Female', languageCodes: ['ja-JP'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ja-JP-Wavenet-C', name: 'JP Wavenet C (M)', gender: 'Male', languageCodes: ['ja-JP'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ja-JP-Wavenet-D', name: 'JP Wavenet D (M)', gender: 'Male', languageCodes: ['ja-JP'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ja-JP-Neural2-B', name: 'JP Neural2 B (F)', gender: 'Female', languageCodes: ['ja-JP'], voiceType: 'Neural2', status: 'GA' },
    { id: 'ja-JP-Neural2-C', name: 'JP Neural2 C (M)', gender: 'Male', languageCodes: ['ja-JP'], voiceType: 'Neural2', status: 'GA' },
    { id: 'ja-JP-Neural2-D', name: 'JP Neural2 D (M)', gender: 'Male', languageCodes: ['ja-JP'], voiceType: 'Neural2', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `ja-JP-Chirp3-HD-${variant}`, name: `JP ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['ja-JP'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Kannada (India)
    { id: 'kn-IN-Standard-A', name: 'IN Standard A (F)', gender: 'Female', languageCodes: ['kn-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'kn-IN-Standard-B', name: 'IN Standard B (M)', gender: 'Male', languageCodes: ['kn-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'kn-IN-Wavenet-A', name: 'IN Wavenet A (F)', gender: 'Female', languageCodes: ['kn-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'kn-IN-Wavenet-B', name: 'IN Wavenet B (M)', gender: 'Male', languageCodes: ['kn-IN'], voiceType: 'WaveNet', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `kn-IN-Chirp3-HD-${variant}`, name: `IN ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['kn-IN'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Korean (South Korea)
    { id: 'ko-KR-Standard-A', name: 'KR Standard A (F)', gender: 'Female', languageCodes: ['ko-KR'], voiceType: 'Standard', status: 'GA' },
    { id: 'ko-KR-Standard-B', name: 'KR Standard B (F)', gender: 'Female', languageCodes: ['ko-KR'], voiceType: 'Standard', status: 'GA' },
    { id: 'ko-KR-Standard-C', name: 'KR Standard C (M)', gender: 'Male', languageCodes: ['ko-KR'], voiceType: 'Standard', status: 'GA' },
    { id: 'ko-KR-Standard-D', name: 'KR Standard D (M)', gender: 'Male', languageCodes: ['ko-KR'], voiceType: 'Standard', status: 'GA' },
    { id: 'ko-KR-Wavenet-A', name: 'KR Wavenet A (F)', gender: 'Female', languageCodes: ['ko-KR'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ko-KR-Wavenet-B', name: 'KR Wavenet B (F)', gender: 'Female', languageCodes: ['ko-KR'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ko-KR-Wavenet-C', name: 'KR Wavenet C (M)', gender: 'Male', languageCodes: ['ko-KR'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ko-KR-Wavenet-D', name: 'KR Wavenet D (M)', gender: 'Male', languageCodes: ['ko-KR'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ko-KR-Neural2-A', name: 'KR Neural2 A (F)', gender: 'Female', languageCodes: ['ko-KR'], voiceType: 'Neural2', status: 'GA' },
    { id: 'ko-KR-Neural2-B', name: 'KR Neural2 B (F)', gender: 'Female', languageCodes: ['ko-KR'], voiceType: 'Neural2', status: 'GA' },
    { id: 'ko-KR-Neural2-C', name: 'KR Neural2 C (M)', gender: 'Male', languageCodes: ['ko-KR'], voiceType: 'Neural2', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `ko-KR-Chirp3-HD-${variant}`, name: `KR ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['ko-KR'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Latvian (Latvia)
    { id: 'lv-LV-Standard-A', name: 'LV Standard A (M)', gender: 'Male', languageCodes: ['lv-LV'], voiceType: 'Standard', status: 'GA' },

    // Lithuanian (Lithuania)
    { id: 'lt-LT-Standard-A', name: 'LT Standard A (M)', gender: 'Male', languageCodes: ['lt-LT'], voiceType: 'Standard', status: 'GA' },

    // Malay (Malaysia)
    { id: 'ms-MY-Standard-A', name: 'MY Standard A (F)', gender: 'Female', languageCodes: ['ms-MY'], voiceType: 'Standard', status: 'GA' },
    { id: 'ms-MY-Standard-B', name: 'MY Standard B (M)', gender: 'Male', languageCodes: ['ms-MY'], voiceType: 'Standard', status: 'GA' },
    { id: 'ms-MY-Standard-C', name: 'MY Standard C (F)', gender: 'Female', languageCodes: ['ms-MY'], voiceType: 'Standard', status: 'GA' },
    { id: 'ms-MY-Standard-D', name: 'MY Standard D (M)', gender: 'Male', languageCodes: ['ms-MY'], voiceType: 'Standard', status: 'GA' },
    { id: 'ms-MY-Wavenet-A', name: 'MY Wavenet A (F)', gender: 'Female', languageCodes: ['ms-MY'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ms-MY-Wavenet-B', name: 'MY Wavenet B (M)', gender: 'Male', languageCodes: ['ms-MY'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ms-MY-Wavenet-C', name: 'MY Wavenet C (F)', gender: 'Female', languageCodes: ['ms-MY'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ms-MY-Wavenet-D', name: 'MY Wavenet D (M)', gender: 'Male', languageCodes: ['ms-MY'], voiceType: 'WaveNet', status: 'GA' },

    // Malayalam (India)
    { id: 'ml-IN-Standard-A', name: 'IN Standard A (F)', gender: 'Female', languageCodes: ['ml-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'ml-IN-Standard-B', name: 'IN Standard B (M)', gender: 'Male', languageCodes: ['ml-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'ml-IN-Wavenet-A', name: 'IN Wavenet A (F)', gender: 'Female', languageCodes: ['ml-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ml-IN-Wavenet-B', name: 'IN Wavenet B (M)', gender: 'Male', languageCodes: ['ml-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ml-IN-Wavenet-C', name: 'IN Wavenet C (F)', gender: 'Female', languageCodes: ['ml-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ml-IN-Wavenet-D', name: 'IN Wavenet D (M)', gender: 'Male', languageCodes: ['ml-IN'], voiceType: 'WaveNet', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `ml-IN-Chirp3-HD-${variant}`, name: `IN ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['ml-IN'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Mandarin Chinese (China)
    { id: 'cmn-CN-Standard-A', name: 'CN Standard A (F)', gender: 'Female', languageCodes: ['cmn-CN'], voiceType: 'Standard', status: 'GA' },
    { id: 'cmn-CN-Standard-B', name: 'CN Standard B (M)', gender: 'Male', languageCodes: ['cmn-CN'], voiceType: 'Standard', status: 'GA' },
    { id: 'cmn-CN-Standard-C', name: 'CN Standard C (M)', gender: 'Male', languageCodes: ['cmn-CN'], voiceType: 'Standard', status: 'GA' },
    { id: 'cmn-CN-Standard-D', name: 'CN Standard D (F)', gender: 'Female', languageCodes: ['cmn-CN'], voiceType: 'Standard', status: 'GA' },
    { id: 'cmn-CN-Wavenet-A', name: 'CN Wavenet A (F)', gender: 'Female', languageCodes: ['cmn-CN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'cmn-CN-Wavenet-B', name: 'CN Wavenet B (M)', gender: 'Male', languageCodes: ['cmn-CN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'cmn-CN-Wavenet-C', name: 'CN Wavenet C (M)', gender: 'Male', languageCodes: ['cmn-CN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'cmn-CN-Wavenet-D', name: 'CN Wavenet D (F)', gender: 'Female', languageCodes: ['cmn-CN'], voiceType: 'WaveNet', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `cmn-CN-Chirp3-HD-${variant}`, name: `CN ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['cmn-CN'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),
    
    // Mandarin Chinese (Taiwan)
    { id: 'cmn-TW-Standard-A', name: 'TW Standard A (F)', gender: 'Female', languageCodes: ['cmn-TW'], voiceType: 'Standard', status: 'GA' },
    { id: 'cmn-TW-Standard-B', name: 'TW Standard B (M)', gender: 'Male', languageCodes: ['cmn-TW'], voiceType: 'Standard', status: 'GA' },
    { id: 'cmn-TW-Standard-C', name: 'TW Standard C (M)', gender: 'Male', languageCodes: ['cmn-TW'], voiceType: 'Standard', status: 'GA' },
    { id: 'cmn-TW-Wavenet-A', name: 'TW Wavenet A (F)', gender: 'Female', languageCodes: ['cmn-TW'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'cmn-TW-Wavenet-B', name: 'TW Wavenet B (M)', gender: 'Male', languageCodes: ['cmn-TW'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'cmn-TW-Wavenet-C', name: 'TW Wavenet C (M)', gender: 'Male', languageCodes: ['cmn-TW'], voiceType: 'WaveNet', status: 'GA' },

    // Marathi (India)
    { id: 'mr-IN-Standard-A', name: 'IN Standard A (F)', gender: 'Female', languageCodes: ['mr-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'mr-IN-Standard-B', name: 'IN Standard B (M)', gender: 'Male', languageCodes: ['mr-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'mr-IN-Standard-C', name: 'IN Standard C (F)', gender: 'Female', languageCodes: ['mr-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'mr-IN-Wavenet-A', name: 'IN Wavenet A (F)', gender: 'Female', languageCodes: ['mr-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'mr-IN-Wavenet-B', name: 'IN Wavenet B (M)', gender: 'Male', languageCodes: ['mr-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'mr-IN-Wavenet-C', name: 'IN Wavenet C (F)', gender: 'Female', languageCodes: ['mr-IN'], voiceType: 'WaveNet', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `mr-IN-Chirp3-HD-${variant}`, name: `IN ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['mr-IN'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Norwegian (Bokmål) (Norway)
    { id: 'nb-NO-Standard-A', name: 'NO Standard A (F)', gender: 'Female', languageCodes: ['nb-NO'], voiceType: 'Standard', status: 'GA' },
    { id: 'nb-NO-Standard-B', name: 'NO Standard B (M)', gender: 'Male', languageCodes: ['nb-NO'], voiceType: 'Standard', status: 'GA' },
    { id: 'nb-NO-Standard-C', name: 'NO Standard C (F)', gender: 'Female', languageCodes: ['nb-NO'], voiceType: 'Standard', status: 'GA' },
    { id: 'nb-NO-Standard-D', name: 'NO Standard D (M)', gender: 'Male', languageCodes: ['nb-NO'], voiceType: 'Standard', status: 'GA' },
    { id: 'nb-NO-Wavenet-A', name: 'NO Wavenet A (F)', gender: 'Female', languageCodes: ['nb-NO'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'nb-NO-Wavenet-B', name: 'NO Wavenet B (M)', gender: 'Male', languageCodes: ['nb-NO'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'nb-NO-Wavenet-C', name: 'NO Wavenet C (F)', gender: 'Female', languageCodes: ['nb-NO'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'nb-NO-Wavenet-D', name: 'NO Wavenet D (M)', gender: 'Male', languageCodes: ['nb-NO'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'nb-no-Wavenet-E', name: 'NO Wavenet E (F)', gender: 'Female', languageCodes: ['nb-NO'], voiceType: 'WaveNet', status: 'GA' },

    // Polish (Poland)
    { id: 'pl-PL-Standard-A', name: 'PL Standard A (F)', gender: 'Female', languageCodes: ['pl-PL'], voiceType: 'Standard', status: 'GA' },
    { id: 'pl-PL-Standard-B', name: 'PL Standard B (M)', gender: 'Male', languageCodes: ['pl-PL'], voiceType: 'Standard', status: 'GA' },
    { id: 'pl-PL-Standard-C', name: 'PL Standard C (M)', gender: 'Male', languageCodes: ['pl-PL'], voiceType: 'Standard', status: 'GA' },
    { id: 'pl-PL-Standard-D', name: 'PL Standard D (F)', gender: 'Female', languageCodes: ['pl-PL'], voiceType: 'Standard', status: 'GA' },
    { id: 'pl-PL-Standard-E', name: 'PL Standard E (F)', gender: 'Female', languageCodes: ['pl-PL'], voiceType: 'Standard', status: 'GA' },
    { id: 'pl-PL-Wavenet-A', name: 'PL Wavenet A (F)', gender: 'Female', languageCodes: ['pl-PL'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'pl-PL-Wavenet-B', name: 'PL Wavenet B (M)', gender: 'Male', languageCodes: ['pl-PL'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'pl-PL-Wavenet-C', name: 'PL Wavenet C (M)', gender: 'Male', languageCodes: ['pl-PL'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'pl-PL-Wavenet-D', name: 'PL Wavenet D (F)', gender: 'Female', languageCodes: ['pl-PL'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'pl-PL-Wavenet-E', name: 'PL Wavenet E (F)', gender: 'Female', languageCodes: ['pl-PL'], voiceType: 'WaveNet', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `pl-PL-Chirp3-HD-${variant}`, name: `PL ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['pl-PL'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Portuguese (Brazil)
    { id: 'pt-BR-Standard-A', name: 'BR Standard A (F)', gender: 'Female', languageCodes: ['pt-BR'], voiceType: 'Standard', status: 'GA' },
    { id: 'pt-BR-Wavenet-A', name: 'BR Wavenet A (F)', gender: 'Female', languageCodes: ['pt-BR'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'pt-BR-Standard-B', name: 'BR Standard B (M)', gender: 'Male', languageCodes: ['pt-BR'], voiceType: 'Standard', status: 'GA' },
    { id: 'pt-BR-Standard-C', name: 'BR Standard C (F)', gender: 'Female', languageCodes: ['pt-BR'], voiceType: 'Standard', status: 'GA' },
    { id: 'pt-BR-Wavenet-B', name: 'BR Wavenet B (M)', gender: 'Male', languageCodes: ['pt-BR'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'pt-BR-Wavenet-C', name: 'BR Wavenet C (F)', gender: 'Female', languageCodes: ['pt-BR'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'pt-BR-Neural2-A', name: 'BR Neural2 A (F)', gender: 'Female', languageCodes: ['pt-BR'], voiceType: 'Neural2', status: 'GA' },
    { id: 'pt-BR-Neural2-B', name: 'BR Neural2 B (M)', gender: 'Male', languageCodes: ['pt-BR'], voiceType: 'Neural2', status: 'GA' },
    { id: 'pt-BR-Neural2-C', name: 'BR Neural2 C (F)', gender: 'Female', languageCodes: ['pt-BR'], voiceType: 'Neural2', status: 'GA' },
    { id: 'pt-BR-Polyglot-1', name: 'BR Polyglot 1 (M)', gender: 'Male', languageCodes: ['pt-BR', 'de-DE', 'en-AU', 'en-US', 'es-ES', 'fr-FR', 'it-IT'], voiceType: 'Polyglot', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `pt-BR-Chirp3-HD-${variant}`, name: `BR ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['pt-BR'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Portuguese (Portugal)
    { id: 'pt-PT-Standard-A', name: 'PT Standard A (F)', gender: 'Female', languageCodes: ['pt-PT'], voiceType: 'Standard', status: 'GA' },
    { id: 'pt-PT-Standard-B', name: 'PT Standard B (M)', gender: 'Male', languageCodes: ['pt-PT'], voiceType: 'Standard', status: 'GA' },
    { id: 'pt-PT-Standard-C', name: 'PT Standard C (M)', gender: 'Male', languageCodes: ['pt-PT'], voiceType: 'Standard', status: 'GA' },
    { id: 'pt-PT-Standard-D', name: 'PT Standard D (F)', gender: 'Female', languageCodes: ['pt-PT'], voiceType: 'Standard', status: 'GA' },
    { id: 'pt-PT-Wavenet-A', name: 'PT Wavenet A (F)', gender: 'Female', languageCodes: ['pt-PT'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'pt-PT-Wavenet-B', name: 'PT Wavenet B (M)', gender: 'Male', languageCodes: ['pt-PT'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'pt-PT-Wavenet-C', name: 'PT Wavenet C (M)', gender: 'Male', languageCodes: ['pt-PT'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'pt-PT-Wavenet-D', name: 'PT Wavenet D (F)', gender: 'Female', languageCodes: ['pt-PT'], voiceType: 'WaveNet', status: 'GA' },

    // Punjabi (India)
    { id: 'pa-IN-Standard-A', name: 'IN Standard A (F)', gender: 'Female', languageCodes: ['pa-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'pa-IN-Standard-B', name: 'IN Standard B (M)', gender: 'Male', languageCodes: ['pa-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'pa-IN-Standard-C', name: 'IN Standard C (F)', gender: 'Female', languageCodes: ['pa-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'pa-IN-Standard-D', name: 'IN Standard D (M)', gender: 'Male', languageCodes: ['pa-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'pa-IN-Wavenet-A', name: 'IN Wavenet A (F)', gender: 'Female', languageCodes: ['pa-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'pa-IN-Wavenet-B', name: 'IN Wavenet B (M)', gender: 'Male', languageCodes: ['pa-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'pa-IN-Wavenet-C', name: 'IN Wavenet C (F)', gender: 'Female', languageCodes: ['pa-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'pa-IN-Wavenet-D', name: 'IN Wavenet D (M)', gender: 'Male', languageCodes: ['pa-IN'], voiceType: 'WaveNet', status: 'GA' },

    // Romanian (Romania)
    { id: 'ro-RO-Standard-A', name: 'RO Standard A (F)', gender: 'Female', languageCodes: ['ro-RO'], voiceType: 'Standard', status: 'GA' },
    { id: 'ro-RO-Wavenet-A', name: 'RO Wavenet A (F)', gender: 'Female', languageCodes: ['ro-RO'], voiceType: 'WaveNet', status: 'GA' },
    
    // Russian (Russia)
    { id: 'ru-RU-Standard-A', name: 'RU Standard A (F)', gender: 'Female', languageCodes: ['ru-RU'], voiceType: 'Standard', status: 'GA' },
    { id: 'ru-RU-Standard-B', name: 'RU Standard B (M)', gender: 'Male', languageCodes: ['ru-RU'], voiceType: 'Standard', status: 'GA' },
    { id: 'ru-RU-Standard-C', name: 'RU Standard C (F)', gender: 'Female', languageCodes: ['ru-RU'], voiceType: 'Standard', status: 'GA' },
    { id: 'ru-RU-Standard-D', name: 'RU Standard D (M)', gender: 'Male', languageCodes: ['ru-RU'], voiceType: 'Standard', status: 'GA' },
    { id: 'ru-RU-Standard-E', name: 'RU Standard E (F)', gender: 'Female', languageCodes: ['ru-RU'], voiceType: 'Standard', status: 'GA' },
    { id: 'ru-RU-Wavenet-A', name: 'RU Wavenet A (F)', gender: 'Female', languageCodes: ['ru-RU'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ru-RU-Wavenet-B', name: 'RU Wavenet B (M)', gender: 'Male', languageCodes: ['ru-RU'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ru-RU-Wavenet-C', name: 'RU Wavenet C (F)', gender: 'Female', languageCodes: ['ru-RU'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ru-RU-Wavenet-D', name: 'RU Wavenet D (M)', gender: 'Male', languageCodes: ['ru-RU'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ru-RU-Wavenet-E', name: 'RU Wavenet E (F)', gender: 'Female', languageCodes: ['ru-RU'], voiceType: 'WaveNet', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `ru-RU-Chirp3-HD-${variant}`, name: `RU ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['ru-RU'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),
    
    // Serbian (Cyrillic)
    { id: 'sr-RS-Standard-A', name: 'RS Standard A (F)', gender: 'Female', languageCodes: ['sr-RS'], voiceType: 'Standard', status: 'GA' },

    // Slovak (Slovakia)
    { id: 'sk-SK-Standard-A', name: 'SK Standard A (F)', gender: 'Female', languageCodes: ['sk-SK'], voiceType: 'Standard', status: 'GA' },
    { id: 'sk-SK-Wavenet-A', name: 'SK Wavenet A (F)', gender: 'Female', languageCodes: ['sk-SK'], voiceType: 'WaveNet', status: 'GA' },

    // Spanish (Spain)
    { id: 'es-ES-Standard-A', name: 'ES Standard A (F)', gender: 'Female', languageCodes: ['es-ES'], voiceType: 'Standard', status: 'GA' },
    { id: 'es-ES-Wavenet-B', name: 'ES Wavenet B (M)', gender: 'Male', languageCodes: ['es-ES'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'es-ES-Wavenet-C', name: 'ES Wavenet C (F)', gender: 'Female', languageCodes: ['es-ES'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'es-ES-Wavenet-D', name: 'ES Wavenet D (F)', gender: 'Female', languageCodes: ['es-ES'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'es-ES-Neural2-A', name: 'ES Neural2 A (F)', gender: 'Female', languageCodes: ['es-ES'], voiceType: 'Neural2', status: 'GA' },
    { id: 'es-ES-Neural2-B', name: 'ES Neural2 B (M)', gender: 'Male', languageCodes: ['es-ES'], voiceType: 'Neural2', status: 'GA' },
    { id: 'es-ES-Neural2-C', name: 'ES Neural2 C (F)', gender: 'Female', languageCodes: ['es-ES'], voiceType: 'Neural2', status: 'GA' },
    { id: 'es-ES-Neural2-D', name: 'ES Neural2 D (F)', gender: 'Female', languageCodes: ['es-ES'], voiceType: 'Neural2', status: 'GA' },
    { id: 'es-ES-Neural2-E', name: 'ES Neural2 E (F)', gender: 'Female', languageCodes: ['es-ES'], voiceType: 'Neural2', status: 'GA' },
    { id: 'es-ES-Neural2-F', name: 'ES Neural2 F (M)', gender: 'Male', languageCodes: ['es-ES'], voiceType: 'Neural2', status: 'GA' },
    { id: 'es-ES-Polyglot-1', name: 'ES Polyglot 1 (M)', gender: 'Male', languageCodes: ['es-ES', 'de-DE', 'en-AU', 'en-US', 'fr-FR', 'it-IT', 'pt-BR'], voiceType: 'Polyglot', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `es-ES-Chirp3-HD-${variant}`, name: `ES ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['es-ES'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Spanish (US)
    { id: 'es-US-Standard-A', name: 'US Standard A (F)', gender: 'Female', languageCodes: ['es-US'], voiceType: 'Standard', status: 'GA' },
    { id: 'es-US-Standard-B', name: 'US Standard B (M)', gender: 'Male', languageCodes: ['es-US'], voiceType: 'Standard', status: 'GA' },
    { id: 'es-US-Standard-C', name: 'US Standard C (M)', gender: 'Male', languageCodes: ['es-US'], voiceType: 'Standard', status: 'GA' },
    { id: 'es-US-Wavenet-A', name: 'US Wavenet A (F)', gender: 'Female', languageCodes: ['es-US'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'es-US-Wavenet-B', name: 'US Wavenet B (M)', gender: 'Male', languageCodes: ['es-US'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'es-US-Wavenet-C', name: 'US Wavenet C (M)', gender: 'Male', languageCodes: ['es-US'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'es-US-Neural2-A', name: 'US Neural2 A (F)', gender: 'Female', languageCodes: ['es-US'], voiceType: 'Neural2', status: 'GA' },
    { id: 'es-US-Neural2-B', name: 'US Neural2 B (M)', gender: 'Male', languageCodes: ['es-US'], voiceType: 'Neural2', status: 'GA' },
    { id: 'es-US-Neural2-C', name: 'US Neural2 C (M)', gender: 'Male', languageCodes: ['es-US'], voiceType: 'Neural2', status: 'GA' },
    { id: 'es-US-News-D', name: 'US News D (M)', gender: 'Male', languageCodes: ['es-US'], voiceType: 'Studio (News)', status: 'GA' },
    { id: 'es-US-News-E', name: 'US News E (F)', gender: 'Female', languageCodes: ['es-US'], voiceType: 'Studio (News)', status: 'GA' },
    { id: 'es-US-News-F', name: 'US News F (F)', gender: 'Female', languageCodes: ['es-US'], voiceType: 'Studio (News)', status: 'GA' },
    { id: 'es-US-News-G', name: 'US News G (M)', gender: 'Male', languageCodes: ['es-US'], voiceType: 'Studio (News)', status: 'GA' },
    { id: 'es-US-Studio-B', name: 'US Studio B (M)', gender: 'Male', languageCodes: ['es-US'], voiceType: 'Studio', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `es-US-Chirp3-HD-${variant}`, name: `US ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['es-US'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),
    
    // Swahili (Kenya)
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `sw-KE-Chirp3-HD-${variant}`, name: `KE ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['sw-KE'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),
    
    // Swedish (Sweden)
    { id: 'sv-SE-Standard-A', name: 'SE Standard A (F)', gender: 'Female', languageCodes: ['sv-SE'], voiceType: 'Standard', status: 'GA' },
    { id: 'sv-SE-Wavenet-A', name: 'SE Wavenet A (F)', gender: 'Female', languageCodes: ['sv-SE'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'sv-SE-Wavenet-B', name: 'SE Wavenet B (M)', gender: 'Male', languageCodes: ['sv-SE'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'sv-SE-Wavenet-C', name: 'SE Wavenet C (F)', gender: 'Female', languageCodes: ['sv-SE'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'sv-SE-Wavenet-D', name: 'SE Wavenet D (F)', gender: 'Female', languageCodes: ['sv-SE'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'sv-SE-Wavenet-E', name: 'SE Wavenet E (M)', gender: 'Male', languageCodes: ['sv-SE'], voiceType: 'WaveNet', status: 'GA' },

    // Tamil (India)
    { id: 'ta-IN-Standard-A', name: 'IN Standard A (F)', gender: 'Female', languageCodes: ['ta-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'ta-IN-Standard-B', name: 'IN Standard B (M)', gender: 'Male', languageCodes: ['ta-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'ta-IN-Standard-C', name: 'IN Standard C (F)', gender: 'Female', languageCodes: ['ta-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'ta-IN-Standard-D', name: 'IN Standard D (M)', gender: 'Male', languageCodes: ['ta-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'ta-IN-Wavenet-A', name: 'IN Wavenet A (F)', gender: 'Female', languageCodes: ['ta-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ta-IN-Wavenet-B', name: 'IN Wavenet B (M)', gender: 'Male', languageCodes: ['ta-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ta-IN-Wavenet-C', name: 'IN Wavenet C (F)', gender: 'Female', languageCodes: ['ta-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'ta-IN-Wavenet-D', name: 'IN Wavenet D (M)', gender: 'Male', languageCodes: ['ta-IN'], voiceType: 'WaveNet', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `ta-IN-Chirp3-HD-${variant}`, name: `IN ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['ta-IN'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Telugu (India)
    { id: 'te-IN-Standard-A', name: 'IN Standard A (F)', gender: 'Female', languageCodes: ['te-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'te-IN-Standard-B', name: 'IN Standard B (M)', gender: 'Male', languageCodes: ['te-IN'], voiceType: 'Standard', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `te-IN-Chirp3-HD-${variant}`, name: `IN ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['te-IN'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),
    
    // Thai (Thailand)
    { id: 'th-TH-Standard-A', name: 'TH Standard A (F)', gender: 'Female', languageCodes: ['th-TH'], voiceType: 'Standard', status: 'GA' },
    { id: 'th-TH-Neural2-C', name: 'TH Neural2 C (F)', gender: 'Female', languageCodes: ['th-TH'], voiceType: 'Neural2', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `th-TH-Chirp3-HD-${variant}`, name: `TH ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['th-TH'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),
    
    // Turkish (Turkey)
    { id: 'tr-TR-Standard-A', name: 'TR Standard A (F)', gender: 'Female', languageCodes: ['tr-TR'], voiceType: 'Standard', status: 'GA' },
    { id: 'tr-TR-Standard-B', name: 'TR Standard B (M)', gender: 'Male', languageCodes: ['tr-TR'], voiceType: 'Standard', status: 'GA' },
    { id: 'tr-TR-Standard-C', name: 'TR Standard C (F)', gender: 'Female', languageCodes: ['tr-TR'], voiceType: 'Standard', status: 'GA' },
    { id: 'tr-TR-Standard-D', name: 'TR Standard D (F)', gender: 'Female', languageCodes: ['tr-TR'], voiceType: 'Standard', status: 'GA' },
    { id: 'tr-TR-Standard-E', name: 'TR Standard E (M)', gender: 'Male', languageCodes: ['tr-TR'], voiceType: 'Standard', status: 'GA' },
    { id: 'tr-TR-Wavenet-A', name: 'TR Wavenet A (F)', gender: 'Female', languageCodes: ['tr-TR'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'tr-TR-Wavenet-B', name: 'TR Wavenet B (M)', gender: 'Male', languageCodes: ['tr-TR'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'tr-TR-Wavenet-C', name: 'TR Wavenet C (F)', gender: 'Female', languageCodes: ['tr-TR'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'tr-TR-Wavenet-D', name: 'TR Wavenet D (F)', gender: 'Female', languageCodes: ['tr-TR'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'tr-TR-Wavenet-E', name: 'TR Wavenet E (M)', gender: 'Male', languageCodes: ['tr-TR'], voiceType: 'WaveNet', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `tr-TR-Chirp3-HD-${variant}`, name: `TR ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['tr-TR'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),
    
    // Ukrainian (Ukraine)
    { id: 'uk-UA-Standard-A', name: 'UA Standard A (F)', gender: 'Female', languageCodes: ['uk-UA'], voiceType: 'Standard', status: 'GA' },
    { id: 'uk-UA-Wavenet-A', name: 'UA Wavenet A (F)', gender: 'Female', languageCodes: ['uk-UA'], voiceType: 'WaveNet', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `uk-UA-Chirp3-HD-${variant}`, name: `UA ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['uk-UA'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),
    
    // Urdu (India)
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `ur-IN-Chirp3-HD-${variant}`, name: `IN ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['ur-IN'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // Vietnamese (Vietnam)
    { id: 'vi-VN-Standard-A', name: 'VN Standard A (F)', gender: 'Female', languageCodes: ['vi-VN'], voiceType: 'Standard', status: 'GA' },
    { id: 'vi-VN-Standard-B', name: 'VN Standard B (M)', gender: 'Male', languageCodes: ['vi-VN'], voiceType: 'Standard', status: 'GA' },
    { id: 'vi-VN-Standard-C', name: 'VN Standard C (F)', gender: 'Female', languageCodes: ['vi-VN'], voiceType: 'Standard', status: 'GA' },
    { id: 'vi-VN-Standard-D', name: 'VN Standard D (M)', gender: 'Male', languageCodes: ['vi-VN'], voiceType: 'Standard', status: 'GA' },
    { id: 'vi-VN-Wavenet-A', name: 'VN Wavenet A (F)', gender: 'Female', languageCodes: ['vi-VN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'vi-VN-Wavenet-B', name: 'VN Wavenet B (M)', gender: 'Male', languageCodes: ['vi-VN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'vi-VN-Wavenet-C', name: 'VN Wavenet C (F)', gender: 'Female', languageCodes: ['vi-VN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'vi-VN-Wavenet-D', name: 'VN Wavenet D (M)', gender: 'Male', languageCodes: ['vi-VN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'vi-VN-Neural2-A', name: 'VN Neural2 A (F)', gender: 'Female', languageCodes: ['vi-VN'], voiceType: 'Neural2', status: 'GA' },
    { id: 'vi-VN-Neural2-D', name: 'VN Neural2 D (M)', gender: 'Male', languageCodes: ['vi-VN'], voiceType: 'Neural2', status: 'GA' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `vi-VN-Chirp3-HD-${variant}`, name: `VN ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['vi-VN'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),
];


// --- Interface for free tier information ---
interface FreeTierInfo {
    available: boolean;
    note: string | ((t: TranslationKeys) => string);
}

// --- Interface for specific TTS model details within a provider ---
export interface TTSModelDetail {
    id: string;
    apiModelId: string;
    name: string;
    description: string;
    pricingText: string | ((t: TranslationKeys) => string);
    voiceFilterCriteria?: (voice: TTSVoice) => boolean;
    supportedLanguages?: string[]; // BCP-47 or ISO 639-1 codes
    inputLimitType?: 'tokens' | 'characters' | 'bytes'; // Optional: How the input limit is measured
    inputLimitValue?: number; // Optional: The maximum allowed per request
    freeTier?: FreeTierInfo; // Optional: Information about free tier availability
}

// --- TTS Provider Interface ---
export interface TTSProviderInfo {
    id: 'openai' | 'google-cloud' | 'elevenlabs' | 'google-gemini' | 'browser';
    name: string;
    requiresOwnKey: boolean;
    apiKeyId?: string;
    models: TTSModelDetail[];
    availableVoices: TTSVoice[];
}

// --- Helper Functions ---
export function getTTSProviderInfoById(id: TTSProviderInfo['id']): TTSProviderInfo | undefined {
    return AVAILABLE_TTS_PROVIDERS.find(p => p.id === id);
}
export function getVoicesForProvider(providerId: TTSProviderInfo['id']): TTSVoice[] {
    const provider = getTTSProviderInfoById(providerId);
    return provider ? provider.availableVoices : [];
}
export function getVoiceById(providerId: TTSProviderInfo['id'], voiceId: string): TTSVoice | undefined {
    const voices = getVoicesForProvider(providerId);
    return voices.find(v => v.id === voiceId);
}
export function getDefaultVoiceForProvider(providerId: TTSProviderInfo['id']): TTSVoice | null {
    const provider = getTTSProviderInfoById(providerId);
    if (!provider) return null;
    
    if (providerId === 'openai') {
        return provider.availableVoices.length > 0 ? provider.availableVoices[0] : null;
    }
    
    if (providerId === 'google-cloud') {
        const preferredGoogleDefault = provider.availableVoices.find(v => v.id === 'en-US-Wavenet-A');
        if (preferredGoogleDefault) return preferredGoogleDefault;
        // Fallback to the first available English voice if the preferred default isn't there
        const firstEnglish = provider.availableVoices.find(v => v.languageCodes?.includes('en-US'));
        if (firstEnglish) return firstEnglish;
        return provider.availableVoices.length > 0 ? provider.availableVoices[0] : null;
    }
    
    if (providerId === 'elevenlabs') {
        // Rachel is a good default - professional female voice
        const preferredElevenLabsDefault = provider.availableVoices.find(v => v.id === '21m00Tcm4TlvDq8ikWAM'); // Rachel
        if (preferredElevenLabsDefault) return preferredElevenLabsDefault;
        return provider.availableVoices.length > 0 ? provider.availableVoices[0] : null;
    }
    if (providerId === 'google-gemini') {
        // Default to the first voice in its list, e.g., Achernar or as specified by user preference later
        return provider.availableVoices.length > 0 ? provider.availableVoices[0] : null;
    }
    
    return provider.availableVoices.length > 0 ? provider.availableVoices[0] : null;
}
export function getTTSModelDetailByAppId(appModelId: string): { provider: TTSProviderInfo, model: TTSModelDetail } | undefined {
    for (const provider of AVAILABLE_TTS_PROVIDERS) {
        const foundModel = provider.models.find(m => m.id === appModelId);
        if (foundModel) {
            return { provider, model: foundModel };
        }
    }
    return undefined;
}
export function getTTSModelDetailByApiModelId(apiModelId: string): { provider: TTSProviderInfo, model: TTSModelDetail } | undefined {
    for (const provider of AVAILABLE_TTS_PROVIDERS) {
        const foundModel = provider.models.find(m => m.apiModelId === apiModelId);
        if (foundModel) {
            return { provider, model: foundModel };
        }
    }
    return undefined;
}

export function isTTSModelLanguageSupported(
    appModelId: string, // e.g., 'openai-tts-1'
    languageCode: string // BCP-47 or a simple 2-letter code like 'en'
): boolean {
    const ttsModelInfo = getTTSModelDetailByAppId(appModelId);
    if (!ttsModelInfo || !ttsModelInfo.model.supportedLanguages) {
        // If supportedLanguages is not defined for a model, assume it's not supported for the specific language check.
        return false;
    }
    
    // Handle cases where languageCode is just the 2-letter part (e.g., 'en')
    const simpleLanguageCode = languageCode.split('-')[0];

    return ttsModelInfo.model.supportedLanguages.some(supportedLang => {
        // Direct match (e.g., 'en-US' === 'en-US' or 'fr' === 'fr')
        if (supportedLang === languageCode) return true;
        
        // Match the simple part of the language code (e.g., 'en-US'.startsWith('en-'))
        if (supportedLang.startsWith(`${simpleLanguageCode}-`)) return true;

        // In case the supported language is simple ('en') and the code is specific ('en-US')
        if (languageCode.startsWith(`${supportedLang}-`)) return true;

        // Match simple codes to each other
        if (supportedLang === simpleLanguageCode) return true;

        return false;
    });
}

// --- AVAILABLE TTS PROVIDERS & VOICES --- (MOVED TO THE END)
export const AVAILABLE_TTS_PROVIDERS: TTSProviderInfo[] = [
    {
        id: 'openai',
        name: 'OpenAI',
        requiresOwnKey: false,
        apiKeyId: 'openai',
        models: [
            {
                id: 'openai-gpt-4o-mini-tts',
                apiModelId: 'gpt-4o-mini-tts',
                name: 'GPT-4o mini TTS',
                description: 'Newest and most reliable model for intelligent realtime applications. Can be prompted for accent, emotion, intonation, speed, tone, etc.',
                pricingText: (t: TranslationKeys) => `${t.pricing.tts.openAIMini.textTokens.replace('{price}', '$0.60')} ${t.pricing.tts.plusSign} ${t.pricing.tts.openAIMini.audioTokens.replace('$12.00', '{price}').replace('{price}', '$12.00')}`,
                supportedLanguages: ['af', 'ar', 'hy', 'az', 'be', 'bs', 'bg', 'ca', 'zh', 'hr', 'cs', 'da', 'nl', 'en', 'et', 'fi', 'fr', 'gl', 'de', 'el', 'he', 'hi', 'hu', 'is', 'id', 'it', 'ja', 'kn', 'kk', 'ko', 'lv', 'lt', 'mk', 'ms', 'mr', 'mi', 'ne', 'no', 'fa', 'pl', 'pt', 'ro', 'ru', 'sr', 'sk', 'sl', 'es', 'sw', 'sv', 'tl', 'ta', 'th', 'tr', 'uk', 'ur', 'vi', 'cy'],
                inputLimitType: 'tokens',
                inputLimitValue: 2000,
            },
            {
                id: 'openai-tts-1',
                apiModelId: 'tts-1',
                name: 'TTS-1',
                description: 'Standard TTS model with improved quality and stability.',
                pricingText: (t: TranslationKeys) => t.pricing.tts.openAITTS1.standard.replace('{price}', '$15.00'),
                supportedLanguages: ['af', 'ar', 'hy', 'az', 'be', 'bs', 'bg', 'ca', 'zh', 'hr', 'cs', 'da', 'nl', 'en', 'et', 'fi', 'fr', 'gl', 'de', 'el', 'he', 'hi', 'hu', 'is', 'id', 'it', 'ja', 'kn', 'kk', 'ko', 'lv', 'lt', 'mk', 'ms', 'mr', 'mi', 'ne', 'no', 'fa', 'pl', 'pt', 'ro', 'ru', 'sr', 'sk', 'sl', 'es', 'sw', 'sv', 'tl', 'ta', 'th', 'tr', 'uk', 'ur', 'vi', 'cy'],
                inputLimitType: 'characters',
                inputLimitValue: 4096,
            },
            {
                id: 'openai-tts-1-hd',
                apiModelId: 'tts-1-hd',
                name: 'TTS-1 HD',
                description: 'Higher quality TTS model with better voice quality and naturalness.',
                pricingText: (t: TranslationKeys) => t.pricing.tts.openAITTS1HD.standard.replace('{price}', '$30.00'),
                supportedLanguages: ['af', 'ar', 'hy', 'az', 'be', 'bs', 'bg', 'ca', 'zh', 'hr', 'cs', 'da', 'nl', 'en', 'et', 'fi', 'fr', 'gl', 'de', 'el', 'he', 'hi', 'hu', 'is', 'id', 'it', 'ja', 'kn', 'kk', 'ko', 'lv', 'lt', 'mk', 'ms', 'mr', 'mi', 'ne', 'no', 'fa', 'pl', 'pt', 'ro', 'ru', 'sr', 'sk', 'sl', 'es', 'sw', 'sv', 'tl', 'ta', 'th', 'tr', 'uk', 'ur', 'vi', 'cy'],
                inputLimitType: 'characters',
                inputLimitValue: 4096,
            },
        ],
        availableVoices: OPENAI_TTS_VOICES,
    },
    {
        id: 'google-cloud',
        name: 'Google Cloud TTS',
        requiresOwnKey: true,
        apiKeyId: 'google_ai',
        models: [
            {
                id: 'google-standard-voices',
                apiModelId: 'google-standard',
                name: 'Standard Voices',
                description: 'Cost-effective voices for general use.',
                pricingText: (t: TranslationKeys) => t.pricing.tts.googleCloud.standard.replace('{price}', '$4.00'),
                voiceFilterCriteria: (voice) => voice.voiceType === 'Standard',
                supportedLanguages: ['af-ZA', 'ar-XA', 'bg-BG', 'bn-IN', 'ca-ES', 'cmn-CN', 'cmn-TW', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en-AU', 'en-GB', 'en-IN', 'en-US', 'es-ES', 'eu-ES', 'fil-PH', 'fi-FI', 'fr-CA', 'fr-FR', 'gl-ES', 'gu-IN', 'he-IL', 'hi-IN', 'hu-HU', 'id-ID', 'is-IS', 'it-IT', 'ja-JP', 'kn-IN', 'ko-KR', 'lt-LT', 'lv-LV', 'ml-IN', 'mr-IN', 'ms-MY', 'nb-NO', 'nl-BE', 'nl-NL', 'pa-IN', 'pl-PL', 'pt-BR', 'pt-PT', 'ro-RO', 'ru-RU', 'sk-SK', 'sr-RS', 'sv-SE', 'ta-IN', 'te-IN', 'th-TH', 'tr-TR', 'uk-UA', 'vi-VN', 'yue-HK'],
                inputLimitType: 'bytes',
                inputLimitValue: 5000,
            },
            {
                id: 'google-wavenet-voices',
                apiModelId: 'google-wavenet',
                name: 'WaveNet Voices',
                description: 'High-quality, natural-sounding voices.',
                pricingText: (t: TranslationKeys) => t.pricing.tts.googleCloud.neural.replace('{price}', '$16.00'),
                voiceFilterCriteria: (voice) => voice.voiceType === 'WaveNet',
                supportedLanguages: ['ar-XA', 'bn-IN', 'cmn-CN', 'cmn-TW', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en-AU', 'en-GB', 'en-IN', 'en-US', 'fil-PH', 'fi-FI', 'fr-CA', 'fr-FR', 'gu-IN', 'he-IL', 'hi-IN', 'hu-HU', 'id-ID', 'it-IT', 'ja-JP', 'kn-IN', 'ko-KR', 'ml-IN', 'mr-IN', 'ms-MY', 'nb-NO', 'nl-BE', 'nl-NL', 'pa-IN', 'pl-PL', 'pt-BR', 'pt-PT', 'ro-RO', 'ru-RU', 'sk-SK', 'sv-SE', 'ta-IN', 'tr-TR', 'uk-UA', 'vi-VN'],
                inputLimitType: 'bytes',
                inputLimitValue: 5000,
            },
            {
                id: 'google-neural2-voices',
                apiModelId: 'google-neural2',
                name: 'Neural2 Voices',
                description: 'Advanced Neural2 voices for general purpose.',
                pricingText: (t: TranslationKeys) => t.pricing.tts.googleCloud.neural.replace('{price}', '$16.00'),
                voiceFilterCriteria: (voice) => voice.voiceType === 'Neural2',
                supportedLanguages: ['de-DE', 'en-AU', 'en-GB', 'en-IN', 'en-US', 'es-ES', 'es-US', 'fil-PH', 'fr-CA', 'fr-FR', 'hi-IN', 'it-IT', 'ja-JP', 'ko-KR', 'pt-BR', 'th-TH', 'vi-VN'],
                inputLimitType: 'bytes',
                inputLimitValue: 5000,
            },
            {
                id: 'google-casual-voices',
                apiModelId: 'google-casual',
                name: 'Casual Voices (Neural2)',
                description: 'Neural2 voices with a casual speaking style.',
                pricingText: (t: TranslationKeys) => t.pricing.tts.googleCloud.neural.replace('{price}', '$16.00'),
                voiceFilterCriteria: (voice) => voice.voiceType === 'Neural2 (Casual)',
                supportedLanguages: ['en-US'],
                inputLimitType: 'bytes',
                inputLimitValue: 5000,
            },
            {
                id: 'google-polyglot-voices',
                apiModelId: 'google-polyglot',
                name: 'Polyglot (Preview) Voices',
                description: 'Voices designed to speak multiple languages fluently (Neural2-based).',
                pricingText: (t: TranslationKeys) => t.pricing.tts.googleCloud.neural.replace('{price}', '$16.00'),
                voiceFilterCriteria: (voice) => voice.voiceType === 'Polyglot',
                supportedLanguages: ['de-DE', 'en-AU', 'en-US', 'es-ES', 'fr-FR', 'it-IT', 'pt-BR'],
                inputLimitType: 'bytes',
                inputLimitValue: 5000,
            },
            {
                id: 'google-studio-voices',
                apiModelId: 'google-studio',
                name: 'Studio Voices',
                description: 'Highest-quality voices for narration and professional use.',
                pricingText: (t: TranslationKeys) => t.pricing.tts.googleCloud.studio.replace('{price}', '$160.00'),
                voiceFilterCriteria: (voice) => voice.voiceType === 'Studio',
                supportedLanguages: ['de-DE', 'en-GB', 'en-US', 'es-US', 'fr-FR'],
                inputLimitType: 'bytes',
                inputLimitValue: 5000,
            },
            {
                id: 'google-news-voices',
                apiModelId: 'google-news',
                name: 'News Voices (Studio)',
                description: 'Studio-quality voices optimized for news narration.',
                pricingText: (t: TranslationKeys) => t.pricing.tts.googleCloud.studio.replace('{price}', '$160.00'),
                voiceFilterCriteria: (voice) => voice.voiceType === 'Studio (News)',
                supportedLanguages: ['en-AU', 'en-GB', 'en-US', 'es-US'],
                inputLimitType: 'bytes',
                inputLimitValue: 5000,
            },
            {
                id: 'google-chirp-hd-preview-voices',
                apiModelId: 'google-chirp-hd-preview',
                name: 'Chirp HD Voices (Preview)',
                description: 'Earlier preview of conversational voices. Some limitations apply.',
                pricingText: (t: TranslationKeys) => t.pricing.tts.googleCloud.chirpHD,
                voiceFilterCriteria: (voice) => voice.voiceType === 'Chirp HD' && voice.status === 'Preview',
                supportedLanguages: ['en-AU', 'en-GB', 'en-IN', 'en-US'],
                inputLimitType: 'bytes',
                inputLimitValue: 5000,
            },
            {
                id: 'google-chirp3-hd-ga-voices',
                apiModelId: 'google-chirp3-hd-ga',
                name: 'Chirp3 HD Voices (GA)',
                description: 'Latest GA conversational voices. Nuanced, engaging.',
                pricingText: (t: TranslationKeys) => t.pricing.tts.googleCloud.chirp3HD.replace('{price}', '$30.00'),
                voiceFilterCriteria: (voice) => voice.voiceType === 'Chirp3 HD',
                supportedLanguages: ['ar-XA', 'bn-IN', 'cmn-CN', 'de-DE', 'en-AU', 'en-GB', 'en-IN', 'en-US', 'es-ES', 'es-US', 'fr-CA', 'fr-FR', 'gu-IN', 'hi-IN', 'id-ID', 'it-IT', 'ja-JP', 'kn-IN', 'ko-KR', 'ml-IN', 'mr-IN', 'nl-BE', 'nl-NL', 'pl-PL', 'pt-BR', 'ru-RU', 'sw-KE', 'ta-IN', 'te-IN', 'th-TH', 'tr-TR', 'uk-UA', 'ur-IN', 'vi-VN'],
                inputLimitType: 'bytes',
                inputLimitValue: 5000,
            },
        ],
        availableVoices: GOOGLE_TTS_VOICES,
    },
    {
        id: 'google-gemini',
        name: 'Google Gemini TTS',
        requiresOwnKey: true,
        apiKeyId: 'google_ai',
        models: [
            {
                id: 'gemini-2.5-flash-preview-tts',
                apiModelId: 'gemini-2.5-flash-preview-tts',
                name: 'Gemini 2.5 Flash Preview TTS',
                description: 'Low latency, controllable, single- and multi-speaker text-to-speech audio generation. Uses Gemini API.',
                pricingText: (t: TranslationKeys) => `${t.pricing.tts.geminiFlash.textTokens.replace('{price}', '$0.50')} ${t.pricing.tts.plusSign} ${t.pricing.tts.geminiFlash.audioTokens.replace('$10.00', '{price}').replace('{price}', '$10.00')}`,
                supportedLanguages: [
                    'ar-EG', 'de-DE', 'en-US', 'es-US', 'fr-FR', 'hi-IN', 'id-ID', 'it-IT',
                    'ja-JP', 'ko-KR', 'pt-BR', 'ru-RU', 'nl-NL', 'pl-PL', 'th-TH', 'tr-TR',
                    'vi-VN', 'ro-RO', 'uk-UA', 'bn-BD', 'en-IN', 'mr-IN', 'ta-IN', 'te-IN'
                ],
                inputLimitType: 'tokens',
                inputLimitValue: 8000,
                freeTier: {
                    available: true,
                    note: (t: TranslationKeys) => t.pricing.geminiFreeTierNote
                },
            },
            {
                id: 'gemini-2.5-pro-preview-tts',
                apiModelId: 'gemini-2.5-pro-preview-tts',
                name: 'Gemini 2.5 Pro Preview TTS',
                description: 'High-quality, controllable, single- and multi-speaker text-to-speech audio generation. Uses Gemini API.',
                pricingText: (t: TranslationKeys) => `${t.pricing.tts.geminiPro.textTokens.replace('{price}', '$1.00')} ${t.pricing.tts.plusSign} ${t.pricing.tts.geminiPro.audioTokens.replace('$20.00', '{price}').replace('{price}', '$20.00')}`,
                supportedLanguages: [
                    'ar-EG', 'de-DE', 'en-US', 'es-US', 'fr-FR', 'hi-IN', 'id-ID', 'it-IT',
                    'ja-JP', 'ko-KR', 'pt-BR', 'ru-RU', 'nl-NL', 'pl-PL', 'th-TH', 'tr-TR',
                    'vi-VN', 'ro-RO', 'uk-UA', 'bn-BD', 'en-IN', 'mr-IN', 'ta-IN', 'te-IN'
                ],
                inputLimitType: 'tokens',
                inputLimitValue: 8000,
            },
        ],
        availableVoices: GEMINI_TTS_VOICES,
    },
    {
        id: 'browser',
        name: 'Browser TTS',
        requiresOwnKey: false,
        models: [
            {
                id: 'browser-tts',
                apiModelId: 'browser-tts',
                name: 'Web Speech API',
                description: 'Built-in browser text-to-speech using the Web Speech API. No API key required, but quality and available voices depend on the browser and operating system.',
                pricingText: () => 'Free (built-in)',
                supportedLanguages: Array.from(new Set(BROWSER_TTS_VOICES.flatMap(v => v.languageCodes || []))),
                inputLimitType: 'characters',
                inputLimitValue: 4000, // Reasonable limit for browser TTS
            }
        ],
        availableVoices: BROWSER_TTS_VOICES,
    },
];