// src/app/api/ollama/stream/route.ts
// Local API route to stream responses from Ollama running on localhost
// This bypasses Firebase Functions and connects directly to local Ollama

import { NextRequest, NextResponse } from 'next/server';
import { Ollama } from 'ollama';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    const endpoint = ollamaEndpoint || 'http://localhost:11434';
    const ollama = new Ollama({ host: endpoint });

    // Create a readable stream for Server-Sent Events
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log(`[Ollama Stream] Starting chat with model: ${model}, endpoint: ${endpoint}`);
          console.log(`[Ollama Stream] Message count: ${messages.length}`);
          
          // Stream the response from Ollama
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
