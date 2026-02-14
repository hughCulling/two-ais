'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function FaviconSwitcher() {
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        // Select both the standard icon and the shortcut icon links
        const favicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');

        favicons.forEach(favicon => {
            const isAppleIcon = favicon.getAttribute('rel') === 'apple-touch-icon';

            // Determine the path based on the resolved theme
            // Keeping the names exactly as requested/provided
            let iconPath = resolvedTheme === 'dark' ? '/icon-dark-mode.png' : '/icon.png';

            favicon.setAttribute('href', iconPath);
        });
    }, [resolvedTheme]);

    return null;
}
