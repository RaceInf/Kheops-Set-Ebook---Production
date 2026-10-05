import type { NextRequest } from 'next/server';
import { OFFICIAL_SITE_URL } from '@/lib/site';

const MAX_BODY_SIZE_BYTES = 8 * 1024; // 8 KB max pour éviter les attaques par payload massif

const ALLOWED_INTERNAL_REDIRECTS = new Set([
  '/merci?ressource=protocole-du-batisseur',
  '/merci',
  '/ebooks',
  '/ebooks/le-capital-du-batisseur',
  '/ebooks/le-code-du-batisseur',
]);

const ALLOWED_EXTERNAL_HOSTS = new Set([
  'fovqbyzx.mychariow.shop',
  'mychariow.shop',
  'chat.whatsapp.com',
  'whatsapp.com',
]);

/**
 * Contrôle rigoureux et tolérant de l'en-tête Origin pour prévenir les CSRF sans bloquer les visiteurs légitimes.
 *
 * RÈGLES FORMELLES :
 * - Si le header Origin est ABSENT : autoriser (ne pas bloquer automatiquement).
 * - En Production : autoriser UNIQUEMENT l'origine exacte https://kheops-set-ebook-mu.vercel.app
 *   (ou l'hôte extrait strictement de NEXT_PUBLIC_SITE_URL).
 *   INTERDICTIONS STRICTES EN PRODUCTION :
 *   - Aucun wildcard *.vercel.app
 *   - Aucun domaine non connecté (kheopsset.com, www.kheopsset.com)
 *   - Aucun autre domaine Vercel arbitraire
 * - En Preview : autoriser uniquement l'URL Preview exacte configurée, aucun wildcard.
 * - En Development : autoriser http://localhost:3000 et http://127.0.0.1:3000.
 */
export function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin || origin.trim() === '') {
    // Si Origin est absent, ne pas bloquer automatiquement (la sécurité repose sur Turnstile, Zod, Rate limit et honeypot)
    return true;
  }

  try {
    const parsedOrigin = new URL(origin.trim().toLowerCase());
    const originHost = parsedOrigin.host;
    const protocol = parsedOrigin.protocol;

    const isProd = process.env.NODE_ENV === 'production';

    if (isProd) {
      // En production, HTTPS strictement obligatoire
      if (protocol !== 'https:') return false;

      // Hôte officiel de production Kheops Set (issu de la constante unique OFFICIAL_SITE_URL)
      const officialProdHost = new URL(OFFICIAL_SITE_URL).host;
      const allowedHosts = new Set<string>([officialProdHost]);

      // Si NEXT_PUBLIC_SITE_URL est défini, extraire son hôte strict
      if (process.env.NEXT_PUBLIC_SITE_URL) {
        try {
          const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL);
          allowedHosts.add(siteUrl.host.toLowerCase());
        } catch {
          // ignore
        }
      }

      // Aucun wildcard *.vercel.app autorisé, aucun domaine externe
      return allowedHosts.has(originHost);
    }

    // En Preview Vercel (si VERCEL_ENV === 'preview')
    if (process.env.VERCEL_ENV === 'preview') {
      const previewAllowedHosts = new Set<string>();
      if (process.env.NEXT_PUBLIC_SITE_URL) {
        try {
          previewAllowedHosts.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).host.toLowerCase());
        } catch {
          // ignore
        }
      }
      if (process.env.VERCEL_URL) {
        try {
          const vercelUrl = process.env.VERCEL_URL.startsWith('http')
            ? process.env.VERCEL_URL
            : `https://${process.env.VERCEL_URL}`;
          previewAllowedHosts.add(new URL(vercelUrl).host.toLowerCase());
        } catch {
          // ignore
        }
      }
      return previewAllowedHosts.has(originHost);
    }

    // En développement local
    if (
      originHost === 'localhost:3000' ||
      originHost === '127.0.0.1:3000' ||
      originHost.endsWith('.run.app')
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Extrait prudemment l'adresse IP cliente dans un contexte proxy/Vercel connu.
 * Ne fait jamais confiance aveuglément à des en-têtes arbitraires.
 */
export function getClientIp(req: NextRequest): string {
  const vercelForwardedFor = req.headers.get('x-vercel-forwarded-for');
  if (vercelForwardedFor) {
    const firstIp = vercelForwardedFor.split(',')[0]?.trim();
    if (firstIp && firstIp.length <= 64) return firstIp;
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp && realIp.trim().length <= 64) {
    return realIp.trim();
  }

  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp && firstIp.length <= 64) return firstIp;
  }

  return '127.0.0.1';
}

/**
 * Lit et parse le JSON d'une requête en vérifiant strictement la taille maximale (8 KB).
 */
export async function parseSafeJsonBody<T = Record<string, unknown>>(
  req: NextRequest
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const contentLengthHeader = req.headers.get('content-length');
    if (contentLengthHeader) {
      const length = Number(contentLengthHeader);
      if (!Number.isNaN(length) && length > MAX_BODY_SIZE_BYTES) {
        return { ok: false, error: 'Payload trop volumineux.' };
      }
    }

    const rawText = await req.text();
    if (!rawText || rawText.trim() === '') {
      return { ok: false, error: 'Corps de requête vide.' };
    }

    if (rawText.length > MAX_BODY_SIZE_BYTES) {
      return { ok: false, error: 'Payload trop volumineux.' };
    }

    const data = JSON.parse(rawText) as T;
    return { ok: true, data };
  } catch {
    return { ok: false, error: 'Format JSON invalide.' };
  }
}

/**
 * Nettoie une chaîne de texte pour neutraliser tout HTML/Script malveillant.
 */
export function sanitizePlainText(input?: string): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // Supprime chevrons
    .replace(/[\u0000-\u001F\u007F]/g, '') // Supprime caractères de contrôle ASCII
    .trim();
}

/**
 * Valide une URL de redirection interne pour interdire les Open Redirects.
 */
export function isAllowedInternalRedirect(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  return ALLOWED_INTERNAL_REDIRECTS.has(url.trim());
}

/**
 * Valide un hôte externe pour interdire les redirections externes non approuvées.
 */
export function isAllowedExternalHost(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_EXTERNAL_HOSTS.has(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export { isAllowedExternalUrl } from '@/lib/safe-url';
