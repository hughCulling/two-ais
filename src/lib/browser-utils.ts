/**
 * Browser detection utility functions to identify the user's browser.
 * These are used to provide browser-specific recommendations and warnings,
 * particularly for features like Text-to-Speech (TTS) where compatibility varies.
 */

export function isSafariBrowser(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }
    const userAgent = navigator.userAgent.toLowerCase();
    // Safari detection: has 'safari' but not 'chrome' or 'chromium'
    return userAgent.includes('safari') && !userAgent.includes('chrome') && !userAgent.includes('chromium');
}

export function isChromeBrowser(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }
    const userAgent = navigator.userAgent.toLowerCase();
    // Chrome detection: has 'chrome' but not 'edg' (Edge) and not 'opr' (Opera)
    return userAgent.includes('chrome') && !userAgent.includes('edg') && !userAgent.includes('opr');
}

export function isFirefoxBrowser(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('firefox');
}

export function isOperaBrowser(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('opr/') || userAgent.includes('opera/');
}

export function isEdgeBrowser(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('edg/') || userAgent.includes('edge/');
}

/**
 * Detects if the current device is a mobile device (phone, tablet, etc.)
 */
export function isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;
    const userAgent = window.navigator.userAgent;
    return /iphone|ipad|ipod|android|mobile/i.test(userAgent);
}

/**
 * Detects if the current mobile browser likely does not support Browser TTS
 * Based on logic from ChatInterface.tsx
 */
export function isMobileBrowserTTSUnsupported(): boolean {
    if (!isMobileDevice()) return false;

    // Only Firefox on mobile works reliably for Browser TTS in this app
    return !isFirefoxBrowser();
}
