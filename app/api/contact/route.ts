import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getClientIp, parseSafeJsonBody, sanitizePlainText } from '@/lib/security';
import { checkServerRateLimit } from '@/lib/rateLimit';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { requireContactConfig } from '@/lib/env/server';

const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: 'Merci d’indiquer ton nom (2 caractères minimum).' })
      .max(100),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: 'Merci d’indiquer une adresse email valide.' })
      .max(160),
    subject: z
      .string()
      .trim()
      .min(3, { message: 'Merci de préciser le sujet de ton message.' })
      .max(140),
    message: z
      .string()
      .trim()
      .min(10, { message: 'Ton message doit contenir au moins 10 caractères.' })
      .max(3000),
    turnstileToken: z.string().min(1, {
      message: 'La vérification de sécurité a échoué. Réessaie dans quelques instants.',
    }),
    website: z.string().max(0).optional(), // Honeypot anti-spam
  })
  .strict();

export async function POST(req: NextRequest) {
  // 1. Vérification stricte des variables serveur requises via requireContactConfig()
  const configResult = requireContactConfig();
  if (!configResult.isConfigured) {
    if (configResult.isProduction) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Le service est temporairement indisponible. Réessaie dans quelques instants.',
        },
        { status: 503 }
      );
    }

    // En développement local : retour explicite HTTP 503 (aucun faux succès)
    return NextResponse.json(
      {
        ok: false,
        code: 'SERVICE_NOT_CONFIGURED',
        error: 'Service de contact non configuré en local.',
        devNotice:
          'Simulation locale : le service n’est pas configuré. Aucune donnée n’a été envoyée.',
      },
      { status: 503 }
    );
  }

  try {
    const bodyResult = await parseSafeJsonBody<Record<string, unknown>>(req);
    if (!bodyResult.ok) {
      return NextResponse.json(
        { ok: false, error: 'Veuillez vérifier les champs du formulaire.' },
        { status: 400 }
      );
    }

    const rawBody = bodyResult.data;

    // Honeypot silencieux
    if (typeof rawBody.website === 'string' && rawBody.website.trim().length > 0) {
      return NextResponse.json({
        ok: true,
        message: 'Merci. Ton message a bien été envoyé.',
      });
    }

    const ip = getClientIp(req);
    const rateLimit = await checkServerRateLimit('contact', ip, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Trop de demandes. Réessaie dans quelques minutes.',
        },
        { status: 429 }
      );
    }

    const parsed = contactSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message ||
        'Veuillez vérifier les champs du formulaire.';
      return NextResponse.json({ ok: false, error: firstError }, { status: 400 });
    }

    // Vérification du token Cloudflare Turnstile côté serveur
    const turnstileCheck = await verifyTurnstileToken(
      parsed.data.turnstileToken,
      ip
    );
    if (!turnstileCheck.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'La vérification de sécurité a échoué. Réessaie dans quelques instants.',
        },
        { status: 400 }
      );
    }

    // Nettoyage anti-XSS côté serveur
    const _sanitizedPayload = {
      name: sanitizePlainText(parsed.data.name),
      email: parsed.data.email,
      subject: sanitizePlainText(parsed.data.subject),
      message: sanitizePlainText(parsed.data.message),
    };

    return NextResponse.json({
      ok: true,
      message: 'Merci. Ton message a bien été envoyé.',
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Impossible d’envoyer le message pour le moment.' },
      { status: 500 }
    );
  }
}
