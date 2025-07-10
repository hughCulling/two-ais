import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, Firestore, Timestamp } from 'firebase-admin/firestore';
import { cert } from 'firebase-admin/app';

// Ensure Firebase Admin is initialized ( reusing initialization logic pattern from other routes)
let firebaseAdminApp: App | null = null;
let dbAdmin: Firestore | null = null;

function initializeFirebaseAdmin() {
    if (getApps().length === 0) {
        // Assuming FIREBASE_SERVICE_ACCOUNT_KEY is set in the environment
        // and is the stringified JSON of the service account key.
        // This is a common pattern. For production, ensure this is securely managed.
        const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (!serviceAccountJson) {
            console.error("API History Route: FIREBASE_SERVICE_ACCOUNT_KEY env var not set.");
            throw new Error("Server configuration error: Firebase service account key not found.");
        }
        try {
            const serviceAccount = JSON.parse(serviceAccountJson);
            // The private_key in the JSON might have literal \n, replace with actual newlines
            if (serviceAccount.private_key) {
                serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
            }
            firebaseAdminApp = initializeApp({
                credential: cert(serviceAccount)
            });
            console.log("API History Route: Firebase Admin SDK Initialized.");
        } catch (e) {
            console.error("API History Route: Error initializing Firebase Admin SDK", e);
            throw new Error("Server configuration error: Could not initialize Firebase Admin.");
        }
    } else {
        firebaseAdminApp = getApps()[0];
    }
    if (firebaseAdminApp) {
        dbAdmin = getFirestore(firebaseAdminApp);
    }
}

try {
    initializeFirebaseAdmin();
} catch (error) {
    console.error("API History Route: Failed to initialize Firebase Admin during module load:", error);
    // dbAdmin might be null, requests will fail.
}


interface ConversationSummary {
    conversationId: string;
    createdAt: string; // ISO string
    agentA_llm: string;
    agentB_llm: string;
    language: string;
    // We could add a snippet of the last message or a title in the future
}

export async function GET(request: NextRequest) {
    console.log("API route /api/conversations/history hit");
    console.log("FIREBASE_SERVICE_ACCOUNT_KEY present:", !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

    if (!dbAdmin || !firebaseAdminApp) {
        console.error("API History Route: Firestore Admin not initialized at start of GET handler.");
        try {
            initializeFirebaseAdmin(); // Attempt re-initialization
        } catch (initError) {
            console.error("API History Route: Re-initialization failed in GET handler:", initError);
            return NextResponse.json({ error: "Server configuration error - services not initialized" }, { status: 500 });
        }
        if (!dbAdmin || !firebaseAdminApp) {
            console.error("API History Route: Services still unavailable after re-initialization attempt.");
            return NextResponse.json({ error: "Server configuration error - services critically unavailable" }, { status: 500 });
        }
        console.log("API History Route: Services successfully re-initialized within GET handler.");
    }

    try {
        const authorization = request.headers.get("Authorization");
        console.log("Authorization header:", authorization);
        if (!authorization?.startsWith("Bearer ")) {
            console.warn("API History Route: Unauthorized - Missing Bearer token");
            return NextResponse.json({ error: "Unauthorized: Missing Bearer token" }, { status: 401 });
        }
        const idToken = authorization.split("Bearer ")[1];
        console.log("ID Token received:", idToken ? idToken.substring(0, 20) + '...' : null);
        let decodedToken: DecodedIdToken;
        try {
            decodedToken = await getAuth(firebaseAdminApp).verifyIdToken(idToken);
        } catch (error) {
            console.error("API History Route: Error verifying ID token:", error);
            return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
        }
        const userId = decodedToken.uid;
        console.log(`API History Route: Authenticated user: ${userId}`);

        const conversationsRef = dbAdmin.collection("conversations");
        const querySnapshot = await conversationsRef
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc") // Show newest first
            .get();

        if (querySnapshot.empty) {
            return NextResponse.json([], { status: 200 }); // No conversations found
        }

        const conversations: ConversationSummary[] = [];
        querySnapshot.forEach(doc => {
            const data = doc.data();
            const createdAtTimestamp = data.createdAt as Timestamp | undefined;

            conversations.push({
                conversationId: doc.id,
                // Ensure createdAt is converted to ISO string. Handle potential undefined or missing field.
                createdAt: createdAtTimestamp ? createdAtTimestamp.toDate().toISOString() : new Date(0).toISOString(),
                agentA_llm: data.agentA_llm || 'Unknown',
                agentB_llm: data.agentB_llm || 'Unknown',
                language: data.language || 'en', // Default to 'en' if not present
            });
        });

        return NextResponse.json(conversations, { status: 200 });

    } catch (error) {
        console.error("API History Route: Unhandled error in /api/conversations/history:", error);
        // Check if error is an instance of Error to access message property safely
        const errorMessage = error instanceof Error ? error.message : "Unknown internal server error";
        return NextResponse.json({ error: "Internal server error retrieving conversation history.", details: errorMessage }, { status: 500 });
    }
} 