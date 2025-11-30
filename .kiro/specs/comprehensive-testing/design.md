# Design Document: Comprehensive Testing

## Overview

This design establishes a comprehensive testing framework for the Two-AIs application, focusing on preventing regressions and ensuring correctness across all critical functionality. The testing strategy employs both traditional unit testing for specific scenarios and property-based testing for universal correctness properties.

The testing infrastructure will be built incrementally, starting with the most critical paths (conversation state management, message handling, Ollama integration) and expanding to cover all requirements. Tests will be co-located with source files where possible, following Next.js conventions.

## Architecture

### Testing Layers

The testing architecture consists of three complementary layers:

1. **Unit Tests**: Verify specific examples, edge cases, and integration points
   - Test individual functions and components
   - Validate error handling paths
   - Verify UI component rendering and interactions
   - Test API route handlers

2. **Property-Based Tests**: Verify universal properties across all valid inputs
   - Generate random test data to explore the input space
   - Validate invariants that must hold for all executions
   - Test round-trip properties (serialization/deserialization)
   - Verify state transitions maintain consistency

3. **Integration Tests**: Verify end-to-end workflows
   - Test complete user flows (session creation → conversation → TTS playback)
   - Validate Firebase integration (Firestore, RTDB, Auth)
   - Test API endpoints with real Firebase emulators

### Testing Framework Selection

**Unit Testing Framework**: Vitest
- Fast execution with native ESM support
- Compatible with Next.js 15 and React 19
- Built-in TypeScript support
- Jest-compatible API for easy migration
- Excellent watch mode for development

**Property-Based Testing Library**: fast-check
- Mature TypeScript-first library
- Rich set of built-in generators (arbitraries)
- Configurable test runs (default: 100 iterations per property)
- Shrinking support to find minimal failing examples
- Integrates seamlessly with Vitest

**Testing Utilities**:
- `@testing-library/react` for component testing
- `@testing-library/user-event` for user interaction simulation
- Firebase emulators for integration testing
- `msw` (Mock Service Worker) for API mocking when needed

## Components and Interfaces

### Test Organization Structure

```
src/
├── components/
│   ├── AppHome.tsx
│   ├── AppHome.test.tsx              # Unit tests
│   ├── chat/
│   │   ├── ChatInterface.tsx
│   │   ├── ChatInterface.test.tsx    # Unit tests
│   │   └── ChatInterface.properties.test.tsx  # Property-based tests
│   └── session/
│       ├── SessionSetupForm.tsx
│       └── SessionSetupForm.test.tsx
├── hooks/
│   ├── useOllamaAgent.ts
│   ├── useOllamaAgent.test.ts
│   └── useOllamaAgent.properties.test.ts
├── lib/
│   ├── firebase/
│   │   ├── clientApp.ts
│   │   └── clientApp.test.ts
│   ├── tts_models.ts
│   ├── tts_models.test.ts
│   └── utils.ts
│       └── utils.test.ts
└── app/
    └── api/
        ├── conversation/
        │   ├── start/
        │   │   ├── route.ts
        │   │   └── route.test.ts
        │   └── [id]/
        │       └── resume/
        │           ├── route.ts
        │           └── route.test.ts
        └── ollama/
            └── stream/
                ├── route.ts
                └── route.test.ts

tests/
├── integration/
│   ├── conversation-flow.test.ts     # End-to-end conversation tests
│   ├── tts-playback.test.ts          # TTS integration tests
│   └── setup.ts                       # Test environment setup
├── generators/                        # Shared property-based test generators
│   ├── conversation.ts                # Generate random conversation data
│   ├── messages.ts                    # Generate random messages
│   ├── sessionConfig.ts               # Generate random session configs
│   └── ttsSettings.ts                 # Generate random TTS settings
└── helpers/
    ├── firebase-helpers.ts            # Firebase test utilities
    └── test-data.ts                   # Common test fixtures
```

### Test Naming Conventions

