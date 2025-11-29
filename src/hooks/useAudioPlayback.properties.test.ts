// src/hooks/useAudioPlayback.properties.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useAudioPlayback } from './useAudioPlayback';

// Mock the TTS models
vi.mock('@/lib/tts_models', () => ({
  getVoiceById: vi.fn(() => ({ providerVoiceId: 'test-voice' })),
  findFallbackBrowserVoice: vi.fn(() => ({
    name: 'Test Voice',
    lang: 'en-US',
    voiceURI: 'test-voice',
    localService: true,
    default: false,
  })),
}));

describe('useAudioPlayback Property-Based Tests', () => {
  let mockSpeechSynthesis: any;
  let capturedUtterances: any[];

  beforeEach(() => {
    capturedUtterances = [];

    // Mock SpeechSynthesisUtterance
    global.SpeechSynthesisUtterance = class {
      onstart = null;
      onend = null;
      onerror = null;
      voice = null;
      text: string;
      
      constructor(text: string) {
        this.text = text;
        capturedUtterances.push(this);
      }
    } as any;

    // Mock speechSynthesis
    mockSpeechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      getVoices: vi.fn(() => [
        {
          name: 'Test Voice',
          lang: 'en-US',
          voiceURI: 'test-voice',
          localService: true,
          default: false,
        },
      ]),
      speaking: false,
      pending: false,
      paused: false,
    };

    Object.defineProperty(window, 'speechSynthesis', {
      writable: true,
      value: mockSpeechSynthesis,
    });

    // Mock Audio
    global.Audio = class {
      play = vi.fn().mockResolvedValue(undefined);
      pause = vi.fn();
      onended = null;
      onpause = null;
      onplay = null;
      
      constructor(src: string) {
        // Constructor
      }
    } as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
    capturedUtterances = [];
  });

  // Feature: comprehensive-testing, Property 14: Audio completion updates state
  // Validates: Requirements 4.4
  it('Property 14: audio completion updates state correctly for any message', () => {
    fc.assert(
      fc.property(
        // Generate random message IDs and content
        fc.record({
          messageId: fc.string({ minLength: 1, maxLength: 50 }),
          content: fc.string({ minLength: 1, maxLength: 200 }),
        }),
        ({ messageId, content }) => {
          const onAudioEnd = vi.fn();
          const { result } = renderHook(() => useAudioPlayback({ onAudioEnd }));

          // Property 1: Before playback, state should be idle
          expect(result.current.audioState.isPlaying).toBe(false);
          expect(result.current.audioState.isPaused).toBe(false);
          expect(result.current.audioState.currentMessageId).toBe(null);

          // Start playback
          act(() => {
            result.current.playBrowserTTS(
              content,
              { provider: 'browser', voice: 'test-voice' },
              messageId,
              [content]
            );
          });

          // Property 2: During playback, state should reflect playing message
          expect(result.current.audioState.isPlaying).toBe(true);
          expect(result.current.audioState.isPaused).toBe(false);
          expect(result.current.audioState.currentMessageId).toBe(messageId);

          // Simulate audio completion
          act(() => {
            const utterance = capturedUtterances[capturedUtterances.length - 1];
            if (utterance && utterance.onend) {
              utterance.onend();
            }
          });

          // Property 3: After completion, state should be reset
          expect(result.current.audioState.isPlaying).toBe(false);
          expect(result.current.audioState.isPaused).toBe(false);
          expect(result.current.audioState.currentMessageId).toBe(null);

          // Property 4: onAudioEnd callback should be called
          expect(onAudioEnd).toHaveBeenCalledTimes(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 14 (extended): pause and resume maintain message ID', () => {
    fc.assert(
      fc.property(
        fc.record({
          messageId: fc.string({ minLength: 1, maxLength: 50 }),
          content: fc.string({ minLength: 1, maxLength: 200 }),
        }),
        ({ messageId, content }) => {
          const { result } = renderHook(() => useAudioPlayback());

          // Start playback
          act(() => {
            result.current.playBrowserTTS(
              content,
              { provider: 'browser', voice: 'test-voice' },
              messageId,
              [content]
            );
          });

          const initialMessageId = result.current.audioState.currentMessageId;
          expect(initialMessageId).toBe(messageId);

          // Pause
          act(() => {
            result.current.pauseAudio();
          });

          // Property: Message ID should be preserved during pause
          expect(result.current.audioState.currentMessageId).toBe(initialMessageId);
          expect(result.current.audioState.isPaused).toBe(true);
          expect(result.current.audioState.isPlaying).toBe(true);

          // Resume
          act(() => {
            result.current.resumeAudio();
          });

          // Property: Message ID should still be preserved after resume
          expect(result.current.audioState.currentMessageId).toBe(initialMessageId);
          expect(result.current.audioState.isPaused).toBe(false);
          expect(result.current.audioState.isPlaying).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
