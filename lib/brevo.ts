import { logger } from '@/lib/logger';
import { prisma } from '@/lib/db';

export interface BrevoSyncResult {
  ok: boolean;
  status?: number;
  error?: string;
}

/**
 * Résout l'identifiant numérique d'une liste Brevo à partir des variables serveur.
 */
function resolveBrevoListId(
  type:
    | 'PROTOCOLE_DU_BATISSEUR'
    | 'CLIENTS_CAPITAL_DU_BATISSEUR'
    | 'CLIENTS_CODE_DU_BATISSEUR'
    | 'CONTACTS'
): number | null {
  let rawId: string | undefined;

  switch (type) {
    case 'PROTOCOLE_DU_BATISSEUR':
      rawId = process.env.BREVO_PROTOCOL_LIST_ID;
      break;
    case 'CLIENTS_CAPITAL_DU_BATISSEUR':
      rawId = process.env.BREVO_CAPITAL_CUSTOMERS_LIST_ID;
      break;
    case 'CLIENTS_CODE_DU_BATISSEUR':
      rawId = process.env.BREVO_CODE_CUSTOMERS_LIST_ID;
      break;
    case 'CONTACTS':
      rawId = process.env.BREVO_CONTACTS_LIST_ID;
      break;
  }

  if (!rawId) return null;
  const parsed = Number(rawId);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

/**
 * Récupère les attributs existants d'un contact dans Brevo pour préserver INTERESTED_BOOK
 */
async function getExistingBrevoInterestedBooks(
  apiKey: string,
  email: string
): Promise<string[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'api-key': apiKey,
        },
        signal: controller.signal,
        cache: 'no-store',
      }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      return [];
    }

    const data = (await res.json()) as { attributes?: Record<string, unknown> };
    const rawInterest = data?.attributes?.INTERESTED_BOOK;

    if (Array.isArray(rawInterest)) {
      return rawInterest.map(String);
    }
    if (typeof rawInterest === 'string' && rawInterest.trim()) {
      return rawInterest.split(',').map((s) => s.trim());
    }

    return [];
  } catch {
    return [];
  }
}

/**
 * ==============================================================================
 * 1. SYNCHRONISATION DU PROTOCOLE DU BÂTISSEUR (/api/newsletter)
 * ==============================================================================
 */
export async function syncProtocolContact(params: {
  firstName: string;
  email: string;
}): Promise<BrevoSyncResult> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    if (process.env.NODE_ENV === 'production') {
      logger.error({
        event: 'brevo_protocol_sync_error',
        message: 'BREVO_API_KEY manquante en production',
      });
      return { ok: false, error: 'BREVO_API_KEY manquante en production' };
    }
    return { ok: false, error: 'DEV_SIMULATION' };
  }

  const cleanEmail = params.email.toLowerCase().trim();
  const listId = resolveBrevoListId('PROTOCOLE_DU_BATISSEUR');
  const consentDateIso = new Date().toISOString();

  // Attributs certifiés conformes (INTERESTED_BOOK n'est JAMAIS envoyé ici)
  const attributes: Record<string, unknown> = {
    FIRSTNAME: params.firstName.trim(),
    PRENOM: params.firstName.trim(),
    CONSENT_SOURCE: 'kheopsset_website',
    CONSENT_RESOURCE: 'protocole_du_batisseur',
    CONSENT_AT: consentDateIso,
  };

  const payload: Record<string, unknown> = {
    email: cleanEmail,
    updateEnabled: true,
    attributes,
    ...(listId ? { listIds: [listId] } : {}),
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeout);

    // Toute réponse HTTP de 200 à 299 est considérée comme un succès
    if (response.status >= 200 && response.status < 300) {
      logger.info({
        event: 'brevo_protocol_synced',
        statusCode: response.status,
      });
      return { ok: true, status: response.status };
    }

    logger.error({
      event: 'brevo_protocol_failed',
      statusCode: response.status,
      message: 'Réponse Brevo non-2xx',
    });
    return { ok: false, status: response.status };
  } catch (err) {
    logger.error({
      event: 'brevo_protocol_network_error',
      message: err instanceof Error ? err.message : 'Erreur réseau ou timeout',
    });
    return { ok: false };
  }
}

