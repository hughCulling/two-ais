# Requirements Document

## Introduction

This specification defines comprehensive testing coverage for the Two-AIs application, a multi-agent conversational AI platform. The application enables two AI agents to engage in conversations using LLM providers (currently Mistral and Ollama, with support for additional providers that can be re-enabled), with features including text-to-speech, conversation history, user authentication, and real-time streaming. The testing framework will prevent regressions and ensure system correctness across all critical functionality.

## Glossary

- **System**: The Two-AIs application including frontend, backend, and Firebase integration
- **Agent**: An AI entity (Agent A or Agent B) that participates in conversations
- **Conversation**: A session containing messages exchanged between agents and users
- **LLM Provider**: A language model service (OpenAI, Anthropic, Google, Mistral, xAI, or Ollama)
- **TTS**: Text-to-speech functionality for audio playback of agent messages
- **Streaming Message**: A message being generated in real-time via RTDB
- **Firestore**: Firebase's document database for persistent storage
- **RTDB**: Firebase Realtime Database for streaming message content
- **Session Config**: Configuration specifying agent models, TTS settings, and language
- **Lookahead Limit**: Maximum number of unplayed agent messages allowed before pausing generation
- **Local Service Voice**: A TTS voice installed on the user's device that runs locally without internet connection (e.g., "Samantha" on macOS, "Microsoft David" on Windows)
- **Cloud Voice**: A TTS voice that requires internet connection and processes audio on remote servers (e.g., Google Cloud TTS voices)

## Requirements

### Requirement 1: Conversation State Management

**User Story:** As a developer, I want reliable conversation state management, so that conversations maintain consistency and prevent race conditions.

#### Acceptance Criteria

1. WHEN a conversation is created THEN the System SHALL initialize with status "running", a valid turn assignment, and all required configuration fields
2. WHEN an agent completes a message THEN the System SHALL toggle the turn to the other agent and update lastActivity timestamp
3. WHEN multiple state updates occur concurrently THEN the System SHALL maintain data integrity through proper locking mechanisms
4. WHEN a conversation is stopped THEN the System SHALL set status to "stopped" and prevent further message generation
5. WHEN TTS is enabled and playing THEN the System SHALL set waitingForTTSEndSignal to true and prevent the next agent turn until audio completes

### Requirement 2: Message Handling and Persistence

**User Story:** As a developer, I want robust message handling, so that all messages are correctly stored, retrieved, and displayed.

#### Acceptance Criteria

1. WHEN a message is created THEN the System SHALL store it with role, content, timestamp, and optional audioUrl fields
2. WHEN messages are queried THEN the System SHALL return them ordered by timestamp in ascending order
3. WHEN a streaming message is in progress THEN the System SHALL update RTDB with incremental content and mark status as "streaming"
4. WHEN streaming completes THEN the System SHALL save the complete message to Firestore with status "complete"
5. WHEN a message contains special characters or Unicode THEN the System SHALL preserve the exact content without corruption

### Requirement 3: Ollama Integration

**User Story:** As a developer, I want reliable Ollama model integration, so that users can run conversations with locally-hosted or cloud-based Ollama models.

#### Acceptance Criteria

1. WHEN an agent uses an Ollama model THEN the System SHALL route requests to the configured Ollama endpoint without using Firebase Functions
2. WHEN Ollama streaming fails THEN the System SHALL retry up to 2 additional times with exponential backoff
3. WHEN Ollama returns an error THEN the System SHALL set conversation status to "error" with descriptive error context
4. WHEN Agent B uses Ollama THEN the System SHALL delay the request by 500ms to avoid concurrent request conflicts
5. WHEN the lookahead limit is reached THEN the System SHALL skip Ollama message generation until messages are played

### Requirement 4: Text-to-Speech Processing

**User Story:** As a developer, I want reliable TTS processing, so that agent messages are correctly converted to audio.

#### Acceptance Criteria

1. WHEN TTS is enabled for an agent THEN the System SHALL generate audio for that agent's messages using the configured provider and voice
2. WHEN a message exceeds TTS input limits THEN the System SHALL split the content into chunks and mark ttsWasSplit as true
3. WHEN browser TTS is used THEN the System SHALL split text into paragraphs to enable auto-scrolling during playback
4. WHEN audio playback completes THEN the System SHALL update lastPlayedAgentMessageId and clear waitingForTTSEndSignal
5. WHEN TTS generation fails THEN the System SHALL log the error and allow conversation to continue without audio

### Requirement 5: Authentication and Authorization

**User Story:** As a developer, I want secure authentication and authorization, so that only authorized users can access their conversations.

#### Acceptance Criteria

1. WHEN a user is not authenticated THEN the System SHALL redirect to the language-specific landing page
2. WHEN a user creates a conversation THEN the System SHALL associate it with their userId
3. WHEN a user requests conversation data THEN the System SHALL verify the userId matches the conversation owner
4. WHEN an API key is stored THEN the System SHALL save it as a secret version reference in the user document
5. WHEN a user signs out THEN the System SHALL clear all session state and redirect to the landing page

