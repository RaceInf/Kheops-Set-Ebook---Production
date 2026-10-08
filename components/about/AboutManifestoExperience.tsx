'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AVAILABLE_PRODUCTS, getChariowCheckoutUrl } from '@/lib/products';
import { PriceDisplay } from '@/components/ui/price-display';
import { ChariowBuyButton } from '@/components/ui/chariow-buy-button';
import {
  IconCut,
  IconProtect,
  IconRepeat,
  IconRuler,
  IconBlueprint,
  IconCheck,
  IconArrowUpRight,
  IconPdf,
} from '@/components/icons/kheops-icons';

interface Law {
  id: string;
  number: string;
  code: string;
  title: string;
  subtitle: string;
  statement: string;
  brutalTruth: string;
  operationalRule: string;
  metricLabel: string;
  metricValue: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const LAWS_OF_STEEL: Law[] = [
  {
    id: 'law-1',
    number: '01',
    code: 'LEX-VERITAS',
    title: 'La Vérité sans Fard',
    subtitle: 'LE REFUS DES EXCUSES QUI ENFERMENT',
    statement:
      'Une flatterie qui rassure coûte dix ans d’inertie. Nous refusons les mensonges polis.',
    brutalTruth:
      'Les excuses expliquent pourquoi rien ne change. Les actes mesurent ce qui existe réellement.',
    operationalRule:
      'Chaque semaine, liste tes résultats réels chiffrés. Supprime tout narratif explicatif.',
    metricLabel: 'TOLÉRANCE AUX NARRATIFS DE COMPLAISANCE',
    metricValue: '0.00%',
    Icon: IconCut,
  },
  {
    id: 'law-2',
    number: '02',
    code: 'LEX-AUCTOR',
    title: 'Le Verrou Anti-Paraître',
    subtitle: 'DÉMANTELER L’IMPÔT DU STATUT',
    statement:
      'Tu ne peux pas bâtir ton indépendance avec l’argent que tu brûles pour impressionner des spectateurs.',
    brutalTruth:
      'Le paraître est un impôt volontaire prélevé par le regard des autres sur ton capital futur.',
    operationalRule:
      'Tout achat de confort immédiat destiné à être vu est reporté de 30 jours ou annulé.',
    metricLabel: 'CONSERVATION DU CAPITAL BRUT',
    metricValue: '+100%',
    Icon: IconProtect,
  },
  {
    id: 'law-3',
    number: '03',
    code: 'LEX-TEMPORIS',
    title: 'Le Sanctuaire du Temps',
    subtitle: 'LES LIMITES QUI SAUVENT LE CHANTIER',
    statement:
      'Tout le monde veut accéder à ton attention. Personne ne compensera tes années perdues.',
    brutalTruth:
      'Dire oui à toutes les sollicitations par peur de décevoir est une trahison de tes priorités.',
    operationalRule:
      'Installe un refus par défaut sur tout ce qui ne s’inscrit pas dans ton plan d’exécution trimestriel.',
    metricLabel: 'PERMÉABILITÉ AUX SOLLICITATIONS EXTERNES',
    metricValue: 'VERROUILLÉE',
    Icon: IconRepeat,
  },
  {
    id: 'law-4',
    number: '04',
    code: 'LEX-STRUCTURA',
    title: 'La Forge de la Répétition',
    subtitle: 'REMPLACER LE DÉCLIC PAR LA MÉCANIQUE',
    statement:
      'La motivation est une étincelle instable. Une vie solide repose sur une routine silencieuse.',
    brutalTruth:
      'Ceux qui attendent d’avoir envie attendent toute leur vie. Les bâtisseurs exécutent à froid.',
    operationalRule:
      'Calibre tes objectifs non pas sur ton niveau d’énergie maximale, mais sur ce que tu peux tenir le pire jour du mois.',
    metricLabel: 'CONSTANCE SYSTÉMIQUE D’EXÉCUTION',
    metricValue: 'MÉCANIQUE',
    Icon: IconRuler,
  },
];

const COMPARATIVE_AXES = [
  {
    illusion: 'Consommer pour prouver sa réussite',
    forge: 'Construire en silence un capital de résistance',
    cost: 'Endettement invisible & anxiété',
    gain: 'Souveraineté & tranquillité',
  },
  {
    illusion: 'Attendre un déclic ou une opportunité magique',
    forge: 'Poser chaque jour une brique non négociable',
    cost: 'Des années d’attente immobile',
    gain: 'Croissance exponentielle mesurée',
  },
  {
    illusion: 'Être disponible pour tout le monde pour plaire',
    forge: 'Protéger son temps comme un coffre-fort',
    cost: 'Dispersion mentale & frustration',
    gain: 'Profondeur de travail & respect réel',
  },
  {
    illusion: 'Parler de ses projets avant de les avoir finis',
    forge: 'Laisser les résultats bruts parler d’eux-mêmes',
    cost: 'Soulagement artificiel immédiat',
    gain: 'Puissance d’exécution irréfutable',
  },
];

export function AboutManifestoExperience() {
  const [activeLawIndex, setActiveLawIndex] = useState(0);

  // Interactive Diagnostic Simulator State
  const [monthlyIncome, setMonthlyIncome] = useState(150000); // En FCFA (ajustable par l'utilisateur)
  const [statusSpendPct, setStatusSpendPct] = useState(25);
  const [unprotectedHours, setUnprotectedHours] = useState(10);
  const [executionDiscipline, setExecutionDiscipline] = useState(40);

  // Derived metrics for the interactive simulator (100% mathematically verifiable & non-speculative)
  const annualIncome = monthlyIncome * 12;
  const estimatedAnnualWaste = Math.round((statusSpendPct / 100) * annualIncome);
  const annualHoursLost = unprotectedHours * 52;
  const annualDaysLost = Math.round((annualHoursLost / 8) * 10) / 10;

  const structuralScore = Math.max(
    5,
    Math.min(98, Math.round(executionDiscipline * 0.7 - statusSpendPct * 0.4 - unprotectedHours * 1.2 + 50))
  );

  const activeLaw = LAWS_OF_STEEL[activeLawIndex];
  const LawIcon = activeLaw.Icon;

  return (
    <div className="space-y-24 sm:space-y-36">
      {/* =========================================================================
          HERO MONOLITHE : L'ATELIER ANONYME & LE CODE FONDAMENTAL
         ========================================================================= */}
      <section
        aria-label="Manifeste Fondateur"
        className="relative bg-[#151515] border border-[#565A5C]/40 p-6 sm:p-12 lg:p-16 overflow-hidden"
      >
        {/* Subtle Depth Gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-transparent to-[#090909]/40 pointer-events-none"
        />

        {/* Technical Coordinate Stamps */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#565A5C]/35 pb-6 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#EEB149] animate-pulse" />
            <span className="text-[#EEB149] font-bold tracking-widest uppercase">
              POSTURE ÉDITORIALE
            </span>
          </div>
          <span className="text-[#A5A5A0]">
            RÉF. PROJET · BÂTISSEUR
          </span>
        </div>

        {/* Primary Statement */}
        <div className="relative z-10 py-10 sm:py-16 space-y-8 max-w-5xl">
          <p className="font-mono text-xs sm:text-sm text-[#EEB149] tracking-[0.25em] uppercase">
            CE N’EST PAS UNE PERSONNE À ADMIRER. C’EST UN CODE À APPLIQUER.
          </p>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-[#FFFFFF] leading-[1.02]">
            Les mots ne construisent rien.
            <span className="block text-[#EEB149] mt-2">
              Les actes, oui.
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-[#F3F1EB] font-light leading-relaxed max-w-3xl">
            Kheops Set est une marque éditoriale anonyme. Nous refusons les
            biographies héroïques, les gourous du web et les promesses de
            richesse magique. Nous concevons des manuels d’ingénierie
            pour ceux qui veulent structurer leur argent, blinder leur temps
            et rebâtir leur souveraineté.
          </p>
        </div>

        {/* 3 Technical Anchors */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-[#565A5C]/35">
          <div className="p-5 bg-[#090909] border border-[#565A5C]/30 space-y-2">
            <span className="font-mono text-[10px] text-[#EEB149] tracking-wider block uppercase">
              RÈGLE 01 // L’ANONYMAT
            </span>
            <p className="text-sm font-semibold text-[#FFFFFF]">
              Pas de visage, pas d’ego.
            </p>
            <p className="text-xs text-[#A5A5A0] leading-relaxed">
              Le messager s’efface devant la rigueur de l’outil. Seule compte
              la solidité du plan que tu exécutes chez toi.
            </p>
          </div>

          <div className="p-5 bg-[#090909] border border-[#565A5C]/30 space-y-2">
            <span className="font-mono text-[10px] text-[#EEB149] tracking-wider block uppercase">
              RÈGLE 02 // L’ACIER BIENVEILLANT
            </span>
            <p className="text-sm font-semibold text-[#FFFFFF]">
              La vérité brute sans condescendance.
            </p>
            <p className="text-xs text-[#A5A5A0] leading-relaxed">
              Une franchise absolue parce que le respect commence par ne pas te
              mentir sur ce que coûtent tes choix.
            </p>
          </div>

          <div className="p-5 bg-[#090909] border border-[#565A5C]/30 space-y-2">
            <span className="font-mono text-[10px] text-[#EEB149] tracking-wider block uppercase">
              RÈGLE 03 // LE CHANTIER
            </span>
            <p className="text-sm font-semibold text-[#FFFFFF]">
              Une vie est un édifice mesurable.
            </p>
            <p className="text-xs text-[#A5A5A0] leading-relaxed">
              Fondations, piliers, tuyauteries de cash et verrous d’attention :
              chaque brique compte, chaque fuite se colmate.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONSOLE INTERACTIVE : LE CODE DÉCHIFFRÉ (LES 4 LOIS DE L'ACIER)
         ========================================================================= */}
      <section aria-labelledby="laws-heading" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#565A5C]/35 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-[#EEB149]">
              <span className="w-2 h-2 bg-[#EEB149]" />
              <span>TERMINAL PHILOSOPHIQUE</span>
            </div>
            <h2
              id="laws-heading"
              className="font-display text-3xl sm:text-5xl font-bold text-[#FFFFFF]"
            >
              Les 4 Lois de l’Acier Bienveillant
            </h2>
          </div>
          <p className="font-mono text-xs text-[#A5A5A0]">
            CLIQUE POUR EXPLORER CHAQUE LOI DE STRUCTURE
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {LAWS_OF_STEEL.map((law, idx) => {
            const isSelected = activeLawIndex === idx;
            return (
              <button
                key={law.id}
                type="button"
                onClick={() => setActiveLawIndex(idx)}
                className={`p-4 text-left border transition-all cursor-pointer font-mono ${
                  isSelected
                    ? 'border-[#EEB149] bg-[#151515] text-[#FFFFFF]'
                    : 'border-[#565A5C]/40 bg-[#090909] text-[#A5A5A0] hover:border-[#F3F1EB] hover:text-[#FFFFFF]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={isSelected ? 'text-[#EEB149] font-bold' : ''}>
                    LOI {law.number}
                  </span>
                  <span className="text-[10px] opacity-70">{law.code}</span>
                </div>
                <p className="font-display text-sm sm:text-base font-bold line-clamp-1">
                  {law.title}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Law Display Card with Kinetic Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLaw.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="p-8 sm:p-12 bg-[#151515] border border-[#EEB149]/50 relative overflow-hidden"
          >
            {/* Giant Background Number Watermark */}
            <div
              aria-hidden="true"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[14rem] sm:text-[20rem] font-bold text-[#FFFFFF]/[0.03] select-none pointer-events-none leading-none font-display"
            >
              {activeLaw.number}
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Law Statement & Explanation */}
              <div className="lg:col-span-8 space-y-6">
                <div className="space-y-2">
                  <span className="font-mono text-xs text-[#EEB149] tracking-widest uppercase">
                    LOI FONDAMENTALE {activeLaw.number} · {activeLaw.subtitle}
                  </span>
                  <h3 className="font-display text-2xl sm:text-4xl font-bold text-[#FFFFFF]">
                    « {activeLaw.statement} »
                  </h3>
                </div>

                <div className="p-5 bg-[#090909] border-l-2 border-[#EEB149] space-y-2">
                  <span className="font-mono text-[11px] text-[#EEB149] uppercase tracking-wider block font-semibold">
                    LA VÉRITÉ BRUTE :
                  </span>
                  <p className="text-sm sm:text-base text-[#F3F1EB] leading-relaxed">
                    {activeLaw.brutalTruth}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-[11px] text-[#A5A5A0] uppercase tracking-wider block">
                    APPLICATION OPÉRATIONNELLE :
                  </span>
                  <p className="text-sm text-[#A5A5A0] leading-relaxed">
                    {activeLaw.operationalRule}
                  </p>
                </div>
              </div>

              {/* Right Column: Metric Badge & Icon */}
              <div className="lg:col-span-4 p-6 bg-[#090909] border border-[#565A5C]/40 space-y-5">
                <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3">
                  <span className="font-mono text-xs text-[#A5A5A0]">INDICATEUR</span>
                  <LawIcon className="w-5 h-5 text-[#EEB149]" />
                </div>

                <div className="space-y-1">
                  <p className="font-mono text-[10px] text-[#A5A5A0] uppercase">
                    {activeLaw.metricLabel}
                  </p>
                  <p className="font-mono text-xl sm:text-2xl font-bold text-[#EEB149]">
                    {activeLaw.metricValue}
                  </p>
                </div>

                <div className="pt-2">
                  <div className="w-full h-1 bg-[#565A5C]/30 overflow-hidden">
                    <motion.div
                      className="h-full bg-[#EEB149]"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>

                <p className="text-[11px] font-mono text-[#A5A5A0] leading-relaxed">
                  Inscrit dans la matrice des manuels Kheops Set.
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* =========================================================================
          LE GRAND FACE-À-FACE : CE QUI CONSOMME // CE QUI BÂTIT
         ========================================================================= */}
      <section aria-labelledby="matrix-heading" className="space-y-8">
        <div className="space-y-2 border-b border-[#565A5C]/35 pb-6">
          <div className="flex items-center gap-2 font-mono text-xs text-[#EEB149]">
            <span className="w-2 h-2 bg-[#EEB149]" />
            <span>ARBITRAGE EXISTENTIEL</span>
          </div>
          <h2
            id="matrix-heading"
            className="font-display text-3xl sm:text-5xl font-bold text-[#FFFFFF]"
          >
            Tu choisis ce que tu nourris.
          </h2>
          <p className="text-sm sm:text-base text-[#A5A5A0] max-w-2xl">
            La frontière exacte entre ceux qui subissent leur existence et ceux
            qui posent des fondations inébranlables.
          </p>
        </div>

        <div className="space-y-4">
          {COMPARATIVE_AXES.map((axis, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 group"
            >
              {/* Left Column: What Drains */}
              <div className="p-6 bg-[#151515] border border-[#565A5C]/30 group-hover:border-[#565A5C]/60 transition-colors space-y-2">
                <div className="flex items-center justify-between font-mono text-[11px] text-[#A5A5A0]">
                  <span>VECTEUR D’ÉROSION 0{index + 1}</span>
                  <span className="text-red-400/80">CONSOMME</span>
                </div>
                <h3 className="font-display text-base sm:text-lg font-semibold text-[#F3F1EB]">
                  {axis.illusion}
                </h3>
                <p className="text-xs font-mono text-[#A5A5A0]">
                  Coût mesuré : {axis.cost}
                </p>
              </div>

              {/* Right Column: What Builds */}
              <div className="p-6 bg-[#090909] border border-[#565A5C]/40 group-hover:border-[#EEB149] transition-colors space-y-2 relative">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#EEB149]">AXE DU BÂTISSEUR 0{index + 1}</span>
                  <span className="text-[#EEB149] font-bold">CONSTRUIT</span>
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#FFFFFF]">
                  {axis.forge}
                </h3>
                <p className="text-xs font-mono text-[#EEB149]">
                  Gain structurel : {axis.gain}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          OUTIL INTERACTIF : AUDIT DU CHANTIER
         ========================================================================= */}
      <section
        aria-labelledby="scanner-heading"
        className="p-5 sm:p-10 lg:p-12 bg-[#151515] border border-[#EEB149]/50 space-y-6 sm:space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 border-b border-[#565A5C]/30 pb-4 sm:pb-5">
          <div className="space-y-1 sm:space-y-1.5">
            <span className="font-mono text-[11px] sm:text-xs text-[#EEB149] tracking-wider uppercase font-semibold">
              OUTIL D’AUDIT PERSONNEL
            </span>
            <h2
              id="scanner-heading"
              className="font-display text-xl sm:text-3xl lg:text-4xl font-bold text-[#FFFFFF]"
            >
              Évalue l’état brut de ton chantier
            </h2>
          </div>
          <p className="font-mono text-[11px] sm:text-xs text-[#A5A5A0]">
            Glisse les 3 curseurs selon ta réalité
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          {/* Sliders Area */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 font-mono text-xs">
            {/* Slider 0: Monthly Income Baseline */}
            <div className="p-3.5 sm:p-4 bg-[#090909]/60 border border-[#EEB149]/35 space-y-2.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#F3F1EB] font-semibold">0. Revenu mensuel de référence</span>
                <span className="text-[#EEB149] font-bold">{monthlyIncome.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <input
                type="range"
                min="32000"
                max="1000000"
                step="10000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                aria-label="Revenu mensuel de référence en FCFA"
                className="w-full accent-[#EEB149] bg-[#090909] cursor-pointer h-2"
              />
              <p className="text-[11px] text-[#A5A5A0] leading-snug">
                Base de calcul de tes flux (ajustable selon ton salaire ou tes revenus réels).
              </p>
            </div>

            {/* Slider 1 */}
            <div className="p-3.5 sm:p-4 bg-[#090909]/60 border border-[#565A5C]/25 space-y-2.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#F3F1EB] font-semibold">1. Dépenses d’apparence</span>
                <span className="text-[#EEB149] font-bold">{statusSpendPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={statusSpendPct}
                onChange={(e) => setStatusSpendPct(Number(e.target.value))}
                aria-label="Dépenses d'apparence"
                className="w-full accent-[#EEB149] bg-[#090909] cursor-pointer h-2"
              />
              <p className="text-[11px] text-[#A5A5A0] leading-snug">
                Achats pour valider un statut, sorties pour paraître, crédits de complaisance.
              </p>
            </div>

            {/* Slider 2 */}
            <div className="p-3.5 sm:p-4 bg-[#090909]/60 border border-[#565A5C]/25 space-y-2.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#F3F1EB] font-semibold">2. Fuites de temps hebdo</span>
                <span className="text-[#EEB149] font-bold">{unprotectedHours} h / sem.</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="2"
                value={unprotectedHours}
                onChange={(e) => setUnprotectedHours(Number(e.target.value))}
                aria-label="Fuites de temps hebdomadaires"
                className="w-full accent-[#EEB149] bg-[#090909] cursor-pointer h-2"
              />
              <p className="text-[11px] text-[#A5A5A0] leading-snug">
                Sollicitations acceptées par gêne, défilement passif, urgences des autres.
              </p>
            </div>

            {/* Slider 3 */}
            <div className="p-3.5 sm:p-4 bg-[#090909]/60 border border-[#565A5C]/25 space-y-2.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#F3F1EB] font-semibold">3. Discipline d’exécution</span>
                <span className="text-[#EEB149] font-bold">{executionDiscipline}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={executionDiscipline}
                onChange={(e) => setExecutionDiscipline(Number(e.target.value))}
                aria-label="Discipline d'exécution"
                className="w-full accent-[#EEB149] bg-[#090909] cursor-pointer h-2"
              />
              <p className="text-[11px] text-[#A5A5A0] leading-snug">
                Capacité à appliquer les règles prévues même quand l’envie n’est pas là.
              </p>
            </div>
          </div>

          {/* Diagnostic Result Screen */}
          <div className="lg:col-span-5 p-4 sm:p-6 bg-[#090909] border border-[#EEB149]/60 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#565A5C]/35 pb-2.5 font-mono text-xs">
                <span className="text-[#EEB149] font-bold tracking-wider">DIAGNOSTIC</span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold ${
                    structuralScore >= 70
                      ? 'bg-[#EEB149]/15 text-[#EEB149] border border-[#EEB149]/40'
                      : structuralScore >= 45
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                      : 'bg-red-500/15 text-red-400 border border-red-500/40'
                  }`}
                >
                  {structuralScore >= 70
                    ? 'SOCLE ROBUSTE'
                    : structuralScore >= 45
                    ? 'FUITES CRITIQUES'
                    : 'CHANTIER EN DANGER'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[10px] text-[#A5A5A0] uppercase tracking-wider block">
                  Indice de solidité
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl sm:text-4xl font-bold text-[#FFFFFF] tabular-nums">
                    {structuralScore}
                  </span>
                  <span className="font-mono text-xs text-[#A5A5A0]">/ 100</span>
                </div>
              </div>

              <div className="p-3 bg-[#151515] border border-[#565A5C]/30 space-y-2 font-mono">
                <div>
                  <span className="text-[10px] text-[#A5A5A0] uppercase block">Fuite financière annuelle</span>
                  <p className="text-base sm:text-lg font-bold text-[#EEB149] tabular-nums">
                    ≈ {estimatedAnnualWaste.toLocaleString('fr-FR')} FCFA / an
                  </p>
                </div>
                <div className="pt-2 border-t border-[#565A5C]/25">
                  <span className="text-[10px] text-[#A5A5A0] uppercase block">Temps de vie évaporé</span>
                  <p className="text-xs sm:text-sm font-semibold text-[#FFFFFF] tabular-nums">
                    {annualHoursLost} h / an <span className="text-[#A5A5A0] font-normal">(soit ≈ {annualDaysLost} jours ouvrés)</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#151515] border-l-2 border-[#EEB149] space-y-1 font-mono text-xs">
              <span className="text-[#EEB149] font-bold text-[10px] uppercase block tracking-wider">
                Priorité d’action :
              </span>
              <p className="text-[#F3F1EB] text-xs leading-relaxed">
                {statusSpendPct > 20
                  ? 'Applique le protocole de coupure des dépenses d’apparence du Capital du Bâtisseur.'
                  : unprotectedHours > 10
                  ? 'Installe le sanctuaire de temps et les limites du Code du Bâtisseur.'
                  : 'Maintiens la régularité sans dévier du plan établi.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          L’ÉTABLI DES DEUX MANUELS (PRÉSENTATION À ÉGALITÉ PARFAITE)
         ========================================================================= */}
      <section aria-labelledby="books-heading" className="space-y-10">
        <div className="space-y-2 border-b border-[#565A5C]/35 pb-6">
          <div className="flex items-center gap-2 font-mono text-xs text-[#EEB149]">
            <span className="w-2 h-2 bg-[#EEB149]" />
            <span>L’ÉTABLI D’EXÉCUTION</span>
          </div>
          <h2
            id="books-heading"
            className="font-display text-3xl sm:text-5xl font-bold text-[#FFFFFF]"
          >
            Deux manuels d’ingénierie. Zéro compromis.
          </h2>
          <p className="text-sm sm:text-base text-[#A5A5A0] max-w-2xl">
            Aucun remplissage. Chaque manuel est une machine fermée conçue pour
            résoudre un problème précis et installer une habitude définitive.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {AVAILABLE_PRODUCTS.map((product) => {
            const checkoutUrl = getChariowCheckoutUrl(
              product.chariowUrl,
              product.slug
            );
            const ctaName =
              product.slug === 'le-code-du-batisseur'
                ? 'code_checkout'
                : 'capital_checkout';

            return (
              <article
                key={product.id}
                className="bg-[#151515] border border-[#565A5C]/40 p-8 sm:p-10 flex flex-col justify-between space-y-8 relative hover:border-[#EEB149] transition-colors"
              >
                <div className="space-y-6">
                  {/* Header Box */}
                  <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-4 font-mono text-xs">
                    <span className="text-[#EEB149] font-bold">
                      {product.slug === 'le-capital-du-batisseur' ? 'LE CAPITAL' : 'LE CODE'}
                    </span>
                    <span className="text-[#A5A5A0] flex items-center gap-1.5">
                      <IconPdf className="w-3.5 h-3.5 text-[#EEB149]" />
                      {product.pageCount} PAGES
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#FFFFFF]">
                      {product.title}
                    </h3>
                    <p className="font-mono text-xs text-[#EEB149] font-medium">
                      {product.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-[#A5A5A0] leading-relaxed">
                    {product.shortDescription}
                  </p>

                  {/* 3 Pillars List */}
                  <div className="space-y-2.5 pt-4 border-t border-[#565A5C]/25">
                    <p className="font-mono text-[10px] text-[#A5A5A0] uppercase tracking-wider">
                      CONTENU DE L’OUVRAGE :
                    </p>
                    <ul className="space-y-2 text-xs text-[#F3F1EB]">
                      {product.benefits.slice(0, 3).map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <IconCheck className="w-4 h-4 text-[#EEB149] shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Price Display & Buttons */}
                <div className="pt-6 border-t border-[#565A5C]/35 space-y-5">
                  <PriceDisplay
                    amountInXAF={product.priceXaf}
                    originalPriceXaf={product.originalPriceXaf}
                    salePriceXaf={product.salePriceXaf}
                    salePercentage={product.salePercentage}
                    isOnSale={product.isOnSale}
                    saleEndsAt={product.saleEndsAt}
                    showSelector={true}
                    size="md"
                  />

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <ChariowBuyButton
                      href={checkoutUrl}
                      ctaName={ctaName}
                      ctaLocation="about"
                      className="w-full sm:flex-1 py-4 px-6 text-center text-xs font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors whitespace-nowrap"
                    >
                      {product.ctaLabel}
                    </ChariowBuyButton>

                    <Link
                      href={`/ebooks/${product.slug}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-4 px-5 text-xs font-mono font-semibold border border-[#565A5C] text-[#FFFFFF] hover:border-[#FFFFFF] hover:bg-[#090909] transition-colors whitespace-nowrap"
                    >
                      <span>INSPECTER LE SOMMAIRE</span>
                      <IconArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <p className="text-[11px] text-center text-[#A5A5A0] font-mono">
                    Paiement crypté Chariow (Mobile Money / Cartes) · Accès instantané.
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          LE SERMENT DU BÂTISSEUR : DÉCISION FINALE & ACTIONS CLAIRES
         ========================================================================= */}
      <section
        aria-label="Pacte et conclusion"
        className="p-8 sm:p-14 lg:p-20 bg-[#151515] border-2 border-[#EEB149] text-center space-y-8 relative overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
      >
        <div className="space-y-4 max-w-3xl mx-auto">
          <p className="font-mono text-xs text-[#EEB149] tracking-[0.3em] uppercase">
            L’HEURE DE L’EXÉCUTION
          </p>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-[#FFFFFF] leading-tight">
            Tu as assez théorisé.
            <span className="block text-[#EEB149] mt-2">
              Pose ta première brique.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#F3F1EB] leading-relaxed font-light">
            Les doutes se dissipent dans le mouvement. Choisis ton manuel ou
            télécharge la première fiche d’audit gratuite pour commencer maintenant.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/ebooks"
            className="w-full sm:w-auto inline-flex items-center justify-center text-center px-10 py-5 text-xs sm:text-sm font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors whitespace-nowrap font-mono"
          >
            DÉCOUVRIR LE CATALOGUE COMPLET
          </Link>

          <Link
            href="/ressource-gratuite"
            className="w-full sm:w-auto inline-flex items-center justify-center text-center px-10 py-5 text-xs sm:text-sm font-semibold tracking-wider border border-[#565A5C] text-[#FFFFFF] hover:border-[#FFFFFF] hover:bg-[#090909] transition-colors whitespace-nowrap font-mono"
          >
            TÉLÉCHARGER LE PROTOCOLE GRATUIT
          </Link>
        </div>

        <p className="text-xs text-[#A5A5A0] font-mono pt-4 border-t border-[#565A5C]/30 max-w-xl mx-auto">
          Kheops Set · L’Acier Bienveillant
        </p>
      </section>
    </div>
  );
}
