'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { HOME_FAQ_ITEMS, type EbookFAQItem } from '@/lib/ebooks-data';

export function FAQSection({ items = HOME_FAQ_ITEMS }: { items?: EbookFAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-section-heading"
      className="w-full bg-[#090909] text-[#FFFFFF] py-32 sm:py-40 px-4 sm:px-6 lg:px-8 border-b border-[#565A5C]/30"
    >
      <div className="mx-auto max-w-[1360px] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Header */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#A5A5A0]">
            <span>SECTION K · RÉPONSES CLAIRES</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#EEB149]">11 QUESTIONS</span>
          </div>

          <h2
            id="faq-section-heading"
            className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#FFFFFF]"
          >
            Questions fréquentes.
          </h2>

          <p className="text-sm sm:text-base text-[#A5A5A0] leading-relaxed">
            Des réponses simples, courtes et honnêtes avant de prendre ta décision.
          </p>
        </div>

        {/* Right Accordions */}
        <div className="lg:col-span-8 divide-y divide-[#565A5C]/35 border-y border-[#565A5C]/45">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            const buttonId = `faq-btn-${idx}`;
            const panelId = `faq-panel-${idx}`;

            return (
              <div
                key={item.question}
                className={`transition-colors ${
                  isOpen ? 'bg-[#151515]' : 'bg-[#090909] hover:bg-[#151515]/50'
                }`}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full text-left py-5 sm:py-6 px-4 sm:px-6 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-[#EEB149] tabular-nums shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-base sm:text-lg font-semibold text-[#FFFFFF]">
                        {item.question}
                      </span>
                    </div>

                    <span
                      aria-hidden="true"
                      className={`w-8 h-8 flex items-center justify-center border shrink-0 transition-colors ${
                        isOpen
                          ? 'border-[#EEB149] text-[#EEB149]'
                          : 'border-[#565A5C]/40 text-[#A5A5A0]'
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className={isOpen ? 'px-4 sm:px-6 pb-6 pt-1' : 'hidden'}
                >
                  <p className="pl-8 text-sm sm:text-base text-[#F3F1EB] leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