### Requirement 6: Session Configuration

**User Story:** As a developer, I want validated session configuration, so that conversations start with valid settings.

#### Acceptance Criteria

1. WHEN a session is configured THEN the System SHALL validate that both agent LLM selections are non-empty
2. WHEN TTS is enabled THEN the System SHALL validate that provider and voice are specified for each agent
3. WHEN a session starts THEN the System SHALL persist the configuration to the conversation document
4. WHEN an invalid configuration is submitted THEN the System SHALL reject it with a descriptive error message
5. WHEN a user has no API keys configured THEN the System SHALL prevent session creation and display an appropriate error

### Requirement 7: Real-time Streaming

**User Story:** As a developer, I want reliable real-time streaming, so that users see messages as they are generated and receive immediate feedback instead of waiting for complete message generation.

#### Acceptance Criteria

1. WHEN an agent generates a message THEN the System SHALL stream content updates to RTDB in real-time
2. WHEN a streaming message is updated THEN the System SHALL trigger UI updates within 100ms
3. WHEN streaming is interrupted THEN the System SHALL mark the message status as "error" and preserve partial content
4. WHEN a streaming message completes THEN the System SHALL transition it from RTDB to Firestore with the same message ID
5. WHEN an agent generates any message THEN the System SHALL display incremental content as it is generated regardless of message length

### Requirement 8: Error Handling and Recovery

**User Story:** As a developer, I want comprehensive error handling, so that failures are gracefully managed and reported.

#### Acceptance Criteria

1. WHEN an LLM API call fails THEN the System SHALL set conversation status to "error" with the error message and context
2. WHEN a network error occurs during session start THEN the System SHALL retry up to 3 times with exponential backoff
3. WHEN a Firestore operation fails THEN the System SHALL log the error and display a user-friendly message
4. WHEN rate limits are exceeded THEN the System SHALL extract and display a simplified error message
5. WHEN an error occurs THEN the System SHALL preserve conversation state and allow users to view error details

### Requirement 9: Conversation History

**User Story:** As a developer, I want reliable conversation history, so that users can resume and review past conversations.

#### Acceptance Criteria

1. WHEN a user views their history THEN the System SHALL display all conversations ordered by lastActivity descending
2. WHEN a user accesses a URL with a resume query parameter THEN the System SHALL load the specified conversation's session config and message history
3. WHEN a conversation is resumed THEN the System SHALL restore the correct turn state and continue from where it stopped
4. WHEN a user manually stops a conversation THEN the System SHALL remove the resume query parameter to prevent automatic resumption on page refresh
5. WHEN conversation history is queried THEN the System SHALL filter results to only the authenticated user's conversations

### Requirement 10: UI State Management

**User Story:** As a developer, I want consistent UI state management, so that the interface accurately reflects system state.

#### Acceptance Criteria

1. WHEN audio is playing THEN the System SHALL display pause controls and disable play controls
2. WHEN audio is paused THEN the System SHALL display resume controls and track the current chunk position for browser TTS
3. WHEN a message is being played THEN the System SHALL display a visual indicator on the currently playing message
4. WHEN TTS auto-scroll is enabled THEN the System SHALL scroll to the current paragraph during playback
5. WHEN fullscreen mode is toggled THEN the System SHALL hide the header and expand the chat interface

### Requirement 11: API Key Management

**User Story:** As a developer, I want secure API key management, so that user credentials are safely stored and retrieved.

#### Acceptance Criteria

1. WHEN a user saves an API key THEN the System SHALL store it in Google Secret Manager with a versioned reference
2. WHEN a conversation starts THEN the System SHALL retrieve the current API key versions from the user document
3. WHEN an API key is updated THEN the System SHALL create a new secret version and update the user document reference
4. WHEN API keys are missing for a required provider THEN the System SHALL prevent session creation with a clear error
5. WHEN a user document does not exist THEN the System SHALL initialize an empty apiSecretVersions object without error

### Requirement 12: Multi-language Support

**User Story:** As a developer, I want reliable multi-language support, so that the application UI works correctly in all supported languages.

#### Acceptance Criteria

1. WHEN a user selects a UI language THEN the System SHALL load the corresponding translation file
2. WHEN the build process runs THEN the System SHALL enforce that all translation keys exist in all language files
3. WHEN error messages are displayed THEN the System SHALL use translated strings with proper parameter substitution
4. WHEN the language context loads THEN the System SHALL prevent rendering until translations are available
5. WHEN browser TTS cannot find the user-selected voice THEN the System SHALL attempt to select a fallback voice using the following priority: first by exact language match with local service preference, then by simple language code match, and finally any compatible voice as a last resort to ensure TTS functionality
