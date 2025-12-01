import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getVoiceById, findFallbackBrowserVoice, OPENAI_TTS_VOICES, GOOGLE_TTS_VOICES, initializeVoiceListeners, populateBrowserVoices } from './tts_models';

describe('getVoiceById', () => {
  it('should return undefined for non-existent voice ID', () => {
    const voice = getVoiceById('browser', 'non-existent-voice');
    expect(voice).toBeUndefined();
  });

  it('should return undefined for invalid provider ID', () => {
    // @ts-expect-error Testing invalid provider
    const voice = getVoiceById('invalid-provider', 'some-voice');
    expect(voice).toBeUndefined();
  });

  it('should return undefined for commented-out providers', () => {
    // OpenAI and Google Cloud providers are currently commented out
    // @ts-expect-error Testing commented-out provider
    const openaiVoice = getVoiceById('openai', 'alloy');
    expect(openaiVoice).toBeUndefined();

    // @ts-expect-error Testing commented-out provider
    const googleVoice = getVoiceById('google-cloud', 'en-US-Standard-A');
    expect(googleVoice).toBeUndefined();
  });

  it('should work with browser provider when voices are available', () => {
    // Browser voices are populated at runtime, so this tests the function logic
    // The actual voices array may be empty in test environment
    const voice = getVoiceById('browser', 'browser-test-voice');
    // Should return undefined since no voices are populated in test environment
    expect(voice).toBeUndefined();
  });

  it('should verify OPENAI_TTS_VOICES array structure', () => {
    // Even though OpenAI provider is commented out, the voices array should exist
    expect(OPENAI_TTS_VOICES).toBeDefined();
    expect(Array.isArray(OPENAI_TTS_VOICES)).toBe(true);
    expect(OPENAI_TTS_VOICES.length).toBeGreaterThan(0);

    // Verify structure of first voice
    const firstVoice = OPENAI_TTS_VOICES[0];
    expect(firstVoice).toHaveProperty('id');
    expect(firstVoice).toHaveProperty('name');
  });

  it('should verify GOOGLE_TTS_VOICES array structure', () => {
    // Even though Google provider is commented out, the voices array should exist
    expect(GOOGLE_TTS_VOICES).toBeDefined();
    expect(Array.isArray(GOOGLE_TTS_VOICES)).toBe(true);
    expect(GOOGLE_TTS_VOICES.length).toBeGreaterThan(0);

    // Verify structure of a known voice
    const usStandardA = GOOGLE_TTS_VOICES.find(v => v.id === 'en-US-Standard-A');
    expect(usStandardA).toBeDefined();
    expect(usStandardA?.name).toBe('US Standard A (M)');
    expect(usStandardA?.gender).toBe('Male');
  });
});

