'use server';

import { prisma } from '@/lib/db';
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

  try {
    await prisma.productConfig.upsert({
      where: { slug },
      update: {
        priceXaf,
        salePriceXaf,
        isOnSale: isOnSaleBool,
      },
      create: {
        slug,
        title: slug === 'le-capital-du-batisseur' ? 'Le Capital du Bâtisseur' : 'Le Code du Bâtisseur',
        priceXaf,
        salePriceXaf,
        isOnSale: isOnSaleBool,
      },
    });

    revalidatePath(`/ebooks/${slug}`);
    revalidatePath('/ebooks');
    revalidatePath('/');
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${slug}`);
    revalidateTag('product-config');

    return { success: true };
  } catch (error) {
    console.error('[updateProductConfigAction Error]:', error);
    return { error: 'Une erreur est survenue lors de l’enregistrement de la configuration.' };
  }
}
