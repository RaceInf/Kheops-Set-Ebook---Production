import { NextRequest, NextResponse } from 'next/server';
import { WaitlistSchema } from '@/lib/NewsletterSchema';
import {
  getClientIp,
  parseSafeJsonBody,
  sanitizePlainText,
  isAllowedOrigin,
} from '@/lib/security';
import { checkServerRateLimit } from '@/lib/rateLimit';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { syncWaitlistContact } from '@/lib/brevo';
import { requireWaitlistConfig } from '@/lib/env/server';

export async function POST(req: NextRequest) {
  // 1. Vérification méthode POST (HTTP 405)

  // 2. Vérification Content-Type JSON (HTTP 400)
  const contentType = req.headers.get('content-type');
  if (!contentType || !contentType.toLowerCase().includes('application/json')) {
    return NextResponse.json(
      { error: 'Format de requête invalide (application/json attendu).' },
      { status: 400 }
    );
  }

  // 3. Contrôle de taille du body (8 KB max)

  // 4. Rate Limiting par IP (5 requêtes / 15 minutes)
  const clientIp = getClientIp(req);
  const rateLimit = await checkServerRateLimit('newsletter', clientIp, 5, 15 * 60 * 1000);

  if (!rateLimit.allowed) {
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

  // 6. Contrôle du Honeypot silencieux
  if (typeof rawBody.website === 'string' && rawBody.website.trim().length > 0) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // 7. Validation Zod stricte côté serveur (incluant le slug fermé du livre)
  const parsed = WaitlistSchema.safeParse(rawBody);
  if (!parsed.success) {
    const firstIssueMessage =
      parsed.error.issues[0]?.message || 'Vérifie les informations saisies.';
    return NextResponse.json({ error: firstIssueMessage }, { status: 400 });
  }

  const validData = parsed.data;

  // 8. Vérification Cloudflare Turnstile côté serveur
  const turnstileCheck = await verifyTurnstileToken(validData.turnstileToken, clientIp);
  if (!turnstileCheck.success) {
    return NextResponse.json(
      { error: 'La vérification de sécurité a échoué. Réessaie dans quelques instants.' },
      { status: 400 }
    );
  }

  // 9. Contrôle d'origine
  if (!isAllowedOrigin(req)) {
    return NextResponse.json(
      { error: 'Origine de requête non autorisée.' },
      { status: 403 }
    );
  }

  // 10. Vérification des prérequis de configuration serveur (BREVO_UPCOMING_BOOKS_LIST_ID)
  const configResult = requireWaitlistConfig();
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
        error: 'Service de liste d’attente non configuré en local.',
        devNotice:
          'Simulation locale : le service n’est pas configuré. Aucune donnée n’a été envoyée.',
      },
      { status: 503 }
    );
  }

  // 11. Appel Brevo (mapping serveur de INTERESTED_BOOK, préservation des intérêts multiples)
  const cleanFirstName = sanitizePlainText(validData.firstName);
  const cleanEmail = validData.email.trim().toLowerCase();

  const syncResult = await syncWaitlistContact({
    firstName: cleanFirstName,
    email: cleanEmail,
    bookSlug: validData.bookSlug,
  });

  if (!syncResult.ok) {
    return NextResponse.json(
      {
        success: false,
        error: 'Le service est temporairement indisponible. Réessaie dans quelques instants.',
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Tu es bien inscrit sur la liste d’attente.',
  });
}

export async function GET() {
  return NextResponse.json({ error: 'Méthode non autorisée.' }, { status: 405 });
}
