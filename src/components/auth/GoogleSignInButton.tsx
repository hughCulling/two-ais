// src/components/auth/GoogleSignInButton.tsx
// Fixed ESLint 'no-explicit-any' and 'no-unused-vars' errors

'use client'; // This is a client component

import { useState } from 'react';
// Removed unused 'User' type import
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// Removed unused 'Firestore' type import
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/clientApp'; // Adjust path as needed

// Simple SVG Google Icon component
const GoogleIcon = () => (
    <svg className="w-4 h-4 mr-2" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
);

export default function GoogleSignInButton() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        setError(null);
        setLoading(true);

        if (!auth || !db) {
            console.error("Firebase auth or db not initialized.");
            setError("Initialization error. Please try again later.");
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
                            // billingModel: 'user_keys',
                        });
                        console.log("Firestore document created successfully for new Google user.");
                    } catch (writeError: unknown) { // Changed 'any' to 'unknown'
                            console.error("Error writing new user document to Firestore:", writeError);
                            const message = (writeError instanceof Error) ? writeError.message : 'An unknown error occurred.';
                            setError(`Signed in, but failed to save profile data: ${message}`);
                    }
                } else {
                    console.log("Existing user document found in Firestore.");
                }
            } catch (firestoreCheckError: unknown) { // Changed 'any' to 'unknown'
                    console.error("Error checking/writing user document in Firestore:", firestoreCheckError);
                    const message = (firestoreCheckError instanceof Error) ? firestoreCheckError.message : 'An unknown error occurred.';
                    setError(`Signed in, but failed to check/save profile data: ${message}`);
            }

        } catch (authError: unknown) { // Changed 'any' to 'unknown'
            console.error("Google Sign-In error (Auth):", authError);
            // Check error code cautiously after typing as unknown
            const code = (authError as any)?.code; // Use optional chaining or type assertion
            if (code === 'auth/popup-closed-by-user') {
                console.log('Google Sign-In popup closed by user.');
            } else if (code === 'auth/account-exists-with-different-credential') {
                setError('An account already exists with this email using a different sign-in method.');
            } else {
                setError('Failed to sign in with Google. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800">
                <GoogleIcon />
                {loading ? 'Signing In...' : 'Sign In with Google'}
            </button>
            {error && <p className="mt-2 text-xs text-center text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
