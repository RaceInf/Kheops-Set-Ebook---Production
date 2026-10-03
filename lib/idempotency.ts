import { Redis } from '@upstash/redis';
import { logger } from '@/lib/logger';

/**
 * ==============================================================================
 * GESTION DE L'IDEMPOTENCE CHARIOW (UPSTASH REDIS ATOMIQUE À DEUX ÉTATS)
 * ==============================================================================
 *
 * ÉTATS DU VERROU :
 * 1. PROCESSING (`chariow:processing:<id>`) : TTL 10 minutes (600s).
 *    Réservé atomiquement avant d'appeler l'API Brevo via SET NX EX.
 * 2. PROCESSED (`chariow:processed:<id>`) : TTL 7 jours (604 800s).
 *    Écrit après confirmation de synchronisation Brevo, libérant le processing.
 * 3. ROLLBACK :
 *    Si l'appel Brevo échoue, le verrou processing est supprimé pour permettre
 *    un retry propre de Chariow, et HTTP 500 est retourné.
 * 4. TEST PULSE (`chariow:test:<id>`) : TTL 1 heure (3600s).
 *    Enregistre les tests pour éviter les exécutions redondantes sans toucher aux ventes réelles.
 */

const PROCESSING_TTL_SECONDS = 600; // 10 minutes
const PROCESSED_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 jours
const TEST_TTL_SECONDS = 3600; // 1 heure

let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token || url.trim() === '' || token.trim() === '') {
    return null;
  }

  if (!redisClient) {
    redisClient = new Redis({
      url,
      token,
    });
  }

  return redisClient;
}

export type ReservationResult =
  | { status: 'acquired' }
  | { status: 'duplicate' }
  | { status: 'processing' }
  | { status: 'redis_unavailable' };

/**
 * Tente de réserver atomiquement le traitement d'une vente réelle.
 */
export async function reserveWebhookProcessing(id: string): Promise<ReservationResult> {
  const isProduction = process.env.NODE_ENV === 'production';
  const redis = getRedisClient();

  if (!redis) {
    if (isProduction) {
      logger.error({
        event: 'chariow_idempotency_redis_unavailable',
        message: 'Upstash Redis absent en production lors de la réservation idempotente',
      });
      return { status: 'redis_unavailable' };
    }
    // En développement local sans Redis, permettre la simulation
    return { status: 'acquired' };
  }

  const cleanId = id.trim();
  const processingKey = `chariow:processing:${cleanId}`;
  const processedKey = `chariow:processed:${cleanId}`;

  try {
    // 1. Tenter la réservation atomique
    const res = await redis.set(processingKey, 'processing', {
      nx: true,
      ex: PROCESSING_TTL_SECONDS,
    });

    if (res === 'OK') {
      return { status: 'acquired' };
    }

    // 2. Si le verrou n'a pas pu être pris, vérifier si l'événement est déjà terminé
    const alreadyProcessed = await redis.get(processedKey);
    if (alreadyProcessed) {
      return { status: 'duplicate' };
    }

    return { status: 'processing' };
  } catch (err) {
    logger.error({
      event: 'chariow_idempotency_redis_error',
      message: err instanceof Error ? err.message : 'Erreur Redis reservation',
    });

    if (isProduction) {
      return { status: 'redis_unavailable' };
    }
    return { status: 'acquired' };
  }
}

/**
 * Valide définitivement l'événement comme traité après confirmation Brevo.
 */
export async function markWebhookProcessed(id: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  const cleanId = id.trim();
  const processingKey = `chariow:processing:${cleanId}`;
  const processedKey = `chariow:processed:${cleanId}`;

  try {
    // Écrire l'état définitif pour 7 jours
    await redis.set(processedKey, 'processed', {
      ex: PROCESSED_TTL_SECONDS,
    });
    // Libérer le verrou temporaire
    await redis.del(processingKey);
  } catch (err) {
    logger.error({
      event: 'chariow_idempotency_mark_processed_error',
      message: err instanceof Error ? err.message : 'Erreur Redis mark processed',
    });
  }
}

/**
 * Libère le verrou processing en cas d'échec de la livraison Brevo.
 * Permet à Chariow de relancer la tentative.
 */
export async function rollbackWebhookProcessing(id: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  const cleanId = id.trim();
  const processingKey = `chariow:processing:${cleanId}`;

  try {
    await redis.del(processingKey);
  } catch (err) {
    logger.error({
      event: 'chariow_idempotency_rollback_error',
      message: err instanceof Error ? err.message : 'Erreur Redis rollback',
    });
  }
}

/**
 * Enregistre un identifiant de test Pulse (TTL 1 heure).
 */
export async function claimTestPulseId(id: string): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) return true;

  const cleanId = id.trim();
  const testKey = `chariow:test:${cleanId}`;

  try {
    const res = await redis.set(testKey, 'test_acknowledged', {
      nx: true,
      ex: TEST_TTL_SECONDS,
    });
    return res === 'OK';
  } catch {
    return true;
  }
}
