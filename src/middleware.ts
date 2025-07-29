import { NextRequest, NextResponse } from 'next/server';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only redirect the root path
  if (pathname === '/') {
    const acceptLang = request.headers.get('accept-language') || '';
    const supportedCodes = SUPPORTED_LANGUAGES.map((l) => l.code);
    let matched = 'en';
    if (acceptLang) {
      const langs = acceptLang.split(',').map((l) => l.split(';')[0].trim());
      const found = langs.find((l) => supportedCodes.includes(l));
      if (found) matched = found;
    }
    return NextResponse.redirect(new URL(`/${matched}`, request.url));
  }

  // --- Existing CSP/nonce logic ---
  // Generate a secure random nonce (16 bytes, base64)
  const array = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for environments without Web Crypto
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  const nonce = Buffer.from(array).toString('base64');
  const response = NextResponse.next();

  // Enhanced CSP with nonce-based script security and necessary domains
  const csp = [
    "default-src 'self'",
    `script-src 'nonce-${nonce}' 'unsafe-inline' 'strict-dynamic' https: https://www.googletagmanager.com https://www.google-analytics.com https://www.gstatic.com https://vercel.live https://analytics.vercel.com https://va.vercel-scripts.com https://www.google.com/recaptcha/ https://apis.google.com https://*.firebaseio.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https://img.youtube.com https://i.ytimg.com https://www.google.com/images/ https://storage.googleapis.com https://*.googleapis.com https://oaidalleapiprodscus.blob.core.windows.net",
    "font-src 'self' https://fonts.gstatic.com",
    "media-src 'self' https://storage.googleapis.com",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://analytics.vercel.com https://www.gstatic.com https://firebase.googleapis.com https://content-firebaseappcheck.googleapis.com https://securetoken.googleapis.com https://www.google.com/recaptcha/ https://firestore.googleapis.com https://identitytoolkit.googleapis.com wss://*.firebaseio.com https://us-central1-two-ais.cloudfunctions.net https://firebaseinstallations.googleapis.com",
    "frame-src 'self' https://www.youtube.com https://www.google.com/recaptcha/ https://two-ais.firebaseapp.com https://*.firebaseio.com https://accounts.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    // "require-trusted-types-for 'script'" // Removed Trusted Types directive because not supported by Next.js according to the model I was using on Cursor.
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('x-nonce', nonce);

  return response;
}

export const config = {
  matcher: [
    // Exclude static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}; 