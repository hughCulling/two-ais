// src/components/auth/GoogleSignInButton.tsx
// Refined error handling in catch blocks using type guards

'use client';

import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app'; // Import FirebaseError
import { auth, db } from '@/lib/firebase/clientApp';
import { useTranslation } from '@/hooks/useTranslation'; // Added

// Simple SVG Google Icon component
const GoogleIcon = () => (
    <svg className="w-4 h-4 mr-2" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
);

export default function GoogleSignInButton() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { t, loading: translationLoading } = useTranslation();

    if (translationLoading || !t) return null;

    const handleGoogleSignIn = async () => {
        setError(null);
        setLoading(true);

        if (!auth || !db) {
            console.error("Firebase auth or db not initialized.");
            setError(t.auth.errors.initialization);
            setLoading(false);
            return;
        }

        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('Google Sign-In successful (Auth):', user.uid);

            const userDocRef = doc(db, "users", user.uid);
            console.log('Checking Firestore for user document:', user.uid);

            try {
                const userDocSnap = await getDoc(userDocRef);

                if (!userDocSnap.exists()) {
                    console.log('User document not found. Attempting to create...');
                    try {
                        await setDoc(userDocRef, {
                            email: user.email,
                            displayName: user.displayName || '',
                            photoURL: user.photoURL || '',
                            createdAt: serverTimestamp(),
                        });
                        console.log("Firestore document created successfully for new Google user.");
                    } catch (writeError: unknown) { // Catch Firestore write error
                            console.error("Error writing new user document to Firestore:", writeError);
                            const message = (writeError instanceof Error) ? writeError.message : t.auth.errors.unknownGoogleSignInError; // Using a generic fallback
                            setError(`${t.auth.errors.profileSaveFailedPrefix}${message}`);
                    }
                } else {
                    console.log("Existing user document found in Firestore.");
                }
            } catch (firestoreCheckError: unknown) { // Catch Firestore get/set error
                    console.error("Error checking/writing user document in Firestore:", firestoreCheckError);
                    const message = (firestoreCheckError instanceof Error) ? firestoreCheckError.message : t.auth.errors.unknownGoogleSignInError; // Using a generic fallback
                    setError(`${t.auth.errors.profileCheckSaveFailedPrefix}${message}`);
            }

        } catch (authError: unknown) { // Catch Auth popup error
            console.error("Google Sign-In error (Auth):", authError);
            // Check for specific Firebase error codes safely
            if (authError instanceof FirebaseError) {
                 if (authError.code === 'auth/popup-closed-by-user') {
                    console.log('Google Sign-In popup closed by user.');
                    // Optionally set a non-error message or just do nothing
                 } else if (authError.code === 'auth/account-exists-with-different-credential') {
                    setError(t.auth.errors.accountExistsWithDifferentCredential);
                 } else {
                    setError(`${t.auth.errors.googleSignInFailedPrefix}${authError.message}`);
                 }
            } else if (authError instanceof Error) {
                 setError(`${t.auth.errors.googleSignInFailedPrefix}${authError.message}`);
            } else {
                setError(t.auth.errors.unknownGoogleSignInError);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div role="group" aria-labelledby="google-signin-group-label">
            <div id="google-signin-group-label" className="sr-only">Google Sign In Options</div>
            <button 
                onClick={handleGoogleSignIn} 
                disabled={loading} 
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800"
                aria-label={loading ? "Signing in with Google..." : "Sign in with Google account"}
                aria-describedby="google-signin-description"
                aria-busy={loading}
            >
                <GoogleIcon />
                {loading ? t.auth.login.signingIn : t.auth.login.signInWithGoogle}
            </button>
            <div id="google-signin-description" className="sr-only">
                Click to sign in using your Google account. This will open a popup window for Google authentication.
            </div>
            {error && (
                <p className="mt-2 text-xs text-center text-red-600 dark:text-red-400" role="alert" aria-live="assertive">
                    {error}
                </p>
            )}
        </div>
    );
}