/**
 * ==============================================================================
 * 2. ACHETEURS CLIENTS PAYANTS (CHARIOW WEBHOOK UNIQUEMENT)
 * ==============================================================================
 */
export async function addCustomerToCapitalList(
  email: string,
  firstName?: string
): Promise<BrevoSyncResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return { ok: true };
  }

  const listId = resolveBrevoListId('CLIENTS_CAPITAL_DU_BATISSEUR');
  const cleanEmail = email.toLowerCase().trim();

  const payload = {
    email: cleanEmail,
    updateEnabled: true,
    attributes: {
      CLIENT_TYPE: 'capital_du_batisseur',
      ACHAT_DATE: new Date().toISOString(),
      ...(firstName ? { FIRSTNAME: firstName.trim() } : {}),
    },
    ...(listId ? { listIds: [listId] } : {}),
  };

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    return { ok: res.status >= 200 && res.status < 300, status: res.status };
  } catch {
    return { ok: false };
  }
}

export async function addCustomerToCodeList(
  email: string,
  firstName?: string
): Promise<BrevoSyncResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return { ok: true };
  }

  const listId = resolveBrevoListId('CLIENTS_CODE_DU_BATISSEUR');
  const cleanEmail = email.toLowerCase().trim();

  const payload = {
    email: cleanEmail,
    updateEnabled: true,
    attributes: {
      CLIENT_TYPE: 'code_du_batisseur',
      ACHAT_DATE: new Date().toISOString(),
      ...(firstName ? { FIRSTNAME: firstName.trim() } : {}),
    },
    ...(listId ? { listIds: [listId] } : {}),
  };

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    return { ok: res.status >= 200 && res.status < 300, status: res.status };
  } catch {
    return { ok: false };
  }
}

/**
 * Échappe les caractères HTML spéciaux pour prévenir toute injection dans les templates d'email.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * ==============================================================================
 * 3. SYNCHRONISATION CONTACT DU FORMULAIRE (/api/contact)
 * ==============================================================================
 * Crée ou met à jour le contact dans Brevo avec les attributs et la liste dédiée.
 */
export async function syncContactFormMessage(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<BrevoSyncResult> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    if (process.env.NODE_ENV === 'production') {
      logger.error({
        event: 'brevo_contact_sync_missing_key',
        message: 'BREVO_API_KEY absente en production pour la synchronisation du contact',
      });
      return { ok: false, error: 'BREVO_API_KEY_MANQUANTE' };
    }
    return { ok: true, status: 200 }; // Mode développement tolérant
  }

  const cleanEmail = params.email.toLowerCase().trim();
  const cleanName = params.name.trim();
  const listId = resolveBrevoListId('CONTACTS');
  const nowIso = new Date().toISOString();

  const attributes: Record<string, unknown> = {
    FIRSTNAME: cleanName,
    PRENOM: cleanName,
    CONTACT_SUBJECT: params.subject.trim(),
    CONTACT_SOURCE: 'formulaire_contact',
    CONTACT_AT: nowIso,
    LAST_CONTACT_DATE: nowIso,
  };

  const payload: Record<string, unknown> = {
    email: cleanEmail,
    updateEnabled: true,
    attributes,
    ...(listId ? { listIds: [listId] } : {}),
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeout);

    if (response.status >= 200 && response.status < 300) {
      logger.info({
        event: 'brevo_contact_synced',
        statusCode: response.status,
      });
      return { ok: true, status: response.status };
    }

    logger.error({
      event: 'brevo_contact_sync_failed',
      statusCode: response.status,
      message: 'Réponse Brevo non-2xx lors de la synchronisation du contact',
    });
    return { ok: false, status: response.status };
  } catch (err) {
    logger.error({
      event: 'brevo_contact_network_error',
      message: err instanceof Error ? err.message : 'Erreur réseau ou timeout',
    });
    return { ok: false };
  }
}

/**
 * ==============================================================================
 * 4. NOTIFICATION EMAIL INTERNE (DESIGN BLUEPRINT TECHNIQUE)
 * ==============================================================================
 * Envoie un email transactionnel à l'administrateur (BREVO_NOTIFICATION_EMAIL)
 * reprenant l'identité visuelle technique "Fiche de Transmission Chantier".
 */
