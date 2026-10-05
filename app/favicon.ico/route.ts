import { NextResponse } from 'next/server';

/**
 * Gestionnaire pour /favicon.ico
 * Redirige vers /icon généré dynamiquement par Next.js ImageResponse
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  url.pathname = '/icon';
  return NextResponse.redirect(url, { status: 307 });
}
