import { NextRequest, NextResponse } from 'next/server';
import {
  verifyChariowSignature,
  isChariowTestPulse,
  type ChariowPulsePayload,
} from '@/lib/chariow-webhook';
import { validateChariowRealOrder } from '@/lib/chariow-config';
import {
  reserveWebhookProcessing,
  markWebhookProcessed,
  rollbackWebhookProcessing,
  claimTestPulseId,
} from '@/lib/idempotency';
import { addCustomerToCapitalList, addCustomerToCodeList } from '@/lib/brevo';
import { logger } from '@/lib/logger';
import { requireChariowWebhookConfig } from '@/lib/env/server';

const MAX_WEBHOOK_BODY_BYTES = 64 * 1024; // 64 KB max

export async function POST(req: NextRequest) {
  // 1. Vérification stricte des variables serveur obligatoires (CHARIOW_WEBHOOK_SECRET, Upstash, Brevo)
  const configResult = requireChariowWebhookConfig();
  if (!configResult.isConfigured) {
    logger.warn({
      event: 'chariow_webhook_configuration_missing',
      meta: { missingKeys: configResult.missingKeys.join(', ') },
    });
    return NextResponse.json(
      { ok: false, error: 'Configuration serveur temporairement indisponible.' },
      { status: 503 }
    );
  }

  const serverConfig = configResult.config;

  // 2. Limite stricte de la taille du payload avant lecture intégrale (HTTP 413)
  const contentLength = req.headers.get('content-length');
  if (contentLength) {
    const length = Number(contentLength);
    if (!Number.isNaN(length) && length > MAX_WEBHOOK_BODY_BYTES) {
      return NextResponse.json({ error: 'Payload trop volumineux.' }, { status: 413 });
    }
  }

  // 3. Lecture du raw body sous forme de chaîne brute sans parsing préalable
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: 'Corps de requête illisible.' }, { status: 400 });
  }

  if (!rawBody || rawBody.trim() === '') {
    return NextResponse.json({ error: 'Corps de requête vide.' }, { status: 400 });
  }

  if (rawBody.length > MAX_WEBHOOK_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload trop volumineux.' }, { status: 413 });
  }

  // 4. Lecture du header de signature officiel Chariow
  const signatureHeader = req.headers.get('x-chariow-signature');
  if (!signatureHeader) {
    return NextResponse.json({ error: 'Signature manquante.' }, { status: 401 });
  }

  // 5. Vérification cryptographique HMAC-SHA256 (format sha256=<64 hex>) en timing-safe
  const isValidSignature = verifyChariowSignature(
    rawBody,
    signatureHeader,
    serverConfig.CHARIOW_WEBHOOK_SECRET
  );

  if (!isValidSignature) {
    logger.warn({
      event: 'chariow_webhook_signature_invalid',
      message: 'Signature cryptographique HMAC invalide',
    });
    return NextResponse.json({ error: 'Signature invalide.' }, { status: 401 });
  }

  // 6. Parsing du JSON (uniquement après validation formelle de la signature)
  let payload: ChariowPulsePayload;
  try {
    payload = JSON.parse(rawBody) as ChariowPulsePayload;
  } catch {
    return NextResponse.json({ error: 'Payload JSON mal formé.' }, { status: 400 });
  }

  // 7. Diagnostic structurel passif réservé STRICTEMENT à Preview / Development
  if (process.env.NODE_ENV !== 'production') {
    try {
      const headerNames = Array.from(req.headers.keys());
      const topLevelKeys = Object.keys(payload);
      const saleKeys = payload.sale ? Object.keys(payload.sale) : [];
      const productKeys = payload.product ? Object.keys(payload.product) : [];
      const customerKeys = payload.customer ? Object.keys(payload.customer) : [];

      logger.info({
        event: 'chariow_preview_diagnostic',
        meta: {
          headerNamesCount: headerNames.length,
          hasSignatureHeader: Boolean(signatureHeader),
          hasDeliveryIdHeader: Boolean(req.headers.get('x-pulse-delivery-id')),
          hasEventHeader: Boolean(req.headers.get('x-pulse-event')),
          topLevelKeys: topLevelKeys.join(', '),
          saleKeys: saleKeys.join(', '),
          productKeys: productKeys.join(', '),
          customerKeys: customerKeys.join(', '),
        },
      });
    } catch {
      // Diagnostic non bloquant
    }
  }

  // 8. Extraction de l'identifiant d'idempotence prioritaire (x-pulse-delivery-id, fallback sur sale.id)
  const deliveryId =
    req.headers.get('x-pulse-delivery-id') || payload.sale?.id || 'unknown';

  // ==============================================================================
  // 9. BRANCHE TEST : DÉTECTION FORMELLE DU MODE TEST PULSE CHARIOW
  // ==============================================================================
  if (isChariowTestPulse(payload)) {
    // Enregistrement dans l'idempotence test (TTL 1h)
    await claimTestPulseId(deliveryId);

    // Ne jamais appeler Brevo, ne jamais créer de commande, ne jamais traiter comme vente réelle
    logger.info({
      event: 'chariow_test_pulse_received',
    });

    return NextResponse.json({ ok: true, test: true }, { status: 200 });
  }

  // ==============================================================================
  // 10. BRANCHE VENTE RÉELLE : VALIDATIONS MÉTIER & CONTRÔLE DE COHÉRENCE
  // ==============================================================================

  // Contrôle de cohérence de l'événement et du statut
  if (payload.event !== 'successful.sale') {
    return NextResponse.json({ ok: true, ignored: true }, { status: 200 });
  }

  // Si l'en-tête x-pulse-event est présent, il doit correspondre à payload.event
  const eventHeader = req.headers.get('x-pulse-event');
  if (eventHeader && eventHeader.trim() !== 'successful.sale') {
    return NextResponse.json({ ok: true, ignored: true }, { status: 200 });
  }

  if (payload.sale?.status !== 'completed') {
    return NextResponse.json({ ok: true, ignored: true }, { status: 200 });
  }

  // Validation stricte du produit, de la devise (XAF) et du montant (entier dans allowedAmounts)
  const validation = validateChariowRealOrder({
    productId: payload.product?.id,
    amountValue: payload.sale?.amount?.value,
    currency: payload.sale?.amount?.currency,
  });

  if (!validation.valid || !validation.productSlug) {
    logger.warn({
      event: 'chariow_webhook_order_rejected',
      message: validation.reason,
    });
    return NextResponse.json(
      { error: validation.reason || 'Données de commande non autorisées.' },
      { status: 400 }
    );
  }

  // Validation de l'adresse email client
  const customerEmail = payload.customer?.email?.trim().toLowerCase();
  if (!customerEmail || !customerEmail.includes('@')) {
    return NextResponse.json(
      { error: 'Email client manquant ou invalide.' },
      { status: 400 }
    );
  }

  const customerFirstName = payload.customer?.first_name?.trim();

  // 11. Réservation atomique préliminaire Upstash Redis (chariow:processing:<deliveryId>)
  const reservation = await reserveWebhookProcessing(deliveryId);

  if (reservation.status === 'redis_unavailable') {
    return NextResponse.json(
      { error: 'Service d’idempotence temporairement indisponible.' },
      { status: 503 }
    );
  }

  if (reservation.status === 'duplicate') {
    return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
  }

  if (reservation.status === 'processing') {
    return NextResponse.json({ ok: true, processing: true }, { status: 200 });
  }

  // 12. Synchronisation sécurisée vers l'API Brevo côté serveur uniquement
  try {
    if (validation.productSlug === 'le-capital-du-batisseur') {
      await addCustomerToCapitalList(customerEmail, customerFirstName);
    } else if (validation.productSlug === 'le-code-du-batisseur') {
      await addCustomerToCodeList(customerEmail, customerFirstName);
    }

    // Validation finale de l'idempotence (chariow:processed:<deliveryId>, TTL 7 jours)
    await markWebhookProcessed(deliveryId);

    logger.info({
      event: 'chariow_order_processed',
      bookSlug: validation.productSlug,
    });

    return NextResponse.json({ ok: true, processed: true }, { status: 200 });
  } catch (err) {
    // En cas d'échec de la synchronisation Brevo : rollback du verrou processing
    await rollbackWebhookProcessing(deliveryId);

    logger.error({
      event: 'chariow_brevo_sync_failed',
      message: err instanceof Error ? err.message : 'Erreur de synchronisation Brevo',
    });

    // Code HTTP 500 pour que Chariow déclenche un retry
    return NextResponse.json(
      { error: 'Erreur de traitement de commande.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Méthode non autorisée.' }, { status: 405 });
}