export async function sendContactNotificationEmail(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt?: Date;
}): Promise<BrevoSyncResult> {
  const apiKey = process.env.BREVO_API_KEY;
  const notificationEmail = process.env.BREVO_NOTIFICATION_EMAIL;

  if (!notificationEmail || notificationEmail.trim() === '') {
    logger.warn({
      event: 'brevo_notification_email_not_configured',
      message: 'BREVO_NOTIFICATION_EMAIL non configuré : la notification interne ne sera pas envoyée.',
    });
    return { ok: false, error: 'BREVO_NOTIFICATION_EMAIL_ABSENT' };
  }

  if (!apiKey || apiKey.trim() === '') {
    if (process.env.NODE_ENV === 'production') {
      logger.error({
        event: 'brevo_notification_missing_key',
        message: 'BREVO_API_KEY absente en production pour l’envoi de notification email',
      });
      return { ok: false, error: 'BREVO_API_KEY_MANQUANTE' };
    }
    return { ok: true, status: 200 }; // Mode développement simulé
  }

  const senderEmail =
    process.env.BREVO_SENDER_EMAIL?.trim() ||
    process.env.BREVO_NO_REPLY_EMAIL?.trim() ||
    notificationEmail.trim();

  const cleanVisitorEmail = params.email.toLowerCase().trim();
  const cleanVisitorName = params.name.trim();
  const dateObj = params.submittedAt || new Date();

  // Formatage de date clair et professionnel
  const dateFormatted = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Africa/Douala', // Fuseau horaire ouest/centre africain de référence (UTC+1)
  }).format(dateObj);

  const refNumber = `KS-${dateObj.getFullYear()}${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getTime().toString().slice(-4)}`;

  const escapedName = escapeHtml(cleanVisitorName);
  const escapedEmail = escapeHtml(cleanVisitorEmail);
  const escapedSubject = escapeHtml(params.subject.trim());
  const formattedMessage = escapeHtml(params.message.trim()).replace(/\n/g, '<br />');

  // Génération du template HTML Blueprint Technique (HTML inline robuste et responsive)
  const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>[Contact Kheops Set] ${escapedSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0E0E0E; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #151515;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0E0E0E; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Conteneur principal (max 600px) -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #F5F4EF; border: 1px solid #565A5C; border-collapse: separate;">
          
          <!-- Liseré supérieur or (3px) -->
          <tr>
            <td style="background-color: #EEB149; height: 3px; line-height: 3px; font-size: 1px;">&nbsp;</td>
          </tr>

          <!-- EN-TÊTE : CARTOUCHE DE TRANSMISSION TECHNIQUE -->
          <tr>
            <td style="background-color: #090909; padding: 26px 28px; border-bottom: 2px solid #EEB149;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <!-- Repères de coupe techniques -->
                <tr>
                  <td colspan="2" style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #EEB149; letter-spacing: 2px; padding-bottom: 14px;">
                    [ + ] KHEOPS SET // SYSTÈMES D’INGÉNIERIE &middot; CANAL OFFICIEL [ + ]
                  </td>
                </tr>
                <tr>
                  <td valign="top" style="text-align: left;">
                    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 19px; font-weight: 800; letter-spacing: 2px; color: #FFFFFF; text-transform: uppercase;">
                      KHEOPS SET
                    </div>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #EEB149; letter-spacing: 1px; margin-top: 4px; font-weight: 600;">
                      DOSSIER DE CONTACT &middot; TRANSMISSION
                    </div>
                  </td>
                  <td valign="top" style="text-align: right;">
                    <span style="display: inline-block; padding: 5px 10px; background-color: #151515; border: 1px solid #EEB149; font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: bold; color: #EEB149; letter-spacing: 1.5px; text-transform: uppercase;">
                      ENTRANT
                    </span>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #A5A5A0; margin-top: 6px;">
                      FICHE N&deg; ${refNumber}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="border-top: 1px solid #222222; margin-top: 14px; padding-top: 12px;">
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #F3F1EB; line-height: 1.4;">
                      &bull; REÇU LE : <strong style="color: #FFFFFF;">${dateFormatted}</strong> (UTC+1)
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CORPS : TABLEAU DE DONNÉES DU BLUEPRINT -->
          <tr>
            <td style="background-color: #F5F4EF; padding: 28px 28px 20px 28px;">
              
              <!-- Sous-titre cartouche -->
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: bold; color: #565A5C; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 18px; border-bottom: 1px dashed #C8C5BB; padding-bottom: 6px;">
                ORDRE DE TRANSMISSION DU VISITEUR
              </div>

              <!-- Tableau de synthèse expéditeur -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 22px; background-color: #FFFFFF; border: 1px solid #DDD9D0;">
                <tr>
                  <td width="32%" style="padding: 12px 14px; font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: bold; color: #565A5C; background-color: #EFECE3; border-bottom: 1px solid #DDD9D0; text-transform: uppercase;">
                    [01. EXPÉDITEUR]
                  </td>
                  <td style="padding: 12px 14px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: bold; color: #090909; border-bottom: 1px solid #DDD9D0;">
                    ${escapedName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 14px; font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: bold; color: #565A5C; background-color: #EFECE3; border-bottom: 1px solid #DDD9D0; text-transform: uppercase;">
                    [02. CANAL DIRECT]
                  </td>
                  <td style="padding: 12px 14px; font-family: 'Courier New', Courier, monospace; font-size: 13px; color: #090909; border-bottom: 1px solid #DDD9D0;">
                    <a href="mailto:${escapedEmail}" style="color: #090909; font-weight: bold; text-decoration: underline;">${escapedEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 14px; font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: bold; color: #565A5C; background-color: #EFECE3; text-transform: uppercase;">
                    [03. OBJET]
                  </td>
                  <td style="padding: 12px 14px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600; color: #090909;">
                    ${escapedSubject}
                  </td>
                </tr>
              </table>

              <!-- Bloc « CONTENU DE LA DÉPÊCHE » -->
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: bold; color: #565A5C; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px;">
                [04. CONTENU DE LA DÉPÊCHE]
              </div>
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; border: 1px solid #DDD9D0; border-left: 4px solid #EEB149;">
                <tr>
                  <td style="padding: 20px 22px;">
                    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.65; color: #151515;">
                      ${formattedMessage}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- BOUTON D'INTERVENTION RAPIDE -->
              <div style="margin-top: 26px; text-align: center;">
                <a href="mailto:${escapedEmail}?subject=Re:%20${encodeURIComponent(params.subject)}" style="display: inline-block; background-color: #090909; border: 2px solid #EEB149; color: #EEB149; font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; padding: 14px 26px; text-decoration: none;">
                  ACTIONNER LA R&Eacute;PONSE PAR EMAIL &rarr;
                </a>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #565A5C; margin-top: 8px;">
                  (Ouvre directement un email vers ${escapedEmail})
                </div>
              </div>

            </td>
          </tr>

          <!-- PIED DE PAGE : CARTOUCHE DE CLÔTURE -->
          <tr>
            <td style="background-color: #090909; padding: 24px 28px; border-top: 2px solid #EEB149; text-align: center;">
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: bold; color: #EEB149; letter-spacing: 1.5px; margin-bottom: 8px;">
                LES MOTS NE CONSTRUISENT RIEN. LES ACTES, OUI.
              </div>
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #A5A5A0; margin-bottom: 10px;">
                <a href="https://kheops-set-ebook-mu.vercel.app" style="color: #A5A5A0; text-decoration: underline;">https://kheops-set-ebook-mu.vercel.app</a>
              </div>
              <div style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; color: #666666; line-height: 1.4;">
                Ceci est une notification automatique du formulaire de contact Kheops Set.<br>
                Pour r&eacute;pondre au visiteur, clique sur le bouton ci-dessus ou r&eacute;ponds directement &agrave; ce message.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const payload = {
    sender: {
      name: 'Atelier Kheops Set',
      email: senderEmail,
    },
    to: [
      {
        email: notificationEmail.trim(),
        name: 'Kheops Set Admin',
      },
    ],
    replyTo: {
      email: cleanVisitorEmail,
      name: cleanVisitorName,
    },
    subject: `[Contact Kheops Set] ${params.subject.trim()} — ${cleanVisitorName}`,
    htmlContent,
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeout);

    if (response.status >= 200 && response.status < 300) {
      logger.info({
        event: 'brevo_contact_notification_sent',
        statusCode: response.status,
      });
      return { ok: true, status: response.status };
    }

    logger.error({
      event: 'brevo_contact_notification_failed',
      statusCode: response.status,
      message: 'Échec de l’envoi de la notification email via Brevo SMTP',
    });
    return { ok: false, status: response.status };
  } catch (err) {
    logger.error({
      event: 'brevo_contact_notification_network_error',
      message: err instanceof Error ? err.message : 'Erreur réseau ou timeout',
    });
    return { ok: false };
  }
}

/**
 * ==============================================================================
 * 5. ACCUSÉ DE RÉCEPTION AUTOMATIQUE AU VISITEUR (OPTIONNEL & GRACIEUX)
 * ==============================================================================
 * Envoie un email de courtoisie sobre confirmant la bonne réception sous 24-48h.
 */
export async function sendContactAcknowledgmentEmail(params: {
  name: string;
  email: string;
  subject: string;
}): Promise<BrevoSyncResult> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return { ok: true };
  }

  const senderEmail =
    process.env.BREVO_SENDER_EMAIL?.trim() ||
    process.env.BREVO_NO_REPLY_EMAIL?.trim() ||
    process.env.BREVO_NOTIFICATION_EMAIL?.trim();

  if (!senderEmail) {
    return { ok: false, error: 'NO_SENDER_EMAIL' };
  }

  const cleanVisitorEmail = params.email.toLowerCase().trim();
  const cleanVisitorName = params.name.trim();
  const escapedName = escapeHtml(cleanVisitorName);
  const escapedSubject = escapeHtml(params.subject.trim());

  const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kheops Set — Message reçu</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0E0E0E; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #151515;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0E0E0E; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; background-color: #F5F4EF; border: 1px solid #565A5C;">
          
          <!-- Liseré supérieur or -->
          <tr>
            <td style="background-color: #EEB149; height: 3px; font-size: 1px; line-height: 3px;">&nbsp;</td>
          </tr>

          <!-- En-tête -->
          <tr>
            <td style="background-color: #090909; padding: 24px 26px; border-bottom: 1px solid #EEB149;">
              <div style="font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: 800; letter-spacing: 2px; color: #FFFFFF; text-transform: uppercase;">
                KHEOPS SET
              </div>
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #EEB149; letter-spacing: 1px; margin-top: 4px;">
                ACCUS&Eacute; D’ENREGISTREMENT &middot; CANAL OFFICIEL
              </div>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 28px 26px; background-color: #F5F4EF; font-size: 14px; line-height: 1.6; color: #151515;">
              <p style="margin-top: 0; font-weight: bold; font-size: 15px;">
                Bonjour ${escapedName},
              </p>
              <p>
                Ton message concernant &laquo;&nbsp;<strong>${escapedSubject}</strong>&nbsp;&raquo; a bien &eacute;t&eacute; transmis &agrave; l’atelier Kheops Set.
              </p>
              <p style="background-color: #FFFFFF; border-left: 3px solid #EEB149; padding: 12px 14px; font-family: 'Courier New', Courier, monospace; font-size: 12px; color: #333333; margin: 18px 0;">
                D&Eacute;LAI DE TRAITEMENT : 24 &agrave; 48 heures ouvr&eacute;es (du lundi au vendredi).
              </p>
              <p>
                Nous examinons chaque demande avec lucidit&eacute; et pr&eacute;cision pour t'apporter une r&eacute;ponse claire.
              </p>
              <p style="margin-bottom: 24px;">
                En attendant notre retour, tu peux consulter les ressources et outils d'ing&eacute;nierie disponibles sur notre plateforme :
              </p>

              <!-- Liens utiles -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="50%" style="padding-right: 8px;">
                    <a href="https://kheops-set-ebook-mu.vercel.app/faq" style="display: block; text-align: center; background-color: #090909; color: #FFFFFF; border: 1px solid #565A5C; padding: 10px 14px; font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: bold; text-decoration: none;">
                      CONSULTER LA FAQ &rarr;
                    </a>
                  </td>
                  <td width="50%" style="padding-left: 8px;">
                    <a href="https://kheops-set-ebook-mu.vercel.app/ebooks" style="display: block; text-align: center; background-color: #EEB149; color: #090909; border: 1px solid #EEB149; padding: 10px 14px; font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: bold; text-decoration: none;">
                      VOIR LES EBOOKS &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin-top: 28px; margin-bottom: 0; font-family: 'Courier New', Courier, monospace; font-size: 12px; color: #565A5C;">
                L’&Eacute;quipe Kheops Set &middot; L’Acier Bienveillant
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #090909; padding: 18px 26px; border-top: 1px solid #EEB149; text-align: center;">
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: bold; color: #EEB149; letter-spacing: 1px;">
                LES MOTS NE CONSTRUISENT RIEN. LES ACTES, OUI.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const payload = {
    sender: {
      name: 'Atelier Kheops Set',
      email: senderEmail,
    },
    to: [
      {
        email: cleanVisitorEmail,
        name: cleanVisitorName,
      },
    ],
    subject: 'Kheops Set — Message reçu',
    htmlContent,
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeout);

    if (response.status >= 200 && response.status < 300) {
      logger.info({
        event: 'brevo_contact_acknowledgment_sent',
        statusCode: response.status,
      });
      return { ok: true, status: response.status };
    }

    return { ok: false, status: response.status };
  } catch {
    return { ok: false };
  }
}

