// src/app/layout.tsx
// Root layout - Updated Metadata for SEO & Reverted Font Handling

import type { Metadata } from "next";
import { AuthProvider } from '@/context/AuthContext';
// --- Reverted Font Import ---
import { Geist, Geist_Mono } from "next/font/google";
import Header from '@/components/layout/Header';
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
  // Revised title v3 - Uses LLMs
  title: "Two AIs: Audible LLM Conversations",
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
  // openGraph: {
  //   title: "Two AIs: Listen to LLMs Converse & Generate AI Podcasts", // Update OG title
  //   description: "Two AIs allows you to configure and listen to conversations between two LLMs. Enable TTS for an audible AI podcast experience.", // Update OG description
  //   url: 'https://two-ais.com', // Replace with your actual domain
  //   siteName: 'Two AIs',
  //   // images: [ // Add an image URL for previews
  //   //   {
  //   //     url: 'https://two-ais.com/og-image.png', // Replace with your image path
  //   //     width: 1200,
  //   //     height: 630,
  //   //   },
  //   // ],
  //   locale: 'en_US',
  //   type: 'website',
  // },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: "Two AIs: Listen to LLMs Converse & Generate AI Podcasts", // Update Twitter title
  //   description: "Two AIs allows you to configure and listen to conversations between two LLMs. Enable TTS for an audible AI podcast experience.", // Update Twitter description
  //   // images: ['https://two-ais.com/twitter-image.png'], // Replace with your image path
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // --- Reverted font application from html tag ---
    <html lang="en" suppressHydrationWarning>
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
          <AuthProvider>
            <Header />
            {children}
            <Analytics />
            <SpeedInsights />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
