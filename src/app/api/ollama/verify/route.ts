// src/app/api/ollama/verify/route.ts
// Server-side proxy for verifying Ollama endpoint connectivity
// This exists because the browser can't directly call ngrok URLs (CORS + ngrok warning page)

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface OllamaModel {
    name: string;
    model: string;
    modified_at: string;
    size: number;
    digest: string;
}

interface OllamaListResponse {
    models: OllamaModel[];
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { endpoint } = body;

        if (!endpoint || typeof endpoint !== 'string') {
            return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
        }

        // Sanitize: strip trailing slash
        const cleanEndpoint = endpoint.replace(/\/+$/, '');

        const headers: Record<string, string> = {
            'User-Agent': 'Two-AIs-Ollama-Verifier/1.0',
            'Accept': 'application/json',
        };
        // Add ngrok bypass header for non-localhost endpoints
        if (!cleanEndpoint.includes('localhost') && !cleanEndpoint.includes('127.0.0.1')) {
            headers['ngrok-skip-browser-warning'] = '1';
        }

        console.log(`[Ollama Verify] Checking: ${cleanEndpoint}/api/tags`);
        const response = await fetch(`${cleanEndpoint}/api/tags`, {
            method: 'GET',
            headers,
            cache: 'no-store',
            signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
            const text = await response.text().catch(() => 'No response body');
            console.error(`[Ollama Verify] Failed: ${response.status} ${response.statusText}`, text);
            return NextResponse.json(
                { available: false, error: `Ollama returned ${response.status}: ${response.statusText}. Trace: ${text.substring(0, 100)}` },
                { status: 200 }
            );
        }

        const data: OllamaListResponse = await response.json();
        const models = data.models.map((m) => m.name);

        return NextResponse.json({ available: true, models }, { status: 200 });
    } catch (error) {
        console.error('[Ollama Verify] Error:', error);
        return NextResponse.json(
            { available: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 200 }
        );
    }
}
