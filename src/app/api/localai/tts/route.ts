// src/app/api/localai/tts/route.ts
// Server-side proxy for LocalAI TTS (OpenAI-compatible: POST /v1/audio/speech)
// This exists because the browser can't directly call ngrok URLs (CORS + ngrok warning page)

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function buildHeaders(cleanEndpoint: string) {
    const headers: Record<string, string> = {
        'User-Agent': 'Two-AIs-LocalAI-TTS/1.0',
        'Content-Type': 'application/json',
        'Accept': '*/*',
    };

    if (!cleanEndpoint.includes('localhost') && !cleanEndpoint.includes('127.0.0.1')) {
        headers['ngrok-skip-browser-warning'] = '1';
    }

    return headers;
}

async function readResponseBodyForError(resp: Response): Promise<{ contentType: string; text: string }> {
    const contentType = resp.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        try {
            const json = (await resp.json()) as unknown;
            return { contentType, text: JSON.stringify(json) };
        } catch {
            const text = await resp.text().catch(() => 'No response body');
            return { contentType, text };
        }
    }

    const text = await resp.text().catch(() => 'No response body');
    return { contentType, text };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { endpoint, model, input, voice, response_format, stream } = body as {
            endpoint?: string;
            model?: string;
            input?: string;
            voice?: string;
            response_format?: string;
            stream?: boolean;
        };

        if (!endpoint || typeof endpoint !== 'string') {
            return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
        }
        if (!model || typeof model !== 'string') {
            return NextResponse.json({ error: 'Missing model' }, { status: 400 });
        }
        if (!input || typeof input !== 'string') {
            return NextResponse.json({ error: 'Missing input' }, { status: 400 });
        }
        const cleanEndpoint = endpoint.replace(/\/+$/, '');
        const headers = buildHeaders(cleanEndpoint);

        // 1) Try OpenAI-compatible endpoint first
        try {
            const url = `${cleanEndpoint}/v1/audio/speech`;
            console.log(`[LocalAI TTS] Proxying: ${url} (model=${model}, voice=${voice || 'N/A'}, chars=${input.length})`);

            const resp = await fetch(url, {
                method: 'POST',
                headers,
                cache: 'no-store',
                signal: AbortSignal.timeout(300000),
                body: JSON.stringify({
                    model,
                    input,
                    ...(voice ? { voice } : {}),
                    ...(response_format ? { response_format } : {}),
                    ...(typeof stream === 'boolean' ? { stream } : {}),
                }),
            });

            if (resp.ok) {
                const contentType = resp.headers.get('content-type') || 'audio/mpeg';
                const arrayBuffer = await resp.arrayBuffer();
                return new NextResponse(arrayBuffer, {
                    status: 200,
                    headers: {
                        'Content-Type': contentType,
                        'Cache-Control': 'no-store',
                    },
                });
            }

            const err = await readResponseBodyForError(resp);
            console.warn(`[LocalAI TTS] /v1/audio/speech failed: ${resp.status} ${resp.statusText}`, err.text);
        } catch (err) {
            console.warn('[LocalAI TTS] /v1/audio/speech request error:', err);
        }

        // 2) Fallback to LocalAI-native endpoint: /tts
        const fallbackUrl = `${cleanEndpoint}/tts`;
        console.log(`[LocalAI TTS] Falling back to: ${fallbackUrl} (model=${model}, voice=${voice || 'N/A'}, chars=${input.length})`);

        const fallbackResp = await fetch(fallbackUrl, {
            method: 'POST',
            headers,
            cache: 'no-store',
            signal: AbortSignal.timeout(300000),
            body: JSON.stringify({
                model,
                input,
                ...(voice ? { voice } : {}),
                ...(response_format ? { response_format } : {}),
                ...(typeof stream === 'boolean' ? { stream } : {}),
            }),
        });

        if (!fallbackResp.ok) {
            const err = await readResponseBodyForError(fallbackResp);
            return NextResponse.json(
                {
                    error: `LocalAI returned ${fallbackResp.status}: ${fallbackResp.statusText}`,
                    details: err.text.substring(0, 2000),
                },
                { status: 200 }
            );
        }

        const contentType = fallbackResp.headers.get('content-type') || 'audio/wav';
        const arrayBuffer = await fallbackResp.arrayBuffer();

        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        console.error('[LocalAI TTS] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
