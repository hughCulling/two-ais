// src/lib/tts_models.ts
// Centralized definition for available Text-to-Speech providers and voices

// --- TTS Voice Interface ---
export interface TTSVoice {
    id: string;   // Provider-specific voice ID (e.g., for OpenAI: 'alloy'; for Google: 'en-US-Wavenet-A')
    name: string; // User-friendly display name (e.g., "Alloy", "US WaveNet A (F) [WaveNet]")
    gender?: 'Male' | 'Female' | 'Neutral'; // Optional gender information
    languageCodes?: string[]; // Optional BCP-47 language codes supported (e.g., ['en-US'])
    voiceType?: string; // Optional: Specific type/tier of voice (e.g., "Standard", "WaveNet", "Chirp HD")
    status?: 'GA' | 'Preview' | 'Experimental'; // Optional: Launch stage
    notes?: string; // Optional: Important considerations
}

// --- Standard OpenAI Voices ---
// The TTS endpoint provides 11 built‑in voices
export const OPENAI_TTS_VOICES: TTSVoice[] = [
    { id: 'alloy', name: 'Alloy' },
    { id: 'ash', name: 'Ash' },
    { id: 'ballad', name: 'Ballad' },
    { id: 'coral', name: 'Coral' },
    { id: 'echo', name: 'Echo' },
    { id: 'fable', name: 'Fable' },
    { id: 'nova', name: 'Nova' },
    { id: 'onyx', name: 'Onyx' },
    { id: 'sage', name: 'Sage' },
    { id: 'shimmer', name: 'Shimmer' },
    // Note: The 11th voice mentioned in docs "Echo, Fable, Onyx, Nova, and Shimmer" are 5, plus alloy, ash, ballad, coral, sage = 10.
    // The image shows 6. The text says 11. I will list the 10 explicitly named.
    // If there's an 11th specific one, we can add it.
];

// --- Google Cloud English TTS Voices (ALL English voices) ---
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

