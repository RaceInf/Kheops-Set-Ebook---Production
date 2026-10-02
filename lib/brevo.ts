import type { NewsletterSource } from '@/lib/NewsletterSchema';

export type BrevoListKey =
  | 'PROTOCOLE_DU_BATISSEUR'
  | 'LIVRES_A_VENIR'
  | 'CLIENTS_CAPITAL_DU_BATISSEUR'
  | 'CLIENTS_CODE_DU_BATISSEUR';

export interface BrevoSyncParams {
  firstName: string;
  email: string;
  source: NewsletterSource;
  bookSlug?: string;
}

export interface BrevoSyncResult {
  ok: boolean;
}

/**
 * Résout l'identifiant numérique de la liste Brevo à partir des variables d'environnement serveur.
 */
function resolveBrevoListId(source: NewsletterSource): number | null {
  const rawId =
    source === 'protocole-du-batisseur'
      ? process.env.BREVO_PROTOCOL_LIST_ID
      : process.env.BREVO_UPCOMING_BOOKS_LIST_ID;

  if (!rawId) return null;
  const parsed = Number(rawId);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

/**
 * Ajoute ou met à jour un contact dans Brevo côté serveur uniquement.
 * Si l'email existe déjà, updateEnabled: true met à jour le contact silencieusement
 * sans jamais révéler au visiteur que l'adresse était déjà inscrite.
 */
export async function syncContactToBrevo(
  params: BrevoSyncParams
): Promise<BrevoSyncResult> {
  const apiKey = process.env.BREVO_API_KEY;

  // En mode développement / prévisualisation sans clé API Brevo configurée,
  // simule un succès propre sans exposer d'erreur interne.
  if (!apiKey || apiKey.trim() === '') {
    return { ok: true };
  }

  const listId = resolveBrevoListId(params.source);
  const consentDateIso = new Date().toISOString();
  
  // Mapping pour l'attribut INTERESTED_BOOK (choix multiple Brevo)
  const bookMap: Record<string, string> = {
    'laudace-de-transcender': '1',
    'eveille-le-cerveau-entrepreneurial': '2',
  };

  const attributes: Record<string, unknown> = {
    FIRSTNAME: params.firstName.trim(),
    PRENOM: params.firstName.trim(),
    CONSENT_DATE: consentDateIso,
  };

  if (params.source === 'protocole-du-batisseur') {
    attributes.SOURCE = 'protocole_du_batisseur';
  } else if (params.source === 'livres-a-venir' && params.bookSlug) {
    attributes.SOURCE = 'livres_a_venir';
    const choice = bookMap[params.bookSlug];
    if (choice) {
      attributes.INTERESTED_BOOK = choice;
    }
  }

  const payload: Record<string, unknown> = {
    email: params.email.toLowerCase().trim(),
    updateEnabled: true,
    attributes,
    ...(listId ? { listIds: [listId] } : {}),
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

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

    // 201 = créé, 204 = mis à jour (si email déjà existant)
    if (response.ok || response.status === 201 || response.status === 204) {
      return { ok: true };
    }

    return { ok: false };
  } catch {
    return { ok: false };
  }
}

/**
 * Modèle d'email transactionnel / automatisation Brevo prêt à copier-coller.
 * Utilisé pour la livraison de « Le Protocole du Bâtisseur ».
 */
export const BREVO_DELIVERY_EMAIL_TEMPLATE = {
  subject: 'Ton Protocole du Bâtisseur',
  preheader: 'Ton guide est prêt à télécharger.',
  textBody: `Bonjour {{ contact.FIRSTNAME }},

Voici ton guide.

TÉLÉCHARGER LE PROTOCOLE :
[LIEN_PDF_PROTOCOLE_À_AJOUTER]

---

Le chantier continue sur WhatsApp.
Rejoins le canal pour recevoir les prochains outils, les annonces et les publications de Kheops Set :
REJOINDRE LE CANAL : https://chat.whatsapp.com/JM5y9X4rV3lEmds6fVr5vz

Tu peux aussi suivre Kheops Set sur Facebook :
SUIVRE SUR FACEBOOK : [LIEN_FACEBOOK_À_AJOUTER]

---
Tu reçois cet email parce que tu as demandé Le Protocole du Bâtisseur.
Tu peux te désinscrire à tout moment.`,
};
