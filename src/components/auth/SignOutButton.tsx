// src/components/auth/SignOutButton.tsx
// Fixed version with null check for auth

'use client'; // This is a client component

import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/clientApp'; // Adjust path as needed

export default function SignOutButton() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null); // Optional: To display sign-out errors

    // Function to handle the sign-out process
    const handleSignOut = async () => {
        setError(null); // Clear previous errors
        setLoading(true); // Indicate loading

        // --- Add check for auth ---
        if (!auth) {
            console.error("Firebase auth not initialized for sign out.");
            setError("Sign out failed: Service unavailable.");
            setLoading(false); // Reset loading state before exiting
            return; // Exit if auth is null
        }
        // --- End check ---

        try {
            // Now safe to pass non-null 'auth'
            await signOut(auth);
            console.log('Signed out successfully');
            // AuthProvider will automatically update the global state

        } catch (err: any) { // Catch any errors during sign-out
            console.error('Sign out error:', err);
            setError('Failed to sign out. Please try again.'); // Set error message
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    // Render the sign-out button
    return (
        <div className="flex flex-col items-center">
            <button
                onClick={handleSignOut}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-offset-gray-800"
            >
                {loading ? 'Signing Out...' : 'Sign Out'}
            </button>
            {/* Optionally display sign-out errors */}
            {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
