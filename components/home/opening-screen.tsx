'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CascadeText } from '@/components/ui/cascade-text';

export function OpeningScreen() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const goldLineRef = useRef<SVGPathElement>(null);
  const verticalGuideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const goldLine = goldLineRef.current;
    const verticalGuide = verticalGuideRef.current;

    if (!section || !content || !goldLine || !verticalGuide) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(goldLine, { strokeDashoffset: 0 });
      gsap.set(verticalGuide, { scaleY: 1 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const pathLength = goldLine.getTotalLength();
      gsap.set(goldLine, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      // Initial entrance drawing of the golden technical line
      gsap.to(goldLine, {
        strokeDashoffset: 0,
        duration: 1.6,
        ease: 'power3.inOut',
        delay: 0.15,
      });

      gsap.fromTo(
        verticalGuide,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.2,
          ease: 'power2.out',
          delay: 0.6,
        }
      );

      // Scroll-driven transformation into the Hero section (reversible on scroll up)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });

      tl.to(
        content,
        {
          y: -48,
          opacity: 0.15,
          scale: 0.97,
          ease: 'none',
        },
        0
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleScrollToHero = () => {
    const heroEl = document.getElementById('hero-split');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="ouverture"
      ref={sectionRef}
      aria-label="Écran d'ouverture Kheops Set"
      className="relative min-h-[92vh] w-full bg-[#090909] bg-blueprint-grid-dark flex flex-col justify-between pt-28 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#565A5C]/30 overflow-hidden"
    >
      {/* Top technical axis coordinates */}
      <div className="mx-auto w-full max-w-[1360px] flex items-center justify-between text-xs font-mono tabular-nums text-[#A5A5A0]">
        <span>00 · OUVERTURE DU CHANTIER</span>
        <span className="hidden sm:inline">L’ACIER BIENVEILLANT</span>
        <span>ÉCHELLE 1:1</span>
      </div>

      {/* Central Manifesto & Golden Blueprint Line */}
      <div
        ref={contentRef}
        className="mx-auto w-full max-w-[1040px] my-auto py-12 flex flex-col items-center text-center"
      >
        <p className="font-mono text-xs tracking-[0.28em] text-[#A5A5A0] mb-6">
          KHEOPS SET
        </p>

        <p
          className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight text-[#FFFFFF] leading-[1.06] max-w-3xl"
          style={{ textWrap: 'balance' }}
        >
          “Les mots ne construisent rien.
          <span className="block mt-2 text-[#F3F1EB]">
            <CascadeText
              text="Les actes, oui."
              as="span"
              color="inherit"
              hoverColor="#EEB149"
              direction="up"
              duration={0.25}
              staggerDelay={0.025}
            />
            ”
          </span>
        </p>

        {/* Animated Technical Blueprint SVG Line in Gold #EEB149 */}
        <div className="w-full max-w-2xl mt-10 sm:mt-12">
          <svg
            viewBox="0 0 680 44"
            fill="none"
            className="w-full h-11 overflow-visible"
            aria-hidden="true"
          >
            {/* Baseline steel axis */}
            <line
              x1="0"
              y1="22"
              x2="680"
              y2="22"
              stroke="#565A5C"
              strokeWidth="1"
              strokeOpacity="0.35"
            />
            {/* Tick marks */}
            <line x1="0" y1="14" x2="0" y2="30" stroke="#565A5C" strokeWidth="1" />
            <line x1="170" y1="17" x2="170" y2="27" stroke="#565A5C" strokeWidth="1" />
            <line x1="340" y1="10" x2="340" y2="34" stroke="#EEB149" strokeWidth="1.5" />
            <line x1="510" y1="17" x2="510" y2="27" stroke="#565A5C" strokeWidth="1" />
            <line x1="680" y1="14" x2="680" y2="30" stroke="#565A5C" strokeWidth="1" />

            {/* Golden technical plan line */}
            <path
              ref={goldLineRef}
              d="M 0 22 L 290 22 L 340 6 L 390 22 L 680 22"
              stroke="#EEB149"
              strokeWidth="1.75"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Bottom Scroll Prompt */}
      <div className="mx-auto w-full max-w-[1360px] flex flex-col items-center">
        <button
          type="button"
          onClick={handleScrollToHero}
          className="group flex flex-col items-center gap-3 text-xs font-mono text-[#A5A5A0] hover:text-[#FFFFFF] transition-colors py-2 px-4"
        >
          <span>Descends pour voir le plan.</span>
          <span
            ref={verticalGuideRef}
            aria-hidden="true"
            className="w-px h-10 bg-[#EEB149] origin-top transition-transform duration-300 group-hover:scale-y-125"
          />
        </button>
      </div>
    </section>
  );
}
