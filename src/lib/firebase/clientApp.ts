// src/lib/firebase/clientApp.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

// Your web app's Firebase configuration
// It's recommended to use environment variables for sensitive data
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional: for Analytics
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Initialize Firebase App
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.log("Firebase app initialized.");
} else {
  app = getApp();
  console.log("Firebase app already initialized.");
}

// Initialize Firebase Services that are safe on server/client
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, 'us-central1'); // Specify the region

// Initialize client-side only services (App Check, Analytics)
let analytics;
let appCheck;
let appCheckInitialized = false;

/**
 * Lazily initialize Firebase App Check (reCAPTCHA Enterprise) only when needed.
 * Safe to call multiple times; will only initialize once.
 */
async function ensureAppCheckInitialized() {
    if (appCheckInitialized || typeof window === 'undefined') return;
    const reCaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY;
    if (!reCaptchaKey) {
        console.warn("NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY is not set. App Check not initialized.");
        return;
    }
    try {
        if (process.env.NODE_ENV === 'development') {
            // @ts-expect-error - Debug token is available in development
            self.FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN || true;
            console.log("App Check debug token set for development.");
        }
        appCheck = initializeAppCheck(app, {
            provider: new ReCaptchaEnterpriseProvider(reCaptchaKey),
            isTokenAutoRefreshEnabled: true
        });
        appCheckInitialized = true;
        console.log("Firebase App Check (reCAPTCHA Enterprise) initialized (lazy).");
    } catch (e) {
        console.warn("App Check initialization error (lazy):", e);
    }
}

// Initialize Analytics (only in browser)
if (typeof window !== 'undefined') {
    isAnalyticsSupported().then((supported) => {
        if (supported && firebaseConfig.measurementId) {
            try {
                analytics = getAnalytics(app);
                console.log("Firebase Analytics initialized.");
            } catch (e) {
                console.warn("Analytics initialization error (might be HMR):", e);
            }
        } else {
            console.log("Firebase Analytics not supported or measurementId missing.");
        }
    });
} else {
    console.log("Skipping Analytics initialization (server-side).\n");
}


// --- Firebase Emulator Connections (for local development) ---
// Set NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true in your .env.local file to enable
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
    // Check if running in browser before connecting emulators that might rely on browser features
    // or to avoid redundant connection attempts during SSR vs client hydration.
    // Note: Emulators for Auth, Firestore, Functions are generally safe to connect on server too,
    // but connecting only once on the client might be cleaner depending on setup.
    // Let's connect them conditionally here for consistency with App Check/Analytics.
    if (typeof window !== 'undefined') {
        console.log("Connecting to Firebase Emulators (client-side)...");
        try {
            connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
            console.log("Auth Emulator connected.");
        } catch (error) {
            console.error("Failed to connect Auth Emulator:", error);
        }
        try {
            connectFirestoreEmulator(db, "127.0.0.1", 8080);
            console.log("Firestore Emulator connected.");
        } catch (error) {
            console.error("Failed to connect Firestore Emulator:", error);
        }
        try {
            connectFunctionsEmulator(functions, "127.0.0.1", 5001);
            console.log("Functions Emulator connected.");
        } catch (error) {
            console.error("Failed to connect Functions Emulator:", error);
        }
    }
} else {
     console.log("Not using Firebase Emulators (NODE_ENV:", process.env.NODE_ENV, ", NEXT_PUBLIC_USE_FIREBASE_EMULATORS:", process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS, ")");
}
// --- End Emulator Connections ---


export { app, auth, db, functions, analytics, appCheck, ensureAppCheckInitialized };
