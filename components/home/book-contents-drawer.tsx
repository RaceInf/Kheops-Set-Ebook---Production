'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Minus } from 'lucide-react';
import { IconBlueprint, IconArrowUpRight } from '@/components/icons/kheops-icons';

interface ContentDrawerItem {
  id: string;
  title: string;
  chapterRef: string;
  details: string;
  actionTool: string;
}

const BOOK_DRAWERS: ContentDrawerItem[] = [
  {
    id: '01',
    title: 'Comment regarder tes dépenses sans te mentir.',
    chapterRef: 'PARTIE 1 · CHAPITRE 1 & 4',
    details:
      'Faire la différence nette entre un actif (qui met de l’argent dans ta poche) et un passif (qui en prend chaque mois). Passer chaque dépense au filtre de l’utilité réelle.',
    actionTool: 'Outil inclus : Le Test de l’Inventaire Actif / Passif sur une page.',
  },
  {
    id: '02',
    title: 'Comment poser des limites sans couper tout le monde.',
    chapterRef: 'PARTIE 1 · CHAPITRE 2 (LA TAXE DU SANG)',
    details:
      'Protéger ta capacité d’épargne face aux sollicitations permanentes en distinguant une urgence vitale d’une habitude de dépendance.',
    actionTool: 'Outil inclus : La Règle du Budget Fixe Solidarité & le Non calme.',
  },
  {
    id: '03',
    title: 'Comment arrêter de payer pour paraître.',
    chapterRef: 'PARTIE 1 · CHAPITRE 1 & 3',
    details:
      'Comprendre le coût réel du prestige à crédit (téléphones, vêtements, sorties, véhicules disproportionnés) et sortir du besoin de validation sociale.',
    actionTool: 'Outil inclus : La Règle du Délai de Carence à 72 Heures.',
  },
  {
    id: '04',
    title: 'Comment construire une base financière simple.',
    chapterRef: 'PARTIE 2 · CHAPITRE 5 (LOI DE PARKINSON)',
    details:
      'Inverser l’ordre dans lequel tu utilises ton argent dès le jour de paie pour accumuler un capital de sécurité, même en commençant avec un petit revenu.',
    actionTool: 'Outil inclus : L’Ordre de Virement Irrévocable (10 % à 20 % en premier).',
  },
  {
    id: '05',
    title: 'Comment protéger ton temps.',
    chapterRef: 'PARTIE 2 & 3 · CHAPITRE 6 & 8',
    details:
      'Récupérer tes heures perdues après le travail pour développer une compétence rare ou un projet parallèle qui ne dépend pas uniquement de ta présence horaire.',
    actionTool: 'Outil inclus : Le Protocole des Heures d’Or (2h de construction par soir).',
  },
  {
    id: '06',
    title: 'Comment faire des choix plus utiles chaque semaine.',
    chapterRef: 'CONCLUSION · PLAN D’EXÉCUTION EN 48H',
    details:
      'Un plan d’action immédiat sur 48 heures (Le Garrot, La Fondation, La Première Brique) pour transformer la lecture en décisions concrètes.',
    actionTool: 'Outil inclus : La Feuille de Route des 48 Premières Heures.',
  },
];

export function BookContentsDrawer() {
  const [openIds, setOpenIds] = useState<string[]>(['01', '02']);

  const toggleDrawer = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    if (openIds.length === BOOK_DRAWERS.length) {
      setOpenIds([]);
    } else {
      setOpenIds(BOOK_DRAWERS.map((d) => d.id));
    }
  };

  return (
    <section
      id="contenu-du-livre"
      aria-labelledby="contents-drawer-heading"
      className="w-full bg-[#F3F1EB] text-[#090909] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-[#565A5C]/30"
    >
      <div className="mx-auto max-w-[1360px] space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#565A5C]/35 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#565A5C]">
              <span>SECTION G · DOSSIERS TECHNIQUES</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#090909] font-semibold">6 MODULES OPÉRATIONNELS</span>
            </div>

            <h2
              id="contents-drawer-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#090909]"
            >
              Ce que tu vas trouver dans le livre.
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={expandAll}
              className="px-4 py-2 text-xs font-mono font-semibold border border-[#090909] text-[#090909] hover:bg-[#090909] hover:text-[#FFFFFF] transition-colors whitespace-nowrap"
            >
              {openIds.length === BOOK_DRAWERS.length
                ? 'FERMER LES DOSSIERS'
                : 'OUVRIR TOUS LES DOSSIERS'}
            </button>

            <Link
              href="/ebooks/le-capital-du-batisseur"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-semibold bg-[#090909] text-[#EEB149] hover:bg-[#151515] transition-colors whitespace-nowrap"
            >
              <span>FICHE COMPLÈTE</span>
              <IconArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Interactive Technical Drawers */}
        <div className="divide-y divide-[#565A5C]/35 border-y border-[#090909]">
          {BOOK_DRAWERS.map((drawer) => {
            const isOpen = openIds.includes(drawer.id);
            const panelId = `drawer-panel-${drawer.id}`;
            const buttonId = `drawer-button-${drawer.id}`;

            return (
              <div
                key={drawer.id}
                className={`transition-colors duration-150 ${
                  isOpen ? 'bg-[#FFFFFF]' : 'bg-[#F3F1EB] hover:bg-[#FFFFFF]/60'
                }`}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleDrawer(drawer.id)}
                    className="w-full text-left py-6 sm:py-7 px-4 sm:px-8 flex items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#090909] text-[#EEB149] w-fit tabular-nums">
                        DOSSIER {drawer.id}
                      </span>
                      <span className="font-display text-lg sm:text-2xl font-bold text-[#090909]">
                        {drawer.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="hidden md:inline font-mono text-xs text-[#565A5C]">
                        {drawer.chapterRef}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`w-9 h-9 flex items-center justify-center border transition-colors ${
                          isOpen
                            ? 'border-[#090909] bg-[#090909] text-[#EEB149]'
                            : 'border-[#565A5C]/50 text-[#090909]'
                        }`}
                      >
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </span>
                    </div>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className={isOpen ? 'px-4 sm:px-8 pb-7 pt-1' : 'hidden'}
                >
                  <div className="sm:pl-[108px] grid grid-cols-1 lg:grid-cols-12 gap-6 items-start border-t border-[#565A5C]/20 pt-5">
                    <div className="lg:col-span-7 space-y-2">
                      <p className="font-mono text-xs text-[#565A5C] md:hidden">
                        {drawer.chapterRef}
                      </p>
                      <p className="text-base text-[#151515] leading-relaxed">
                        {drawer.details}
                      </p>
                    </div>

                    <div className="lg:col-span-5 p-4 bg-[#F3F1EB] border-l-2 border-[#EEB149] flex items-start gap-3">
                      <IconBlueprint className="w-4 h-4 text-[#090909] shrink-0 mt-0.5" />
                      <p className="font-mono text-xs text-[#090909] leading-relaxed">
                        {drawer.actionTool}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
