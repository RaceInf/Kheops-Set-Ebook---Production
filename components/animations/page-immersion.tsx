'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface PageImmersionProps {
  children: React.ReactNode;
  coordinates?: string;
  className?: string;
}

/**
 * Enveloppe d'immersion architecturale pour les pages intérieures :
 * - Anime l'apparition fluide et réversible des sections au scroll (avec respect strict de prefers-reduced-motion)
 */
export function PageImmersion({
  children,
  className = '',
}: PageImmersionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
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
    <div ref={containerRef} className={`relative ${className}`}>
      {children}
    </div>
  );
}
