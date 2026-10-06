'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { HOME_FAQ_ITEMS } from '@/lib/ebooks-data';

type FaqCategory = 'all' | 'payment' | 'reading' | 'brand';

interface CategorizedItem {
  question: string;
  answer: string;
  category: FaqCategory;
}

const EXTENDED_FAQ_ITEMS: CategorizedItem[] = [
  {
    question: 'Comment acheter le livre ?',
    answer:
      'Clique sur le bouton « PRENDRE LE PLAN ». Tu es redirigé vers notre page officielle sur Chariow où tu peux finaliser ta commande en quelques secondes.',
    category: 'payment',
  },
  {
    question: 'Pourquoi suis-je redirigé vers Chariow ?',
    answer:
      'Chariow est la plateforme sécurisée qui gère l’encaissement et la livraison automatique de ton fichier PDF. Le site Kheops Set ne stocke aucune coordonnée bancaire.',
    category: 'payment',
  },
  {
    question: 'Comment vais-je recevoir le PDF ?',
    answer:
      'Une fois ton paiement validé sur Chariow, le lien de téléchargement s’affiche directement et t’est également envoyé par email.',
    category: 'reading',
  },
  {
    question: 'Puis-je lire le livre sur téléphone ?',
    answer:
      'Oui. La mise en page est aérée et conçue pour se lire facilement sur n’importe quel smartphone, sans avoir besoin de zoomer.',
    category: 'reading',
  },
  {
    question: 'Puis-je lire le livre sur ordinateur ?',
    answer:
      'Oui. Le fichier est un PDF standard lisible sur tous les ordinateurs (Windows, Mac, Linux) et tablettes.',
    category: 'reading',
  },
  {
    question: 'Puis-je acheter depuis un autre pays ?',
    answer:
      'Oui. Que tu sois au Cameroun, en Côte d’Ivoire, au Sénégal, en RDC, en France, au Canada ou ailleurs, Chariow accepte les moyens de paiement locaux et internationaux.',
    category: 'payment',
  },
  {
    question: 'Dans quelle monnaie vais-je payer ?',
    answer:
      'Les prix affichés sur le site sont les mêmes que sur Chariow. Tu peux consulter les tarifs en XAF, EUR ou USD grâce au sélecteur de devise en haut de page.',
    category: 'payment',
  },
  {
    question: 'Que faire si je ne reçois pas mon ebook ?',
    answer:
      'Vérifie d’abord tes courriers indésirables (spams). Si tu ne vois toujours rien après quelques minutes, écris-nous via la page Contact avec l’email utilisé lors de l’achat.',
    category: 'reading',
  },
  {
    question: 'Puis-je poser une question avant d’acheter ?',
    answer:
      'Bien sûr. Utilise le formulaire de la page Contact pour nous poser ta question directement.',
    category: 'brand',
  },
  {
    question: 'Est-ce que le livre est imprimé ?',
    answer:
      'Non. Il s’agit uniquement d’ebooks numériques au format PDF téléchargeables immédiatement. Aucun livre papier n’est expédié par la poste.',
    category: 'reading',
  },
  {
    question: 'Puis-je partager mon ebook ?',
    answer:
      'Non. Chaque ebook est réservé à ton usage strictement personnel. Respecter ce travail fait partie de la discipline du Bâtisseur.',
    category: 'brand',
  },
];

export function CategorizedFaq() {
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories: { key: FaqCategory; label: string; code: string }[] = [
    { key: 'all', label: 'TOUTES LES QUESTIONS', code: 'ALL' },
    { key: 'payment', label: 'ACHAT & CHARIOW', code: 'PAY' },
    { key: 'reading', label: 'FORMAT & LECTURE PDF', code: 'PDF' },
    { key: 'brand', label: 'ÉDITION & CADRE', code: 'KST' },
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? EXTENDED_FAQ_ITEMS
      : EXTENDED_FAQ_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-2 bg-[#151515] border border-[#565A5C]/40">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.key);
                setOpenIndex(0);
              }}
              className={`p-3 text-left font-mono transition-colors relative cursor-pointer ${
                isActive
                  ? 'bg-[#090909] text-[#EEB149] border border-[#EEB149]/50'
                  : 'text-[#A5A5A0] hover:text-[#FFFFFF] hover:bg-[#090909]/50'
              }`}
            >
              <div className="text-[10px] text-[#A5A5A0] mb-0.5 font-mono">[{cat.code}]</div>
              <div className="text-xs font-bold tracking-wider uppercase truncate">
                {cat.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filtered Accordions */}
      <div className="divide-y divide-[#565A5C]/30 border border-[#565A5C]/45 bg-[#151515]">
        {filteredItems.map((item, idx) => {
          const isOpen = openIndex === idx;
          const buttonId = `faq-cat-btn-${idx}`;
          const panelId = `faq-cat-panel-${idx}`;

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
                  className="w-full text-left py-5 sm:py-6 px-5 sm:px-8 flex items-center justify-between gap-4 cursor-pointer"
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
                        ? 'border-[#EEB149] text-[#EEB149] bg-[#090909]'
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
                className={isOpen ? 'px-5 sm:px-8 pb-6 pt-1' : 'hidden'}
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
  );
}
