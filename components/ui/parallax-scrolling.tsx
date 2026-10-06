'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

export interface ParallaxLayerItem {
  layer: string;
  yPercent: number;
}

export interface ParallaxComponentProps {
  title?: string;
  subtitle?: string;
  tag?: string;
  className?: string;
  layers?: {
    src?: string;
    alt?: string;
    customContent?: React.ReactNode;
  }[];
}

export function ParallaxComponent({
  title = "UNE VIE EST UN CHANTIER",
  subtitle = "L’ACIER BIENVEILLANT · KHEOPS SET",
  tag = "ARCHITECTURE INTÉRIEURE",
  className = "",
}: ParallaxComponentProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      const layers: ParallaxLayerItem[] = [
        { layer: "1", yPercent: 45 },
        { layer: "2", yPercent: 30 },
        { layer: "3", yPercent: 15 },
        { layer: "4", yPercent: -15 },
      ];

      layers.forEach((layerObj, idx) => {
        const targets = triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`);
        if (targets.length > 0) {
          tl.to(
            targets,
            {
              yPercent: layerObj.yPercent,
              ease: "none",
            },
            idx === 0 ? undefined : "<"
          );
        }
      });
    }

    let lenis: Lenis | null = null;
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis?.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } catch {
      // Lenis optional fallback
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (triggerElement) {
        gsap.killTweensOf(triggerElement);
      }
      lenis?.destroy();
    };
  }, []);

  return (
    <div className={`relative w-full overflow-hidden bg-[#090909] text-[#FFFFFF] py-24 sm:py-32 ${className}`} ref={parallaxRef}>
      {/* Background Architectural Blueprint Grid */}
      <div aria-hidden="true" className="absolute inset-0 bg-blueprint-grid-dark opacity-30 pointer-events-none" />

      <section className="relative w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[480px] sm:min-h-[580px] flex items-center justify-center border border-[#565A5C]/40 bg-[#151515]/60 overflow-hidden">
          
          <div data-parallax-layers className="relative w-full h-full min-h-[480px] sm:min-h-[580px] flex items-center justify-center">
            {/* Layer 1: Fond géométrique et lignes techniques dorées */}
            <div
              data-parallax-layer="1"
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none will-change-transform"
            >
              <div className="w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] border border-[#EEB149]/40 rounded-full" />
              <div className="absolute w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] border border-[#565A5C]/50 rotate-45" />
            </div>

            {/* Layer 2: Données techniques & repères typographiques d'arrière-plan */}
            <div
              data-parallax-layer="2"
              aria-hidden="true"
              className="absolute inset-x-8 top-12 flex justify-between font-mono text-[11px] text-[#A5A5A0]/60 will-change-transform"
            >
              <span>SYS.ARCH // SECTION 04</span>
              <span className="text-[#EEB149]/80">AXE 4.88 // 09.09</span>
            </div>

            {/* Layer 3: Titre Monumental & Typographie Centrale */}
            <div
              data-parallax-layer="3"
              className="relative z-10 text-center px-4 sm:px-8 space-y-4 max-w-3xl will-change-transform"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#EEB149]/40 bg-[#090909]/90 font-mono text-xs text-[#EEB149] tracking-wider">
                <span className="w-1.5 h-1.5 bg-[#EEB149]" />
                <span>{tag}</span>
              </div>

              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FFFFFF] leading-[1.08]">
                {title}
              </h2>

              <p className="font-mono text-xs sm:text-sm text-[#A5A5A0] tracking-widest pt-2">
                {subtitle}
              </p>
            </div>

            {/* Layer 4: Lignes d'acier et repères de mesure de premier plan */}
            <div
              data-parallax-layer="4"
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 pointer-events-none will-change-transform"
            >
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#EEB149]/60 to-transparent" />
            </div>
          </div>

          {/* Vignette & Fade Overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-[#090909]/70 via-transparent to-[#090909]/80 pointer-events-none"
          />
        </div>
      </section>
    </div>
  );
}
export default ParallaxComponent;
