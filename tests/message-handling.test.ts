// tests/message-handling.test.ts
// Unit tests for message handling and persistence

import { describe, it, expect, vi } from 'vitest';
import { Timestamp } from 'firebase/firestore';
import type { Message } from './generators/messages';

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

describe('Message Creation Unit Tests', () => {
  describe('Required Fields', () => {
    it('should create message with all required fields', () => {
      const messageData = {
        id: 'msg-123',
        role: 'agentA' as const,
        content: 'Hello, this is a test message.',
      };

      const message = createMessage(messageData);

      expect(message).toHaveProperty('id');
      expect(message).toHaveProperty('role');
      expect(message).toHaveProperty('content');
      expect(message).toHaveProperty('timestamp');
      expect(message.id).toBe('msg-123');
      expect(message.role).toBe('agentA');
      expect(message.content).toBe('Hello, this is a test message.');
      expect(message.timestamp).toBeInstanceOf(Timestamp);
    });

    it('should create message with role agentA', () => {
      const messageData = {
        role: 'agentA' as const,
        content: 'Message from Agent A',
      };

      const message = createMessage(messageData);

      expect(message.role).toBe('agentA');
    });

    it('should create message with role agentB', () => {
      const messageData = {
        role: 'agentB' as const,
        content: 'Message from Agent B',
      };

      const message = createMessage(messageData);

      expect(message.role).toBe('agentB');
    });

    it('should create message with role user', () => {
      const messageData = {
        role: 'user' as const,
        content: 'Message from user',
      };

      const message = createMessage(messageData);

      expect(message.role).toBe('user');
    });

    it('should create message with role system', () => {
      const messageData = {
        role: 'system' as const,
        content: 'System message',
      };

      const message = createMessage(messageData);

      expect(message.role).toBe('system');
    });

    it('should generate timestamp if not provided', () => {
      const messageData = {
        role: 'agentA' as const,
        content: 'Test message',
      };

      const message = createMessage(messageData);

      expect(message.timestamp).toBeInstanceOf(Timestamp);
    });

    it('should preserve provided timestamp', () => {
      const customTimestamp = Timestamp.fromDate(new Date('2024-01-01'));
      const messageData = {
        role: 'agentA' as const,
        content: 'Test message',
        timestamp: customTimestamp,
      };

      const message = createMessage(messageData);

      expect(message.timestamp).toBe(customTimestamp);
    });
  });

  describe('Optional Fields', () => {
    it('should create message with audioUrl', () => {
      const messageData = {
        role: 'agentA' as const,
        content: 'Message with audio',
        audioUrl: 'https://example.com/audio/msg-123.mp3',
      };

      const message = createMessage(messageData);

      expect(message.audioUrl).toBe('https://example.com/audio/msg-123.mp3');
    });

    it('should create message without audioUrl', () => {
      const messageData = {
        role: 'agentA' as const,
        content: 'Message without audio',
      };

      const message = createMessage(messageData);

      expect(message.audioUrl).toBeUndefined();
    });

    it('should create message with imageUrl', () => {
      const messageData = {
        role: 'agentA' as const,
        content: 'Message with image',
        imageUrl: 'https://example.com/images/img-123.png',
      };

      const message = createMessage(messageData);

      expect(message.imageUrl).toBe('https://example.com/images/img-123.png');
    });

    it('should create message without imageUrl', () => {
      const messageData = {
        role: 'agentA' as const,
        content: 'Message without image',
      };

      const message = createMessage(messageData);

      expect(message.imageUrl).toBeUndefined();
    });

    it('should create message with ttsWasSplit flag', () => {
      const messageData = {
        role: 'agentA' as const,
        content: 'Long message that was split',
        ttsWasSplit: true,
      };

      const message = createMessage(messageData);

      expect(message.ttsWasSplit).toBe(true);
    });

    it('should create message with isStreaming flag', () => {
      const messageData = {
        role: 'agentA' as const,
        content: 'Streaming message',
        isStreaming: true,
      };

      const message = createMessage(messageData);

      expect(message.isStreaming).toBe(true);
    });

    it('should create message with imageGenError', () => {
      const messageData = {
        role: 'agentA' as const,
        content: 'Message with image generation error',
        imageGenError: 'Failed to generate image',
      };

      const message = createMessage(messageData);

      expect(message.imageGenError).toBe('Failed to generate image');
    });
  });

  describe('Content Handling', () => {
    it('should preserve message content exactly', () => {
      const content = 'This is a test message with special characters: !@#$%^&*()';
      const messageData = {
        role: 'agentA' as const,
        content,
      };

      const message = createMessage(messageData);

      expect(message.content).toBe(content);
    });

    it('should handle empty content', () => {
      const messageData = {
        role: 'agentA' as const,
        content: '',
      };

      const message = createMessage(messageData);

      expect(message.content).toBe('');
    });

    it('should handle long content', () => {
      const longContent = 'Lorem ipsum dolor sit amet. '.repeat(200); // ~5400 chars
      const messageData = {
        role: 'agentA' as const,
        content: longContent,
      };

      const message = createMessage(messageData);

      expect(message.content).toBe(longContent);
      expect(message.content.length).toBeGreaterThan(4000);
    });

    it('should preserve Unicode characters', () => {
      const unicodeContent = 'Hello 世界 🌍 مرحبا Привет こんにちは';
      const messageData = {
        role: 'agentA' as const,
        content: unicodeContent,
      };

      const message = createMessage(messageData);

      expect(message.content).toBe(unicodeContent);
    });

    it('should preserve newlines in content', () => {
      const contentWithNewlines = 'First line\n\nSecond line\n\nThird line';
      const messageData = {
        role: 'agentA' as const,
        content: contentWithNewlines,
      };

      const message = createMessage(messageData);

      expect(message.content).toBe(contentWithNewlines);
      expect(message.content).toContain('\n\n');
    });
  });
});

