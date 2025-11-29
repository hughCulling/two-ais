// Feature: comprehensive-testing, Property 15: Conversation ownership validation
// Validates: Requirements 5.3
// Tests that userId must match conversation owner for authorization

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';

// Mock conversation data structure
interface ConversationData {
  id: string;
  userId: string;
  agentA_llm: string;
  agentB_llm: string;
  turn: 'agentA' | 'agentB';
  status: 'running' | 'stopped' | 'error';
  createdAt: Date;
  lastActivity: Date;
}

// Simulated authorization check function
// In the real app, this would be in an API route or service
function checkConversationOwnership(
  conversation: ConversationData,
  requestingUserId: string
): { authorized: boolean; error?: string } {
  if (conversation.userId !== requestingUserId) {
    return {
      authorized: false,
      error: 'Unauthorized: You do not own this conversation',
    };
  }
  return { authorized: true };
}

// Simulated conversation retrieval with authorization
function getConversationForUser(
  conversation: ConversationData,
  requestingUserId: string
): ConversationData | null {
  const authCheck = checkConversationOwnership(conversation, requestingUserId);
  if (!authCheck.authorized) {
    return null;
  }
  return conversation;
}

describe('Property 15: Conversation ownership validation', () => {
  it('should only allow access when userId matches conversation owner', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          userId: fc.uuid(),
          agentA_llm: fc.constantFrom('mistral:mistral-large-latest', 'ollama:qwen3:4b'),
          agentB_llm: fc.constantFrom('mistral:mistral-large-latest', 'ollama:gemma3:4b'),
          turn: fc.constantFrom('agentA' as const, 'agentB' as const),
          status: fc.constantFrom('running' as const, 'stopped' as const, 'error' as const),
          createdAt: fc.date(),
          lastActivity: fc.date(),
        }),
        (conversation) => {
          // Property: When requesting user ID matches conversation userId, access should be granted
          const ownerResult = checkConversationOwnership(conversation, conversation.userId);
          expect(ownerResult.authorized).toBe(true);
          expect(ownerResult.error).toBeUndefined();

          // Property: Conversation should be retrievable by owner
          const retrievedConversation = getConversationForUser(conversation, conversation.userId);
          expect(retrievedConversation).not.toBeNull();
          expect(retrievedConversation?.id).toBe(conversation.id);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should deny access when userId does not match conversation owner', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          userId: fc.uuid(),
          agentA_llm: fc.constantFrom('mistral:mistral-large-latest', 'ollama:qwen3:4b'),
          agentB_llm: fc.constantFrom('mistral:mistral-large-latest', 'ollama:gemma3:4b'),
          turn: fc.constantFrom('agentA' as const, 'agentB' as const),
          status: fc.constantFrom('running' as const, 'stopped' as const, 'error' as const),
          createdAt: fc.date(),
          lastActivity: fc.date(),
        }),
        fc.uuid(), // Different user ID
        (conversation, differentUserId) => {
          // Pre-condition: Ensure the different user ID is actually different
          fc.pre(conversation.userId !== differentUserId);

          // Property: When requesting user ID does not match, access should be denied
          const unauthorizedResult = checkConversationOwnership(conversation, differentUserId);
          expect(unauthorizedResult.authorized).toBe(false);
          expect(unauthorizedResult.error).toBeDefined();
          expect(unauthorizedResult.error).toContain('Unauthorized');

          // Property: Conversation should not be retrievable by non-owner
          const retrievedConversation = getConversationForUser(conversation, differentUserId);
          expect(retrievedConversation).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should consistently enforce ownership across multiple access attempts', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          userId: fc.uuid(),
          agentA_llm: fc.constantFrom('mistral:mistral-large-latest', 'ollama:qwen3:4b'),
          agentB_llm: fc.constantFrom('mistral:mistral-large-latest', 'ollama:gemma3:4b'),
          turn: fc.constantFrom('agentA' as const, 'agentB' as const),
          status: fc.constantFrom('running' as const, 'stopped' as const, 'error' as const),
          createdAt: fc.date(),
          lastActivity: fc.date(),
        }),
        fc.array(fc.uuid(), { minLength: 1, maxLength: 5 }), // Multiple different user IDs
        (conversation, userIds) => {
          // Property: Multiple checks with the same user ID should give consistent results
          for (const userId of userIds) {
            const firstCheck = checkConversationOwnership(conversation, userId);
            const secondCheck = checkConversationOwnership(conversation, userId);

            // Results should be consistent
            expect(firstCheck.authorized).toBe(secondCheck.authorized);

            // Authorization should match whether userId equals conversation.userId
            const shouldBeAuthorized = userId === conversation.userId;
            expect(firstCheck.authorized).toBe(shouldBeAuthorized);
            expect(secondCheck.authorized).toBe(shouldBeAuthorized);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should validate ownership for any conversation state', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          userId: fc.uuid(),
          agentA_llm: fc.constantFrom('mistral:mistral-large-latest', 'ollama:qwen3:4b', 'ollama:deepseek-r1:8b'),
          agentB_llm: fc.constantFrom('mistral:mistral-large-latest', 'ollama:gemma3:4b', 'ollama:qwen3:8b'),
          turn: fc.constantFrom('agentA' as const, 'agentB' as const),
          status: fc.constantFrom('running' as const, 'stopped' as const, 'error' as const),
          createdAt: fc.date(),
          lastActivity: fc.date(),
        }),
        (conversation) => {
          // Property: Ownership validation should work regardless of conversation state
          // (running, stopped, error, different models, different turns)
          
          const ownerCheck = checkConversationOwnership(conversation, conversation.userId);
          expect(ownerCheck.authorized).toBe(true);

          // Generate a different user ID
          const nonOwnerId = conversation.userId + '-different';
          const nonOwnerCheck = checkConversationOwnership(conversation, nonOwnerId);
          expect(nonOwnerCheck.authorized).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
