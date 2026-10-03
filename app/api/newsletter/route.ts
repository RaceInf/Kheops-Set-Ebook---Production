import { NextRequest, NextResponse } from 'next/server';
import { NewsletterSchema } from '@/lib/NewsletterSchema';
import { getClientIp, parseSafeJsonBody, sanitizePlainText } from '@/lib/security';
import { checkServerRateLimit } from '@/lib/rateLimit';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { syncContactToBrevo } from '@/lib/brevo';
import { requireNewsletterConfig } from '@/lib/env/server';

export async function POST(req: NextRequest) {
  // 1. Vérification stricte des variables serveur obligatoires via requireNewsletterConfig()
  const configResult = requireNewsletterConfig();
  if (!configResult.isConfigured) {
    if (configResult.isProduction) {
      return NextResponse.json(
        {
          success: false,
          message: 'Le service est temporairement indisponible. Réessaie dans quelques instants.',
        },
        { status: 503 }
      );
    }

    // En développement local : retour explicite HTTP 503 (aucun faux succès)
    return NextResponse.json(
      {
        success: false,
        code: 'SERVICE_NOT_CONFIGURED',
        message: 'Service non configuré en local.',
        devNotice:
          'Simulation locale : le service n’est pas configuré. Aucune donnée n’a été envoyée.',
      },
      { status: 503 }
    );
  }

  try {
    // 2. Lire et vérifier la taille maximale du body JSON (max 8 KB)
    const bodyResult = await parseSafeJsonBody<Record<string, unknown>>(req);
    if (!bodyResult.ok) {
      return NextResponse.json(
        { error: 'Vérifie les informations saisies.' },
        { status: 400 }
      );
    }

    const rawBody = bodyResult.data;

    // 3. Vérifier le honeypot invisible
    if (typeof rawBody.website === 'string' && rawBody.website.trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    // 4. Appliquer la limitation de requêtes par IP (5 tentatives max en 15 minutes)
    const clientIp = getClientIp(req);
    const rateLimit = await checkServerRateLimit('newsletter', clientIp, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Trop de demandes. Réessaie dans quelques minutes.' },
        { status: 429 }
      );
    }

    // 5. Valider strictement firstName, email, consent, source et turnstileToken avec Zod
    const parsed = NewsletterSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstIssueMessage =
        parsed.error.issues[0]?.message || 'Vérifie les informations saisies.';
      return NextResponse.json({ error: firstIssueMessage }, { status: 400 });
    }

    const validData = parsed.data;

    // 6. Vérifier que consent === true
    if (validData.consent !== true) {
      return NextResponse.json(
        { error: 'Accepte les conditions pour recevoir le guide.' },
        { status: 400 }
      );
    }

    // 7. Vérifier le token Cloudflare Turnstile côté serveur
    const turnstileCheck = await verifyTurnstileToken(
      validData.turnstileToken,
      clientIp
    );
    if (!turnstileCheck.success) {
      return NextResponse.json(
        { error: 'La vérification de sécurité a échoué. Réessaie dans quelques instants.' },
        { status: 400 }
      );
    }

    // 8. Envoi réel vers l'API Brevo côté serveur uniquement
    const cleanFirstName = sanitizePlainText(validData.firstName);
    const cleanEmail = validData.email.trim().toLowerCase();

    await syncContactToBrevo({
      email: cleanEmail,
      firstName: cleanFirstName,
      source: validData.source,
      bookSlug: validData.bookSlug,
    });

    return NextResponse.json({
      success: true,
      message: 'Merci. Vérifie ta boîte email pour recevoir ton guide.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Une erreur est survenue. Réessaie dans quelques minutes.' },
      { status: 500 }
    );
  }
}
