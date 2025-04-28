// src/app/layout.tsx
// Root layout - Removed shortcut icon link

import type { Metadata } from "next";
import { AuthProvider } from '@/context/AuthContext';
import { Geist, Geist_Mono } from "next/font/google";
import Header from '@/components/layout/Header';
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Two AIs",
  description: "Listen to AI conversations",
  icons: {
    // Define icon as an array with specific sizes
    icon: [
      { url: '/icon.png', sizes: 'any', type: 'image/png' },
      { url: '/icon.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
    ],
    // *** Removed shortcut link as favicon.ico is being deleted ***
    // shortcut: '/favicon.ico',
    apple: '/icon.png', // Apple touch icon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "min-h-screen font-sans antialiased"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            {children}
            <Analytics />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
