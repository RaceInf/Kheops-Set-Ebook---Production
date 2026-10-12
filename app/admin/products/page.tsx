import React from 'react';
import { prisma } from '@/lib/db';
import { seedProductConfigs, getAllProductsWithDbOverride } from '@/lib/product-db';
import { BookOpen, Tag, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function AdminProductsPage() {
  // S'assure que la DB contient les configs initiales
  await seedProductConfigs();

  // Récupère les produits fusionnés avec les valeurs DB
  const products = await getAllProductsWithDbOverride();

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#565A5C]/30">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-semibold text-[#EEB149] uppercase tracking-widest flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              GESTION DU CATALOGUE
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF] uppercase">
            MANUELS & PRIX EN LIGNE
          </h1>
          <p className="text-xs font-mono text-[#A5A5A0] mt-1">
            Contrôle en direct des tarifs, offres spéciales et promotions sans modification du code source.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3.5 py-2 bg-[#151515] border border-[#565A5C]/40 text-[#F3F1EB]">
            Catalogue : <span className="text-[#EEB149] font-bold">{products.length}</span> manuels actifs
          </div>
        </div>
      </div>

      {/* Grille des Produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => {
          return (
            <div
              key={product.slug}
              className="bg-[#151515] border border-[#565A5C]/40 p-6 flex flex-col justify-between relative group hover:border-[#EEB149]/50 transition-colors shadow-xl"
            >
              {/* Technical indicators */}
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#565A5C]/40" />

              <div>
                {/* Header card with status badge */}
                <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-[#565A5C]/20">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#EEB149] uppercase block mb-1">
                      {product.tag || 'MANUEL OFFICIEL'}
                    </span>
                    <h2 className="font-display text-lg font-bold text-[#FFFFFF] uppercase tracking-tight">
                      {product.title}
                    </h2>
                    <span className="text-xs font-mono text-[#A5A5A0] block mt-0.5">
                      {product.subtitle}
                    </span>
                  </div>

                  <div>
                    {product.isOnSale ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EEB149]/15 text-[#EEB149] border border-[#EEB149]/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        PROMO ACTIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#090909] text-[#A5A5A0] border border-[#565A5C]/30 text-[10px] font-mono uppercase tracking-wider">
                        PRIX STANDARD
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing Overview */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-[#090909] border border-[#565A5C]/20 mb-6 font-mono">
                  <div>
                    <span className="text-[10px] text-[#565A5C] uppercase block mb-1">
                      Prix Actif en Boutique
                    </span>
                    <span className="text-xl font-bold text-[#EEB149] block">
                      {formatAmount(product.priceXaf)} FCFA
                    </span>
                    {product.isOnSale && product.originalPriceXaf && (
                      <span className="text-[11px] text-[#565A5C] line-through block mt-0.5">
                        Base : {formatAmount(product.originalPriceXaf)} FCFA
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] text-[#565A5C] uppercase block mb-1">
                      État Promotionnel
                    </span>
                    {product.isOnSale ? (
                      <span className="text-xs text-emerald-400 font-semibold block">
                        Remise de {product.salePercentage ?? 0}%
                      </span>
                    ) : (
                      <span className="text-xs text-[#A5A5A0] block">
                        Aucune remise active
                      </span>
                    )}
                    <span className="text-[10px] text-[#565A5C] block mt-0.5">
                      Format : {product.format} · {product.pageCount} pages
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <Link
                  href={`/ebooks/${product.slug}`}
                  target="_blank"
                  className="text-xs font-mono text-[#A5A5A0] hover:text-[#FFFFFF] transition-colors"
                >
                  Voir sur le site public →
                </Link>

                <Link
                  href={`/admin/products/${product.slug}`}
                  className="px-4 py-2.5 bg-[#EEB149] hover:bg-[#EEB149]/90 text-[#090909] font-mono text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <span>Modifier les tarifs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