/**
 * ==============================================================================
 * 5. TABLEAU DE BORD MARKETING & STATISTIQUES BREVO
 * ==============================================================================
 */

export interface BrevoMarketingListInfo {
  id: number | null;
  name: string;
  count: number;
  description: string;
}

export interface BrevoMarketingStats {
  isConfigured: boolean;
  totalSent: number;
  totalDelivered: number;
  uniqueOpens: number;
  uniqueClicks: number;
  openRate: string;
  clickRate: string;
  lists: {
    protocol: BrevoMarketingListInfo;
    capitalBuyers: BrevoMarketingListInfo;
    codeBuyers: BrevoMarketingListInfo;
    contactPublic: BrevoMarketingListInfo;
  };
  totalAudience: number;
}

/**
 * Récupère le nombre d'abonnés d'une liste Brevo
 */
async function fetchBrevoListSubscribers(
  apiKey: string,
  listId: number | null
): Promise<number | null> {
  if (!listId) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`https://api.brevo.com/v3/contacts/lists/${listId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'api-key': apiKey,
      },
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    return Number(data.uniqueSubscribers ?? data.totalSubscribers ?? 0);
  } catch {
    return null;
  }
}

/**
 * Récupère les statistiques SMTP globales de Brevo (derniers 30 jours)
 */
async function fetchBrevoSmtpReports(apiKey: string): Promise<{
  delivered: number;
  opens: number;
  clicks: number;
  requests: number;
} | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://api.brevo.com/v3/smtp/statistics/reports?days=30', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'api-key': apiKey,
      },
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    const reports = Array.isArray(data?.reports) ? data.reports : [];

    let delivered = 0;
    let opens = 0;
    let clicks = 0;
    let requests = 0;

    for (const r of reports) {
      delivered += Number(r.delivered || 0);
      opens += Number(r.uniqueOpens || r.opens || 0);
      clicks += Number(r.uniqueClicks || r.clicks || 0);
      requests += Number(r.requests || 0);
    }

    return { delivered, opens, clicks, requests };
  } catch {
    return null;
  }
}

/**
 * Récupère les métriques marketing complètes de Brevo croisées avec la base Prisma
 */
export async function getBrevoMarketingStats(): Promise<BrevoMarketingStats> {
  const apiKey = process.env.BREVO_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey.trim() !== '');

  const protocolListId = resolveBrevoListId('PROTOCOLE_DU_BATISSEUR');
  const capitalListId = resolveBrevoListId('CLIENTS_CAPITAL_DU_BATISSEUR');
  const codeListId = resolveBrevoListId('CLIENTS_CODE_DU_BATISSEUR');
  const contactListId = resolveBrevoListId('CONTACTS');

  // 1. Récupération des comptages locaux Prisma en parallèle
  let dbProtocolCount = 0;
  let dbCapitalCount = 0;
  let dbCodeCount = 0;
  let dbContactCount = 0;

  try {
    const [protocolLeads, capitalOrders, codeOrders, contactLeads] = await Promise.all([
      prisma.lead.count({ where: { source: 'protocole_du_batisseur' } }),
      prisma.order.count({ where: { productSlug: { in: ['le-capital-du-batisseur', 'captaldubatisseur'] } } }),
      prisma.order.count({ where: { productSlug: { in: ['le-code-du-batisseur', 'codedubatisseur'] } } }),
      prisma.lead.count({ where: { source: 'formulaire_contact' } }),
    ]);
    dbProtocolCount = protocolLeads;
    dbCapitalCount = capitalOrders;
    dbCodeCount = codeOrders;
    dbContactCount = contactLeads;
  } catch (err) {
    console.warn('[Prisma stats count warning]:', err);
  }

  // 2. Si Brevo est configuré, interroger l'API Brevo v3
  let brevoReports: { delivered: number; opens: number; clicks: number; requests: number } | null = null;
  let brevoProtocolCount: number | null = null;
  let brevoCapitalCount: number | null = null;
  let brevoCodeCount: number | null = null;
  let brevoContactCount: number | null = null;

  if (isConfigured && apiKey) {
    const [reports, pCount, capCount, cdCount, cntCount] = await Promise.all([
      fetchBrevoSmtpReports(apiKey),
      fetchBrevoListSubscribers(apiKey, protocolListId),
      fetchBrevoListSubscribers(apiKey, capitalListId),
      fetchBrevoListSubscribers(apiKey, codeListId),
      fetchBrevoListSubscribers(apiKey, contactListId),
    ]);
    brevoReports = reports;
    brevoProtocolCount = pCount;
    brevoCapitalCount = capCount;
    brevoCodeCount = cdCount;
    brevoContactCount = cntCount;
  }

  const finalProtocolCount = brevoProtocolCount ?? dbProtocolCount;
  const finalCapitalCount = brevoCapitalCount ?? dbCapitalCount;
  const finalCodeCount = brevoCodeCount ?? dbCodeCount;
  const finalContactCount = brevoContactCount ?? dbContactCount;

  const totalDelivered = brevoReports?.delivered ?? 0;
  const totalSent = brevoReports?.requests ?? totalDelivered;
  const uniqueOpens = brevoReports?.opens ?? 0;
  const uniqueClicks = brevoReports?.clicks ?? 0;

  const openRate = totalDelivered > 0 ? `${((uniqueOpens / totalDelivered) * 100).toFixed(1)}%` : '0.0%';
  const clickRate = totalDelivered > 0 ? `${((uniqueClicks / totalDelivered) * 100).toFixed(1)}%` : '0.0%';
  const totalAudience = finalProtocolCount + finalCapitalCount + finalCodeCount + finalContactCount;

  return {
    isConfigured,
    totalSent,
    totalDelivered,
    uniqueOpens,
    uniqueClicks,
    openRate,
    clickRate,
    lists: {
      protocol: {
        id: protocolListId,
        name: 'Protocole du Bâtisseur',
        count: finalProtocolCount,
        description: 'Prospects ayant téléchargé le guide gratuit de 6 pages.',
      },
      capitalBuyers: {
        id: capitalListId,
        name: 'Acheteurs — Le Capital du Bâtisseur',
        count: finalCapitalCount,
        description: 'Clients ayant commandé l’ebook de 49 pages via Chariow.',
      },
      codeBuyers: {
        id: codeListId,
        name: 'Acheteurs — Le Code du Bâtisseur',
        count: finalCodeCount,
        description: 'Clients ayant acquis le manuel d’ingénierie personnelle.',
      },
      contactPublic: {
        id: contactListId,
        name: 'Contacts & Formulaires Publics',
        count: finalContactCount,
        description: 'Messages reçus via le formulaire officiel de contact.',
      },
    },
    totalAudience,
  };
}

/**
 * Envoie un email de relance ou campagne marketing via l'API Brevo v3 SMTP
 */
export async function sendBrevoMarketingEmail(params: {
  recipients: Array<{ email: string; name?: string }>;
  subject: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
}): Promise<{ ok: boolean; count: number; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return {
      ok: false,
      count: 0,
      error: 'Clé BREVO_API_KEY manquante dans les variables d’environnement.',
    };
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'contact@kheops-set.com';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kheops-set-ebook-mu.vercel.app';
  const ctaUrl = params.ctaUrl || `${siteUrl}/ebooks/le-capital-du-batisseur`;
  const ctaText = params.ctaText || 'ACCÉDER AU PLAN';

  // Formatage HTML luxe et sobre Kheops Set (L'Acier Bienveillant)
  const paragraphs = params.message
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.8; color: #F3F1EB;">${p}</p>`)
    .join('');

  const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>${params.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #090909; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #FFFFFF;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #090909; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #151515; border: 1px solid #565A5C; border-top: 3px solid #EEB149;">
          <!-- En-tête -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; border-bottom: 1px solid #222222;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: bold; color: #EEB149; letter-spacing: 2px; text-transform: uppercase;">
                      KHEOPS SET &middot; NOTE TECHNIQUE
                    </div>
                    <div style="font-size: 18px; font-weight: bold; color: #FFFFFF; margin-top: 4px; text-transform: uppercase;">
                      ${params.subject}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenu -->
          <tr>
            <td style="padding: 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              ${paragraphs}

              <!-- Bouton CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 32px 0 24px 0;">
                <tr>
                  <td align="center" style="background-color: #EEB149; padding: 14px 28px;">
                    <a href="${ctaUrl}" style="color: #090909; font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: bold; text-decoration: none; letter-spacing: 1.5px; text-transform: uppercase; display: inline-block;">
                      ${ctaText} &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #282828; font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #A5A5A0; line-height: 1.6;">
                KHEOPS SET &middot; L'Acier Bienveillant<br>
                Une vie est un chantier. Le paraître consomme, le capital construit.
              </div>
            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="background-color: #090909; padding: 20px 32px; border-top: 1px solid #222222; text-align: center;">
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #565A5C;">
                Cet email est réservé aux bâtisseurs inscrits sur Kheops Set.<br>
                Tu peux te désinscrire à tout moment depuis le lien sécurisé en bas de page.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // Brevo SMTP autorise l'envoi vers plusieurs destinataires
  let sentCount = 0;

  // On envoie par lots de 50 pour respecter les quotas et la sécurité
  const BATCH_SIZE = 50;
  for (let i = 0; i < params.recipients.length; i += BATCH_SIZE) {
    const batch = params.recipients.slice(i, i + BATCH_SIZE);

    const payload = {
      sender: {
        name: 'Kheops Set',
        email: senderEmail,
      },
      to: batch.map((r) => ({
        email: r.email,
        name: r.name || 'Bâtisseur',
      })),
      subject: params.subject,
      htmlContent,
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeout);

      if (res.ok) {
        sentCount += batch.length;
      } else {
        const errorText = await res.text();
        console.error('[Brevo Marketing Send Error]:', errorText);
      }
    } catch (err) {
      console.error('[Brevo Batch Send Exception]:', err);
    }
  }

  // Journalisation dans SystemLog
  try {
    await prisma.systemLog.create({
      data: {
        level: 'INFO',
        event: 'marketing_manual_relance_sent',
        message: `Campagne « ${params.subject} » envoyée à ${sentCount} destinataires.`,
        meta: JSON.stringify({
          subject: params.subject,
          recipientsCount: params.recipients.length,
          deliveredBatches: sentCount,
        }),
      },
    });
  } catch (e) {
    console.warn('[Prisma SystemLog save warning]:', e);
  }

  return {
    ok: sentCount > 0,
    count: sentCount,
    error: sentCount === 0 ? 'Aucun email n’a pu être envoyé via l’API Brevo.' : undefined,
  };
}
