import { logger } from '@/lib/logger';

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