describe('Message Ordering Unit Tests', () => {
  it('should order messages by timestamp in ascending order', () => {
    const messages: Message[] = [
      createMessage({
        id: 'msg-3',
        role: 'agentA',
        content: 'Third message',
        timestamp: Timestamp.fromMillis(3000),
      }),
      createMessage({
        id: 'msg-1',
        role: 'agentA',
        content: 'First message',
        timestamp: Timestamp.fromMillis(1000),
      }),
      createMessage({
        id: 'msg-2',
        role: 'agentB',
        content: 'Second message',
        timestamp: Timestamp.fromMillis(2000),
      }),
    ];

    const orderedMessages = queryMessages(messages);

    expect(orderedMessages[0].id).toBe('msg-1');
    expect(orderedMessages[1].id).toBe('msg-2');
    expect(orderedMessages[2].id).toBe('msg-3');
  });

  it('should maintain order for messages with same timestamp', () => {
    const sameTime = Timestamp.fromMillis(1000);
    const messages: Message[] = [
      createMessage({
        id: 'msg-2',
        role: 'agentB',
        content: 'Second message',
        timestamp: sameTime,
      }),
      createMessage({
        id: 'msg-1',
        role: 'agentA',
        content: 'First message',
        timestamp: sameTime,
      }),
    ];

    const orderedMessages = queryMessages(messages);

    // Should maintain stable sort
    expect(orderedMessages).toHaveLength(2);
    expect(orderedMessages[0].timestamp?.toMillis()).toBe(1000);
    expect(orderedMessages[1].timestamp?.toMillis()).toBe(1000);
  });

  it('should handle empty message array', () => {
    const messages: Message[] = [];

    const orderedMessages = queryMessages(messages);

    expect(orderedMessages).toHaveLength(0);
  });

  it('should handle single message', () => {
    const messages: Message[] = [
      createMessage({
        id: 'msg-1',
        role: 'agentA',
        content: 'Only message',
      }),
    ];

    const orderedMessages = queryMessages(messages);

    expect(orderedMessages).toHaveLength(1);
    expect(orderedMessages[0].id).toBe('msg-1');
  });
});

