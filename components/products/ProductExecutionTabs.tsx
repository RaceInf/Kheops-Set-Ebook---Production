'use client';

import React, { useState } from 'react';
import type { Product } from '@/lib/products';
import {
  IconCheck,
  IconBlueprint,
  IconRuler,
  IconPdf,
} from '@/components/icons/kheops-icons';

interface ProductExecutionTabsProps {
  product: Product;
}

type TabKey = 'plan' | 'sommaire' | 'conformite' | 'faq';

export function ProductExecutionTabs({ product }: ProductExecutionTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('plan');

  const tabs: { key: TabKey; code: string; label: string }[] = [
    { key: 'plan', code: '01', label: 'LE PLAN & IMPACT' },
    { key: 'sommaire', code: '02', label: `SOMMAIRE (${product.tableOfContents.length} CHAPITRES)` },
    { key: 'conformite', code: '03', label: 'AUDIT DE CONFORMITÉ' },
    { key: 'faq', code: '04', label: 'SPÉCIFICATIONS & FAQ' },
  ];

  return (
    <div className="border border-[#565A5C]/40 bg-[#151515] overflow-hidden">
      {/* Industrial Tab Navigation Bar */}
      <div
        role="tablist"
        aria-label="Sections du dossier produit"
        className="grid grid-cols-2 md:grid-cols-4 border-b border-[#565A5C]/40 bg-[#090909]"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.key}`}
              id={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`p-4 text-left transition-colors relative cursor-pointer border-r border-[#565A5C]/30 last:border-r-0 ${
                isActive
                  ? 'bg-[#151515] text-[#FFFFFF]'
                  : 'text-[#A5A5A0] hover:bg-[#151515]/60 hover:text-[#FFFFFF]'
              }`}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 right-0 h-[2px] bg-[#EEB149]"
                />
              )}
              <div className="font-mono text-[10px] text-[#EEB149] tracking-widest mb-1">
                SECTION // {tab.code}
              </div>
              <div className="font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase truncate">
                {tab.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="p-6 sm:p-10">
        {/* PANEL 1: LE PLAN & IMPACT */}
        {activeTab === 'plan' && (
          <div
            role="tabpanel"
            id="panel-plan"
            aria-labelledby="tab-plan"
            className="space-y-8 animate-fadeIn"
          >
            <div className="space-y-3">
              <span className="font-mono text-xs text-[#EEB149] tracking-wider">
                OBJECTIF OPÉRATIONNEL
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FFFFFF]">
                Ce que ce guide construit dans ton quotidien
              </h2>
              <p className="text-base text-[#A5A5A0] leading-relaxed max-w-3xl">
                {product.longDescription || product.shortDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#565A5C]/30">
              {product.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="p-5 bg-[#090909] border border-[#565A5C]/40 flex items-start gap-4"
                >
                  <span className="w-7 h-7 bg-[#151515] border border-[#EEB149]/60 text-[#EEB149] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base font-medium text-[#FFFFFF] leading-snug">
                      {benefit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL 2: LE SOMMAIRE */}
        {activeTab === 'sommaire' && (
          <div
            role="tabpanel"
            id="panel-sommaire"
            aria-labelledby="tab-sommaire"
            className="space-y-6 animate-fadeIn"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#565A5C]/30 pb-4">
              <div className="space-y-1">
                <span className="font-mono text-xs text-[#EEB149] tracking-wider">
                  STRUCTURE DE L’OUVRAGE
                </span>
                <h2 className="font-display text-2xl font-bold text-[#FFFFFF]">
                  Table des matières détaillée
                </h2>
              </div>
              <div className="font-mono text-xs text-[#A5A5A0] px-3 py-1.5 bg-[#090909] border border-[#565A5C]/40">
                TOTAL : {product.pageCount} PAGES · {product.tableOfContents.length} CHAPITRES
              </div>
            </div>

            <div className="divide-y divide-[#565A5C]/25 border border-[#565A5C]/40 bg-[#090909]">
              {product.tableOfContents.map((chap, idx) => (
                <div key={idx} className="p-5 sm:p-6 hover:bg-[#151515]/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs text-[#EEB149] font-bold">
                          {chap.chapterNumber}
                        </span>
                        {chap.partTitle && (
                          <span className="font-mono text-[10px] text-[#A5A5A0] px-2 py-0.5 bg-[#151515] border border-[#565A5C]/40">
                            {chap.partTitle}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-[#FFFFFF]">
                        {chap.title}
                      </h3>
                      <p className="text-sm text-[#A5A5A0] leading-relaxed max-w-2xl">
                        {chap.summary}
                      </p>
                    </div>

                    {chap.page && (
                      <span className="font-mono text-xs text-[#A5A5A0] shrink-0">
                        Page {chap.page}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL 3: AUDIT DE CONFORMITÉ */}
        {activeTab === 'conformite' && (
          <div
            role="tabpanel"
            id="panel-conformite"
            aria-labelledby="tab-conformite"
            className="space-y-8 animate-fadeIn"
          >
            <div className="space-y-2">
              <span className="font-mono text-xs text-[#EEB149] tracking-wider">
                CONTRÔLE DE PERTINENCE
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FFFFFF]">
                Vérifie si cet outil correspond à ta situation
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* FAIT POUR TOI */}
              <div className="p-6 sm:p-8 bg-[#090909] border border-[#EEB149]/40 space-y-5">
                <div className="flex items-center gap-3 border-b border-[#EEB149]/30 pb-3">
                  <span className="w-3 h-3 bg-[#EEB149]" />
                  <h3 className="font-mono text-xs sm:text-sm font-bold text-[#EEB149] tracking-wider">
                    CE GUIDE EST FAIT POUR TOI SI :
                  </h3>
                </div>
                <ul className="space-y-3 text-sm text-[#FFFFFF]">
                  {product.whoIsItFor.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <IconCheck className="w-4 h-4 text-[#EEB149] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PAS FAIT POUR TOI */}
              <div className="p-6 sm:p-8 bg-[#090909] border border-[#565A5C]/50 space-y-5">
                <div className="flex items-center gap-3 border-b border-[#565A5C]/40 pb-3">
                  <span className="w-3 h-3 bg-[#565A5C]" />
                  <h3 className="font-mono text-xs sm:text-sm font-bold text-[#A5A5A0] tracking-wider">
                    CE GUIDE N’EST PAS FAIT POUR TOI SI :
                  </h3>
                </div>
                <ul className="space-y-3 text-sm text-[#A5A5A0]">
                  {product.whoIsItNotFor.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-[#565A5C] font-mono font-bold">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 4: SPÉCIFICATIONS & FAQ */}
        {activeTab === 'faq' && (
          <div
            role="tabpanel"
            id="panel-faq"
            aria-labelledby="tab-faq"
            className="space-y-8 animate-fadeIn"
          >
            {/* Technical Specs Cartridge */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-[#090909] border border-[#565A5C]/40 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[#A5A5A0] text-[10px]">FORMAT</span>
                <p className="text-[#FFFFFF] font-bold flex items-center gap-1.5">
                  <IconPdf className="w-3.5 h-3.5 text-[#EEB149]" />
                  {product.format} Haute Définition
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[#A5A5A0] text-[10px]">VOLUME</span>
                <p className="text-[#FFFFFF] font-bold flex items-center gap-1.5">
                  <IconRuler className="w-3.5 h-3.5 text-[#EEB149]" />
                  {product.pageCount} Pages d’exécution
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[#A5A5A0] text-[10px]">LANGUE</span>
                <p className="text-[#FFFFFF] font-bold flex items-center gap-1.5">
                  <IconBlueprint className="w-3.5 h-3.5 text-[#EEB149]" />
                  {product.language}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[#A5A5A0] text-[10px]">LIVRAISON</span>
                <p className="text-[#EEB149] font-bold">Immédiate via Chariow</p>
              </div>
            </div>

            {/* Product Specific FAQ */}
            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold text-[#FFFFFF]">
                Questions fréquentes sur ce manuel
              </h3>
              <div className="space-y-3">
                {product.faq.map((item, idx) => (
                  <details
                    key={idx}
                    className="group border border-[#565A5C]/40 bg-[#090909] p-4 sm:p-5 transition-colors open:border-[#EEB149]/60"
                  >
                    <summary className="cursor-pointer font-sans font-semibold text-sm sm:text-base text-[#FFFFFF] flex items-center justify-between gap-4">
                      <span>{item.question}</span>
                      <span className="font-mono text-xs text-[#EEB149] group-open:rotate-45 transition-transform">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-sm text-[#A5A5A0] leading-relaxed pt-3 border-t border-[#565A5C]/25">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
