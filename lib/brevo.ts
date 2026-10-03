import type { NewsletterSource } from '@/lib/NewsletterSchema';
import { logger } from '@/lib/logger';

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
  status?: number;
}

/**
 * Résout l'identifiant numérique d'une liste Brevo à partir des variables d'environnement serveur.
 */
function resolveBrevoListId(key: BrevoListKey | NewsletterSource): number | null {
  let rawId: string | undefined;

  switch (key) {
    case 'protocole-du-batisseur':
    case 'PROTOCOLE_DU_BATISSEUR':
      rawId = process.env.BREVO_PROTOCOL_LIST_ID;
      break;
    case 'livres-a-venir':
    case 'LIVRES_A_VENIR':
      rawId = process.env.BREVO_UPCOMING_BOOKS_LIST_ID;
      break;
    case 'CLIENTS_CAPITAL_DU_BATISSEUR':
      rawId = process.env.BREVO_CAPITAL_CUSTOMERS_LIST_ID;
      break;
    case 'CLIENTS_CODE_DU_BATISSEUR':
      rawId = process.env.BREVO_CODE_CUSTOMERS_LIST_ID;
      break;
    default:
      rawId = undefined;
  }

  if (!rawId) return null;
  const parsed = Number(rawId);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

/**
 * Récupère les attributs existants d'un contact dans Brevo (pour préserver INTERESTED_BOOK)
 */
async function getExistingBrevoContact(
  apiKey: string,
  email: string
): Promise<{ exists: boolean; interestedBooks: string[] }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'api-key': apiKey,
      },
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { exists: false, interestedBooks: [] };
    }

    const data = (await res.json()) as { attributes?: Record<string, unknown> };
    const rawInterest = data?.attributes?.INTERESTED_BOOK;
    let list: string[] = [];

    if (Array.isArray(rawInterest)) {
      list = rawInterest.map(String);
    } else if (typeof rawInterest === 'string' && rawInterest.trim()) {
      list = rawInterest.split(',').map((s) => s.trim());
    }

    return { exists: true, interestedBooks: list };
  } catch {
    return { exists: false, interestedBooks: [] };
  }
}

/**
 * Ajoute ou met à jour un contact dans Brevo côté serveur uniquement.
 * Si l'email existe déjà, updateEnabled: true met à jour le contact silencieusement.
 */
export async function syncContactToBrevo(
  params: BrevoSyncParams
): Promise<BrevoSyncResult> {
  const apiKey = process.env.BREVO_API_KEY;

  // En mode développement / prévisualisation sans clé API Brevo configurée,
  // simule un succès propre sans bloquer les tests locaux.
  if (!apiKey || apiKey.trim() === '') {
    logger.info({
      event: 'brevo_sync_dev_mode',
      source: params.source,
      message: 'Clé BREVO_API_KEY absente, simulation de succès.',
    });
    return { ok: true };
  }

  const cleanEmail = params.email.toLowerCase().trim();
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
      // Préserver les intérêts déjà existants sans les écraser
      const existing = await getExistingBrevoContact(apiKey, cleanEmail);
      const mergedSet = new Set(existing.interestedBooks);
      mergedSet.add(choice);
      // Brevo accepte un tableau pour les types choix multiples
      attributes.INTERESTED_BOOK = Array.from(mergedSet);
    }
  }

  const payload: Record<string, unknown> = {
    email: cleanEmail,
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

    if (response.ok || response.status === 201 || response.status === 204) {
      logger.info({
        event: 'brevo_contact_synced',
        source: params.source,
        bookSlug: params.bookSlug,
        statusCode: response.status,
      });
      return { ok: true, status: response.status };
    }

    logger.error({
      event: 'brevo_sync_failed',
      source: params.source,
      statusCode: response.status,
      message: 'Réponse Brevo non-2xx',
    });
    return { ok: false, status: response.status };
  } catch (err) {
    logger.error({
      event: 'brevo_network_error',
      source: params.source,
      message: err instanceof Error ? err.message : 'Timeout ou réseau',
    });
    return { ok: false };
  }
}

/**
 * Ajoute un client confirmé à la liste des acheteurs du Capital du Bâtisseur (serveur uniquement).
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

    return { ok: res.ok || res.status === 201 || res.status === 204 };
  } catch {
    return { ok: false };
  }
}

/**
 * Ajoute un client confirmé à la liste des acheteurs du Code du Bâtisseur (serveur uniquement).
 */
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

    return { ok: res.ok || res.status === 201 || res.status === 204 };
  } catch {
    return { ok: false };
  }
}
