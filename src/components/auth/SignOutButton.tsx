// src/components/auth/SignOutButton.tsx
// Fixed ESLint 'no-explicit-any' errors

'use client'; // This is a client component

import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/clientApp'; // Adjust path as needed
import { useTranslation } from '@/hooks/useTranslation';

interface SignOutButtonProps {
    className?: string;
    onSignOut?: () => void;
}

export default function SignOutButton({ className, onSignOut }: SignOutButtonProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { t, loading: translationLoading } = useTranslation();

    if (translationLoading || !t) return null;

    const handleSignOut = async () => {
        setError(null);
        setLoading(true);

        if (!auth) {
            console.error("Firebase auth not initialized for sign out.");
            setError("Sign out failed: Service unavailable.");
            setLoading(false);
            if (onSignOut) onSignOut(); // Call onSignOut if auth is not available
            return;
        }

        try {
            await signOut(auth);
            console.log('Signed out successfully');
            if (onSignOut) onSignOut(); // Call onSignOut after successful sign out
        } catch (error: unknown) { // Changed 'any' to 'unknown'
            console.error('Sign out error:', error);
            const message = (error instanceof Error) ? error.message : 'An unknown error occurred.';
            setError(`Failed to sign out: ${message}`);
            // Do not call onSignOut here as the user might want to see the error before menu closes
        } finally {
            setLoading(false);
        }
    };

    const defaultButtonClasses = "px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-offset-gray-800";

    return (
        // The wrapper div might not be strictly necessary if className applies directly to the button
        // For now, keeping it to maintain structure, but it could be simplified.
        <div className={className ? undefined : "flex flex-col items-center"}> 
            <button
                onClick={handleSignOut}
                disabled={loading}
                className={className || defaultButtonClasses}
            >
                {loading ? `${t.header.signOut}...` : t.header.signOut}
            </button>
            {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
