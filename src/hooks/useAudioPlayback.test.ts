// src/hooks/useAudioPlayback.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
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

describe('useAudioPlayback - Audio Playback State', () => {
  let mockSpeechSynthesis: any;
  let capturedUtterances: any[];

  beforeEach(() => {
    capturedUtterances = [];

    // Mock SpeechSynthesisUtterance to capture instances
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

  describe('handleAudioEnd behavior', () => {
    it('should set audio state when playback starts', () => {
      const onAudioEnd = vi.fn();
      const { result } = renderHook(() => useAudioPlayback({ onAudioEnd }));

      // Start playing audio
      act(() => {
        result.current.playBrowserTTS(
          'Test content',
          { provider: 'browser', voice: 'test-voice' },
          'msg-123',
          ['Test content']
        );
      });

      // Verify audio state is set correctly
      expect(result.current.audioState.isPlaying).toBe(true);
      expect(result.current.audioState.isPaused).toBe(false);
      expect(result.current.audioState.currentMessageId).toBe('msg-123');
    });

    it('should call onAudioEnd callback when audio completes', () => {
      const onAudioEnd = vi.fn();
      const { result } = renderHook(() => useAudioPlayback({ onAudioEnd }));

      // Play audio
      act(() => {
        result.current.playBrowserTTS(
          'Test content',
          { provider: 'browser', voice: 'test-voice' },
          'msg-456',
          ['Test content']
        );
      });

      expect(result.current.audioState.isPlaying).toBe(true);

      // Simulate audio end by calling the utterance's onend
      act(() => {
        const utterance = capturedUtterances[capturedUtterances.length - 1];
        if (utterance && utterance.onend) {
          utterance.onend();
        }
      });

      // Callback should be called
      expect(onAudioEnd).toHaveBeenCalled();
      
      // State should be cleared
      expect(result.current.audioState.isPlaying).toBe(false);
      expect(result.current.audioState.currentMessageId).toBe(null);
    });

    it('should handle pre-recorded audio state', () => {
      const onAudioEnd = vi.fn();
      const { result } = renderHook(() => useAudioPlayback({ onAudioEnd }));

      let audioInstance: any;
      global.Audio = class {
        play = vi.fn().mockResolvedValue(undefined);
        pause = vi.fn();
        onended = null;
        onpause = null;
        onplay = null;
        
        constructor(src: string) {
          audioInstance = this;
        }
      } as any;

      // Play pre-recorded audio
      act(() => {
        result.current.playPreRecordedAudio('https://example.com/audio.mp3', 'msg-789');
      });

      // Verify audio element was created
      expect(audioInstance).toBeDefined();
      expect(audioInstance.play).toHaveBeenCalled();

      // Trigger onplay to set state
      act(() => {
        if (audioInstance.onplay) {
          audioInstance.onplay();
        }
      });

      expect(result.current.audioState.isPlaying).toBe(true);
      expect(result.current.audioState.currentMessageId).toBe('msg-789');

      // Simulate audio end
      act(() => {
        if (audioInstance.onended) {
          audioInstance.onended();
        }
      });

      expect(onAudioEnd).toHaveBeenCalled();
      expect(result.current.audioState.isPlaying).toBe(false);
      expect(result.current.audioState.currentMessageId).toBe(null);
    });

    it('should handle multiple chunks correctly', () => {
      const onAudioEnd = vi.fn();
      const { result } = renderHook(() => useAudioPlayback({ onAudioEnd }));

      const chunks = ['Chunk 1', 'Chunk 2', 'Chunk 3'];

      act(() => {
        result.current.playBrowserTTS(
          'Full content',
          { provider: 'browser', voice: 'test-voice' },
          'msg-multi',
          chunks
        );
      });

      expect(result.current.audioState.isPlaying).toBe(true);
      
      // Should have created first utterance
      expect(capturedUtterances.length).toBeGreaterThan(0);
      expect(capturedUtterances[0].text).toBe('Chunk 1');

      // Simulate first chunk ending - should trigger next chunk
      act(() => {
        const utterance = capturedUtterances[0];
        if (utterance.onend) {
          utterance.onend();
        }
      });

      // Should still be playing (more chunks)
      expect(result.current.audioState.isPlaying).toBe(true);
      
      // Should have created second utterance
      expect(capturedUtterances.length).toBeGreaterThan(1);
    });
  });

  describe('pause and resume behavior', () => {
    it('should set isPaused when audio is paused', () => {
      const { result } = renderHook(() => useAudioPlayback());

      act(() => {
        result.current.playBrowserTTS(
          'Test content',
          { provider: 'browser', voice: 'test-voice' },
          'msg-pause',
          ['Test content']
        );
      });

      expect(result.current.audioState.isPlaying).toBe(true);
      expect(result.current.audioState.isPaused).toBe(false);

      act(() => {
        result.current.pauseAudio();
      });

      expect(mockSpeechSynthesis.pause).toHaveBeenCalled();
      expect(result.current.audioState.isPaused).toBe(true);
    });

    it('should clear isPaused when audio is resumed', () => {
      const { result } = renderHook(() => useAudioPlayback());

      act(() => {
        result.current.playBrowserTTS(
          'Test content',
          { provider: 'browser', voice: 'test-voice' },
          'msg-resume',
          ['Test content']
        );
      });

      act(() => {
        result.current.pauseAudio();
      });

      expect(result.current.audioState.isPaused).toBe(true);

      act(() => {
        result.current.resumeAudio();
      });

      expect(mockSpeechSynthesis.resume).toHaveBeenCalled();
      expect(result.current.audioState.isPaused).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle TTS errors gracefully without breaking conversation', () => {
      const onAudioEnd = vi.fn();
      const { result } = renderHook(() => useAudioPlayback({ onAudioEnd }));

      act(() => {
        result.current.playBrowserTTS(
          'Test content',
          { provider: 'browser', voice: 'test-voice' },
          'msg-error',
          ['Test content']
        );
      });

      expect(result.current.audioState.isPlaying).toBe(true);

      // Simulate error
      act(() => {
        const utterance = capturedUtterances[capturedUtterances.length - 1];
        if (utterance && utterance.onerror) {
          utterance.onerror({ error: 'network' });
        }
      });

      // Should reset state on error (conversation can continue)
      expect(onAudioEnd).toHaveBeenCalled();
      expect(result.current.audioState.isPlaying).toBe(false);
      expect(result.current.audioState.currentMessageId).toBe(null);
    });

    it('should handle synthesis-failed errors', () => {
      const onAudioEnd = vi.fn();
      const { result } = renderHook(() => useAudioPlayback({ onAudioEnd }));

      act(() => {
        result.current.playBrowserTTS(
          'Test content',
          { provider: 'browser', voice: 'test-voice' },
          'msg-synthesis-fail',
          ['Test content']
        );
      });

      // Simulate synthesis-failed error
      act(() => {
        const utterance = capturedUtterances[capturedUtterances.length - 1];
        if (utterance && utterance.onerror) {
          utterance.onerror({ error: 'synthesis-failed' });
        }
      });

      // Should handle gracefully
      expect(onAudioEnd).toHaveBeenCalled();
      expect(result.current.audioState.isPlaying).toBe(false);
    });

    it('should handle canceled/interrupted errors without logging as errors', () => {
      const consoleSpy = vi.spyOn(console, 'error');
      const onAudioEnd = vi.fn();
      const { result } = renderHook(() => useAudioPlayback({ onAudioEnd }));

      act(() => {
        result.current.playBrowserTTS(
          'Test content',
          { provider: 'browser', voice: 'test-voice' },
          'msg-canceled',
          ['Test content']
        );
      });

      // Simulate canceled error (expected behavior)
      act(() => {
        const utterance = capturedUtterances[capturedUtterances.length - 1];
        if (utterance && utterance.onerror) {
          utterance.onerror({ error: 'canceled' });
        }
      });

      // Should handle gracefully and not log as error
      expect(onAudioEnd).toHaveBeenCalled();
      expect(result.current.audioState.isPlaying).toBe(false);
      
      consoleSpy.mockRestore();
    });

    it('should allow conversation to continue after TTS failure', () => {
      const onAudioEnd = vi.fn();
      const { result } = renderHook(() => useAudioPlayback({ onAudioEnd }));

      // First message fails
      act(() => {
        result.current.playBrowserTTS(
          'First message',
          { provider: 'browser', voice: 'test-voice' },
          'msg-1',
          ['First message']
        );
      });

      act(() => {
        const utterance = capturedUtterances[capturedUtterances.length - 1];
        if (utterance && utterance.onerror) {
          utterance.onerror({ error: 'network' });
        }
      });

      expect(result.current.audioState.isPlaying).toBe(false);
      expect(onAudioEnd).toHaveBeenCalledTimes(1);

      // Should be able to play next message
      act(() => {
        result.current.playBrowserTTS(
          'Second message',
          { provider: 'browser', voice: 'test-voice' },
          'msg-2',
          ['Second message']
        );
      });

      expect(result.current.audioState.isPlaying).toBe(true);
      expect(result.current.audioState.currentMessageId).toBe('msg-2');
    });

    it('should log errors appropriately', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      const { result } = renderHook(() => useAudioPlayback());

      act(() => {
        result.current.playBrowserTTS(
          'Test content',
          { provider: 'browser', voice: 'test-voice' },
          'msg-log',
          ['Test content']
        );
      });

      // Simulate network error (should be logged as error)
      act(() => {
        const utterance = capturedUtterances[capturedUtterances.length - 1];
        if (utterance && utterance.onerror) {
          utterance.onerror({ error: 'network' });
        }
      });

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      consoleDebugSpy.mockRestore();
    });
  });
});
