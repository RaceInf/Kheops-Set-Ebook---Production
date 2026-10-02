import { NextRequest, NextResponse } from 'next/server';
import {
  getProductBySlug,
  calculatePriceInfo,
  getChariowCheckoutUrl,
} from '@/lib/products';
import { getClientIp, isAllowedExternalUrl } from '@/lib/security';
import { checkServerRateLimit } from '@/lib/rateLimit';

/**
 * Architecture préparée pour le futur checkout API Chariow :
 * - Trouve le produit dans la whitelist serveur uniquement.
 * - Lit le prix et l'identifiant Chariow côté serveur (ne fait jamais confiance au navigateur).
 * - N'accepte aucune URL de redirection externe envoyée par le client.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ip = getClientIp(req);
  const rateLimit = await checkServerRateLimit('checkout', ip, 10, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Trop de demandes. Réessaie dans quelques minutes.' },
      { status: 429 }
    );
  }

  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product || product.isComingSoon) {
    return NextResponse.json(
      { ok: false, error: 'Produit introuvable ou non disponible.' },
      { status: 404 }
    );
  }

  const priceInfo = calculatePriceInfo(product);
  const serverChariowProductId =
    product.slug === 'le-capital-du-batisseur'
      ? process.env.CHARIOW_CAPITAL_PRODUCT_ID
      : process.env.CHARIOW_CODE_PRODUCT_ID;

  // TODO: Lorsque l'API directe Chariow (CHARIOW_API_KEY) est activée en production,
  // créer la session checkout ici avec priceInfo.activePriceXaf et serverChariowProductId.
  void serverChariowProductId;

  const targetUrl = getChariowCheckoutUrl(product.chariowUrl, product.slug);

  if (!isAllowedExternalUrl(targetUrl)) {
    return NextResponse.json(
      { ok: false, error: 'Configuration de redirection invalide.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    redirectUrl: targetUrl,
    priceXaf: priceInfo.activePriceXaf,
    mode: 'redirect_chariow',
  });
}
