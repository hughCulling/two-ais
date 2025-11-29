# Implementation Plan

- [x] 1. Set up testing infrastructure
  - Install Vitest, fast-check, and testing utilities
  - Configure vitest.config.ts with coverage thresholds
  - Create tests/setup.ts with mocks for Firebase, Next.js router, and Web Speech API
  - Create package.json test scripts (test, test:watch, test:coverage, test:properties)
  - _Requirements: All_

- [x] 2. Create shared test generators and helpers
- [x] 2.1 Create test generator for conversation configs
  - Implement conversationConfigArbitrary in tests/generators/conversation.ts
  - Generate random valid conversation configurations
  - Include support for Mistral and Ollama model selections
  - _Requirements: 1.1, 6.1_

- [x] 2.2 Create test generator for messages
  - Implement messageArbitrary in tests/generators/messages.ts
  - Generate messages with various roles, content lengths (1-4000 chars), and Unicode
  - _Requirements: 2.1, 2.5_

- [x] 2.3 Create test generator for session configs
  - Implement sessionConfigArbitrary in tests/generators/sessionConfig.ts
  - Generate valid and invalid session configurations
  - _Requirements: 6.1, 6.2_

- [x] 2.4 Create test generator for TTS settings
  - Implement ttsConfigArbitrary in tests/generators/ttsSettings.ts
  - Generate TTS configurations for browser and API-based providers
  - _Requirements: 4.1, 6.2_

- [x] 2.5 Create test helpers and fixtures
  - Create tests/helpers/firebase-helpers.ts with Firebase test utilities
  - Create tests/helpers/test-data.ts with common fixtures (mockUser, mockConversation, mockMessage)
  - _Requirements: All_

- [x] 3. Test core utility functions
- [x] 3.1 Write unit tests for lib/utils.ts
  - Test removeEmojis function with various emoji types
  - Test cleanTextForTTS function with special characters
  - Create lib/utils.test.ts
  - _Requirements: 2.5, 4.3_

- [ ]* 3.2 Write property test for Unicode preservation
  - **Property 9: Unicode content preservation**
  - **Validates: Requirements 2.5**
  - Test that Unicode characters are preserved through utility functions
  - _Requirements: 2.5_

- [x] 3.3 Write unit tests for lib/tts_models.ts
  - Test getVoiceById function
  - Test findFallbackBrowserVoice function with various languages
  - Create lib/tts_models.test.ts
  - _Requirements: 12.5_

- [x] 3.4 Write property test for TTS voice fallback
  - **Property 30: TTS voice fallback by language**
  - **Validates: Requirements 12.5**
  - Test that fallback voices match the language field
  - _Requirements: 12.5_

- [x] 4. Test conversation state management
- [x] 4.1 Write unit tests for conversation creation
  - Test that conversations initialize with correct default values
  - Test that required fields are present
  - Mock Firestore operations
  - _Requirements: 1.1_

- [x] 4.2 Write property test for conversation initialization
  - **Property 1: Conversation initialization creates valid state**
  - **Validates: Requirements 1.1**
  - Generate random configs and verify all initialize correctly
  - _Requirements: 1.1_

- [x] 4.3 Write property test for turn toggling
  - **Property 2: Turn toggling maintains consistency**
  - **Validates: Requirements 1.2**
  - Test that turns alternate correctly between agentA and agentB
  - _Requirements: 1.2_

- [x] 4.4 Write property test for stopped conversations
  - **Property 3: Stopped conversations prevent message generation**
  - **Validates: Requirements 1.4**
  - Test that status "stopped" prevents new messages
  - _Requirements: 1.4_

- [x] 4.5 Write property test for TTS signal blocking
  - **Property 4: TTS signal blocks turn progression**
  - **Validates: Requirements 1.5**
  - Test that waitingForTTSEndSignal prevents next turn
  - _Requirements: 1.5_

- [x] 5. Test message handling
- [x] 5.1 Write unit tests for message creation
  - Test message creation with all required fields
  - Test optional fields (audioUrl, imageUrl)
  - Mock Firestore message creation
  - _Requirements: 2.1_

- [x] 5.2 Write property test for message field validation
  - **Property 5: Message creation includes required fields**
  - **Validates: Requirements 2.1**
  - Generate random messages and verify required fields
  - _Requirements: 2.1_

- [x] 5.3 Write property test for message ordering
  - **Property 6: Message ordering by timestamp**
  - **Validates: Requirements 2.2**
  - Generate random message sets and verify ascending order
  - _Requirements: 2.2_

