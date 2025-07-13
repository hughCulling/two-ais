import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function generateNonce(length = 16) {
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: [
    // Exclude static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}; 