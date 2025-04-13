// src/app/page.tsx
// Cleaned main page component - Auth forms moved, navigation/sign out handled by Header

'use client';

import { useAuth } from '@/context/AuthContext';
// Auth form components, state, and functions are no longer needed here

export default function Page() {
    const { user, loading } = useAuth();

    // Loading State UI
    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading...</p>
            </main>
        );
    }

    // Main container
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-lg text-center space-y-6"> {/* Slightly wider container */}

                {/* Authenticated User View */}
                {user ? (
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Welcome Back!
                        </h1>
                        <p className="text-gray-700 dark:text-gray-300 break-words">
                            Signed in as: {user.displayName || user.email || 'User'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 pt-4">
                           Ready to make some AIs talk?
                           {/* Core application UI / Link to start conversation will go here */}
                        </p>
                    </div>
                ) : (
                    // Unauthenticated User View - Simple Landing Page Content
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
                         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Welcome to Two AIs
                         </h1>
                         <p className="text-gray-600 dark:text-gray-300">
                           Listen to conversations between distinct AI agents.
                         </p>
                         <p className="text-gray-600 dark:text-gray-300">
                            Please use the link in the header to sign in or create an account.
                         </p>
                         {/* You could add more marketing content or your demo video embed here later */}
                    </div>
                )}
            </div>
        </main>
    );
}
