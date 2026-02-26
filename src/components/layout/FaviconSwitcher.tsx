'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function FaviconSwitcher() {
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        // Select only the standard icon link to avoid confusing search bots over fallback icons
        const favicons = document.querySelectorAll('link[rel="icon"]');

        favicons.forEach(favicon => {

            // Determine the path based on the resolved theme
            const iconPath = resolvedTheme === 'dark' ? '/icon-dark-mode.png' : '/icon.png';

            favicon.setAttribute('href', iconPath);
        });
    }, [resolvedTheme]);

    return null;
}
