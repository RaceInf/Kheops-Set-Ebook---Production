'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, FileText, ArrowLeft } from 'lucide-react';
import { PageImmersion } from '@/components/animations/page-immersion';

export interface LegalSectionItem {
  id: string;
  title: string;
}

interface LegalDocumentLayoutProps {
  title: string;
  subtitle?: string;
  documentType: string;
  lastUpdated: string;
  sections: LegalSectionItem[];
  children: React.ReactNode;
  activePath: '/conditions' | '/confidentialite' | '/mentions-legales' | '/remboursement';
}

const LEGAL_DOCUMENTS = [
  { label: 'Conditions Générales (CGV / CGU)', href: '/conditions' },
  { label: 'Politique de Confidentialité', href: '/confidentialite' },
  { label: 'Mentions Légales', href: '/mentions-legales' },
  { label: 'Politique de Remboursement', href: '/remboursement' },
];

export function LegalDocumentLayout({
  title,
  subtitle,
  documentType,
  lastUpdated,
  sections,
  children,
  activePath,
}: LegalDocumentLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.id || ''
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -120;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 space-y-12">
      <PageImmersion>
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Fil d'Ariane"
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
              {title}
            </li>
          </ol>
        </nav>

        {/* Header Banner */}
        <header className="space-y-4 border-b border-[#565A5C]/35 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#EEB149]" aria-hidden="true" />
              <span className="text-[#EEB149] font-semibold tracking-wider uppercase">
                {documentType}
              </span>
            </div>
            <span className="text-[#A5A5A0]">
              DERNIÈRE MISE À JOUR : {lastUpdated}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFFFFF] leading-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="text-base sm:text-lg text-[#F3F1EB] max-w-3xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </header>

        {/* Mobile Accordion / Dropdown Table of Contents */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            className="w-full p-4 bg-[#151515] border border-[#EEB149]/60 flex items-center justify-between text-left font-mono text-xs text-[#FFFFFF]"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#EEB149]" />
              <span>
                SOMMAIRE :{' '}
                {sections.find((s) => s.id === activeSection)?.title ||
                  'Naviguer dans les articles'}
              </span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-[#EEB149] transition-transform ${
                mobileMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {mobileMenuOpen && (
            <nav
              aria-label="Sommaire mobile"
              className="mt-2 p-4 bg-[#090909] border border-[#565A5C]/40 space-y-2 font-mono text-xs"
            >
              {sections.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left py-2 px-3 flex items-center justify-between border-l-2 transition-colors ${
                    activeSection === item.id
                      ? 'border-[#EEB149] bg-[#151515] text-[#EEB149] font-semibold'
                      : 'border-transparent text-[#A5A5A0] hover:text-[#FFFFFF]'
                  }`}
                >
                  <span>
                    § {String(idx + 1).padStart(2, '0')}. {item.title}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Two-Column Grid: Sticky Sidebar + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Sticky Table of Contents on Desktop */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-8">
            <div className="p-6 bg-[#151515] border border-[#565A5C]/40 space-y-6">
              <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-3 font-mono text-xs">
                <span className="text-[#EEB149] font-semibold tracking-wider uppercase">
                  SOMMAIRE D’ANCRES
                </span>
                <span className="text-[#A5A5A0]">{sections.length} ARTICLES</span>
              </div>

              <nav aria-label="Sommaire des articles" className="space-y-1 font-mono text-xs">
                {sections.map((item, idx) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left py-2.5 px-3 flex items-center justify-between transition-all cursor-pointer border-l-2 ${
                        isActive
                          ? 'border-[#EEB149] bg-[#090909] text-[#FFFFFF] font-semibold pl-4'
                          : 'border-[#565A5C]/20 text-[#A5A5A0] hover:text-[#FFFFFF] hover:border-[#565A5C]'
                      }`}
                    >
                      <span className="line-clamp-1">
                        § {String(idx + 1).padStart(2, '0')}. {item.title}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 bg-[#EEB149] rounded-full shrink-0" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Cross Links to Other Legal Documents */}
            <div className="p-6 bg-[#090909] border border-[#565A5C]/30 space-y-4 font-mono text-xs">
              <p className="text-[#A5A5A0] uppercase tracking-wider text-[10px]">
                DOCUMENTS CONNEXES
              </p>
              <ul className="space-y-2">
                {LEGAL_DOCUMENTS.map((doc) => {
                  const isCurrent = doc.href === activePath;
                  return (
                    <li key={doc.href}>
                      <Link
                        href={doc.href}
                        className={`block py-1.5 transition-colors ${
                          isCurrent
                            ? 'text-[#EEB149] font-semibold pointer-events-none'
                            : 'text-[#A5A5A0] hover:text-[#FFFFFF]'
                        }`}
                      >
                        → {doc.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Right Column: Main Legal Content */}
          <div className="lg:col-span-8 space-y-12 leading-relaxed text-[#F3F1EB]">
            {children}

            {/* Bottom Footer Action for Legal Pages */}
            <div className="pt-12 border-t border-[#565A5C]/35 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#A5A5A0]">
              <Link
                href="/"
                className="inline-flex items-center gap-2 hover:text-[#EEB149] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour à l’accueil</span>
              </Link>

              <div className="flex items-center gap-4">
                <Link href="/faq" className="hover:text-[#FFFFFF] transition-colors">
                  Consulter la FAQ
                </Link>
                <span aria-hidden="true">·</span>
                <Link href="/contact" className="hover:text-[#FFFFFF] transition-colors">
                  Contacter l’éditeur
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageImmersion>
    </div>
  );
}
