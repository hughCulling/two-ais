// functions/src/tts_models.ts
// Minimal TTS model metadata for backend input splitting and limits
// Only include models supported in the backend

export type TTSInputLimitType = "tokens" | "characters" | "bytes";

export interface BackendTTSModel {
  id: string; // App model id (e.g., 'openai-tts-1')
  apiModelId: string; // API model id (e.g., 'tts-1')
  provider: "openai" | "google-cloud" | "elevenlabs" | "google-gemini";
  name: string;
  inputLimitType: TTSInputLimitType;
  inputLimitValue: number;
  encodingName?: string; // For token-based models (e.g., 'cl100k_base')
}

export const BACKEND_TTS_MODELS: BackendTTSModel[] = [
  // --- OpenAI ---
  // NOTE: OpenAI TTS API enforces a 4096 character limit per request, regardless of token count. Always chunk by characters.
  {
    id: "openai-tts-1",
    apiModelId: "tts-1",
    provider: "openai",
    name: "OpenAI TTS 1",
    inputLimitType: "characters",
    inputLimitValue: 4096,
    encodingName: "cl100k_base",
  },
  {
    id: "openai-tts-1-hd",
    apiModelId: "tts-1-hd",
    provider: "openai",
    name: "OpenAI TTS 1 HD",
    inputLimitType: "characters",
    inputLimitValue: 4096,
    encodingName: "cl100k_base",
  },
  {
    id: "openai-gpt-4o-mini-tts",
    apiModelId: "tts-1",
    provider: "openai",
    name: "GPT-4o Mini TTS",
    inputLimitType: "characters",
    inputLimitValue: 4096,
    encodingName: "cl100k_base",
  },
  // --- Google Cloud ---
  {
    id: "google-standard-voices",
    apiModelId: "standard",
    provider: "google-cloud",
    name: "Google Standard Voices",
    inputLimitType: "bytes",
    inputLimitValue: 5000,
  },
  {
    id: "google-wavenet-voices",
    apiModelId: "wavenet",
    provider: "google-cloud",
    name: "Google WaveNet Voices",
    inputLimitType: "bytes",
    inputLimitValue: 5000,
  },
  // --- Google Gemini ---
  {
    id: "gemini-2-5-flash-preview-tts",
    apiModelId: "gemini-2.5-flash-preview-tts",
    provider: "google-gemini",
    name: "Gemini 2.5 Flash Preview TTS",
    inputLimitType: "tokens",
    inputLimitValue: 8000,
    encodingName: "cl100k_base",
  },
  // --- ElevenLabs ---
  // {
  //   id: "elevenlabs-multilingual-v2",
  //   apiModelId: "eleven_multilingual_v2",
  //   provider: "elevenlabs",
  //   name: "ElevenLabs Multilingual v2",
  //   inputLimitType: "characters",
  //   inputLimitValue: 10000,
  // },
  // {
  //   id: "elevenlabs-flash-v2-5",
  //   apiModelId: "eleven_flash_v2_5",
  //   provider: "elevenlabs",
  //   name: "ElevenLabs Flash v2.5",
  //   inputLimitType: "characters",
  //   inputLimitValue: 10000,
  // },
  // {
  //   id: "elevenlabs-turbo-v2-5",
  //   apiModelId: "eleven_turbo_v2_5",
  //   provider: "elevenlabs",
  //   name: "ElevenLabs Turbo v2.5",
  //   inputLimitType: "characters",
  //   inputLimitValue: 10000,
  // },
];

export function getBackendTTSModelById(id: string): BackendTTSModel | undefined {
  return BACKEND_TTS_MODELS.find(m => m.id === id || m.apiModelId === id);
} 