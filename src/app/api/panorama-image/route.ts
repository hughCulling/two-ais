import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAllowedStorageImageUrl(url: URL): boolean {
    const allowedHosts = new Set([
        'firebasestorage.googleapis.com',
        'storage.googleapis.com',
    ]);

    if (url.protocol !== 'https:') return false;
    if (!allowedHosts.has(url.hostname)) return false;

    const decodedPath = decodeURIComponent(url.pathname);
    return decodedPath.includes('/conversations/') && decodedPath.includes('/images/');
}

export async function GET(request: NextRequest) {
    const rawUrl = request.nextUrl.searchParams.get('url');
    if (!rawUrl) {
        return NextResponse.json({ error: 'Missing image URL' }, { status: 400 });
    }

    let imageUrl: URL;
    try {
        imageUrl = new URL(rawUrl);
    } catch {
        return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
    }

    if (!isAllowedStorageImageUrl(imageUrl)) {
        return NextResponse.json({ error: 'Unsupported image URL' }, { status: 400 });
    }

    try {
        const response = await fetch(imageUrl, {
            cache: 'no-store',
            signal: AbortSignal.timeout(20000),
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Image fetch failed: ${response.status} ${response.statusText}` },
                { status: response.status }
            );
        }

        const contentType = response.headers.get('content-type') || 'image/png';
        if (!contentType.startsWith('image/')) {
            return NextResponse.json({ error: 'URL did not return an image' }, { status: 415 });
        }

        const imageBytes = await response.arrayBuffer();
        return new NextResponse(imageBytes, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'private, max-age=300',
            },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown image proxy error';
        return NextResponse.json({ error: message }, { status: 502 });
    }
}
