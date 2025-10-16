// src/components/theme-switcher.tsx
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from '@/hooks/useTranslation';

// Assuming you might use shadcn/ui components, otherwise adapt UI as needed
import { Button } from "@/components/ui/button"; // Adjust path if needed
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Adjust path if needed

interface ThemeSwitcherProps {
    id?: string;
}

/**
 * A component that allows the user to switch between light, dark, and system themes.
 */
export function ThemeSwitcher({ id }: ThemeSwitcherProps) {
    // useTheme hook from next-themes
    const { setTheme, theme } = useTheme();
    const { t, loading } = useTranslation();

    if (loading || !t) return null;

    // Create unique ID for this instance
    const uniqueId = id ? `theme-switcher-description-${id}` : 'theme-switcher-description';

    const getCurrentThemeLabel = () => {
        switch (theme) {
            case 'light': return t.settings.appearance.light;
            case 'dark': return t.settings.appearance.dark;
            case 'system': return t.settings.appearance.system;
            default: return 'Theme';
        }
    };

    return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button 
            variant="outline" 
            size="icon"
            aria-label={`Current theme: ${getCurrentThemeLabel()}. Click to change theme.`}
            aria-haspopup="menu"
            aria-expanded={false}
            // aria-describedby={uniqueId}
        >
            {/* Sun icon shown in light mode, Moon icon in dark mode */}
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden="true" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden="true" />
            <span className="sr-only">Toggle theme</span>
        </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
            align="end"
            role="menu"
            aria-label="Theme options"
            aria-describedby={uniqueId}
        >
        {/* Menu items to set the theme */}
        <DropdownMenuItem 
            onClick={() => setTheme("light")}
            role="menuitem"
            aria-label={`Switch to ${t.settings.appearance.light} theme`}
        > 
            {t.settings.appearance.light}
        </DropdownMenuItem>
        <DropdownMenuItem 
            onClick={() => setTheme("dark")}
            role="menuitem"
            aria-label={`Switch to ${t.settings.appearance.dark} theme`}
        > 
            {t.settings.appearance.dark}
        </DropdownMenuItem>
        <DropdownMenuItem 
            onClick={() => setTheme("system")}
            role="menuitem"
            aria-label={`Switch to ${t.settings.appearance.system} theme`}
        > 
            {t.settings.appearance.system}
        </DropdownMenuItem>
        </DropdownMenuContent>
        <div id={uniqueId} className="sr-only">
            Theme switcher. Choose between light, dark, or system theme. System theme automatically matches your operating system preference.
        </div>
    </DropdownMenu>
    );
}
