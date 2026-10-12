import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ALL_PRODUCTS } from '@/lib/products';
import { ProductEditForm } from './edit-form';
import { seedProductConfigs } from '@/lib/product-db';

interface EditProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function AdminEditProductPage({ params }: EditProductPageProps) {
  const { slug } = await params;

  const baseProduct = ALL_PRODUCTS.find((p) => p.slug === slug);
  if (!baseProduct) {
    notFound();
  }

  // Ensure DB seed exists
  await seedProductConfigs();

  let dbConfig = null;
  try {
    dbConfig = await prisma.productConfig.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error('[AdminEditProductPage Error]:', error);
  }

  const initialPriceXaf = dbConfig ? dbConfig.priceXaf : baseProduct.priceXaf;
  const initialSalePriceXaf = dbConfig ? dbConfig.salePriceXaf : baseProduct.salePriceXaf ?? null;
  const initialIsOnSale = dbConfig ? dbConfig.isOnSale : baseProduct.isOnSale;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF] uppercase">
          MODIFICATION DU MANUEL
        </h1>
        <p className="text-xs font-mono text-[#A5A5A0] mt-1">
          Ajuste les montants officiels et applique une réduction tarifaire en temps réel.
        </p>
      </div>

      <ProductEditForm
        slug={slug}
        initialTitle={baseProduct.title}
        initialPriceXaf={initialPriceXaf}
        initialSalePriceXaf={initialSalePriceXaf}
        initialIsOnSale={initialIsOnSale}
      />
    </div>
  );
}
