// tests/generators/sessionConfig.ts
// Property-based test generators for session configurations

import * as fc from 'fast-check';

/**
 * Interface for agent TTS settings
 */
export interface AgentTTSSettingsConfig {
  provider: string;
  voice: string | null;
  ttsApiModelId?: string;
}

/**
 * Interface matching SessionConfig from the application
 */
export interface SessionConfig {
  agentA_llm: string;
  agentB_llm: string;
  ttsEnabled: boolean;
  agentA_tts: AgentTTSSettingsConfig;
  agentB_tts: AgentTTSSettingsConfig;
  language?: string;
  initialSystemPrompt: string;
}

/**
 * Arbitrary for generating TTS configuration
 */
const ttsConfigArbitrary = (): fc.Arbitrary<AgentTTSSettingsConfig> => {
  return fc.record({
    provider: fc.constantFrom('browser', 'none'),
    voice: fc.option(fc.string({ minLength: 5, maxLength: 50 }), { nil: null }),
    ttsApiModelId: fc.option(fc.string({ minLength: 5, maxLength: 30 }), { nil: undefined })
  });
};

/**
 * Arbitrary for generating random valid session configurations
 * Generates both valid and edge-case configurations
 */
export const sessionConfigArbitrary = (): fc.Arbitrary<SessionConfig> => {
  return fc.record({
    agentA_llm: fc.oneof(
      fc.constant('mistral:mistral-large-latest'),
      fc.constant('ollama:qwen2.5:3b'),
      fc.constant('ollama:qwen2.5:7b'),
      fc.constant('ollama:deepseek-r1:8b'),
      fc.constant('ollama:gemma2:2b')
    ),
    agentB_llm: fc.oneof(
      fc.constant('mistral:mistral-large-latest'),
      fc.constant('ollama:qwen2.5:3b'),
      fc.constant('ollama:gemma2:2b'),
      fc.constant('ollama:deepseek-r1:8b'),
      fc.constant('ollama:qwen2.5:7b')
    ),
    ttsEnabled: fc.boolean(),
    agentA_tts: ttsConfigArbitrary(),
    agentB_tts: ttsConfigArbitrary(),
    language: fc.option(
      fc.constantFrom('en', 'es', 'fr', 'de', 'ja', 'zh', 'pt', 'it', 'ru', 'ar'),
      { nil: undefined }
    ),
    initialSystemPrompt: fc.string({ minLength: 10, maxLength: 500 })
  });
};

/**
 * Arbitrary for generating valid session configurations with TTS enabled
 * Ensures provider and voice are properly set when TTS is enabled
 */
export const validSessionConfigWithTTSArbitrary = (): fc.Arbitrary<SessionConfig> => {
  return fc.record({
    agentA_llm: fc.oneof(
      fc.constant('mistral:mistral-large-latest'),
      fc.constant('ollama:qwen2.5:3b'),
      fc.constant('ollama:qwen2.5:7b')
    ),
    agentB_llm: fc.oneof(
      fc.constant('mistral:mistral-large-latest'),
      fc.constant('ollama:qwen2.5:3b'),
      fc.constant('ollama:gemma2:2b')
    ),
    ttsEnabled: fc.constant(true),
    agentA_tts: fc.record({
      provider: fc.constant('browser'),
      voice: fc.string({ minLength: 5, maxLength: 50 }),
      ttsApiModelId: fc.option(fc.string({ minLength: 5, maxLength: 30 }), { nil: undefined })
    }),
    agentB_tts: fc.record({
      provider: fc.constant('browser'),
      voice: fc.string({ minLength: 5, maxLength: 50 }),
      ttsApiModelId: fc.option(fc.string({ minLength: 5, maxLength: 30 }), { nil: undefined })
    }),
    language: fc.option(
      fc.constantFrom('en', 'es', 'fr', 'de', 'ja', 'zh'),
      { nil: undefined }
    ),
    initialSystemPrompt: fc.string({ minLength: 10, maxLength: 500 })
  });
};

/**
 * Arbitrary for generating invalid session configurations
 * These configs violate validation rules (empty LLMs, TTS enabled without provider/voice)
 */
export const invalidSessionConfigArbitrary = (): fc.Arbitrary<SessionConfig> => {
  return fc.oneof(
    // Empty agentA_llm
    sessionConfigArbitrary().map(config => ({
      ...config,
      agentA_llm: ''
    })),
    // Empty agentB_llm
    sessionConfigArbitrary().map(config => ({
      ...config,
      agentB_llm: ''
    })),
    // TTS enabled but no provider for agentA
    sessionConfigArbitrary().map(config => ({
      ...config,
      ttsEnabled: true,
      agentA_tts: {
        provider: '',
        voice: null
      }
    })),
    // TTS enabled but no voice for agentB
    sessionConfigArbitrary().map(config => ({
      ...config,
      ttsEnabled: true,
      agentB_tts: {
        provider: 'browser',
        voice: null
      }
    })),
    // Both LLMs empty
    sessionConfigArbitrary().map(config => ({
      ...config,
      agentA_llm: '',
      agentB_llm: ''
    }))
  );
};

/**
 * Arbitrary for generating session configs with TTS disabled
 */
export const sessionConfigWithoutTTSArbitrary = (): fc.Arbitrary<SessionConfig> => {
  return sessionConfigArbitrary().map(config => ({
    ...config,
    ttsEnabled: false,
    agentA_tts: {
      provider: 'none',
      voice: null
    },
    agentB_tts: {
      provider: 'none',
      voice: null
    }
  }));
};

/**
 * Arbitrary for generating session configs with specific language
 */
export const sessionConfigWithLanguageArbitrary = (
  language: string
): fc.Arbitrary<SessionConfig> => {
  return sessionConfigArbitrary().map(config => ({
    ...config,
    language
  }));
};
