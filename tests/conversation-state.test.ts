// tests/conversation-state.test.ts
// Unit tests for conversation state management

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Timestamp } from 'firebase/firestore';
import type { ConversationConfig } from './generators/conversation';

/**
 * Mock conversation creation function
 * This simulates the behavior of the /api/conversation/start endpoint
 */
function createConversation(config: Partial<ConversationConfig>): ConversationConfig {
  const now = Timestamp.now();
  
  return {
    userId: config.userId || 'test-user-id',
    agentA_llm: config.agentA_llm || 'mistral:mistral-large-latest',
    agentB_llm: config.agentB_llm || 'mistral:mistral-large-latest',
    language: config.language || 'en',
    turn: 'agentA', // Always starts with agentA
    status: 'running', // Always starts as running
    createdAt: config.createdAt || now,
    lastActivity: config.lastActivity || now,
    apiSecretVersions: config.apiSecretVersions || {},
    ttsSettings: config.ttsSettings || {
      enabled: false,
      agentA: { provider: 'none', voice: null },
      agentB: { provider: 'none', voice: null }
    },
    waitingForTTSEndSignal: config.waitingForTTSEndSignal || false,
  };
}

describe('Conversation Creation Unit Tests', () => {
  describe('Conversation Initialization', () => {
    it('should initialize conversation with status "running"', () => {
      const config = {
        userId: 'user-123',
        agentA_llm: 'ollama:qwen2.5:3b',
        agentB_llm: 'ollama:gemma2:2b',
      };

      const conversation = createConversation(config);

      expect(conversation.status).toBe('running');
    });

    it('should initialize conversation with turn set to "agentA"', () => {
      const config = {
        userId: 'user-123',
        agentA_llm: 'ollama:qwen2.5:3b',
        agentB_llm: 'ollama:gemma2:2b',
      };

      const conversation = createConversation(config);

      expect(conversation.turn).toBe('agentA');
    });

    it('should include all required fields', () => {
      const config = {
        userId: 'user-123',
        agentA_llm: 'ollama:qwen2.5:3b',
        agentB_llm: 'ollama:gemma2:2b',
      };

      const conversation = createConversation(config);

      // Verify all required fields are present
      expect(conversation).toHaveProperty('userId');
      expect(conversation).toHaveProperty('agentA_llm');
      expect(conversation).toHaveProperty('agentB_llm');
      expect(conversation).toHaveProperty('turn');
      expect(conversation).toHaveProperty('status');
      expect(conversation).toHaveProperty('createdAt');
      expect(conversation).toHaveProperty('lastActivity');
      expect(conversation).toHaveProperty('apiSecretVersions');
      expect(conversation).toHaveProperty('ttsSettings');
    });

    it('should initialize with correct default values', () => {
      const config = {
        userId: 'user-123',
        agentA_llm: 'ollama:qwen2.5:3b',
        agentB_llm: 'ollama:gemma2:2b',
      };

      const conversation = createConversation(config);

      expect(conversation.status).toBe('running');
      expect(conversation.turn).toBe('agentA');
      expect(conversation.waitingForTTSEndSignal).toBe(false);
      expect(conversation.ttsSettings?.enabled).toBe(false);
    });

    it('should preserve provided configuration values', () => {
      const config = {
        userId: 'user-456',
        agentA_llm: 'mistral:mistral-large-latest',
        agentB_llm: 'ollama:deepseek-r1:8b',
        language: 'fr',
      };

      const conversation = createConversation(config);

      expect(conversation.userId).toBe('user-456');
      expect(conversation.agentA_llm).toBe('mistral:mistral-large-latest');
      expect(conversation.agentB_llm).toBe('ollama:deepseek-r1:8b');
      expect(conversation.language).toBe('fr');
    });

    it('should initialize with TTS disabled by default', () => {
      const config = {
        userId: 'user-123',
        agentA_llm: 'ollama:qwen2.5:3b',
        agentB_llm: 'ollama:gemma2:2b',
      };

      const conversation = createConversation(config);

      expect(conversation.ttsSettings?.enabled).toBe(false);
      expect(conversation.ttsSettings?.agentA.provider).toBe('none');
      expect(conversation.ttsSettings?.agentB.provider).toBe('none');
    });

    it('should initialize with empty apiSecretVersions by default', () => {
      const config = {
        userId: 'user-123',
        agentA_llm: 'ollama:qwen2.5:3b',
        agentB_llm: 'ollama:gemma2:2b',
      };

      const conversation = createConversation(config);

      expect(conversation.apiSecretVersions).toEqual({});
    });

    it('should set createdAt and lastActivity timestamps', () => {
      const config = {
        userId: 'user-123',
        agentA_llm: 'ollama:qwen2.5:3b',
        agentB_llm: 'ollama:gemma2:2b',
      };

      const conversation = createConversation(config);

      expect(conversation.createdAt).toBeInstanceOf(Timestamp);
      expect(conversation.lastActivity).toBeInstanceOf(Timestamp);
    });
  });

  describe('Configuration Validation', () => {
    it('should handle Ollama models', () => {
      const config = {
        userId: 'user-123',
        agentA_llm: 'ollama:qwen2.5:3b',
        agentB_llm: 'ollama:gemma2:2b',
      };

      const conversation = createConversation(config);

      expect(conversation.agentA_llm).toContain('ollama:');
      expect(conversation.agentB_llm).toContain('ollama:');
    });

    it('should handle Mistral models', () => {
      const config = {
        userId: 'user-123',
        agentA_llm: 'mistral:mistral-large-latest',
        agentB_llm: 'mistral:mistral-large-latest',
      };

      const conversation = createConversation(config);

      expect(conversation.agentA_llm).toContain('mistral:');
      expect(conversation.agentB_llm).toContain('mistral:');
    });

    it('should handle mixed model providers', () => {
      const config = {
        userId: 'user-123',
        agentA_llm: 'mistral:mistral-large-latest',
        agentB_llm: 'ollama:qwen2.5:3b',
      };

      const conversation = createConversation(config);

      expect(conversation.agentA_llm).toContain('mistral:');
      expect(conversation.agentB_llm).toContain('ollama:');
    });
  });

  describe('TTS Configuration', () => {
    it('should accept TTS configuration when provided', () => {
      const config = {
        userId: 'user-123',
        agentA_llm: 'ollama:qwen2.5:3b',
        agentB_llm: 'ollama:gemma2:2b',
        ttsSettings: {
          enabled: true,
          agentA: { provider: 'browser', voice: 'en-US-Standard-A' },
          agentB: { provider: 'browser', voice: 'en-US-Standard-B' }
        }
      };

      const conversation = createConversation(config);

      expect(conversation.ttsSettings?.enabled).toBe(true);
      expect(conversation.ttsSettings?.agentA.provider).toBe('browser');
      expect(conversation.ttsSettings?.agentB.provider).toBe('browser');
    });
  });
});
