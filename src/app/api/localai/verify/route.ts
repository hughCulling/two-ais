// src/app/api/localai/verify/route.ts
// Server-side proxy for verifying LocalAI endpoint connectivity
// This exists because the browser can't directly call ngrok URLs (CORS + ngrok warning page)

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface OpenAIModelListResponse {
    data?: Array<{ id?: string }>;
}

interface LocalAIAvailableModel {
    name?: string;
}

type LocalAIModelsAvailableResponse = LocalAIAvailableModel[];

function buildHeaders(cleanEndpoint: string) {
    const headers: Record<string, string> = {
        'User-Agent': 'Two-AIs-LocalAI-Verifier/1.0',
        'Accept': 'application/json',
    };

    if (!cleanEndpoint.includes('localhost') && !cleanEndpoint.includes('127.0.0.1')) {
        headers['ngrok-skip-browser-warning'] = '1';
    }

    return headers;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { endpoint } = body;

        if (!endpoint || typeof endpoint !== 'string') {
            return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
        }

        const cleanEndpoint = endpoint.replace(/\/+$/, '');
        const headers = buildHeaders(cleanEndpoint);

        // Prefer OpenAI-compatible model listing
        try {
            const url = `${cleanEndpoint}/v1/models`;
            console.log(`[LocalAI Verify] Checking: ${url}`);
            const response = await fetch(url, {
                method: 'GET',
                headers,
                cache: 'no-store',
                signal: AbortSignal.timeout(10000),
            });

            if (response.ok) {
                const data: OpenAIModelListResponse = await response.json();
                const models = (data.data || [])
                    .map((m) => m.id)
                    .filter((id): id is string => typeof id === 'string' && id.length > 0);
                return NextResponse.json({ available: true, models }, { status: 200 });
            }

            const text = await response.text().catch(() => 'No response body');
            console.warn(`[LocalAI Verify] /v1/models failed: ${response.status} ${response.statusText}`, text);
        } catch (err) {
            console.warn('[LocalAI Verify] /v1/models request error:', err);
        }

        // Fallback to LocalAI-native model listing
        try {
            const url = `${cleanEndpoint}/models/available`;
            console.log(`[LocalAI Verify] Fallback checking: ${url}`);
            const response = await fetch(url, {
                method: 'GET',
                headers,
                cache: 'no-store',
                signal: AbortSignal.timeout(10000),
            });

            if (!response.ok) {
                const text = await response.text().catch(() => 'No response body');
                console.error(`[LocalAI Verify] Failed: ${response.status} ${response.statusText}`, text);
                return NextResponse.json(
                    { available: false, error: `LocalAI returned ${response.status}: ${response.statusText}. Trace: ${text.substring(0, 100)}` },
                    { status: 200 }
                );
            }

            const data: LocalAIModelsAvailableResponse = await response.json();
            const models = (data || [])
                .map((m) => m?.name)
                .filter((name): name is string => typeof name === 'string' && name.length > 0);

            return NextResponse.json({ available: true, models }, { status: 200 });
        } catch (error) {
            console.error('[LocalAI Verify] Error:', error);
            return NextResponse.json(
                { available: false, error: error instanceof Error ? error.message : 'Unknown error' },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error('[LocalAI Verify] Error:', error);
        return NextResponse.json(
            { available: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 200 }
        );
    }
}
