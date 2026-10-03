import 'server-only';
import { z } from 'zod';
import { logger } from '@/lib/logger';

/**
 * ==============================================================================
 * VARIABLES STRICTEMENT SERVEUR (CONFIDENTIALITÉ ABSOLUE)
 * ==============================================================================
 *
 * Ce fichier est STRICTEMENT RÉSERVÉ au code serveur Node.js (routes API, Server Actions).
 * 'server-only' empêche formellement tout import dans un Client Component.
 *
 * RÈGLE D'OR : Aucune valeur secrète ne doit jamais être transmise au client,
 * ni exposée dans un log ou message d'erreur.
 */

if (typeof window !== 'undefined') {
  throw new Error('ACCÈS REFUSÉ : Tentative critique d’accès aux variables serveur depuis le client.');
}

const isProduction = process.env.NODE_ENV === 'production';

// Schéma brut de toutes les variables serveur connues
const serverEnvRawSchema = z.object({
  BREVO_API_KEY: z.string().min(1).optional(),
  BREVO_PROTOCOL_LIST_ID: z.string().min(1).optional(),
  BREVO_UPCOMING_BOOKS_LIST_ID: z.string().min(1).optional(),
  BREVO_CAPITAL_CUSTOMERS_LIST_ID: z.string().min(1).optional(),
  BREVO_CODE_CUSTOMERS_LIST_ID: z.string().min(1).optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
  CHARIOW_API_KEY: z.string().min(1).optional(),
  CHARIOW_WEBHOOK_SECRET: z.string().min(1).optional(),
  CHARIOW_CAPITAL_PRODUCT_ID: z.string().min(1).optional(),
  CHARIOW_CODE_PRODUCT_ID: z.string().min(1).optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
});

function getRawServerEnv() {
  return serverEnvRawSchema.parse({
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    BREVO_PROTOCOL_LIST_ID: process.env.BREVO_PROTOCOL_LIST_ID,
    BREVO_UPCOMING_BOOKS_LIST_ID: process.env.BREVO_UPCOMING_BOOKS_LIST_ID,
    BREVO_CAPITAL_CUSTOMERS_LIST_ID: process.env.BREVO_CAPITAL_CUSTOMERS_LIST_ID,
    BREVO_CODE_CUSTOMERS_LIST_ID: process.env.BREVO_CODE_CUSTOMERS_LIST_ID,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    CHARIOW_API_KEY: process.env.CHARIOW_API_KEY,
    CHARIOW_WEBHOOK_SECRET: process.env.CHARIOW_WEBHOOK_SECRET,
    CHARIOW_CAPITAL_PRODUCT_ID: process.env.CHARIOW_CAPITAL_PRODUCT_ID,
    CHARIOW_CODE_PRODUCT_ID: process.env.CHARIOW_CODE_PRODUCT_ID,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export type ServerConfigResult<T> =
  | { isConfigured: true; config: T }
  | { isConfigured: false; missingKeys: string[]; isProduction: boolean };

function checkKeys<T extends Record<string, string>>(
  requiredKeys: (keyof typeof serverEnvRawSchema.shape)[],
  routeName: string
): ServerConfigResult<T> {
  const env = getRawServerEnv();
  const missingKeys: string[] = [];
  const resolved: Record<string, string> = {};

  for (const key of requiredKeys) {
    const val = env[key];
    if (!val || val.trim() === '') {
      missingKeys.push(key);
    } else {
      resolved[key] = val;
    }
  }

  if (missingKeys.length > 0) {
    if (isProduction) {
      logger.error({
        event: 'missing_required_server_configuration',
        source: routeName,
        meta: { missingKeys: missingKeys.join(', ') }, // Uniquement les noms de clés, jamais les valeurs
      });
    } else {
      logger.warn({
        event: 'dev_missing_server_configuration',
        source: routeName,
        meta: { missingKeys: missingKeys.join(', ') },
      });
    }

    return {
      isConfigured: false,
      missingKeys,
      isProduction,
    };
  }

  return {
    isConfigured: true,
    config: resolved as T,
  };
}

/**
 * Exige la configuration complète pour la newsletter / livraison du protocole :
 * - BREVO_API_KEY
 * - BREVO_PROTOCOL_LIST_ID
 * - TURNSTILE_SECRET_KEY
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */
export function requireNewsletterConfig() {
  return checkKeys<{
    BREVO_API_KEY: string;
    BREVO_PROTOCOL_LIST_ID: string;
    TURNSTILE_SECRET_KEY: string;
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
  }>(
    [
      'BREVO_API_KEY',
      'BREVO_PROTOCOL_LIST_ID',
      'TURNSTILE_SECRET_KEY',
      'UPSTASH_REDIS_REST_URL',
      'UPSTASH_REDIS_REST_TOKEN',
    ],
    '/api/newsletter'
  );
}

/**
 * Exige la configuration complète pour la liste d'attente des parutions :
 * - BREVO_API_KEY
 * - BREVO_UPCOMING_BOOKS_LIST_ID
 * - TURNSTILE_SECRET_KEY
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */
export function requireWaitlistConfig() {
  return checkKeys<{
    BREVO_API_KEY: string;
    BREVO_UPCOMING_BOOKS_LIST_ID: string;
    TURNSTILE_SECRET_KEY: string;
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
  }>(
    [
      'BREVO_API_KEY',
      'BREVO_UPCOMING_BOOKS_LIST_ID',
      'TURNSTILE_SECRET_KEY',
      'UPSTASH_REDIS_REST_URL',
      'UPSTASH_REDIS_REST_TOKEN',
    ],
    '/api/waitlist'
  );
}

/**
 * Exige la configuration complète pour le formulaire de contact :
 * - TURNSTILE_SECRET_KEY
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */
export function requireContactConfig() {
  return checkKeys<{
    TURNSTILE_SECRET_KEY: string;
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
  }>(
    ['TURNSTILE_SECRET_KEY', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
    '/api/contact'
  );
}

/**
 * Exige la configuration complète pour le webhook Chariow :
 * - CHARIOW_WEBHOOK_SECRET
 * - CHARIOW_CAPITAL_PRODUCT_ID
 * - CHARIOW_CODE_PRODUCT_ID
 * - BREVO_CAPITAL_CUSTOMERS_LIST_ID
 * - BREVO_CODE_CUSTOMERS_LIST_ID
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */
export function requireChariowWebhookConfig() {
  return checkKeys<{
    CHARIOW_WEBHOOK_SECRET: string;
    CHARIOW_CAPITAL_PRODUCT_ID: string;
    CHARIOW_CODE_PRODUCT_ID: string;
    BREVO_CAPITAL_CUSTOMERS_LIST_ID: string;
    BREVO_CODE_CUSTOMERS_LIST_ID: string;
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
  }>(
    [
      'CHARIOW_WEBHOOK_SECRET',
      'CHARIOW_CAPITAL_PRODUCT_ID',
      'CHARIOW_CODE_PRODUCT_ID',
      'BREVO_CAPITAL_CUSTOMERS_LIST_ID',
      'BREVO_CODE_CUSTOMERS_LIST_ID',
      'UPSTASH_REDIS_REST_URL',
      'UPSTASH_REDIS_REST_TOKEN',
    ],
    '/api/webhooks/chariow'
  );
}

/**
 * Exige la configuration pour le checkout serveur (usage futur)
 */
export function requireCheckoutConfig() {
  return checkKeys<{
    CHARIOW_API_KEY: string;
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
  }>(['CHARIOW_API_KEY', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'], '/api/checkout');
}
