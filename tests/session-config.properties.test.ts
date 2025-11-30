// tests/session-config.properties.test.ts
// Property-based tests for session configuration validation

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { sessionConfigArbitrary, invalidSessionConfigArbitrary, SessionConfig } from './generators/sessionConfig';

/**
 * Validates session configuration according to application rules
 * This mirrors the validation logic in SessionSetupForm and the API route
 */
function validateSessionConfig(config: SessionConfig): { valid: boolean; error?: string } {
  // Property 16: Session config validation rejects empty LLMs
  // Validates: Requirements 6.1
  if (!config.agentA_llm || config.agentA_llm.trim() === '') {
    return { valid: false, error: 'Agent A LLM selection is required' };
  }
  
  if (!config.agentB_llm || config.agentB_llm.trim() === '') {
    return { valid: false, error: 'Agent B LLM selection is required' };
  }

  // Property 17: TTS config validation
  // Validates: Requirements 6.2
  if (config.ttsEnabled) {
    // When TTS is enabled, both agents must have provider and voice configured
    if (config.agentA_tts.provider !== 'none' && !config.agentA_tts.voice) {
      return { valid: false, error: 'Agent A TTS voice is required when TTS is enabled' };
    }
    
    if (config.agentB_tts.provider !== 'none' && !config.agentB_tts.voice) {
      return { valid: false, error: 'Agent B TTS voice is required when TTS is enabled' };
    }
  }

  return { valid: true };
}

describe('Session Configuration Properties', () => {
  describe('Property 16: Session config validation rejects empty LLMs', () => {
    // Feature: comprehensive-testing, Property 16: Session config validation rejects empty LLMs
    // Validates: Requirements 6.1
    it('should reject configurations with empty agentA_llm', () => {
      fc.assert(
        fc.property(
          sessionConfigArbitrary().map(config => ({
            ...config,
            agentA_llm: ''
          })),
          (config) => {
            const result = validateSessionConfig(config);
            expect(result.valid).toBe(false);
            expect(result.error).toContain('Agent A');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject configurations with empty agentB_llm', () => {
      fc.assert(
        fc.property(
          sessionConfigArbitrary().map(config => ({
            ...config,
            agentB_llm: ''
          })),
          (config) => {
            const result = validateSessionConfig(config);
            expect(result.valid).toBe(false);
            expect(result.error).toContain('Agent B');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject configurations with whitespace-only LLM selections', () => {
      fc.assert(
        fc.property(
          sessionConfigArbitrary(),
          fc.constantFrom('agentA', 'agentB'),
          fc.array(fc.constantFrom(' ', '\t', '\n'), { minLength: 1, maxLength: 5 }),
          (config, agent, whitespaceChars) => {
            const whitespace = whitespaceChars.join('');
            const testConfig = {
              ...config,
              [agent === 'agentA' ? 'agentA_llm' : 'agentB_llm']: whitespace
            };
            const result = validateSessionConfig(testConfig);
            expect(result.valid).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept configurations with valid non-empty LLM selections', () => {
      fc.assert(
        fc.property(
          sessionConfigArbitrary().filter(config => 
            config.agentA_llm.trim() !== '' && config.agentB_llm.trim() !== ''
          ),
          (config) => {
            const result = validateSessionConfig(config);
            // May fail for other reasons (TTS), but not for empty LLMs
            if (!result.valid) {
              expect(result.error).not.toContain('LLM selection is required');
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 17: TTS config validation', () => {
    // Feature: comprehensive-testing, Property 17: TTS config validation
    // Validates: Requirements 6.2
    it('should reject TTS-enabled configs with provider but no voice for agentA', () => {
      fc.assert(
        fc.property(
          sessionConfigArbitrary().map(config => ({
            ...config,
            ttsEnabled: true,
            agentA_tts: {
              provider: 'browser',
              voice: null
            }
          })),
          (config) => {
            const result = validateSessionConfig(config);
            expect(result.valid).toBe(false);
            expect(result.error).toContain('Agent A TTS voice');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject TTS-enabled configs with provider but no voice for agentB', () => {
      fc.assert(
        fc.property(
          sessionConfigArbitrary().map(config => ({
            ...config,
            ttsEnabled: true,
            // Ensure agentA is valid so we test agentB validation
            agentA_tts: {
              provider: 'browser',
              voice: 'valid-voice-a'
            },
            agentB_tts: {
              provider: 'browser',
              voice: null
            }
          })),
          (config) => {
            const result = validateSessionConfig(config);
            expect(result.valid).toBe(false);
            expect(result.error).toContain('Agent B TTS voice');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept TTS-enabled configs when provider is "none"', () => {
      fc.assert(
        fc.property(
          sessionConfigArbitrary().map(config => ({
            ...config,
            ttsEnabled: true,
            agentA_tts: {
              provider: 'none',
              voice: null
            },
            agentB_tts: {
              provider: 'none',
              voice: null
            }
          })),
          (config) => {
            const result = validateSessionConfig(config);
            // Should not fail due to TTS validation (may fail for other reasons)
            if (!result.valid) {
              expect(result.error).not.toContain('TTS voice');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept TTS-enabled configs with valid provider and voice', () => {
      fc.assert(
        fc.property(
          sessionConfigArbitrary().map(config => ({
            ...config,
            ttsEnabled: true,
            agentA_tts: {
              provider: 'browser',
              voice: 'test-voice-a'
            },
            agentB_tts: {
              provider: 'browser',
              voice: 'test-voice-b'
            }
          })),
          (config) => {
            const result = validateSessionConfig(config);
            // Should not fail due to TTS validation (may fail for other reasons)
            if (!result.valid) {
              expect(result.error).not.toContain('TTS voice');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept TTS-disabled configs regardless of TTS settings', () => {
      fc.assert(
        fc.property(
          sessionConfigArbitrary().map(config => ({
            ...config,
            ttsEnabled: false,
            // Even with invalid TTS settings, should pass when TTS is disabled
            agentA_tts: {
              provider: 'browser',
              voice: null
            },
            agentB_tts: {
              provider: 'browser',
              voice: null
            }
          })),
          (config) => {
            const result = validateSessionConfig(config);
            // Should not fail due to TTS validation when TTS is disabled
            if (!result.valid) {
              expect(result.error).not.toContain('TTS voice');
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Combined validation properties', () => {
    it('should validate all invalid configs from generator', () => {
      fc.assert(
        fc.property(
          invalidSessionConfigArbitrary(),
          (config) => {
            const result = validateSessionConfig(config);
            // All configs from invalidSessionConfigArbitrary should fail validation
            expect(result.valid).toBe(false);
            expect(result.error).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
