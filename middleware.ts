import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url-pathname', pathname);

  // 1. Isolation stricte anti-indexation : X-Robots-Tag forcé sur toutes les routes /admin et /api/admin
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Pré-filtrage pour les routes privées /admin (hors page de connexion et page 403)
    if (pathname.startsWith('/admin') && pathname !== '/admin/login' && pathname !== '/admin/unauthorized') {
      const sessionCookie = request.cookies.get('kheops_admin_session');

      if (!sessionCookie || !sessionCookie.value) {
        const loginUrl = new URL('/admin/login', request.url);
        const redirectResponse = NextResponse.redirect(loginUrl);
        redirectResponse.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
        return redirectResponse;
      }
    }

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    return response;
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon / apple-icon
     * - images/
     */
    '/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|images/).*)',
  ],
};
