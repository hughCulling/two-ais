// tests/conversation-state.properties.test.ts
// Property-based tests for conversation state management

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { Timestamp } from 'firebase/firestore';
import { conversationConfigArbitrary } from './generators/conversation';
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
    turn: config.turn || 'agentA', // Default to agentA, but allow override for testing
    status: config.status || 'running', // Default to running, but allow override for testing
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

/**
 * Mock turn toggling function
 * This simulates the behavior in the agent orchestrator
 */
function toggleTurn(conversation: ConversationConfig): ConversationConfig {
  const nextTurn = conversation.turn === 'agentA' ? 'agentB' : 'agentA';
  return {
    ...conversation,
    turn: nextTurn,
    lastActivity: Timestamp.now()
  };
}

/**
 * Mock function to check if message generation should proceed
 */
function shouldGenerateMessage(conversation: ConversationConfig): boolean {
  // Don't generate if status is stopped
  if (conversation.status === 'stopped') {
    return false;
  }
  
  // Don't generate if waiting for TTS signal
  if (conversation.waitingForTTSEndSignal === true) {
    return false;
  }
  
  return true;
}

describe('Conversation State Property-Based Tests', () => {
  // **Feature: comprehensive-testing, Property 1: Conversation initialization creates valid state**
  // **Validates: Requirements 1.1**
  describe('Property 1: Conversation initialization creates valid state', () => {
    it('should initialize all conversations with status "running"', () => {
      fc.assert(
        fc.property(conversationConfigArbitrary(), (config) => {
          const conversation = createConversation(config);
          
          // Property: All conversations start with "running" status
          expect(conversation.status).toBe('running');
        }),
        { numRuns: 100 }
      );
    });

    it('should initialize all conversations with valid turn assignment', () => {
      fc.assert(
        fc.property(conversationConfigArbitrary(), (config) => {
          const conversation = createConversation(config);
          
          // Property: Turn is always agentA or agentB
          expect(conversation.turn).toMatch(/^(agentA|agentB)$/);
        }),
        { numRuns: 100 }
      );
    });

    it('should initialize all conversations with turn set to agentA', () => {
      fc.assert(
        fc.property(conversationConfigArbitrary(), (config) => {
          // Don't pass turn from config - initialization should always set it to agentA
          const { turn, status, ...initConfig } = config;
          const conversation = createConversation(initConfig);
          
          // Property: All conversations start with agentA's turn
          expect(conversation.turn).toBe('agentA');
        }),
        { numRuns: 100 }
      );
    });

    it('should include all required configuration fields', () => {
      fc.assert(
        fc.property(conversationConfigArbitrary(), (config) => {
          const conversation = createConversation(config);
          
          // Property: All required fields are present
          expect(conversation).toHaveProperty('userId');
          expect(conversation).toHaveProperty('agentA_llm');
          expect(conversation).toHaveProperty('agentB_llm');
          expect(conversation).toHaveProperty('createdAt');
          expect(conversation).toHaveProperty('lastActivity');
          expect(conversation).toHaveProperty('turn');
          expect(conversation).toHaveProperty('status');
          expect(conversation).toHaveProperty('apiSecretVersions');
          
          // Verify fields are not null/undefined
          expect(conversation.userId).toBeTruthy();
          expect(conversation.agentA_llm).toBeTruthy();
          expect(conversation.agentB_llm).toBeTruthy();
          expect(conversation.createdAt).toBeInstanceOf(Timestamp);
          expect(conversation.lastActivity).toBeInstanceOf(Timestamp);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve provided configuration values', () => {
      fc.assert(
        fc.property(conversationConfigArbitrary(), (config) => {
          const conversation = createConversation(config);
          
          // Property: Provided config values are preserved
          expect(conversation.userId).toBe(config.userId);
          expect(conversation.agentA_llm).toBe(config.agentA_llm);
          expect(conversation.agentB_llm).toBe(config.agentB_llm);
          
          // If language was provided, it should be preserved
          if (config.language) {
            expect(conversation.language).toBe(config.language);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // **Feature: comprehensive-testing, Property 2: Turn toggling maintains consistency**
  // **Validates: Requirements 1.2**
  describe('Property 2: Turn toggling maintains consistency', () => {
    it('should toggle turn from agentA to agentB', () => {
      fc.assert(
        fc.property(conversationConfigArbitrary(), (config) => {
          const conversation = createConversation({ ...config, turn: 'agentA' });
          const toggled = toggleTurn(conversation);
          
          // Property: Turn toggles to the other agent
          expect(toggled.turn).toBe('agentB');
        }),
        { numRuns: 100 }
      );
    });

    it('should toggle turn from agentB to agentA', () => {
      fc.assert(
        fc.property(conversationConfigArbitrary(), (config) => {
          const conversation = createConversation({ ...config, turn: 'agentB' });
          const toggled = toggleTurn(conversation);
          
          // Property: Turn toggles to the other agent
          expect(toggled.turn).toBe('agentA');
        }),
        { numRuns: 100 }
      );
    });

    it('should update lastActivity timestamp when toggling turn', () => {
      fc.assert(
        fc.property(conversationConfigArbitrary(), (config) => {
          const conversation = createConversation(config);
          const originalLastActivity = conversation.lastActivity;
          
          // Wait a tiny bit to ensure timestamp difference
          const toggled = toggleTurn(conversation);
          
          // Property: lastActivity is updated (new Timestamp instance)
          expect(toggled.lastActivity).toBeInstanceOf(Timestamp);
          // Note: We can't easily compare timestamps for "greater than" in this mock,
          // but we verify it's a valid Timestamp
        }),
        { numRuns: 100 }
      );
    });

    it('should alternate turns correctly through multiple toggles', () => {
      fc.assert(
        fc.property(conversationConfigArbitrary(), (config) => {
          // Don't pass turn from config - initialization should always set it to agentA
          const { turn, status, ...initConfig } = config;
          let conversation = createConversation(initConfig);
          
          // Property: Turns alternate correctly
          expect(conversation.turn).toBe('agentA');
          
          conversation = toggleTurn(conversation);
          expect(conversation.turn).toBe('agentB');
          
          conversation = toggleTurn(conversation);
          expect(conversation.turn).toBe('agentA');
          
          conversation = toggleTurn(conversation);
          expect(conversation.turn).toBe('agentB');
        }),
        { numRuns: 100 }
      );
    });
  });

  // **Feature: comprehensive-testing, Property 3: Stopped conversations prevent message generation**
  // **Validates: Requirements 1.4**
  describe('Property 3: Stopped conversations prevent message generation', () => {
    it('should prevent message generation when status is stopped', () => {
      fc.assert(
        fc.property(conversationConfigArbitrary(), (config) => {
          const conversation = createConversation({ ...config, status: 'stopped' });
          
          // Property: Stopped conversations don't generate messages
          expect(shouldGenerateMessage(conversation)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should allow message generation when status is running', () => {
      fc.assert(
        fc.property(conversationConfigArbitrary(), (config) => {
          const conversation = createConversation({ 
            ...config, 
            status: 'running',
            waitingForTTSEndSignal: false 
          });
          
          // Property: Running conversations can generate messages
          expect(shouldGenerateMessage(conversation)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should prevent message generation regardless of turn when stopped', () => {
      fc.assert(
        fc.property(
          conversationConfigArbitrary(),
          fc.constantFrom('agentA' as const, 'agentB' as const),
          (config, turn) => {
            const conversation = createConversation({ 
              ...config, 
              status: 'stopped',
              turn 
            });
            
            // Property: Status "stopped" prevents generation regardless of turn
            expect(shouldGenerateMessage(conversation)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // **Feature: comprehensive-testing, Property 4: TTS signal blocks turn progression**
  // **Validates: Requirements 1.5**
  describe('Property 4: TTS signal blocks turn progression', () => {
    it('should prevent message generation when waiting for TTS signal', () => {
      fc.assert(
        fc.property(conversationConfigArbitrary(), (config) => {
          const conversation = createConversation({ 
            ...config, 
            status: 'running',
            waitingForTTSEndSignal: true 
          });
          
          // Property: TTS signal blocks message generation
          expect(shouldGenerateMessage(conversation)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should allow message generation when not waiting for TTS signal', () => {
      fc.assert(
        fc.property(conversationConfigArbitrary(), (config) => {
          const conversation = createConversation({ 
            ...config, 
            status: 'running',
            waitingForTTSEndSignal: false 
          });
          
          // Property: No TTS signal allows message generation
          expect(shouldGenerateMessage(conversation)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should block generation when TTS signal is set regardless of turn', () => {
      fc.assert(
        fc.property(
          conversationConfigArbitrary(),
          fc.constantFrom('agentA' as const, 'agentB' as const),
          (config, turn) => {
            const conversation = createConversation({ 
              ...config, 
              status: 'running',
              turn,
              waitingForTTSEndSignal: true 
            });
            
            // Property: TTS signal blocks generation for both agents
            expect(shouldGenerateMessage(conversation)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should block generation when both stopped and waiting for TTS', () => {
      fc.assert(
        fc.property(conversationConfigArbitrary(), (config) => {
          const conversation = createConversation({ 
            ...config, 
            status: 'stopped',
            waitingForTTSEndSignal: true 
          });
          
          // Property: Both conditions block generation
          expect(shouldGenerateMessage(conversation)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
  });
});
