import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Isolation stricte anti-indexation : X-Robots-Tag forcé sur toutes les routes /admin et /api/admin
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  }

  // 2. Pré-filtrage pour les routes privées /admin (hors page de connexion et page 403)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && pathname !== '/admin/unauthorized') {
    const sessionCookie = request.cookies.get('kheops_admin_session');

    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL('/admin/login', request.url);
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
      return redirectResponse;
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
