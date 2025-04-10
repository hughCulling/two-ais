// src/components/auth/SignUpForm.tsx
// Fixed ESLint 'no-explicit-any' errors

'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/clientApp';
// import { useRouter } from 'next/navigation';

export default function SignUpForm() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    // const router = useRouter();

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);

        if (!auth || !db) {
            console.error("Firebase auth or db not initialized.");
            setError("Initialization error. Please try again later.");
            setLoading(false);
            return;
        }

        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Signed up successfully (Auth):', user.uid);

            // 2. Attempt to write to Firestore
            console.log('Attempting to write user data to Firestore for UID:', user.uid);
            const userDocRef = doc(db, "users", user.uid);
            try {
                await setDoc(userDocRef, {
                    email: user.email,
                    displayName: user.displayName || '',
                    photoURL: user.photoURL || '',
                    createdAt: serverTimestamp(),
                    // billingModel: 'user_keys', // Example default field
                });
                console.log("Firestore document created successfully.");
            } catch (firestoreError: unknown) { // Changed 'any' to 'unknown'
                console.error("Error writing document to Firestore:", firestoreError);
                const message = (firestoreError instanceof Error) ? firestoreError.message : 'An unknown error occurred.';
                setError(`Account created, but failed to save profile data: ${message}`);
            }

            // router.push('/dashboard');

        } catch (authError: unknown) { // Changed 'any' to 'unknown'
            console.error("Sign up error (Auth):", authError);
            // Check error code cautiously after typing as unknown
            const code = (authError as any)?.code; // Use optional chaining or type assertion
            if (code === 'auth/email-already-in-use') {
                setError('This email address is already registered.');
            } else if (code === 'auth/weak-password') {
                setError('Password should be at least 6 characters long.');
            } else if (code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else {
                 const message = (authError instanceof Error) ? authError.message : 'An unknown error occurred.';
                setError(`Failed to sign up: ${message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- Render the form (JSX remains the same) ---
    return (
        <form onSubmit={handleSignUp} className="space-y-4">
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <div>
                <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                <input type="email" id="email-signup" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" placeholder="you@example.com" />
            </div>
            <div>
                <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password (min. 6 characters)</label>
                <input type="password" id="password-signup" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" placeholder="Password" />
            </div>
            <div>
                <label htmlFor="confirm-password-signup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                <input type="password" id="confirm-password-signup" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} autoComplete="new-password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" placeholder="Confirm Password" />
            </div>
            <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-offset-gray-800">
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </div>
        </form>
    );
}
