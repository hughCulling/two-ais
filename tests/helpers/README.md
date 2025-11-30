# Test Helpers

This directory contains test utilities and fixtures for the Two-AIs application.

## Files

### firebase-helpers.ts
Firebase-related test utilities:

**Timestamp Helpers:**
- `createMockTimestamp(date?)` - Creates a Firestore Timestamp from a Date
- `createMockTimestampFromMillis(millis)` - Creates a Timestamp from milliseconds
- `createTimestampSequence(count, startDate?, incrementMs?)` - Creates a sequence of timestamps

**Mock Factories:**
- `createMockUser(overrides?)` - Creates a mock Firebase user
- `createMockAuth()` - Creates a mock Firebase Auth instance
- `createMockFirestore()` - Creates a mock Firestore instance
- `createMockRTDB()` - Creates a mock Realtime Database instance
- `createMockDocRef(collectionPath, docId)` - Creates a mock document reference
- `createMockCollectionRef(path)` - Creates a mock collection reference

**Utilities:**
- `waitFor(condition, timeout?, interval?)` - Waits for a condition to be true
- `delay(ms)` - Creates a delay
- `generateConversationId()` - Generates a random conversation ID
- `generateMessageId()` - Generates a random message ID
- `generateUserId()` - Generates a random user ID

### test-data.ts
Common test fixtures and mock data:

**User Fixtures:**
- `mockUser` - Default mock user
- `mockUser2` - Alternative mock user for multi-user tests

**Conversation Fixtures:**
- `mockConversation` - Default conversation with TTS disabled
- `mockConversationWithTTS` - Conversation with TTS enabled
- `mockStoppedConversation` - Stopped conversation
- `mockErrorConversation` - Conversation in error state

**Message Fixtures:**
- `mockMessage` - Default message
- `mockAgentAMessage` - Message from Agent A
- `mockAgentBMessage` - Message from Agent B
- `mockUserMessage` - Message from user
- `mockSystemMessage` - System message
- `mockMessageWithAudio` - Message with audio URL
- `mockStreamingMessage` - Streaming message
- `mockLongMessage` - Long message (for TTS chunking tests)
- `mockUnicodeMessage` - Message with Unicode content
- `mockMessageWithNewlines` - Message with newlines

**Session Config Fixtures:**
- `mockSessionConfig` - Default session config
- `mockSessionConfigWithTTS` - Session config with TTS enabled
- `mockInvalidSessionConfig` - Invalid session config

**TTS Fixtures:**
- `mockTTSSettings` - Default TTS settings (disabled)
- `mockEnabledTTSSettings` - Enabled TTS settings
- `mockApiSecretVersions` - Mock API secret versions
- `mockUserData` - Mock user data

**Factory Functions:**
- `createMockMessageSequence(count, startTime?)` - Creates a sequence of messages
- `createMockConversation(overrides?)` - Creates a conversation with custom properties
- `createMockMessage(overrides?)` - Creates a message with custom properties
- `createMockSessionConfig(overrides?)` - Creates a session config with custom properties

## Usage

### Using Fixtures

```typescript
import { mockConversation, mockMessage } from './helpers/test-data';

test('should process conversation', () => {
  const result = processConversation(mockConversation);
  expect(result).toBeDefined();
});
```

### Using Factory Functions

```typescript
import { createMockConversation, createMockMessage } from './helpers/test-data';

test('should handle stopped conversation', () => {
  const conversation = createMockConversation({ status: 'stopped' });
  expect(conversation.status).toBe('stopped');
});
```

### Using Firebase Helpers

```typescript
import { createMockUser, createTimestampSequence } from './helpers/firebase-helpers';

test('should authenticate user', async () => {
  const user = createMockUser({ email: 'test@example.com' });
  const token = await user.getIdToken();
  expect(token).toBe('mock-id-token');
});

test('should order messages by timestamp', () => {
  const timestamps = createTimestampSequence(5);
  // timestamps[0] < timestamps[1] < ... < timestamps[4]
});
```

### Waiting for Conditions

```typescript
import { waitFor, delay } from './helpers/firebase-helpers';

test('should wait for async operation', async () => {
  let completed = false;
  
  setTimeout(() => { completed = true; }, 100);
  
  await waitFor(() => completed, 1000);
  expect(completed).toBe(true);
});
```

## Best Practices

1. **Use fixtures for simple tests**: When you need standard test data, use the provided fixtures
2. **Use factory functions for variations**: When you need to customize test data, use the factory functions
3. **Use generators for property tests**: For property-based testing, use the generators from `tests/generators/`
4. **Mock Firebase services**: Use the mock Firebase helpers to avoid real database calls in unit tests
5. **Use waitFor for async tests**: When testing async operations, use `waitFor` instead of arbitrary delays
