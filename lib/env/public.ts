import { z } from 'zod';

/**
 * ==============================================================================
 * VARIABLES PUBLIQUES (CLIENT & SERVEUR)
 * ==============================================================================
 *
 * Ce fichier valide UNIQUEMENT les variables préfixées par NEXT_PUBLIC_*.
 * Il ne contient AUCUN secret et peut être importé en toute sécurité dans les
 * Server Components comme dans les Client Components ('use client').
 *
 * RÈGLE D'OR : Ne jamais importer de fichier serveur dans ce module.
 */

function sanitizeUrlString(val: unknown): string | undefined {
  if (typeof val !== 'string' || val.trim() === '') return undefined;
  const clean = val.trim();
  const withProtocol =
    clean.startsWith('http://') || clean.startsWith('https://')
      ? clean
      : `https://${clean}`;
  try {
    const parsed = new URL(withProtocol);
    return parsed.href;
  } catch {
    return undefined;
  }
}

const safeOptionalUrl = z.preprocess(sanitizeUrlString, z.string().url().optional());

const optionalCleanString = z.preprocess((val) => {
  if (typeof val === 'string' && val.trim() !== '') {
    return val.trim();
  }
  return undefined;
}, z.string().optional());

const publicEnvSchema = z.object({
  /** URL canonique du site (défaut de repli sûr : https://kheopsset.com) */
  NEXT_PUBLIC_SITE_URL: z.preprocess(
    (val) => sanitizeUrlString(val) || 'https://kheopsset.com',
    z.string().url()
  ),

  /** Identifiant Google Analytics 4 (ex: G-XXXXXX) */
  NEXT_PUBLIC_GA_ID: optionalCleanString,

  /** Identifiant Microsoft Clarity */
  NEXT_PUBLIC_CLARITY_ID: optionalCleanString,

  /** Clé de site publique Cloudflare Turnstile */
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: optionalCleanString,

  /** URL directe de téléchargement du PDF du guide gratuit */
  NEXT_PUBLIC_PROTOCOL_PDF_URL: safeOptionalUrl,

  /** URL publique de paiement Chariow pour Le Capital du Bâtisseur */
  NEXT_PUBLIC_CHARIOW_CAPITAL_URL: safeOptionalUrl,

  /** URL publique de paiement Chariow pour Le Code du Bâtisseur */
  NEXT_PUBLIC_CHARIOW_CODE_URL: safeOptionalUrl,

  /** Canal officiel WhatsApp Kheops Set */
  NEXT_PUBLIC_WHATSAPP_CHANNEL_URL: safeOptionalUrl,

  /** Page officielle Facebook */
  NEXT_PUBLIC_FACEBOOK_URL: safeOptionalUrl,
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

// Permet la rétrocompatibilité si NEXT_PUBLIC_CHARIOW_MAIN_URL était précédemment utilisé
const resolvedCapitalUrl =
  process.env.NEXT_PUBLIC_CHARIOW_CAPITAL_URL ||
  process.env.NEXT_PUBLIC_CHARIOW_MAIN_URL;

export const publicEnv: PublicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  NEXT_PUBLIC_CLARITY_ID: process.env.NEXT_PUBLIC_CLARITY_ID,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_PROTOCOL_PDF_URL: process.env.NEXT_PUBLIC_PROTOCOL_PDF_URL,
  NEXT_PUBLIC_CHARIOW_CAPITAL_URL: resolvedCapitalUrl,
  NEXT_PUBLIC_CHARIOW_CODE_URL: process.env.NEXT_PUBLIC_CHARIOW_CODE_URL,
  NEXT_PUBLIC_WHATSAPP_CHANNEL_URL: process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL,
  NEXT_PUBLIC_FACEBOOK_URL: process.env.NEXT_PUBLIC_FACEBOOK_URL,
});
