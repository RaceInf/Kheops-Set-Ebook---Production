import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { logger } from '@/lib/logger';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

// Map locale de secours en mémoire réservée STRICTEMENT au développement local
interface MemoryRecord {
  count: number;
  resetAt: number;
}
const localMemoryStore = new Map<string, MemoryRecord>();

function cleanupExpiredRecords(now: number) {
  if (localMemoryStore.size < 500) return;
  for (const [key, record] of localMemoryStore.entries()) {
    if (now > record.resetAt) {
      localMemoryStore.delete(key);
    }
  }
}

let upstashRedisClient: Redis | null = null;
const ratelimitInstances = new Map<string, Ratelimit>();

function getUpstashClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token || url.trim() === '' || token.trim() === '') {
    return null;
  }

  if (!upstashRedisClient) {
    upstashRedisClient = new Redis({
      url,
      token,
    });
  }

  return upstashRedisClient;
}

function getRatelimit(namespace: string, maxAttempts: number, windowSeconds: number): Ratelimit | null {
  const redis = getUpstashClient();
  if (!redis) return null;

  const key = `${namespace}:${maxAttempts}:${windowSeconds}`;
  if (!ratelimitInstances.has(key)) {
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(maxAttempts, `${windowSeconds} s`),
      prefix: `kheops:ratelimit:${namespace}`,
      analytics: false,
    });
    ratelimitInstances.set(key, limiter);
  }

  return ratelimitInstances.get(key) || null;
}

/**
 * Vérifie le rate limiting par IP avec @upstash/ratelimit et @upstash/redis.
 *
 * RÈGLE DE PRODUCTION :
 * En production, Upstash Redis est obligatoire. Aucun fallback mémoire n'est
 * utilisé en production afin d'éviter le contournement du rate limiting entre instances serverless.
 * Le fallback mémoire est réservé EXCLUSIVEMENT au développement local.
 */
export async function checkServerRateLimit(
  namespace: 'newsletter' | 'contact' | 'checkout' | 'webhook',
  ip: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): Promise<RateLimitResult> {
  const isProduction = process.env.NODE_ENV === 'production';
  const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000));
  const ratelimiter = getRatelimit(namespace, maxAttempts, windowSeconds);

  if (ratelimiter) {
    try {
      const identifier = `${namespace}:${ip || '127.0.0.1'}`;
      const result = await ratelimiter.limit(identifier);

      return {
        allowed: result.success,
        remaining: result.remaining,
      };
    } catch (err) {
      logger.error({
        event: 'upstash_ratelimit_error',
        source: namespace,
        message: err instanceof Error ? err.message : 'Erreur connectivité Upstash',
      });

      if (isProduction) {
        // En production : refuser de servir pour éviter les abus sans rate limiting distribué
        return {
          allowed: false,
          remaining: 0,
        };
      }
    }
  }

  // En production, si Upstash n'est pas configuré, rejet strict
  if (isProduction) {
    logger.error({
      event: 'production_missing_upstash_ratelimit',
      source: namespace,
      message: 'Upstash Redis non configuré en production pour le rate limiting',
    });
    return {
      allowed: false,
      remaining: 0,
    };
  }

  // Fallback mémoire local réservé UNIQUEMENT au développement local (NODE_ENV !== 'production')
  const now = Date.now();
  cleanupExpiredRecords(now);

  const bucketKey = `${namespace}:${ip || '127.0.0.1'}`;
  const existing = localMemoryStore.get(bucketKey);

  if (!existing || now > existing.resetAt) {
    localMemoryStore.set(bucketKey, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxAttempts - 1,
    };
  }

  if (existing.count >= maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, maxAttempts - existing.count),
  };
}
