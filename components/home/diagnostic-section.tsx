'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  IconCut,
  IconProtect,
  IconRepeat,
  IconRuler,
  IconBlueprint,
} from '@/components/icons/kheops-icons';

interface AuditSheet {
  id: string;
  title: string;
  observation: string;
  consequence: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const AUDIT_SHEETS: AuditSheet[] = [
  {
    id: '01',
    title: 'Tu dépenses pour être vu.',
    observation:
      'Une partie de ton argent sert à rassurer le regard des autres plutôt qu’à renforcer ta sécurité.',
    consequence: 'Le statut immédiat remplace le capital futur.',
    Icon: IconCut,
  },
  {
    id: '02',
    title: 'Tu dis oui à tout.',
    observation:
      'Chaque sollicitation devient une urgence prioritaire au détriment de tes propres projets.',
    consequence: 'Tes ressources se dispersent sans construire de socle.',
    Icon: IconProtect,
  },
  {
    id: '03',
    title: 'Tu protèges mal ton temps.',
    observation:
      'Tes heures libres partent dans le bruit, les écrans et les discussions qui ne changent rien.',
    consequence: 'Les semaines passent sans création de levier.',
    Icon: IconRepeat,
  },
  {
    id: '04',
    title: 'Tu avances sans chiffres.',
    observation:
      'Tu ne sais pas exactement combien sort chaque mois dans les petites dépenses invisibles.',
    consequence: 'Même quand le revenu monte, le compte reste vide.',
    Icon: IconRuler,
  },
  {
    id: '05',
    title: 'Tu attends un changement sans changer tes décisions.',
    observation:
      'Tu espères qu’une opportunité extérieure viendra régler un problème de structure interne.',
    consequence: 'Les mêmes choix répétés produisent les mêmes fins de mois.',
    Icon: IconBlueprint,
  },
];

export function DiagnosticSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        gsap.fromTo(
          card,
          {
            y: 36,
            opacity: 0.15,
          },
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              end: 'top 52%',
              scrub: 0.35,
            },
            delay: idx * 0.04,
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="diagnostic"
      ref={sectionRef}
      aria-labelledby="diagnostic-heading"
      className="relative w-full bg-[#090909] text-[#FFFFFF] py-32 sm:py-40 px-4 sm:px-6 lg:px-8 border-b border-[#565A5C]/30"
    >
      <div className="mx-auto max-w-[1360px] space-y-14 sm:space-y-20">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-[#565A5C]/30 pb-8">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#A5A5A0]">
              <span>SECTION D · LE DIAGNOSTIC</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#EEB149]">5 FICHES D’AUDIT</span>
            </div>

            <h2
              id="diagnostic-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFFFFF] leading-[1.08]"
              style={{ textWrap: 'balance' }}
            >
              Le problème n’est pas toujours l’argent.
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-lg sm:text-xl text-[#F3F1EB] font-medium leading-snug border-l-2 border-[#EEB149] pl-5">
              Parfois, le problème est ce que tu fais avec ce que tu as.
            </p>
          </div>
        </div>

        {/* 5 Technical Audit Sheets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {AUDIT_SHEETS.map((sheet, idx) => {
            const IconComponent = sheet.Icon;
            const colSpanClass = idx < 3 ? 'lg:col-span-2' : 'lg:col-span-3';

            return (
              <article
                key={sheet.id}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                className={`${colSpanClass} group relative bg-[#151515] border border-[#565A5C]/40 hover:border-[#EEB149] transition-colors duration-200 p-6 sm:p-8 flex flex-col justify-between`}
              >
                <div className="space-y-6">
                  {/* Top Technical Sheet Bar */}
                  <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-4">
                    <span className="font-mono text-xs text-[#EEB149] font-semibold tabular-nums">
                      FICHE {sheet.id}
                    </span>
                    <div className="w-9 h-9 border border-[#565A5C]/40 bg-[#090909] flex items-center justify-center text-[#F3F1EB] group-hover:border-[#EEB149] group-hover:text-[#EEB149] transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Audit Statement */}
                  <div className="space-y-3">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF] leading-snug">
                      {sheet.id}. {sheet.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
                      {sheet.observation}
                    </p>
                  </div>
                </div>

                {/* Bottom Consequence Line */}
                <div className="mt-8 pt-4 border-t border-[#565A5C]/25 flex items-center justify-between gap-2 text-xs font-mono text-[#F3F1EB]">
                  <span>IMPACT : {sheet.consequence}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
