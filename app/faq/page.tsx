'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PageImmersion } from '@/components/animations/page-immersion';
import { HOME_FAQ_ITEMS } from '@/lib/ebooks-data';
import { Plus, Minus, Search, ArrowRight, HelpCircle, ChevronDown } from 'lucide-react';
import { serializeJsonLd } from '@/lib/structured-data';

interface CategoryFaq {
  id: string;
  label: string;
  indexes: number[];
}

const FAQ_CATEGORIES: CategoryFaq[] = [
  { id: 'all', label: 'Toutes les questions', indexes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: 'payment', label: 'Commande & Chariow', indexes: [0, 1, 5, 6] },
  { id: 'delivery', label: 'Livraison & Format PDF', indexes: [2, 3, 4, 7, 9] },
  { id: 'support', label: 'Support & Droits', indexes: [7, 8, 10] },
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredItems = useMemo(() => {
    const cat = FAQ_CATEGORIES.find((c) => c.id === selectedCategory);
    let items = (cat ? cat.indexes : FAQ_CATEGORIES[0].indexes).map(
      (idx) => ({
        ...HOME_FAQ_ITEMS[idx],
        originalIndex: idx,
      })
    );

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (it) =>
          it.question.toLowerCase().includes(q) ||
          it.answer.toLowerCase().includes(q)
      );
    }

    return items;
  }, [selectedCategory, searchQuery]);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />

      <Navbar />

      <main id="main-content" className="flex-1 pt-28 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1360px] space-y-16">
          <PageImmersion>
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Fil d’Ariane"
              className="font-mono text-xs text-[#A5A5A0] pb-2"
            >
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-[#FFFFFF] transition-colors">
                    Accueil
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-[#EEB149]" aria-current="page">
                  FAQ
                </li>
              </ol>
            </nav>

            {/* Header */}
            <header className="space-y-6 border-b border-[#565A5C]/35 pb-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#EEB149]" aria-hidden="true" />
                <span className="font-mono text-xs text-[#EEB149] tracking-widest uppercase">
                  RÉPONSES DIRECTES
                </span>
              </div>

              <div className="max-w-3xl space-y-4">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFFFF]">
                  Foire Aux Questions.
                </h1>
                <p className="text-base sm:text-lg text-[#A5A5A0] leading-relaxed">
                  Toutes les réponses techniques sur le paiement sécurisé Chariow,
                  la réception instantanée des manuels PDF, et les règles d’utilisation.
                </p>
              </div>

              {/* Interactive Category Filter Dropdown Bar */}
              <div className="pt-4 relative max-w-sm">
                <label id="faq-category-label" className="block text-[11px] font-mono text-[#A5A5A0] uppercase tracking-wider mb-2">
                  Filtrer par thématique :
                </label>
                <div className="relative">
                  <button
                    type="button"
                    id="faq-category-button"
                    aria-haspopup="listbox"
                    aria-expanded={isDropdownOpen}
                    aria-labelledby="faq-category-label faq-category-button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-4 py-3 bg-[#151515] border border-[#565A5C]/40 text-[#FFFFFF] font-mono text-xs flex items-center justify-between gap-3 hover:border-[#EEB149] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#EEB149]" />
                      <span>{FAQ_CATEGORIES.find(c => c.id === selectedCategory)?.label || 'Toutes les questions'}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#EEB149] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div
                      role="listbox"
                      aria-labelledby="faq-category-label"
                      className="absolute top-full left-0 right-0 mt-1 bg-[#151515] border border-[#EEB149]/60 z-30 shadow-[0_15px_30px_rgba(0,0,0,0.8)] font-mono text-xs divide-y divide-[#565A5C]/20"
                    >
                      {FAQ_CATEGORIES.map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            role="option"
                            aria-selected={isSelected}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setOpenIndex(null);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#EEB149] text-[#090909] font-bold'
                                : 'text-[#F3F1EB] hover:bg-[#090909] hover:text-[#EEB149]'
                            }`}
                          >
                            <span>{cat.label}</span>
                            {isSelected && <span className="text-[10px] tracking-wider uppercase">actif</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Two-Column Grid: FAQ Accordions + Quick Info Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Accordions */}
              <div className="lg:col-span-8 space-y-4">
                <div className="divide-y divide-[#565A5C]/35 border-y border-[#565A5C]/40">
                  {filteredItems.map((item) => {
                    const isOpen = openIndex === item.originalIndex;
                    const buttonId = `faq-btn-${item.originalIndex}`;
                    const panelId = `faq-panel-${item.originalIndex}`;

                    return (
                      <div
                        key={item.question}
                        className={`transition-colors ${
                          isOpen
                            ? 'bg-[#151515]'
                            : 'bg-[#090909] hover:bg-[#151515]/50'
                        }`}
                      >
                        <h2>
                          <button
                            id={buttonId}
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            onClick={() =>
                              setOpenIndex(isOpen ? null : item.originalIndex)
                            }
                            className="w-full text-left py-5 sm:py-6 px-4 sm:px-6 flex items-center justify-between gap-4 cursor-pointer"
                          >
                            <div className="flex items-baseline gap-4">
                              <span className="font-mono text-xs text-[#EEB149] font-bold tabular-nums shrink-0">
                                {String(item.originalIndex + 1).padStart(2, '0')}
                              </span>
                              <span className="font-display text-base sm:text-lg font-semibold text-[#FFFFFF] leading-snug">
                                {item.question}
                              </span>
                            </div>
                            <div className="w-8 h-8 border border-[#565A5C]/40 flex items-center justify-center shrink-0 text-[#EEB149]">
                              {isOpen ? (
                                <Minus className="w-4 h-4" />
                              ) : (
                                <Plus className="w-4 h-4" />
                              )}
                            </div>
                          </button>
                        </h2>

                        {isOpen && (
                          <div
                            id={panelId}
                            role="region"
                            aria-labelledby={buttonId}
                            className="px-4 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-[#A5A5A0] leading-relaxed pl-12 sm:pl-14 border-t border-[#565A5C]/20"
                          >
                            <p>{item.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Quick Links & Support Card */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
                <div className="p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40 space-y-4">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#EEB149]" />
                    <span className="font-mono text-xs text-[#EEB149] uppercase tracking-wider font-semibold">
                      ASSISTANCE DIRECTE
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#FFFFFF]">
                    Une question non répertoriée ?
                  </h3>

                  <p className="text-xs text-[#A5A5A0] leading-relaxed">
                    Si ta demande concerne un paiement spécifique ou un incident de
                    téléchargement Chariow, notre canal de contact te répond sous 24h.
                  </p>

                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 text-xs font-mono font-semibold border border-[#565A5C] text-[#FFFFFF] hover:border-[#EEB149] hover:text-[#EEB149] transition-colors"
                  >
                    <span>OUVRIR LE FORMULAIRE DE CONTACT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-6 bg-[#090909] border border-[#565A5C]/30 space-y-3 font-mono text-xs text-[#A5A5A0]">
                  <p className="text-[#EEB149] uppercase tracking-wider font-semibold text-[11px]">
                    GARANTIES DU SERVICE
                  </p>
                  <p className="leading-relaxed">
                    • Livraison email garantie en 2 min.<br />
                    • Format PDF haute résolution.<br />
                    • Compatibilité tous smartphones.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Single Main Intent CTA Section */}
            <section
              aria-label="Passage à l’action"
              className="mt-32 sm:mt-48 p-10 sm:p-16 lg:p-20 bg-[#151515] border border-[#EEB149]/50 text-center space-y-8"
            >
              <div className="space-y-3 max-w-2xl mx-auto">
                <p className="font-mono text-xs text-[#EEB149] uppercase tracking-wider">
                  PRÊT À CONSTRUIRE ?
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FFFFFF]">
                  Tous les doutes sont levés.
                </h2>
                <p className="text-sm text-[#A5A5A0]">
                  Accède aux manuels d’ingénierie et commence ton plan d’action dès aujourd’hui.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/ebooks"
                  className="w-full sm:w-auto px-8 py-4 text-xs sm:text-sm font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors"
                >
                  DÉCOUVRIR LES EBOOKS
                </Link>

                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-8 py-4 text-xs sm:text-sm font-semibold tracking-wider border border-[#565A5C] text-[#FFFFFF] hover:border-[#FFFFFF] hover:bg-[#090909] transition-colors"
                >
                  POSER UNE QUESTION AVANT D’ACHETER
                </Link>
              </div>
            </section>
          </PageImmersion>
        </div>
      </main>

      <Footer />
    </div>
  );
}
