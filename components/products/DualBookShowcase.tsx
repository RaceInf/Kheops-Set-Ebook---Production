'use client';

import React from 'react';
import Link from 'next/link';
import { AVAILABLE_PRODUCTS, getChariowCheckoutUrl } from '@/lib/products';
import { PriceDisplay } from '@/components/ui/price-display';
import { ChariowBuyButton } from '@/components/ui/chariow-buy-button';
import {
  IconArrowUpRight,
  IconPdf,
  IconRuler,
  IconCheck,
} from '@/components/icons/kheops-icons';

interface DualBookShowcaseProps {
  title?: string;
  subtitle?: string;
  className?: string;
  ctaLocation?: string;
  headerClassName?: string;
}

export function DualBookShowcase({
  title = 'Deux manuels complémentaires pour reprendre le contrôle',
  subtitle = 'Conçus comme des plans d’ingénierie : zéro théorie superflue, 100 % de règles applicables immédiatement.',
  className = '',
  ctaLocation = 'about',
  headerClassName = '',
}: DualBookShowcaseProps) {
  return (
    <section
      aria-label="Manuels d'exécution Kheops Set"
      className={`space-y-8 ${className}`}
    >
      {(title || subtitle) && (
        <div
          className={`space-y-2 border-b border-[#565A5C]/30 pb-4 ${
            headerClassName || 'text-center sm:text-left'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-mono text-[#EEB149]">
            <span className="w-1.5 h-1.5 bg-[#EEB149]" aria-hidden="true" />
            <span>LES OUTILS DU BÂTISSEUR</span>
          </div>
          {title && (
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FFFFFF]">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-[#A5A5A0] max-w-2xl">{subtitle}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {AVAILABLE_PRODUCTS.map((product) => {
          const checkoutUrl = getChariowCheckoutUrl(
            product.chariowUrl,
            product.slug
          );
          const ctaName =
            product.slug === 'le-code-du-batisseur'
              ? 'code_checkout'
              : 'capital_checkout';

          return (
            <article
              key={product.id}
              className="bg-[#151515] border border-[#565A5C]/40 p-6 sm:p-8 flex flex-col justify-between space-y-6 relative hover:border-[#EEB149]/70 transition-colors"
            >
              {/* Header Box */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                  <span className="text-[#EEB149] font-semibold">
                    MANUEL VOL. {product.slug === 'le-capital-du-batisseur' ? '01' : '02'}
                  </span>
                  <span className="text-[#A5A5A0] flex items-center gap-1.5">
                    <IconPdf className="w-3.5 h-3.5 text-[#EEB149]" />
                    {product.pageCount} PAGES (PDF)
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                    {product.title}
                  </h3>
                  <p className="font-mono text-xs text-[#EEB149]">
                    {product.subtitle}
                  </p>
                </div>

                <p className="text-sm text-[#A5A5A0] leading-relaxed">
                  {product.shortDescription}
                </p>

                {/* 3 Key Modules */}
                <div className="space-y-2 pt-2 border-t border-[#565A5C]/25">
                  <p className="font-mono text-[10px] text-[#A5A5A0] uppercase tracking-wider">
                    MODULES ESSENTIELS
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#F3F1EB]">
                    {product.benefits.slice(0, 3).map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <IconCheck className="w-3.5 h-3.5 text-[#EEB149] shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="pt-4 border-t border-[#565A5C]/30 space-y-4">
                <PriceDisplay
                  amountInXAF={product.priceXaf}
                  originalPriceXaf={product.originalPriceXaf}
                  salePriceXaf={product.salePriceXaf}
                  salePercentage={product.salePercentage}
                  isOnSale={product.isOnSale}
                  saleEndsAt={product.saleEndsAt}
                  showSelector={true}
                  size="md"
                />

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <ChariowBuyButton
                    href={checkoutUrl}
                    ctaName={ctaName}
                    ctaLocation={ctaLocation}
                    className="w-full sm:flex-1 py-3.5 px-4 text-center text-xs font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors whitespace-nowrap"
                  >
                    {product.ctaLabel}
                  </ChariowBuyButton>

                  <Link
                    href={`/ebooks/${product.slug}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-3.5 px-4 text-xs font-mono font-semibold border border-[#565A5C] text-[#FFFFFF] hover:border-[#FFFFFF] hover:bg-[#090909] transition-colors whitespace-nowrap"
                  >
                    <span>VOIR SOMMAIRE</span>
                    <IconArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <p className="text-[11px] text-center text-[#A5A5A0] font-mono">
                  Paiement sécurisé & accès immédiat via Chariow.
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
