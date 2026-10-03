type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
  event: string;
  source?: string;
  bookSlug?: string;
  durationMs?: number;
  statusCode?: number;
  message?: string;
  // Ne jamais passer d'emails complets, de clés d'API, de tokens ou de données bancaires
  meta?: Record<string, string | number | boolean | null | undefined>;
}

function maskIdentifier(val?: string): string {
  if (!val) return '';
  if (val.length <= 4) return '***';
  return `${val.slice(0, 2)}***${val.slice(-2)}`;
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
};

function emit(level: LogLevel, payload: LogPayload) {
  const timestamp = new Date().toISOString();
  const safeData = {
    timestamp,
    level,
    ...payload,
  };

  if (process.env.NODE_ENV === 'production') {
    // Log JSON propre pour agrégation Vercel / Datadog
    const json = JSON.stringify(safeData);
    if (level === 'error') {
      console.error(json);
    } else if (level === 'warn') {
      console.warn(json);
    } else {
      console.log(json);
    }
  } else {
    // Format lisible en développement
    const prefix = `[KHEOPS-${level.toUpperCase()}] ${payload.event}`;
    if (level === 'error') {
      console.error(prefix, payload.message || '', payload.meta || '');
    } else {
      console.log(prefix, payload.message || '', payload.meta || '');
    }
  }
}
