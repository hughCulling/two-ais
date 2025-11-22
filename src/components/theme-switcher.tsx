// src/components/theme-switcher.tsx
"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from '@/hooks/useTranslation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

/**
 * A component that allows the user to switch between light, dark, and system themes.
 */
export function ThemeSwitcher() {
    // useTheme hook from next-themes
    const { setTheme, theme } = useTheme();
    const { t, loading } = useTranslation();

    if (loading || !t) return null;

    const getCurrentThemeLabel = () => {
        switch (theme) {
            case 'light': return t.settings.appearance.light;
            case 'dark': return t.settings.appearance.dark;
            case 'system': return t.settings.appearance.system;
            default: return t.settings.appearance.system;
        }
    };

    const getThemeIcon = () => {
        switch (theme) {
            case 'light':
                return <Sun className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" aria-hidden="true" />;
            case 'dark':
                return <Moon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" aria-hidden="true" />;
            case 'system':
                return <Monitor className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" aria-hidden="true" />;
            default:
                return <Monitor className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" aria-hidden="true" />;
        }
    };

    return (
        <div className="flex items-center" role="group" aria-label="Theme selector">
            {getThemeIcon()}
            <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger 
                    className="w-[100px] relative justify-center pr-7 [&>span]:flex [&>span]:justify-center [&>span]:overflow-hidden [&>span]:text-ellipsis [&>span]:whitespace-nowrap [&>span]:max-w-[65px] [&>svg:last-child]:absolute [&>svg:last-child]:right-2 [&>svg:last-child]:left-auto" 
                    aria-label={`Current theme: ${getCurrentThemeLabel()}. Click to change theme.`}
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent role="listbox" aria-label="Available themes">
                    <SelectItem 
                        value="light"
                        role="option"
                        aria-label={t.settings.appearance.light}
                        className="justify-center"
                    >
                        <span className="font-medium">{t.settings.appearance.light}</span>
                    </SelectItem>
                    <SelectItem 
                        value="dark"
                        role="option"
                        aria-label={t.settings.appearance.dark}
                        className="justify-center"
                    >
                        <span className="font-medium">{t.settings.appearance.dark}</span>
                    </SelectItem>
                    <SelectItem 
                        value="system"
                        role="option"
                        aria-label={t.settings.appearance.system}
                        className="justify-center"
                    >
                        <span className="font-medium">{t.settings.appearance.system}</span>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
