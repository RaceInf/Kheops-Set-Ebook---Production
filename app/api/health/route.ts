import { NextResponse } from 'next/server';

/**
 * ==============================================================================
 * ROUTE DE MONITORING ET HEALTH CHECK (/api/health)
 * ==============================================================================
 *
 * Sonde publique ultra-légère pour les moniteurs de disponibilité (Vercel, UptimeRobot, BetterStack).
 * Réponse minimisée : aucun secret, aucune information d'infrastructure interne,
 * aucun système sous-jacent divulgué, et aucun appel réseau lourd.
 */

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Content-Type': 'application/json',
      },
    }
  );
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  });
}
