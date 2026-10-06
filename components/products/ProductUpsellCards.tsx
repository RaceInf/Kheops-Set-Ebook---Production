'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AVAILABLE_PRODUCTS, calculatePriceInfo, getChariowCheckoutUrl } from '@/lib/products';
import { useCurrency } from '@/context/currency-context';
import { SaleBadge } from '@/components/ui/SaleBadge';
import { IconArrowUpRight, IconPdf } from '@/components/icons/kheops-icons';
import { trackEvent } from '@/lib/analytics';

export function ProductUpsellCards() {
  const { formatPrice, currency, formatBaseXAF } = useCurrency();

  return (
    <section
      aria-labelledby="upsell-section-heading"
      className="pt-10 border-t border-[#565A5C]/35 space-y-8"
    >
      <div className="space-y-1.5">
        <p className="font-mono text-xs text-[#EEB149] tracking-wider">
          LES MANUELS COMPLETS KHEOPS SET
        </p>
        <h2
          id="upsell-section-heading"
          className="font-display text-2xl sm:text-3xl font-bold text-[#FFFFFF]"
        >
          TU VEUX ALLER PLUS LOIN ?
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {AVAILABLE_PRODUCTS.map((product) => {
          const priceInfo = calculatePriceInfo(product);
          const activeFormatted = formatPrice(priceInfo.activePriceXaf, currency);
          const originalFormatted =
            priceInfo.originalPriceXaf !== null
              ? formatPrice(priceInfo.originalPriceXaf, currency)
              : null;
          const checkoutUrl = getChariowCheckoutUrl(product.chariowUrl, product.slug);

          return (
            <article
              key={product.id}
              className="bg-[#151515] border border-[#565A5C]/50 overflow-hidden flex flex-col justify-between"
            >
              {/* Visual Cover Photo Banner + 3D Book Cover */}
              <Link
                href={`/ebooks/${product.slug}`}
                className="group relative w-full bg-[#090909] bg-blueprint-grid-dark border-b border-[#565A5C]/40 p-6 sm:p-8 flex items-center justify-center overflow-hidden"
              >
                {/* Ambient background photo preview */}
                <Image
                  src={product.coverImage}
                  alt=""
                  aria-hidden="true"
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  referrerPolicy="no-referrer"
                  className="object-cover object-center opacity-20 scale-105 transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/65 to-[#090909]/80"
                />

                {/* Sharp Ebook Cover Photo Object */}
                <div className="relative z-10 w-[170px] sm:w-[190px] aspect-[3/4.2] bg-[#090909] border border-[#EEB149]/50 shadow-[16px_20px_44px_rgba(0,0,0,0.92)] overflow-hidden flex flex-col justify-between p-4 transition-transform duration-300 group-hover:-translate-y-1.5">
                  <div
                    aria-hidden="true"
                    className="absolute top-0 left-0 right-0 h-[2px] bg-[#EEB149]"
                  />
                  {/* High-visibility Ebook Photo */}
                  <Image
                    src={product.coverImage}
                    alt={product.coverAlt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 170px, 190px"
                    referrerPolicy="no-referrer"
                    className="object-cover object-center opacity-95"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-b from-[#090909]/80 via-transparent to-[#090909]/90"
                  />

                  <div className="relative z-10 text-center space-y-0.5">
                    <span className="inline-block px-1.5 py-0.5 bg-[#090909]/85 font-mono text-[8px] tracking-[0.18em] text-[#EEB149]">
                      {product.tag}
                    </span>
                    <p className="font-display text-sm font-extrabold tracking-wide text-[#FFFFFF] uppercase leading-tight drop-shadow">
                      {product.title}
                    </p>
                  </div>

                  <div className="relative z-10 text-center pt-2 border-t border-[#EEB149]/40">
                    <p className="font-mono text-[9px] tracking-[0.25em] text-[#EEB149] font-semibold">
                      KHEOPS SET
                    </p>
                  </div>
                </div>
              </Link>

              {/* Card Body: Details + Price + Actions */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 bg-[#090909] border border-[#EEB149]/50 font-mono text-[10px] font-semibold text-[#EEB149] tracking-wider">
                      {product.tag}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#A5A5A0]">
                      <IconPdf className="w-3.5 h-3.5 text-[#EEB149]" />
                      Ebook PDF · {product.pageCount} pages
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#FFFFFF]">
                    <Link
                      href={`/ebooks/${product.slug}`}
                      className="hover:text-[#EEB149] transition-colors"
                    >
                      {product.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-[#F3F1EB]/90 leading-relaxed">
                    “{product.shortDescription}”
                  </p>
                </div>

                {/* Bottom Row: Price (with Promo & Strikethrough) + Actions */}
                <div className="pt-5 border-t border-[#565A5C]/35 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-baseline gap-2.5 font-mono tabular-nums">
                      <span className="text-xl sm:text-2xl font-bold text-[#EEB149]">
                        {activeFormatted}
                      </span>
                      {priceInfo.isOnSale && originalFormatted && (
                        <span className="text-xs sm:text-sm text-[#A5A5A0] line-through">
                          {originalFormatted}
                        </span>
                      )}
                      {currency !== 'XAF' && (
                        <span className="text-xs text-[#A5A5A0]">
                          ({formatBaseXAF(priceInfo.activePriceXaf)})
                        </span>
                      )}
                    </div>

                    {priceInfo.isOnSale && (
                      <SaleBadge
                        percentageText={priceInfo.salePercentageText}
                        showPromoLabel={true}
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackEvent('click_buy_chariow', {
                          product_slug: product.slug,
                          location: 'upsell_card',
                        })
                      }
                      className="inline-flex items-center justify-center py-3.5 px-4 text-xs font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors whitespace-nowrap"
                    >
                      {product.ctaLabel}
                    </a>

                    <Link
                      href={`/ebooks/${product.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 py-3.5 px-4 text-xs font-mono font-semibold border border-[#565A5C] text-[#FFFFFF] hover:border-[#EEB149] hover:text-[#EEB149] transition-colors whitespace-nowrap"
                    >
                      <span>VOIR LE LIVRE</span>
                      <IconArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
