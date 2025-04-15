// src/app/settings/layout.tsx
// Layout for all settings pages, includes sidebar and handles auth protection

'use client'; // Need client hooks for auth check and redirect

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Adjust path if needed
import SettingsSidebar from '@/components/settings/SettingsSidebar'; // Adjust path if needed

export default function SettingsLayout({
    children, // Will be the specific settings page component
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth(); // Get user and loading state
    const router = useRouter();

    // Effect to handle redirection if user is not logged in
    useEffect(() => {
    // Wait until loading is finished and we know the user status
    if (!loading && !user) {
        // If not loading and no user, redirect to home page (or login)
        console.log("SettingsLayout: No user found, redirecting...");
        router.push('/'); // Redirect to home page
    }
    }, [user, loading, router]); // Dependencies for the effect

    // While loading authentication state, show a loading indicator
    if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-gray-500 dark:text-gray-400">Loading settings...</p>
        </div>
    );
    }

    // If user is not logged in (and not loading), render nothing
    // while the redirect effect takes place.
    if (!user) {
    return null; // Or return <p>Redirecting...</p>;
    }

    // If loading is complete AND user is logged in, render the layout + page content
    return (
    <div className="container mx-auto flex max-w-5xl flex-col p-4 pt-16 md:flex-row md:p-8 md:pt-24">
        <SettingsSidebar />
        <main className="flex-1 md:pl-6 w-full">
        {children} {/* Render the actual settings page */}
        </main>
    </div>
    );
}
