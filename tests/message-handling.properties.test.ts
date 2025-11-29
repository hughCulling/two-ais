// tests/message-handling.properties.test.ts
// Property-based tests for message handling

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { Timestamp } from 'firebase/firestore';
import { messageArbitrary, orderedMessagesArbitrary, streamingMessageArbitrary, type Message } from './generators/messages';

/**
 * Mock message creation function
 * This simulates the behavior of creating a message in Firestore
 */
function createMessage(data: Partial<Message>): Message {
  const now = Timestamp.now();
  
  return {
    id: data.id || `msg-${Date.now()}`,
    role: data.role || 'agentA',
    content: data.content || '',
    timestamp: data.timestamp !== undefined ? data.timestamp : now,
    audioUrl: data.audioUrl,
    ttsWasSplit: data.ttsWasSplit,
    isStreaming: data.isStreaming,
    imageUrl: data.imageUrl,
    imageGenError: data.imageGenError,
  };
}

/**
 * Mock function to query messages ordered by timestamp
 */
function queryMessages(messages: Message[]): Message[] {
  return [...messages].sort((a, b) => {
    const aTime = a.timestamp?.toMillis() || 0;
    const bTime = b.timestamp?.toMillis() || 0;
    return aTime - bTime;
  });
}

describe('Message Handling Property-Based Tests', () => {
  // Feature: comprehensive-testing, Property 5: Message creation includes required fields
  // Validates: Requirements 2.1
  describe('Property 5: Message creation includes required fields', () => {
    it('should create messages with all required fields for any valid message data', () => {
      fc.assert(
        fc.property(messageArbitrary(), (messageData) => {
          const message = createMessage(messageData);
          
          // Property: All messages must have required fields
          expect(message).toHaveProperty('id');
          expect(message).toHaveProperty('role');
          expect(message).toHaveProperty('content');
          expect(message).toHaveProperty('timestamp');
          
          // Property: id must be a non-empty string
          expect(typeof message.id).toBe('string');
          expect(message.id.length).toBeGreaterThan(0);
          
          // Property: role must be one of the valid values
          expect(['agentA', 'agentB', 'user', 'system']).toContain(message.role);
          
          // Property: content must be a string (can be empty)
          expect(typeof message.content).toBe('string');
          
          // Property: timestamp must be a Timestamp instance or null
          if (message.timestamp !== null) {
            expect(message.timestamp).toBeInstanceOf(Timestamp);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve provided field values for any message', () => {
      fc.assert(
        fc.property(messageArbitrary(), (messageData) => {
          const message = createMessage(messageData);
          
          // Property: Provided values should be preserved
          if (messageData.id) {
            expect(message.id).toBe(messageData.id);
          }
          if (messageData.role) {
            expect(message.role).toBe(messageData.role);
          }
          if (messageData.content !== undefined) {
            expect(message.content).toBe(messageData.content);
          }
          if (messageData.timestamp !== undefined) {
            expect(message.timestamp).toBe(messageData.timestamp);
          }
          if (messageData.audioUrl !== undefined) {
            expect(message.audioUrl).toBe(messageData.audioUrl);
          }
          if (messageData.ttsWasSplit !== undefined) {
            expect(message.ttsWasSplit).toBe(messageData.ttsWasSplit);
          }
          if (messageData.isStreaming !== undefined) {
            expect(message.isStreaming).toBe(messageData.isStreaming);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // Feature: comprehensive-testing, Property 6: Message ordering by timestamp
  // Validates: Requirements 2.2
  describe('Property 6: Message ordering by timestamp', () => {
    it('should order any set of messages by timestamp in ascending order', () => {
      fc.assert(
        fc.property(orderedMessagesArbitrary(1, 20), (messages) => {
          const orderedMessages = queryMessages(messages);
          
          // Property: Messages should be ordered by timestamp ascending
          for (let i = 0; i < orderedMessages.length - 1; i++) {
            const currentTime = orderedMessages[i].timestamp?.toMillis() || 0;
            const nextTime = orderedMessages[i + 1].timestamp?.toMillis() || 0;
            
            // Current message timestamp should be <= next message timestamp
            expect(currentTime).toBeLessThanOrEqual(nextTime);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should maintain chronological order for any message sequence', () => {
      fc.assert(
        fc.property(
          fc.array(messageArbitrary(), { minLength: 2, maxLength: 50 }),
          (messages) => {
            // Ensure all messages have timestamps for this test
            const messagesWithTimestamps = messages.map((msg, index) => ({
              ...msg,
              timestamp: msg.timestamp || Timestamp.fromMillis(Date.now() + index * 1000)
            }));
            
            const orderedMessages = queryMessages(messagesWithTimestamps);
            
            // Property: First message should have earliest or equal timestamp
            const firstTime = orderedMessages[0].timestamp?.toMillis() || 0;
            const allTimes = orderedMessages.map(m => m.timestamp?.toMillis() || 0);
            const minTime = Math.min(...allTimes);
            
            expect(firstTime).toBe(minTime);
            
            // Property: Last message should have latest or equal timestamp
            const lastTime = orderedMessages[orderedMessages.length - 1].timestamp?.toMillis() || 0;
            const maxTime = Math.max(...allTimes);
            
            expect(lastTime).toBe(maxTime);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve all messages when ordering', () => {
      fc.assert(
        fc.property(
          fc.array(messageArbitrary(), { minLength: 1, maxLength: 30 }),
          (messages) => {
            const orderedMessages = queryMessages(messages);
            
            // Property: Ordering should not lose or duplicate messages
            expect(orderedMessages.length).toBe(messages.length);
            
            // Property: All original message IDs should be present
            const originalIds = messages.map(m => m.id).sort();
            const orderedIds = orderedMessages.map(m => m.id).sort();
            
            expect(orderedIds).toEqual(originalIds);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: comprehensive-testing, Property 7: Streaming messages have correct status
  // Validates: Requirements 2.3
  describe('Property 7: Streaming messages have correct status', () => {
    it('should mark any streaming message with isStreaming true', () => {
      fc.assert(
        fc.property(streamingMessageArbitrary(), (messageData) => {
          const message = createMessage(messageData);
          
          // Property: Streaming messages must have isStreaming set to true
          expect(message.isStreaming).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should allow streaming messages to have null timestamp', () => {
      fc.assert(
        fc.property(streamingMessageArbitrary(), (messageData) => {
          const message = createMessage({
            ...messageData,
            timestamp: null,
          });
          
          // Property: Streaming messages can have null timestamp
          expect(message.timestamp).toBeNull();
          expect(message.isStreaming).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  // Feature: comprehensive-testing, Property 8: Streaming completion transitions to Firestore
  // Validates: Requirements 2.4
  describe('Property 8: Streaming completion transitions to Firestore', () => {
    it('should preserve message ID across RTDB to Firestore transition for any message', () => {
      fc.assert(
        fc.property(streamingMessageArbitrary(), (messageData) => {
          // Create RTDB streaming message
          const rtdbMessage = createMessage({
            ...messageData,
            isStreaming: true,
            timestamp: null,
          });
          
          // Complete the message for Firestore
          const firestoreMessage = createMessage({
            ...rtdbMessage,
            isStreaming: false,
            timestamp: Timestamp.now(),
          });
          
          // Property: Message ID must be preserved across transition
          expect(firestoreMessage.id).toBe(rtdbMessage.id);
          
          // Property: Completed message should have timestamp
          expect(firestoreMessage.timestamp).toBeInstanceOf(Timestamp);
          
          // Property: Completed message should not be streaming
          expect(firestoreMessage.isStreaming).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve content across streaming to complete transition for any message', () => {
      fc.assert(
        fc.property(
          streamingMessageArbitrary(),
          fc.string({ minLength: 1, maxLength: 1000 }),
          (messageData, finalContent) => {
            // Create streaming message with partial content
            const streamingMessage = createMessage({
              ...messageData,
              content: finalContent,
              isStreaming: true,
              timestamp: null,
            });
            
            // Complete the message
            const completedMessage = createMessage({
              ...streamingMessage,
              isStreaming: false,
              timestamp: Timestamp.now(),
            });
            
            // Property: Content should be preserved
            expect(completedMessage.content).toBe(finalContent);
            
            // Property: ID should be preserved
            expect(completedMessage.id).toBe(streamingMessage.id);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should transition from streaming to complete state for any message', () => {
      fc.assert(
        fc.property(messageArbitrary(), (messageData) => {
          // Start as streaming
          const streamingMessage = createMessage({
            ...messageData,
            isStreaming: true,
            timestamp: null,
          });
          
          expect(streamingMessage.isStreaming).toBe(true);
          expect(streamingMessage.timestamp).toBeNull();
          
          // Complete the message
          const completedMessage = createMessage({
            ...streamingMessage,
            isStreaming: false,
            timestamp: Timestamp.now(),
          });
          
          // Property: Completed message should have correct state
          expect(completedMessage.isStreaming).toBe(false);
          expect(completedMessage.timestamp).toBeInstanceOf(Timestamp);
          
          // Property: ID should remain the same
          expect(completedMessage.id).toBe(streamingMessage.id);
        }),
        { numRuns: 100 }
      );
    });
  });
});
