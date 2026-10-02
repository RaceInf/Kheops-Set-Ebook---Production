'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface PageImmersionProps {
  children: React.ReactNode;
  coordinates?: string;
}

/**
 * Enveloppe d'immersion architecturale pour les pages intérieures :
 * - Dessine une ligne de plan dorée (#EEB149) à l'ouverture de la page
 * - Anime l'apparition fluide et réversible des sections au scroll (avec respect strict de prefers-reduced-motion)
 * - Ajoute les repères techniques de la Salle des Plans Kheops Set
 */
export function PageImmersion({
  children,
  coordinates = 'SALLE DES PLANS · KHEOPS SET',
}: PageImmersionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topBlueprintLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const topLine = topBlueprintLineRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (topLine) {
        gsap.fromTo(
          topLine,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.9, ease: 'power3.out' }
        );
      }

      const sections = container.querySelectorAll('section, article, header, blockquote');
      sections.forEach((sec, idx) => {
        if (idx === 0) return; // Laisse le premier bloc au-dessus de la ligne de flottaison immédiatement visible (LCP)
        gsap.fromTo(
          sec,
          { y: 24, opacity: 0.15 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 90%',
              end: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Ligne de plan technique dorée animée + coordonnées */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-[#A5A5A0]">
          <span>{coordinates}</span>
          <span className="text-[#EEB149]">STRUCTURE ACTIVE</span>
        </div>
        <div className="w-full h-px bg-[#565A5C]/30 overflow-hidden">
          <div
            ref={topBlueprintLineRef}
            className="w-full h-full bg-gradient-to-r from-[#EEB149] via-[#EEB149]/60 to-transparent"
          />
        </div>
      </div>

      {children}
    </div>
  );
}
