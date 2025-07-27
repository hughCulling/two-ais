// src/app/layout.tsx
// Root layout - Updated Metadata for SEO & Reverted Font Handling

// --- Reverted Font Import ---
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "../globals.css";
import React from 'react';
import { LanguageProvider } from "@/context/LanguageContext";
import { headers } from 'next/headers';
import PublicHeaderOnLanding from '@/components/PublicHeaderOnLanding';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/theme-provider';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';
import { getTranslationAsync } from '@/lib/translations';

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
// export const metadata: Metadata = {
//   metadataBase: new URL('https://www.two-ais.com'),
//   // Revised title v3 - Uses LLMs
//   title: "Two AIs",
//   // Revised description v3 - More descriptive, uses LLMs
//   description: "Two AIs allows you to listen to conversations between two LLMs (e.g., GPT, Gemini, Claude) using Text-to-Speech (TTS) for an audible AI podcast experience. Requires user API keys.",
//   // Optional: Add keywords meta tag if desired, though description is more important
//   // keywords: ["AI conversation", "two AIs talking", "LLM chat", "AI podcast generator", "GPT", "Gemini", "Claude", "TTS", "text to speech"],
//   icons: {
//     // Keep existing icon definitions
//     icon: [
//       { url: '/icon.png', sizes: 'any', type: 'image/png' },
//       { url: '/icon.png', sizes: '16x16', type: 'image/png' },
//       { url: '/icon.png', sizes: '32x32', type: 'image/png' },
//     ],
//     apple: '/icon.png', // Apple touch icon
//   },
//   // Optional: Add Open Graph and Twitter Card metadata for better social sharing previews
//   openGraph: {
//     title: "Two AIs", // Update OG title
//     description: "Two AIs allows you to listen to conversations between two LLMs (e.g., GPT, Gemini, Claude) using Text-to-Speech (TTS) for an audible AI podcast experience. Requires user API keys.", 
//     url: 'https://www.two-ais.com', // Replace with your actual domain
//     siteName: 'Two AIs',
//     images: [
//       {
//         url: '/icon.png',
//         width: 512,
//         height: 512,
//         alt: 'Two AIs Logo',
//       },
//     ],
//     locale: 'en_US',
//     type: 'website',
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: "Two AIs", // Update Twitter title
//     description: "Two AIs allows you to listen to conversations between two LLMs (e.g., GPT, Gemini, Claude) using Text-to-Speech (TTS) for an audible AI podcast experience. Requires user API keys.",
//     images: ['/icon.png'],
//   },
// };

// Dynamic metadata for i18n
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = await getTranslationAsync(lang);
  // Fallbacks if translation keys are missing
  const title = t?.header?.appName || 'Two AIs';
  const description = t?.page_WelcomeSubtitle ||
    'This website lets you listen to conversations between two Large Language Models (LLMs) and generate images for each turn.';
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
    'This website lets you listen to conversations between two Large Language Models (LLMs) and generate images for each turn.';

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
        {alternates}
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
              "description": "This website lets you listen to conversations between two Large Language Models (LLMs) and generate images for each turn.",
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
          <div className="flex flex-col min-h-screen">
            <LanguageProvider lang={lang}>
              <main className="flex-grow">
                {children}
              </main>
            </LanguageProvider>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
