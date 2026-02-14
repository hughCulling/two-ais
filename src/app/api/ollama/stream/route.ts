// src/app/api/ollama/stream/route.ts
// Local API route to stream responses from Ollama running on localhost
// This bypasses Firebase Functions and connects directly to local Ollama

import { NextRequest, NextResponse } from 'next/server';
import { Ollama } from 'ollama';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, messages, ollamaEndpoint } = body;

    if (!model) {
      return NextResponse.json({ error: 'Model is required' }, { status: 400 });
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // Connect to local Ollama instance
    // Use 127.0.0.1 instead of localhost to avoid DNS resolution issues
    const endpoint = ollamaEndpoint || 'http://127.0.0.1:11434';
    console.log(`[Ollama Stream] Connecting to endpoint: ${endpoint}`);
    console.log(`[Ollama Stream] Model requested: ${model}`);

    const ollama = new Ollama({
      host: endpoint,
      headers: (!endpoint.includes('localhost') && !endpoint.includes('127.0.0.1'))
        ? { 'ngrok-skip-browser-warning': 'true' }
        : undefined
    });

    // Create a readable stream for Server-Sent Events
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log(`[Ollama Stream] Starting chat with model: ${model}, endpoint: ${endpoint}`);
          console.log(`[Ollama Stream] Message count: ${messages.length}`);

          // Test connectivity first
          try {
            await ollama.list();
            console.log(`[Ollama Stream] Successfully connected to Ollama at ${endpoint}`);
          } catch (connectError) {
            console.error(`[Ollama Stream] Failed to connect to Ollama:`, connectError);
            const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
            const helpMessage = isProduction
              ? ' Note: Ollama must be accessible from the server. If running on Vercel/production, Ollama needs to be deployed to a cloud server with a public URL.'
              : ' Make sure Ollama is running locally with `ollama serve`.';
            throw new Error(`Cannot connect to Ollama at ${endpoint}: ${connectError instanceof Error ? connectError.message : 'Unknown error'}.${helpMessage}`);
          }

          // Check if this is a cloud model (contains :cloud suffix)
          const isCloudModel = model.includes(':cloud');

          if (isCloudModel) {
            // Use direct fetch for cloud models to avoid npm package issues
            console.log(`[Ollama Stream] Using direct fetch for cloud model: ${model}`);

            // Cloud models require at least one user message
            // If we only have a system message, convert it to a user message
            let processedMessages = messages;
            if (messages.length === 1 && messages[0].role === 'system') {
              console.log(`[Ollama Stream] Converting system-only message to user message for cloud model compatibility`);
              processedMessages = [
                { role: 'user', content: messages[0].content }
              ];
            }

            const requestBody = {
              model: model,
              messages: processedMessages,
              stream: true,
            };
            console.log(`[Ollama Stream] Request body:`, JSON.stringify(requestBody));
            console.log(`[Ollama Stream] Calling: ${endpoint}/api/chat`);

            // Add a small delay to avoid concurrent request issues
            await new Promise(resolve => setTimeout(resolve, 100));

            const fetchHeaders: Record<string, string> = {
              'Content-Type': 'application/json',
              'Accept': 'text/plain',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            };
            // Add ngrok bypass header for non-localhost endpoints
            if (!endpoint.includes('localhost') && !endpoint.includes('127.0.0.1')) {
              fetchHeaders['ngrok-skip-browser-warning'] = 'true';
            }

            const response = await fetch(`${endpoint}/api/chat`, {
              method: 'POST',
              headers: fetchHeaders,
              body: JSON.stringify(requestBody),
            });

            console.log(`[Ollama Stream] Response status: ${response.status} ${response.statusText}`);
            console.log(`[Ollama Stream] Response headers:`, Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
              const errorText = await response.text();
              console.error(`[Ollama Stream] Error response body:`, errorText);
              throw new Error(`Ollama API returned ${response.status}: ${response.statusText} - ${errorText}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
              throw new Error('No response body from Ollama');
            }

            const decoder = new TextDecoder();
            let tokenCount = 0;
            let buffer = '';

            console.log(`[Ollama Stream] Stream established successfully`);

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || ''; // Keep incomplete line in buffer

              for (const line of lines) {
                if (!line.trim()) continue;

                try {
                  const chunk = JSON.parse(line);
                  const token = chunk.message?.content || '';

                  if (token) {
                    tokenCount++;
                    const data = JSON.stringify({ token });
                    controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                  }

                  if (chunk.done) {
                    console.log(`[Ollama Stream] Completed successfully. Tokens: ${tokenCount}`);
                    break;
                  }
                } catch {
                  console.warn(`[Ollama Stream] Failed to parse line:`, line);
                }
              }
            }
          } else {
            // Use Ollama npm package for local models
            console.log(`[Ollama Stream] Using Ollama npm package for local model: ${model}`);

            const ollamaStream = await ollama.chat({
              model: model,
              messages: messages,
              stream: true,
            });

            console.log(`[Ollama Stream] Stream established successfully`);
            let tokenCount = 0;

            for await (const chunk of ollamaStream) {
              const token = chunk.message?.content || '';

              if (token) {
                tokenCount++;
                // Send as Server-Sent Event
                const data = JSON.stringify({ token });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              }
            }

            console.log(`[Ollama Stream] Completed successfully. Tokens: ${tokenCount}`);
          }

          // Send completion signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('[Ollama Stream] Error details:', {
            error: error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            model: model,
            endpoint: endpoint,
          });
          const errorData = JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in Ollama stream route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