describe('Streaming Message State Unit Tests', () => {
  describe('RTDB Streaming Status', () => {
    it('should create streaming message with isStreaming true', () => {
      const messageData = {
        role: 'agentA' as const,
        content: 'Streaming content...',
        isStreaming: true,
        timestamp: null,
      };

      const message = createMessage(messageData);

      expect(message.isStreaming).toBe(true);
    });

    it('should create streaming message without timestamp', () => {
      const messageData = {
        role: 'agentA' as const,
        content: 'Streaming content...',
        isStreaming: true,
        timestamp: null,
      };

      const message = createMessage(messageData);

      expect(message.timestamp).toBeNull();
    });

    it('should transition streaming message to complete', () => {
      // Initial streaming message
      const streamingMessage = createMessage({
        id: 'msg-streaming-1',
        role: 'agentA' as const,
        content: 'Partial content...',
        isStreaming: true,
        timestamp: null,
      });

      expect(streamingMessage.isStreaming).toBe(true);
      expect(streamingMessage.timestamp).toBeNull();

      // Complete the message
      const completedMessage = createMessage({
        ...streamingMessage,
        content: 'Complete content.',
        isStreaming: false,
        timestamp: Timestamp.now(),
      });

      expect(completedMessage.isStreaming).toBe(false);
      expect(completedMessage.timestamp).toBeInstanceOf(Timestamp);
      expect(completedMessage.id).toBe(streamingMessage.id); // Same ID
    });

    it('should preserve message ID across RTDB to Firestore transition', () => {
      const messageId = 'msg-transition-123';

      // RTDB streaming message
      const rtdbMessage = createMessage({
        id: messageId,
        role: 'agentA' as const,
        content: 'Streaming...',
        isStreaming: true,
        timestamp: null,
      });

      // Firestore completed message
      const firestoreMessage = createMessage({
        id: messageId,
        role: 'agentA' as const,
        content: 'Complete message.',
        isStreaming: false,
        timestamp: Timestamp.now(),
      });

      expect(rtdbMessage.id).toBe(firestoreMessage.id);
    });

    it('should update content during streaming', () => {
      const messageId = 'msg-stream-update';

      const message1 = createMessage({
        id: messageId,
        role: 'agentA' as const,
        content: 'Hello',
        isStreaming: true,
        timestamp: null,
      });

      const message2 = createMessage({
        id: messageId,
        role: 'agentA' as const,
        content: 'Hello, world',
        isStreaming: true,
        timestamp: null,
      });

      const message3 = createMessage({
        id: messageId,
        role: 'agentA' as const,
        content: 'Hello, world!',
        isStreaming: true,
        timestamp: null,
      });

      expect(message1.content).toBe('Hello');
      expect(message2.content).toBe('Hello, world');
      expect(message3.content).toBe('Hello, world!');
      expect(message1.id).toBe(message2.id);
      expect(message2.id).toBe(message3.id);
    });
  });

  describe('Streaming Completion', () => {
    it('should mark completed message with timestamp', () => {
      const completedMessage = createMessage({
        id: 'msg-completed',
        role: 'agentA' as const,
        content: 'Completed message',
        isStreaming: false,
      });

      expect(completedMessage.isStreaming).toBe(false);
      expect(completedMessage.timestamp).toBeInstanceOf(Timestamp);
    });

    it('should preserve content when completing streaming', () => {
      const finalContent = 'This is the final complete message content.';
      
      const completedMessage = createMessage({
        id: 'msg-preserve',
        role: 'agentA' as const,
        content: finalContent,
        isStreaming: false,
        timestamp: Timestamp.now(),
      });

      expect(completedMessage.content).toBe(finalContent);
    });
  });
});
