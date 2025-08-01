import { NextResponse } from 'next/server';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';

export async function GET() {
  // TODO: Replace with your actual domain name
  const baseUrl = 'https://www.two-ais.com';

  const pages = [
    '/' // Root redirects to language-prefixed route
  ];

  const sitemapUrls: string[] = [];

  // Add root URL (redirects to language)
  sitemapUrls.push(`${baseUrl}/`);

  // Add language-prefixed root pages and URLs for each page
  SUPPORTED_LANGUAGES.forEach(lang => {
    // Add the localized root page for every language, including 'en'
    sitemapUrls.push(`${baseUrl}/${lang.code}/`);
    pages.forEach(page => {
      if (page === '/') return;
      const url = lang.code === 'en'
        ? `${baseUrl}${page}`
        : `${baseUrl}/${lang.code}${page}`;
      sitemapUrls.push(url);
    });
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapUrls
    .map(
      (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>2025-08-01</lastmod>
  </url>`
    )
    .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 