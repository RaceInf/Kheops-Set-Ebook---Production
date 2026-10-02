import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getClientIp, parseSafeJsonBody, sanitizePlainText } from '@/lib/security';
import { checkServerRateLimit } from '@/lib/rateLimit';

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
    website: z.string().max(0).optional(), // Honeypot anti-spam
  })
  .strict();

export async function POST(req: NextRequest) {
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
      {
        ok: false,
        error: 'Impossible de traiter la demande pour le moment.',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Méthode non autorisée.' }, { status: 405 });
}
