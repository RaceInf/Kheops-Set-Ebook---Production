import { prisma } from '@/lib/db';
import { ALL_PRODUCTS, type Product } from '@/lib/products';
import { unstable_cache } from 'next/cache';

/**
 * Initialise / Amorçe (seed) la table ProductConfig avec les produits de lib/products.ts
 */
export async function seedProductConfigs(): Promise<void> {
  try {
    for (const product of ALL_PRODUCTS) {
      await prisma.productConfig.upsert({
        where: { slug: product.slug },
        update: {
          title: product.title,
          isFeatured: product.isFeatured ?? false,
        },
        create: {
          slug: product.slug,
          title: product.title,
          priceXaf: product.priceXaf,
          salePriceXaf: product.salePriceXaf ?? null,
          isOnSale: product.isOnSale ?? false,
          isFeatured: product.isFeatured ?? false,
        },
      });
    }
  } catch (error) {
    console.error('[seedProductConfigs Error]:', error);
  }
}

/**
 * Récupère la configuration en base de données pour un slug donné (mis en cache)
 */
export const getCachedProductConfig = unstable_cache(
  async (slug: string) => {
    try {
      return await prisma.productConfig.findUnique({
        where: { slug },
      });
    } catch {
      return null;
    }
  },
  ['product-config-by-slug'],
  { tags: ['product-config'], revalidate: 60 }
);

/**
 * Récupère un produit complet en surchargeant ses prix et son statut promo
 * avec les données de la base de données PostgreSQL si disponibles.
 */
export async function getProductWithDbOverride(slug: string): Promise<Product | undefined> {
  const baseProduct = ALL_PRODUCTS.find((p) => p.slug === slug);
  if (!baseProduct) return undefined;

  try {
    const dbConfig = await getCachedProductConfig(slug);
    if (!dbConfig) return baseProduct;

    const isOnSale = dbConfig.isOnSale;
    const priceXaf = dbConfig.priceXaf;
    const salePriceXaf = dbConfig.salePriceXaf ?? undefined;
    const activePrice = isOnSale && salePriceXaf ? salePriceXaf : priceXaf;

    let salePercentage: number | undefined = undefined;
    if (isOnSale && salePriceXaf && priceXaf > 0) {
      salePercentage = Math.round(((priceXaf - salePriceXaf) / priceXaf) * 100);
    }

    return {
      ...baseProduct,
      priceXaf: activePrice,
      originalPriceXaf: isOnSale ? priceXaf : undefined,
      salePriceXaf: salePriceXaf,
      isOnSale,
      salePercentage,
      price: activePrice,
    };
  } catch {
    return baseProduct;
  }
}

/**
 * Récupère tous les produits avec surcharge DB
 */
export async function getAllProductsWithDbOverride(): Promise<Product[]> {
  try {
    const dbConfigs = await prisma.productConfig.findMany();
    const configMap = new Map(dbConfigs.map((c) => [c.slug, c]));

    return ALL_PRODUCTS.map((baseProduct) => {
      const dbConfig = configMap.get(baseProduct.slug);
      if (!dbConfig) return baseProduct;

      const isOnSale = dbConfig.isOnSale;
      const priceXaf = dbConfig.priceXaf;
      const salePriceXaf = dbConfig.salePriceXaf ?? undefined;
      const activePrice = isOnSale && salePriceXaf ? salePriceXaf : priceXaf;

      let salePercentage: number | undefined = undefined;
      if (isOnSale && salePriceXaf && priceXaf > 0) {
        salePercentage = Math.round(((priceXaf - salePriceXaf) / priceXaf) * 100);
      }

      return {
        ...baseProduct,
        priceXaf: activePrice,
        originalPriceXaf: isOnSale ? priceXaf : undefined,
        salePriceXaf: salePriceXaf,
        isOnSale,
        salePercentage,
        price: activePrice,
      };
    });
  } catch {
    return ALL_PRODUCTS;
  }
}
