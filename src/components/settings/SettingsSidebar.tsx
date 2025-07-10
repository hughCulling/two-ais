// src/components/settings/SettingsSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; // Make sure your utils file is here
import { useTranslation } from '@/hooks/useTranslation';

export default function SettingsSidebar() {
    const pathname = usePathname(); // Get current path to highlight active link
    const t = useTranslation();

    // Define the navigation items - Appearance first
    const navigation = [
        { name: t.settings.sections.appearance, href: '/app/settings/appearance' },
        { name: t.settings.sections.language, href: '/app/settings/language' },
        { name: t.settings.sections.apiKeys, href: '/app/settings/api-keys' },
        // Add more settings links here later (e.g., Profile, Billing)
        // { name: 'Profile', href: '/settings/profile' },
    ];

    return (
        // Sidebar container - adjust width/padding as needed
        <aside className="w-full md:w-48 flex-shrink-0 mb-6 md:mb-0 md:pr-4 lg:pr-6">
            <nav className="flex flex-row space-x-1 md:flex-col md:space-x-0 md:space-y-1">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            'group flex items-center rounded-md px-3 py-2 text-sm font-medium',
                            pathname === item.href
                                ? 'bg-muted text-foreground' // Active link style (adjusted for potentially better contrast)
                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground', // Inactive link style (slight transparency on hover bg)
                            'transition-colors duration-150' // Smooth transition
                        )}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
