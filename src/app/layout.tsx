// src/app/layout.tsx
// Root layout including the shared Header component

import type { Metadata } from "next";
import { AuthProvider } from '@/context/AuthContext'; // Adjust path if needed
import { Geist, Geist_Mono } from "next/font/google";
import Header from '@/components/layout/Header'; // Import the Header component
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
    <html lang="en">
      {/* Apply font variables to html or body */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900`}> {/* Added default background */}
        <AuthProvider>
          <Header /> {/* Render the Header component here */}
          {/* The rest of the page content will be rendered below the header */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

