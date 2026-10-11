import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/admin-guard';
import { getExchangeRates } from '@/lib/currency-rates';
import { recordAuditLog } from '@/lib/admin/audit-log';

export async function POST() {
  const session = await requireAdminSession();

  const ratesData = await getExchangeRates();

  await recordAuditLog(
    'refresh_currency_rates',
    'currencies',
    `Actualisation manuelle des taux de change (Source: ${ratesData.source}, Date: ${ratesData.market.date || 'actuelle'})`,
    'currency_rates',
    session.emailMasked
  );

  return NextResponse.json({
    success: true,
    rates: ratesData,
  });
}
