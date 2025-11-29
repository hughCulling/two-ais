// tests/generators/generators.test.ts
// Basic tests to verify generators work correctly

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { conversationConfigArbitrary } from './conversation';
import { messageArbitrary, orderedMessagesArbitrary } from './messages';
import { sessionConfigArbitrary, invalidSessionConfigArbitrary } from './sessionConfig';
import { ttsSettingsArbitrary, enabledTTSSettingsArbitrary } from './ttsSettings';

describe('Test Generators', () => {
  describe('conversationConfigArbitrary', () => {
    it('should generate valid conversation configs', () => {
      fc.assert(
        fc.property(conversationConfigArbitrary(), (config) => {
          expect(config).toHaveProperty('userId');
          expect(config).toHaveProperty('agentA_llm');
          expect(config).toHaveProperty('agentB_llm');
          expect(config).toHaveProperty('turn');
          expect(config).toHaveProperty('status');
          expect(config.status).toBe('running');
          expect(['agentA', 'agentB']).toContain(config.turn);
        }),
        { numRuns: 10 }
      );
    });
  });

  describe('messageArbitrary', () => {
    it('should generate valid messages', () => {
      fc.assert(
        fc.property(messageArbitrary(), (message) => {
          expect(message).toHaveProperty('id');
          expect(message).toHaveProperty('role');
          expect(message).toHaveProperty('content');
          expect(['agentA', 'agentB', 'user', 'system']).toContain(message.role);
          expect(message.content.length).toBeGreaterThan(0);
          expect(message.content.length).toBeLessThanOrEqual(4000);
        }),
        { numRuns: 10 }
      );
    });
  });

  describe('orderedMessagesArbitrary', () => {
    it('should generate messages ordered by timestamp', () => {
      fc.assert(
        fc.property(orderedMessagesArbitrary(2, 10), (messages) => {
          for (let i = 1; i < messages.length; i++) {
            const prevTime = messages[i - 1].timestamp?.toMillis() || 0;
            const currTime = messages[i].timestamp?.toMillis() || 0;
            expect(currTime).toBeGreaterThanOrEqual(prevTime);
          }
        }),
        { numRuns: 10 }
      );
    });
  });

  describe('sessionConfigArbitrary', () => {
    it('should generate valid session configs', () => {
      fc.assert(
        fc.property(sessionConfigArbitrary(), (config) => {
          expect(config).toHaveProperty('agentA_llm');
          expect(config).toHaveProperty('agentB_llm');
          expect(config).toHaveProperty('ttsEnabled');
          expect(config).toHaveProperty('agentA_tts');
          expect(config).toHaveProperty('agentB_tts');
          expect(config).toHaveProperty('initialSystemPrompt');
          expect(typeof config.ttsEnabled).toBe('boolean');
        }),
        { numRuns: 10 }
      );
    });
  });

  describe('invalidSessionConfigArbitrary', () => {
    it('should generate invalid session configs', () => {
      fc.assert(
        fc.property(invalidSessionConfigArbitrary(), (config) => {
          // At least one validation rule should be violated
          const hasEmptyLLM = config.agentA_llm === '' || config.agentB_llm === '';
          const hasTTSIssue = config.ttsEnabled && (
            config.agentA_tts.provider === '' ||
            config.agentB_tts.provider === '' ||
            (config.agentA_tts.provider === 'browser' && config.agentA_tts.voice === null) ||
            (config.agentB_tts.provider === 'browser' && config.agentB_tts.voice === null)
          );
          expect(hasEmptyLLM || hasTTSIssue).toBe(true);
        }),
        { numRuns: 10 }
      );
    });
  });

  describe('ttsSettingsArbitrary', () => {
    it('should generate valid TTS settings', () => {
      fc.assert(
        fc.property(ttsSettingsArbitrary(), (settings) => {
          expect(settings).toHaveProperty('enabled');
          expect(settings).toHaveProperty('agentA');
          expect(settings).toHaveProperty('agentB');
          expect(typeof settings.enabled).toBe('boolean');
          expect(settings.agentA).toHaveProperty('provider');
          expect(settings.agentB).toHaveProperty('provider');
        }),
        { numRuns: 10 }
      );
    });
  });

  describe('enabledTTSSettingsArbitrary', () => {
    it('should generate TTS settings with enabled=true', () => {
      fc.assert(
        fc.property(enabledTTSSettingsArbitrary(), (settings) => {
          expect(settings.enabled).toBe(true);
          expect(settings.agentA.provider).not.toBe('none');
          expect(settings.agentB.provider).not.toBe('none');
        }),
        { numRuns: 10 }
      );
    });
  });
});
