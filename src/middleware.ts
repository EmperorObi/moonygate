
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a minimal middleware function.
// For now, it just allows the request to proceed.
export function middleware(request: NextRequest) {
  // console.log('Standard minimal middleware running for path:', request.nextUrl.pathname);
  return NextResponse.next();
}

// This is a standard matcher that excludes API routes and common Next.js static assets.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

// Explicitly set the runtime to Node.js.
// This is important if your middleware will eventually use Node.js specific APIs
// (like firebase-admin, which was previously in use and is planned).
export const runtime = 'nodejs';
