// tests/generators/ttsSettings.ts
// Property-based test generators for TTS settings

import * as fc from 'fast-check';

/**
 * Interface for TTS configuration
 */
export interface TTSConfig {
  provider: string;
  voice: string | null;
  ttsApiModelId?: string;
}

/**
 * Interface for conversation TTS settings
 */
export interface TTSSettings {
  enabled: boolean;
  agentA: TTSConfig;
  agentB: TTSConfig;
}

/**
 * Arbitrary for generating browser TTS voice IDs
 */
const browserVoiceArbitrary = (): fc.Arbitrary<string> => {
  return fc.oneof(
    fc.constant('browser-microsoft-david-desktop'),
    fc.constant('browser-microsoft-zira-desktop'),
    fc.constant('browser-google-us-english'),
    fc.constant('browser-apple-samantha'),
    fc.constant('browser-apple-alex'),
    fc.constant('browser-google-uk-english-female'),
    fc.constant('browser-microsoft-mark'),
    fc.string({ minLength: 10, maxLength: 50 }) // Random voice ID
  );
};

/**
 * Arbitrary for generating TTS configuration for a single agent
 * Generates configurations for browser and API-based providers
 */
export const ttsConfigArbitrary = (): fc.Arbitrary<TTSConfig> => {
  return fc.oneof(
    // Browser TTS
    fc.record({
      provider: fc.constant('browser'),
      voice: browserVoiceArbitrary(),
      ttsApiModelId: fc.constant(undefined)
    }),
    // No TTS
    fc.record({
      provider: fc.constant('none'),
      voice: fc.constant(null),
      ttsApiModelId: fc.constant(undefined)
    }),
    // API-based TTS (for future support)
    fc.record({
      provider: fc.constantFrom('openai', 'google', 'elevenlabs'),
      voice: fc.string({ minLength: 5, maxLength: 50 }),
      ttsApiModelId: fc.option(fc.string({ minLength: 5, maxLength: 30 }), { nil: undefined })
    })
  );
};

/**
 * Arbitrary for generating browser-only TTS configuration
 */
export const browserTTSConfigArbitrary = (): fc.Arbitrary<TTSConfig> => {
  return fc.record({
    provider: fc.constant('browser'),
    voice: browserVoiceArbitrary(),
    ttsApiModelId: fc.constant(undefined)
  });
};

/**
 * Arbitrary for generating API-based TTS configuration
 */
export const apiTTSConfigArbitrary = (): fc.Arbitrary<TTSConfig> => {
  return fc.record({
    provider: fc.constantFrom('openai', 'google', 'elevenlabs'),
    voice: fc.string({ minLength: 5, maxLength: 50 }),
    ttsApiModelId: fc.option(fc.string({ minLength: 5, maxLength: 30 }), { nil: undefined })
  });
};

/**
 * Arbitrary for generating complete TTS settings for a conversation
 */
export const ttsSettingsArbitrary = (): fc.Arbitrary<TTSSettings> => {
  return fc.record({
    enabled: fc.boolean(),
    agentA: ttsConfigArbitrary(),
    agentB: ttsConfigArbitrary()
  });
};

/**
 * Arbitrary for generating TTS settings with TTS enabled
 */
export const enabledTTSSettingsArbitrary = (): fc.Arbitrary<TTSSettings> => {
  return fc.record({
    enabled: fc.constant(true),
    agentA: fc.oneof(browserTTSConfigArbitrary(), apiTTSConfigArbitrary()),
    agentB: fc.oneof(browserTTSConfigArbitrary(), apiTTSConfigArbitrary())
  });
};

/**
 * Arbitrary for generating TTS settings with TTS disabled
 */
export const disabledTTSSettingsArbitrary = (): fc.Arbitrary<TTSSettings> => {
  return fc.record({
    enabled: fc.constant(false),
    agentA: fc.record({
      provider: fc.constant('none'),
      voice: fc.constant(null),
      ttsApiModelId: fc.constant(undefined)
    }),
    agentB: fc.record({
      provider: fc.constant('none'),
      voice: fc.constant(null),
      ttsApiModelId: fc.constant(undefined)
    })
  });
};

/**
 * Arbitrary for generating TTS settings with browser TTS only
 */
export const browserOnlyTTSSettingsArbitrary = (): fc.Arbitrary<TTSSettings> => {
  return fc.record({
    enabled: fc.constant(true),
    agentA: browserTTSConfigArbitrary(),
    agentB: browserTTSConfigArbitrary()
  });
};

/**
 * Arbitrary for generating invalid TTS settings
 * (TTS enabled but missing provider or voice)
 */
export const invalidTTSSettingsArbitrary = (): fc.Arbitrary<TTSSettings> => {
  return fc.oneof(
    // Enabled but agentA has no provider
    fc.record({
      enabled: fc.constant(true),
      agentA: fc.record({
        provider: fc.constant(''),
        voice: fc.constant(null),
        ttsApiModelId: fc.constant(undefined)
      }),
      agentB: browserTTSConfigArbitrary()
    }),
    // Enabled but agentB has no voice
    fc.record({
      enabled: fc.constant(true),
      agentA: browserTTSConfigArbitrary(),
      agentB: fc.record({
        provider: fc.constant('browser'),
        voice: fc.constant(null),
        ttsApiModelId: fc.constant(undefined)
      })
    }),
    // Enabled but both agents have no provider
    fc.record({
      enabled: fc.constant(true),
      agentA: fc.record({
        provider: fc.constant(''),
        voice: fc.constant(null),
        ttsApiModelId: fc.constant(undefined)
      }),
      agentB: fc.record({
        provider: fc.constant(''),
        voice: fc.constant(null),
        ttsApiModelId: fc.constant(undefined)
      })
    })
  );
};
