import crypto from 'crypto';

/**
 * ==============================================================================
 * SPÉCIFICATION OFFICIELLE DU PAYLOAD PULSE CHARIOW
 * ==============================================================================
 *
 * Repose UNIQUEMENT sur les 26 champs formellement observés et confirmés
 * lors des tests Pulse Chariow (chariow.com).
 * Aucun champ spéculatif ou non vérifié n'est inclus.
 */

export interface ChariowPulsePayload {
  /** Nom de l'événement (confirmé : "successful.sale") */
  event: string;

  /** Note descriptive présente uniquement lors des tests Pulse */
  note?: string;

  /** Données relatives à la vente */
  sale: {
    id: string;
    status: string; // Confirmé : "completed"
    amount: {
      value: number; // Montant entier (ex: 7990, 9999)
      currency: string; // Devise ISO (ex: "XAF", "USD")
      short?: string;
      formatted?: string;
    };
    created_at?: string;
    completed_at?: string | null;
    abandoned_at?: string | null;
    custom_fields?: Array<{ name: string; value: string }>;
  };

  /** Données relatives à la boutique */
  store: {
    id: string;
    url: string;
    name: string;
  };

  /** Données relatives au produit acheté */
  product: {
    id: string; // Identifiant technique Chariow du produit
    url: string;
    name: string;
    price: {
      value: number;
      currency: string;
      short?: string;
      formatted?: string;
    };
  };

  /** Données relatives au client */
  customer: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    phone?: string;
    country?: string;
  };
}

/**
 * Détecte si un payload correspond à une émission de test Pulse Chariow.
 * Exige au moins une condition formellement confirmée.
 */
export function isChariowTestPulse(payload: ChariowPulsePayload): boolean {
  if (payload.note === 'This is a test sale for pulse testing.') {
    return true;
  }
  if (typeof payload.sale?.id === 'string' && payload.sale.id.startsWith('test_sale_')) {
    return true;
  }
  if (typeof payload.product?.id === 'string' && payload.product.id.startsWith('test_product_')) {
    return true;
  }
  return false;
}

/**
 * ==============================================================================
 * VÉRIFICATION DE LA SIGNATURE HMAC-SHA256 CHARIOW
 * ==============================================================================
 *
 * Contrat officiel confirmé :
 * - Header exact : `x-chariow-signature`
 * - Format exact : `sha256=<64 caractères hexadécimaux minuscules>`
 * - Algorithme : HMAC-SHA256 sur les octets bruts du raw body
 * - Comparaison timing-safe des buffers pour prévenir les attaques temporelles.
 */
export function verifyChariowSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader || !secret || !rawBody) {
    return false;
  }

  const cleanHeader = signatureHeader.trim();
  const cleanSecret = secret.trim();

  // Le header doit débuter obligatoirement par 'sha256='
  const prefix = 'sha256=';
  if (!cleanHeader.startsWith(prefix)) {
    return false;
  }

  const receivedHex = cleanHeader.slice(prefix.length).toLowerCase();
  // Un digest SHA-256 en hexadécimal doit comporter exactement 64 caractères
  if (receivedHex.length !== 64) {
    return false;
  }

  try {
    const computedHmacHex = crypto
      .createHmac('sha256', cleanSecret)
      .update(rawBody, 'utf8')
      .digest('hex')
      .toLowerCase();

    const expectedBuffer = Buffer.from(computedHmacHex, 'utf8');
    const receivedBuffer = Buffer.from(receivedHex, 'utf8');

    if (expectedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
  } catch {
    return false;
  }
}
