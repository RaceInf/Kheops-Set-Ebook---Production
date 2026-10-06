'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/products';
import { getChariowCheckoutUrl } from '@/lib/products';
import { PriceDisplay } from '@/components/ui/price-display';
import {
  IconPdf,
  IconRuler,
  IconBlueprint,
  IconCheck,
  IconArrowUpRight,
} from '@/components/icons/kheops-icons';
import { trackEvent } from '@/lib/analytics';

interface BookCardProps {
  product: Product;
}

export function BookCard({ product }: BookCardProps) {
  const checkoutUrl = getChariowCheckoutUrl(product.chariowUrl, product.slug);

  const handleBuyClick = () => {
    trackEvent('click_buy_chariow', {
      product_slug: product.slug,
      location: 'book_card',
    });
  };

  return (
    <article className="border border-[#565A5C]/50 bg-[#151515] grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative">
      {/* Left Column: 3D Book Cover in Industrial Chamber */}
      <div className="lg:col-span-5 bg-[#090909] p-8 sm:p-10 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-[#565A5C]/35 relative">
        <div
          aria-hidden="true"
          className="absolute top-3 left-4 font-mono text-[10px] text-[#565A5C] tracking-widest"
        >
          REF // {product.slug.toUpperCase()}
        </div>

        <Link
          href={`/ebooks/${product.slug}`}
          className="group relative w-[210px] sm:w-[240px] aspect-[3/4.2] bg-[#090909] border border-[#565A5C]/60 shadow-2xl overflow-hidden flex flex-col justify-between p-6 transition-transform duration-300 hover:-translate-y-1"
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
              sizes="(max-width: 640px) 210px, 240px"
              referrerPolicy="no-referrer"
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-[#090909]/92 via-[#090909]/30 to-[#090909]/95"
            />
          </div>

          <div className="relative z-10 text-center space-y-1">
            <span className="inline-block font-mono text-[9px] tracking-[0.22em] text-[#EEB149] mb-1">
              {product.tag}
            </span>
            <p className="font-display text-lg sm:text-xl font-extrabold tracking-[0.05em] text-[#FFFFFF] leading-tight uppercase">
              {product.title}
            </p>
          </div>

          <div className="relative z-10 text-center space-y-2 pt-3 border-t border-[#565A5C]/35">
            <p className="text-[11px] text-[#F3F1EB] leading-snug line-clamp-2">
              {product.subtitle}
            </p>
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#EEB149]">
              KHEOPS SET
            </p>
          </div>
        </Link>
      </div>

      {/* Right Column: Industrial Product Info, Price & CTA */}
      <div className="lg:col-span-7 p-6 sm:p-9 lg:p-10 flex flex-col justify-between space-y-7 bg-[#151515]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="px-2.5 py-0.5 bg-[#090909] border border-[#EEB149]/50 text-[#EEB149] font-semibold">
              {product.tag}
            </span>
            <span className="text-[#A5A5A0] font-mono tracking-wider">{product.category.toUpperCase()}</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FFFFFF]">
            <Link
              href={`/ebooks/${product.slug}`}
              className="hover:text-[#EEB149] transition-colors"
            >
              {product.title}
            </Link>
          </h2>

          <p className="text-base text-[#F3F1EB] leading-relaxed">
            “{product.shortDescription}”
          </p>

          {/* Specs Bar */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#565A5C]/30 font-mono text-xs text-[#A5A5A0] tabular-nums">
            <div className="p-2.5 bg-[#090909] border border-[#565A5C]/30 flex items-center gap-2">
              <IconPdf className="w-4 h-4 text-[#EEB149] shrink-0" />
              <span className="truncate">{product.format}</span>
            </div>
            {product.pageCount && (
              <div className="p-2.5 bg-[#090909] border border-[#565A5C]/30 flex items-center gap-2">
                <IconRuler className="w-4 h-4 text-[#EEB149] shrink-0" />
                <span className="truncate">{product.pageCount} pages</span>
              </div>
            )}
            <div className="p-2.5 bg-[#090909] border border-[#565A5C]/30 flex items-center gap-2">
              <IconBlueprint className="w-4 h-4 text-[#EEB149] shrink-0" />
              <span className="truncate">{product.language}</span>
            </div>
          </div>

          {product.benefits.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-[#F3F1EB]">
              {product.benefits.slice(0, 4).map((b, bIdx) => (
                <li key={b} className="flex items-start gap-2.5 p-2 bg-[#090909]/60 border border-[#565A5C]/25">
                  <span className="font-mono text-[10px] text-[#EEB149] font-bold mt-0.5">
                    0{bIdx + 1}
                  </span>
                  <span className="leading-snug">{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pricing + Promotional Strikethrough + Chariow CTA */}
        <div className="space-y-5 pt-5 border-t border-[#565A5C]/35">
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

          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-3.5">
              <a
                href={checkoutUrl}
                onClick={handleBuyClick}
                className="px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors whitespace-nowrap"
              >
                {product.ctaLabel}
              </a>

              <Link
                href={`/ebooks/${product.slug}`}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-semibold tracking-wider border border-[#565A5C] text-[#FFFFFF] hover:border-[#FFFFFF] transition-colors whitespace-nowrap"
              >
                <span>VOIR LE SOMMAIRE</span>
                <IconArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-xs text-[#A5A5A0]">{product.ctaSubtext}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
