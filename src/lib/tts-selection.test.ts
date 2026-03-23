import { describe, expect, it } from 'vitest';
import { getNextSelectedVoiceId } from './tts-selection';
import type { TTSVoice } from './tts_models';

const makeVoice = (id: string, name: string): TTSVoice => ({
    id,
    name,
});

describe('getNextSelectedVoiceId', () => {
    it('preserves the selected voice when voices refresh (regression: play sample should not reset)', () => {
        const voices = [
            makeVoice('browser-albert', 'Albert (en-GB)'),
            makeVoice('browser-microsoft-libby', 'Microsoft Libby (en-GB)'),
        ];

        const nextVoice = getNextSelectedVoiceId('browser-microsoft-libby', voices);
        expect(nextVoice).toBe('browser-microsoft-libby');
    });

    it('falls back to the first voice when the previous selection is no longer available', () => {
        const voices = [
            makeVoice('browser-albert', 'Albert (en-GB)'),
            makeVoice('browser-microsoft-libby', 'Microsoft Libby (en-GB)'),
        ];

        const nextVoice = getNextSelectedVoiceId('browser-missing-voice', voices);
        expect(nextVoice).toBe('browser-albert');
    });

    it('returns null when no voices are available', () => {
        const nextVoice = getNextSelectedVoiceId('browser-microsoft-libby', []);
        expect(nextVoice).toBeNull();
    });
});
