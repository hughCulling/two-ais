import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Replace with your actual domain name
  const baseUrl = 'https://www.two-ais.com';

  const pages = [
    `${baseUrl}/`,
    `${baseUrl}/login`,
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${pages
    .map(
      (url) => `\n    <url>\n      <loc>${url}</loc>\n    </url>\n  `
    )
    .join('')}\n</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 