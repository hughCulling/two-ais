// src/hooks/useOllamaAgent.test.ts
// Unit tests for useOllamaAgent hook

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useOllamaAgent } from './useOllamaAgent';

// Mock Firebase
const mockOnSnapshot = vi.fn();
const mockUpdateDoc = vi.fn();
const mockSetDoc = vi.fn();
const mockGetDocs = vi.fn();
const mockSet = vi.fn();
const mockUpdate = vi.fn();

vi.mock('@/lib/firebase/clientApp', () => ({
  db: {},
  rtdb: {},
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn((db, collection, id) => ({ collection, id })),
  collection: vi.fn((db, collection, conversationId, subcollection) => ({ 
    collection, 
    conversationId, 
    subcollection 
  })),
  onSnapshot: (...args: any[]) => mockOnSnapshot(...args),
  updateDoc: (...args: any[]) => mockUpdateDoc(...args),
  setDoc: (...args: any[]) => mockSetDoc(...args),
  getDocs: (...args: any[]) => mockGetDocs(...args),
  query: vi.fn((...args) => ({ type: 'query', args })),
  orderBy: vi.fn((field, direction) => ({ type: 'orderBy', field, direction })),
  limit: vi.fn((count) => ({ type: 'limit', count })),
  serverTimestamp: vi.fn(() => ({ type: 'serverTimestamp' })),
}));

vi.mock('firebase/database', () => ({
  ref: vi.fn((db, path) => ({ path })),
  set: (...args: any[]) => mockSet(...args),
  update: (...args: any[]) => mockUpdate(...args),
}));

// Mock fetch for Ollama API
global.fetch = vi.fn();

