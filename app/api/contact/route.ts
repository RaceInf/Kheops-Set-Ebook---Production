import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getClientIp,
  parseSafeJsonBody,
  sanitizePlainText,
  isAllowedOrigin,
} from '@/lib/security';
import { checkServerRateLimit } from '@/lib/rateLimit';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { requireContactConfig } from '@/lib/env/server';
import { logger } from '@/lib/logger';
import {
  syncContactFormMessage,
  sendContactNotificationEmail,
  sendContactAcknowledgmentEmail,
} from '@/lib/brevo';

const SAFE_TEXT_REGEX = /^[^\u0000-\u001F\u007F<>]+$/;

const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: 'Merci d’indiquer ton nom (2 caractères minimum).' })
      .max(100, { message: 'Nom trop long (100 caractères maximum).' })
      .regex(SAFE_TEXT_REGEX, { message: 'Nom non valide.' }),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: 'Merci d’indiquer une adresse email valide.' })
      .max(160, { message: 'Adresse email trop longue.' }),
    subject: z
      .string()
      .trim()
      .min(3, { message: 'Merci de préciser le sujet de ton message (3 caractères minimum).' })
      .max(140, { message: 'Sujet trop long (140 caractères maximum).' })
      .regex(SAFE_TEXT_REGEX, { message: 'Sujet non valide.' }),
    message: z
      .string()
      .trim()
      .min(10, { message: 'Ton message doit contenir au moins 10 caractères.' })
      .max(3000, { message: 'Ton message ne doit pas dépasser 3000 caractères.' }),
    turnstileToken: z.string().min(1, {
      message: 'La vérification de sécurité a échoué. Réessaie dans quelques instants.',
    }),
    website: z.string().max(0).optional(), // Honeypot anti-spam
  })
  .strict();

export async function POST(req: NextRequest) {
  // 1. Vérification méthode POST (HTTP 405)

  // 2. Vérification Content-Type JSON (HTTP 400)
  const contentType = req.headers.get('content-type');
  if (!contentType || !contentType.toLowerCase().includes('application/json')) {
    return NextResponse.json(
      { ok: false, error: 'Format de requête invalide (application/json attendu).' },
      { status: 400 }
    );
  }

  // 3. Contrôle de taille du body (8 KB max via parseSafeJsonBody)

  // 4. Rate Limiting par IP strict : 3 requêtes par 15 minutes
  const ip = getClientIp(req);
  const rateLimit = await checkServerRateLimit('contact', ip, 3, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    logger.security('contact_rate_limit_exceeded', { ip: logger.mask(ip) });
    return NextResponse.json(
      {
        ok: false,
        error: 'Trop de tentatives. Réessaie plus tard.',
      },
      { status: 429 }
    );
  }

  // 5. Lecture & parsing JSON sécurisé
  const bodyResult = await parseSafeJsonBody<Record<string, unknown>>(req);
  if (!bodyResult.ok) {
    return NextResponse.json(
      { ok: false, error: bodyResult.error || 'Veuillez vérifier les champs du formulaire.' },
      { status: 400 }
    );
  }

  const rawBody = bodyResult.data;

  // 6. Contrôle du Honeypot silencieux
  if (typeof rawBody.website === 'string' && rawBody.website.trim().length > 0) {
    logger.security('contact_honeypot_triggered', { ip: logger.mask(ip) });
    return NextResponse.json({
      ok: true,
      message: 'Merci. Ton message a bien été envoyé.',
    });
  }

  // 7. Validation Zod stricte côté serveur
  const parsed = contactSchema.safeParse(rawBody);
  if (!parsed.success) {
    const firstError =
      parsed.error.issues[0]?.message || 'Veuillez vérifier les champs du formulaire.';
    return NextResponse.json({ ok: false, error: firstError }, { status: 400 });
  }

  // 8. Vérification Cloudflare Turnstile côté serveur
  const turnstileCheck = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
  if (!turnstileCheck.success) {
    logger.security('contact_turnstile_failed', { ip: logger.mask(ip) });
    return NextResponse.json(
      {
        ok: false,
        error: 'La vérification de sécurité a échoué. Réessaie dans quelques instants.',
      },
      { status: 400 }
    );
  }

  // 9. Contrôle d'origine
  if (!isAllowedOrigin(req)) {
    logger.security('contact_invalid_origin', { ip: logger.mask(ip) });
    return NextResponse.json(
      { ok: false, error: 'Origine de requête non autorisée.' },
      { status: 403 }
    );
  }

  // 10. Vérification des prérequis de configuration serveur
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

  // 11. Traitement sécurisé du message (assainissement anti-XSS)
  const sanitizedPayload = {
    name: sanitizePlainText(parsed.data.name),
    email: parsed.data.email,
    subject: sanitizePlainText(parsed.data.subject),
    message: sanitizePlainText(parsed.data.message),
  };

  logger.audit('contact_message_received', {
    subject: sanitizedPayload.subject,
    email: logger.maskEmail(sanitizedPayload.email),
  });

  // 12. Synchronisation Brevo & Notification Email (Asynchrone et résilient)
  try {
    // Étape A : Synchronisation du contact dans Brevo
    const syncResult = await syncContactFormMessage(sanitizedPayload);
    if (!syncResult.ok) {
      logger.warn({
        event: 'contact_brevo_sync_unsuccessful',
        meta: {
          email: logger.maskEmail(sanitizedPayload.email),
          error: syncResult.error,
        },
      });
    }

    // Étape B : Envoi de l'email de notification Blueprint à l'administrateur
    const notifResult = await sendContactNotificationEmail(sanitizedPayload);
    if (!notifResult.ok) {
      logger.warn({
        event: 'contact_notification_email_unsuccessful',
        meta: {
          email: logger.maskEmail(sanitizedPayload.email),
          error: notifResult.error,
        },
      });
    }

    // Étape C : Envoi de l'accusé de réception automatique au visiteur (gracieux)
    sendContactAcknowledgmentEmail(sanitizedPayload).catch((ackErr) => {
      logger.warn({
        event: 'contact_acknowledgment_email_error',
        message: ackErr instanceof Error ? ackErr.message : 'Erreur accusé',
        meta: {
          email: logger.maskEmail(sanitizedPayload.email),
        },
      });
    });
  } catch (brevoErr) {
    logger.error({
      event: 'contact_processing_background_error',
      message: brevoErr instanceof Error ? brevoErr.message : 'Erreur inattendue Brevo',
      meta: {
        email: logger.maskEmail(sanitizedPayload.email),
      },
    });
  }

  return NextResponse.json({
    ok: true,
    message: 'Merci. Ton message a bien été envoyé.',
  });
}

export async function GET() {
  return NextResponse.json({ error: 'Méthode non autorisée.' }, { status: 405 });
}
