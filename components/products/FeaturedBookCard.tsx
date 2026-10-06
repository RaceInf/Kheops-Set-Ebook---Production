'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/products';
import { getChariowCheckoutUrl } from '@/lib/products';
import { PriceDisplay } from '@/components/ui/price-display';
import { IconArrowUpRight, IconPdf } from '@/components/icons/kheops-icons';
import { trackEvent, trackCtaClick } from '@/lib/analytics';

interface FeaturedBookCardProps {
  product: Product;
}

export function FeaturedBookCard({ product }: FeaturedBookCardProps) {
  const checkoutUrl = getChariowCheckoutUrl(product.chariowUrl, product.slug);

  return (
    <div className="border border-[#565A5C]/50 bg-[#151515] p-6 sm:p-8 flex flex-col justify-between space-y-6">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-2 border-b border-[#565A5C]/30 pb-3">
          <span className="px-2.5 py-0.5 bg-[#090909] border border-[#EEB149]/50 font-mono text-xs font-semibold text-[#EEB149]">
            {product.tag}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#A5A5A0]">
            <IconPdf className="w-3.5 h-3.5 text-[#EEB149]" />
            {product.format} · {product.pageCount} pages
          </span>
        </div>

        <div className="flex items-start gap-5">
          {/* Book Cover Photo */}
          <Link
            href={`/ebooks/${product.slug}`}
            className="relative w-24 sm:w-28 aspect-[3/4.2] bg-[#090909] border border-[#565A5C]/60 shadow-xl overflow-hidden shrink-0 flex flex-col justify-between p-2.5 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-[2px] bg-[#EEB149]"
            />
            <div className="absolute inset-0 z-0 opacity-85">
              <Image
                src={product.coverImage}
                alt={product.coverAlt}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 96px, 112px"
                referrerPolicy="no-referrer"
                className="object-cover object-center"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-[#090909]/92 via-[#090909]/25 to-[#090909]/95"
              />
            </div>

            <p className="relative z-10 font-display text-[10px] font-extrabold text-center text-[#FFFFFF] uppercase leading-tight">
              {product.title}
            </p>
            <p className="relative z-10 font-mono text-[7px] tracking-[0.2em] text-center text-[#EEB149]">
              KHEOPS SET
            </p>
          </Link>

          <div className="space-y-2">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF] leading-snug">
              <Link
                href={`/ebooks/${product.slug}`}
                className="hover:text-[#EEB149] transition-colors"
              >
                {product.title}
              </Link>
            </h3>

            <p className="text-sm text-[#F3F1EB] leading-relaxed">
              “{product.shortDescription}”
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 pt-4 border-t border-[#565A5C]/30">
        <PriceDisplay
          amountInXAF={product.priceXaf}
          originalPriceXaf={product.originalPriceXaf}
          salePriceXaf={product.salePriceXaf}
          salePercentage={product.salePercentage}
          isOnSale={product.isOnSale}
          saleEndsAt={product.saleEndsAt}
          showSelector={false}
          size="md"
        />

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                const ctaName =
                  product.slug === 'le-code-du-batisseur'
                    ? 'code_checkout'
                    : 'capital_checkout';
                trackCtaClick({
                  cta_name: ctaName,
                  cta_location: 'product_page',
                  link_url: checkoutUrl,
                });
                trackEvent('click_buy_chariow', {
                  product_slug: product.slug,
                  location: 'featured_card',
                });
              }}
              className="flex-1 text-center py-3.5 px-5 text-xs font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors whitespace-nowrap"
            >
              {product.ctaLabel}
            </a>

            <Link
              href={`/ebooks/${product.slug}`}
              className="inline-flex items-center justify-center gap-1.5 py-3.5 px-4 text-xs font-mono font-semibold border border-[#565A5C] text-[#FFFFFF] hover:border-[#FFFFFF] transition-colors whitespace-nowrap"
            >
              <span>FICHE</span>
              <IconArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-[11px] text-[#A5A5A0]">{product.ctaSubtext}</p>
        </div>
      </div>
    </div>
  );
}
