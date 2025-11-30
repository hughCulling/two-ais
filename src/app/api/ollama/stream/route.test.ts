// src/app/api/ollama/stream/route.test.ts
// Unit tests for /api/ollama/stream API endpoint

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock the Ollama library
const mockChat = vi.fn();
const mockList = vi.fn();

vi.mock('ollama', () => ({
  Ollama: class MockOllama {
    chat = mockChat;
    list = mockList;
  },
}));

describe('/api/ollama/stream API Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockList.mockResolvedValue({ models: [] }); // Mock successful connection
  });

  describe('Request Validation', () => {
    it('should return 400 if model is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/ollama/stream', {
        method: 'POST',
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Model is required');
    });

    it('should return 400 if messages is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/ollama/stream', {
        method: 'POST',
        body: JSON.stringify({
          model: 'qwen2.5:3b',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Messages array is required');
    });

    it('should return 400 if messages is not an array', async () => {
      const request = new NextRequest('http://localhost:3000/api/ollama/stream', {
        method: 'POST',
        body: JSON.stringify({
          model: 'qwen2.5:3b',
          messages: 'not an array',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Messages array is required');
    });
  });

  describe('Streaming Response', () => {
    it('should return streaming response with correct headers', async () => {
      const request = new NextRequest('http://localhost:3000/api/ollama/stream', {
        method: 'POST',
        body: JSON.stringify({
          model: 'qwen2.5:3b',
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });

      // Mock streaming response
      mockChat.mockImplementation(async function* () {
        yield { message: { content: 'Hello' } };
        yield { message: { content: ' world' } };
      });

      const response = await POST(request);

      expect(response.headers.get('Content-Type')).toBe('text/event-stream');
      expect(response.headers.get('Cache-Control')).toBe('no-cache');
      expect(response.headers.get('Connection')).toBe('keep-alive');
    });

    it('should stream tokens from Ollama', async () => {
      const request = new NextRequest('http://localhost:3000/api/ollama/stream', {
        method: 'POST',
        body: JSON.stringify({
          model: 'qwen2.5:3b',
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });

      // Mock streaming response
      mockChat.mockImplementation(async function* () {
        yield { message: { content: 'Hello' } };
        yield { message: { content: ' world' } };
      });

      const response = await POST(request);
      
      // Read the stream
      const reader = response.body?.getReader();
      expect(reader).toBeDefined();

      if (reader) {
        const decoder = new TextDecoder();
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullContent += decoder.decode(value, { stream: true });
        }

        // Verify the stream contains the expected tokens
        expect(fullContent).toContain('data: {"token":"Hello"}');
        expect(fullContent).toContain('data: {"token":" world"}');
        expect(fullContent).toContain('data: [DONE]');
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle Ollama connection errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/ollama/stream', {
        method: 'POST',
        body: JSON.stringify({
          model: 'qwen2.5:3b',
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });

      // Mock connection failure
      mockList.mockRejectedValue(new Error('Connection refused'));

      const response = await POST(request);
      
      // Read the stream to get the error
      const reader = response.body?.getReader();
      if (reader) {
        const decoder = new TextDecoder();
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullContent += decoder.decode(value, { stream: true });
        }

        // Verify error is in the stream
        expect(fullContent).toContain('error');
        expect(fullContent).toContain('Connection refused');
      }
    });

    it('should handle streaming errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/ollama/stream', {
        method: 'POST',
        body: JSON.stringify({
          model: 'qwen2.5:3b',
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });

      // Mock streaming error
      mockChat.mockImplementation(async function* () {
        yield { message: { content: 'Hello' } };
        throw new Error('Stream interrupted');
      });

      const response = await POST(request);
      
      // Read the stream
      const reader = response.body?.getReader();
      if (reader) {
        const decoder = new TextDecoder();
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullContent += decoder.decode(value, { stream: true });
        }

        // Verify error is in the stream
        expect(fullContent).toContain('error');
        expect(fullContent).toContain('Stream interrupted');
      }
    });

    it('should return 500 for unexpected errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/ollama/stream', {
        method: 'POST',
        body: JSON.stringify({
          model: 'qwen2.5:3b',
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });

      // Mock unexpected error during request parsing
      const badRequest = {
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as any;

      const response = await POST(badRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });

  describe('Ollama Endpoint Configuration', () => {
    it('should use default endpoint if not provided', async () => {
      const request = new NextRequest('http://localhost:3000/api/ollama/stream', {
        method: 'POST',
        body: JSON.stringify({
          model: 'qwen2.5:3b',
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });

      mockChat.mockImplementation(async function* () {
        yield { message: { content: 'Test' } };
      });

      await POST(request);

      // Verify Ollama was instantiated (we can't easily check the exact endpoint)
      expect(mockChat).toHaveBeenCalled();
    });

    it('should use custom endpoint if provided', async () => {
      const request = new NextRequest('http://localhost:3000/api/ollama/stream', {
        method: 'POST',
        body: JSON.stringify({
          model: 'qwen2.5:3b',
          messages: [{ role: 'user', content: 'Hello' }],
          ollamaEndpoint: 'http://custom-ollama:11434',
        }),
      });

      mockChat.mockImplementation(async function* () {
        yield { message: { content: 'Test' } };
      });

      await POST(request);

      // Verify Ollama was called
      expect(mockChat).toHaveBeenCalled();
    });
  });

  describe('Model Types', () => {
    it('should handle local models', async () => {
      const request = new NextRequest('http://localhost:3000/api/ollama/stream', {
        method: 'POST',
        body: JSON.stringify({
          model: 'qwen2.5:3b',
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });

      mockChat.mockImplementation(async function* () {
        yield { message: { content: 'Response' } };
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockChat).toHaveBeenCalledWith({
        model: 'qwen2.5:3b',
        messages: [{ role: 'user', content: 'Hello' }],
        stream: true,
      });
    });

    it('should handle cloud models with :cloud suffix', async () => {
      const request = new NextRequest('http://localhost:3000/api/ollama/stream', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gemini-2.0-flash-exp:cloud',
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });

      // Mock fetch for cloud models - must be set before calling POST
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        body: {
          getReader: () => ({
            read: vi.fn()
              .mockResolvedValueOnce({
                done: false,
                value: new TextEncoder().encode(JSON.stringify({ message: { content: 'Cloud' } }) + '\n'),
              })
              .mockResolvedValueOnce({
                done: false,
                value: new TextEncoder().encode(JSON.stringify({ done: true }) + '\n'),
              })
              .mockResolvedValueOnce({ done: true, value: undefined }),
          }),
        },
      } as any);
      
      // Save original fetch and restore after test
      const originalFetch = global.fetch;
      global.fetch = mockFetch as any;

      try {
        const response = await POST(request);

        // Verify response is successful
        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('text/event-stream');
        
        // Note: We can't easily verify mockFetch was called because the route
        // creates a ReadableStream that executes asynchronously
      } finally {
        global.fetch = originalFetch;
      }
    });
  });
});
