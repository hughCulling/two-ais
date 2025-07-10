// src/app/layout.tsx
// Root layout - Updated Metadata for SEO & Reverted Font Handling

import type { Metadata } from "next";
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
// --- Reverted Font Import ---
import { Geist, Geist_Mono } from "next/font/google";
import Header from '@/components/layout/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // --- Reverted font application from html tag ---
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://firebase.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebaseinstallations.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://two-ais.firebaseapp.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googleapis.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/landing-light.webp" />
        <link rel="preload" as="image" href="/landing-dark.webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Two AIs",
              "url": "https://www.two-ais.com"
            })
          }}
        />
      </head>
      {/* --- Reverted font application back to body tag using cn() --- */}
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
          <LanguageProvider>
            <AuthProvider>
              <Header />
              {children}
              <Footer />
              <Analytics />
              <SpeedInsights />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
