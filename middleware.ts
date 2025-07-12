import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function generateNonce(length = 16) {
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function middleware(request: NextRequest) {
  const nonce = generateNonce();
  const response = NextResponse.next();

  // Set the nonce as a cookie (so it can be read in server components)
  response.cookies.set('csp-nonce', nonce, { path: '/' });

  // Set the CSP header with the nonce
  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    object-src 'none';
    base-uri 'self';
    connect-src 'self';
    img-src 'self' data:;
    style-src 'self' 'unsafe-inline';
    font-src 'self';
    frame-ancestors 'none';
    form-action 'self';
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  matcher: [
    // Exclude static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}; 