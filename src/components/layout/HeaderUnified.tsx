// src/components/layout/HeaderUnified.tsx
// Unified header component for both public and authenticated routes

'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import SignOutButton from '@/components/auth/SignOutButton';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import { UserCircle, Menu, X, Settings } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname } from 'next/navigation';

export default function HeaderUnified() {
    const { user, loading: authLoading } = useAuth();
    const { t, loading } = useTranslation();
    const { language } = useLanguage();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (loading || !t) return null;

    // Menu item styles - centered for dropdown menu
    const mobileMenuItemClasses = "block px-4 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-center";

    const handleMobileLinkClick = () => {
        setIsMenuOpen(false);
    };

    // Determine if we're on an app route
    const isAppRoute = pathname?.startsWith(`/${language.code}/app`);
    const homeLink = isAppRoute ? `/${language.code}/app` : `/${language.code}`;
    const appName = t.header.appName || 'Two AIs';

    return (
        <>
            {/* Backdrop overlay - dims the page when menu is open */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            <header className="bg-white dark:bg-gray-800 shadow-md relative z-50">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative flex items-center justify-center h-16">
                        {/* Centered Logo/Home Link */}
                        <Link 
                            href={homeLink} 
                            className="text-xl font-bold text-gray-900 dark:text-white hover:text-indigo-700 dark:hover:text-indigo-400" 
                            aria-label={isAppRoute ? "Go to Two AIs application" : "Go to Two AIs homepage"}
                        >
                            {appName}
                        </Link>

                        {/* Hamburger Menu Button - Always visible, positioned on right */}
                        <div className="absolute right-0 flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                aria-controls="main-menu"
                                aria-expanded={isMenuOpen}
                                aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
                            >
                                <span className="sr-only">{isMenuOpen ? "Close main menu" : "Open main menu"}</span>
                                {isMenuOpen ? (
                                    <X className="block h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Menu className="block h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </nav>

                {/* --- Menu Panel - Dropdown positioned at top-right --- */}
                <div className={`${isMenuOpen ? 'block' : 'hidden'} absolute top-full right-4 w-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md mt-2`} id="main-menu" aria-label="Main navigation menu">
                <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col items-center">
                    {authLoading ? (
                        <div className="block px-3 py-2" role="status" aria-live="polite">
                            <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" aria-hidden="true"></div>
                            <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" aria-hidden="true"></div>
                        </div>
                    ) : user ? (
                        <>
                            <div className="px-4 py-2 flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 mb-2" role="group" aria-label="User information">
                                <UserCircle className="h-8 w-8 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                                <div className="flex-1 min-w-0">
                                    <span className="block text-base font-medium text-gray-900 dark:text-white truncate" title={user.email || 'User'} aria-label={`Signed in as ${user.displayName || user.email}`}>
                                        {user.displayName || user.email}
                                    </span>
                                </div>
                            </div>
                            <Link href={`/${language.code}/app/history`} className={mobileMenuItemClasses} onClick={handleMobileLinkClick} aria-label="View previous conversations">
                                <span className="flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{t.header.previousChats}</span>
                            </Link>
                            <Link href={`/${language.code}/app/settings`} className={mobileMenuItemClasses} onClick={handleMobileLinkClick} aria-label="Go to settings">
                                <span className="flex items-center justify-center"><Settings className="h-4 w-4 mr-1" aria-hidden="true" />Settings</span>
                            </Link>
                        </>
                    ) : (
                        <Link href={`/${language.code}/login`} className={mobileMenuItemClasses} onClick={handleMobileLinkClick} aria-label="Sign in to your account">
                            {t.header.signIn}
                        </Link>
                    )}

                    {/* Language Selector */}
                    <div className="px-4 py-2 flex items-center justify-center" role="group" aria-label="Language selector">
                        <LanguageSelector showIcon={true} />
                    </div>

                    {/* Theme Switcher */}
                    <div className="px-4 py-2 flex items-center justify-center" role="group" aria-label="Theme switcher">
                        <ThemeSwitcher />
                    </div>

                    {user && !authLoading && (
                        <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                            <SignOutButton className={mobileMenuItemClasses} onSignOut={handleMobileLinkClick} />
                        </div>
                    )}
                </div>
            </div>
        </header>
        </>
    );
}
