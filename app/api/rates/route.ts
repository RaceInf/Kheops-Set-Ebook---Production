import { NextResponse } from 'next/server';

export interface ExchangeRatesResponse {
  base: 'XAF';
  rates: {
    XAF: number;
    XOF: number;
    EUR: number;
    USD: number;
  };
  updatedAt: string;
  source: 'live' | 'fallback';
}

// Parité fixe officielle Zone Franc : 1 EUR = 655,957 XAF et 1 XAF = 1 XOF
const FALLBACK_RATES = {
  XAF: 1,
  XOF: 1,
  EUR: 1 / 655.957,
  USD: 1 / 604.5,
};

let cachedPayload: ExchangeRatesResponse | null = null;
let lastFetchTimestamp = 0;
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 heures

export async function GET() {
  const now = Date.now();

  if (cachedPayload && now - lastFetchTimestamp < CACHE_TTL_MS) {
    return NextResponse.json(cachedPayload, {
      headers: {
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400',
      },
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const response = await fetch('https://open.er-api.com/v6/latest/XAF', {
      signal: controller.signal,
      next: { revalidate: 21600 },
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      if (data && data.rates) {
        cachedPayload = {
          base: 'XAF',
          rates: {
            XAF: 1,
            XOF: 1,
            EUR: typeof data.rates.EUR === 'number' ? data.rates.EUR : FALLBACK_RATES.EUR,
            USD: typeof data.rates.USD === 'number' ? data.rates.USD : FALLBACK_RATES.USD,
          },
          updatedAt: new Date().toISOString(),
          source: 'live',
        };
        lastFetchTimestamp = now;

        return NextResponse.json(cachedPayload, {
          headers: {
            'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400',
          },
        });
      }
    }
  } catch {
    // Repli silencieux sur les taux de secours vérifiés
  }

  const fallbackResponse: ExchangeRatesResponse = {
    base: 'XAF',
    rates: FALLBACK_RATES,
    updatedAt: new Date().toISOString(),
    source: 'fallback',
  };

  cachedPayload = fallbackResponse;
  lastFetchTimestamp = now;

  return NextResponse.json(fallbackResponse, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
