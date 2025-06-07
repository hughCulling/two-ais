// src/components/layout/Header.tsx
// Shared header component with ThemeSwitcher and User Info integrated

'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // Adjust path if needed
import SignOutButton from '@/components/auth/SignOutButton'; // Adjust path if needed
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import { UserCircle, Menu, X } from 'lucide-react'; // Import an icon for user
import { useState } from 'react'; // Import useState

export default function Header() {
    const { user, loading } = useAuth();
    const t = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

    // Common classes for navigation links/buttons for easier clicking
    const navItemClasses = "px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
    const mobileMenuItemClasses = "block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";


    const handleMobileLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Home Link */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-indigo-700 dark:hover:text-indigo-400">
                            {t.header.appName}
                        </Link>
                    </div>

                    {/* --- Desktop Navigation & Auth --- */}
                    <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
                        {/* Language Selector */}
                        <LanguageSelector showIcon={true} className="flex" />
                        
                        {/* Theme Switcher */}
                        <ThemeSwitcher />

                        {/* --- Auth Status / Links (Desktop) --- */}
                        {loading ? (
                            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        ) : user ? (
                            <>
                                <div className="flex items-center space-x-2">
                                    <UserCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline truncate max-w-[100px] md:max-w-[150px]" title={user.email || 'User'}>
                                        {user.displayName || user.email}
                                    </span>
                                </div>
                                <Link href="/settings" className={navItemClasses}>
                                    {t.header.settings}
                                </Link>
                                <div className="px-1">
                                    <SignOutButton />
                                </div>
                            </>
                        ) : (
                            <Link href="/login" className={navItemClasses}>
                                {t.header.signIn}
                            </Link>
                        )}
                    </div>

                    {/* --- Hamburger Menu Button --- */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-controls="mobile-menu"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- Mobile Menu Panel --- */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-200 dark:border-gray-700`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {loading ? (
                        <div className="block px-3 py-2">
                            <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                            <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                    ) : user ? (
                        <>
                            <div className="px-3 py-2 flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                                <UserCircle className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                                <div>
                                    <span className="block text-base font-medium text-gray-900 dark:text-white truncate max-w-[180px]" title={user.email || 'User'}>
                                        {user.displayName || user.email}
                                    </span>
                                </div>
                            </div>
                            <Link href="/settings" className={mobileMenuItemClasses} onClick={handleMobileLinkClick}>
                                Settings {/* {t.header.settings} */}
                            </Link>
                        </>
                    ) : (
                        <Link href="/login" className={mobileMenuItemClasses} onClick={handleMobileLinkClick}>
                            Sign In {/* {t.header.signIn} */}
                        </Link>
                    )}

                    {/* Language Selector for Mobile */}
                    <div className={`${mobileMenuItemClasses} flex items-center justify-between`}>
                        <span className="mr-2">Language:</span> {/* Hardcoded Label */}
                        <LanguageSelector showIcon={false} />
                    </div>
                    
                    {/* Theme Switcher for Mobile */}
                    <div className={`${mobileMenuItemClasses} flex items-center justify-between`}>
                        <span>Theme</span> {/* Hardcoded Label */}
                        <ThemeSwitcher />
                    </div>

                    {user && !loading && (
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                             <SignOutButton className={mobileMenuItemClasses + " w-full text-left"} onSignOut={handleMobileLinkClick} />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
