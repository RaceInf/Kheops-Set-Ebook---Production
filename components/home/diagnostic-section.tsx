'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  IconCut,
  IconProtect,
  IconRepeat,
  IconRuler,
  IconBlueprint,
} from '@/components/icons/kheops-icons';

interface AuditSheet {
  id: string;
  number: string;
  title: string;
  observation: string;
  consequence: string;
  tag: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const AUDIT_SHEETS: AuditSheet[] = [
  {
    id: 'audit-01',
    number: '01',
    tag: 'STATUT VS CAPITAL',
    title: 'Tu dépenses pour être vu.',
    observation:
      'Une partie de ton argent sert à rassurer le regard des autres plutôt qu’à renforcer ta sécurité.',
    consequence: 'Le statut immédiat remplace le capital futur.',
    Icon: IconCut,
  },
  {
    id: 'audit-02',
    number: '02',
    tag: 'DISPERSION DU TEMPS',
    title: 'Tu dis oui à tout.',
    observation:
      'Chaque sollicitation devient une urgence prioritaire au détriment de tes propres projets.',
    consequence: 'Tes ressources se dispersent sans construire de socle.',
    Icon: IconProtect,
  },
  {
    id: 'audit-03',
    number: '03',
    tag: 'ACCÈS NON FILTRÉ',
    title: 'Tu protèges mal ton temps.',
    observation:
      'Tes heures libres partent dans le bruit, les écrans et les discussions qui ne changent rien.',
    consequence: 'Les semaines passent sans création de levier.',
    Icon: IconRepeat,
  },
  {
    id: 'audit-04',
    number: '04',
    tag: 'ANGLE MORT COMPTABLE',
    title: 'Tu avances sans chiffres.',
    observation:
      'Tu ne sais pas exactement combien sort chaque mois dans les petites dépenses invisibles.',
    consequence: 'Même quand le revenu monte, le compte reste vide.',
    Icon: IconRuler,
  },
  {
    id: 'audit-05',
    number: '05',
    tag: 'ILLUSION DU DÉCLIC',
    title: 'Tu attends un changement sans changer tes décisions.',
    observation:
      'Tu espères qu’une opportunité extérieure viendra régler un problème de structure interne.',
    consequence: 'Les mêmes choix répétés produisent les mêmes fins de mois.',
    Icon: IconBlueprint,
  },
];

export function DiagnosticSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position for magnetic parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Parallax transform on the giant oversized number
  const numberX = useTransform(x, [-300, 300], [-25, 25]);
  const numberY = useTransform(y, [-300, 300], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    }
  };

  const goNext = () =>
    setActiveIndex((prev) => (prev + 1) % AUDIT_SHEETS.length);
  const goPrev = () =>
    setActiveIndex(
      (prev) => (prev - 1 + AUDIT_SHEETS.length) % AUDIT_SHEETS.length
    );

  useEffect(() => {
    const timer = setInterval(goNext, 7000);
    return () => clearInterval(timer);
  }, []);

  const current = AUDIT_SHEETS[activeIndex];
  const CurrentIcon = current.Icon;

  return (
    <section
      id="diagnostic"
      aria-labelledby="diagnostic-heading"
      className="relative w-full bg-[#090909] text-[#FFFFFF] py-28 sm:py-36 px-4 sm:px-6 lg:px-8 border-b border-[#565A5C]/30 overflow-hidden"
    >
      <div className="mx-auto max-w-[1360px] space-y-12">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end border-b border-[#565A5C]/30 pb-8">
          <div className="lg:col-span-7 space-y-3">
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
            <p className="text-base sm:text-lg text-[#F3F1EB] font-medium leading-snug border-l-2 border-[#EEB149] pl-4 sm:pl-5">
              Parfois, le problème est ce que tu fais avec ce que tu as.
            </p>
          </div>
        </div>

        {/* Interactive Kinetic Testimonial / Diagnostic Showcase */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="relative w-full bg-[#151515] border border-[#565A5C]/40 p-6 sm:p-10 lg:p-14 overflow-hidden"
        >
          {/* Oversized Index Number bleeding off the left edge */}
          <motion.div
            aria-hidden="true"
            className="absolute -left-6 sm:-left-12 top-1/2 -translate-y-1/2 text-[16rem] sm:text-[24rem] lg:text-[28rem] font-bold text-[#FFFFFF]/[0.03] select-none pointer-events-none leading-none tracking-tighter"
            style={{ x: numberX, y: numberY }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.82, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                {current.number}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* Main Content Layout */}
          <div className="relative flex flex-col md:flex-row items-stretch">
            {/* Left Column: Vertical Technical Indicator & Progress */}
            <div className="hidden md:flex flex-col items-center justify-between pr-8 lg:pr-12 border-r border-[#565A5C]/35 select-none">
              <motion.span
                className="text-[11px] font-mono text-[#A5A5A0] tracking-widest uppercase"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                AUDIT DE STRUCTURE
              </motion.span>

              {/* Vertical dynamic progress bar */}
              <div className="relative h-36 w-[2px] bg-[#565A5C]/30 my-8">
                <motion.div
                  className="absolute top-0 left-0 w-full bg-[#EEB149] origin-top"
                  animate={{
                    height: `${((activeIndex + 1) / AUDIT_SHEETS.length) * 100}%`,
                  }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              <span className="font-mono text-xs text-[#EEB149] tabular-nums font-semibold">
                {current.number}/05
              </span>
            </div>

            {/* Center: Main Audit Content */}
            <div className="flex-1 md:pl-8 lg:pl-12 py-2 sm:py-4 flex flex-col justify-between">
              {/* Top Badge Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center gap-2.5"
                  >
                    <span className="inline-flex items-center gap-2 text-xs font-mono text-[#F3F1EB] border border-[#565A5C]/50 bg-[#090909] px-3 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EEB149] animate-pulse" />
                      FICHE {current.number} · {current.tag}
                    </span>
                  </motion.div>
                </AnimatePresence>

                {/* Direct Pill Selector */}
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  {AUDIT_SHEETS.map((sheet, idx) => (
                    <button
                      key={sheet.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Aller à la fiche d'audit ${sheet.number}`}
                      className={`w-7 h-7 flex items-center justify-center border transition-colors cursor-pointer text-[11px] ${
                        idx === activeIndex
                          ? 'border-[#EEB149] bg-[#EEB149] text-[#090909] font-bold'
                          : 'border-[#565A5C]/40 text-[#A5A5A0] hover:border-[#F3F1EB] hover:text-[#FFFFFF]'
                      }`}
                    >
                      {sheet.number}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Statement with 3D Word Reveal */}
              <div className="relative mb-8 sm:mb-10 min-h-[110px] sm:min-h-[140px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={activeIndex}
                    className="font-display text-2xl sm:text-4xl lg:text-5xl font-semibold text-[#FFFFFF] leading-[1.15] tracking-tight"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {current.title.split(' ').map((word, i) => (
                      <motion.span
                        key={i}
                        className="inline-block mr-[0.28em]"
                        variants={{
                          hidden: { opacity: 0, y: 18, rotateX: 90 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            rotateX: 0,
                            transition: {
                              duration: 0.45,
                              delay: i * 0.04,
                              ease: [0.22, 1, 0.36, 1],
                            },
                          },
                          exit: {
                            opacity: 0,
                            y: -10,
                            transition: { duration: 0.18, delay: i * 0.02 },
                          },
                        }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.blockquote>
                </AnimatePresence>
              </div>

              {/* Observation & Consequence Row + Navigation Buttons */}
              <div className="pt-6 border-t border-[#565A5C]/35 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                    className="space-y-3 max-w-xl"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-7 h-[2px] bg-[#EEB149] shrink-0"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{ originX: 0 }}
                      />
                      <p className="text-xs sm:text-sm font-mono text-[#EEB149] tracking-wider font-semibold">
                        IMPACT : {current.consequence}
                      </p>
                    </div>

                    <p className="text-sm sm:text-base text-[#A5A5A0] leading-relaxed pl-10">
                      {current.observation}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Prev / Next Controls with Subtle Magnetic Feel */}
                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <motion.button
                    type="button"
                    onClick={goPrev}
                    aria-label="Fiche d'audit précédente"
                    whileTap={{ scale: 0.94 }}
                    className="group relative w-12 h-12 border border-[#565A5C]/60 hover:border-[#EEB149] bg-[#090909] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-[#FFFFFF] group-hover:text-[#EEB149] transition-colors"
                      aria-hidden="true"
                    >
                      <path
                        d="M10 12L6 8L10 4"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={goNext}
                    aria-label="Fiche d'audit suivante"
                    whileTap={{ scale: 0.94 }}
                    className="group relative w-12 h-12 border border-[#565A5C]/60 hover:border-[#EEB149] bg-[#090909] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-[#FFFFFF] group-hover:text-[#EEB149] transition-colors"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 4L10 8L6 12"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom subtle architectural ticker */}
          <div
            aria-hidden="true"
            className="mt-8 -mb-4 -mx-6 sm:-mx-10 lg:-mx-14 overflow-hidden opacity-[0.07] pointer-events-none select-none border-t border-[#565A5C]/20 pt-4"
          >
            <motion.div
              className="flex whitespace-nowrap text-3xl sm:text-5xl font-mono font-bold tracking-tight text-[#FFFFFF]"
              animate={{ x: [0, -1200] }}
              transition={{
                duration: 26,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'linear',
              }}
            >
              {[...Array(6)].map((_, i) => (
                <span key={i} className="mx-6">
                  AUDIT TECHNIQUE · LE CAPITAL DU BÂTISSEUR · STRUCTURE · LIMITES · CAPITAL · DISCIPLINE ·
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
