// src/components/theme-switcher.tsx
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation, TranslationKeys, LanguageCode as AppLanguageCode } from "@/lib/translations";

// Assuming you might use shadcn/ui components, otherwise adapt UI as needed
import { Button } from "@/components/ui/button"; // Adjust path if needed
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Adjust path if needed

/**
 * A component that allows the user to switch between light, dark, and system themes.
 */
export function ThemeSwitcher() {
    // useTheme hook from next-themes
    const { setTheme } = useTheme();
    const { language } = useLanguage();
    const t = getTranslation(language.code as AppLanguageCode) as TranslationKeys;

    return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
            {/* Sun icon shown in light mode, Moon icon in dark mode */}
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
        {/* Menu items to set the theme */}
        <DropdownMenuItem onClick={() => setTheme("light")}>
            {t.settings.appearance.light}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
            {t.settings.appearance.dark}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
            {t.settings.appearance.system}
        </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    );
}
