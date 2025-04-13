// src/app/settings/page.tsx
// Protected page for user settings, including API Key Management

'use client'; // Required for hooks like useEffect, useAuth, useRouter

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' for App Router
import { useAuth } from '@/context/AuthContext'; // Adjust path if needed
import ApiKeyManager from '@/components/settings/ApiKeyManager'; // Adjust path if needed

export default function SettingsPage() {
    const { user, loading } = useAuth(); // Get user status and loading state
    const router = useRouter();

    // Effect to handle redirection if user is not logged in
    useEffect(() => {
        // Wait until loading is finished and we know the user status
        if (!loading && !user) {
            // If not loading and no user, redirect to home page (or a login page)
            console.log("SettingsPage: No user found, redirecting...");
            router.push('/'); // Redirect to home page
        }
    }, [user, loading, router]); // Dependencies for the effect

    // Show loading state while checking authentication
    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                <p className="text-gray-500 dark:text-gray-400">Loading settings...</p>
            </main>
        );
    }

    // If user is not logged in (and not loading), render nothing or minimal content
    // while the redirection effect takes place. Returning null is common.
    if (!user) {
        return null; // Or return <p>Redirecting...</p>;
    }

    // If loading is complete and user is logged in, render the settings content
    return (
        <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 pt-16 sm:pt-24"> {/* Added top padding */}
            <div className="w-full max-w-2xl space-y-8"> {/* Wider container for settings */}
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white">
                    Settings
                </h1>

                {/* Render the API Key Manager component */}
                <ApiKeyManager />

                {/* You can add other settings components here later */}
                {/* <UserProfileEditor /> */}
                {/* <BillingSettings /> */}

            </div>
        </main>
    );
}