- [x] 5.4 Write unit tests for streaming message state
  - Test RTDB streaming message status transitions
  - Test streaming → complete transition
  - Mock RTDB operations
  - _Requirements: 2.3, 2.4_

- [x] 5.5 Write property test for streaming status
  - **Property 7: Streaming messages have correct status**
  - **Validates: Requirements 2.3**
  - Test that streaming messages have status "streaming"
  - _Requirements: 2.3_

- [x] 5.6 Write property test for streaming completion
  - **Property 8: Streaming completion transitions to Firestore**
  - **Validates: Requirements 2.4**
  - Test that message IDs are preserved across RTDB → Firestore
  - _Requirements: 2.4_

- [x] 6. Test Ollama integration
- [x] 6.1 Write unit tests for useOllamaAgent hook
  - Test that Ollama models trigger client-side handling
  - Test Agent B delay (500ms)
  - Mock Ollama API responses
  - Create src/hooks/useOllamaAgent.test.ts
  - _Requirements: 3.1, 3.4_

- [x] 6.2 Write unit tests for Ollama retry logic
  - Test that failures trigger up to 2 retries
  - Test exponential backoff timing (2s, 4s)
  - Mock failed Ollama responses
  - _Requirements: 3.2_

- [x] 6.3 Write unit tests for Ollama error handling
  - Test that errors set conversation status to "error"
  - Test error context is preserved
  - _Requirements: 3.3_

- [x] 6.4 Write property test for lookahead limit
  - **Property 10: Lookahead limit prevents generation**
  - **Validates: Requirements 3.5**
  - Test that generation stops at 3 unplayed messages
  - _Requirements: 3.5_

- [x] 6.5 Write unit tests for /api/ollama/stream endpoint
  - Test streaming response format
  - Test error handling
  - Mock Ollama service
  - Create src/app/api/ollama/stream/route.test.ts
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 7. Test TTS processing
- [x] 7.1 Write unit tests for TTS chunking logic
  - Test splitIntoTTSChunks function with various message lengths
  - Test that chunks respect 4000 character limit
  - Test sentence boundary preservation
  - _Requirements: 4.2_

- [x] 7.2 Write property test for message chunking
  - **Property 12: Long messages are chunked for TTS**
  - **Validates: Requirements 4.2**
  - Generate messages > 4000 chars and verify chunking
  - _Requirements: 4.2_

- [x] 7.3 Write unit tests for paragraph splitting
  - Test splitIntoParagraphs function
  - Test newline handling for auto-scroll
  - _Requirements: 4.3_

- [x] 7.4 Write property test for paragraph splitting
  - **Property 13: Browser TTS splits on paragraphs**
  - **Validates: Requirements 4.3**
  - Generate messages with newlines and verify splitting
  - _Requirements: 4.3_

- [x] 7.5 Write unit tests for audio playback state
  - Test handleAudioEnd updates lastPlayedAgentMessageId
  - Test waitingForTTSEndSignal is cleared
  - Mock audio playback
  - _Requirements: 4.4_

- [x] 7.6 Write property test for audio completion state
  - **Property 14: Audio completion updates state**
  - **Validates: Requirements 4.4**
  - Test state updates after playback completion
  - _Requirements: 4.4_

- [x] 7.7 Write unit tests for TTS error handling
  - Test that TTS failures don't break conversation
  - Test error logging
  - _Requirements: 4.5_

- [x] 8. Checkpoint - Ensure all tests pass
  - Run all tests and verify they pass
  - Check coverage reports
  - Ask the user if questions arise

- [x] 9. Test authentication and authorization
- [x] 9.1 Write unit tests for authentication redirects
  - Test unauthenticated users redirect to landing page
  - Test authenticated users can access app
  - Mock useAuth hook
  - _Requirements: 5.1_

- [x] 9.2 Write property test for conversation ownership
  - **Property 15: Conversation ownership validation**
  - **Validates: Requirements 5.3**
  - Test that userId must match conversation owner
  - _Requirements: 5.3_

- [x] 9.3 Write unit tests for API key storage
  - Test API key storage in Secret Manager
  - Test versioned references in user document
  - Mock Secret Manager operations
  - _Requirements: 5.4_

- [x] 9.4 Write unit tests for signout cleanup
  - Test that session state is cleared on signout
  - Test redirect to landing page
  - _Requirements: 5.5_

- [x] 10. Test session configuration
- [x] 10.1 Write property test for LLM validation
  - **Property 16: Session config validation rejects empty LLMs**
  - **Validates: Requirements 6.1**
  - Generate configs with empty LLMs and verify rejection
  - _Requirements: 6.1_

