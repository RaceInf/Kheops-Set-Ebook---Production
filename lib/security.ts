import type { NextRequest } from 'next/server';

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
 * Lit et parse le JSON d'une requête en vérifiant strictement la taille maximale.
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
    if (rawText.length > MAX_BODY_SIZE_BYTES) {
      return { ok: false, error: 'Payload trop volumineux.' };
    }

    if (!rawText.trim()) {
      return { ok: false, error: 'Requête vide.' };
    }

    const parsed = JSON.parse(rawText) as T;
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return { ok: false, error: 'Format JSON invalide.' };
    }

    return { ok: true, data: parsed };
  } catch {
    return { ok: false, error: 'Format JSON invalide.' };
  }
}

/**
 * Nettoie une chaîne texte pour empêcher toute injection HTML/XSS.
 */
export function sanitizePlainText(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim();
}

/**
 * Vérifie qu'une redirection interne appartient strictement à la liste blanche.
 * Empêche toute vulnérabilité d'Open Redirect.
 */
export function getSafeInternalRedirect(targetPath: string): string {
  if (ALLOWED_INTERNAL_REDIRECTS.has(targetPath)) {
    return targetPath;
  }
  return '/merci?ressource=protocole-du-batisseur';
}

/**
 * Vérifie qu'une URL externe (Chariow / WhatsApp) appartient à la liste blanche.
 */
export function isAllowedExternalUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== 'https:') return false;
    return Array.from(ALLOWED_EXTERNAL_HOSTS).some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}
