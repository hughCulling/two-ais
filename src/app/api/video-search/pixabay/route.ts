import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { initializeApp, getApps, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

import {
    getImageSearchMinDimensions,
    getVideoSearchMaxDuration,
    normalizeImageSearchQuery,
    type ImageSearchOrientation,
    type ImageSearchSize,
    type VideoSearchDuration,
    type VideoSearchResult,
    type VideoSearchType,
} from '@/lib/image-media';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RequestBody = {
    query?: string;
    orientation?: ImageSearchOrientation;
    size?: ImageSearchSize;
    videoType?: VideoSearchType;
    duration?: VideoSearchDuration;
};

type PixabayVideoFile = {
    url?: string;
    width?: number;
    height?: number;
    size?: number;
    thumbnail?: string;
};

type PixabayVideoHit = {
    id?: number;
    pageURL?: string;
    type?: string;
    tags?: string;
    duration?: number;
    picture_id?: string;
    videos?: {
        large?: PixabayVideoFile;
        medium?: PixabayVideoFile;
        small?: PixabayVideoFile;
        tiny?: PixabayVideoFile;
    };
    user?: string;
    user_id?: number;
};

type PixabayVideoResponse = {
    total?: number;
    totalHits?: number;
    hits?: PixabayVideoHit[];
};

let firebaseAdminApp: App | null = null;
let dbAdmin: Firestore | null = null;
let secretManagerClient: SecretManagerServiceClient | null = null;

function loadServiceAccount(): ServiceAccount {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountJson) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
    }

    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;
    const rawPrivateKey = (serviceAccount as { private_key?: unknown }).private_key;
    if (typeof rawPrivateKey === 'string') {
        (serviceAccount as { private_key?: string }).private_key = rawPrivateKey.replace(/\\n/g, '\n');
    }
    return serviceAccount;
}

function createSecretManagerClient(serviceAccount: ServiceAccount): SecretManagerServiceClient {
    return new SecretManagerServiceClient({
        credentials: {
            client_email: (serviceAccount as { client_email?: string }).client_email,
            private_key: (serviceAccount as { private_key?: string }).private_key,
        },
        projectId: (serviceAccount as { project_id?: string }).project_id,
    });
}

function initializeServices() {
    const serviceAccount = loadServiceAccount();

    if (getApps().length > 0) {
        if (!firebaseAdminApp) firebaseAdminApp = getApps()[0];
        if (!dbAdmin) dbAdmin = getFirestore(firebaseAdminApp);
        if (!secretManagerClient) secretManagerClient = createSecretManagerClient(serviceAccount);
        return;
    }

    firebaseAdminApp = initializeApp({ credential: cert(serviceAccount) });
    dbAdmin = getFirestore(firebaseAdminApp);
    secretManagerClient = createSecretManagerClient(serviceAccount);
}

async function getApiKeyFromSecret(secretVersionName: string): Promise<string | null> {
    if (!secretManagerClient) return null;
    const [version] = await secretManagerClient.accessSecretVersion({ name: secretVersionName });
    return version.payload?.data?.toString() || null;
}

function pickVideoFile(hit: PixabayVideoHit): PixabayVideoFile | null {
    const videos = hit.videos;
    if (!videos) return null;

    return videos.large || videos.medium || videos.small || videos.tiny || null;
}

function getPosterUrl(hit: PixabayVideoHit, file: PixabayVideoFile): string | undefined {
    if (file.thumbnail) return file.thumbnail;
    if (hit.picture_id) return `https://i.vimeocdn.com/video/${hit.picture_id}_640x360.jpg`;
    return undefined;
}

function isAcceptableHit(
    hit: PixabayVideoHit,
    orientation: ImageSearchOrientation,
    minWidth: number,
    minHeight: number,
    maxDuration: number | null
): boolean {
    if (!hit.pageURL) return false;
    if (maxDuration && typeof hit.duration === 'number' && hit.duration > maxDuration) return false;

    const file = pickVideoFile(hit);
    if (!file?.url) return false;

    const width = typeof file.width === 'number' ? file.width : 0;
    const height = typeof file.height === 'number' ? file.height : 0;
    if (width > 0 && width < minWidth) return false;
    if (height > 0 && height < minHeight) return false;
    if (orientation === 'landscape' && width > 0 && height > 0 && width <= height) return false;
    if (orientation === 'portrait' && width > 0 && height > 0 && height <= width) return false;

    return true;
}

