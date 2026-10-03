import { publicEnv } from '@/lib/env/public';

/**
 * ==============================================================================
 * PROTECTION CONTRE LES OPEN REDIRECTS & VALIDATION DES URLS PUBLIQUES
 * ==============================================================================
 *
 * RÈGLE ABSOLUE :
 * Aucune redirection vers une URL fournie librement par l'utilisateur n'est autorisée.
 * Seules les URLs configurées et les domaines officiels strictement autorisés sont valides.
 */

const ALLOWED_EXTERNAL_HOSTNAMES = new Set([
  'fovqbyzx.mychariow.shop',
  'mychariow.shop',
  'chat.whatsapp.com',
  'whatsapp.com',
  'facebook.com',
  'www.facebook.com',
  'instagram.com',
  'www.instagram.com',
  'drive.google.com',
]);

const ALLOWED_INTERNAL_PATHS = new Set([
  '/',
  '/ebooks',
  '/ebooks/le-capital-du-batisseur',
  '/ebooks/le-code-du-batisseur',
  '/ressource-gratuite',
  '/a-propos',
  '/faq',
  '/contact',
  '/merci',
  '/merci?ressource=protocole-du-batisseur',
  '/mentions-legales',
  '/confidentialite',
  '/conditions',
  '/remboursement',
]);

/**
 * Valide qu'une URL externe est sécurisée :
 * - Protocole HTTPS obligatoire en production
 * - Domaines appartenant strictement à la liste blanche
 * - Rejet absolu de javascript:, data:, file:, vbscript:
 * - Rejet absolu des adresses IP locales ou privées
 */
export function isAllowedExternalUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();

  // Interdictions formelles
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:') ||
    lower.startsWith('vbscript:')
  ) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);

    // En production, HTTPS est obligatoire
    if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
      return false;
    }

    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();

    // Refuser localhost et adresses IP locales / privées
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.16.') ||
      hostname.endsWith('.local')
    ) {
      return false;
    }

    // Vérifier l'appartenance stricte à la liste blanche de domaines
    return Array.from(ALLOWED_EXTERNAL_HOSTNAMES).some(
      (allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`)
    );
  } catch {
    return false;
  }
}

/**
 * Valide et extrait une URL publique autorisée configurée dans l'environnement.
 */
export function getSafeConfiguredUrl(
  type:
    | 'chariow_capital'
    | 'chariow_code'
    | 'whatsapp'
    | 'facebook'
    | 'protocol_pdf'
    | 'site_url'
): string | null {
  let target: string | undefined;

  switch (type) {
    case 'chariow_capital':
      target = publicEnv.NEXT_PUBLIC_CHARIOW_CAPITAL_URL;
      break;
    case 'chariow_code':
      target = publicEnv.NEXT_PUBLIC_CHARIOW_CODE_URL;
      break;
    case 'whatsapp':
      target = publicEnv.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL;
      break;
    case 'facebook':
      target = publicEnv.NEXT_PUBLIC_FACEBOOK_URL;
      break;
    case 'protocol_pdf':
      target = publicEnv.NEXT_PUBLIC_PROTOCOL_PDF_URL;
      break;
    case 'site_url':
      target = publicEnv.NEXT_PUBLIC_SITE_URL;
      break;
  }

  if (target && isAllowedExternalUrl(target)) {
    return target;
  }

  return null;
}

/**
 * Vérifie et retourne un chemin interne sécurisé appartenant à la liste blanche.
 */
export function getSafeInternalPath(targetPath: string, fallback: string = '/'): string {
  if (!targetPath || typeof targetPath !== 'string') return fallback;
  const trimmed = targetPath.trim();

  if (ALLOWED_INTERNAL_PATHS.has(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.includes('\\')) {
    const pathOnly = trimmed.split('?')[0];
    if (ALLOWED_INTERNAL_PATHS.has(pathOnly)) {
      return trimmed;
    }
  }

  return fallback;
}

/**
 * Normalise et retourne une URL racine absolue valide
 */
export function getValidSiteUrl(raw?: string): URL {
  const candidate = raw || publicEnv.NEXT_PUBLIC_SITE_URL || 'https://kheopsset.com';
  const clean = candidate.trim();
  const withProtocol =
    clean.startsWith('http://') || clean.startsWith('https://')
      ? clean
      : `https://${clean}`;

  try {
    return new URL(withProtocol);
  } catch {
    return new URL('https://kheopsset.com');
  }
}
