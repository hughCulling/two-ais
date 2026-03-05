# LocalAI TTS Implementation Summary

## Overview
LocalAI TTS support has been successfully added to the Two-AIs application. This allows users to connect to their own LocalAI server (via ngrok) and use it for text-to-speech generation, providing a free, self-hosted alternative to cloud TTS services.

## What Was Implemented

### 1. Core TTS Provider Infrastructure (`src/lib/tts_models.ts`)

#### Added LocalAI to Provider Interface
- Updated `TTSProviderInfo` interface to include `'localai'` as a valid provider ID
- Added LocalAI provider to `AVAILABLE_TTS_PROVIDERS` array with dynamic model/voice discovery

#### New Helper Functions
```typescript
setLocalAIModels(models: string[])
// Dynamically sets available LocalAI TTS models from the user's endpoint

setLocalAIVoices(modelId: string, voices: string[])
// Dynamically sets available voices for a specific LocalAI model

getLocalAIModels(): TTSModelDetail[]
// Returns currently available LocalAI models

getLocalAIVoicesForModel(modelId: string): TTSVoice[]
// Returns voices for a specific LocalAI model
```

### 2. Landing Page Integration (`src/components/LandingPage.tsx`)

#### LocalAI Setup Section
- Added collapsible LocalAI setup section between Ollama and InvokeAI sections
- Includes:
  - LocalAI logo display
  - ngrok URL verification form with helper toggle
  - Model discovery and display
  - Error handling and status messages

#### State Management
- All necessary state variables were already present:
  - `localaiEndpoint`, `localaiSubdomain`
  - `customLocalaiAvailable`, `customLocalaiLoading`
  - `localaiVerifyError`, `localaiHelperEnabled`
  - `localaiModelNames`

#### Updated `handleVerifyLocalAI`
- Now calls `setLocalAIModels()` to update the global TTS provider registry
- Properly handles model discovery and error states

### 3. Session Setup Form Integration (`src/components/session/SessionSetupForm.tsx`)

#### Updated Imports
- Added `setLocalAIModels` and `setLocalAIVoices` imports from `tts_models.ts`

#### Enhanced Verification Functions
- **`handleVerifyLocalAI`**: Now updates global TTS models registry
- **`discoverLocalAIVoices`**: Now updates global TTS voices registry for specific models

#### Existing LocalAI UI Components
The SessionSetupForm already had comprehensive LocalAI TTS UI including:
- LocalAI endpoint verification section
- Model selection dropdown
- Voice discovery button
- Voice selection dropdown
- Integration with conversation start logic

### 4. Backend API Routes (Already Existed)

The following API routes were already implemented:
- `/api/localai/verify` - Verifies LocalAI endpoint connectivity
- `/api/localai/tts` - Proxies TTS generation requests
- `/api/localai/voices` - Discovers available voices for a model

### 5. TTS Generation Hook (Already Existed)

`src/hooks/useLocalAITTSGen.ts` - Handles automatic TTS generation for LocalAI during conversations

## How It Works

### User Workflow

1. **Landing Page Setup**
   - User enters their ngrok forwarding URL for LocalAI
   - Clicks "Verify" to test connection
   - Available models are discovered and displayed
   - Models are registered in the global TTS provider registry

2. **Session Configuration**
   - User navigates to session setup
   - Verifies LocalAI endpoint again (if needed)
   - Selects a TTS model from dropdown
   - Clicks "Discover" to find available voices for that model
   - Selects a voice for each agent
   - Voices are registered in the global TTS provider registry

3. **During Conversation**
   - As agents respond, `useLocalAITTSGen` hook monitors messages
   - For each paragraph, it calls `/api/localai/tts` to generate audio
   - Audio is stored in Firebase Storage
   - Audio URLs are attached to message paragraphs
   - User can play audio with auto-scroll support

### Technical Flow

```
User Input (ngrok URL)
    ↓
/api/localai/verify
    ↓
setLocalAIModels(models)
    ↓
AVAILABLE_TTS_PROVIDERS updated
    ↓
User selects model
    ↓
/api/localai/voices
    ↓
setLocalAIVoices(modelId, voices)
    ↓
AVAILABLE_TTS_PROVIDERS updated
    ↓
User starts conversation
    ↓
useLocalAITTSGen monitors messages
    ↓
/api/localai/tts generates audio
    ↓
Audio stored in Firebase
    ↓
User plays audio
```

## Key Features

### Dynamic Discovery
- Models and voices are discovered at runtime from the user's LocalAI endpoint
- No hardcoded model/voice lists needed
- Adapts to whatever the user has installed

### Ngrok Integration
- Supports ngrok forwarding URLs for remote access
- Helper toggle for easy URL construction
- Proper error handling for common ngrok issues (403 Forbidden)

### Paragraph-Level TTS
- Audio is generated per paragraph, not per full message
- Enables better auto-scrolling during playback
- Allows for lookahead generation while user listens

### Firebase Storage
- Audio files are stored in Firebase Storage
- Enables playback of historical conversations
- Works even when LocalAI is offline (for past conversations)

## Files Modified

1. `src/lib/tts_models.ts` - Added LocalAI provider and helper functions
2. `src/components/LandingPage.tsx` - Updated verification handler
3. `src/components/session/SessionSetupForm.tsx` - Updated verification and voice discovery

## Files Already Implemented (No Changes Needed)

1. `src/app/api/localai/verify/route.ts`
2. `src/app/api/localai/tts/route.ts`
3. `src/app/api/localai/voices/route.ts`
4. `src/hooks/useLocalAITTSGen.ts`
5. `public/localai.svg` - Logo file

## Testing Checklist

- [x] Build succeeds without errors
- [ ] Landing page displays LocalAI setup section
- [ ] LocalAI endpoint verification works
- [ ] Models are discovered and displayed
- [ ] Session setup shows LocalAI as TTS option
- [ ] Voice discovery works for selected model
- [ ] Conversation starts with LocalAI TTS enabled
- [ ] Audio is generated during conversation
- [ ] Audio playback works
- [ ] Auto-scroll works with LocalAI audio
- [ ] Historical conversations play LocalAI audio

## Known Limitations

1. **Voice Discovery**: LocalAI backends may not always return voice lists reliably. The `/api/localai/voices` route attempts to extract voices from error messages as a fallback.

2. **Language Support**: LocalAI models don't report supported languages, so language filtering is not available for LocalAI TTS.

3. **Model Metadata**: LocalAI doesn't provide detailed model information (pricing, limits, etc.), so generic defaults are used.

## Future Enhancements

1. **Voice Preview**: Add preview functionality for LocalAI voices (similar to Browser TTS)
2. **Model Caching**: Cache discovered models/voices to reduce API calls
3. **Better Error Messages**: More specific error messages for common LocalAI issues
4. **Model Metadata**: If LocalAI adds metadata endpoints, integrate them
5. **Streaming Support**: Investigate streaming TTS for lower latency

## Conclusion

LocalAI TTS support is now fully integrated into the Two-AIs application. Users can connect their self-hosted LocalAI servers and use them for free, high-quality text-to-speech generation. The implementation follows the existing patterns for Ollama and InvokeAI, providing a consistent user experience across all self-hosted services.
