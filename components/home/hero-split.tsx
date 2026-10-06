'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getChariowCheckoutUrl, CAPITAL_PRODUCT } from '@/lib/ebooks-data';
import { useCurrency } from '@/context/currency-context';
import { IconCheck, IconCrosshair } from '@/components/icons/kheops-icons';

const LEFT_REALITY_ITEMS = [
  'Le bruit.',
  'Le paraître.',
  'La dispersion.',
  'Les dépenses inutiles.',
  'L’absence de limites.',
  'L’attente.',
  'Les promesses vides.',
];

const RIGHT_REALITY_ITEMS = [
  'Le calme.',
  'Le plan.',
  'Le capital.',
  'Les limites.',
  'La répétition.',
  'Les décisions.',
  'Les actes.',
];

export function HeroSplit() {
  const sectionRef = useRef<HTMLElement>(null);
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  // Percentage allocated to Right (Plan B) on desktop: starts at 48%, expands to 74% on scroll
  const [rightShare, setRightShare] = useState<number>(48);
  const { formatPrice, currency } = useCurrency();
  const checkoutUrl = getChariowCheckoutUrl();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const frame = requestAnimationFrame(() => setRightShare(62));
      return () => cancelAnimationFrame(frame);
    }

    gsap.registerPlugin(ScrollTrigger);

    const stateObj = { share: 46 };
    const ctx = gsap.context(() => {
      gsap.to(stateObj, {
        share: 74,
        ease: 'none',
        onUpdate: () => {
          setRightShare(Math.round(stateObj.share));
        },
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
          end: 'bottom 35%',
          scrub: 0.4,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const leftShare = 100 - rightShare;

  return (
    <section
      id="hero-split"
      ref={sectionRef}
      aria-labelledby="hero-main-heading"
      className="relative w-full bg-[#090909] py-28 sm:py-40 px-4 sm:px-6 lg:px-8 border-b border-[#565A5C]/30"
    >
      <div className="mx-auto max-w-[1360px] space-y-12 sm:space-y-16">
        {/* Top Hero Editorial Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center gap-2 text-xs font-mono text-[#A5A5A0]">
              <span>01 · COMPARAISON DE TRAJECTOIRE</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#EEB149]">UNE VIE EST UN CHANTIER</span>
            </div>

            <h2
              id="hero-main-heading"
              className="font-display text-3xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-[#FFFFFF] leading-[1.05]"
              style={{ textWrap: 'balance' }}
            >
              Tu ne manques pas toujours de force.{' '}
              <span className="text-[#EEB149] block sm:inline">
                Tu manques parfois de plan.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-4 space-y-4 border-l border-[#565A5C]/40 pl-5">
            <p className="text-base sm:text-lg text-[#F3F1EB] leading-relaxed">
              Le Capital du Bâtisseur t’aide à reprendre le contrôle de ton argent, de ton temps et de tes décisions.
            </p>
          </div>
        </div>

        {/* Interactive & Scroll-Driven Vertical Split A vs B */}
        <div className="space-y-3">
          {/* Interactive Calibration Bar for Manual or Scroll Inspection */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#A5A5A0] pb-1">
            <div className="flex items-center gap-3">
              <span>PLATEAU A : {leftShare}%</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#EEB149]">PLATEAU B (STRUCTURE) : {rightShare}%</span>
            </div>

            <div
              role="group"
              aria-label="Comparer les deux réalités"
              className="inline-flex items-center border border-[#565A5C]/40 bg-[#151515] p-0.5"
            >
              <button
                type="button"
                onClick={() => setRightShare(35)}
                className={`px-2.5 py-1 text-xs transition-colors whitespace-nowrap ${
                  rightShare < 45
                    ? 'bg-[#565A5C] text-[#FFFFFF]'
                    : 'text-[#A5A5A0] hover:text-[#FFFFFF]'
                }`}
              >
                Dispersion
              </button>
              <button
                type="button"
                onClick={() => setRightShare(50)}
                className={`px-2.5 py-1 text-xs transition-colors whitespace-nowrap ${
                  rightShare >= 45 && rightShare <= 55
                    ? 'bg-[#565A5C] text-[#FFFFFF]'
                    : 'text-[#A5A5A0] hover:text-[#FFFFFF]'
                }`}
              >
                50 / 50
              </button>
              <button
                type="button"
                onClick={() => setRightShare(74)}
                className={`px-2.5 py-1 text-xs transition-colors whitespace-nowrap ${
                  rightShare > 55
                    ? 'bg-[#EEB149] text-[#090909] font-semibold'
                    : 'text-[#A5A5A0] hover:text-[#FFFFFF]'
                }`}
              >
                Le Plan
              </button>
            </div>
          </div>

          {/* Split Container */}
          <div
            ref={splitContainerRef}
            className="relative flex flex-col lg:flex-row w-full border border-[#565A5C]/45 bg-[#151515] overflow-hidden"
          >
            {/* LEFT PANE: CE QUI CONSOMME (A) */}
            <div
              ref={leftPaneRef}
              style={{ flexBasis: `${leftShare}%` }}
              className="relative p-6 sm:p-10 lg:p-12 bg-[#151515] text-[#A5A5A0] transition-[flex-basis] duration-200 ease-out flex flex-col justify-between border-b lg:border-b-0 border-[#565A5C]/30"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-4">
                  <span className="font-mono text-xs tracking-wider text-[#A5A5A0]">
                    RÉALITÉ A · SUBIR
                  </span>
                  <span className="font-mono text-xs text-[#565A5C]">01.A</span>
                </div>

                <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#A5A5A0]">
                  Ce qui consomme ta vie
                </h2>

                <ul className="space-y-3.5 pt-2">
                  {LEFT_REALITY_ITEMS.map((item, idx) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm sm:text-base text-[#A5A5A0]/85"
                    >
                      <span
                        aria-hidden="true"
                        className="font-mono text-xs text-[#565A5C] tabular-nums"
                      >
                        0{idx + 1}
                      </span>
                      <span className="line-through decoration-[#565A5C]/60">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-8 pt-4 border-t border-[#565A5C]/25 text-xs font-mono text-[#A5A5A0]">
                RÉSULTAT : FATIGUE CONSTANTE · COMPTE À ZÉRO
              </p>
            </div>

            {/* VERTICAL GOLDEN DIVIDER LINE */}
            <div
              ref={dividerRef}
              aria-hidden="true"
              className="hidden lg:flex flex-col items-center justify-center w-px bg-[#EEB149] relative z-10 shrink-0"
            >
              <div className="w-6 h-6 bg-[#090909] border border-[#EEB149] flex items-center justify-center text-[#EEB149]">
                <IconCrosshair className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* RIGHT PANE: CE QUI CONSTRUIT (B) */}
            <div
              ref={rightPaneRef}
              style={{ flexBasis: `${rightShare}%` }}
              className="relative p-6 sm:p-10 lg:p-12 bg-[#090909] bg-blueprint-grid-dark text-[#FFFFFF] transition-[flex-basis] duration-200 ease-out flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#565A5C]/40 pb-4">
                  <span className="font-mono text-xs tracking-wider text-[#EEB149]">
                    RÉALITÉ B · BÂTIR
                  </span>
                  <span className="font-mono text-xs text-[#F3F1EB]">01.B</span>
                </div>

                <h2 className="font-display text-xl sm:text-3xl font-bold text-[#FFFFFF]">
                  Ce qui construit ton avenir
                </h2>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {RIGHT_REALITY_ITEMS.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 p-3 border border-[#565A5C]/35 bg-[#151515]/80 text-sm sm:text-base font-medium text-[#FFFFFF]"
                    >
                      <IconCheck className="w-4 h-4 text-[#EEB149] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-8 pt-4 border-t border-[#565A5C]/40 text-xs font-mono text-[#F3F1EB] flex items-center justify-between">
                <span>RÉSULTAT : SOCLE SOLIDE · SOUVERAINETÉ</span>
                <span className="text-[#EEB149]">ACTIF</span>
              </p>
            </div>
          </div>
        </div>

        {/* Hero Action Block */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-[#565A5C]/30">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={checkoutUrl}
                className="px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors duration-150 whitespace-nowrap"
              >
                PRENDRE LE PLAN
              </a>

              <a
                href="#produit-vedette"
                className="px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider border border-[#565A5C] text-[#FFFFFF] hover:border-[#FFFFFF] hover:bg-[#151515] transition-colors duration-150 whitespace-nowrap"
              >
                VOIR CE QUE CONTIENT LE LIVRE
              </a>
            </div>

            <p className="text-xs text-[#A5A5A0]">
              Paiement et accès via Chariow.
            </p>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs text-[#A5A5A0] tabular-nums">
            <div>
              <span className="block text-[#FFFFFF] font-semibold">49 PAGES</span>
              <span>FORMAT PDF DIRECT</span>
            </div>
            <div className="h-8 w-px bg-[#565A5C]/40" aria-hidden="true" />
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-[#EEB149] font-bold">
                  {formatPrice(
                    CAPITAL_PRODUCT.salePriceXaf ?? CAPITAL_PRODUCT.priceXaf,
                    currency
                  )}
                </span>
                {CAPITAL_PRODUCT.originalPriceXaf && (
                  <span className="text-[11px] text-[#A5A5A0] line-through">
                    {formatPrice(CAPITAL_PRODUCT.originalPriceXaf, currency)}
                  </span>
                )}
              </div>
              <span>PROMO -20,1 % · ACCÈS IMMÉDIAT</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
