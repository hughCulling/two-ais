// tests/helpers/helpers.test.ts
// Tests to verify helper functions work correctly

import { describe, it, expect } from 'vitest';
import {
  createMockTimestamp,
  createMockTimestampFromMillis,
  createTimestampSequence,
  createMockUser,
  waitFor,
  delay,
  generateConversationId,
  generateMessageId,
  generateUserId,
} from './firebase-helpers';
import {
  mockUser,
  mockConversation,
  mockMessage,
  mockSessionConfig,
  createMockMessageSequence,
  createMockConversation,
  createMockMessage,
  createMockSessionConfig,
} from './test-data';

describe('Firebase Helpers', () => {
  describe('createMockTimestamp', () => {
    it('should create a valid Firestore timestamp', () => {
      const timestamp = createMockTimestamp();
      expect(timestamp).toBeDefined();
      expect(timestamp.toMillis()).toBeGreaterThan(0);
    });

    it('should create timestamp from specific date', () => {
      const date = new Date('2024-01-01');
      const timestamp = createMockTimestamp(date);
      expect(timestamp.toDate().getTime()).toBe(date.getTime());
    });
  });

  describe('createMockTimestampFromMillis', () => {
    it('should create timestamp from milliseconds', () => {
      const millis = 1704067200000; // 2024-01-01
      const timestamp = createMockTimestampFromMillis(millis);
      expect(timestamp.toMillis()).toBe(millis);
    });
  });

  describe('createTimestampSequence', () => {
    it('should create sequence of timestamps', () => {
      const sequence = createTimestampSequence(5);
      expect(sequence).toHaveLength(5);
      
      // Verify timestamps are in ascending order
      for (let i = 1; i < sequence.length; i++) {
        expect(sequence[i].toMillis()).toBeGreaterThan(sequence[i - 1].toMillis());
      }
    });

    it('should respect increment parameter', () => {
      const increment = 5000; // 5 seconds
      const sequence = createTimestampSequence(3, new Date(), increment);
      
      const diff1 = sequence[1].toMillis() - sequence[0].toMillis();
      const diff2 = sequence[2].toMillis() - sequence[1].toMillis();
      
      expect(diff1).toBe(increment);
      expect(diff2).toBe(increment);
    });
  });

  describe('createMockUser', () => {
    it('should create a mock user with default values', () => {
      const user = createMockUser();
      expect(user.uid).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.getIdToken).toBeDefined();
    });

    it('should allow overriding user properties', () => {
      const user = createMockUser({
        uid: 'custom-uid',
        email: 'custom@example.com',
      });
      expect(user.uid).toBe('custom-uid');
      expect(user.email).toBe('custom@example.com');
    });

    it('should return a valid ID token', async () => {
      const user = createMockUser();
      const token = await user.getIdToken();
      expect(token).toBe('mock-id-token');
    });
  });

  describe('delay', () => {
    it('should delay for specified milliseconds', async () => {
      const start = Date.now();
      await delay(100);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(90); // Allow some tolerance
    });
  });

  describe('ID generators', () => {
    it('should generate unique conversation IDs', () => {
      const id1 = generateConversationId();
      const id2 = generateConversationId();
      expect(id1).not.toBe(id2);
      expect(id1).toContain('conv-');
    });

    it('should generate unique message IDs', () => {
      const id1 = generateMessageId();
      const id2 = generateMessageId();
      expect(id1).not.toBe(id2);
      expect(id1).toContain('msg-');
    });

    it('should generate unique user IDs', () => {
      const id1 = generateUserId();
      const id2 = generateUserId();
      expect(id1).not.toBe(id2);
      expect(id1).toContain('user-');
    });
  });
});

describe('Test Data Fixtures', () => {
  describe('mockUser', () => {
    it('should have required properties', () => {
      expect(mockUser.uid).toBeDefined();
      expect(mockUser.email).toBeDefined();
      expect(mockUser.getIdToken).toBeDefined();
    });
  });

  describe('mockConversation', () => {
    it('should have required conversation properties', () => {
      expect(mockConversation.userId).toBeDefined();
      expect(mockConversation.agentA_llm).toBeDefined();
      expect(mockConversation.agentB_llm).toBeDefined();
      expect(mockConversation.turn).toMatch(/^(agentA|agentB)$/);
      expect(mockConversation.status).toBe('running');
    });
  });

  describe('mockMessage', () => {
    it('should have required message properties', () => {
      expect(mockMessage.id).toBeDefined();
      expect(mockMessage.role).toBeDefined();
      expect(mockMessage.content).toBeDefined();
      expect(mockMessage.timestamp).toBeDefined();
    });
  });

  describe('mockSessionConfig', () => {
    it('should have required session config properties', () => {
      expect(mockSessionConfig.agentA_llm).toBeDefined();
      expect(mockSessionConfig.agentB_llm).toBeDefined();
      expect(mockSessionConfig.ttsEnabled).toBeDefined();
      expect(mockSessionConfig.initialSystemPrompt).toBeDefined();
    });
  });

  describe('createMockMessageSequence', () => {
    it('should create sequence of messages', () => {
      const messages = createMockMessageSequence(5);
      expect(messages).toHaveLength(5);
      
      // Verify messages alternate between agents
      expect(messages[0].role).toBe('agentA');
      expect(messages[1].role).toBe('agentB');
      expect(messages[2].role).toBe('agentA');
    });

    it('should create messages in chronological order', () => {
      const messages = createMockMessageSequence(5);
      
      for (let i = 1; i < messages.length; i++) {
        const prevTime = messages[i - 1].timestamp?.toMillis() || 0;
        const currTime = messages[i].timestamp?.toMillis() || 0;
        expect(currTime).toBeGreaterThan(prevTime);
      }
    });
  });

  describe('createMockConversation', () => {
    it('should create conversation with overrides', () => {
      const conversation = createMockConversation({
        status: 'stopped',
        turn: 'agentB',
      });
      expect(conversation.status).toBe('stopped');
      expect(conversation.turn).toBe('agentB');
      expect(conversation.userId).toBe(mockConversation.userId); // Other props preserved
    });
  });

  describe('createMockMessage', () => {
    it('should create message with overrides', () => {
      const message = createMockMessage({
        role: 'user',
        content: 'Custom content',
      });
      expect(message.role).toBe('user');
      expect(message.content).toBe('Custom content');
      expect(message.id).toBe(mockMessage.id); // Other props preserved
    });
  });

  describe('createMockSessionConfig', () => {
    it('should create session config with overrides', () => {
      const config = createMockSessionConfig({
        ttsEnabled: true,
        language: 'es',
      });
      expect(config.ttsEnabled).toBe(true);
      expect(config.language).toBe('es');
      expect(config.agentA_llm).toBe(mockSessionConfig.agentA_llm); // Other props preserved
    });
  });
});
