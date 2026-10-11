import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/admin-guard';
import { getAdminProducts, updateAdminProduct } from '@/lib/admin/db';

export async function GET() {
  await requireAdminSession();
  const products = await getAdminProducts();
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  const body = await req.json().catch(() => ({}));

  const { id, cta_label, chariow_url, chariow_product_id, is_active, is_published_chariow } = body;

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'ID produit manquant' }, { status: 400 });
  }

  const updated = await updateAdminProduct(
    id,
    {
      cta_label: typeof cta_label === 'string' ? cta_label : undefined,
      chariow_url: typeof chariow_url === 'string' ? chariow_url : undefined,
      chariow_product_id: typeof chariow_product_id === 'string' ? chariow_product_id : undefined,
      is_active: typeof is_active === 'boolean' ? is_active : undefined,
      is_published_chariow: typeof is_published_chariow === 'boolean' ? is_published_chariow : undefined,
    },
    session.emailMasked
  );

  if (!updated) {
    return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });
  }

  return NextResponse.json({ success: true, product: updated });
}
