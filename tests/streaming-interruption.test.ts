// tests/streaming-interruption.test.ts
// Unit tests for streaming interruption handling

import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * Mock streaming message state in RTDB
 */
interface StreamingMessage {
  role: 'agentA' | 'agentB';
  content: string;
  status: 'streaming' | 'complete' | 'error' | 'retrying';
  timestamp: number;
}

/**
 * Mock conversation state
 */
interface ConversationState {
  status: 'running' | 'stopped' | 'error';
  processingLock: boolean;
  errorContext?: string;
}

/**
 * Simulates streaming message updates in RTDB
 */
class MockStreamingService {
  private messages: Map<string, StreamingMessage> = new Map();
  private conversations: Map<string, ConversationState> = new Map();

  async startStreaming(messageId: string, role: 'agentA' | 'agentB'): Promise<void> {
    this.messages.set(messageId, {
      role,
      content: '',
      status: 'streaming',
      timestamp: Date.now(),
    });
  }

  async updateContent(messageId: string, content: string): Promise<void> {
    const message = this.messages.get(messageId);
    if (message) {
      message.content = content;
      this.messages.set(messageId, message);
    }
  }

  async markError(messageId: string): Promise<void> {
    const message = this.messages.get(messageId);
    if (message) {
      message.status = 'error';
      this.messages.set(messageId, message);
    }
  }

  async markComplete(messageId: string): Promise<void> {
    const message = this.messages.get(messageId);
    if (message) {
      message.status = 'complete';
      this.messages.set(messageId, message);
    }
  }

  getMessage(messageId: string): StreamingMessage | undefined {
    return this.messages.get(messageId);
  }

  async setConversationError(conversationId: string, errorContext: string): Promise<void> {
    this.conversations.set(conversationId, {
      status: 'error',
      processingLock: false,
      errorContext,
    });
  }

  getConversation(conversationId: string): ConversationState | undefined {
    return this.conversations.get(conversationId);
  }
}

/**
 * Simulates a streaming process that can be interrupted
 */
