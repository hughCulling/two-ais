// tests/session-creation.test.ts
// Unit tests for session creation validation, particularly API key requirements

import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Mock LLM info structure
 */
interface LLMInfo {
  id: string;
  name: string;
  provider: string;
  apiKeySecretName: string;
}

/**
 * Simulates the validation logic from SessionSetupForm and API route
 * that checks if required API keys are present before allowing session creation
 */
function validateApiKeysForSession(
  agentA_llm: string,
  agentB_llm: string,
  savedKeyStatus: Record<string, boolean>,
  getLLMInfo: (id: string) => LLMInfo | null
): { valid: boolean; error?: string } {
  const agentAOption = getLLMInfo(agentA_llm);
  const agentBOption = getLLMInfo(agentB_llm);

  if (!agentAOption || !agentBOption) {
    return { valid: false, error: 'Please select a model for both Agent A and Agent B.' };
  }

  // Check API keys (skip for Ollama which doesn't need them)
  const agentARequiredLLMKey = agentAOption.apiKeySecretName;
  const agentBRequiredLLMKey = agentBOption.apiKeySecretName;
  const isAgentALLMKeyMissing = agentAOption.provider !== 'Ollama' && !savedKeyStatus[agentARequiredLLMKey];
  const isAgentBLLMKeyMissing = agentBOption.provider !== 'Ollama' && !savedKeyStatus[agentBRequiredLLMKey];

  if (isAgentALLMKeyMissing || isAgentBLLMKeyMissing) {
    const missingProviders = new Set<string>();
    if (isAgentALLMKeyMissing) missingProviders.add(agentAOption.provider);
    if (isAgentBLLMKeyMissing) missingProviders.add(agentBOption.provider);
    const missingKeysMsg = 'Missing required LLM API key in Settings for: ' + 
      Array.from(missingProviders).join(' and ') + '.';
    return { valid: false, error: missingKeysMsg };
  }

  return { valid: true };
}