function toSearchResult(hit: PixabayVideoHit): VideoSearchResult {
    const file = pickVideoFile(hit) || {};
    const authorName = typeof hit.user === 'string' && hit.user.trim() ? hit.user.trim() : undefined;
    const authorUrl = authorName && hit.user_id
        ? `https://pixabay.com/users/${encodeURIComponent(authorName)}-${hit.user_id}/`
        : undefined;

    return {
        videoUrl: file.url || '',
        posterUrl: getPosterUrl(hit, file),
        sourceUrl: hit.pageURL || 'https://pixabay.com/videos/',
        width: file.width,
        height: file.height,
        duration: hit.duration,
        sizeBytes: file.size,
        alt: hit.tags,
        source: {
            provider: 'pixabay',
            providerName: 'Pixabay',
            sourceUrl: hit.pageURL || 'https://pixabay.com/videos/',
            authorName,
            authorUrl,
            licenseName: 'Pixabay Content License',
            licenseUrl: 'https://pixabay.com/service/license-summary/',
        },
    };
}

export async function POST(request: NextRequest) {
    try {
        initializeServices();
        if (!firebaseAdminApp || !dbAdmin) {
            return NextResponse.json({ error: 'Server configuration error - services not initialized' }, { status: 500 });
        }

        const authorization = request.headers.get('Authorization');
        if (!authorization?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized: Missing Bearer token' }, { status: 401 });
        }

        const idToken = authorization.split('Bearer ')[1];
        let decodedToken: DecodedIdToken;
        try {
            decodedToken = await getAuth(firebaseAdminApp).verifyIdToken(idToken);
        } catch {
            return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
        }

        const body = (await request.json()) as RequestBody;
        const query = normalizeImageSearchQuery(body.query || '');
        if (!query) {
            return NextResponse.json({ error: 'query is required' }, { status: 400 });
        }

        const orientation: ImageSearchOrientation = body.orientation || 'any';
        const size: ImageSearchSize = body.size || 'medium';
        const videoType: VideoSearchType = body.videoType || 'film';
        const duration: VideoSearchDuration = body.duration || 'short';
        const { minWidth, minHeight } = getImageSearchMinDimensions(size, orientation);
        const maxDuration = getVideoSearchMaxDuration(duration);

        const userDoc = await dbAdmin.collection('users').doc(decodedToken.uid).get();
        const secretVersionName = userDoc.data()?.apiSecretVersions?.pixabay;
        if (!secretVersionName) {
            return NextResponse.json({ error: 'Pixabay API key not found in Settings.' }, { status: 404 });
        }

        const apiKey = await getApiKeyFromSecret(secretVersionName);
        if (!apiKey) {
            return NextResponse.json({ error: 'Could not load Pixabay API key.' }, { status: 500 });
        }

        const searchParams = new URLSearchParams({
            key: apiKey,
            q: query,
            video_type: videoType,
            safesearch: 'true',
            order: 'popular',
            per_page: '20',
            min_width: String(minWidth),
            min_height: String(minHeight),
        });

        const response = await fetch(`https://pixabay.com/api/videos/?${searchParams.toString()}`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(15000),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: `Pixabay API error: ${response.status} ${response.statusText} - ${errorText}` },
                { status: response.status }
            );
        }

        const data = await response.json() as PixabayVideoResponse;
        const hits = Array.isArray(data.hits) ? data.hits : [];
        const firstAcceptable = hits.find(hit => isAcceptableHit(hit, orientation, minWidth, minHeight, maxDuration));

        if (!firstAcceptable) {
            return NextResponse.json({ error: 'No suitable Pixabay video found for this query.' }, { status: 404 });
        }

        return NextResponse.json({ result: toSearchResult(firstAcceptable) }, { status: 200 });
    } catch (error) {
        console.error('[pixabay-video-search] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown Pixabay video search error' },
            { status: 500 }
        );
    }
}
