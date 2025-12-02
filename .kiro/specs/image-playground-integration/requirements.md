# Requirements Document

## Introduction

This feature integrates Apple's Image Playground API to provide local, free image generation for the Two AIs application. Similar to the existing Ollama integration, this feature will run a local Swift-based server on macOS that interfaces with Apple's Image Playground framework to generate images for each paragraph of agent responses. The generated images will be displayed in a visualizer mode that synchronizes with the TTS auto-scroll functionality, creating an immersive multimedia experience.

## Glossary

- **Image Playground**: Apple's local image generation framework available on macOS 15.1+ and iOS 15+ devices with Apple Silicon
- **Two AIs Application**: The Next.js web application that facilitates AI agent conversations
- **Swift Image Server**: A local macOS server built with Swift and Vapor that interfaces with Image Playground
- **Visualizer Mode**: A UI mode that displays generated images synchronized with TTS playback
- **Paragraph**: A segment of agent response text separated by newlines, used as the unit for TTS playback and image generation (already split by existing auto-scroll functionality)
- **Auto-scroll Logic**: The existing functionality that scrolls to the current paragraph being spoken by TTS
- **Session Configuration**: User-defined settings for a conversation session including model selection and feature toggles
- **Prompt LLM**: An LLM selected by the user to transform paragraph text into optimized image generation prompts
- **Lookahead Limit**: The system's mechanism to prepare future turns before the current turn finishes playing, ensuring smooth transitions

## Requirements

### Requirement 1

**User Story:** As a user, I want to enable local image generation using Apple's Image Playground, so that I can generate images for free without relying on cloud APIs.

#### Acceptance Criteria

1. WHEN the user accesses session configuration THEN the Two AIs Application SHALL display an option to enable Image Playground image generation
2. WHEN the Swift Image Server is not running or not detected THEN the Two AIs Application SHALL hide or disable the Image Playground option
3. WHEN the user enables Image Playground image generation THEN the Two AIs Application SHALL store this preference in the session configuration
4. WHEN Image Playground is the only available image generation provider THEN the Two AIs Application SHALL not provide fallback options
5. WHERE Image Playground is enabled, WHEN a conversation session starts THEN the Two AIs Application SHALL verify connectivity to the Swift Image Server

### Requirement 2

**User Story:** As a developer, I want to build a Swift-based local server that interfaces with Apple's Image Playground API, so that the web application can request image generation.

#### Acceptance Criteria

1. THE Swift Image Server SHALL run on localhost port 8080
2. THE Swift Image Server SHALL expose a POST endpoint at `/generate` that accepts JSON with a prompt field
3. WHEN the Swift Image Server receives a valid generation request THEN the Swift Image Server SHALL invoke Apple's Image Playground framework with the provided prompt
4. WHEN image generation completes successfully THEN the Swift Image Server SHALL return a JSON response containing the image data in base64 format
5. WHEN image generation fails THEN the Swift Image Server SHALL return an appropriate HTTP error status with error details
6. THE Swift Image Server SHALL require macOS 15.1+ and Apple Silicon hardware
7. THE Swift Image Server SHALL be built using Vapor framework for HTTP server functionality

### Requirement 3

**User Story:** As a user, I want images to be generated for each paragraph of agent responses, so that I have visual content synchronized with the conversation flow.

#### Acceptance Criteria

1. WHEN an agent message is received and Image Playground is enabled THEN the Two AIs Application SHALL use the existing auto-scroll paragraph splitting to identify paragraphs
2. WHEN a paragraph is identified THEN the Two AIs Application SHALL send the paragraph text to the configured Prompt LLM
3. WHEN the Prompt LLM returns a transformed prompt THEN the Two AIs Application SHALL send the prompt to the Swift Image Server
4. WHEN the Swift Image Server returns an image THEN the Two AIs Application SHALL upload the image to Firebase Storage and associate the URL with the paragraph
5. WHEN multiple paragraphs exist in a message THEN the Two AIs Application SHALL generate images for each paragraph sequentially to avoid system slowdown
6. WHEN image generation is in progress THEN the Two AIs Application SHALL not start concurrent generation requests
7. WHEN all paragraph images are generated for a message THEN the Two AIs Application SHALL mark the message as ready for TTS playback

### Requirement 4

**User Story:** As a user, I want to view generated images in a visualizer mode that synchronizes with TTS playback, so that I can experience a multimedia presentation of the conversation.

#### Acceptance Criteria

