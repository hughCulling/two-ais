// src/components/layout/HeaderPublic.tsx
'use client';

import Link from 'next/link';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function HeaderPublic() {
    const { t, loading } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (loading || !t) return null;

    const mobileMenuItemClasses = "block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";

    const handleMobileLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50" role="banner">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Home Link */}
                    <div className="flex items-center space-x-4 flex-shrink-0">
                        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-indigo-700 dark:hover:text-indigo-400" aria-label="Go to Two AIs homepage">
                            Two AIs
                        </Link>
                    </div>

                    {/* --- Desktop Navigation & Auth --- */}
                    <div className="hidden md:flex items-center space-x-2 sm:space-x-4" role="group" aria-label="Site controls">
                        {/* Language Selector */}
                        <LanguageSelector showIcon={true} className="flex" />
                        
                        {/* Theme Switcher */}
                        <ThemeSwitcher />

                        {/* --- Auth Links (Desktop) --- */}
                        <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Sign in to your account">
                            Sign In
                        </Link>
                    </div>

                    {/* --- Hamburger Menu Button --- */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-controls="mobile-menu"
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

            {/* --- Mobile Menu Panel --- */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-200 dark:border-gray-700`} id="mobile-menu" role="navigation" aria-label="Mobile navigation menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link href="/login" className={mobileMenuItemClasses} onClick={handleMobileLinkClick} aria-label="Sign in to your account">
                        Sign In
                    </Link>

                    {/* Language Selector for Mobile */}
                    <div className={`${mobileMenuItemClasses} flex items-center justify-between`} role="group" aria-labelledby="mobile-language-label">
                        <span id="mobile-language-label" className="mr-2">Language:</span>
                        <LanguageSelector showIcon={false} />
                    </div>
                    
                    {/* Theme Switcher for Mobile */}
                    <div className={`${mobileMenuItemClasses} flex items-center justify-between`} role="group" aria-labelledby="mobile-theme-label">
                        <span id="mobile-theme-label">Theme</span>
                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
        </header>
    );
} 