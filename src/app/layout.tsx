// src/app/layout.tsx
// Root layout - Updated Metadata for SEO & Reverted Font Handling

import type { Metadata } from "next";
// --- Reverted Font Import ---
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import React from 'react';
import { LanguageProvider } from "@/context/LanguageContext";
import { headers } from 'next/headers';
import PublicHeaderOnLanding from '@/components/PublicHeaderOnLanding';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/theme-provider';

// --- Re-added original font setup ---
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


// --- Updated Metadata (Kept from previous version) ---
export const metadata: Metadata = {
  metadataBase: new URL('https://www.two-ais.com'),
  // Revised title v3 - Uses LLMs
  title: "Two AIs",
  // Revised description v3 - More descriptive, uses LLMs
  description: "Two AIs allows you to listen to conversations between two LLMs (e.g., GPT, Gemini, Claude) using Text-to-Speech (TTS) for an audible AI podcast experience. Requires user API keys.",
  // Optional: Add keywords meta tag if desired, though description is more important
  // keywords: ["AI conversation", "two AIs talking", "LLM chat", "AI podcast generator", "GPT", "Gemini", "Claude", "TTS", "text to speech"],
  icons: {
    // Keep existing icon definitions
    icon: [
      { url: '/icon.png', sizes: 'any', type: 'image/png' },
      { url: '/icon.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/icon.png', // Apple touch icon
  },
  // Optional: Add Open Graph and Twitter Card metadata for better social sharing previews
  openGraph: {
    title: "Two AIs", // Update OG title
    description: "Two AIs allows you to listen to conversations between two LLMs (e.g., GPT, Gemini, Claude) using Text-to-Speech (TTS) for an audible AI podcast experience. Requires user API keys.", 
    url: 'https://www.two-ais.com', // Replace with your actual domain
    siteName: 'Two AIs',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'Two AIs Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Two AIs", // Update Twitter title
    description: "Two AIs allows you to listen to conversations between two LLMs (e.g., GPT, Gemini, Claude) using Text-to-Speech (TTS) for an audible AI podcast experience. Requires user API keys.",
    images: ['/icon.png'],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read the nonce from the request headers
  const nonce = (await headers()).get('x-nonce') || '';

  return (
    <HtmlWithNonce nonce={nonce}>
      <PublicHeaderOnLanding />
      {children}
    </HtmlWithNonce>
  );
}

function HtmlWithNonce({ children, nonce }: { children: React.ReactNode, nonce: string }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* CSP nonce script: only inject if nonce exists */}
        {nonce ? (
          <script
            nonce={nonce}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: `window.__CSP_NONCE__ = "${nonce}";`
            }}
          />
        ) : null}
        {/* Place any other <head> content here if needed */}
      </head>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "min-h-screen font-sans antialiased"
        )}
      >
        <ThemeProvider nonce={nonce}>
          <LanguageProvider>
            {children}
          </LanguageProvider>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