export const GOOGLE_ENGLISH_TTS_VOICES: TTSVoice[] = [
    // --- English (Australia) - en-AU ---
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
    { id: 'en-AU-Polyglot-1', name: 'AU Polyglot 1 (M)', gender: 'Male', languageCodes: ['en-AU'], voiceType: 'Polyglot', status: 'GA' }, // Neural2 based
    { id: 'en-AU-Chirp-HD-D', name: 'AU Chirp HD D (M)', gender: 'Male', languageCodes: ['en-AU'], voiceType: 'Chirp HD', status: 'Preview', notes: 'Conversational. May hallucinate. No SSML/rate/pitch/A-Law.' },
    { id: 'en-AU-Chirp-HD-F', name: 'AU Chirp HD F (F)', gender: 'Female', languageCodes: ['en-AU'], voiceType: 'Chirp HD', status: 'Preview', notes: 'Conversational. May hallucinate. No SSML/rate/pitch/A-Law.' },
    { id: 'en-AU-Chirp-HD-O', name: 'AU Chirp HD O (F)', gender: 'Female', languageCodes: ['en-AU'], voiceType: 'Chirp HD', status: 'Preview', notes: 'Conversational. May hallucinate. No SSML/rate/pitch/A-Law.' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `en-AU-Chirp3-HD-${variant}`, name: `AU ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['en-AU'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),

    // --- English (India) - en-IN ---
    { id: 'en-IN-Standard-A', name: 'IN Standard A (F)', gender: 'Female', languageCodes: ['en-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-IN-Standard-B', name: 'IN Standard B (M)', gender: 'Male', languageCodes: ['en-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-IN-Standard-C', name: 'IN Standard C (M)', gender: 'Male', languageCodes: ['en-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-IN-Standard-D', name: 'IN Standard D (F)', gender: 'Female', languageCodes: ['en-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-IN-Standard-E', name: 'IN Standard E (F)', gender: 'Female', languageCodes: ['en-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-IN-Standard-F', name: 'IN Standard F (M)', gender: 'Male', languageCodes: ['en-IN'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-IN-Wavenet-A', name: 'IN Wavenet A (F)', gender: 'Female', languageCodes: ['en-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-IN-Wavenet-B', name: 'IN Wavenet B (M)', gender: 'Male', languageCodes: ['en-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-IN-Wavenet-C', name: 'IN Wavenet C (M)', gender: 'Male', languageCodes: ['en-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-IN-Wavenet-D', name: 'IN Wavenet D (F)', gender: 'Female', languageCodes: ['en-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-IN-Wavenet-E', name: 'IN Wavenet E (F)', gender: 'Female', languageCodes: ['en-IN'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-IN-Wavenet-F', name: 'IN Wavenet F (M)', gender: 'Male', languageCodes: ['en-IN'], voiceType: 'WaveNet', status: 'GA' },
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

    // --- English (UK) - en-GB ---
    { id: 'en-GB-Standard-A', name: 'UK Standard A (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-GB-Standard-B', name: 'UK Standard B (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-GB-Standard-C', name: 'UK Standard C (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-GB-Standard-D', name: 'UK Standard D (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-GB-Standard-F', name: 'UK Standard F (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-GB-Standard-N', name: 'UK Standard N (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-GB-Standard-O', name: 'UK Standard O (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'Standard', status: 'GA' },
    { id: 'en-GB-Wavenet-A', name: 'UK Wavenet A (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-GB-Wavenet-B', name: 'UK Wavenet B (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-GB-Wavenet-C', name: 'UK Wavenet C (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-GB-Wavenet-D', name: 'UK Wavenet D (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-GB-Wavenet-F', name: 'UK Wavenet F (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-GB-Wavenet-N', name: 'UK Wavenet N (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-GB-Wavenet-O', name: 'UK Wavenet O (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'WaveNet', status: 'GA' },
    { id: 'en-GB-Neural2-A', name: 'UK Neural2 A (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-GB-Neural2-B', name: 'UK Neural2 B (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-GB-Neural2-C', name: 'UK Neural2 C (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-GB-Neural2-D', name: 'UK Neural2 D (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-GB-Neural2-F', name: 'UK Neural2 F (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-GB-Neural2-N', name: 'UK Neural2 N (F)', gender: 'Female', languageCodes: ['en-GB'], voiceType: 'Neural2', status: 'GA' },
    { id: 'en-GB-Neural2-O', name: 'UK Neural2 O (M)', gender: 'Male', languageCodes: ['en-GB'], voiceType: 'Neural2', status: 'GA' },
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

    // --- English (US) - en-US ---
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
    { id: 'en-US-News-N', name: 'US News N (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'Studio (News)', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-US-Studio-O', name: 'US Studio O (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'Studio', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-US-Studio-Q', name: 'US Studio Q (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'Studio', status: 'GA', notes: 'SSML limited.' },
    { id: 'en-US-Casual-K', name: 'US Casual K (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'Neural2 (Casual)', status: 'GA' }, // Neural2 based
    { id: 'en-US-Polyglot-1', name: 'US Polyglot 1 (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'Polyglot', status: 'GA' }, // Neural2 based
    { id: 'en-US-Chirp-HD-D', name: 'US Chirp HD D (M)', gender: 'Male', languageCodes: ['en-US'], voiceType: 'Chirp HD', status: 'Preview', notes: 'Conversational. May hallucinate. No SSML/rate/pitch/A-Law.' },
    { id: 'en-US-Chirp-HD-F', name: 'US Chirp HD F (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'Chirp HD', status: 'Preview', notes: 'Conversational. May hallucinate. No SSML/rate/pitch/A-Law.' },
    { id: 'en-US-Chirp-HD-O', name: 'US Chirp HD O (F)', gender: 'Female', languageCodes: ['en-US'], voiceType: 'Chirp HD', status: 'Preview', notes: 'Conversational. May hallucinate. No SSML/rate/pitch/A-Law.' },
    ...CHIRP3_HD_VARIANT_NAMES.map(variant => ({
        id: `en-US-Chirp3-HD-${variant}`, name: `US ${variant} (${getChirp3HDGender(variant).charAt(0)})`, gender: getChirp3HDGender(variant), languageCodes: ['en-US'], voiceType: 'Chirp3 HD', status: 'GA', notes: 'Conversational, nuanced intonation.'
    } as TTSVoice)),
];


// --- Interface for specific TTS model details within a provider ---
export interface TTSModelDetail {
    id: string; // Internal unique ID for this model variant for your app (e.g., "openai-tts-1", "google-standard-voices")
    apiModelId: string; // Actual model ID for API (e.g. 'tts-1') or conceptual group ID (e.g. 'google-standard')
    name: string; // User-friendly display name, e.g., "TTS-1", "Google Standard Voices"
    description: string;
    pricingText: string; // Formatted pricing string for display
    // Field to help filter voices for this conceptual model, if applicable
    voiceFilterCriteria?: (voice: TTSVoice) => boolean;
}

// --- TTS Provider Interface ---
export interface TTSProviderInfo {
    id: 'openai' | 'google-cloud'; // Expandable
    name: string; // User-friendly display name
    requiresOwnKey: boolean;
    apiKeyId?: string; // Identifier for the API key in your system
    models: TTSModelDetail[];
    availableVoices: TTSVoice[];
}

// --- AVAILABLE TTS PROVIDERS & VOICES ---
export const AVAILABLE_TTS_PROVIDERS: TTSProviderInfo[] = [
    {
        id: 'openai',
        name: 'OpenAI',
        requiresOwnKey: false, // Uses the main OpenAI LLM key
        apiKeyId: 'openai', // Matches the id in ApiKeyManager for OpenAI key status check
        models: [
            {
                id: 'openai-gpt-4o-mini-tts',
                apiModelId: 'gpt-4o-mini-tts',
                name: 'GPT-4o mini TTS',
                description: 'Powered by GPT-4o mini. Max 2000 input tokens.',
                pricingText: '$0.60/M input text tokens + $12/M output audio tokens'
            },
            {
                id: 'openai-tts-1',
                apiModelId: 'tts-1',
                name: 'TTS-1',
                description: 'Optimized for speed.',
                pricingText: '$15.00 / 1M input characters'
            },
            {
                id: 'openai-tts-1-hd',
                apiModelId: 'tts-1-hd',
                name: 'TTS-1 HD',
                description: 'Optimized for quality.',
                pricingText: '$30.00 / 1M input characters'
            },
        ],
        availableVoices: OPENAI_TTS_VOICES,
    },
    {
        id: 'google-cloud',
        name: 'Google Cloud TTS',
        requiresOwnKey: true,
        apiKeyId: 'google_ai', // <<<< CORRECTED HERE to match ApiKeyManager's 'google_ai' id
        models: [ // Conceptual models for Google to fit the UI: Provider -> Model -> Voice
            {
                id: 'google-standard-voices',
                apiModelId: 'google-standard', // Conceptual
                name: 'Standard Voices',
                description: 'Cost-effective voices for general use.',
                pricingText: '$4.00 / 1M characters (approx.)',
                voiceFilterCriteria: (voice) => voice.voiceType === 'Standard',
            },
            {
                id: 'google-wavenet-voices',
                apiModelId: 'google-wavenet', // Conceptual
                name: 'WaveNet Voices',
                description: 'High-quality, natural-sounding voices.',
                pricingText: '$16.00 / 1M characters (approx.)',
                voiceFilterCriteria: (voice) => voice.voiceType === 'WaveNet',
            },
            {
                id: 'google-neural2-voices',
                apiModelId: 'google-neural2', // Conceptual
                name: 'Neural2, Casual & Polyglot Voices',
                description: 'Advanced voices including specialized styles (Neural2, Casual, Polyglot).',
                pricingText: '$16.00 / 1M characters (approx.)',
                voiceFilterCriteria: (voice) =>
                    voice.voiceType === 'Neural2' ||
                    voice.voiceType === 'Neural2 (Casual)' ||
                    voice.voiceType === 'Polyglot',
            },
            {
                id: 'google-studio-voices',
                apiModelId: 'google-studio', // Conceptual
                name: 'Studio & News Voices',
                description: 'Highest-quality voices for narration and professional use (Studio, News).',
                pricingText: '$160.00 / 1M characters (approx.)', // Studio can be much higher for long audio
                voiceFilterCriteria: (voice) =>
                    voice.voiceType === 'Studio' ||
                    voice.voiceType === 'Studio (News)',
            },
            {
                id: 'google-chirp-hd-voices',
                apiModelId: 'google-chirp-hd', // Conceptual
                name: 'Chirp HD Voices (Preview)',
                description: 'Latest generation conversational voices (Preview). Some limitations apply.',
                pricingText: '$16.00 / 1M characters (approx.)',
                voiceFilterCriteria: (voice) => voice.voiceType === 'Chirp HD',
            },
            {
                id: 'google-chirp3-hd-voices',
                apiModelId: 'google-chirp3-hd', // Conceptual
                name: 'Chirp3 HD Voices',
                description: 'Nuanced, conversational voices for engaging experiences.',
                pricingText: '$16.00 / 1M characters (approx.)',
                voiceFilterCriteria: (voice) => voice.voiceType === 'Chirp3 HD',
            },
        ],
        availableVoices: GOOGLE_ENGLISH_TTS_VOICES, // This list contains ALL Google English voices
    },
];

// --- Helper Functions ---

/**
 * Finds TTS provider information by its unique ID.
 */
export function getTTSProviderInfoById(id: TTSProviderInfo['id']): TTSProviderInfo | undefined {
    return AVAILABLE_TTS_PROVIDERS.find(p => p.id === id);
}

/**
 * Gets the list of ALL voices for a specific TTS provider ID.
 * For Google, this will return all ~230 English voices.
 * The UI will need to filter this list based on the selected conceptual "model" (TTSModelDetail).
 */
export function getVoicesForProvider(providerId: TTSProviderInfo['id']): TTSVoice[] {
    const provider = getTTSProviderInfoById(providerId);
    return provider ? provider.availableVoices : [];
}

/**
 * Gets a specific voice by its ID from a provider's available voices.
 */
export function getVoiceById(providerId: TTSProviderInfo['id'], voiceId: string): TTSVoice | undefined {
    const voices = getVoicesForProvider(providerId);
    return voices.find(v => v.id === voiceId);
}

/**
 * Gets the default voice for a given provider ID.
 * Returns the first voice in the list, or null if no voices are available.
 */
export function getDefaultVoiceForProvider(providerId: TTSProviderInfo['id']): TTSVoice | null {
    const provider = getTTSProviderInfoById(providerId);
    if (!provider) return null;

    // For OpenAI, use the first voice from its specific list
    if (providerId === 'openai') {
        return provider.availableVoices.length > 0 ? provider.availableVoices[0] : null; // Defaults to 'alloy'
    }

    // For Google, pick a sensible default from the broader list, e.g., a US WaveNet voice
    if (providerId === 'google-cloud') {
        const preferredGoogleDefault = provider.availableVoices.find(v => v.id === 'en-US-Wavenet-A');
        if (preferredGoogleDefault) return preferredGoogleDefault;
        // Fallback to the first Google voice if the preferred isn't found (should always be there with the full list)
        return provider.availableVoices.length > 0 ? provider.availableVoices[0] : null;
    }
    
    return provider.availableVoices.length > 0 ? provider.availableVoices[0] : null;
}

/**
 * Gets a specific TTS model detail by its unique app ID (e.g., 'openai-tts-1', 'google-standard-voices').
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
 * Gets a specific TTS model detail by its API model ID (e.g., 'tts-1', or conceptual 'google-standard').
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
