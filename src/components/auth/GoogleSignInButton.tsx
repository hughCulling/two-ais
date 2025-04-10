// src/components/auth/GoogleSignInButton.tsx
// Component for initiating Google Sign-In flow - with null checks for auth/db

'use client'; // This is a client component

import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, Firestore } from 'firebase/firestore'; // Import Firestore type if needed for clarity
import { auth, db } from '@/lib/firebase/clientApp'; // Adjust path as needed

// Simple SVG Google Icon component
const GoogleIcon = () => (
    <svg className="w-4 h-4 mr-2" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
);

export default function GoogleSignInButton() {
    // State for loading status and error messages
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Function to handle the Google Sign-In process
    const handleGoogleSignIn = async () => {
        setError(null); // Clear previous errors
        setLoading(true); // Set loading state

        // --- Add checks for auth and db ---
        if (!auth || !db) {
            console.error("Firebase auth or db not initialized.");
            setError("Initialization error. Please try again later.");
            setLoading(false);
            return; // Exit if auth or db is null
        }
        // --- End checks ---

        // Create a new instance of the GoogleAuthProvider
        const provider = new GoogleAuthProvider();

        try {
            // 1. Sign In with Google Popup - Now safe to pass non-null 'auth'
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('Google Sign-In successful (Auth):', user.uid);

            // 2. Check/Write Firestore Document - Now safe to pass non-null 'db'
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
                    } catch (writeError: any) {
                            console.error("Error writing new user document to Firestore:", writeError);
                            setError(`Signed in, but failed to save profile data: ${writeError.message}`);
                    }
                } else {
                    console.log("Existing user document found in Firestore.");
                    // Optionally update existing data if needed:
                    // await setDoc(userDocRef, { photoURL: user.photoURL }, { merge: true });
                }
            } catch (firestoreCheckError: any) {
                    console.error("Error checking/writing user document in Firestore:", firestoreCheckError);
                    setError(`Signed in, but failed to check/save profile data: ${firestoreCheckError.message}`);
            }

            // Optional: Redirect user
            // router.push('/dashboard');

        } catch (authError: any) { // Catch errors during Google Sign In Popup
            console.error("Google Sign-In error (Auth):", authError);
            if (authError.code === 'auth/popup-closed-by-user') {
                console.log('Google Sign-In popup closed by user.');
            } else if (authError.code === 'auth/account-exists-with-different-credential') {
                setError('An account already exists with this email using a different sign-in method.');
            } else {
                setError('Failed to sign in with Google. Please try again later.');
            }
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    // --- Render the button (JSX remains the same) ---
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
