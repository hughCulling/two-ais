// src/components/layout/Header.tsx
// Shared header component with ThemeSwitcher and User Info integrated

'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // Adjust path if needed
import SignOutButton from '@/components/auth/SignOutButton'; // Adjust path if needed
import { ThemeSwitcher } from '@/components/theme-switcher';
import { UserCircle } from 'lucide-react'; // Import an icon for user

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
                        {/* Theme Switcher */}
                        <ThemeSwitcher />

                        {/* --- Auth Status / Links --- */}
                        {loading ? (
                            // Loading Placeholder
                            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        ) : user ? (
                            // Links for logged-in users
                            <>
                                {/* --- Display User Info --- */}
                                <div className="flex items-center space-x-2">
                                    <UserCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline truncate max-w-[100px] md:max-w-[150px]" title={user.email || 'User'}>
                                        {/* Prefer display name, fallback to email */}
                                        {user.displayName || user.email}
                                    </span>
                                </div>
                                {/* --- End User Info --- */}

                                <Link href="/settings" className={navItemClasses}>
                                    Settings
                                </Link>
                                <div className="px-1"> {/* Wrapper to align button padding visually */}
                                    <SignOutButton />
                                </div>
                            </>
                        ) : (
                            // Link for logged-out users
                            <Link href="/login" className={navItemClasses}>
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
