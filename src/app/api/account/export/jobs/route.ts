import { NextResponse, type NextRequest } from 'next/server';
import { initializeApp, getApps, cert, type App, type ServiceAccount } from 'firebase-admin/app';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, type Firestore, Timestamp } from 'firebase-admin/firestore';
import { getFunctions, type Functions } from 'firebase-admin/functions';
import { sanitizeLocalPreferences } from '@/lib/data-export';

export const dynamic = 'force-dynamic';

let firebaseAdminApp: App | null = null;
let dbAdmin: Firestore | null = null;
let functionsAdmin: Functions | null = null;

function initializeServices() {
    if (getApps().length > 0) {
        firebaseAdminApp = getApps()[0];
        dbAdmin = getFirestore(firebaseAdminApp);
        functionsAdmin = getFunctions(firebaseAdminApp);
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
    functionsAdmin = getFunctions(firebaseAdminApp);
}

try {
    initializeServices();
} catch (error) {
    console.error('Export job route failed to initialize Firebase Admin during module load:', error);
}

export async function POST(request: NextRequest) {
    if (!firebaseAdminApp || !dbAdmin || !functionsAdmin) {
        try {
            initializeServices();
        } catch (error) {
            console.error('Export job route failed to initialize services:', error);
            return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
        }
    }

    if (!firebaseAdminApp || !dbAdmin || !functionsAdmin) {
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

    const existingJobs = await dbAdmin.collection('exportJobs')
        .where('userId', '==', decodedToken.uid)
        .get();
    const existingActiveJob = existingJobs.docs.find((doc) => {
        const status = doc.data().status;
        return status === 'queued' || status === 'processing';
    });

    if (existingActiveJob) {
        const doc = existingActiveJob;
        return NextResponse.json({
            jobId: doc.id,
            status: doc.data().status,
            reusedExistingJob: true,
        }, { status: 200 });
    }

    let requestBody: unknown = {};
    try {
        requestBody = await request.json();
    } catch {
        requestBody = {};
    }

    const localPreferences = sanitizeLocalPreferences(
        typeof requestBody === 'object' && requestBody !== null
            ? (requestBody as Record<string, unknown>).localPreferences
            : undefined,
    );
    const jobRef = dbAdmin.collection('exportJobs').doc();
    const requestedAt = Timestamp.now();

    await jobRef.set({
        userId: decodedToken.uid,
        status: 'queued',
        requestedAt,
        updatedAt: requestedAt,
        localPreferences,
    });

    try {
        await functionsAdmin.taskQueue<{ jobId: string }>('processDataExport').enqueue({ jobId: jobRef.id });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unable to enqueue export job.';
        await jobRef.update({
            status: 'failed',
            updatedAt: Timestamp.now(),
            errorMessage,
        });
        console.error('Failed to enqueue export job:', error);
        return NextResponse.json({ error: `Unable to queue export job. ${errorMessage}` }, { status: 500 });
    }

    return NextResponse.json({
        jobId: jobRef.id,
        status: 'queued',
        reusedExistingJob: false,
    }, { status: 202 });
}
