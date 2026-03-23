import type { TTSVoice } from './tts_models';

/**
 * Keep the user's selected voice when the voice list refreshes.
 * Fall back to the first available voice only when the selection is no longer valid.
 */
export function getNextSelectedVoiceId(
    previousVoiceId: string | null | undefined,
    availableVoices: TTSVoice[]
): string | null {
    if (previousVoiceId && availableVoices.some(voice => voice.id === previousVoiceId)) {
        return previousVoiceId;
    }

    return availableVoices[0]?.id ?? null;
}
