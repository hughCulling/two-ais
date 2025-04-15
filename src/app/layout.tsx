// src/app/layout.tsx
// Root layout including the shared Header component and ThemeProvider

import type { Metadata } from "next";
import { AuthProvider } from '@/context/AuthContext'; // Adjust path if needed
import { Geist, Geist_Mono } from "next/font/google";
import Header from '@/components/layout/Header'; // Import the Header component
import { ThemeProvider } from "@/components/theme-provider"; // Import the ThemeProvider
import { cn } from "@/lib/utils"; // Import the cn utility
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Add suppressHydrationWarning here as recommended by next-themes
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          // Apply font variables using the cn utility
          geistSans.variable,
          geistMono.variable,
          // Basic body styles - theme provider will handle background via CSS variables
          "min-h-screen font-sans antialiased"
          // Removed hardcoded background colors (bg-gray-50 dark:bg-gray-900)
          // Rely on CSS variables defined in globals.css for theme backgrounds
        )}
      >
        {/* Wrap AuthProvider and the rest with ThemeProvider */}
        <ThemeProvider
          attribute="class" // Tells next-themes to use class strategy
          defaultTheme="system" // Default to system preference
          enableSystem // Enable the 'system' option
          disableTransitionOnChange // Optional: Prevent theme change transitions
        >
          <AuthProvider>
            <Header /> {/* Render the Header component here */}
            {/* The rest of the page content */}
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
