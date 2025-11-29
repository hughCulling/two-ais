# Test Generators

This directory contains property-based test generators (arbitraries) for the Two-AIs application.

## Files

### conversation.ts
Generators for conversation configurations:
- `conversationConfigArbitrary()` - Generates random valid conversation configs
- `conversationConfigWithStatusArbitrary(status)` - Generates configs with specific status
- `stoppedConversationConfigArbitrary()` - Generates stopped conversation configs
- `errorConversationConfigArbitrary()` - Generates error conversation configs

### messages.ts
Generators for messages:
- `messageArbitrary()` - Generates random valid messages with Unicode support
- `messageWithRoleArbitrary(role)` - Generates messages with specific role
- `agentMessageArbitrary()` - Generates agent messages (agentA or agentB)
- `longMessageArbitrary()` - Generates messages > 4000 chars (for TTS chunking tests)
- `streamingMessageArbitrary()` - Generates streaming messages
- `messageWithAudioArbitrary()` - Generates messages with audio URLs
- `orderedMessagesArbitrary(min, max)` - Generates arrays of messages ordered by timestamp
- `messageWithNewlinesArbitrary()` - Generates messages with newlines (for paragraph splitting)

### sessionConfig.ts
Generators for session configurations:
- `sessionConfigArbitrary()` - Generates random valid session configs
- `validSessionConfigWithTTSArbitrary()` - Generates valid configs with TTS enabled
- `invalidSessionConfigArbitrary()` - Generates invalid configs (for validation tests)
- `sessionConfigWithoutTTSArbitrary()` - Generates configs with TTS disabled
- `sessionConfigWithLanguageArbitrary(language)` - Generates configs with specific language

### ttsSettings.ts
Generators for TTS settings:
- `ttsConfigArbitrary()` - Generates TTS config for a single agent
- `browserTTSConfigArbitrary()` - Generates browser-only TTS config
- `apiTTSConfigArbitrary()` - Generates API-based TTS config
- `ttsSettingsArbitrary()` - Generates complete TTS settings for a conversation
- `enabledTTSSettingsArbitrary()` - Generates TTS settings with enabled=true
- `disabledTTSSettingsArbitrary()` - Generates TTS settings with enabled=false
- `browserOnlyTTSSettingsArbitrary()` - Generates browser-only TTS settings
- `invalidTTSSettingsArbitrary()` - Generates invalid TTS settings (for validation tests)

## Usage

```typescript
import * as fc from 'fast-check';
import { conversationConfigArbitrary } from './generators/conversation';

// Use in property-based tests
fc.assert(
  fc.property(conversationConfigArbitrary(), (config) => {
    // Test that all generated configs have valid structure
    expect(config.status).toBe('running');
    expect(['agentA', 'agentB']).toContain(config.turn);
  }),
  { numRuns: 100 }
);
```

## Features

- **Unicode Support**: Message generators include emoji, CJK characters, Arabic text, and special characters
- **Timestamp Constraints**: All timestamps are constrained to valid ranges (2020-2030)
- **Model Support**: Supports Mistral and Ollama model selections
- **TTS Providers**: Supports browser and API-based TTS providers
- **Validation Testing**: Includes generators for invalid configurations to test validation logic