describe('findFallbackBrowserVoice', () => {
  // Mock SpeechSynthesisVoice objects
  const createMockVoice = (
    name: string,
    lang: string,
    localService: boolean = true,
    isDefault: boolean = false
  ): SpeechSynthesisVoice => ({
    name,
    lang,
    localService,
    default: isDefault,
    voiceURI: `${name}-${lang}`,
  } as SpeechSynthesisVoice);

  beforeEach(() => {
    // Mock window.speechSynthesis
    global.window = {
      speechSynthesis: {
        getVoices: vi.fn(),
        speak: vi.fn(),
        cancel: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
        speaking: false,
        pending: false,
        paused: false,
      },
    } as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should find exact language match with local service', () => {
    const mockVoices = [
      createMockVoice('US Voice', 'en-US', true),
      createMockVoice('UK Voice', 'en-GB', true),
      createMockVoice('AU Voice', 'en-AU', true),
    ];

    vi.mocked(window.speechSynthesis.getVoices).mockReturnValue(mockVoices);

    const voice = findFallbackBrowserVoice('en-US');
    expect(voice).toBeDefined();
    expect(voice?.lang).toBe('en-US');
    expect(voice?.localService).toBe(true);
  });

  it('should find simple language code match when exact match not found', () => {
    const mockVoices = [
      createMockVoice('UK Voice', 'en-GB', true),
      createMockVoice('AU Voice', 'en-AU', true),
    ];

    vi.mocked(window.speechSynthesis.getVoices).mockReturnValue(mockVoices);

    const voice = findFallbackBrowserVoice('en-US');
    expect(voice).toBeDefined();
    expect(voice?.lang).toMatch(/^en-/);
    expect(voice?.localService).toBe(true);
  });

  it('should prefer local service voices', () => {
    const mockVoices = [
      createMockVoice('Cloud Voice', 'en-US', false),
      createMockVoice('Local Voice', 'en-US', true),
    ];

    vi.mocked(window.speechSynthesis.getVoices).mockReturnValue(mockVoices);

    const voice = findFallbackBrowserVoice('en-US');
    expect(voice).toBeDefined();
    expect(voice?.localService).toBe(true);
    expect(voice?.name).toBe('Local Voice');
  });

  it('should find any compatible voice as last resort', () => {
    const mockVoices = [
      createMockVoice('Spanish Voice', 'es-ES', true),
      createMockVoice('French Voice', 'fr-FR', true),
    ];

    vi.mocked(window.speechSynthesis.getVoices).mockReturnValue(mockVoices);

    const voice = findFallbackBrowserVoice('en-US');
    expect(voice).toBeDefined();
  });

  it('should return null when no voices available', () => {
    vi.mocked(window.speechSynthesis.getVoices).mockReturnValue([]);

    const voice = findFallbackBrowserVoice('en-US');
    expect(voice).toBeNull();
  });

  it('should return null in server-side environment', () => {
    // @ts-expect-error Testing server-side
    delete global.window;

    const voice = findFallbackBrowserVoice('en-US');
    expect(voice).toBeNull();
  });

  it('should handle various language codes', () => {
    const mockVoices = [
      createMockVoice('Spanish Voice', 'es-ES', true),
      createMockVoice('French Voice', 'fr-FR', true),
      createMockVoice('German Voice', 'de-DE', true),
      createMockVoice('Japanese Voice', 'ja-JP', true),
    ];

    vi.mocked(window.speechSynthesis.getVoices).mockReturnValue(mockVoices);

    const spanishVoice = findFallbackBrowserVoice('es-ES');
    expect(spanishVoice?.lang).toBe('es-ES');

    const frenchVoice = findFallbackBrowserVoice('fr-FR');
    expect(frenchVoice?.lang).toBe('fr-FR');

    const germanVoice = findFallbackBrowserVoice('de-DE');
    expect(germanVoice?.lang).toBe('de-DE');

    const japaneseVoice = findFallbackBrowserVoice('ja-JP');
    expect(japaneseVoice?.lang).toBe('ja-JP');
  });

  it('should match simple language code when full code not available', () => {
    const mockVoices = [
      createMockVoice('Spanish Voice', 'es-MX', true),
    ];

    vi.mocked(window.speechSynthesis.getVoices).mockReturnValue(mockVoices);

    const voice = findFallbackBrowserVoice('es-ES');
    expect(voice).toBeDefined();
    expect(voice?.lang).toMatch(/^es-/);
  });
});

describe('initializeVoiceListeners', () => {
  let originalSpeechSynthesis: any;

  beforeEach(() => {
    originalSpeechSynthesis = window.speechSynthesis;
  });

  afterEach(() => {
    Object.defineProperty(window, 'speechSynthesis', {
      value: originalSpeechSynthesis,
      writable: true
    });
    vi.clearAllMocks();
  });

  it('should fallback to onvoiceschanged if addEventListener is undefined (iPhone 7 fix)', () => {
    // Mock speechSynthesis without addEventListener
    const mockSpeechSynthesis = {
      getVoices: vi.fn().mockReturnValue([]),
      onvoiceschanged: null,
      // addEventListener is explicitly undefined here
    };

    Object.defineProperty(window, 'speechSynthesis', {
      value: mockSpeechSynthesis,
      writable: true
    });

    // Call the initialization function
    initializeVoiceListeners();

    // Verify that onvoiceschanged was set
    expect(mockSpeechSynthesis.onvoiceschanged).toBeDefined();
    expect(typeof mockSpeechSynthesis.onvoiceschanged).toBe('function');
  });

  it('should use addEventListener if available', () => {
    const addEventListenerMock = vi.fn();
    const mockSpeechSynthesis = {
      getVoices: vi.fn().mockReturnValue([]),
      addEventListener: addEventListenerMock,
      onvoiceschanged: null
    };

    Object.defineProperty(window, 'speechSynthesis', {
      value: mockSpeechSynthesis,
      writable: true
    });

    initializeVoiceListeners();

    expect(addEventListenerMock).toHaveBeenCalledWith('voiceschanged', expect.any(Function));
    // onvoiceschanged should remain null if addEventListener is used
    expect(mockSpeechSynthesis.onvoiceschanged).toBeNull();
  });
});