- [x] 10.2 Write property test for TTS config validation
  - **Property 17: TTS config validation**
  - **Validates: Requirements 6.2**
  - Test that TTS enabled requires provider and voice
  - _Requirements: 6.2_

- [ ]* 10.3 Write property test for config persistence
  - **Property 18: Session config persistence**
  - **Validates: Requirements 6.3**
  - Test that all config fields are persisted
  - _Requirements: 6.3_

- [ ]* 10.4 Write property test for invalid config rejection
  - **Property 19: Invalid config rejection**
  - **Validates: Requirements 6.4**
  - Generate invalid configs and verify descriptive errors
  - _Requirements: 6.4_

- [x] 10.5 Write unit tests for missing API keys
  - Test that missing API keys prevent session creation
  - Test error message clarity
  - _Requirements: 6.5_

- [ ] 11. Test SessionSetupForm component
- [ ] 11.1 Write unit tests for SessionSetupForm
  - Test form validation
  - Test LLM selection
  - Test TTS toggle and configuration
  - Test form submission
  - Create src/components/session/SessionSetupForm.test.tsx
  - _Requirements: 6.1, 6.2, 6.4_

- [x] 12. Test real-time streaming
- [ ]* 12.1 Write property test for RTDB streaming updates
  - **Property 20: Streaming updates RTDB**
  - **Validates: Requirements 7.1**
  - Test that content updates are written to RTDB
  - _Requirements: 7.1_

- [ ]* 12.2 Write property test for message ID preservation
  - **Property 21: Streaming preserves message ID**
  - **Validates: Requirements 7.4**
  - Test that RTDB and Firestore messages have same ID
  - _Requirements: 7.4_

- [x] 12.3 Write unit tests for streaming interruption
  - Test that interruptions mark status as "error"
  - Test partial content is preserved
  - _Requirements: 7.3_

- [x] 13. Test error handling
- [x] 13.1 Write unit tests for LLM API failures
  - Test that API failures set status to "error"
  - Test error message and context preservation
  - _Requirements: 8.1_

- [x] 13.2 Write unit tests for network retry logic
  - Test session start retries (up to 3 times)
  - Test exponential backoff (500ms, 1s, 2s)
  - Mock network failures
  - _Requirements: 8.2_

- [x] 13.3 Write unit tests for Firestore error handling
  - Test error logging
  - Test user-friendly error messages
  - _Requirements: 8.3_

- [x] 13.4 Write unit tests for rate limit errors
  - Test error message simplification
  - Test "429" and "Service tier capacity exceeded" handling
  - _Requirements: 8.4_

- [ ]* 13.5 Write property test for error state preservation
  - **Property 22: Error state preserves conversation data**
  - **Validates: Requirements 8.5**
  - Test that errors don't corrupt existing data
  - _Requirements: 8.5_

- [x] 14. Test conversation history
- [ ]* 14.1 Write property test for history ordering
  - **Property 23: Conversation history ordering**
  - **Validates: Requirements 9.1**
  - Generate random histories and verify descending order
  - _Requirements: 9.1_

- [x] 14.2 Write unit tests for resume URL parameter
  - Test that ?resume=id loads conversation
  - Test ResumeHandler component
  - Create src/components/ResumeHandler.test.tsx
  - _Requirements: 9.2_

- [ ]* 14.3 Write property test for state restoration
  - **Property 24: Resumed conversation state restoration**
  - **Validates: Requirements 9.3**
  - Test that resumed conversations restore correct state
  - _Requirements: 9.3_

- [x] 14.4 Write unit tests for resume parameter removal
  - Test that manual stop removes ?resume parameter
  - Test URL manipulation
  - _Requirements: 9.4_

- [ ]* 14.5 Write property test for history filtering
  - **Property 25: History filtering by user**
  - **Validates: Requirements 9.5**
  - Test that users only see their own conversations
  - _Requirements: 9.5_

- [ ] 15. Test UI state management
- [ ] 15.1 Write unit tests for audio control states
  - Test play/pause button visibility
  - Test control enable/disable logic
  - _Requirements: 10.1_

- [ ]* 15.2 Write property test for chunk position tracking
  - **Property 26: Paused audio tracks chunk position**
  - **Validates: Requirements 10.2**
  - Test that chunk index is maintained during pause
  - _Requirements: 10.2_

- [ ] 15.3 Write unit tests for visual indicators
  - Test currently playing message indicator
  - Test indicator visibility logic
  - _Requirements: 10.3_

