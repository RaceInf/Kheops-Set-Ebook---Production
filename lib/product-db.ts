import { prisma } from '@/lib/db';
import { ALL_PRODUCTS, type Product } from '@/lib/products';
import { getLocalProductConfigs } from '@/lib/local-fallback';
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
    console.warn('[seedProductConfigs warning - using local fallback]:', error);
  }
}

/**
 * Récupère la configuration (DB ou fallback local) pour un slug donné
 */
export async function getProductConfigWithFallback(slug: string) {
  try {
    const dbConfig = await prisma.productConfig.findUnique({
      where: { slug },
    });
    if (dbConfig) return dbConfig;
  } catch {
    // DB non disponible, utiliser le fallback local
  }

  const localConfigs = getLocalProductConfigs();
  const local = localConfigs[slug];
  if (local) {
    return {
      id: `local-${slug}`,
      slug: local.slug,
      title: local.title,
      priceXaf: local.priceXaf,
      salePriceXaf: local.salePriceXaf ?? null,
      isOnSale: local.isOnSale,
      isFeatured: local.isFeatured,
      coverImage: local.coverImage ?? null,
      updatedAt: new Date(local.updatedAt),
    };
  }

  return null;
}

/**
 * Récupère un produit complet en surchargeant ses prix et son statut promo
 * avec les données de la base de données PostgreSQL ou du fallback local.
 */
export async function getProductWithDbOverride(slug: string): Promise<Product | undefined> {
  const baseProduct = ALL_PRODUCTS.find((p) => p.slug === slug);
  if (!baseProduct) return undefined;

  const config = await getProductConfigWithFallback(slug);
  if (!config) return baseProduct;

  const isOnSale = config.isOnSale;
  const priceXaf = config.priceXaf;
  const salePriceXaf = config.salePriceXaf ?? undefined;
  const activePrice = isOnSale && salePriceXaf ? salePriceXaf : priceXaf;

  let salePercentage: number | undefined = undefined;
  if (isOnSale && salePriceXaf && priceXaf > 0) {
    salePercentage = Math.round(((priceXaf - salePriceXaf) / priceXaf) * 100);
  }

  const coverImage = config.coverImage || baseProduct.coverImage;

  return {
    ...baseProduct,
    coverImage,
    priceXaf: activePrice,
    originalPriceXaf: isOnSale ? priceXaf : undefined,
    salePriceXaf: salePriceXaf,
    isOnSale,
    salePercentage,
    price: activePrice,
  };
}

/**
 * Récupère tous les produits avec surcharge DB / Fallback local
 */
export async function getAllProductsWithDbOverride(): Promise<Product[]> {
  const localConfigs = getLocalProductConfigs();

  try {
    const dbConfigs = await prisma.productConfig.findMany();
    const configMap = new Map(dbConfigs.map((c) => [c.slug, c]));

    // Fusionner localConfigs par-dessus
    for (const [slug, local] of Object.entries(localConfigs)) {
      configMap.set(slug, {
        id: `local-${slug}`,
        slug: local.slug,
        title: local.title,
        priceXaf: local.priceXaf,
        salePriceXaf: local.salePriceXaf ?? null,
        isOnSale: local.isOnSale,
        isFeatured: local.isFeatured,
        coverImage: local.coverImage ?? null,
        updatedAt: new Date(local.updatedAt),
      });
    }

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

      const coverImage = dbConfig.coverImage || baseProduct.coverImage;

      return {
        ...baseProduct,
        coverImage,
        priceXaf: activePrice,
        originalPriceXaf: isOnSale ? priceXaf : undefined,
        salePriceXaf: salePriceXaf,
        isOnSale,
        salePercentage,
        price: activePrice,
      };
    });
  } catch {
    // En cas d'échec total de Prisma, utiliser le fallback local + produits de base
    return ALL_PRODUCTS.map((baseProduct) => {
      const local = localConfigs[baseProduct.slug];
      if (!local) return baseProduct;

      const isOnSale = local.isOnSale;
      const priceXaf = local.priceXaf;
      const salePriceXaf = local.salePriceXaf ?? undefined;
      const activePrice = isOnSale && salePriceXaf ? salePriceXaf : priceXaf;

      let salePercentage: number | undefined = undefined;
      if (isOnSale && salePriceXaf && priceXaf > 0) {
        salePercentage = Math.round(((priceXaf - salePriceXaf) / priceXaf) * 100);
      }

      const coverImage = local.coverImage || baseProduct.coverImage;

      return {
        ...baseProduct,
        coverImage,
        priceXaf: activePrice,
        originalPriceXaf: isOnSale ? priceXaf : undefined,
        salePriceXaf: salePriceXaf,
        isOnSale,
        salePercentage,
        price: activePrice,
      };
    });
  }
}
