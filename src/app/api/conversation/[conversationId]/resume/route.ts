import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { initializeApp, getApps, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import fetch from 'node-fetch';

// --- Initialize Firebase Admin ---
let firebaseAdminApp: App | null = null;
let dbAdmin: Firestore | null = null;
function initializeServices() {
    if (getApps().length > 0) {
        if (!firebaseAdminApp) firebaseAdminApp = getApps()[0];
        if (!dbAdmin) dbAdmin = getFirestore(firebaseAdminApp);
        return;
    }
    try {
        const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (!serviceAccountJson) throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.");
        let serviceAccount: ServiceAccount;
        try {
            serviceAccount = JSON.parse(serviceAccountJson);
        } catch {
            throw new Error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON.");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawPrivateKey = (serviceAccount as any).private_key;
        if (typeof rawPrivateKey === 'string') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (serviceAccount as any).private_key = rawPrivateKey.replace(/\\n/g, '\n');
        } else {
            throw new Error("Parsed service account key 'private_key' is not a string.");
        }
        firebaseAdminApp = initializeApp({ credential: cert(serviceAccount) });
        dbAdmin = getFirestore(firebaseAdminApp);
    } catch {
        firebaseAdminApp = null;
        dbAdmin = null;
    }
}
initializeServices();

export async function POST(request: NextRequest) {
    // Extract conversationId from the URL path
    const url = new URL(request.url);
    const parts = url.pathname.split('/');
    const conversationIdx = parts.indexOf('conversation');
    let conversationId = '';
    if (conversationIdx !== -1 && parts.length > conversationIdx + 2) {
        // /api/conversation/[conversationId]/resume
        conversationId = parts[conversationIdx + 1];
    } else {
        return NextResponse.json({ error: "Invalid conversationId in URL." }, { status: 400 });
    }

    if (!dbAdmin || !firebaseAdminApp) {
        initializeServices();
        if (!dbAdmin || !firebaseAdminApp) {
            return NextResponse.json({ error: "Server configuration error - services not initialized" }, { status: 500 });
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
        // Fetch conversation
        const conversationRef = dbAdmin.collection("conversations").doc(conversationId);
        const conversationSnap = await conversationRef.get();
        if (!conversationSnap.exists) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }
        const conversation = conversationSnap.data();
        if (!conversation || conversation.userId !== userId) {
            return NextResponse.json({ error: "You do not have permission to resume this conversation." }, { status: 403 });
        }
        const status = conversation.status;
        // Only allow resuming if stopped or error (but not unrecoverable)
        if (status === "running") {
            return NextResponse.json({ message: "Conversation is already running.", conversationId }, { status: 200 });
        }
        // If status is error, check for unrecoverable error (e.g., missing config)
        if (status === "error") {
            // If missing required fields, do not allow resume
            if (!conversation.agentA_llm || !conversation.agentB_llm) {
                return NextResponse.json({ error: "Conversation is in an unrecoverable error state and cannot be resumed." }, { status: 400 });
            }
        }
        // Fetch latest message to determine whose turn it should be
        const messagesRef = conversationRef.collection("messages");
        const lastMsgSnap = await messagesRef.orderBy("timestamp", "desc").limit(1).get();
        let nextTurn: "agentA" | "agentB" = "agentA";
        if (!lastMsgSnap.empty) {
            const lastMsg = lastMsgSnap.docs[0].data();
            if (lastMsg.role === "agentA") nextTurn = "agentB";
            else if (lastMsg.role === "agentB") nextTurn = "agentA";
            // If last message is user/system, default to agentA
        }
        // Update conversation status to 'running' and set turn
        await conversationRef.update({
            status: 'running',
            turn: nextTurn,
            waitingForTTSEndSignal: false,
            errorContext: '',
        });
        console.log(`Resume endpoint: Updated conversation ${conversationId} to status 'running' and turn '${nextTurn}'.`);

        // Trigger agent response for the current turn with forceNextTurn: true
        try {
            // Use the local emulator or deployed endpoint as appropriate
            const triggerUrl = process.env.NEXT_PUBLIC_TRIGGER_AGENT_RESPONSE_URL ||
                'https://us-central1-two-ais.cloudfunctions.net/triggerAgentResponseHttp';
            const triggerRes = await fetch(triggerUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId,
                    turn: nextTurn,
                    forceNextTurn: true
                })
            });
            if (!triggerRes.ok) {
                const errText = await triggerRes.text();
                console.error('Failed to trigger agent response after resume:', errText);
            }
        } catch (err) {
            console.error('Error triggering agent response after resume:', err);
        }
        return NextResponse.json({ message: "Conversation resumed successfully.", conversationId }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Internal server error during resume attempt" }, { status: 500 });
    }
} 