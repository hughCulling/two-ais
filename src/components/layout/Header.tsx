// src/components/layout/Header.tsx
// Shared header component with ThemeSwitcher integrated

'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // Adjust path if needed
import SignOutButton from '@/components/auth/SignOutButton'; // Adjust path if needed
import { ThemeSwitcher } from '@/components/theme-switcher'; // *** 1. Import ThemeSwitcher ***

export default function Header() {
    const { user, loading } = useAuth();

    // Common classes for navigation links/buttons for easier clicking
    const navItemClasses = "px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Home Link */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-indigo-700 dark:hover:text-indigo-400">
                            Two AIs
                        </Link>
                    </div>

                    {/* Right-aligned Navigation Links and Auth Status */}
                    <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
                            {/* *** 2. Add ThemeSwitcher here *** */}
                            <ThemeSwitcher />

                        {/* --- Auth Status / Links --- */}
                        {loading ? (
                            // Loading Placeholder
                            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        ) : user ? (
                            // Links for logged-in users
                            <>
                                <Link href="/settings" className={navItemClasses}>
                                    Settings
                                </Link>
                                <div className="px-1"> {/* Wrapper to align button padding visually */}
                                    <SignOutButton />
                                </div>
                            </>
                        ) : (
                            // Link for logged-out users - NOW POINTS TO /login
                            <Link href="/login" className={navItemClasses}>
                                Sign In
                            </Link>
                            // You could add a separate Sign Up link here too if desired
                            // <Link href="/signup" className={navItemClasses}>Sign Up</Link>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
