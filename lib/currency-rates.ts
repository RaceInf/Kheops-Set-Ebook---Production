import type { CurrencyCode } from '@/lib/products';

export interface CurrencyRates {
  XAF: number;
  XOF: number;
  EUR: number;
  USD: number;
}

export interface FrankfurterRateItem {
  date?: string;
  base?: string;
  quote: string;
  rate: number;
}

export interface ExchangeRatesPayload {
  base: 'XAF';
  rates: CurrencyRates;
  market: {
    EUR_TO_XAF: number;
    EUR_TO_USD: number;
    EUR_TO_XOF: number;
    date?: string;
  };
  updatedAt: string;
  source: 'frankfurter' | 'fallback';
}

// Parité officielle Zone Franc (1 EUR = 655,957 XAF/XOF) et parité moyenne EUR/USD
export const FALLBACK_RATES: CurrencyRates = {
  XAF: 1,
  XOF: 1,
  EUR: 1 / 655.957,
  USD: 1.085 / 655.957,
};

export const FALLBACK_PAYLOAD: ExchangeRatesPayload = {
  base: 'XAF',
  rates: FALLBACK_RATES,
  market: {
    EUR_TO_XAF: 655.957,
    EUR_TO_USD: 1.085,
    EUR_TO_XOF: 655.957,
    date: '2026-10-11',
  },
  updatedAt: new Date().toISOString(),
  source: 'fallback',
};

export const CURRENCY_INDICATIVE_NOTICE =
  'Taux indicatif, mis à jour automatiquement. Le montant final dépend de Chariow et du moyen de paiement.';

// Cache serveur en mémoire (24h de rétention)
let serverCache: {
  payload: ExchangeRatesPayload;
  timestamp: number;
} | null = null;

const CACHE_TTL_MS = 86400 * 1000; // 24 heures (revalidate = 86400)

/**
 * Récupère les taux de change depuis Frankfurter v2 côté serveur uniquement.
 * Endpoint gratuit, open-source, sans clé API.
 * https://api.frankfurter.dev/v2/rates
 */
export async function getExchangeRates(): Promise<ExchangeRatesPayload> {
  const now = Date.now();

  // 1. Retourner le cache mémoire valide si disponible
  if (serverCache && now - serverCache.timestamp < CACHE_TTL_MS) {
    return serverCache.payload;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    // Requête serveur vers Frankfurter v2 avec revalidation Next.js journalière
    const response = await fetch(
      'https://api.frankfurter.dev/v2/rates?quotes=USD,XAF,XOF',
      {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'KheopsSet-Currency/1.0',
        },
        next: { revalidate: 86400 },
      }
    );

    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();

      let xafRate = 655.957;
      let usdRate = 1.085;
      let xofRate = 655.957;
      let rateDate = new Date().toISOString().slice(0, 10);

      if (Array.isArray(data)) {
        for (const item of data as FrankfurterRateItem[]) {
          if (item.quote === 'XAF' && typeof item.rate === 'number') {
            xafRate = item.rate;
            if (item.date) rateDate = item.date;
          } else if (item.quote === 'USD' && typeof item.rate === 'number') {
            usdRate = item.rate;
          } else if (item.quote === 'XOF' && typeof item.rate === 'number') {
            xofRate = item.rate;
          }
        }
      } else if (data && typeof data === 'object' && 'rates' in data) {
        const ratesObj = (data as { rates: Record<string, number>; date?: string }).rates;
        if (typeof ratesObj.XAF === 'number') xafRate = ratesObj.XAF;
        if (typeof ratesObj.USD === 'number') usdRate = ratesObj.USD;
        if (typeof ratesObj.XOF === 'number') xofRate = ratesObj.XOF;
        if ((data as { date?: string }).date) rateDate = (data as { date?: string }).date!;
      }

      const calculatedRates: CurrencyRates = {
        XAF: 1,
        XOF: 1, // Parité fixe 1:1 garantie entre Francs CFA
        EUR: 1 / xafRate,
        USD: usdRate / xafRate,
      };

      const payload: ExchangeRatesPayload = {
        base: 'XAF',
        rates: calculatedRates,
        market: {
          EUR_TO_XAF: xafRate,
          EUR_TO_USD: usdRate,
          EUR_TO_XOF: xofRate,
          date: rateDate,
        },
        updatedAt: new Date().toISOString(),
        source: 'frankfurter',
      };

      serverCache = {
        payload,
        timestamp: now,
      };

      return payload;
    }
  } catch (error) {
    // Si l'API échoue, ne jamais faire échouer le rendu du site
    console.warn('[Currency] Frankfurter unavailable, using cached/fallback rates:', error);
  }

  // Si le cache précédent existe, le conserver même au-delà du TTL
  if (serverCache) {
    return serverCache.payload;
  }

  return FALLBACK_PAYLOAD;
}

/**
 * Arrondi commercial lisible selon la devise cible :
 * - EUR : arrondi au centime le plus proche (2 décimales)
 * - USD : arrondi au centime le plus proche (2 décimales)
 * - XAF / XOF : arrondi à l'entier (0 décimale)
 */
export function convertXafAmount(
  amountInXaf: number,
  targetCurrency: CurrencyCode,
  rates: CurrencyRates = FALLBACK_RATES
): number {
  if (targetCurrency === 'XAF' || targetCurrency === 'XOF') {
    return Math.round(amountInXaf);
  }

  const rate = rates[targetCurrency] ?? FALLBACK_RATES[targetCurrency];
  const converted = amountInXaf * rate;

  // Arrondi commercial propre au centime (2 décimales)
  return Math.round(converted * 100) / 100;
}

/**
 * Formatage avec Intl.NumberFormat propre et sans décimales inutiles.
 */
export function formatCurrencyAmount(
  amountInXaf: number,
  currency: CurrencyCode,
  rates: CurrencyRates = FALLBACK_RATES
): string {
  if (currency === 'XAF') {
    const rounded = Math.round(amountInXaf);
    return `${new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 0,
    })
      .format(rounded)
      .replace(/\u202f/g, ' ')
      .replace(/\u00a0/g, ' ')} FCFA`;
  }

  if (currency === 'XOF') {
    const rounded = Math.round(amountInXaf);
    return `${new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 0,
    })
      .format(rounded)
      .replace(/\u202f/g, ' ')
      .replace(/\u00a0/g, ' ')} XOF`;
  }

  const converted = convertXafAmount(amountInXaf, currency, rates);

  if (currency === 'EUR') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(converted)
      .replace(/\u202f/g, ' ')
      .replace(/\u00a0/g, ' ');
  }

  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  }

  return `${amountInXaf} FCFA`;
}
