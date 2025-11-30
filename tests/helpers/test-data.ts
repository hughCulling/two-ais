// tests/helpers/test-data.ts
// Common test fixtures and mock data

import { Timestamp } from 'firebase/firestore';
import { createMockTimestamp, createMockUser } from './firebase-helpers';

/**
 * Mock user fixture
 */
export const mockUser = createMockUser({
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User'
});

/**
 * Alternative mock user for multi-user tests
 */
export const mockUser2 = createMockUser({
  uid: 'test-user-456',
  email: 'test2@example.com',
  displayName: 'Test User 2'
});

/**
 * Mock conversation data fixture
 */
export const mockConversation = {
  userId: 'test-user-123',
  agentA_llm: 'ollama:qwen2.5:3b',
  agentB_llm: 'ollama:gemma2:2b',
  language: 'en',
  turn: 'agentA' as const,
  status: 'running' as const,
  createdAt: createMockTimestamp(),
  lastActivity: createMockTimestamp(),
  apiSecretVersions: {},
  ttsSettings: {
    enabled: false,
    agentA: { provider: 'none', voice: null },
    agentB: { provider: 'none', voice: null },
  },
  waitingForTTSEndSignal: false,
};

/**
 * Mock conversation with TTS enabled
 */
export const mockConversationWithTTS = {
  ...mockConversation,
  ttsSettings: {
    enabled: true,
    agentA: { 
      provider: 'browser', 
      voice: 'browser-microsoft-david-desktop' 
    },
    agentB: { 
      provider: 'browser', 
      voice: 'browser-microsoft-zira-desktop' 
    },
  },
};

/**
 * Mock stopped conversation
 */
export const mockStoppedConversation = {
  ...mockConversation,
  status: 'stopped' as const,
};

/**
 * Mock error conversation
 */
export const mockErrorConversation = {
  ...mockConversation,
  status: 'error' as const,
  errorMessage: 'Test error message',
  errorContext: 'Test error context',
};

/**
 * Mock message fixture
 */
export const mockMessage = {
  id: 'msg-123',
  role: 'agentA' as const,
  content: 'Hello, this is a test message.',
  timestamp: createMockTimestamp(),
  audioUrl: undefined,
  ttsWasSplit: false,
  isStreaming: false,
};

/**
 * Mock agent A message
 */
export const mockAgentAMessage = {
  ...mockMessage,
  id: 'msg-agentA-1',
  role: 'agentA' as const,
  content: 'This is a message from Agent A.',
};

/**
 * Mock agent B message
 */
export const mockAgentBMessage = {
  ...mockMessage,
  id: 'msg-agentB-1',
  role: 'agentB' as const,
  content: 'This is a message from Agent B.',
};

/**
 * Mock user message
 */
export const mockUserMessage = {
  ...mockMessage,
  id: 'msg-user-1',
  role: 'user' as const,
  content: 'This is a message from the user.',
};

/**
 * Mock system message
 */
export const mockSystemMessage = {
  ...mockMessage,
  id: 'msg-system-1',
  role: 'system' as const,
  content: 'This is a system message.',
};

/**
 * Mock message with audio
 */
export const mockMessageWithAudio = {
  ...mockMessage,
  id: 'msg-audio-1',
  audioUrl: 'https://example.com/audio/msg-audio-1.mp3',
};

/**
 * Mock streaming message
 */
export const mockStreamingMessage = {
  ...mockMessage,
  id: 'msg-streaming-1',
  content: 'This message is currently being streamed...',
  timestamp: null,
  isStreaming: true,
};

/**
 * Mock long message (for TTS chunking tests)
 */
export const mockLongMessage = {
  ...mockMessage,
  id: 'msg-long-1',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(100), // ~5000 chars
  ttsWasSplit: true,
};

/**
 * Mock message with Unicode content
 */
export const mockUnicodeMessage = {
  ...mockMessage,
  id: 'msg-unicode-1',
  content: 'Hello 世界 🌍 مرحبا Привет こんにちは',
};

/**
 * Mock message with newlines (for paragraph splitting)
 */
export const mockMessageWithNewlines = {
  ...mockMessage,
  id: 'msg-newlines-1',
  content: 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.',
};

/**
 * Mock session config fixture
 */
export const mockSessionConfig = {
  agentA_llm: 'ollama:qwen2.5:3b',
  agentB_llm: 'ollama:gemma2:2b',
  ttsEnabled: false,
  agentA_tts: {
    provider: 'none',
    voice: null,
  },
  agentB_tts: {
    provider: 'none',
    voice: null,
  },
  language: 'en',
  initialSystemPrompt: 'You are a helpful AI assistant.',
};

/**
 * Mock session config with TTS
 */
export const mockSessionConfigWithTTS = {
  ...mockSessionConfig,
  ttsEnabled: true,
  agentA_tts: {
    provider: 'browser',
    voice: 'browser-microsoft-david-desktop',
  },
  agentB_tts: {
    provider: 'browser',
    voice: 'browser-microsoft-zira-desktop',
  },
};

/**
 * Mock invalid session config (empty LLMs)
 */
export const mockInvalidSessionConfig = {
  ...mockSessionConfig,
  agentA_llm: '',
  agentB_llm: '',
};

/**
 * Mock TTS settings
 */
export const mockTTSSettings = {
  enabled: false,
  agentA: { provider: 'none', voice: null },
  agentB: { provider: 'none', voice: null },
};

/**
 * Mock enabled TTS settings
 */
export const mockEnabledTTSSettings = {
  enabled: true,
  agentA: { 
    provider: 'browser', 
    voice: 'browser-microsoft-david-desktop' 
  },
  agentB: { 
    provider: 'browser', 
    voice: 'browser-microsoft-zira-desktop' 
  },
};

/**
 * Mock API secret versions
 */
export const mockApiSecretVersions = {
  mistral: 'projects/123/secrets/mistral-api-key/versions/1',
  openai: 'projects/123/secrets/openai-api-key/versions/1',
};

/**
 * Mock user data
 */
export const mockUserData = {
  apiSecretVersions: mockApiSecretVersions,
};

/**
 * Helper to create a sequence of mock messages
 */
export const createMockMessageSequence = (count: number, startTime: Date = new Date()) => {
  const messages = [];
  let currentTime = startTime.getTime();
  
  for (let i = 0; i < count; i++) {
    const role = i % 2 === 0 ? 'agentA' : 'agentB';
    messages.push({
      id: `msg-${i}`,
      role: role as 'agentA' | 'agentB',
      content: `Message ${i} from ${role}`,
      timestamp: Timestamp.fromMillis(currentTime),
      audioUrl: undefined,
      ttsWasSplit: false,
      isStreaming: false,
    });
    currentTime += 1000; // 1 second apart
  }
  
  return messages;
};

/**
 * Helper to create mock conversation with custom properties
 */
export const createMockConversation = (overrides?: Partial<typeof mockConversation>) => {
  return {
    ...mockConversation,
    ...overrides,
  };
};

/**
 * Helper to create mock message with custom properties
 */
export const createMockMessage = (overrides?: Partial<typeof mockMessage>) => {
  return {
    ...mockMessage,
    ...overrides,
  };
};

/**
 * Helper to create mock session config with custom properties
 */
export const createMockSessionConfig = (overrides?: Partial<typeof mockSessionConfig>) => {
  return {
    ...mockSessionConfig,
    ...overrides,
  };
};
