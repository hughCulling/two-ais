import { NextResponse, type NextRequest } from 'next/server';
import { initializeApp, getApps, cert, type App, type ServiceAccount } from 'firebase-admin/app';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, type Firestore, Timestamp } from 'firebase-admin/firestore';
import { getFunctions, type Functions } from 'firebase-admin/functions';
import { sanitizeLocalPreferences } from '@/lib/data-export';

export const dynamic = 'force-dynamic';

const STALE_ACTIVE_JOB_MS = 10 * 60 * 1000;

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

    let requestBody: unknown = {};
    try {
        requestBody = await request.json();
    } catch {
        requestBody = {};
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
        const data = doc.data();
        const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : 0;
        const isStale = updatedAt > 0 && Date.now() - updatedAt > STALE_ACTIVE_JOB_MS;

        if (isStale) {
            await doc.ref.update({
                status: 'failed',
                updatedAt: Timestamp.now(),
                errorMessage: 'Marked failed because the export job was queued for too long without being processed. You can request a new export.',
            });
        } else {
            return NextResponse.json({
                jobId: doc.id,
                status: data.status,
                reusedExistingJob: true,
            }, { status: 200 });
        }
    }

    const retryJobId = typeof requestBody === 'object' && requestBody !== null
        ? (requestBody as Record<string, unknown>).retryJobId
        : undefined;

    if (typeof retryJobId === 'string' && retryJobId.trim()) {
        const retryRef = dbAdmin.collection('exportJobs').doc(retryJobId.trim());
        const retrySnapshot = await retryRef.get();
        if (!retrySnapshot.exists) {
            return NextResponse.json({ error: 'Export job not found.' }, { status: 404 });
        }

        const retryData = retrySnapshot.data();
        if (!retryData || retryData.userId !== decodedToken.uid) {
            return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
        }

        const retryStatus = retryData.status;
        const retryUpdatedAt = retryData.updatedAt instanceof Timestamp ? retryData.updatedAt.toMillis() : 0;
        const canRetry = retryStatus === 'failed'
            || (retryStatus === 'queued' && retryUpdatedAt > 0 && Date.now() - retryUpdatedAt > STALE_ACTIVE_JOB_MS);

        if (!canRetry) {
            return NextResponse.json({ error: 'This export is not ready to retry yet.' }, { status: 409 });
        }

        await retryRef.update({
            status: 'queued',
            updatedAt: Timestamp.now(),
            errorMessage: null,
        });

        try {
            await functionsAdmin.taskQueue<{ jobId: string }>('processDataExport').enqueue({ jobId: retryRef.id });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unable to enqueue export job.';
            await retryRef.update({
                status: 'failed',
                updatedAt: Timestamp.now(),
                errorMessage,
            });
            console.error('Failed to enqueue export retry:', error);
            return NextResponse.json({ error: `Unable to retry export job. ${errorMessage}` }, { status: 500 });
        }

        return NextResponse.json({
            jobId: retryRef.id,
            status: 'queued',
            reusedExistingJob: true,
            retried: true,
        }, { status: 202 });
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
