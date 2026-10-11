import { NextResponse } from 'next/server';
import { getExchangeRates, type ExchangeRatesPayload } from '@/lib/currency-rates';

export type ExchangeRatesResponse = ExchangeRatesPayload;

export async function GET() {
  const payload = await getExchangeRates();

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
