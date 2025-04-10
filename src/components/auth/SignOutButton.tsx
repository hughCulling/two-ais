// src/components/auth/SignOutButton.tsx
// Fixed ESLint 'no-explicit-any' errors

'use client'; // This is a client component

import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/clientApp'; // Adjust path as needed

export default function SignOutButton() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignOut = async () => {
        setError(null);
        setLoading(true);

        if (!auth) {
            console.error("Firebase auth not initialized for sign out.");
            setError("Sign out failed: Service unavailable.");
            setLoading(false);
            return;
        }

        try {
            await signOut(auth);
            console.log('Signed out successfully');

        } catch (error: unknown) { // Changed 'any' to 'unknown'
            console.error('Sign out error:', error);
            const message = (error instanceof Error) ? error.message : 'An unknown error occurred.';
            setError(`Failed to sign out: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={handleSignOut}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-offset-gray-800"
            >
                {loading ? 'Signing Out...' : 'Sign Out'}
            </button>
            {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
