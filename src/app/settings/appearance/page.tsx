// src/app/settings/appearance/page.tsx
// Page specifically for appearance settings

'use client'; // ThemeSwitcher requires client component

import { ThemeSwitcher } from '@/components/theme-switcher'; // Adjust path if needed

export default function AppearancePage() {
    return (
            // Container for this page's content - uses card style
        <div className="space-y-6 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="space-y-1.5">
                    <h1 className="text-2xl font-semibold leading-none tracking-tight">
                        Appearance
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Customize the look and feel of the application.
                    </p>
            </div>

            {/* Theme setting row */}
            <div className="flex items-center justify-between rounded-md border p-4">
                    <span className="font-medium">Theme</span>
                    <ThemeSwitcher />
            </div>

            {/* Add other appearance settings later if needed */}
        </div>
    );
}
