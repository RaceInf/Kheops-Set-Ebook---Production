import { NextRequest, NextResponse } from 'next/server';
import { ProtocolSchema } from '@/lib/NewsletterSchema';
import {
  getClientIp,
  parseSafeJsonBody,
  sanitizePlainText,
  isAllowedOrigin,
} from '@/lib/security';
import { checkServerRateLimit } from '@/lib/rateLimit';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { syncProtocolContact } from '@/lib/brevo';
import { requireNewsletterConfig } from '@/lib/env/server';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  // 1. Vérification méthode POST (HTTP 405)
  // (Next.js route handler POST gère nativement, mais explicite)

  // 2. Vérification Content-Type JSON (HTTP 400)
  const contentType = req.headers.get('content-type');
  if (!contentType || !contentType.toLowerCase().includes('application/json')) {
    return NextResponse.json(
      { error: 'Format de requête invalide (application/json attendu).' },
      { status: 400 }
    );
  }

  // 3. Contrôle de taille du body (8 KB max via parseSafeJsonBody)

  // 4. Rate Limiting par IP (5 requêtes / 15 minutes)
  const clientIp = getClientIp(req);
  const rateLimit = await checkServerRateLimit('newsletter', clientIp, 5, 15 * 60 * 1000);

  if (!rateLimit.allowed) {
    logger.security('newsletter_rate_limit_exceeded', { ip: logger.mask(clientIp) });
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessaie plus tard.' },
      { status: 429 }
    );
  }

  // 5. Lecture & parsing JSON sécurisé
  const bodyResult = await parseSafeJsonBody<Record<string, unknown>>(req);
  if (!bodyResult.ok) {
    return NextResponse.json(
      { error: bodyResult.error || 'Vérifie les informations saisies.' },
      { status: 400 }
    );
  }

  const rawBody = bodyResult.data;

  // 6. Contrôle du Honeypot silencieux (neutralisation des robots sans appel Brevo ni Turnstile)
  if (typeof rawBody.website === 'string' && rawBody.website.trim().length > 0) {
    logger.security('newsletter_honeypot_triggered', { ip: logger.mask(clientIp) });
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // 7. Validation Zod stricte côté serveur
  const parsed = ProtocolSchema.safeParse(rawBody);
  if (!parsed.success) {
    const firstIssueMessage =
      parsed.error.issues[0]?.message || 'Vérifie les informations saisies.';
    return NextResponse.json({ error: firstIssueMessage }, { status: 400 });
  }

  const validData = parsed.data;

  // 8. Vérification Cloudflare Turnstile côté serveur
  const turnstileCheck = await verifyTurnstileToken(validData.turnstileToken, clientIp);
  if (!turnstileCheck.success) {
    logger.security('newsletter_turnstile_failed', { ip: logger.mask(clientIp) });
    return NextResponse.json(
      { error: 'La vérification de sécurité a échoué. Réessaie dans quelques instants.' },
      { status: 400 }
    );
  }

  // 9. Contrôle d'origine (same-origin / whitelist)
  if (!isAllowedOrigin(req)) {
    logger.security('newsletter_invalid_origin', { ip: logger.mask(clientIp) });
    return NextResponse.json(
      { error: 'Origine de requête non autorisée.' },
      { status: 403 }
    );
  }

  // 10. Vérification des prérequis de configuration serveur
  const configResult = requireNewsletterConfig();
  if (!configResult.isConfigured) {
    if (configResult.isProduction) {
      return NextResponse.json(
        {
          success: false,
          error: 'Le service est temporairement indisponible. Réessaie dans quelques instants.',
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        code: 'SERVICE_NOT_CONFIGURED',
        error: 'Service non configuré en local.',
        devNotice:
          'Simulation locale : le service n’est pas configuré. Aucune donnée n’a été envoyée.',
      },
      { status: 503 }
    );
  }

  // 11. Appel Brevo (attributs certifiés, mise à jour de la liste Protocole)
  const cleanFirstName = sanitizePlainText(validData.firstName);
  const cleanEmail = validData.email.trim().toLowerCase();

  const syncResult = await syncProtocolContact({
    firstName: cleanFirstName,
    email: cleanEmail,
  });

  if (!syncResult.ok) {
    logger.safeError('newsletter_brevo_sync_failed', syncResult.error, {
      email: logger.maskEmail(cleanEmail),
    });
    return NextResponse.json(
      {
        success: false,
        error: 'Le service est temporairement indisponible. Réessaie dans quelques instants.',
      },
      { status: 500 }
    );
  }

  logger.audit('newsletter_subscription_completed', {
    email: logger.maskEmail(cleanEmail),
  });

  return NextResponse.json({
    success: true,
    message: 'Merci. Ton protocole est prêt.',
  });
}

export async function GET() {
  return NextResponse.json({ error: 'Méthode non autorisée.' }, { status: 405 });
}
