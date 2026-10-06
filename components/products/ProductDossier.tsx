'use client';

import React, { useState } from 'react';
import type { Product } from '@/lib/products';
import {
  IconBlueprint,
  IconCheck,
  IconRuler,
  IconProtect,
} from '@/components/icons/kheops-icons';

interface ProductDossierProps {
  product: Product;
}

type TabType = 'sommaire' | 'benefices' | 'profil' | 'faq';

export function ProductDossier({ product }: ProductDossierProps) {
  const [activeTab, setActiveTab] = useState<TabType>('sommaire');

  const tabs: { id: TabType; label: string; count?: number | string }[] = [
    { id: 'sommaire', label: 'Sommaire & Architecture', count: product.tableOfContents?.length },
    { id: 'benefices', label: 'Ce que tu vas apprendre', count: product.benefits?.length },
    { id: 'profil', label: 'Pour qui est ce plan ?' },
    { id: 'faq', label: 'FAQ spécifique', count: product.faq?.length },
  ];

  return (
    <div className="border border-[#565A5C]/35 bg-[#151515] p-6 sm:p-10 space-y-8">
      {/* Dossier Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#565A5C]/30 pb-6">
        <div>
          <p className="font-mono text-xs text-[#EEB149] tracking-wider">
            DOSSIER TECHNIQUE // {product.tag}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FFFFFF] mt-1">
            Structure & Spécifications du Plan
          </h2>
        </div>
        <span className="font-mono text-xs text-[#A5A5A0] px-3 py-1 bg-[#090909] border border-[#565A5C]/30 self-start sm:self-auto">
          {product.format} · {product.pageCount} PAGES · {product.language}
        </span>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-[#565A5C]/25 pb-4" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`dossier-panel-${tab.id}`}
              id={`dossier-tab-${tab.id}`}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-mono tracking-wider transition-colors border ${
                isActive
                  ? 'bg-[#EEB149] text-[#090909] font-bold border-[#EEB149]'
                  : 'bg-[#090909] text-[#A5A5A0] border-[#565A5C]/35 hover:text-[#FFFFFF] hover:border-[#565A5C]'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-2 text-xs opacity-80`}>({tab.count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {/* 1. Sommaire */}
        {activeTab === 'sommaire' && (
          <div
            id="dossier-panel-sommaire"
            role="tabpanel"
            aria-labelledby="dossier-tab-sommaire"
            className="space-y-4"
          >
            <p className="text-xs font-mono text-[#A5A5A0]">
              PLAN TECHNIQUE · DÉCOUPAGE CHAPITRE PAR CHAPITRE
            </p>
            <div className="divide-y divide-[#565A5C]/20 border border-[#565A5C]/30 bg-[#090909]">
              {product.tableOfContents && product.tableOfContents.length > 0 ? (
                product.tableOfContents.map((chapter, idx) => (
                  <div key={idx} className="p-4 sm:p-5 flex items-start gap-4 hover:bg-[#151515]/60 transition-colors">
                    <span className="font-mono text-xs font-bold text-[#EEB149] bg-[#151515] px-2.5 py-1 border border-[#565A5C]/30 shrink-0">
                      {chapter.chapterNumber || `CH. ${idx + 1}`}
                    </span>
                    <div className="space-y-1 flex-1">
                      <h3 className="font-display text-base sm:text-lg font-bold text-[#FFFFFF]">
                        {chapter.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#A5A5A0] leading-relaxed">
                        {chapter.summary}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-sm text-[#A5A5A0]">
                  Sommaire détaillé inclus dans le document PDF.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Ce que tu vas apprendre */}
        {activeTab === 'benefices' && (
          <div
            id="dossier-panel-benefices"
            role="tabpanel"
            aria-labelledby="dossier-tab-benefices"
            className="space-y-4"
          >
            <p className="text-xs font-mono text-[#A5A5A0]">
              OUTILS D’EXÉCUTION ET PRINCIPES DIRECTS
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.benefits && product.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-[#090909] border border-[#565A5C]/30 flex items-start gap-3 hover:border-[#EEB149]/40 transition-colors"
                >
                  <div className="p-1 bg-[#EEB149]/10 text-[#EEB149] border border-[#EEB149]/30 shrink-0 mt-0.5">
                    <IconCheck className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-[#F3F1EB] leading-relaxed">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Pour qui / Pas pour qui */}
        {activeTab === 'profil' && (
          <div
            id="dossier-panel-profil"
            role="tabpanel"
            aria-labelledby="dossier-tab-profil"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Pour qui */}
            <div className="p-6 bg-[#090909] border border-[#565A5C]/35 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#EEB149]">
                <IconCheck className="w-4 h-4" />
                <span>CE GUIDE EST FAIT POUR TOI SI :</span>
              </div>
              <ul className="space-y-3">
                {product.whoIsItFor && product.whoIsItFor.map((item, idx) => (
                  <li key={idx} className="text-sm text-[#F3F1EB] flex items-start gap-2.5">
                    <span className="text-[#EEB149] font-mono shrink-0">+</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pas pour qui */}
            <div className="p-6 bg-[#090909] border border-[#565A5C]/35 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#A5A5A0]">
                <IconProtect className="w-4 h-4" />
                <span>CE GUIDE N’EST PAS FAIT POUR TOI SI :</span>
              </div>
              <ul className="space-y-3">
                {product.whoIsItNotFor && product.whoIsItNotFor.map((item, idx) => (
                  <li key={idx} className="text-sm text-[#A5A5A0] flex items-start gap-2.5">
                    <span className="text-[#565A5C] font-mono shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 4. FAQ Spécifique */}
        {activeTab === 'faq' && (
          <div
            id="dossier-panel-faq"
            role="tabpanel"
            aria-labelledby="dossier-tab-faq"
            className="space-y-4"
          >
            <p className="text-xs font-mono text-[#A5A5A0]">
              QUESTIONS SPÉCIFIQUES SUR CET OUVRAGE
            </p>
            <div className="divide-y divide-[#565A5C]/25 border border-[#565A5C]/30 bg-[#090909]">
              {product.faq && product.faq.length > 0 ? (
                product.faq.map((item, idx) => (
                  <div key={idx} className="p-5 space-y-2 hover:bg-[#151515]/50 transition-colors">
                    <h3 className="font-display text-sm sm:text-base font-bold text-[#FFFFFF]">
                      {item.question}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A5A5A0] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-sm text-[#A5A5A0]">
                  Consulte la page FAQ générale pour toute question sur la commande Chariow et la lecture.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
