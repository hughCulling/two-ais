# Ollama Models - Local Browser Support

## How It Works

Ollama models (like `ollama:gemma3:1b`) now work directly from your browser! The implementation uses:

1. **Local Ollama instance** running at `http://localhost:11434`
2. **Next.js API route** (`/api/ollama/stream`) that runs on your dev server
3. **Client-side hook** (`useOllamaAgent`) that handles responses in the browser

This bypasses Firebase Cloud Functions entirely for Ollama models, allowing you to use local models while still using cloud functions for other providers.

## Setup

### 1. Make sure Ollama is running locally

```bash
ollama serve
```

### 2. Pull the models you want to use

```bash
ollama pull gemma3:1b
ollama pull llama3.2:1b
# etc.
```

### 3. Start your Next.js dev server

```bash
npm run dev
```

### 4. Select Ollama models in the UI

The app will automatically detect Ollama models and route them through the local API instead of Firebase Functions.

## How It Works Technically

When you select an Ollama model:

1. The conversation starts normally through Firebase
2. The `useOllamaAgent` hook detects that an Ollama model is being used
3. Instead of waiting for Firebase Functions, it:
   - Fetches conversation history from Firestore
   - Calls `/api/ollama/stream` (your local Next.js server)
   - Streams the response directly from your local Ollama
   - Saves the result back to Firestore
4. The UI updates in real-time via Firestore listeners

## Limitations

### Only Works in Development

This solution **only works when running `npm run dev`** because:
- The `/api/ollama/stream` route runs on your local Next.js server
- Your local Ollama instance is only accessible from localhost
- Deployed Next.js (Vercel, etc.) cannot access your local Ollama

### For Production

If you deploy your app, Ollama models will not work. For production, you should:

**Option 1: Use Cloud-Based LLM Providers**

Stick with cloud-based providers that work everywhere:
- **Mistral AI** (currently enabled)
- OpenAI (commented out in code)
- Google Gemini (commented out in code)
- Anthropic Claude (commented out in code)
- xAI Grok (commented out in code)
- DeepSeek (commented out in code)

**Option 2: Host Ollama on a Public Server**

1. Deploy Ollama to a cloud server (AWS, GCP, DigitalOcean, etc.)
2. Expose it with a public URL
3. Update the `ollamaEndpoint` in your conversation configuration
4. Modify the API route to accept the custom endpoint

**Note:** This requires server management and ongoing costs.

## Troubleshooting

### "fetch failed" or "ECONNREFUSED" errors

Make sure:
1. Ollama is running: `ollama serve`
2. Your Next.js dev server is running: `npm run dev`
3. You're accessing the app at `http://localhost:3000` (not a deployed URL)

### Models not appearing

1. Check that Ollama is running: `ollama list`
2. Pull models if needed: `ollama pull gemma3:1b`
3. Refresh the page to reload the model list

### Streaming stops or errors

Check the browser console and terminal for errors. Common issues:
- Ollama crashed or stopped
- Model not found (need to pull it)
- Network issues between browser and Ollama

## Architecture

```
Browser (React)
    ↓
useOllamaAgent Hook (monitors Firestore)
    ↓
/api/ollama/stream (Next.js API Route)
    ↓
Ollama (localhost:11434)
    ↓
Response streams back through the chain
    ↓
Saved to Firestore
    ↓
UI updates via Firestore listeners
```

This architecture allows Ollama to work alongside cloud providers seamlessly!
