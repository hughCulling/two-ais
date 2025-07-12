// src/app/layout.tsx
// Root layout - Updated Metadata for SEO & Reverted Font Handling

import type { Metadata } from "next";
import { LanguageProvider } from '@/context/LanguageContext';
// --- Reverted Font Import ---
import { Geist, Geist_Mono } from "next/font/google";
import RootHeaderWrapper from '@/components/RootHeaderWrapper';
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://www.two-ais.com" />
        <link
          rel="preload"
          as="image"
          href="/_next/image?url=%2Flanding-dark.webp&w=828&q=75"
          imageSrcSet="/_next/image?url=%2Flanding-dark.webp&w=640&q=75 640w, /_next/image?url=%2Flanding-dark.webp&w=750&q=75 750w, /_next/image?url=%2Flanding-dark.webp&w=828&q=75 828w, /_next/image?url=%2Flanding-dark.webp&w=1080&q=75 1080w, /_next/image?url=%2Flanding-dark.webp&w=1200&q=75 1200w, /_next/image?url=%2Flanding-dark.webp&w=1920&q=75 1920w, /_next/image?url=%2Flanding-dark.webp&w=2048&q=75 2048w, /_next/image?url=%2Flanding-dark.webp&w=3840&q=75 3840w"
          imageSizes="(max-width: 768px) 100vw, 768px"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/_next/image?url=%2Flanding-light.webp&w=828&q=75"
          imageSrcSet="/_next/image?url=%2Flanding-light.webp&w=640&q=75 640w, /_next/image?url=%2Flanding-light.webp&w=750&q=75 750w, /_next/image?url=%2Flanding-light.webp&w=828&q=75 828w, /_next/image?url=%2Flanding-light.webp&w=1080&q=75 1080w, /_next/image?url=%2Flanding-light.webp&w=1200&q=75 1200w, /_next/image?url=%2Flanding-light.webp&w=1920&q=75 1920w, /_next/image?url=%2Flanding-light.webp&w=2048&q=75 2048w, /_next/image?url=%2Flanding-light.webp&w=3840&q=75 3840w"
          imageSizes="(max-width: 768px) 100vw, 768px"
          fetchPriority="low"
        />
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
            <RootHeaderWrapper />
            {children}
            <Footer />
            <Analytics />
            <SpeedInsights />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
