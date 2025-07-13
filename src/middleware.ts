import { NextResponse } from 'next/server';

export function middleware() {
  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: [
    // Exclude static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}; 