- [ ] 15.4 Write unit tests for TTS auto-scroll
  - Test scroll behavior during playback
  - Test auto-scroll toggle
  - _Requirements: 10.4_

- [ ] 15.5 Write unit tests for fullscreen mode
  - Test fullscreen toggle
  - Test header visibility
  - Test body class manipulation
  - _Requirements: 10.5_

- [ ] 16. Test API key management
- [ ] 16.1 Write unit tests for API key storage
  - Test Secret Manager integration
  - Test versioned reference creation
  - _Requirements: 11.1_

- [ ]* 16.2 Write property test for API key retrieval
  - **Property 27: API key retrieval for conversations**
  - **Validates: Requirements 11.2**
  - Test that API keys are retrieved from user document
  - _Requirements: 11.2_

- [ ] 16.3 Write unit tests for API key updates
  - Test new version creation
  - Test user document reference updates
  - _Requirements: 11.3_

- [ ]* 16.4 Write property test for missing API keys
  - **Property 28: Missing API keys prevent session creation**
  - **Validates: Requirements 11.4**
  - Test that missing keys prevent session start
  - _Requirements: 11.4_

- [ ] 16.5 Write unit tests for missing user documents
  - Test graceful handling of missing documents
  - Test empty apiSecretVersions initialization
  - _Requirements: 11.5_

- [ ] 17. Test multi-language support
- [ ] 17.1 Write unit tests for translation loading
  - Test language selection
  - Test translation file loading
  - _Requirements: 12.1_

- [ ]* 17.2 Write property test for parameter substitution
  - **Property 29: Translation parameter substitution**
  - **Validates: Requirements 12.3**
  - Test that parameters are correctly substituted
  - _Requirements: 12.3_

- [ ] 17.3 Write unit tests for language context loading
  - Test that rendering is blocked until translations load
  - Test loading state
  - _Requirements: 12.4_

- [ ] 18. Test ChatInterface component
- [ ] 18.1 Write unit tests for ChatInterface message display
  - Test message rendering
  - Test message ordering
  - Test streaming message display
  - Create src/components/chat/ChatInterface.test.tsx
  - _Requirements: 2.2, 2.3, 7.1_

- [ ] 18.2 Write unit tests for ChatInterface audio controls
  - Test play/pause/resume buttons
  - Test audio state management
  - _Requirements: 10.1, 10.2_

- [ ] 18.3 Write unit tests for ChatInterface error display
  - Test error alert rendering
  - Test error details expansion
  - _Requirements: 8.1, 8.4_

- [ ] 19. Test AppHome component
- [ ] 19.1 Write unit tests for AppHome
  - Test session setup display
  - Test chat interface display
  - Test error handling
  - Test loading states
  - Create src/components/AppHome.test.tsx
  - _Requirements: 5.1, 6.5, 8.2_

- [ ] 20. Test API routes
- [ ] 20.1 Write unit tests for /api/conversation/start
  - Test conversation creation
  - Test config validation
  - Test authentication
  - Create src/app/api/conversation/start/route.test.ts
  - _Requirements: 1.1, 5.2, 6.1, 6.3_

- [ ] 20.2 Write unit tests for /api/conversation/[id]/resume
  - Test conversation resumption
  - Test authorization
  - Create src/app/api/conversation/[id]/resume/route.test.ts
  - _Requirements: 9.2, 9.3_

- [ ] 20.3 Write unit tests for /api/conversation/[id]/details
  - Test conversation details retrieval
  - Test authorization
  - _Requirements: 5.3, 9.2_

- [ ] 21. Final checkpoint - Ensure all tests pass
  - Run full test suite
  - Generate coverage report
  - Verify 80% coverage threshold
  - Ask the user if questions arise

- [ ] 22. Set up Firebase emulators (optional but recommended)
  - Install Firebase emulators
  - Configure firebase.json for emulators
  - Create integration test setup with emulators
  - Document how to run integration tests
  - _Requirements: All integration tests_

- [ ]* 23. Write integration test for full conversation flow (optional)
  - Test complete user flow: auth → session start → messages → TTS → stop
  - Use Firebase emulators
  - Use real Ollama if available (skip if not)
  - Create tests/integration/conversation-flow.test.ts
  - _Requirements: 1.1, 1.2, 2.1, 3.1, 4.1_

- [ ]* 24. Write integration test for TTS playback flow (optional)
  - Test TTS generation and playback
  - Test audio state management
  - Create tests/integration/tts-playback.test.ts
  - _Requirements: 4.1, 4.2, 4.3, 4.4_