describe('useOllamaAgent Hook Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateDoc.mockResolvedValue(undefined);
    mockSetDoc.mockResolvedValue(undefined);
    mockSet.mockResolvedValue(undefined);
    mockUpdate.mockResolvedValue(undefined);
    // Reset fetch mock
    (global.fetch as any) = vi.fn();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Ollama Model Detection', () => {
    it('should trigger client-side handling for Ollama models', async () => {
      const conversationId = 'conv-123';
      const userId = 'user-123';

      // Mock conversation snapshot with Ollama model
      const mockSnapshot = {
        exists: () => true,
        data: () => ({
          status: 'running',
          processingLock: false,
          waitingForTTSEndSignal: false,
          turn: 'agentA',
          agentA_llm: 'ollama:qwen2.5:3b',
          agentB_llm: 'mistral:mistral-large-latest',
          lastPlayedAgentMessageId: null,
        }),
      };

      // Mock getDocs to return empty messages (no lookahead limit)
      mockGetDocs.mockResolvedValue({
        docs: [],
      });

      // Mock fetch to return streaming response
      const mockReader = {
        read: vi.fn()
          .mockResolvedValueOnce({ 
            done: false, 
            value: new TextEncoder().encode('data: {"token":"Hello"}\n\n') 
          })
          .mockResolvedValueOnce({ 
            done: false, 
            value: new TextEncoder().encode('data: [DONE]\n\n') 
          })
          .mockResolvedValueOnce({ done: true, value: undefined }),
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        body: { getReader: () => mockReader },
      });

      // Set up onSnapshot to call callback immediately
      mockOnSnapshot.mockImplementation((ref, callback) => {
        setTimeout(() => callback(mockSnapshot), 0);
        return vi.fn(); // unsubscribe function
      });

      renderHook(() => useOllamaAgent(conversationId, userId));

      // Wait for the hook to process
      await waitFor(() => {
        expect(mockUpdateDoc).toHaveBeenCalled();
      }, { timeout: 3000 });

      // Verify processing lock was set
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.objectContaining({ collection: 'conversations', id: conversationId }),
        expect.objectContaining({
          processingLock: true,
          agentAProcessing: true,
        })
      );

      // Verify fetch was called to Ollama API
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/ollama/stream',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('qwen2.5:3b'),
        })
      );
    });

    it('should not trigger for non-Ollama models', async () => {
      const conversationId = 'conv-123';
      const userId = 'user-123';

      // Mock conversation snapshot with non-Ollama models
      const mockSnapshot = {
        exists: () => true,
        data: () => ({
          status: 'running',
          processingLock: false,
          waitingForTTSEndSignal: false,
          turn: 'agentA',
          agentA_llm: 'mistral:mistral-large-latest',
          agentB_llm: 'mistral:mistral-large-latest',
        }),
      };

      mockOnSnapshot.mockImplementation((ref, callback) => {
        setTimeout(() => callback(mockSnapshot), 0);
        return vi.fn();
      });

      renderHook(() => useOllamaAgent(conversationId, userId));

      // Wait a bit to ensure no processing happens
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify no processing occurred
      expect(mockUpdateDoc).not.toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Agent B Delay', () => {
    it('should delay Agent B requests by 500ms', async () => {
      const conversationId = 'conv-123';
      const userId = 'user-123';

      // Track when fetch is called
      let fetchCallTime: number | null = null;
      const startTime = Date.now();

      // Mock conversation snapshot with Agent B turn
      const mockSnapshot = {
        exists: () => true,
        data: () => ({
          status: 'running',
          processingLock: false,
          waitingForTTSEndSignal: false,
          turn: 'agentB',
          agentA_llm: 'mistral:mistral-large-latest',
          agentB_llm: 'ollama:gemma2:2b',
          lastPlayedAgentMessageId: null,
        }),
      };

      mockGetDocs.mockResolvedValue({ docs: [] });

      const mockReader = {
        read: vi.fn()
          .mockResolvedValueOnce({ 
            done: false, 
            value: new TextEncoder().encode('data: {"token":"Hi"}\n\n') 
          })
          .mockResolvedValueOnce({ 
            done: false, 
            value: new TextEncoder().encode('data: [DONE]\n\n') 
          })
          .mockResolvedValueOnce({ done: true, value: undefined }),
      };

      (global.fetch as any).mockImplementation(() => {
        fetchCallTime = Date.now();
        return Promise.resolve({
          ok: true,
          body: { getReader: () => mockReader },
        });
      });

      mockOnSnapshot.mockImplementation((ref, callback) => {
        setTimeout(() => callback(mockSnapshot), 0);
        return vi.fn();
      });

      renderHook(() => useOllamaAgent(conversationId, userId));

      // Wait for fetch to be called
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      }, { timeout: 2000 });

      // Verify the delay was approximately 500ms
      const delay = fetchCallTime! - startTime;
      expect(delay).toBeGreaterThanOrEqual(450); // Allow some tolerance
      expect(delay).toBeLessThan(1000); // But not too long
    });

    it('should not delay Agent A requests', async () => {
      const conversationId = 'conv-123';
      const userId = 'user-123';

      const mockSnapshot = {
        exists: () => true,
        data: () => ({
          status: 'running',
          processingLock: false,
          waitingForTTSEndSignal: false,
          turn: 'agentA',
          agentA_llm: 'ollama:qwen2.5:3b',
          agentB_llm: 'mistral:mistral-large-latest',
          lastPlayedAgentMessageId: null,
        }),
      };

      mockGetDocs.mockResolvedValue({ docs: [] });

      const mockReader = {
        read: vi.fn()
          .mockResolvedValueOnce({ 
            done: false, 
            value: new TextEncoder().encode('data: {"token":"Hello"}\n\n') 
          })
          .mockResolvedValueOnce({ 
            done: false, 
            value: new TextEncoder().encode('data: [DONE]\n\n') 
          })
          .mockResolvedValueOnce({ done: true, value: undefined }),
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        body: { getReader: () => mockReader },
      });

      mockOnSnapshot.mockImplementation((ref, callback) => {
        setTimeout(() => callback(mockSnapshot), 0);
        return vi.fn();
      });

      renderHook(() => useOllamaAgent(conversationId, userId));

      // Agent A should call fetch immediately (no 500ms delay)
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      }, { timeout: 1000 });
    });
  });

  describe('Processing Lock', () => {
    it('should not process when processingLock is true', async () => {
      const conversationId = 'conv-123';
      const userId = 'user-123';

      const mockSnapshot = {
        exists: () => true,
        data: () => ({
          status: 'running',
          processingLock: true, // Lock is set
          waitingForTTSEndSignal: false,
          turn: 'agentA',
          agentA_llm: 'ollama:qwen2.5:3b',
          agentB_llm: 'mistral:mistral-large-latest',
        }),
      };

      let callbackCalled = false;
      mockOnSnapshot.mockImplementation((ref, callback) => {
        setTimeout(() => {
          callback(mockSnapshot);
          callbackCalled = true;
        }, 0);
        return vi.fn();
      });

      renderHook(() => useOllamaAgent(conversationId, userId));

      // Wait for callback to be called
      await waitFor(() => expect(callbackCalled).toBe(true), { timeout: 500 });

      // Give a small amount of time for any processing to happen
      await new Promise(resolve => setTimeout(resolve, 50));

      // Should not process when lock is set
      expect(mockUpdateDoc).not.toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should not process when waitingForTTSEndSignal is true', async () => {
      const conversationId = 'conv-123';
      const userId = 'user-123';

      const mockSnapshot = {
        exists: () => true,
        data: () => ({
          status: 'running',
          processingLock: false,
          waitingForTTSEndSignal: true, // Waiting for TTS
          turn: 'agentA',
          agentA_llm: 'ollama:qwen2.5:3b',
          agentB_llm: 'mistral:mistral-large-latest',
        }),
      };

      let callbackCalled = false;
      mockOnSnapshot.mockImplementation((ref, callback) => {
        setTimeout(() => {
          callback(mockSnapshot);
          callbackCalled = true;
        }, 0);
        return vi.fn();
      });

      renderHook(() => useOllamaAgent(conversationId, userId));

      // Wait for callback to be called
      await waitFor(() => expect(callbackCalled).toBe(true), { timeout: 500 });

      // Give a small amount of time for any processing to happen
      await new Promise(resolve => setTimeout(resolve, 50));

      // Should not process when waiting for TTS
      expect(mockUpdateDoc).not.toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Conversation Status', () => {
    it('should not process when status is "stopped"', async () => {
      const conversationId = 'conv-123';
      const userId = 'user-123';

      const mockSnapshot = {
        exists: () => true,
        data: () => ({
          status: 'stopped',
          processingLock: false,
          waitingForTTSEndSignal: false,
          turn: 'agentA',
          agentA_llm: 'ollama:qwen2.5:3b',
          agentB_llm: 'mistral:mistral-large-latest',
        }),
      };

      let callbackCalled = false;
      mockOnSnapshot.mockImplementation((ref, callback) => {
        setTimeout(() => {
          callback(mockSnapshot);
          callbackCalled = true;
        }, 0);
        return vi.fn();
      });

      renderHook(() => useOllamaAgent(conversationId, userId));

      // Wait for callback to be called
      await waitFor(() => expect(callbackCalled).toBe(true), { timeout: 500 });

      // Give a small amount of time for any processing to happen
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(mockUpdateDoc).not.toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should not process when status is "error"', async () => {
      const conversationId = 'conv-123';
      const userId = 'user-123';

      const mockSnapshot = {
        exists: () => true,
        data: () => ({
          status: 'error',
          processingLock: false,
          waitingForTTSEndSignal: false,
          turn: 'agentA',
          agentA_llm: 'ollama:qwen2.5:3b',
          agentB_llm: 'mistral:mistral-large-latest',
        }),
      };

      let callbackCalled = false;
      mockOnSnapshot.mockImplementation((ref, callback) => {
        setTimeout(() => {
          callback(mockSnapshot);
          callbackCalled = true;
        }, 0);
        return vi.fn();
      });

      renderHook(() => useOllamaAgent(conversationId, userId));

      // Wait for callback to be called
      await waitFor(() => expect(callbackCalled).toBe(true), { timeout: 500 });

      // Give a small amount of time for any processing to happen
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(mockUpdateDoc).not.toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Null Parameters', () => {
    it('should not process when conversationId is null', () => {
      const userId = 'user-123';

      renderHook(() => useOllamaAgent(null, userId));

      expect(mockOnSnapshot).not.toHaveBeenCalled();
    });

    it('should not process when userId is null', () => {
      const conversationId = 'conv-123';

      renderHook(() => useOllamaAgent(conversationId, null));

      expect(mockOnSnapshot).not.toHaveBeenCalled();
    });

    it('should not process when both parameters are null', () => {
      renderHook(() => useOllamaAgent(null, null));

      expect(mockOnSnapshot).not.toHaveBeenCalled();
    });
  });

  describe('Retry Logic', () => {
    it('should retry up to 2 times on failure', async () => {
      const conversationId = 'conv-123';
      const userId = 'user-123';

      const mockSnapshot = {
        exists: () => true,
        data: () => ({
          status: 'running',
          processingLock: false,
          waitingForTTSEndSignal: false,
          turn: 'agentA',
          agentA_llm: 'ollama:qwen2.5:3b',
          agentB_llm: 'mistral:mistral-large-latest',
          lastPlayedAgentMessageId: null,
        }),
      };

      mockGetDocs.mockResolvedValue({ docs: [] });

      // Mock fetch to fail twice, then succeed
      let fetchCallCount = 0;
      (global.fetch as any).mockImplementation(() => {
        fetchCallCount++;
        if (fetchCallCount <= 2) {
          // First two attempts fail
          return Promise.resolve({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            text: () => Promise.resolve('Server error'),
          });
        } else {
          // Third attempt succeeds
          const mockReader = {
            read: vi.fn()
              .mockResolvedValueOnce({ 
                done: false, 
                value: new TextEncoder().encode('data: {"token":"Success"}\n\n') 
              })
              .mockResolvedValueOnce({ 
                done: false, 
                value: new TextEncoder().encode('data: [DONE]\n\n') 
              })
              .mockResolvedValueOnce({ done: true, value: undefined }),
          };
          return Promise.resolve({
            ok: true,
            body: { getReader: () => mockReader },
          });
        }
      });

      mockOnSnapshot.mockImplementation((ref, callback) => {
        setTimeout(() => callback(mockSnapshot), 0);
        return vi.fn();
      });

      renderHook(() => useOllamaAgent(conversationId, userId));

      // Wait for all retries to complete
      await waitFor(() => {
        expect(fetchCallCount).toBe(3);
      }, { timeout: 10000 }); // Allow time for retries with backoff

      // Verify message was eventually saved
      await waitFor(() => {
        expect(mockSetDoc).toHaveBeenCalled();
      }, { timeout: 1000 });
    });

    it('should use exponential backoff (2s, 4s)', async () => {
      const conversationId = 'conv-123';
      const userId = 'user-123';

      const mockSnapshot = {
        exists: () => true,
        data: () => ({
          status: 'running',
          processingLock: false,
          waitingForTTSEndSignal: false,
          turn: 'agentA',
          agentA_llm: 'ollama:qwen2.5:3b',
          agentB_llm: 'mistral:mistral-large-latest',
          lastPlayedAgentMessageId: null,
        }),
      };

      mockGetDocs.mockResolvedValue({ docs: [] });

      // Track timing of fetch calls
      const fetchTimes: number[] = [];
      (global.fetch as any).mockImplementation(() => {
        fetchTimes.push(Date.now());
        if (fetchTimes.length <= 2) {
          return Promise.resolve({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            text: () => Promise.resolve('Server error'),
          });
        } else {
          const mockReader = {
            read: vi.fn()
              .mockResolvedValueOnce({ 
                done: false, 
                value: new TextEncoder().encode('data: {"token":"Success"}\n\n') 
              })
              .mockResolvedValueOnce({ 
                done: false, 
                value: new TextEncoder().encode('data: [DONE]\n\n') 
              })
              .mockResolvedValueOnce({ done: true, value: undefined }),
          };
          return Promise.resolve({
            ok: true,
            body: { getReader: () => mockReader },
          });
        }
      });

      mockOnSnapshot.mockImplementation((ref, callback) => {
        setTimeout(() => callback(mockSnapshot), 0);
        return vi.fn();
      });

      renderHook(() => useOllamaAgent(conversationId, userId));

      // Wait for all retries
      await waitFor(() => {
        expect(fetchTimes.length).toBe(3);
      }, { timeout: 10000 });

      // Verify backoff timing
      // First retry should be ~2000ms after first attempt
      const firstBackoff = fetchTimes[1] - fetchTimes[0];
      expect(firstBackoff).toBeGreaterThanOrEqual(1900);
      expect(firstBackoff).toBeLessThan(2500);

      // Second retry should be ~4000ms after second attempt
      const secondBackoff = fetchTimes[2] - fetchTimes[1];
      expect(secondBackoff).toBeGreaterThanOrEqual(3900);
      expect(secondBackoff).toBeLessThan(4500);
    });

    it('should update RTDB with retry status', async () => {
      const conversationId = 'conv-123';
      const userId = 'user-123';

      const mockSnapshot = {
        exists: () => true,
        data: () => ({
          status: 'running',
          processingLock: false,
          waitingForTTSEndSignal: false,
          turn: 'agentA',
          agentA_llm: 'ollama:qwen2.5:3b',
          agentB_llm: 'mistral:mistral-large-latest',
          lastPlayedAgentMessageId: null,
        }),
      };

      mockGetDocs.mockResolvedValue({ docs: [] });

      // Mock fetch to fail once
      let fetchCallCount = 0;
      (global.fetch as any).mockImplementation(() => {
        fetchCallCount++;
        if (fetchCallCount === 1) {
          return Promise.resolve({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            text: () => Promise.resolve('Server error'),
          });
        } else {
          const mockReader = {
            read: vi.fn()
              .mockResolvedValueOnce({ 
                done: false, 
                value: new TextEncoder().encode('data: {"token":"Success"}\n\n') 
              })
              .mockResolvedValueOnce({ 
                done: false, 
                value: new TextEncoder().encode('data: [DONE]\n\n') 
              })
              .mockResolvedValueOnce({ done: true, value: undefined }),
          };
          return Promise.resolve({
            ok: true,
            body: { getReader: () => mockReader },
          });
        }
      });

      mockOnSnapshot.mockImplementation((ref, callback) => {
        setTimeout(() => callback(mockSnapshot), 0);
        return vi.fn();
      });

      renderHook(() => useOllamaAgent(conversationId, userId));

      // Wait for retry status update
      await waitFor(() => {
        const updateCalls = mockUpdate.mock.calls;
        return updateCalls.some((call: any) => 
          call[1]?.status === 'retrying' || 
          (typeof call[1]?.content === 'string' && call[1].content.includes('Retrying'))
        );
      }, { timeout: 5000 });

      // Verify retry status was set
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: 'retrying',
        })
      );
    });

    it('should fail after max retries exceeded', { timeout: 15000 }, async () => {
      // Clear all mocks before this test to avoid interference
      vi.clearAllMocks();
      mockUpdateDoc.mockResolvedValue(undefined);
      mockSetDoc.mockResolvedValue(undefined);
      mockSet.mockResolvedValue(undefined);
      mockUpdate.mockResolvedValue(undefined);
      
      const conversationId = 'conv-456'; // Different ID to avoid interference
      const userId = 'user-456';

      const mockSnapshot = {
        exists: () => true,
        data: () => ({
          status: 'running',
          processingLock: false,
          waitingForTTSEndSignal: false,
          turn: 'agentA',
          agentA_llm: 'ollama:qwen2.5:3b',
          agentB_llm: 'mistral:mistral-large-latest',
          lastPlayedAgentMessageId: null,
        }),
      };

      mockGetDocs.mockResolvedValue({ docs: [] });

      // Track fetch calls for this test only
      const fetchCalls: number[] = [];
      
      // Create a fresh fetch mock for this test
      const freshFetchMock = vi.fn().mockImplementation(() => {
        fetchCalls.push(Date.now());
        return Promise.resolve({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          text: () => Promise.resolve('Server error'),
        });
      });
      
      (global.fetch as any) = freshFetchMock;

      mockOnSnapshot.mockImplementation((ref, callback) => {
        setTimeout(() => callback(mockSnapshot), 0);
        return vi.fn();
      });

      renderHook(() => useOllamaAgent(conversationId, userId));

      // Wait for all retries to complete
      // Initial attempt + 2s wait + retry + 4s wait + retry = ~6.5 seconds
      await new Promise(resolve => setTimeout(resolve, 7000));

      // Verify fetch was called at least 3 times (initial + 2 retries)
      // May be more if previous tests are still running
      expect(fetchCalls.length).toBeGreaterThanOrEqual(3);

      // Verify error state was eventually set
      const errorCalls = mockUpdateDoc.mock.calls.filter((call: any) => call[1]?.status === 'error');
      expect(errorCalls.length).toBeGreaterThan(0);
      
      // Verify error context mentions failure
      const errorCall = errorCalls[0];
      expect(errorCall[1].errorContext).toContain('Failed after');
    });
  });

  describe('Error Handling', () => {
    it('should set conversation status to "error" on failure', async () => {
      const conversationId = 'conv-error-1';
      const userId = 'user-error-1';

      const mockSnapshot = {
        exists: () => true,
        data: () => ({
          status: 'running',
          processingLock: false,
          waitingForTTSEndSignal: false,
          turn: 'agentA',
          agentA_llm: 'ollama:qwen2.5:3b',
          agentB_llm: 'mistral:mistral-large-latest',
          lastPlayedAgentMessageId: null,
        }),
      };

      mockGetDocs.mockResolvedValue({ docs: [] });

      // Mock fetch to always fail
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve('Server error'),
      });

      mockOnSnapshot.mockImplementation((ref, callback) => {
        setTimeout(() => callback(mockSnapshot), 0);
        return vi.fn();
      });

      renderHook(() => useOllamaAgent(conversationId, userId));

      // Wait for all retries and error to be set (takes ~6 seconds with retries)
      await new Promise(resolve => setTimeout(resolve, 7000));

      // Verify error status was set
      const errorCalls = mockUpdateDoc.mock.calls.filter((call: any) => call[1]?.status === 'error');
      expect(errorCalls.length).toBeGreaterThan(0);
    }, 15000);

    it('should preserve error context in conversation document', async () => {
      const conversationId = 'conv-error-2';
      const userId = 'user-error-2';

      const mockSnapshot = {
        exists: () => true,
        data: () => ({
          status: 'running',
          processingLock: false,
          waitingForTTSEndSignal: false,
          turn: 'agentA',
          agentA_llm: 'ollama:qwen2.5:3b',
          agentB_llm: 'mistral:mistral-large-latest',
          lastPlayedAgentMessageId: null,
        }),
      };

      mockGetDocs.mockResolvedValue({ docs: [] });

      // Mock fetch to fail with a specific error
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        text: () => Promise.resolve('Ollama service is down'),
      });

      mockOnSnapshot.mockImplementation((ref, callback) => {
        setTimeout(() => callback(mockSnapshot), 0);
        return vi.fn();
      });

      renderHook(() => useOllamaAgent(conversationId, userId));

      // Wait for all retries and error to be set
      await new Promise(resolve => setTimeout(resolve, 7000));

      // Verify error context was preserved
      const errorCalls = mockUpdateDoc.mock.calls.filter((call: any) => call[1]?.errorContext);
      expect(errorCalls.length).toBeGreaterThan(0);
      
      const errorCall = errorCalls[0];
      expect(errorCall[1].errorContext).toContain('agentA');
      expect(errorCall[1].errorContext).toMatch(/HTTP 503|Service Unavailable|Ollama service is down/);
    }, 15000);

    it('should clear processing lock on error', async () => {
      const conversationId = 'conv-error-3';
      const userId = 'user-error-3';

      const mockSnapshot = {
        exists: () => true,
        data: () => ({
          status: 'running',
          processingLock: false,
          waitingForTTSEndSignal: false,
          turn: 'agentA',
          agentA_llm: 'ollama:qwen2.5:3b',
          agentB_llm: 'mistral:mistral-large-latest',
          lastPlayedAgentMessageId: null,
        }),
      };

      mockGetDocs.mockResolvedValue({ docs: [] });

      // Mock fetch to fail
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve('Server error'),
      });

      mockOnSnapshot.mockImplementation((ref, callback) => {
        setTimeout(() => callback(mockSnapshot), 0);
        return vi.fn();
      });

      renderHook(() => useOllamaAgent(conversationId, userId));

      // Wait for all retries and error to be set
      await new Promise(resolve => setTimeout(resolve, 7000));

      // Verify processing lock was cleared
      const errorCall = mockUpdateDoc.mock.calls.find((call: any) => call[1]?.status === 'error');
      expect(errorCall).toBeDefined();
      expect(errorCall[1].processingLock).toBe(false);
      expect(errorCall[1].agentAProcessing).toBe(false);
    }, 15000);

    it('should handle network errors gracefully', async () => {
      const conversationId = 'conv-error-4';
      const userId = 'user-error-4';

      const mockSnapshot = {
        exists: () => true,
        data: () => ({
          status: 'running',
          processingLock: false,
          waitingForTTSEndSignal: false,
          turn: 'agentA',
          agentA_llm: 'ollama:qwen2.5:3b',
          agentB_llm: 'mistral:mistral-large-latest',
          lastPlayedAgentMessageId: null,
        }),
      };

      mockGetDocs.mockResolvedValue({ docs: [] });

      // Mock fetch to throw a network error
      (global.fetch as any).mockRejectedValue(new Error('Network request failed'));

      mockOnSnapshot.mockImplementation((ref, callback) => {
        setTimeout(() => callback(mockSnapshot), 0);
        return vi.fn();
      });

      renderHook(() => useOllamaAgent(conversationId, userId));

      // Wait for all retries and error to be set
      await new Promise(resolve => setTimeout(resolve, 7000));

      // Verify error was handled
      const errorCalls = mockUpdateDoc.mock.calls.filter((call: any) => call[1]?.status === 'error');
      expect(errorCalls.length).toBeGreaterThan(0);
      expect(errorCalls[0][1].errorContext).toContain('Network request failed');
    }, 15000);
  });
});
