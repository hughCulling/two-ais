// src/app/layout.tsx
// Root layout - Updated Metadata for SEO & Reverted Font Handling

// --- Reverted Font Import ---
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "../globals.css";
import React from 'react';
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { headers } from 'next/headers';
import PublicHeaderOnLanding from '@/components/PublicHeaderOnLanding';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/theme-provider';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';
import { getTranslationAsync } from '@/lib/translations';
import { Toaster } from '@/components/ui/toaster';
import { FaviconSwitcher } from '@/components/layout/FaviconSwitcher';

// --- Re-added original font setup ---
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Dynamic metadata for i18n
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = await getTranslationAsync(lang);
  // Fallbacks if translation keys are missing
  const title = t?.header?.appName || 'Two AIs';
  const description = t?.page_WelcomeSubtitle ||
    'This website lets you listen to conversations between two Large Language Models (LLMs) using Text-to-Speech (TTS).';
  return {
    metadataBase: new URL('https://www.two-ais.com'),
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.two-ais.com/${lang}`,
      siteName: 'Two AIs',
      images: [
        {
          url: `https://www.two-ais.com/icon.png`, // Absolute URL
          width: 512,
          height: 512,
          alt: 'Two AIs Logo',
        },
      ],
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://www.two-ais.com/icon.png`], // Absolute URL
    },
  };
}

// Accept params in the layout
export default async function RootLayout({ children, params }: { children: React.ReactNode, params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const nonce = (await headers()).get('x-nonce') || '';
  const t = await getTranslationAsync(lang);
  const title = t?.header?.appName || 'Two AIs';
  const description = t?.page_WelcomeSubtitle ||
    'This website lets you listen to conversations between two Large Language Models (LLMs) using Text-to-Speech (TTS).';

  return (
    <HtmlWithNonce nonce={nonce} lang={lang} title={title} description={description}>
      <PublicHeaderOnLanding />
      {children}
    </HtmlWithNonce>
  );
}

// Add lang and hreflang logic
function HtmlWithNonce({ children, nonce, lang, title, description }: { children: React.ReactNode, nonce: string, lang: string, title: string, description: string }) {
  // Generate alternate links for all supported languages
  const baseUrl = 'https://www.two-ais.com';
  const alternates = SUPPORTED_LANGUAGES.map(l => {
    const href = l.code === 'en' ? `${baseUrl}` : `${baseUrl}/${l.code}`;
    return <link key={l.code} rel="alternate" href={href} hrefLang={l.code} />;
  });
  // Add x-default for best practice
  alternates.push(<link key="x-default" rel="alternate" href={baseUrl} hrefLang="x-default" />);

  return (
    <html lang={lang} suppressHydrationWarning>
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
        {/* Canonical URL - includes language code for all languages including English */}
        <link
          rel="canonical"
          href={`${baseUrl}/${lang}`}
        />
        {alternates}
        {/* Favicon declarations for better Bing compatibility */}
        <link rel="icon" type="image/png" href="/icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="description" content={description} />
        <script
          type="application/ld+json"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": title,
              "url": `https://www.two-ais.com/${lang}`,
              "description": description,
              "publisher": {
                "@type": "Person",
                "name": "Hugh Wilfred Culling",
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareSourceCode",
              "name": "Two AIs",
              "url": "https://www.two-ais.com/"
            })
          }}
        />
        <script
          type="application/ld+json"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Two AIs",
              "operatingSystem": "All",
              "applicationCategory": "WebApplication",
              "description": "This website lets you listen to conversations between two Large Language Models (LLMs) using Text-to-Speech (TTS).",
              "url": "https://www.two-ais.com/",
              "image": "https://www.two-ais.com/icon.png",
              "offers": {
                "@type": "Offer",
                "price": 0,
                "priceCurrency": "USD"
              }
            })
          }}
        />
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
          <FaviconSwitcher />
          <div className="flex flex-col min-h-screen">
            <LanguageProvider lang={lang}>
              <AuthProvider>
                <main className="flex-grow">
                  {children}
                </main>
              </AuthProvider>
            </LanguageProvider>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
