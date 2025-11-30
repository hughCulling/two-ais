// tests/generators/conversation.ts
// Property-based test generators for conversation configurations

import * as fc from 'fast-check';
import { Timestamp } from 'firebase/firestore';

/**
 * Interface matching ConversationData from the application
 */
export interface ConversationConfig {
  userId: string;
  agentA_llm: string;
  agentB_llm: string;
  language?: string;
  turn: 'agentA' | 'agentB';
  status: 'running' | 'stopped' | 'error';
  createdAt: Timestamp;
  lastActivity: Timestamp;
  apiSecretVersions: { [key: string]: string };
  ttsSettings?: {
    enabled: boolean;
    agentA: { provider: string; voice: string | null };
    agentB: { provider: string; voice: string | null };
  };
  waitingForTTSEndSignal?: boolean;
  errorMessage?: string;
  errorContext?: string;
  lastPlayedAgentMessageId?: string;
}

/**
 * Arbitrary for generating random valid conversation configurations
 * Supports Mistral and Ollama model selections as per requirements
 */
export const conversationConfigArbitrary = (): fc.Arbitrary<ConversationConfig> => {
  return fc.record({
    userId: fc.uuid(),
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
    language: fc.option(
      fc.constantFrom('en', 'es', 'fr', 'de', 'ja', 'zh', 'pt', 'it', 'ru', 'ar'),
      { nil: undefined }
    ),
    turn: fc.constantFrom('agentA' as const, 'agentB' as const),
    status: fc.constant('running' as const),
    createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }).map(d => Timestamp.fromDate(d)),
    lastActivity: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }).map(d => Timestamp.fromDate(d)),
    apiSecretVersions: fc.dictionary(
      fc.constantFrom('mistral', 'openai', 'anthropic', 'google'),
      fc.string({ minLength: 10, maxLength: 50 })
    ),
    ttsSettings: fc.option(
      fc.record({
        enabled: fc.boolean(),
        agentA: fc.record({
          provider: fc.constantFrom('browser', 'none'),
          voice: fc.option(fc.string({ minLength: 5, maxLength: 50 }), { nil: null })
        }),
        agentB: fc.record({
          provider: fc.constantFrom('browser', 'none'),
          voice: fc.option(fc.string({ minLength: 5, maxLength: 50 }), { nil: null })
        })
      }),
      { nil: undefined }
    ),
    waitingForTTSEndSignal: fc.option(fc.boolean(), { nil: undefined }),
    errorMessage: fc.option(fc.string({ minLength: 10, maxLength: 200 }), { nil: undefined }),
    errorContext: fc.option(fc.string({ minLength: 10, maxLength: 500 }), { nil: undefined }),
    lastPlayedAgentMessageId: fc.option(fc.uuid(), { nil: undefined })
  });
};

/**
 * Arbitrary for generating conversation configs with specific status
 */
export const conversationConfigWithStatusArbitrary = (
  status: 'running' | 'stopped' | 'error'
): fc.Arbitrary<ConversationConfig> => {
  return conversationConfigArbitrary().map(config => ({
    ...config,
    status
  }));
};

/**
 * Arbitrary for generating stopped conversation configs
 */
export const stoppedConversationConfigArbitrary = (): fc.Arbitrary<ConversationConfig> => {
  return conversationConfigWithStatusArbitrary('stopped');
};

/**
 * Arbitrary for generating error conversation configs
 */
export const errorConversationConfigArbitrary = (): fc.Arbitrary<ConversationConfig> => {
  return conversationConfigWithStatusArbitrary('error').map(config => ({
    ...config,
    errorMessage: 'Test error message',
    errorContext: 'Test error context'
  }));
};
