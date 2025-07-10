// src/components/layout/HeaderPublic.tsx
'use client';

import Link from 'next/link';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';

export default function HeaderPublic() {
    const t = useTranslation();
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4 flex-shrink-0">
                        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-indigo-700 dark:hover:text-indigo-400">
                            {t.header.appName}
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
                        <LanguageSelector showIcon={true} className="flex" />
                        <ThemeSwitcher />
                        <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                            {t.header.signIn}
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
} 