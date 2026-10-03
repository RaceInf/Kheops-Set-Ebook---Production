/**
 * ==============================================================================
 * CONFIGURATION DE SÉCURITÉ CHARIOW / PULSE (SOURCE UNIQUE DE VÉRITÉ SERVEUR)
 * ==============================================================================
 *
 * Ce fichier définit les règles de validation strictes appliquées par le webhook
 * POST /api/webhooks/chariow pour les ventes réelles.
 *
 * RÈGLES DE SÉCURITÉ ABSOLUE :
 * 1. Seul `product.id` constitue la preuve d'achat d'un produit (comparaison
 *    stricte avec `CHARIOW_CAPITAL_PRODUCT_ID` ou `CHARIOW_CODE_PRODUCT_ID`).
 * 2. `product.url` et `product.name` ne sont JAMAIS utilisés comme preuve.
 * 3. La devise pour une vente réelle Kheops Set doit obligatoirement être "XAF".
 * 4. Le montant entier `sale.amount.value` doit strictement figurer dans `allowedAmounts`.
 */

export interface ChariowProductSecurityRule {
  /** Slug interne unique du produit */
  productSlug: 'le-capital-du-batisseur' | 'le-code-du-batisseur';
  /** Identifiant produit technique exigé côté Chariow */
  chariowProductId: string;
  /** Devise strictement exigée (XAF) */
  expectedCurrency: 'XAF';
  /** Format entier confirmé */
  amountFormat: 'integer';
  /**
   * Montants autorisés strictement (valeurs entières en FCFA).
   * Tout montant hors de cette liste entraîne un rejet HTTP 400 immédiat.
   */
  allowedAmounts: number[];
}

export function getChariowSecurityRules(): Record<string, ChariowProductSecurityRule> {
  const capitalId = process.env.CHARIOW_CAPITAL_PRODUCT_ID || 'captaldubatisseur';
  const codeId = process.env.CHARIOW_CODE_PRODUCT_ID || 'codedubatisseur';

  return {
    'le-capital-du-batisseur': {
      productSlug: 'le-capital-du-batisseur',
      chariowProductId: capitalId,
      expectedCurrency: 'XAF',
      amountFormat: 'integer',
      allowedAmounts: [7990, 10000], // Prix promotionnel (7 990 FCFA) et prix normal (10 000 FCFA)
    },
    'le-code-du-batisseur': {
      productSlug: 'le-code-du-batisseur',
      chariowProductId: codeId,
      expectedCurrency: 'XAF',
      amountFormat: 'integer',
      allowedAmounts: [3995, 5000], // Prix promotionnel (3 995 FCFA) et prix normal (5 000 FCFA)
    },
  };
}

export interface ChariowValidationResult {
  valid: boolean;
  reason?: string;
  productSlug?: 'le-capital-du-batisseur' | 'le-code-du-batisseur';
}

/**
 * Valide strictement une vente réelle Chariow.
 * N'utilise que `productId`, `amountValue` et `currency`.
 */
export function validateChariowRealOrder(params: {
  productId?: string;
  amountValue?: number;
  currency?: string;
}): ChariowValidationResult {
  const { productId, amountValue, currency } = params;

  // 1. Validation de la présence de product.id
  if (!productId || productId.trim() === '') {
    return { valid: false, reason: 'Identifiant product.id absent du webhook.' };
  }

  const cleanProductId = productId.trim();
  const rules = getChariowSecurityRules();

  // 2. Recherche du produit par égalité stricte sur chariowProductId
  const matchedRule = Object.values(rules).find(
    (rule) => rule.chariowProductId === cleanProductId
  );

  if (!matchedRule) {
    return {
      valid: false,
      reason: 'Identifiant product.id non autorisé côté serveur.',
    };
  }

  // 3. Validation stricte de la devise (doit être XAF pour les ventes réelles Kheops Set)
  if (!currency || currency.trim().toUpperCase() !== 'XAF') {
    return {
      valid: false,
      reason: 'Devise non autorisée (seul XAF est accepté pour les ventes réelles).',
    };
  }

  // 4. Validation stricte du montant entier
  if (
    typeof amountValue !== 'number' ||
    Number.isNaN(amountValue) ||
    !Number.isInteger(amountValue)
  ) {
    return {
      valid: false,
      reason: 'Montant sale.amount.value manquant ou non entier.',
    };
  }

  // 5. Le montant doit appartenir strictement à allowedAmounts
  if (!matchedRule.allowedAmounts.includes(amountValue)) {
    return {
      valid: false,
      reason: 'Montant non autorisé pour ce produit.',
    };
  }

  return {
    valid: true,
    productSlug: matchedRule.productSlug,
  };
}