describe('Session Creation - Missing API Keys', () => {
  // Mock LLM info lookup function
  const mockLLMInfo: Record<string, LLMInfo> = {
    'mistral:mistral-large-latest': {
      id: 'mistral:mistral-large-latest',
      name: 'Mistral Large',
      provider: 'Mistral',
      apiKeySecretName: 'mistral'
    },
    'openai:gpt-4': {
      id: 'openai:gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      apiKeySecretName: 'openai'
    },
    'anthropic:claude-3-opus': {
      id: 'anthropic:claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      apiKeySecretName: 'anthropic'
    },
    'ollama:qwen2.5:3b': {
      id: 'ollama:qwen2.5:3b',
      name: 'Qwen 2.5 3B',
      provider: 'Ollama',
      apiKeySecretName: 'ollama'
    },
    'ollama:gemma2:2b': {
      id: 'ollama:gemma2:2b',
      name: 'Gemma 2 2B',
      provider: 'Ollama',
      apiKeySecretName: 'ollama'
    }
  };

  const getLLMInfo = (id: string): LLMInfo | null => mockLLMInfo[id] || null;

  describe('Requirement 6.5: Missing API keys prevent session creation', () => {
    it('should prevent session creation when Agent A API key is missing', () => {
      const savedKeyStatus = {
        mistral: false, // Missing
        openai: true
      };

      const result = validateApiKeysForSession(
        'mistral:mistral-large-latest',
        'openai:gpt-4',
        savedKeyStatus,
        getLLMInfo
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Missing required LLM API key');
      expect(result.error).toContain('Mistral');
    });

    it('should prevent session creation when Agent B API key is missing', () => {
      const savedKeyStatus = {
        mistral: true,
        openai: false // Missing
      };

      const result = validateApiKeysForSession(
        'mistral:mistral-large-latest',
        'openai:gpt-4',
        savedKeyStatus,
        getLLMInfo
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Missing required LLM API key');
      expect(result.error).toContain('OpenAI');
    });

    it('should prevent session creation when both API keys are missing', () => {
      const savedKeyStatus = {
        mistral: false, // Missing
        openai: false   // Missing
      };

      const result = validateApiKeysForSession(
        'mistral:mistral-large-latest',
        'openai:gpt-4',
        savedKeyStatus,
        getLLMInfo
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Missing required LLM API key');
      expect(result.error).toContain('Mistral');
      expect(result.error).toContain('OpenAI');
    });

    it('should allow session creation when both API keys are present', () => {
      const savedKeyStatus = {
        mistral: true,
        openai: true
      };

      const result = validateApiKeysForSession(
        'mistral:mistral-large-latest',
        'openai:gpt-4',
        savedKeyStatus,
        getLLMInfo
      );

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should allow session creation with Ollama models without API keys', () => {
      const savedKeyStatus = {
        // No Ollama key needed
      };

      const result = validateApiKeysForSession(
        'ollama:qwen2.5:3b',
        'ollama:gemma2:2b',
        savedKeyStatus,
        getLLMInfo
      );

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should allow session creation with one Ollama and one API-based model when API key is present', () => {
      const savedKeyStatus = {
        mistral: true
      };

      const result = validateApiKeysForSession(
        'mistral:mistral-large-latest',
        'ollama:gemma2:2b',
        savedKeyStatus,
        getLLMInfo
      );

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should prevent session creation with one Ollama and one API-based model when API key is missing', () => {
      const savedKeyStatus = {
        mistral: false // Missing
      };

      const result = validateApiKeysForSession(
        'mistral:mistral-large-latest',
        'ollama:gemma2:2b',
        savedKeyStatus,
        getLLMInfo
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Missing required LLM API key');
      expect(result.error).toContain('Mistral');
    });

    it('should provide clear error message identifying missing provider', () => {
      const savedKeyStatus = {
        anthropic: false // Missing
      };

      const result = validateApiKeysForSession(
        'anthropic:claude-3-opus',
        'ollama:qwen2.5:3b',
        savedKeyStatus,
        getLLMInfo
      );

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toMatch(/Missing required LLM API key in Settings for: Anthropic\./);
    });

    it('should handle missing LLM info gracefully', () => {
      const savedKeyStatus = {
        mistral: true
      };

      const result = validateApiKeysForSession(
        'invalid:model-id',
        'mistral:mistral-large-latest',
        savedKeyStatus,
        getLLMInfo
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Please select a model for both Agent A and Agent B');
    });

    it('should combine multiple missing providers in error message', () => {
      const savedKeyStatus = {
        mistral: false,  // Missing
        anthropic: false // Missing
      };

      const result = validateApiKeysForSession(
        'mistral:mistral-large-latest',
        'anthropic:claude-3-opus',
        savedKeyStatus,
        getLLMInfo
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Missing required LLM API key');
      // Should mention both providers
      expect(result.error).toMatch(/Mistral.*and.*Anthropic|Anthropic.*and.*Mistral/);
    });
  });

  describe('Error message clarity', () => {
    it('should provide actionable error message directing user to Settings', () => {
      const savedKeyStatus = {
        openai: false
      };

      const result = validateApiKeysForSession(
        'openai:gpt-4',
        'ollama:qwen2.5:3b',
        savedKeyStatus,
        getLLMInfo
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Settings');
      expect(result.error).toContain('OpenAI');
    });

    it('should use singular form when one provider is missing', () => {
      const savedKeyStatus = {
        mistral: false
      };

      const result = validateApiKeysForSession(
        'mistral:mistral-large-latest',
        'ollama:gemma2:2b',
        savedKeyStatus,
        getLLMInfo
      );

      expect(result.valid).toBe(false);
      // Should not use "and" when only one provider
      expect(result.error).not.toMatch(/and/);
      expect(result.error).toContain('Mistral');
    });

    it('should use "and" when multiple providers are missing', () => {
      const savedKeyStatus = {
        mistral: false,
        openai: false
      };

      const result = validateApiKeysForSession(
        'mistral:mistral-large-latest',
        'openai:gpt-4',
        savedKeyStatus,
        getLLMInfo
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain('and');
    });
  });
});
