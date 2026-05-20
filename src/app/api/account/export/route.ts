import { NextResponse, type NextRequest } from 'next/server';
import { initializeApp, getApps, cert, type App, type ServiceAccount } from 'firebase-admin/app';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';
import JSZip from 'jszip';
import {
    buildManifest,
    buildPrivacySummary,
    sanitizeLocalPreferences,
    sanitizeUserDocument,
    toSerializableValue,
    type ExportedMediaFile,
} from '@/lib/data-export';

export const dynamic = 'force-dynamic';

let firebaseAdminApp: App | null = null;
let dbAdmin: Firestore | null = null;
let storageAdmin: Storage | null = null;

function initializeServices() {
    if (getApps().length > 0) {
        firebaseAdminApp = getApps()[0];
        dbAdmin = getFirestore(firebaseAdminApp);
        storageAdmin = getStorage(firebaseAdminApp);
        return;
    }

    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountJson) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
    }

    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount & { private_key?: string };
    if (typeof serviceAccount.private_key === 'string') {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    firebaseAdminApp = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
    dbAdmin = getFirestore(firebaseAdminApp);
    storageAdmin = getStorage(firebaseAdminApp);
}

try {
    initializeServices();
} catch (error) {
    console.error('Data export route failed to initialize Firebase Admin during module load:', error);
}

export async function POST(request: NextRequest) {
    if (!firebaseAdminApp || !dbAdmin) {
        try {
            initializeServices();
        } catch (error) {
            console.error('Data export route failed to initialize services:', error);
            return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
        }
    }

    if (!firebaseAdminApp || !dbAdmin) {
        return NextResponse.json({ error: 'Server services unavailable.' }, { status: 500 });
    }

    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized: Missing Bearer token.' }, { status: 401 });
    }

    let decodedToken: DecodedIdToken;
    try {
        decodedToken = await getAuth(firebaseAdminApp).verifyIdToken(authorization.slice('Bearer '.length));
    } catch {
        return NextResponse.json({ error: 'Unauthorized: Invalid token.' }, { status: 401 });
    }

    let requestBody: unknown = {};
    try {
        requestBody = await request.json();
    } catch {
        requestBody = {};
    }

    const exportedAt = new Date().toISOString();
    const localPreferences = sanitizeLocalPreferences(
        typeof requestBody === 'object' && requestBody !== null
            ? (requestBody as Record<string, unknown>).localPreferences
            : undefined,
    );
    const zip = new JSZip();
    const includedFiles: string[] = [];
    const mediaFiles: ExportedMediaFile[] = [];
    const userId = decodedToken.uid;

    const accountRecord = await getAuth(firebaseAdminApp).getUser(userId);
    addJson(zip, includedFiles, 'account.json', {
        uid: accountRecord.uid,
        email: accountRecord.email ?? null,
        emailVerified: accountRecord.emailVerified,
        displayName: accountRecord.displayName ?? null,
        photoURL: accountRecord.photoURL ?? null,
        disabled: accountRecord.disabled,
        metadata: accountRecord.metadata,
        providerData: accountRecord.providerData.map((provider) => ({
            providerId: provider.providerId,
            uid: provider.uid,
            email: provider.email ?? null,
            displayName: provider.displayName ?? null,
            photoURL: provider.photoURL ?? null,
        })),
    });

    const userDoc = await dbAdmin.collection('users').doc(userId).get();
    addJson(zip, includedFiles, 'settings.json', {
        firestoreProfile: sanitizeUserDocument(userDoc.exists ? userDoc.data() : undefined),
        localPreferences,
    });

    const conversationsSnapshot = await dbAdmin.collection('conversations')
        .where('userId', '==', userId)
        .get();

    const conversations = await Promise.all(conversationsSnapshot.docs.map(async (conversationDoc) => {
        const messagesSnapshot = await conversationDoc.ref.collection('messages')
            .orderBy('timestamp', 'asc')
            .get();

        return {
            id: conversationDoc.id,
            ...toSerializableValue(conversationDoc.data()) as Record<string, unknown>,
            messages: messagesSnapshot.docs.map((messageDoc) => ({
                id: messageDoc.id,
                ...toSerializableValue(messageDoc.data()) as Record<string, unknown>,
            })),
        };
    }));

    conversations
        .sort((left, right) => String(left.id).localeCompare(String(right.id)))
        .forEach((conversation) => {
            addJson(zip, includedFiles, `conversations/${conversation.id}.json`, conversation);
        });

    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    const storageAvailable = Boolean(storageAdmin && bucketName);
    if (storageAdmin && bucketName) {
        const bucket = storageAdmin.bucket(bucketName);
        for (const conversation of conversations) {
            for (const mediaKind of ['images', 'audio'] as const) {
                const prefix = `conversations/${conversation.id}/${mediaKind}/`;
                const [files] = await bucket.getFiles({ prefix });

                for (const file of files) {
                    const relativePath = file.name.slice(prefix.length);
                    if (!relativePath) continue;

                    const archivePath = `media/${conversation.id}/${mediaKind}/${relativePath}`;
                    const [contents] = await file.download();
                    const [metadata] = await file.getMetadata();

                    zip.file(archivePath, contents);
                    includedFiles.push(archivePath);
                    mediaFiles.push({
                        archivePath,
                        storagePath: file.name,
                        contentType: metadata.contentType ?? null,
                        size: typeof metadata.size === 'string' ? Number(metadata.size) : null,
                    });
                }
            }
        }
    }

    zip.file('README.txt', buildPrivacySummary(exportedAt));
    includedFiles.push('README.txt');
    const includedFilesWithManifest = [...includedFiles, 'manifest.json'];
    addJson(zip, includedFiles, 'manifest.json', buildManifest({
        exportedAt,
        includedFiles: includedFilesWithManifest,
        mediaFiles,
        storageAvailable,
    }));

    const archive = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
    });
    const fileSafeTimestamp = exportedAt.replace(/[:.]/g, '-');

    return new NextResponse(new Uint8Array(archive), {
        status: 200,
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="two-ais-data-export-${fileSafeTimestamp}.zip"`,
            'Cache-Control': 'no-store',
        },
    });
}

function addJson(zip: JSZip, includedFiles: string[], path: string, value: unknown) {
    zip.file(path, `${JSON.stringify(value, null, 2)}\n`);
    includedFiles.push(path);
}
