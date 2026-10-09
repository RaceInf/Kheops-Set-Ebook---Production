'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CAPITAL_PRODUCT,
  CODE_PRODUCT,
  getChariowCheckoutUrl,
} from '@/lib/products';
import { PriceDisplay } from '@/components/ui/price-display';
import { FeaturedBookCard } from '@/components/products/FeaturedBookCard';
import { BookPreviewReader } from '@/components/products/BookPreviewReader';
import {
  IconPdf,
  IconBlueprint,
  IconRuler,
  IconCheck,
  IconArrowUpRight,
} from '@/components/icons/kheops-icons';
import { useCheckoutModal } from '@/context/checkout-modal-context';

export function BookMockupShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const bookWrapperRef = useRef<HTMLDivElement>(null);
  const connectorsRef = useRef<SVGSVGElement>(null);
  const detailsListRef = useRef<HTMLDivElement>(null);
  const ctaBlockRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleTogglePreview = () => {
    setIsPreviewOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          previewContainerRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 60);
      }
      return next;
    });
  };

  const { openCheckout } = useCheckoutModal();
  const checkoutUrl = getChariowCheckoutUrl(
    CAPITAL_PRODUCT.chariowUrl,
    CAPITAL_PRODUCT.slug
  );

  useEffect(() => {
    const section = sectionRef.current;
    const bookWrapper = bookWrapperRef.current;
    const connectors = connectorsRef.current;
    const detailsList = detailsListRef.current;
    const ctaBlock = ctaBlockRef.current;

    if (!section || !bookWrapper || !detailsList || !ctaBlock) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'center 45%',
          scrub: 0.45,
        },
      });

      tl.fromTo(
        bookWrapper,
        { y: 56, opacity: 0.2, rotateY: -18 },
        { y: 0, opacity: 1, rotateY: -10, ease: 'power3.out', duration: 1 },
        0
      );

      if (connectors) {
        const lines = connectors.querySelectorAll('path');
        lines.forEach((line) => {
          const length = line.getTotalLength();
          gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        });
        tl.to(
          lines,
          {
            strokeDashoffset: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.inOut',
          },
          0.2
        );
      }

      const infoItems = detailsList.querySelectorAll('.spec-item');
      tl.fromTo(
        infoItems,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.6,
          ease: 'power2.out',
        },
        0.35
      );

      tl.fromTo(
        ctaBlock,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="produit-vedette"
      ref={sectionRef}
      aria-labelledby="featured-book-heading"
      className="relative w-full bg-[#090909] bg-blueprint-grid-dark text-[#FFFFFF] py-32 sm:py-40 px-4 sm:px-6 lg:px-8 border-b border-[#565A5C]/30 overflow-hidden"
    >
      <div className="mx-auto max-w-[1360px] space-y-20">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#565A5C]/30 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#A5A5A0]">
              <span>03 · LES OUTILS DISPONIBLES</span>
              <span aria-hidden="true">·</span>
              <span className="px-2 py-0.5 bg-[#EEB149] text-[#090909] font-bold">
                {CAPITAL_PRODUCT.tag}
              </span>
            </div>
            <h2
              id="featured-book-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFFFFF]"
            >
              {CAPITAL_PRODUCT.title}
            </h2>
          </div>

          <p className="font-mono text-xs text-[#A5A5A0] tabular-nums">
            RÉF. KS-01 · {CAPITAL_PRODUCT.pageCount} PAGES · PDF HAUTE DENSITÉ
          </p>
        </div>

        {/* Main Showcase Grid: 3D Book Mockup + Connected Blueprint Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT: 3D CSS Book Mockup with Technical Dimension Frame */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center py-6 sm:py-10 px-4 border border-[#565A5C]/35 bg-[#151515]/60">
            <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#A5A5A0] mb-6 px-2 tabular-nums">
              <span>{CAPITAL_PRODUCT.tag}</span>
              <span className="text-[#EEB149]">PROMO -20,1 %</span>
              <span>{CAPITAL_PRODUCT.pageCount} PAGES</span>
            </div>

            <svg
              ref={connectorsRef}
              viewBox="0 0 500 460"
              fill="none"
              aria-hidden="true"
              className="hidden sm:block absolute inset-0 w-full h-full pointer-events-none"
            >
              <path
                d="M 40 70 L 110 70 L 135 95"
                stroke="#EEB149"
                strokeWidth="1"
                strokeOpacity="0.65"
              />
              <path
                d="M 460 130 L 390 130 L 365 155"
                stroke="#565A5C"
                strokeWidth="1"
                strokeOpacity="0.65"
              />
              <path
                d="M 40 380 L 115 380 L 140 355"
                stroke="#EEB149"
                strokeWidth="1"
                strokeOpacity="0.65"
              />
            </svg>

            {/* 3D Matte Black Book Object */}
            <div className="perspective-1200 my-2">
              <div
                ref={bookWrapperRef}
                className="relative w-[260px] sm:w-[300px] aspect-[3/4.2] preserve-3d transition-transform duration-500 hover:rotate-y-0"
                style={{
                  transform: 'rotateY(-10deg) rotateX(3deg)',
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute top-0 left-0 w-7 h-full bg-[#090909] border-l border-y border-[#565A5C]/50 origin-left flex items-center justify-center"
                  style={{
                    transform: 'rotateY(-90deg) translateX(-14px)',
                  }}
                >
                  <span className="font-mono text-[9px] tracking-[0.25em] text-[#EEB149] -rotate-90 whitespace-nowrap">
                    KHEOPS SET · LE CAPITAL DU BÂTISSEUR
                  </span>
                </div>

                <div
                  aria-hidden="true"
                  className="absolute top-1 bottom-1 right-0 w-5 bg-[#F3F1EB] border-y border-r border-[#A5A5A0]"
                  style={{
                    transform: 'rotateY(90deg) translateZ(10px)',
                  }}
                />

                <div className="relative w-full h-full bg-[#090909] border border-[#565A5C]/60 shadow-[24px_28px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col justify-between p-6 sm:p-7 select-none">
                  <div
                    aria-hidden="true"
                    className="absolute top-0 left-0 right-0 h-[2px] bg-[#EEB149]"
                  />

                  <div className="absolute inset-0 z-0 opacity-85">
                    <Image
                      src={CAPITAL_PRODUCT.coverImage}
                      alt={CAPITAL_PRODUCT.coverAlt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 250px, 300px"
                      referrerPolicy="no-referrer"
                      className="object-cover object-center"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-b from-[#090909]/90 via-[#090909]/25 to-[#090909]/95"
                    />
                  </div>

                  <div className="relative z-10 text-center space-y-1 pt-1">
                    <p className="font-display text-2xl sm:text-[26px] font-extrabold tracking-[0.06em] text-[#FFFFFF] leading-none">
                      LE CAPITAL
                    </p>
                    <p className="font-display text-base sm:text-lg italic font-medium text-[#EEB149] tracking-[0.12em]">
                      DU
                    </p>
                    <p className="font-display text-2xl sm:text-[26px] font-extrabold tracking-[0.08em] text-[#FFFFFF] leading-none">
                      BÂTISSEUR
                    </p>
                  </div>

                  <div className="relative z-10 text-center space-y-3 pt-4 border-t border-[#565A5C]/35">
                    <p className="text-[11px] sm:text-xs text-[#F3F1EB] leading-snug">
                      {CAPITAL_PRODUCT.subtitle}
                    </p>
                    <p className="font-mono text-[11px] tracking-[0.34em] text-[#EEB149] font-semibold">
                      KHEOPS SET
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#A5A5A0] mt-6 px-2 tabular-nums">
              <span>FORMAT : {CAPITAL_PRODUCT.format}</span>
              <span>LANGUE : {CAPITAL_PRODUCT.language.toUpperCase()}</span>
            </div>
          </div>

          {/* RIGHT: Product Details, Specifications, Promotional Price & Chariow CTA */}
          <div className="lg:col-span-6 space-y-8" ref={detailsListRef}>
            <div className="spec-item space-y-4">
              <p className="text-xl sm:text-2xl font-display font-semibold text-[#FFFFFF] leading-snug">
                “{CAPITAL_PRODUCT.shortDescription}”
              </p>
              <p className="text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                {CAPITAL_PRODUCT.longDescription}
              </p>
            </div>

            <div className="spec-item grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 border border-[#565A5C]/40 bg-[#151515] space-y-1.5">
                <div className="flex items-center justify-between text-[#EEB149]">
                  <span className="font-mono text-[11px] text-[#A5A5A0]">FORMAT</span>
                  <IconPdf className="w-4 h-4" />
                </div>
                <p className="font-mono text-sm font-semibold text-[#FFFFFF]">
                  Ebook {CAPITAL_PRODUCT.format}
                </p>
              </div>

              <div className="p-4 border border-[#565A5C]/40 bg-[#151515] space-y-1.5">
                <div className="flex items-center justify-between text-[#EEB149]">
                  <span className="font-mono text-[11px] text-[#A5A5A0]">VOLUME</span>
                  <IconRuler className="w-4 h-4" />
                </div>
                <p className="font-mono text-sm font-semibold text-[#FFFFFF] tabular-nums">
                  {CAPITAL_PRODUCT.pageCount} pages
                </p>
              </div>

              <div className="p-4 border border-[#565A5C]/40 bg-[#151515] space-y-1.5">
                <div className="flex items-center justify-between text-[#EEB149]">
                  <span className="font-mono text-[11px] text-[#A5A5A0]">SUPPORT</span>
                  <IconBlueprint className="w-4 h-4" />
                </div>
                <p className="font-mono text-sm font-semibold text-[#FFFFFF]">
                  Téléphone & PC
                </p>
              </div>
            </div>

            <div className="spec-item space-y-2.5 border-l-2 border-[#EEB149] pl-4 py-1">
              <p className="font-mono text-xs text-[#EEB149] tracking-wider">
                ARCHITECTURE DU MANUEL (3 PARTIES · 8 CHAPITRES)
              </p>
              <ul className="space-y-2 text-sm text-[#F3F1EB]">
                <li className="flex items-center gap-2.5">
                  <IconCheck className="w-4 h-4 text-[#EEB149] shrink-0" />
                  <span>
                    <strong>Partie 1 — La Défense :</strong> Paraître, Black Tax et éradication des dettes.
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <IconCheck className="w-4 h-4 text-[#EEB149] shrink-0" />
                  <span>
                    <strong>Partie 2 — L’Offensive :</strong> Actif vs Passif, loi de Parkinson et leviers.
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <IconCheck className="w-4 h-4 text-[#EEB149] shrink-0" />
                  <span>
                    <strong>Partie 3 — L’Armure :</strong> Rareté sur le marché, discrétion et plan 48h.
                  </span>
                </li>
              </ul>
            </div>

            {/* Price Converter with Strikethrough 10 000 FCFA -> 7 990 FCFA (-20,1 %) & Primary CTA */}
            <div
              ref={ctaBlockRef}
              className="p-6 sm:p-7 border border-[#EEB149]/60 bg-[#151515] space-y-6"
            >
              <PriceDisplay
                amountInXAF={CAPITAL_PRODUCT.priceXaf}
                originalPriceXaf={CAPITAL_PRODUCT.originalPriceXaf}
                salePriceXaf={CAPITAL_PRODUCT.salePriceXaf}
                salePercentage={CAPITAL_PRODUCT.salePercentage}
                isOnSale={CAPITAL_PRODUCT.isOnSale}
                saleEndsAt={CAPITAL_PRODUCT.saleEndsAt}
                showSelector={true}
                size="lg"
              />

              <div className="space-y-2.5 pt-2 border-t border-[#565A5C]/30">
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    openCheckout({
                      slug: 'le-capital-du-batisseur',
                      location: 'home_showcase',
                      triggerElement: e.currentTarget,
                    });
                  }}
                  className="flex items-center justify-center w-full py-4 px-6 text-sm font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors duration-150 cursor-pointer"
                >
                  {CAPITAL_PRODUCT.ctaLabel}
                </a>

                <Link
                  href="/ebooks/le-capital-du-batisseur"
                  className="flex items-center justify-center gap-1.5 w-full py-3 px-6 font-mono text-xs font-semibold tracking-wider border border-[#565A5C]/60 bg-[#090909] text-[#F3F1EB] hover:border-[#EEB149] hover:text-[#EEB149] transition-colors duration-150 whitespace-nowrap"
                >
                  <span>EN SAVOIR PLUS</span>
                  <IconArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                <p className="text-xs text-center text-[#A5A5A0]">
                  {CAPITAL_PRODUCT.ctaSubtext}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Liseuse d'aperçu protégée (fermée par défaut, affichée uniquement au clic sur Feuilleter) */}
        {isPreviewOpen && (
          <div
            ref={previewContainerRef}
            className="pt-10 border-t border-[#565A5C]/35"
          >
            <BookPreviewReader
              product={CAPITAL_PRODUCT}
              id="liseuse-capital-accueil"
              onClose={() => setIsPreviewOpen(false)}
            />
          </div>
        )}

        {/* Second Available Product (Le Code du Bâtisseur) */}
        <div className="pt-12 border-t border-[#565A5C]/35 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="font-mono text-xs text-[#EEB149]">
                CATALOGUE KHEOPS SET
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#FFFFFF]">
                La suite pratique : Le Code du Bâtisseur
              </h3>
            </div>

            <Link
              href="/ebooks"
              className="inline-flex items-center gap-2 font-mono text-xs text-[#EEB149] hover:text-[#FFFFFF] transition-colors"
            >
              <span>VOIR TOUT LE CATALOGUE</span>
              <IconArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="max-w-3xl">
            {/* Produit 2 : Le Code du Bâtisseur (5 000 FCFA barré -> 3 995 FCFA, -20,1 %) */}
            <FeaturedBookCard product={CODE_PRODUCT} />
          </div>
        </div>
      </div>
    </section>
  );
}
