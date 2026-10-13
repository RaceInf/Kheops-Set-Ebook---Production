'use server';

import { prisma } from '@/lib/db';
import { saveLocalProductConfig } from '@/lib/local-fallback';
import { revalidatePath, revalidateTag } from 'next/cache';

export interface UpdateProductState {
  success?: boolean;
  error?: string;
}

export async function updateProductConfigAction(
  slug: string,
  _prevState: UpdateProductState,
  formData: FormData
): Promise<UpdateProductState> {
  const priceXafStr = formData.get('priceXaf') as string;
  const salePriceXafStr = formData.get('salePriceXaf') as string;
  const isOnSaleBool = formData.get('isOnSale') === 'on' || formData.get('isOnSale') === 'true';

  const priceXaf = parseInt(priceXafStr, 10);
  const salePriceXaf = salePriceXafStr && salePriceXafStr.trim() !== ''
    ? parseInt(salePriceXafStr, 10)
    : null;

  if (isNaN(priceXaf) || priceXaf <= 0) {
    return { error: 'Le prix de base doit être un nombre positif supérieur à zéro.' };
  }

  if (isOnSaleBool && (salePriceXaf === null || isNaN(salePriceXaf) || salePriceXaf <= 0)) {
    return { error: 'Si la promotion est activée, un prix promotionnel valide est obligatoire.' };
  }

  if (isOnSaleBool && salePriceXaf && salePriceXaf >= priceXaf) {
    return { error: 'Le prix promotionnel doit être inférieur au prix de base.' };
  }

  const coverImageStr = formData.get('coverImage') as string | null;
  const coverImage = coverImageStr && coverImageStr.trim() !== '' ? coverImageStr.trim() : undefined;

  try {
    await prisma.productConfig.upsert({
      where: { slug },
      update: {
        priceXaf,
        salePriceXaf,
        isOnSale: isOnSaleBool,
        ...(coverImage !== undefined ? { coverImage } : {}),
      },
      create: {
        slug,
        title: slug === 'le-capital-du-batisseur' ? 'Le Capital du Bâtisseur' : 'Le Code du Bâtisseur',
        priceXaf,
        salePriceXaf,
        isOnSale: isOnSaleBool,
        coverImage: coverImage || null,
      },
    });
  } catch (dbError) {
    console.warn('[Prisma upsert failed, saving to local JSON fallback]:', dbError);
    saveLocalProductConfig({
      slug,
      title: slug === 'le-capital-du-batisseur' ? 'Le Capital du Bâtisseur' : 'Le Code du Bâtisseur',
      priceXaf,
      salePriceXaf,
      isOnSale: isOnSaleBool,
      isFeatured: false,
      coverImage: coverImage || null,
      updatedAt: new Date().toISOString(),
    });
  }

  revalidatePath(`/ebooks/${slug}`);
  revalidatePath('/ebooks');
  revalidatePath('/');
  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${slug}`);
  revalidateTag('product-config');

  return { success: true };
}
