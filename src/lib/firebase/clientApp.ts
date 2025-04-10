// lib/firebase/clientApp.ts
// Final version with explicit types for exported variables

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app"; // Import FirebaseApp type
import { getAuth, Auth } from "firebase/auth"; // Import Auth type
import { getFirestore, Firestore } from "firebase/firestore"; // Import Firestore type

// --- Load config from environment variables ---
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional
};

// --- Debugging logs commented out ---
/*
console.log("Firebase Config Check:");
console.log("API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Loaded' : 'MISSING!');
console.log("Auth Domain:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Loaded' : 'MISSING!');
console.log("Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID : 'MISSING!');
*/

// Declare variables with explicit types, initialized to null
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
    // Initialize Firebase App (preventing re-initialization)
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

    // Initialize Auth
    auth = getAuth(app);

    // Initialize Firestore - connects to the '(default)' database
    db = getFirestore(app);

} catch (error) {
    console.error("!!! Firebase Initialization Error:", error);
    // app, auth, db remain null if initialization fails
}

// Export the initialized instances (their types are now known)
export { app, auth, db };
