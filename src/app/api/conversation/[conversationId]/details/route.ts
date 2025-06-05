import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, Firestore, Timestamp, FieldValue } from 'firebase-admin/firestore';

// Ensure Firebase Admin is initialized
let firebaseAdminApp: App | null = null;
let dbAdmin: Firestore | null = null;

function initializeFirebaseAdmin() {
    if (getApps().length === 0) {
        const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (!serviceAccountJson) {
            console.error("API Details Route: FIREBASE_SERVICE_ACCOUNT_KEY env var not set.");
            throw new Error("Server configuration error: Firebase service account key not found.");
        }
        try {
            const serviceAccount = JSON.parse(serviceAccountJson);
            if (serviceAccount.private_key) {
                serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
            }
            firebaseAdminApp = initializeApp({ credential: cert(serviceAccount) });
            console.log("API Details Route: Firebase Admin SDK Initialized.");
        } catch (e) {
            console.error("API Details Route: Error initializing Firebase Admin SDK", e);
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
    console.error("API Details Route: Failed to initialize Firebase Admin during module load:", error);
}

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'human' | 'ai'; // Extended roles based on common usage
    content: string;
    timestamp: string; // ISO string
    // Add other potential message fields if necessary, e.g., name, agentId
}

// Define a more specific type for TTS settings based on its likely structure
interface TTSAgentConfig {
    provider: string;
    voice: string | null;
    selectedTtsModelId?: string;
    ttsApiModelId?: string;
}

interface ConversationTTSSettings {
    enabled: boolean;
    agentA: TTSAgentConfig;
    agentB: TTSAgentConfig;
}

interface ConversationDetails {
    conversationId: string;
    createdAt: string; // ISO string
    agentA_llm: string;
    agentB_llm: string;
    language: string;
    ttsSettings?: ConversationTTSSettings; // Use the more specific type
    messages: Message[];
    // other config fields like apiSecretVersions might not be needed for display
}

export async function GET(
    request: NextRequest, 
    { params }: { params: Promise<{ conversationId: string }> }
) {
    const { conversationId } = await params;
    console.log(`API route /api/conversation/${conversationId}/details hit`);

    if (!dbAdmin || !firebaseAdminApp) {
        console.error("API Details Route: Firestore Admin not initialized at start of GET handler.");
        try { initializeFirebaseAdmin(); } catch (initError) {
            console.error("API Details Route: Re-initialization failed:", initError);
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }
        if (!dbAdmin || !firebaseAdminApp) {
            return NextResponse.json({ error: "Server critically unavailable" }, { status: 500 });
        }
    }

    try {
        const authorization = request.headers.get("Authorization");
        if (!authorization?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized: Missing Bearer token" }, { status: 401 });
        }
        const idToken = authorization.split("Bearer ")[1];
        let decodedToken: DecodedIdToken;
        try {
            decodedToken = await getAuth(firebaseAdminApp).verifyIdToken(idToken);
        } catch {
            return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
        }
        const userId = decodedToken.uid;
        console.log(`API Details Route: Authenticated user: ${userId} for conversation: ${conversationId}`);

        const conversationRef = dbAdmin.collection("conversations").doc(conversationId);
        const conversationDoc = await conversationRef.get();

        if (!conversationDoc.exists) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        const conversationData = conversationDoc.data();
        if (!conversationData || conversationData.userId !== userId) {
            console.warn(`API Details Route: Unauthorized access attempt by ${userId} for conversation ${conversationId} owned by ${conversationData?.userId}`);
            return NextResponse.json({ error: "Forbidden: You do not have access to this conversation" }, { status: 403 });
        }

        const messagesRef = conversationRef.collection("messages").orderBy("timestamp", "asc");
        const messagesSnapshot = await messagesRef.get();

        const messages: Message[] = [];
        messagesSnapshot.forEach(doc => {
            const data = doc.data();
            const timestamp = data.timestamp as Timestamp | FieldValue | undefined;
            let isoTimestamp: string;

            if (timestamp instanceof Timestamp) {
                isoTimestamp = timestamp.toDate().toISOString();
            } else {
                // Fallback for server timestamps that might not be resolved yet, or if data is missing
                // This shouldn't ideally happen for historical data if correctly written.
                // Consider how to handle this - maybe filter out or use a placeholder.
                // For now, using epoch as a fallback, but this indicates a potential issue upstream or with data integrity.
                console.warn(`Message ${doc.id} in conversation ${conversationId} has an unexpected timestamp format or is missing.`);
                isoTimestamp = new Date(0).toISOString(); 
            }

            messages.push({
                id: doc.id,
                role: data.role || 'unknown', // Provide a fallback for role
                content: data.content || '',
                timestamp: isoTimestamp,
            });
        });
        
        const createdAtTimestamp = conversationData.createdAt as Timestamp | undefined;

        const details: ConversationDetails = {
            conversationId: conversationDoc.id,
            createdAt: createdAtTimestamp ? createdAtTimestamp.toDate().toISOString() : new Date(0).toISOString(),
            agentA_llm: conversationData.agentA_llm || 'Unknown',
            agentB_llm: conversationData.agentB_llm || 'Unknown',
            language: conversationData.language || 'en',
            ttsSettings: conversationData.ttsSettings, // Pass along TTS settings
            messages: messages,
        };

        return NextResponse.json(details, { status: 200 });

    } catch (error) {
        console.error(`API Details Route: Unhandled error for conversation ${conversationId}:`, error);
        const errorMessage = error instanceof Error ? error.message : "Unknown internal server error";
        return NextResponse.json({ error: "Internal server error retrieving conversation details.", details: errorMessage }, { status: 500 });
    }
} 