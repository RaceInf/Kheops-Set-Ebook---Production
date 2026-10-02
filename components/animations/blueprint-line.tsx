'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface BlueprintLineProps {
  orientation?: 'horizontal' | 'vertical';
  accentGold?: boolean;
  className?: string;
}

export function BlueprintLine({
  orientation = 'horizontal',
  accentGold = false,
  className = '',
}: BlueprintLineProps) {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(el, { scaleX: 1, scaleY: 1, opacity: 1 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          scaleX: orientation === 'horizontal' ? 0 : 1,
          scaleY: orientation === 'vertical' ? 0 : 1,
          opacity: 0.35,
        },
        {
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            end: 'top 45%',
            scrub: 0.4,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [orientation]);

  return (
    <div
      ref={lineRef}
      aria-hidden="true"
      className={`${
        orientation === 'horizontal'
          ? 'h-px w-full origin-left'
          : 'w-px h-full origin-top'
      } ${accentGold ? 'bg-[#EEB149]' : 'bg-[#565A5C]/45'} ${className}`}
    />
  );
}
