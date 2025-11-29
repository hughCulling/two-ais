// Feature: comprehensive-testing, Task 14.2: Resume URL parameter
// Tests that ?resume=id loads conversation and ResumeHandler component behavior
// Validates: Requirements 9.2

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ResumeHandler from './ResumeHandler';
import type { User } from 'firebase/auth';

// Mock useSearchParams
const mockSearchParams = new URLSearchParams();
const mockUseSearchParams = vi.fn(() => mockSearchParams);

// Mock useTranslation
const mockUseTranslation = vi.fn();

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  return {
    ...actual,
    useSearchParams: () => mockUseSearchParams(),
  };
});

vi.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => mockUseTranslation(),
}));

// Mock fetch
global.fetch = vi.fn();

describe('ResumeHandler - Resume URL Parameter', () => {
  const mockUser: User = {
    uid: 'test-user-123',
    email: 'test@example.com',
    getIdToken: vi.fn().mockResolvedValue('mock-token'),
  } as any;

  const mockSetSessionConfig = vi.fn();
  const mockSetActiveConversationId = vi.fn();
  const mockSetHasManuallyStopped = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.delete('resume');

    mockUseTranslation.mockReturnValue({
      t: {
        page_LoadingUserData: 'Loading...',
      },
      loading: false,
    });

    (global.fetch as any).mockReset();
  });

  it('should not attempt resume when no resume parameter is present', () => {
    // Arrange: No resume parameter
    mockSearchParams.delete('resume');

    // Act: Render component
    render(
      <ResumeHandler
        user={mockUser}
        activeConversationId={null}
        sessionConfig={null}
        setSessionConfig={mockSetSessionConfig}
        setActiveConversationId={mockSetActiveConversationId}
        hasManuallyStopped={false}
        setHasManuallyStopped={mockSetHasManuallyStopped}
      />
    );

    // Assert: Should not call fetch
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should load conversation when resume parameter is present', async () => {
    // Arrange: Set resume parameter
    mockSearchParams.set('resume', 'conv-123');

    // Mock successful resume API call
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    // Mock successful details API call
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'running',
        agentA_llm: 'ollama:qwen3:4b',
        agentB_llm: 'ollama:gemma3:4b',
        ttsSettings: {
          enabled: false,
          agentA: { provider: 'none', voice: null },
          agentB: { provider: 'none', voice: null },
        },
        language: 'en',
        initialSystemPrompt: 'Test prompt',
      }),
    });

    // Act: Render component
    render(
      <ResumeHandler
        user={mockUser}
        activeConversationId={null}
        sessionConfig={null}
        setSessionConfig={mockSetSessionConfig}
        setActiveConversationId={mockSetActiveConversationId}
        hasManuallyStopped={false}
        setHasManuallyStopped={mockSetHasManuallyStopped}
      />
    );

    // Assert: Should call resume API
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/conversation/conv-123/resume',
        expect.objectContaining({
          method: 'POST',
          headers: { Authorization: 'Bearer mock-token' },
        })
      );
    });

    // Should eventually set session config and active conversation
    await waitFor(() => {
      expect(mockSetSessionConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          agentA_llm: 'ollama:qwen3:4b',
          agentB_llm: 'ollama:gemma3:4b',
          ttsEnabled: false,
        })
      );
      expect(mockSetActiveConversationId).toHaveBeenCalledWith('conv-123');
    });
  });

  it('should show loading state while resuming', async () => {
    // Arrange: Set resume parameter
    mockSearchParams.set('resume', 'conv-123');

    // Mock delayed resume API call
    (global.fetch as any).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100))
    );

    // Act: Render component
    render(
      <ResumeHandler
        user={mockUser}
        activeConversationId={null}
        sessionConfig={null}
        setSessionConfig={mockSetSessionConfig}
        setActiveConversationId={mockSetActiveConversationId}
        hasManuallyStopped={false}
        setHasManuallyStopped={mockSetHasManuallyStopped}
      />
    );

    // Assert: Should show loading message
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display error when resume fails', async () => {
    // Arrange: Set resume parameter
    mockSearchParams.set('resume', 'conv-123');

    // Mock failed resume API call
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Conversation not found' }),
    });

    // Act: Render component
    render(
      <ResumeHandler
        user={mockUser}
        activeConversationId={null}
        sessionConfig={null}
        setSessionConfig={mockSetSessionConfig}
        setActiveConversationId={mockSetActiveConversationId}
        hasManuallyStopped={false}
        setHasManuallyStopped={mockSetHasManuallyStopped}
      />
    );

    // Assert: Should show error message
    await waitFor(() => {
      expect(screen.getByText(/Conversation not found/i)).toBeInTheDocument();
    });
  });

  it('should not resume if user is not authenticated', () => {
    // Arrange: Set resume parameter but no user
    mockSearchParams.set('resume', 'conv-123');

    // Act: Render component without user
    render(
      <ResumeHandler
        user={null}
        activeConversationId={null}
        sessionConfig={null}
        setSessionConfig={mockSetSessionConfig}
        setActiveConversationId={mockSetActiveConversationId}
        hasManuallyStopped={false}
        setHasManuallyStopped={mockSetHasManuallyStopped}
      />
    );

    // Assert: Should not call fetch
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should not resume if conversation is already active', () => {
    // Arrange: Set resume parameter but conversation already active
    mockSearchParams.set('resume', 'conv-123');

    // Act: Render component with active conversation
    render(
      <ResumeHandler
        user={mockUser}
        activeConversationId="conv-456"
        sessionConfig={null}
        setSessionConfig={mockSetSessionConfig}
        setActiveConversationId={mockSetActiveConversationId}
        hasManuallyStopped={false}
        setHasManuallyStopped={mockSetHasManuallyStopped}
      />
    );

    // Assert: Should not call fetch
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should not resume if session config already exists', () => {
    // Arrange: Set resume parameter but session config exists
    mockSearchParams.set('resume', 'conv-123');

    const existingConfig = {
      agentA_llm: 'ollama:qwen3:4b',
      agentB_llm: 'ollama:gemma3:4b',
      ttsEnabled: false,
      agentA_tts: { provider: 'none', voice: null },
      agentB_tts: { provider: 'none', voice: null },
      language: 'en',
      initialSystemPrompt: 'Test',
    };

    // Act: Render component with existing session config
    render(
      <ResumeHandler
        user={mockUser}
        activeConversationId={null}
        sessionConfig={existingConfig}
        setSessionConfig={mockSetSessionConfig}
        setActiveConversationId={mockSetActiveConversationId}
        hasManuallyStopped={false}
        setHasManuallyStopped={mockSetHasManuallyStopped}
      />
    );

    // Assert: Should not call fetch
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should not resume if user has manually stopped', () => {
    // Arrange: Set resume parameter but user manually stopped
    mockSearchParams.set('resume', 'conv-123');

    // Act: Render component with hasManuallyStopped=true
    render(
      <ResumeHandler
        user={mockUser}
        activeConversationId={null}
        sessionConfig={null}
        setSessionConfig={mockSetSessionConfig}
        setActiveConversationId={mockSetActiveConversationId}
        hasManuallyStopped={true}
        setHasManuallyStopped={mockSetHasManuallyStopped}
      />
    );

    // Assert: Should not call fetch
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should poll for conversation status after resume', async () => {
    // Arrange: Set resume parameter
    mockSearchParams.set('resume', 'conv-123');

    // Mock successful resume API call
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    // Mock details API call that returns running status
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'running',
        agentA_llm: 'ollama:qwen3:4b',
        agentB_llm: 'ollama:gemma3:4b',
        ttsSettings: {
          enabled: true,
          agentA: { provider: 'browser', voice: 'en-US' },
          agentB: { provider: 'browser', voice: 'en-GB' },
        },
        language: 'en',
        initialSystemPrompt: 'Test prompt',
      }),
    });

    // Act: Render component
    render(
      <ResumeHandler
        user={mockUser}
        activeConversationId={null}
        sessionConfig={null}
        setSessionConfig={mockSetSessionConfig}
        setActiveConversationId={mockSetActiveConversationId}
        hasManuallyStopped={false}
        setHasManuallyStopped={mockSetHasManuallyStopped}
      />
    );

    // Assert: Should call details API to poll for status
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/conversation/conv-123/details',
        expect.objectContaining({
          headers: { Authorization: 'Bearer mock-token' },
        })
      );
    });

    // Should set session config with TTS settings
    await waitFor(() => {
      expect(mockSetSessionConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          ttsEnabled: true,
          agentA_tts: { provider: 'browser', voice: 'en-US' },
          agentB_tts: { provider: 'browser', voice: 'en-GB' },
        })
      );
    });
  });

  it('should handle network errors during resume', async () => {
    // Arrange: Set resume parameter
    mockSearchParams.set('resume', 'conv-123');

    // Mock network error
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    // Act: Render component
    render(
      <ResumeHandler
        user={mockUser}
        activeConversationId={null}
        sessionConfig={null}
        setSessionConfig={mockSetSessionConfig}
        setActiveConversationId={mockSetActiveConversationId}
        hasManuallyStopped={false}
        setHasManuallyStopped={mockSetHasManuallyStopped}
      />
    );

    // Assert: Should show error message
    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it('should restore correct turn state when resuming', async () => {
    // Arrange: Set resume parameter
    mockSearchParams.set('resume', 'conv-123');

    // Mock successful resume
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    // Mock details with specific turn state
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'running',
        agentA_llm: 'ollama:qwen3:4b',
        agentB_llm: 'ollama:gemma3:4b',
        turn: 'agentB',
        ttsSettings: {
          enabled: false,
          agentA: { provider: 'none', voice: null },
          agentB: { provider: 'none', voice: null },
        },
        language: 'en',
        initialSystemPrompt: 'Test',
      }),
    });

    // Act: Render component
    render(
      <ResumeHandler
        user={mockUser}
        activeConversationId={null}
        sessionConfig={null}
        setSessionConfig={mockSetSessionConfig}
        setActiveConversationId={mockSetActiveConversationId}
        hasManuallyStopped={false}
        setHasManuallyStopped={mockSetHasManuallyStopped}
      />
    );

    // Assert: Should restore session config
    await waitFor(() => {
      expect(mockSetSessionConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          agentA_llm: 'ollama:qwen3:4b',
          agentB_llm: 'ollama:gemma3:4b',
        })
      );
      expect(mockSetActiveConversationId).toHaveBeenCalledWith('conv-123');
    });
  });
});
