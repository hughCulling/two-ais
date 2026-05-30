import { NextResponse, type NextRequest } from 'next/server';

type ClientDebugLogBody = {
    scope?: string;
    message?: string;
    data?: unknown;
};

export async function POST(request: NextRequest) {
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ ok: true }, { status: 200 });
    }

    try {
        const body = (await request.json()) as ClientDebugLogBody;
        const scope = typeof body.scope === 'string' && body.scope.trim()
            ? body.scope.trim().slice(0, 80)
            : 'client';
        const message = typeof body.message === 'string' && body.message.trim()
            ? body.message.trim().slice(0, 160)
            : 'debug';

        console.info(`[client-debug:${scope}] ${message}`, body.data ?? {});
        return NextResponse.json({ ok: true }, { status: 200 });
    } catch {
        return NextResponse.json({ ok: false }, { status: 400 });
    }
}
