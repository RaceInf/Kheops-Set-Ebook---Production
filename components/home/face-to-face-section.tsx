'use client';

import React from 'react';
import { IconCheck } from '@/components/icons/kheops-icons';

interface ComparisonRow {
  id: string;
  consumes: string;
  consumesNote: string;
  constructs: string;
  constructsNote: string;
}

const COMPARISONS: ComparisonRow[] = [
  {
    id: '01',
    consumes: 'PARAÎTRE',
    consumesNote: 'Acheter le regard des autres aujourd’hui.',
    constructs: 'CONSTRUIRE',
    constructsNote: 'Poser des fondations invisibles qui durent.',
  },
  {
    id: '02',
    consumes: 'DÉPENSER',
    consumesNote: 'Échanger son salaire contre des objets qui perdent leur valeur.',
    constructs: 'CAPITALISER',
    constructsNote: 'Transformer une part de chaque revenu en réserve et en actif.',
  },
  {
    id: '03',
    consumes: 'PLAIRE',
    consumesNote: 'Dire oui par peur du jugement et s’épuiser en silence.',
    constructs: 'SE PROTÉGER',
    constructsNote: 'Tracer des limites claires pour rester capable d’aider vraiment.',
  },
  {
    id: '04',
    consumes: 'PARLER',
    consumesNote: 'Annoncer ses projets trop tôt et chercher des encouragements.',
    constructs: 'EXÉCUTER',
    constructsNote: 'Avancer dans le calme et laisser les résultats parler.',
  },
  {
    id: '05',
    consumes: 'ÊTRE DISPONIBLE POUR TOUT LE MONDE',
    consumesNote: 'Laisser son emploi du temps ouvert à toutes les urgences.',
    constructs: 'PROTÉGER SON TEMPS',
    constructsNote: 'Réserver des heures intouchables à sa propre progression.',
  },
];

export function FaceToFaceSection() {
  return (
    <section
      id="face-a-face"
      aria-labelledby="face-to-face-heading"
      className="w-full bg-[#090909] text-[#FFFFFF] py-32 sm:py-40 px-4 sm:px-6 lg:px-8 border-b border-[#565A5C]/30"
    >
      <div className="mx-auto max-w-[1360px] space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[#A5A5A0]">
            <span>SECTION H · FACE-À-FACE</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#EEB149]">ARBITRAGE QUOTIDIEN</span>
          </div>

          <h2
            id="face-to-face-heading"
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFFFFF]"
          >
            Tu choisis ce que tu nourris.
          </h2>
        </div>

        {/* Comparison Table / Grid */}
        <div className="border border-[#565A5C]/45 bg-[#151515]">
          {/* Column Headers */}
          <div className="hidden md:grid md:grid-cols-12 border-b border-[#565A5C]/45 font-mono text-xs">
            <div className="col-span-5 p-5 text-[#A5A5A0] bg-[#151515]">
              AXE A · CE QUI CONSOMME
            </div>
            <div className="col-span-7 p-5 text-[#EEB149] bg-[#090909] border-l border-[#565A5C]/45 font-semibold">
              AXE B · CE QUI CONSTRUIT
            </div>
          </div>

          {/* 5 Comparison Rows */}
          <div className="divide-y divide-[#565A5C]/35">
            {COMPARISONS.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-1 md:grid-cols-12 items-stretch"
              >
                {/* Left: Ce qui consomme */}
                <div className="md:col-span-5 p-6 sm:p-8 bg-[#151515] flex flex-col justify-center space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#565A5C]">
                      CE QUI CONSOMME · {row.id}
                    </span>
                  </div>
                  <p className="font-display text-lg sm:text-xl font-semibold text-[#A5A5A0]">
                    {row.consumes}
                  </p>
                  <p className="text-sm text-[#A5A5A0]/80 leading-relaxed">
                    {row.consumesNote}
                  </p>
                </div>

                {/* Right: Ce qui construit (More structured, stable, clear) */}
                <div className="md:col-span-7 p-6 sm:p-8 bg-[#090909] bg-blueprint-grid-dark border-t md:border-t-0 md:border-l border-[#EEB149]/50 flex flex-col justify-center space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#EEB149]">
                      CE QUI CONSTRUIT · {row.id}
                    </span>
                    <IconCheck className="w-4 h-4 text-[#EEB149]" />
                  </div>
                  <p className="font-display text-xl sm:text-2xl font-bold text-[#FFFFFF] tracking-tight">
                    {row.constructs}
                  </p>
                  <p className="text-sm sm:text-base text-[#F3F1EB] leading-relaxed">
                    {row.constructsNote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