- Unit test files: `*.test.ts` or `*.test.tsx`
- Property-based test files: `*.properties.test.ts`
- Integration test files: `*.integration.test.ts`
- Test suites: Describe the component/function being tested
- Test cases: Use "should" statements for clarity

### Property-Based Test Annotations

Each property-based test MUST include a comment linking it to the design document:

```typescript
// Feature: comprehensive-testing, Property 1: Conversation initialization
// Validates: Requirements 1.1
test('conversation creation initializes with valid state', () => {
  fc.assert(
    fc.property(conversationConfigArbitrary(), (config) => {
      const conversation = createConversation(config);
      expect(conversation.status).toBe('running');
      expect(conversation.turn).toMatch(/^(agentA|agentB)$/);
      // ... additional assertions
    }),
    { numRuns: 100 }
  );
});
```

## Data Models

### Test Data Generators (Arbitraries)

Property-based tests require generators that produce random valid test data. These generators will be defined in `tests/generators/`:

**Conversation Generator**:
```typescript
export const conversationConfigArbitrary = (): fc.Arbitrary<ConversationConfig> => {
  return fc.record({
    userId: fc.uuid(),
    agentA_llm: fc.oneof(
      fc.constant('mistral:mistral-large-latest'),
      fc.constant('ollama:qwen3:4b'),
      fc.constant('ollama:deepseek-r1:8b')
    ),
    agentB_llm: fc.oneof(
      fc.constant('mistral:mistral-large-latest'),
      fc.constant('ollama:gemma3:4b'),
      fc.constant('ollama:qwen3:8b')
    ),
    turn: fc.constantFrom('agentA', 'agentB'),
    status: fc.constant('running'),
    ttsSettings: ttsSettingsArbitrary(),
    apiSecretVersions: fc.dictionary(fc.string(), fc.string()),
  });
};
```

**Message Generator**:
```typescript
export const messageArbitrary = (): fc.Arbitrary<Message> => {
  return fc.record({
    id: fc.uuid(),
    role: fc.constantFrom('agentA', 'agentB', 'user', 'system'),
    content: fc.string({ minLength: 1, maxLength: 4000 }),
    timestamp: fc.date().map(d => Timestamp.fromDate(d)),
    audioUrl: fc.option(fc.webUrl(), { nil: null }),
    ttsWasSplit: fc.boolean(),
  });
};
```

**Session Config Generator**:
```typescript
export const sessionConfigArbitrary = (): fc.Arbitrary<SessionConfig> => {
  return fc.record({
    agentA_llm: fc.oneof(
      fc.constant('mistral:mistral-large-latest'),
      fc.constant('ollama:qwen3:4b')
    ),
    agentB_llm: fc.oneof(
      fc.constant('mistral:mistral-large-latest'),
      fc.constant('ollama:gemma3:4b')
    ),
    ttsEnabled: fc.boolean(),
    agentA_tts: ttsConfigArbitrary(),
    agentB_tts: ttsConfigArbitrary(),
    language: fc.constantFrom('en', 'es', 'fr', 'de', 'ja', 'zh'),
    initialSystemPrompt: fc.string({ minLength: 10, maxLength: 500 }),
  });
};
```

### Browser TTS Voice Types

When testing browser TTS functionality, it's important to understand the two types of voices:

**Local Service Voices** (`localService: true`):
- Installed directly on the user's device (computer, phone, tablet)
- Run locally without requiring internet connection
- Examples: "Samantha" on macOS, "Microsoft David" on Windows, "Daniel" on iOS
- Benefits: Faster response, more reliable, works offline, better privacy
- The system prefers these voices for better user experience

**Cloud Voices** (`localService: false`):
- Require internet connection and send text to remote servers for processing
- Examples: Google's cloud-based voices in Chrome
- May have quality or latency issues depending on network conditions
- The system uses these as fallback when local voices are unavailable

The `findFallbackBrowserVoice` function implements a multi-tier fallback strategy that prefers local service voices but will use any compatible voice to ensure TTS functionality is maintained.

