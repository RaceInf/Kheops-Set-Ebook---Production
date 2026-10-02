import { NextRequest, NextResponse } from 'next/server';
import { NewsletterSchema } from '@/lib/NewsletterSchema';
import { getClientIp, parseSafeJsonBody, sanitizePlainText } from '@/lib/security';
import { checkServerRateLimit } from '@/lib/rateLimit';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { syncContactToBrevo } from '@/lib/brevo';

export async function POST(req: NextRequest) {
  try {
    // 1. Lire et vérifier la taille maximale du body JSON (max 8 KB)
    const bodyResult = await parseSafeJsonBody<Record<string, unknown>>(req);
    if (!bodyResult.ok) {
      return NextResponse.json(
        { error: 'Vérifie les informations saisies.' },
        { status: 400 }
      );
    }

    const rawBody = bodyResult.data;

    // 2. Vérifier le honeypot invisible (si rempli par un bot, répondre comme une réussite générique sans appeler Brevo)
    if (typeof rawBody.website === 'string' && rawBody.website.trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    // 3. Appliquer la limitation de requêtes par IP (5 tentatives max en 15 minutes)
    const clientIp = getClientIp(req);
    const rateLimit = await checkServerRateLimit('newsletter', clientIp, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Trop de demandes. Réessaie dans quelques minutes.' },
        { status: 429 }
      );
    }

    // 4. Valider strictement firstName, email, consent, source et turnstileToken avec Zod
    const parsed = NewsletterSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstIssueMessage =
        parsed.error.issues[0]?.message || 'Vérifie les informations saisies.';
      return NextResponse.json({ error: firstIssueMessage }, { status: 400 });
    }

    const validData = parsed.data;

    // 5. Vérifier que consent === true
    if (validData.consent !== true) {
      return NextResponse.json(
        { error: 'Accepte les conditions pour recevoir le guide.' },
        { status: 400 }
      );
    }

    // 6. Vérifier le token Cloudflare Turnstile côté serveur avec TURNSTILE_SECRET_KEY
    const turnstileCheck = await verifyTurnstileToken(
      validData.turnstileToken,
      clientIp
    );
    if (!turnstileCheck.success) {
      return NextResponse.json(
        { error: 'Vérifie les informations saisies.' },
        { status: 400 }
      );
    }

    // 7. Normaliser les données et synchroniser avec Brevo (sans jamais exposer les détails Brevo)
    const cleanFirstName = sanitizePlainText(validData.firstName);
    const cleanEmail = validData.email.toLowerCase().trim();

    const brevoSync = await syncContactToBrevo({
      firstName: cleanFirstName,
      email: cleanEmail,
      source: validData.source,
      bookSlug: validData.bookSlug ? sanitizePlainText(validData.bookSlug) : undefined,
    });

    if (!brevoSync.ok) {
      return NextResponse.json(
        { error: 'Impossible de traiter la demande pour le moment.' },
        { status: 500 }
      );
    }

    // 8. Retourner uniquement la réponse neutre { success: true }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Impossible de traiter la demande pour le moment.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Méthode non autorisée.' }, { status: 405 });
}
