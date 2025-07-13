import { NextResponse } from 'next/server';

export function middleware() {
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

  response.headers.set(
    'Content-Security-Policy',
    `script-src 'nonce-${nonce}' 'strict-dynamic' https:; object-src 'none'; base-uri 'none';`
  );
  response.headers.set('x-nonce', nonce);

  return response;
}

export const config = {
  matcher: [
    // Exclude static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}; 