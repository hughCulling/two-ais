// functions/src/tts_utils.ts
// Utility functions for TTS input splitting and counting (tokens, bytes, characters)
// Used to enforce per-model input limits for TTS providers (OpenAI, Gemini, Google, ElevenLabs, etc)
//
// Usage:
//   - Use getTTSInputChunks(text, limitType, limitValue, encodingName?) to split text for TTS API calls
//   - limitType: 'tokens' | 'characters' | 'bytes'
//   - limitValue: max allowed per request
//   - encodingName: tiktoken encoding (e.g. 'cl100k_base' for OpenAI/Gemini)

import { encoding_for_model, get_encoding, Tiktoken, TiktokenEncoding } from '@dqbd/tiktoken';

// --- Token Counting ---
export function countTokens(text: string, encodingName: TiktokenEncoding = 'cl100k_base'): number {
  const enc = get_encoding(encodingName);
  const tokens = enc.encode(text);
  enc.free();
  return tokens.length;
}

// --- Token Chunking ---
export function splitTextByTokens(text: string, maxTokens: number, encodingName: TiktokenEncoding = 'cl100k_base'): string[] {
  const enc = get_encoding(encodingName);
  const tokens = enc.encode(text);
  const chunks: string[] = [];
  for (let i = 0; i < tokens.length; i += maxTokens) {
    const chunkTokens = tokens.slice(i, i + maxTokens);
    // enc.decode expects a Uint8Array
    // @ts-expect-error: tiktoken types may be too strict, but this works in practice
    chunks.push(enc.decode(new Uint8Array(chunkTokens)));
  }
  enc.free();
  return chunks;
}

// --- Byte Counting ---
export function countBytes(text: string): number {
  return Buffer.byteLength(text, 'utf8');
}

// --- Byte Chunking ---
export function splitTextByBytes(text: string, maxBytes: number): string[] {
  const chunks: string[] = [];
  let current = '';
  for (const char of text) {
    const charBytes = Buffer.byteLength(char, 'utf8');
    if (Buffer.byteLength(current, 'utf8') + charBytes > maxBytes) {
      if (current.length > 0) chunks.push(current);
      current = char;
    } else {
      current += char;
    }
  }
  if (current.length > 0) chunks.push(current);
  return chunks;
}

// --- Character Counting ---
export function countCharacters(text: string): number {
  return text.length;
}

// --- Character Chunking ---
export function splitTextByCharacters(text: string, maxChars: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += maxChars) {
    chunks.push(text.slice(i, i + maxChars));
  }
  return chunks;
}

// --- General Chunking Utility ---
export type TTSInputLimitType = 'tokens' | 'characters' | 'bytes';

export function getTTSInputChunks(
  text: string,
  limitType: TTSInputLimitType,
  limitValue: number,
  encodingName?: TiktokenEncoding
): string[] {
  if (limitType === 'tokens') {
    return splitTextByTokens(text, limitValue, encodingName || 'cl100k_base');
  } else if (limitType === 'bytes') {
    return splitTextByBytes(text, limitValue);
  } else if (limitType === 'characters') {
    return splitTextByCharacters(text, limitValue);
  } else {
    throw new Error(`Unknown TTS input limit type: ${limitType}`);
  }
} 