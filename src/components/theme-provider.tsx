// src/components/theme-provider.tsx
"use client"; // Mark this as a Client Component

import * as React from "react";
// *** Import ThemeProvider and its props type directly from 'next-themes' ***
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";
// No need for: import type { ThemeProviderProps } from "next-themes/dist/types";

/**
 * Provides theme context to the application using next-themes.
 * Handles theme switching (light, dark, system) and persistence.
 * @param children - The child components to wrap.
 * @param nonce - Optional nonce for CSP compliance.
 * @param props - Additional props for the NextThemesProvider.
 */
export function ThemeProvider({ children, nonce, ...props }: ThemeProviderProps & { nonce?: string }) {
  return (
    // Pass props like defaultTheme, attribute="class", etc.
    // attribute="class" is the default and works with Tailwind's darkMode: 'class'
    // enableSystem allows the 'system' theme option
    // nonce prop is passed to allow CSP compliance
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      nonce={nonce}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