async function simulateStreamingWithInterruption(
  service: MockStreamingService,
  messageId: string,
  conversationId: string,
  chunks: string[],
  interruptAt: number
): Promise<void> {
  await service.startStreaming(messageId, 'agentA');

  let fullContent = '';
  
  try {
    for (let i = 0; i < chunks.length; i++) {
      if (i === interruptAt) {
        throw new Error('Stream interrupted');
      }
      
      fullContent += chunks[i];
      await service.updateContent(messageId, fullContent);
    }
    
    await service.markComplete(messageId);
  } catch (error) {
    // On interruption, mark message as error but preserve partial content
    await service.markError(messageId);
    await service.setConversationError(
      conversationId,
      `Streaming interrupted: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

describe('Streaming Interruption Unit Tests', () => {
  let service: MockStreamingService;

  beforeEach(() => {
    service = new MockStreamingService();
  });

  describe('Interruption Status Handling', () => {
    it('should mark status as "error" when streaming is interrupted', async () => {
      const messageId = 'msg-interrupt-1';
      const conversationId = 'conv-interrupt-1';
      const chunks = ['Hello', ' world', '!'];

      // Interrupt at chunk 2 (after "Hello world")
      await simulateStreamingWithInterruption(service, messageId, conversationId, chunks, 2);

      const message = service.getMessage(messageId);
      expect(message).toBeDefined();
      expect(message!.status).toBe('error');
    });

    it('should set conversation status to "error" on interruption', async () => {
      const messageId = 'msg-interrupt-2';
      const conversationId = 'conv-interrupt-2';
      const chunks = ['First', ' chunk', ' second', ' chunk'];

      // Interrupt at chunk 2
      await simulateStreamingWithInterruption(service, messageId, conversationId, chunks, 2);

      const conversation = service.getConversation(conversationId);
      expect(conversation).toBeDefined();
      expect(conversation!.status).toBe('error');
    });

    it('should preserve error context in conversation', async () => {
      const messageId = 'msg-interrupt-3';
      const conversationId = 'conv-interrupt-3';
      const chunks = ['Test', ' message'];

      await simulateStreamingWithInterruption(service, messageId, conversationId, chunks, 1);

      const conversation = service.getConversation(conversationId);
      expect(conversation).toBeDefined();
      expect(conversation!.errorContext).toBeDefined();
      expect(conversation!.errorContext).toContain('interrupted');
    });

    it('should clear processing lock on interruption', async () => {
      const messageId = 'msg-interrupt-4';
      const conversationId = 'conv-interrupt-4';
      const chunks = ['Chunk', ' 1', ' 2'];

      await simulateStreamingWithInterruption(service, messageId, conversationId, chunks, 1);

      const conversation = service.getConversation(conversationId);
      expect(conversation).toBeDefined();
      expect(conversation!.processingLock).toBe(false);
    });
  });

  describe('Partial Content Preservation', () => {
    it('should preserve partial content when interrupted early', async () => {
      const messageId = 'msg-partial-1';
      const conversationId = 'conv-partial-1';
      const chunks = ['Hello', ' world', ' from', ' AI'];

      // Interrupt after first chunk
      await simulateStreamingWithInterruption(service, messageId, conversationId, chunks, 1);

      const message = service.getMessage(messageId);
      expect(message).toBeDefined();
      expect(message!.content).toBe('Hello');
      expect(message!.status).toBe('error');
    });

    it('should preserve partial content when interrupted mid-stream', async () => {
      const messageId = 'msg-partial-2';
      const conversationId = 'conv-partial-2';
      const chunks = ['The', ' quick', ' brown', ' fox', ' jumps'];

      // Interrupt at chunk 3 (after "The quick brown")
      await simulateStreamingWithInterruption(service, messageId, conversationId, chunks, 3);

      const message = service.getMessage(messageId);
      expect(message).toBeDefined();
      expect(message!.content).toBe('The quick brown');
      expect(message!.status).toBe('error');
    });

    it('should preserve partial content when interrupted near end', async () => {
      const messageId = 'msg-partial-3';
      const conversationId = 'conv-partial-3';
      const chunks = ['One', ' two', ' three', ' four', ' five'];

      // Interrupt at chunk 4 (after "One two three four")
      await simulateStreamingWithInterruption(service, messageId, conversationId, chunks, 4);

      const message = service.getMessage(messageId);
      expect(message).toBeDefined();
      expect(message!.content).toBe('One two three four');
      expect(message!.status).toBe('error');
    });

    it('should preserve empty content when interrupted immediately', async () => {
      const messageId = 'msg-partial-4';
      const conversationId = 'conv-partial-4';
      const chunks = ['First', ' chunk'];

      // Interrupt at chunk 0 (before any content)
      await simulateStreamingWithInterruption(service, messageId, conversationId, chunks, 0);

      const message = service.getMessage(messageId);
      expect(message).toBeDefined();
      expect(message!.content).toBe('');
      expect(message!.status).toBe('error');
    });

    it('should preserve Unicode characters in partial content', async () => {
      const messageId = 'msg-partial-5';
      const conversationId = 'conv-partial-5';
      const chunks = ['Hello', ' 世界', ' 🌍', ' مرحبا'];

      // Interrupt at chunk 2 (after "Hello 世界")
      await simulateStreamingWithInterruption(service, messageId, conversationId, chunks, 2);

      const message = service.getMessage(messageId);
      expect(message).toBeDefined();
      expect(message!.content).toBe('Hello 世界');
      expect(message!.status).toBe('error');
    });

    it('should preserve newlines in partial content', async () => {
      const messageId = 'msg-partial-6';
      const conversationId = 'conv-partial-6';
      const chunks = ['First line\n', 'Second line\n', 'Third line'];

      // Interrupt at chunk 2 (after two lines)
      await simulateStreamingWithInterruption(service, messageId, conversationId, chunks, 2);

      const message = service.getMessage(messageId);
      expect(message).toBeDefined();
      expect(message!.content).toBe('First line\nSecond line\n');
      expect(message!.status).toBe('error');
      expect(message!.content).toContain('\n');
    });

    it('should preserve special characters in partial content', async () => {
      const messageId = 'msg-partial-7';
      const conversationId = 'conv-partial-7';
      const chunks = ['Code: ', '```python\n', 'def hello():\n', '    print("hi")\n', '```'];

      // Interrupt at chunk 3 (partial code block)
      await simulateStreamingWithInterruption(service, messageId, conversationId, chunks, 3);

      const message = service.getMessage(messageId);
      expect(message).toBeDefined();
      expect(message!.content).toBe('Code: ```python\ndef hello():\n');
      expect(message!.status).toBe('error');
    });
  });

  describe('Interruption at Different Stages', () => {
    it('should handle interruption during initial streaming setup', async () => {
      const messageId = 'msg-stage-1';
      const conversationId = 'conv-stage-1';

      await service.startStreaming(messageId, 'agentA');
      
      // Simulate immediate interruption
      await service.markError(messageId);
      await service.setConversationError(conversationId, 'Interrupted during setup');

      const message = service.getMessage(messageId);
      expect(message).toBeDefined();
      expect(message!.status).toBe('error');
      expect(message!.content).toBe('');
    });

    it('should handle interruption after substantial content', async () => {
      const messageId = 'msg-stage-2';
      const conversationId = 'conv-stage-2';
      const longContent = 'Lorem ipsum dolor sit amet. '.repeat(50); // ~1400 chars
      const chunks = [longContent.slice(0, 500), longContent.slice(500, 1000), longContent.slice(1000)];

      // Interrupt at chunk 2 (after 1000 chars)
      await simulateStreamingWithInterruption(service, messageId, conversationId, chunks, 2);

      const message = service.getMessage(messageId);
      expect(message).toBeDefined();
      expect(message!.content.length).toBe(1000);
      expect(message!.status).toBe('error');
    });

    it('should handle multiple interruptions for same conversation', async () => {
      const conversationId = 'conv-multi-interrupt';
      
      // First message interrupted
      const messageId1 = 'msg-multi-1';
      await simulateStreamingWithInterruption(service, messageId1, conversationId, ['Hello'], 0);
      
      const message1 = service.getMessage(messageId1);
      expect(message1!.status).toBe('error');
      
      // Second message also interrupted
      const messageId2 = 'msg-multi-2';
      await simulateStreamingWithInterruption(service, messageId2, conversationId, ['World'], 0);
      
      const message2 = service.getMessage(messageId2);
      expect(message2!.status).toBe('error');
      
      // Conversation should still be in error state
      const conversation = service.getConversation(conversationId);
      expect(conversation!.status).toBe('error');
    });
  });

  describe('Error Context Details', () => {
    it('should include error message in context', async () => {
      const messageId = 'msg-context-1';
      const conversationId = 'conv-context-1';
      const chunks = ['Test'];

      await simulateStreamingWithInterruption(service, messageId, conversationId, chunks, 0);

      const conversation = service.getConversation(conversationId);
      expect(conversation!.errorContext).toContain('Stream interrupted');
    });

    it('should preserve original error message', async () => {
      const messageId = 'msg-context-2';
      const conversationId = 'conv-context-2';

      await service.startStreaming(messageId, 'agentA');
      
      try {
        throw new Error('Network timeout');
      } catch (error) {
        await service.markError(messageId);
        await service.setConversationError(
          conversationId,
          `Streaming interrupted: ${error instanceof Error ? error.message : 'Unknown'}`
        );
      }

      const conversation = service.getConversation(conversationId);
      expect(conversation!.errorContext).toContain('Network timeout');
    });

    it('should handle unknown error types', async () => {
      const messageId = 'msg-context-3';
      const conversationId = 'conv-context-3';

      await service.startStreaming(messageId, 'agentA');
      
      try {
        throw 'String error'; // Non-Error object
      } catch (error) {
        await service.markError(messageId);
        await service.setConversationError(
          conversationId,
          `Streaming interrupted: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }

      const conversation = service.getConversation(conversationId);
      expect(conversation!.errorContext).toContain('Unknown error');
    });
  });

  describe('Agent Role Preservation', () => {
    it('should preserve agent role when agentA is interrupted', async () => {
      const messageId = 'msg-role-1';
      const conversationId = 'conv-role-1';

      await service.startStreaming(messageId, 'agentA');
      await service.updateContent(messageId, 'Partial');
      await service.markError(messageId);

      const message = service.getMessage(messageId);
      expect(message!.role).toBe('agentA');
      expect(message!.status).toBe('error');
    });

    it('should preserve agent role when agentB is interrupted', async () => {
      const messageId = 'msg-role-2';
      const conversationId = 'conv-role-2';

      await service.startStreaming(messageId, 'agentB');
      await service.updateContent(messageId, 'Partial');
      await service.markError(messageId);

      const message = service.getMessage(messageId);
      expect(message!.role).toBe('agentB');
      expect(message!.status).toBe('error');
    });
  });

  describe('Timestamp Preservation', () => {
    it('should preserve timestamp when interrupted', async () => {
      const messageId = 'msg-time-1';
      const conversationId = 'conv-time-1';

      await service.startStreaming(messageId, 'agentA');
      const message = service.getMessage(messageId);
      const originalTimestamp = message!.timestamp;

      await service.updateContent(messageId, 'Content');
      await service.markError(messageId);

      const updatedMessage = service.getMessage(messageId);
      expect(updatedMessage!.timestamp).toBe(originalTimestamp);
    });
  });
});
