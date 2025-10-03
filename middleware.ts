import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware pour protéger les routes
 * À implémenter en Phase 1 avec l'authentification complète
 */
export function middleware(request: NextRequest) {
  // TODO Phase 1: Implement authentication checks
  // For now, allow all requests
  return NextResponse.next();
}

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

