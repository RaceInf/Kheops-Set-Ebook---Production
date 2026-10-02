'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  IconCut,
  IconProtect,
  IconConstruct,
  IconRepeat,
} from '@/components/icons/kheops-icons';

interface PlanStep {
  number: string;
  title: string;
  description: string;
  keyPoint: string;
  metric: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const PLAN_STEPS: PlanStep[] = [
  {
    number: '01',
    title: 'COUPE',
    description: 'Réduis ce qui vide ton temps et ton argent.',
    keyPoint: 'Arrêt immédiat des fuites.',
    metric: 'GARROT FINANCIER · 72H',
    Icon: IconCut,
  },
  {
    number: '02',
    title: 'PROTÈGE',
    description: 'Pose des limites. Garde de la place pour ton avenir.',
    keyPoint: 'Une limite est une protection.',
    metric: 'ÉTANCHÉITÉ DU PÉRIMÈTRE',
    Icon: IconProtect,
  },
  {
    number: '03',
    title: 'CONSTRUIS',
    description: 'Transforme une partie de tes revenus en base solide.',
    keyPoint: 'Se payer soi-même en premier.',
    metric: 'CAPITALISATION · 10% À 20%',
    Icon: IconConstruct,
  },
  {
    number: '04',
    title: 'RÉPÈTE',
    description: 'Les petits gestes deviennent une structure.',
    keyPoint: 'La discipline remplace l’humeur.',
    metric: 'CADENCE LONG TERME',
    Icon: IconRepeat,
  },
];

export function StickyPlanScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    const section = sectionRef.current;
    const progressBar = progressBarRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (progressBar) gsap.set(progressBar, { scaleY: 1 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Overall vertical gold progress line linked to section scroll
      if (progressBar) {
        gsap.fromTo(
          progressBar,
          { scaleY: 0.15 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 55%',
              end: 'bottom 65%',
              scrub: 0.3,
            },
          }
        );
      }

      // Distinct reversible animation per step card
      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const initialProps =
          index === 0
            ? { opacity: 0.25, x: -24, y: 0, scale: 1 } // Step 1: Horizontal cut slide
            : index === 1
            ? { opacity: 0.25, x: 0, y: 16, scale: 0.97 } // Step 2: Perimeter lock scale
            : index === 2
            ? { opacity: 0.25, x: 0, y: 32, scale: 1 } // Step 3: Foundation vertical rise
            : { opacity: 0.25, x: 20, y: 12, scale: 1 }; // Step 4: Rhythmic alignment

        gsap.fromTo(card, initialProps, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            end: 'top 42%',
            scrub: 0.35,
            onEnter: () => setActiveStep(index),
            onEnterBack: () => setActiveStep(index),
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="le-plan"
      ref={sectionRef}
      aria-labelledby="sticky-plan-heading"
      className="relative w-full bg-[#F3F1EB] bg-blueprint-grid-light text-[#090909] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#565A5C]/30"
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT COLUMN: Sticky on Desktop, Clean Header on Mobile */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#565A5C]">
                <span>02 · SÉQUENCE D’EXÉCUTION</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#090909] font-semibold">4 ÉTAPES</span>
              </div>

              <h2
                id="sticky-plan-heading"
                className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#090909] leading-[1.08]"
                style={{ textWrap: 'balance' }}
              >
                Une vie solide ne se construit pas en une nuit.
              </h2>

              <p className="text-base sm:text-lg text-[#151515]/85 leading-relaxed max-w-md">
                Elle se construit avec des décisions simples, répétées longtemps.
              </p>
            </div>

            {/* Technical Step Indicator Rail (Desktop & Tablet) */}
            <div className="relative pl-6 border-l border-[#565A5C]/35 space-y-4">
              <div
                ref={progressBarRef}
                aria-hidden="true"
                className="absolute top-0 left-[-1.5px] w-[3px] h-full bg-[#EEB149] origin-top"
              />

              {PLAN_STEPS.map((step, idx) => {
                const isCurrent = activeStep === idx;
                return (
                  <div
                    key={step.number}
                    className={`flex items-center justify-between text-xs font-mono tabular-nums transition-colors duration-200 ${
                      isCurrent ? 'text-[#090909] font-semibold' : 'text-[#565A5C]'
                    }`}
                  >
                    <span>
                      {step.number}. {step.title}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 ${
                        isCurrent
                          ? 'bg-[#090909] text-[#EEB149]'
                          : 'text-[#565A5C]'
                      }`}
                    >
                      {isCurrent ? 'EN COURS' : `ÉTAPE ${idx + 1}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: 4 Progressive Architectural Cards */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {PLAN_STEPS.map((step, idx) => {
              const IconComponent = step.Icon;
              const isCurrent = activeStep === idx;

              return (
                <article
                  key={step.number}
                  ref={(el) => {
                    cardRefs.current[idx] = el as HTMLDivElement | null;
                  }}
                  className={`relative bg-[#FFFFFF] border transition-colors duration-200 p-6 sm:p-9 ${
                    isCurrent
                      ? 'border-[#090909]'
                      : 'border-[#565A5C]/35'
                  }`}
                >
                  {/* Top Technical Bar */}
                  <div className="flex items-center justify-between border-b border-[#565A5C]/25 pb-4 mb-6">
                    <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
                      <span className="px-2 py-0.5 bg-[#090909] text-[#EEB149] font-semibold">
                        {step.number}
                      </span>
                      <span className="text-[#565A5C]">{step.metric}</span>
                    </div>

                    <div
                      className={`w-10 h-10 flex items-center justify-center border ${
                        isCurrent
                          ? 'border-[#090909] bg-[#090909] text-[#EEB149]'
                          : 'border-[#565A5C]/30 bg-[#F3F1EB] text-[#090909]'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Step Title & Core Copy */}
                  <div className="space-y-3">
                    <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#090909]">
                      {step.number}. {step.title}
                    </h3>

                    <p className="text-lg sm:text-xl font-medium text-[#151515] leading-snug">
                      “{step.description}”
                    </p>
                  </div>

                  {/* Gold Accent Key Point Line */}
                  <div className="mt-6 pt-4 border-t border-[#565A5C]/20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className="w-2 h-2 bg-[#EEB149] shrink-0"
                      />
                      <span className="text-xs sm:text-sm font-mono font-medium text-[#090909]">
                        {step.keyPoint}
                      </span>
                    </div>

                    <span className="font-mono text-xs text-[#565A5C] tabular-nums">
                      0{idx + 1} / 04
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
