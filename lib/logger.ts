type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
  event: string;
  source?: string;
  bookSlug?: string;
  durationMs?: number;
  statusCode?: number;
  message?: string;
  meta?: Record<string, unknown>;
}

/**
 * Liste des clés sensibles à masquer systématiquement
 */
const SENSITIVE_KEYS = new Set([
  'password',
  'secret',
  'token',
  'apikey',
  'api_key',
  'authorization',
  'cookie',
  'turnstilesecret',
  'turnstile_secret_key',
  'brevoapikey',
  'brevo_api_key',
  'chariowapikey',
  'chariow_webhook_secret',
  'upstash_redis_rest_token',
  'email',
  'useremail',
]);

/**
 * Masque un identifiant ou une chaîne
 */
export function maskIdentifier(val?: string): string {
  if (!val || typeof val !== 'string') return '';
  const clean = val.trim();
  if (clean.length <= 4) return '***';
  return `${clean.slice(0, 2)}***${clean.slice(-2)}`;
}

/**
 * Masque une adresse email (ex: batisseur@kheops.com -> b***r@k***.com)
 */
export function maskEmail(email?: string): string {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return maskIdentifier(email);
  }
  const [localPart, domain] = email.split('@');
  const maskedLocal =
    localPart.length <= 2
      ? `${localPart.slice(0, 1)}*`
      : `${localPart.slice(0, 1)}***${localPart.slice(-1)}`;
  const [domainName, ...tldParts] = domain.split('.');
  const maskedDomain =
    domainName.length <= 2
      ? `${domainName.slice(0, 1)}*`
      : `${domainName.slice(0, 1)}***${domainName.slice(-1)}`;
  return `${maskedLocal}@${maskedDomain}.${tldParts.join('.')}`;
}

/**
 * Nettoie récursivement un objet pour éliminer tout secret ou PII involontaire
 */
function sanitizeMeta(input: unknown, depth = 0): unknown {
  if (depth > 5) return '[TRUNCATED_DEPTH]';
  if (!input || typeof input !== 'object') {
    if (typeof input === 'string') {
      // Masquer si c'est un format Bearer ou token long
      if (/bearer\s+[a-z0-9._-]+/i.test(input)) {
        return 'Bearer [REDACTED]';
      }
      // Masquer si c'est une clé Brevo (xkeysib-...)
      if (/xkeysib-[a-z0-9]+/i.test(input)) {
        return 'xkeysib-[REDACTED]';
      }
    }
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeMeta(item, depth + 1));
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      if (lowerKey.includes('email') && typeof value === 'string') {
        sanitized[key] = maskEmail(value);
      } else {
        sanitized[key] = '[REDACTED]';
      }
    } else {
      sanitized[key] = sanitizeMeta(value, depth + 1);
    }
  }
  return sanitized;
}

function emit(level: LogLevel, payload: LogPayload) {
  const timestamp = new Date().toISOString();
  const safeMeta = payload.meta ? sanitizeMeta(payload.meta) : undefined;

  const safeData = {
    timestamp,
    level,
    event: payload.event,
    source: payload.source,
    bookSlug: payload.bookSlug,
    durationMs: payload.durationMs,
    statusCode: payload.statusCode,
    message: payload.message ? String(payload.message).slice(0, 500) : undefined,
    meta: safeMeta,
  };

  if (process.env.NODE_ENV === 'production') {
    // Log JSON structuré pour agrégation (Vercel Log Drains / Datadog / CloudWatch)
    const json = JSON.stringify(safeData);
    if (level === 'error') {
      console.error(json);
    } else if (level === 'warn') {
      console.warn(json);
    } else {
      console.log(json);
    }
  } else {
    // Format lisible en développement local
    const prefix = `[KHEOPS-${level.toUpperCase()}] ${payload.event}`;
    if (level === 'error') {
      console.error(prefix, safeData.message || '', safeData.meta || '');
    } else if (level === 'warn') {
      console.warn(prefix, safeData.message || '', safeData.meta || '');
    } else {
      console.log(prefix, safeData.message || '', safeData.meta || '');
    }
  }
}

export const logger = {
  info(payload: LogPayload) {
    emit('info', payload);
  },
  warn(payload: LogPayload) {
    emit('warn', payload);
  },
  error(payload: LogPayload) {
    emit('error', payload);
  },
  mask(val?: string) {
    return maskIdentifier(val);
  },
  maskEmail(email?: string) {
    return maskEmail(email);
  },
  /**
   * Log d'événement de sécurité (tentative d'intrusion, rejet origin, rate-limit, honeypot)
   */
  security(event: string, meta?: Record<string, unknown>) {
    emit('warn', {
      event: `security_${event}`,
      source: 'security_monitor',
      meta,
    });
  },
  /**
   * Log d'audit métier (inscription, achat validé, consultation de ressource)
   */
  audit(event: string, meta?: Record<string, unknown>) {
    emit('info', {
      event: `audit_${event}`,
      source: 'audit_trail',
      meta,
    });
  },
  /**
   * Log d'erreur sécurisé qui n'expose jamais la stack trace complète aux clients
   */
  safeError(event: string, err: unknown, meta?: Record<string, unknown>) {
    const errorMessage =
      err instanceof Error ? err.message : typeof err === 'string' ? err : 'Erreur inconnue';
    emit('error', {
      event,
      message: errorMessage,
      meta,
    });
  },
};
