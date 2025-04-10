// src/app/page.tsx
// Main page component handling authentication status display and forms

'use client';

import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/clientApp';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { useState } from 'react'; // Import useState for sign-out loading/error

// Standard naming convention for the root page component
export default function Page() {
    const { user, loading } = useAuth();
    const [signOutLoading, setSignOutLoading] = useState(false);
    const [signOutError, setSignOutError] = useState<string | null>(null);

    const handleSignOut = async () => {
        setSignOutError(null);
        setSignOutLoading(true);
        if (auth) {
            try {
                await signOut(auth);
                console.log('Signed out successfully');
                // No need to manually update user state, AuthProvider handles it
            } catch (error: any) {
                console.error('Sign out error:', error);
                setSignOutError('Failed to sign out. Please try again.');
            }
        } else {
            console.error("Sign out failed: Firebase auth not initialized.");
            setSignOutError('Sign out failed: Auth service unavailable.');
        }
        setSignOutLoading(false);
    };


    // Loading State UI
    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                {/* Replace with a proper spinner component if desired */}
                <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading...</p>
            </main>
        );
    }

    // Main container for centering content
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-md space-y-6"> {/* Container with max-width and spacing */}

                {/* Authenticated User View */}
                {user ? (
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center space-y-4">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Welcome!
                        </h1>
                        <p className="text-gray-700 dark:text-gray-300">
                            Signed in as: {user.displayName || user.email || 'User'}
                        </p>
                        <button
                            onClick={handleSignOut}
                            disabled={signOutLoading}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-offset-gray-800"
                        >
                            {signOutLoading ? 'Signing Out...' : 'Sign Out'}
                        </button>
                        {signOutError && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{signOutError}</p>}
                    </div>
                ) : (
                    // Unauthenticated User View (Login/Sign Up)
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6">
                         <h1 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                            Sign In or Sign Up
                        </h1>
                        {/* Tabs or Accordion could be used here for better UX */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-medium border-b pb-2 dark:border-gray-700">Sign In</h2>
                            <SignInForm />
                            <GoogleSignInButton />
                        </div>
                         <div className="space-y-4 pt-4 border-t dark:border-gray-700">
                             <h2 className="text-lg font-medium border-b pb-2 dark:border-gray-700">Sign Up</h2>
                            <SignUpForm />
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
