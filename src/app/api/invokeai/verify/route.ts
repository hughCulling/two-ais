// src/app/api/invokeai/verify/route.ts
// Server-side proxy for verifying InvokeAI endpoint connectivity
// This exists because the browser can't directly call ngrok URLs (CORS + ngrok warning page)

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface InvokeAIModel {
    id: string;
    name: string;
    base: string;
    type: string;
    key?: string;
    hash?: string;
}

interface InvokeAIModelsResponse {
    models: InvokeAIModel[];
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
            'User-Agent': 'Two-AIs-InvokeAI-Verifier/1.0',
            'Accept': 'application/json',
        };
        // Add ngrok bypass header for non-localhost endpoints
        if (!cleanEndpoint.includes('localhost') && !cleanEndpoint.includes('127.0.0.1')) {
            headers['ngrok-skip-browser-warning'] = '1';
        }

        console.log(`[InvokeAI Verify] Checking: ${cleanEndpoint}/api/v2/models/?model_type=main`);
        const response = await fetch(`${cleanEndpoint}/api/v2/models/?model_type=main`, {
            method: 'GET',
            headers,
            cache: 'no-store',
            signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
            const text = await response.text().catch(() => 'No response body');
            console.error(`[InvokeAI Verify] Failed: ${response.status} ${response.statusText}`, text);
            return NextResponse.json(
                { available: false, error: `InvokeAI returned ${response.status}: ${response.statusText}. Trace: ${text.substring(0, 100)}` },
                { status: 200 }
            );
        }

        const data: InvokeAIModelsResponse = await response.json();
        const models = data.models.map((m) => m.name);

        return NextResponse.json({ available: true, models }, { status: 200 });
    } catch (error) {
        console.error('[InvokeAI Verify] Error:', error);
        return NextResponse.json(
            { available: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 200 }
        );
    }
}