### Test Fixtures

Common test data will be defined in `tests/helpers/test-data.ts`:

```typescript
export const mockUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
  getIdToken: async () => 'mock-id-token',
};

export const mockConversation: ConversationData = {
  userId: 'test-user-123',
  agentA_llm: 'ollama:qwen3:4b',
  agentB_llm: 'ollama:gemma3:4b',
  turn: 'agentA',
  status: 'running',
  createdAt: Timestamp.now(),
  lastActivity: Timestamp.now(),
  apiSecretVersions: {},
  ttsSettings: {
    enabled: false,
    agentA: { provider: 'none', voice: null },
    agentB: { provider: 'none', voice: null },
  },
};

export const mockMessage: Message = {
  id: 'msg-123',
  role: 'agentA',
  content: 'Hello, this is a test message.',
  timestamp: Timestamp.now(),
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Conversation initialization creates valid state
*For any* valid conversation configuration, creating a conversation should initialize with status "running", a valid turn assignment (agentA or agentB), and all required configuration fields present.
**Validates: Requirements 1.1**

### Property 2: Turn toggling maintains consistency
*For any* conversation state, when an agent completes a message, the turn should toggle to the other agent (agentA ↔ agentB) and the lastActivity timestamp should be updated.
**Validates: Requirements 1.2**

### Property 3: Stopped conversations prevent message generation
*For any* conversation, when status is set to "stopped", no new messages should be generated regardless of turn state.
**Validates: Requirements 1.4**

### Property 4: TTS signal blocks turn progression
*For any* conversation with TTS enabled, when waitingForTTSEndSignal is true, the next agent turn should not begin until the signal is cleared. This prevents agents from generating messages faster than they can be played, ensuring users can listen to each message before the next one is generated.
**Validates: Requirements 1.5**

### Property 5: Message creation includes required fields
*For any* message data, creating a message should result in a stored message with role, content, and timestamp fields present (audioUrl is optional).
**Validates: Requirements 2.1**

### Property 6: Message ordering by timestamp
*For any* set of messages in a conversation, querying messages should return them ordered by timestamp in ascending order (oldest first, newest last). This ensures messages are displayed in the correct chronological order in the chat interface.
**Validates: Requirements 2.2**

### Property 7: Streaming messages have correct status
*For any* message being streamed, the RTDB entry should have status "streaming" while content is being generated.
**Validates: Requirements 2.3**

### Property 8: Streaming completion transitions to Firestore
*For any* completed streaming message, the Firestore document should have the same message ID as the RTDB entry and status should be "complete".
**Validates: Requirements 2.4**

### Property 9: Unicode content preservation (round-trip)
*For any* message content containing Unicode characters (emoji, CJK characters, special symbols), storing and retrieving the message should preserve the exact content without corruption.
**Validates: Requirements 2.5**

### Property 10: Lookahead limit prevents generation
*For any* conversation, when the number of unplayed agent messages reaches the lookahead limit (3), no new messages should be generated until messages are played.
**Validates: Requirements 3.5**

### Property 11: TTS enabled generates audio URL for API-based providers
*For any* agent message where TTS is enabled with an API-based provider (not browser/Web Speech API), the message should have an audioUrl field populated after generation. Browser TTS generates audio on-the-fly without creating files, so it will not have an audioUrl.
**Validates: Requirements 4.1**

### Property 12: Long messages are chunked for TTS
*For any* message content exceeding TTS input limits (4000 characters), the message should be split into chunks and ttsWasSplit should be true.
**Validates: Requirements 4.2**

### Property 13: Browser TTS splits on paragraphs
*For any* message content with newlines, browser TTS should split the text into separate paragraphs for auto-scrolling.
**Validates: Requirements 4.3**

### Property 14: Audio completion updates state
*For any* message that finishes playing, lastPlayedAgentMessageId should be updated to that message's ID and waitingForTTSEndSignal should be cleared.
**Validates: Requirements 4.4**

### Property 15: Conversation ownership validation
*For any* conversation and user ID, requesting conversation data should succeed only if the userId matches the conversation's userId field.
**Validates: Requirements 5.3**

### Property 16: Session config validation rejects empty LLMs
*For any* session configuration with empty agentA_llm or agentB_llm fields, validation should reject the configuration.
**Validates: Requirements 6.1**

### Property 17: TTS config validation
*For any* session configuration with ttsEnabled true, validation should require provider and voice to be specified for both agents.
**Validates: Requirements 6.2**

### Property 18: Session config persistence
*For any* valid session configuration, starting a session should persist all configuration fields to the conversation document.
**Validates: Requirements 6.3**

### Property 19: Invalid config rejection
*For any* invalid session configuration (missing required fields, invalid values), submission should be rejected with a descriptive error message.
**Validates: Requirements 6.4**

### Property 20: Streaming updates RTDB
*For any* agent message being generated, content updates should be written to RTDB in real-time as the message is generated.
**Validates: Requirements 7.1**

### Property 21: Streaming preserves message ID
*For any* streaming message that completes, the Firestore message document should have the same ID as the RTDB streaming message entry.
**Validates: Requirements 7.4**

### Property 22: Error state preserves conversation data
*For any* conversation that encounters an error, the conversation document should retain all existing data (messages, config, state) and only add error information.
**Validates: Requirements 8.5**

### Property 23: Conversation history ordering
*For any* user's conversation history, conversations should be ordered by lastActivity timestamp in descending order (most recent first).
**Validates: Requirements 9.1**

### Property 24: Resumed conversation state restoration
*For any* stopped conversation that is resumed, the conversation should restore the correct turn state, agent configurations, and TTS settings.
**Validates: Requirements 9.3**

### Property 25: History filtering by user
*For any* user querying conversation history, results should include only conversations where the userId matches the authenticated user's ID.
**Validates: Requirements 9.5**

### Property 26: Paused audio tracks chunk position
*For any* browser TTS playback that is paused, the system should maintain the current chunk index. This allows playback to resume from approximately the same position even if the Web Speech API loses its exact playback position during extended pauses (which can cause it to restart from the beginning or skip to the next turn).
**Validates: Requirements 10.2**

### Property 27: API key retrieval for conversations
*For any* conversation being started, the system should retrieve the current API key versions from the user document's apiSecretVersions field.
**Validates: Requirements 11.2**

### Property 28: Missing API keys prevent session creation
*For any* session configuration requiring an API key for a provider, if the user has no API key configured for that provider, session creation should be prevented with a clear error.
**Validates: Requirements 11.4**

### Property 29: Translation parameter substitution
*For any* translated error message with parameters, the system should correctly substitute parameter values into the translated string.
**Validates: Requirements 12.3**

### Property 30: TTS voice fallback with language preference (cross-browser scenarios)
*For any* browser TTS configuration where the selected voice is unavailable (e.g., when resuming a conversation in a different browser that doesn't have the same Web Speech API voices), the system should attempt to select a fallback voice using the following priority order:
1. Exact language match (e.g., 'en-US') with local service preference
2. Simple language code match (e.g., 'en' for 'en-US') with local service preference  
3. Any compatible voice as a last resort

This multi-tier fallback ensures TTS functionality is maintained even when no language-matching voice is available, which is particularly important when users start conversations in one browser (e.g., Edge) and resume them in another (e.g., Safari) where different voices are available. The preference for local service voices ensures better reliability and offline functionality.
**Validates: Requirements 12.5**

## Error Handling

### Error Categories

1. **Validation Errors**: Invalid input data (empty LLMs, missing API keys)
   - Return descriptive error messages
   - Prevent invalid state from being created
   - Test with property-based tests using invalid generators

2. **Network Errors**: Failed API calls, timeouts
   - Implement retry logic with exponential backoff
   - Preserve partial state when possible
   - Test with mocked network failures

3. **State Errors**: Race conditions, concurrent updates
   - Use processing locks to prevent conflicts
   - Test with concurrent operation simulations
   - Verify lock acquisition and release

4. **TTS Errors**: Audio generation failures, playback issues
   - Allow conversation to continue without audio
   - Log errors for debugging
   - Test with mocked TTS failures

### Error Testing Strategy

- Use property-based tests to generate edge cases
- Mock external services to simulate failures
- Verify error messages are user-friendly
- Ensure errors don't corrupt application state
- Test error recovery paths

## Testing Strategy

### Important Testing Considerations

**Ollama Testing**:
- Ollama must be running locally for integration tests (routes through localhost:11434 to local or cloud models)
- **Unit tests**: Mock Ollama API responses (no real Ollama calls, no need for Ollama to be running)
  - Mock the `/api/ollama/stream` endpoint to return fake streaming responses
  - Mock the `useOllamaAgent` hook behavior
  - Test logic without actual model inference
- **Integration tests**: Optionally use real Ollama if running (will skip if unavailable)
- No rate limits or costs for local Ollama models (cloud models through Ollama may have costs)

**Firebase Testing**:
- **Unit tests**: Use mocked Firebase services (no real database calls)
- **Integration tests**: Use Firebase emulators (local, no cost, no rate limits)
- **Never use production Firebase** for automated tests
- Firebase emulators run locally and don't affect your production data
- Emulators provide realistic Firebase behavior without costs

**API Rate Limits**:
- Mistral API tests should be mocked to avoid rate limit usage
- Only integration tests with explicit user approval should call real APIs
- Use test fixtures and mocked responses for most tests
- Property-based tests generate data locally without API calls

**Test Data Isolation**:
- All test data is generated in-memory or in emulators
- No test data will appear in your production Firestore
- Emulators are cleared between test runs
- Tests are completely isolated from production

### Unit Testing Approach

Unit tests will focus on:
- Individual function correctness
- Component rendering and props
- Event handler behavior
- Error boundary behavior
- Utility function edge cases

**Example unit test structure**:
```typescript
describe('SessionSetupForm', () => {
  it('should validate LLM selections are non-empty', () => {
    const { getByRole } = render(<SessionSetupForm onStartSession={jest.fn()} />);
    const submitButton = getByRole('button', { name: /start/i });
    
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/select both agents/i)).toBeInTheDocument();
  });

  it('should call onStartSession with valid config', () => {
    const onStartSession = jest.fn();
    const { getByRole, getByLabelText } = render(
      <SessionSetupForm onStartSession={onStartSession} />
    );
    
    // Select agents
    fireEvent.change(getByLabelText(/agent a/i), { 
      target: { value: 'ollama:qwen3:4b' } 
    });
    fireEvent.change(getByLabelText(/agent b/i), { 
      target: { value: 'ollama:gemma3:4b' } 
    });
    
    // Submit
    fireEvent.click(getByRole('button', { name: /start/i }));
    
    expect(onStartSession).toHaveBeenCalledWith(
      expect.objectContaining({
        agentA_llm: 'ollama:qwen3:4b',
        agentB_llm: 'ollama:gemma3:4b',
      })
    );
  });
});
```

### Property-Based Testing Approach

Property-based tests will:
- Run 100 iterations per property (configurable)
- Generate random valid inputs using arbitraries
- Verify universal properties hold for all inputs
- Use shrinking to find minimal failing examples

**Example property-based test structure**:
```typescript
// Feature: comprehensive-testing, Property 1: Conversation initialization
// Validates: Requirements 1.1
describe('Conversation State Properties', () => {
  it('should initialize conversations with valid state', () => {
    fc.assert(
      fc.property(conversationConfigArbitrary(), (config) => {
        const conversation = createConversation(config);
        
        // Property: All conversations start with "running" status
        expect(conversation.status).toBe('running');
        
        // Property: Turn is always agentA or agentB
        expect(conversation.turn).toMatch(/^(agentA|agentB)$/);
        
        // Property: All required fields are present
        expect(conversation).toHaveProperty('userId');
        expect(conversation).toHaveProperty('agentA_llm');
        expect(conversation).toHaveProperty('agentB_llm');
        expect(conversation).toHaveProperty('createdAt');
        expect(conversation).toHaveProperty('lastActivity');
      }),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing Approach

Integration tests will:
- Use Firebase emulators for Firestore and RTDB (local, no cost)
- Test complete user flows end-to-end
- Verify cross-component interactions
- Test real API endpoints against emulators
- Optionally test with local Ollama if running (will skip if unavailable)
- Never call production Firebase or paid APIs

**Example integration test structure**:
```typescript
describe('Conversation Flow Integration', () => {
  beforeAll(async () => {
    // Start Firebase emulators
    await startEmulators();
  });

  afterAll(async () => {
    await stopEmulators();
  });

  it('should complete a full conversation cycle', async () => {
    // 1. Create user and authenticate
    const user = await createTestUser();
    
    // 2. Start session
    const response = await fetch('/api/conversation/start', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await user.getIdToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentA_llm: 'ollama:qwen3:4b',
        agentB_llm: 'ollama:gemma3:4b',
        ttsEnabled: false,
        initialSystemPrompt: 'Test conversation',
      }),
    });
    
    const { conversationId } = await response.json();
    
    // 3. Verify conversation was created
    const conversationDoc = await getDoc(
      doc(db, 'conversations', conversationId)
    );
    expect(conversationDoc.exists()).toBe(true);
    expect(conversationDoc.data().status).toBe('running');
    
    // 4. Wait for first message
    const messages = await waitForMessages(conversationId, 1);
    expect(messages).toHaveLength(1);
    expect(messages[0].role).toMatch(/^(agentA|agentB)$/);
    
    // 5. Stop conversation
    await updateDoc(doc(db, 'conversations', conversationId), {
      status: 'stopped',
    });
    
    // 6. Verify no more messages are generated
    await wait(2000);
    const finalMessages = await getMessages(conversationId);
    expect(finalMessages.length).toBe(messages.length);
  });
});
```

### Test Execution Strategy

**Development workflow**:
1. Run tests in watch mode during development: `npm run test:watch`
2. Run specific test suites: `npm run test -- ChatInterface`
3. Run property-based tests with more iterations for thorough testing: `npm run test:properties`

**CI/CD workflow**:
1. Run all unit tests on every commit
2. Run property-based tests with 100 iterations
3. Run integration tests with Firebase emulators
4. Generate coverage reports
5. Fail build if coverage drops below threshold (80%)

**Test organization**:
- Unit tests run fast (< 5 seconds total)
- Property-based tests run moderate (< 30 seconds total)
- Integration tests run slower (< 2 minutes total)
- Separate test commands for each category

### Coverage Goals

- **Unit test coverage**: 80% of lines, branches, and functions
- **Property-based test coverage**: All identified correctness properties
- **Integration test coverage**: All critical user flows
- **Priority areas**: Conversation state management, message handling, Ollama integration, TTS processing

### Testing Tools Configuration

**vitest.config.ts**:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.test.{ts,tsx}',
        '**/*.config.{ts,js}',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**tests/setup.ts**:
```typescript
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Firebase
vi.mock('@/lib/firebase/clientApp', () => ({
  db: {},
  rtdb: {},
  auth: {},
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock window.speechSynthesis for TTS tests
global.speechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  getVoices: vi.fn(() => []),
  speaking: false,
  pending: false,
  paused: false,
} as any;
```

## Implementation Phases

### Phase 1: Foundation (Priority: Critical)
- Set up Vitest and testing infrastructure
- Configure test environment and mocks
- Create shared test generators (arbitraries)
- Implement test helpers and utilities
- Write tests for core utilities (lib/utils.ts)

### Phase 2: Conversation State Management (Priority: Critical)
- Test conversation creation and initialization (Property 1)
- Test turn toggling logic (Property 2)
- Test conversation stopping (Property 3)
- Test TTS signal blocking (Property 4)
- Test processing locks and concurrency

### Phase 3: Message Handling (Priority: Critical)
- Test message creation and storage (Property 5)
- Test message ordering (Property 6)
- Test streaming state management (Properties 7, 8)
- Test Unicode content preservation (Property 9)
- Test message queries and filtering

### Phase 4: Ollama Integration (Priority: High)
- Test Ollama routing logic
- Test retry mechanism
- Test error handling
- Test Agent B delay
- Test lookahead limit (Property 10)

### Phase 5: TTS Processing (Priority: High)
- Test TTS audio generation (Property 11)
- Test message chunking (Property 12)
- Test paragraph splitting (Property 13)
- Test playback state management (Property 14)
- Test TTS error handling

### Phase 6: Authentication & Authorization (Priority: High)
- Test authentication redirects
- Test conversation ownership (Property 15)
- Test API key management (Properties 27, 28)
- Test user document handling

### Phase 7: Session Configuration (Priority: Medium)
- Test config validation (Properties 16, 17, 19)
- Test config persistence (Property 18)
- Test error messages for invalid configs

### Phase 8: Real-time Streaming (Priority: Medium)
- Test RTDB updates (Property 20)
- Test message ID preservation (Property 21)
- Test streaming interruption handling
- Test streaming completion

### Phase 9: Error Handling (Priority: Medium)
- Test error state preservation (Property 22)
- Test network error retries
- Test rate limit handling
- Test Firestore error handling

### Phase 10: Conversation History (Priority: Medium)
- Test history ordering (Property 23)
- Test resume functionality (Property 24)
- Test history filtering (Property 25)
- Test URL parameter handling

### Phase 11: UI State Management (Priority: Low)
- Test audio control states
- Test chunk position tracking (Property 26)
- Test visual indicators
- Test fullscreen mode

### Phase 12: Multi-language Support (Priority: Low)
- Test translation loading
- Test parameter substitution (Property 29)
- Test TTS voice fallback (Property 30)
- Test language context loading

## Performance Considerations

- Property-based tests run 100 iterations by default (configurable)
- Use test.concurrent for independent tests to speed up execution
- Mock external services (Firebase, Ollama) to avoid network latency
- Use Firebase emulators for integration tests instead of production
- Cache test fixtures and generators for reuse
- Run integration tests in parallel where possible

## Security Considerations

- Never commit real API keys in test fixtures
- Use Firebase emulators for all integration tests
- Mock authentication in unit tests
- Test authorization boundaries (user can only access their data)
- Verify API key storage uses Secret Manager references
- Test that error messages don't leak sensitive information

## Maintenance and Evolution

### Adding New Tests

When adding new features:
1. Update requirements.md with new acceptance criteria
2. Update design.md with new correctness properties
3. Create test generators for new data types
4. Write property-based tests for universal properties
5. Write unit tests for specific examples and edge cases
6. Update integration tests if user flows change

### Updating Existing Tests

When modifying features:
1. Update requirements if behavior changes
2. Update properties if invariants change
3. Update test generators if data structures change
4. Fix failing tests or update assertions
5. Verify coverage remains above threshold

### Test Maintenance

- Review and refactor tests quarterly
- Remove obsolete tests when features are removed
- Update mocks when external APIs change
- Keep test generators in sync with production types
- Document complex test scenarios

## Conclusion

This testing framework provides comprehensive coverage of the Two-AIs application through a combination of unit tests, property-based tests, and integration tests. The property-based testing approach ensures that universal correctness properties hold across all valid inputs, while unit tests verify specific scenarios and edge cases.

The incremental implementation approach allows for gradual adoption, starting with the most critical functionality (conversation state management, message handling, Ollama integration) and expanding to cover all requirements. This prevents regressions and provides confidence when adding new features or refactoring existing code.
