// src/app/api/localai/voices/route.ts
// Best-effort voice discovery for LocalAI TTS.
// Many LocalAI backends return available voices only as part of an error message.

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function buildHeaders(cleanEndpoint: string) {
    const headers: Record<string, string> = {
        'User-Agent': 'Two-AIs-LocalAI-Voices/1.0',
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain;q=0.9, */*;q=0.8',
    };

    if (!cleanEndpoint.includes('localhost') && !cleanEndpoint.includes('127.0.0.1')) {
        headers['ngrok-skip-browser-warning'] = '1';
    }

    return headers;
}

function extractVoicesFromText(text: string): string[] {
    // Common LocalAI error shape example:
    // {"error": "Voice 'unknown' not found. Available voices: jane, john"}
    const match = text.match(/Available voices:\s*([^\n\r}]+)/i);
    if (!match || !match[1]) return [];

    return match[1]
        .split(/[,\s]+/)
        .map((v) => v.trim())
        .filter((v) => v.length > 0)
        .filter((v) => !/^and$/i.test(v));
}

async function readTextAnyContentType(resp: Response): Promise<string> {
    const contentType = resp.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        try {
            const json = (await resp.json()) as unknown;
            return JSON.stringify(json);
        } catch {
            return await resp.text().catch(() => '');
        }
    }

    return await resp.text().catch(() => '');
}

async function probeVoicesViaEndpoint(opts: {
    cleanEndpoint: string;
    headers: Record<string, string>;
    urlPath: '/v1/audio/speech' | '/tts';
    model: string;
}): Promise<{ voices: string[]; raw: string; status: number; statusText: string } | null> {
    const url = `${opts.cleanEndpoint}${opts.urlPath}`;

    // Intentionally request a bogus voice. Some backends respond with an error containing the allowed voices.
    const bogusVoice = '__two_ais_list_voices__';

    const body: Record<string, unknown> = {
        model: opts.model,
        input: 'voice probe',
        voice: bogusVoice,
    };

    const resp = await fetch(url, {
        method: 'POST',
        headers: opts.headers,
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify(body),
    });

    // If it succeeds, we learned nothing about voices (voice might be ignored or defaulted)
    if (resp.ok) {
        return { voices: [], raw: '', status: resp.status, statusText: resp.statusText };
    }

    const raw = await readTextAnyContentType(resp);
    const voices = extractVoicesFromText(raw);

    return { voices, raw, status: resp.status, statusText: resp.statusText };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { endpoint, model } = body as { endpoint?: string; model?: string };

        if (!endpoint || typeof endpoint !== 'string') {
            return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
        }
        if (!model || typeof model !== 'string') {
            return NextResponse.json({ error: 'Missing model' }, { status: 400 });
        }

        const cleanEndpoint = endpoint.replace(/\/+$/, '');
        const headers = buildHeaders(cleanEndpoint);

        // 1) Try OpenAI-compatible endpoint first
        const v1Result = await probeVoicesViaEndpoint({
            cleanEndpoint,
            headers,
            urlPath: '/v1/audio/speech',
            model,
        }).catch(() => null);

        if (v1Result && v1Result.voices.length > 0) {
            return NextResponse.json({ voices: v1Result.voices, source: 'error_message:/v1/audio/speech' }, { status: 200 });
        }

        // 2) Fallback to /tts
        const ttsResult = await probeVoicesViaEndpoint({
            cleanEndpoint,
            headers,
            urlPath: '/tts',
            model,
        }).catch(() => null);

        if (ttsResult && ttsResult.voices.length > 0) {
            return NextResponse.json({ voices: ttsResult.voices, source: 'error_message:/tts' }, { status: 200 });
        }

        return NextResponse.json(
            {
                voices: [],
                source: 'none',
                details: {
                    v1: v1Result ? { status: v1Result.status, statusText: v1Result.statusText, raw: v1Result.raw.substring(0, 500) } : null,
                    tts: ttsResult ? { status: ttsResult.status, statusText: ttsResult.statusText, raw: ttsResult.raw.substring(0, 500) } : null,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('[LocalAI Voices] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