1. THE Two AIs Application SHALL provide a visualizer mode toggle icon in the chat interface footer
2. WHEN Image Playground is enabled in session configuration THEN the Two AIs Application SHALL display the visualizer mode toggle icon
3. WHEN the visualizer mode toggle is active THEN the Two AIs Application SHALL highlight or visually indicate the active state
4. WHEN visualizer mode is active THEN the Two AIs Application SHALL display the image corresponding to the currently playing paragraph in full-screen or maximized view
5. WHEN TTS playback advances to a new paragraph THEN the Two AIs Application SHALL update the displayed image to match the new paragraph
6. WHEN visualizer mode is active THEN the Two AIs Application SHALL hide text content to focus exclusively on images
7. WHEN a paragraph has no associated image THEN the Two AIs Application SHALL display a placeholder or skip to the next available image
8. WHEN visualizer mode is toggled off THEN the Two AIs Application SHALL return to the standard chat interface view

### Requirement 5

**User Story:** As a user, I want generated images to be stored efficiently within the conversation, so that I can review them later without regenerating.

#### Acceptance Criteria

1. WHEN an image is generated for a paragraph THEN the Two AIs Application SHALL upload the image to Firebase Storage
2. WHEN storing an image THEN the Two AIs Application SHALL associate the Firebase Storage URL with the specific paragraph index in the message document
3. WHEN displaying a conversation history THEN the Two AIs Application SHALL load and display generated images for each paragraph
4. WHEN multiple images exist for a single message THEN the Two AIs Application SHALL display images in a compact stacked view that occupies roughly one image's dimensions
5. WHEN a user clicks on a stacked image view THEN the Two AIs Application SHALL display an image selector or gallery interface
6. WHEN a user views conversation history THEN the Two AIs Application SHALL lazy-load images to optimize performance

### Requirement 6

**User Story:** As a developer, I want the image generation integration to follow the same pattern as Ollama integration, so that the codebase remains consistent and maintainable.

#### Acceptance Criteria

1. THE Two AIs Application SHALL implement a health check endpoint to detect if the Swift Image Server is running
2. WHEN the application loads THEN the Two AIs Application SHALL attempt to connect to the Swift Image Server on localhost:8080
3. WHEN the Swift Image Server is not reachable THEN the Two AIs Application SHALL disable Image Playground options in the UI
4. THE Two AIs Application SHALL handle connection errors gracefully without blocking other functionality

### Requirement 7

**User Story:** As a user, I want to configure how image prompts are generated from paragraph text, so that I can control the style and content of generated images.

#### Acceptance Criteria

1. THE Two AIs Application SHALL provide a Prompt LLM selector in session setup for image generation
2. THE Two AIs Application SHALL provide a customizable prompt template configuration in session setup
3. THE Two AIs Application SHALL support a default prompt template that transforms paragraph text into image prompts
4. WHEN generating an image prompt THEN the Two AIs Application SHALL use the configured Prompt LLM to transform the paragraph into an optimized image prompt
5. WHEN the Prompt LLM is selected THEN the Two AIs Application SHALL allow the user to customize the system message template for prompt transformation
6. THE Two AIs Application SHALL require a Prompt LLM to be configured when Image Playground is enabled

### Requirement 8

**User Story:** As a user, I want image generation to work with the lookahead system, so that images are prepared before I need them and TTS doesn't start until images are ready.

#### Acceptance Criteria

1. WHEN the lookahead system prepares future turns THEN the Two AIs Application SHALL also initiate image generation for those turns
2. WHEN all images for a message are generated THEN the Two AIs Application SHALL mark the message as ready for TTS playback
3. WHEN TTS is about to start for a message THEN the Two AIs Application SHALL wait until all paragraph images are generated
4. WHEN image generation takes longer than expected THEN the Two AIs Application SHALL display a loading indicator to the user
5. WHEN the lookahead limit is reached THEN the Two AIs Application SHALL pause image generation until the user progresses through messages

### Requirement 9

**User Story:** As a developer, I want comprehensive error handling for image generation failures, so that users have a smooth experience even when generation fails.

#### Acceptance Criteria

1. WHEN the Swift Image Server is unreachable THEN the Two AIs Application SHALL log the error and continue without blocking message display
2. WHEN image generation times out THEN the Two AIs Application SHALL cancel the request and mark the paragraph as having no image
3. WHEN the Swift Image Server returns an error THEN the Two AIs Application SHALL display an error indicator for that paragraph
4. WHEN multiple generation requests fail consecutively THEN the Two AIs Application SHALL temporarily disable image generation for the session
5. WHEN image generation is temporarily disabled THEN the Two AIs Application SHALL notify the user and provide an option to retry
