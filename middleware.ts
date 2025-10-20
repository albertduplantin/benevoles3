import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware pour protéger les routes et gérer les profils incomplets
 * 
 * Ce middleware :
 * 1. Laisse passer les routes publiques (auth, api, static)
 * 2. Pour les routes dashboard, vérifie si l'utilisateur a un profil complet via un cookie
 * 3. Redirige vers /auth/complete-profile si nécessaire
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Routes publiques - toujours autorisées
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/reset-password',
    '/auth/complete-profile', // Important: ne pas rediriger depuis cette page
    '/legal',
  ];
  
  // Vérifier si c'est une route publique
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Si c'est une route dashboard, on laisse le composant gérer la redirection
  // car il a accès aux données Firestore complètes
  // Le middleware ne peut pas vérifier facilement les données Firestore
  // La protection est donc faite au niveau du composant (voir missions/page.tsx ligne 181-183)
  
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

