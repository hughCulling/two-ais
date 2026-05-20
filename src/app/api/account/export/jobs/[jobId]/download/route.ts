import { NextResponse, type NextRequest } from 'next/server';
import { initializeApp, getApps, cert, type App, type ServiceAccount } from 'firebase-admin/app';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, type Firestore, Timestamp } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';

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
    console.error('Export download route failed to initialize Firebase Admin during module load:', error);
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ jobId: string }> },
) {
    const { jobId } = await params;

    if (!firebaseAdminApp || !dbAdmin || !storageAdmin) {
        try {
            initializeServices();
        } catch (error) {
            console.error('Export download route failed to initialize services:', error);
            return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
        }
    }

    if (!firebaseAdminApp || !dbAdmin || !storageAdmin) {
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

    const jobSnapshot = await dbAdmin.collection('exportJobs').doc(jobId).get();
    if (!jobSnapshot.exists) {
        return NextResponse.json({ error: 'Export job not found.' }, { status: 404 });
    }

    const job = jobSnapshot.data();
    if (!job || job.userId !== decodedToken.uid) {
        return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    if (job.status !== 'ready' || typeof job.filePath !== 'string') {
        return NextResponse.json({ error: 'Export is not ready yet.' }, { status: 409 });
    }

    if (job.expiresAt instanceof Timestamp && job.expiresAt.toDate().getTime() <= Date.now()) {
        return NextResponse.json({ error: 'Export has expired.' }, { status: 410 });
    }

    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucketName) {
        return NextResponse.json({ error: 'Storage bucket is not configured.' }, { status: 500 });
    }

    const [archive] = await storageAdmin.bucket(bucketName).file(job.filePath).download();
    const filename = typeof job.filename === 'string' ? job.filename : `two-ais-data-export-${jobId}.zip`;

    return new NextResponse(new Uint8Array(archive), {
        status: 200,
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Cache-Control': 'no-store',
        },
    });
}
