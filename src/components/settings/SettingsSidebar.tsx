// src/components/settings/SettingsSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; // Make sure your utils file is here
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/LanguageContext';

export default function SettingsSidebar() {
    const pathname = usePathname(); // Get current path to highlight active link
    const { t, loading } = useTranslation();
    const { language } = useLanguage();

    if (loading || !t) return null;

    // Define the navigation items - Appearance first
    const navigation = [
        { name: t.settings.sections.appearance, href: `/${language.code}/app/settings/appearance` },
        { name: t.settings.sections.language, href: `/${language.code}/app/settings/language` },
        { name: t.settings.sections.apiKeys, href: `/${language.code}/app/settings/api-key` },
        // Add more settings links here later (e.g., Profile, Billing)
        // { name: 'Profile', href: '/settings/profile' },
    ];

    return (
        // Sidebar container - adjust width/padding as needed
        <aside className="w-full md:w-48 flex-shrink-0 mb-6 md:mb-0 md:pr-4 lg:pr-6" role="complementary" aria-labelledby="settings-navigation-title">
            <h2 id="settings-navigation-title" className="sr-only">Settings Navigation</h2>
            <nav className="flex flex-row space-x-1 md:flex-col md:space-x-0 md:space-y-1" role="navigation" aria-label="Settings sections">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'group flex items-center rounded-md px-3 py-2 text-sm font-medium',
                                isActive
                                    ? 'bg-muted text-foreground' // Active link style (adjusted for potentially better contrast)
                                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground', // Inactive link style (slight transparency on hover bg)
                                'transition-colors duration-150' // Smooth transition
                            )}
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={`${item.name} settings${isActive ? ' (current page)' : ''}`}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
