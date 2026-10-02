import { NextRequest, NextResponse } from 'next/server';
import { getClientIp } from '@/lib/security';
import { checkServerRateLimit } from '@/lib/rateLimit';

const processedEventIds = new Set<string>();

/**
 * Architecture préparée pour POST /api/webhooks/chariow
 *
 * TODO (Documentation officielle Chariow) :
 * 1. Lire le body brut avec req.text().
 * 2. Vérifier la signature cryptographique avec process.env.CHARIOW_WEBHOOK_SECRET.
 * 3. Vérifier le statut de paiement, l'identifiant de transaction et l'identifiant produit
 *    (CHARIOW_CAPITAL_PRODUCT_ID ou CHARIOW_CODE_PRODUCT_ID).
 * 4. Garantir l'idempotence (ne jamais traiter deux fois le même eventId).
 * 5. Ajouter le client à la liste Brevo correspondante (BREVO_CAPITAL_CUSTOMERS_LIST_ID ou BREVO_CODE_CUSTOMERS_LIST_ID).
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rateLimit = await checkServerRateLimit('webhook', ip, 30, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const webhookSecret = process.env.CHARIOW_WEBHOOK_SECRET;
  if (!webhookSecret || webhookSecret.trim() === '') {
    return NextResponse.json(
      { ok: false, error: 'Webhook non activé.' },
      { status: 501 }
    );
  }

  const signature = req.headers.get('x-chariow-signature');
  if (!signature) {
    return NextResponse.json({ ok: false, error: 'Non autorisé.' }, { status: 401 });
  }

  try {
    const rawBody = await req.text();
    if (!rawBody) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // TODO: Implémenter la vérification HMAC exacte selon la documentation officielle Chariow
    const payload = JSON.parse(rawBody) as { eventId?: string };
    if (payload.eventId) {
      if (processedEventIds.has(payload.eventId)) {
        return NextResponse.json({ ok: true, duplicate: true });
      }
      processedEventIds.add(payload.eventId);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
