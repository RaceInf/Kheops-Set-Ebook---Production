interface RateLimitRecord {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
const DEFAULT_MAX_ATTEMPTS = 5;

// Stockage mémoire local pour le développement ou fallback sans Redis
const localMemoryStore = new Map<string, RateLimitRecord>();

function cleanupExpiredRecords(now: number) {
  if (localMemoryStore.size < 500) return;
  for (const [key, record] of localMemoryStore.entries()) {
    if (now > record.resetAt) {
      localMemoryStore.delete(key);
    }
  }
}

/**
 * Vérifie la limite de requêtes par IP côté serveur (par défaut : 5 tentatives / 15 minutes).
 * Compatible avec Upstash Redis / Vercel KV (via REST API) si KV_REST_API_URL est défini,
 * sinon bascule proprement sur le store mémoire serveur.
 */
export async function checkServerRateLimit(
  namespace: 'newsletter' | 'contact' | 'checkout' | 'webhook',
  ip: string,
  maxAttempts: number = DEFAULT_MAX_ATTEMPTS,
  windowMs: number = FIFTEEN_MINUTES_MS
): Promise<RateLimitResult> {
  const secretSalt = process.env.RATE_LIMIT_SECRET || 'kheops-default-salt';
  const bucketKey = `rl:${namespace}:${secretSalt.slice(0, 8)}:${ip}`;
  const now = Date.now();

  // Option 1 : Upstash Redis / Vercel KV REST si configuré
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (kvUrl && kvToken) {
    try {
      const windowSeconds = Math.ceil(windowMs / 1000);
      const incrResponse = await fetch(`${kvUrl}/incr/${encodeURIComponent(bucketKey)}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kvToken}`,
        },
        cache: 'no-store',
      });

      if (incrResponse.ok) {
        const data = (await incrResponse.json()) as { result?: number };
        const currentCount = typeof data.result === 'number' ? data.result : 1;

        if (currentCount === 1) {
          await fetch(
            `${kvUrl}/expire/${encodeURIComponent(bucketKey)}/${windowSeconds}`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${kvToken}`,
              },
              cache: 'no-store',
            }
          );
        }

        return {
          allowed: currentCount <= maxAttempts,
          remaining: Math.max(0, maxAttempts - currentCount),
        };
      }
    } catch {
      // Repli silencieux sur le store mémoire en cas d'indisponibilité réseau KV
    }
  }

  // Option 2 : Fallback mémoire serveur
  cleanupExpiredRecords(now);
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
