'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { CurrencySelector } from '@/components/ui/currency-selector';
import { getChariowCheckoutUrl } from '@/lib/ebooks-data';
import { useCheckoutModal } from '@/context/checkout-modal-context';

const NAV_ITEMS = [
  { label: 'Accueil', href: '/' },
  { label: 'Ebooks', href: '/ebooks' },
  { label: 'Ressource gratuite', href: '/ressource-gratuite' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const { openCheckout } = useCheckoutModal();
  const checkoutUrl = getChariowCheckoutUrl();
  const ctaLocation =
    pathname === '/'
      ? 'home'
      : pathname?.startsWith('/ebooks/')
        ? 'product_page'
        : pathname === '/ebooks'
          ? 'catalogue'
          : 'home';

  const productSlug = pathname?.includes('le-code-du-batisseur')
    ? 'le-code-du-batisseur'
    : 'le-capital-du-batisseur';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 36);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // UI/UX Pro Max: Lock background body scroll when mobile navigation drawer is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-[#565A5C]/30 bg-[#090909]/88 backdrop-blur-md ${
        isScrolled ? 'py-2.5' : 'py-3.5'
      }`}
    >
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Title (Single text element wordmark) */}
        <Link
          href="/"
          className="font-display text-base sm:text-lg font-bold tracking-[0.16em] text-[#FFFFFF] whitespace-nowrap shrink-0"
        >
          KHEOPS SET
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav
          aria-label="Navigation principale"
          className="hidden lg:flex items-center gap-6 text-xs font-medium text-[#A5A5A0]"
        >
          {NAV_ITEMS.map((item, idx) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`transition-colors duration-150 whitespace-nowrap py-1 border-b flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:border-[#EEB149] ${
                  isActive
                    ? 'text-[#FFFFFF] border-[#EEB149] font-semibold'
                    : 'hover:text-[#FFFFFF] border-transparent hover:border-[#EEB149]/60'
                } ${idx >= 5 ? 'hidden xl:inline-flex' : ''}`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EEB149]" />
                )}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Currency Converter + Primary CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div className="hidden sm:block">
            <CurrencySelector variant="navbar" />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openCheckout({
                slug: productSlug,
                location: `${ctaLocation}_navbar_desktop`,
                triggerElement: e.currentTarget,
              });
            }}
            className="px-3.5 sm:px-4 py-2 min-h-[38px] inline-flex items-center text-xs font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EEB149]"
          >
            PRENDRE LE PLAN
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] border border-[#565A5C]/40 text-[#FFFFFF] hover:border-[#EEB149] active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EEB149]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden border-t border-[#565A5C]/30 bg-[#090909] px-4 pt-4 pb-6 space-y-5"
        >
          <nav aria-label="Menu mobile" className="flex flex-col divide-y divide-[#151515]">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-sm font-medium text-[#F3F1EB] hover:text-[#EEB149] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-2 flex flex-col gap-4 border-t border-[#565A5C]/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A5A5A0]">Devise</span>
              <CurrencySelector variant="inline" />
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMobileMenuOpen(false);
                  openCheckout({
                    slug: productSlug,
                    location: `${ctaLocation}_navbar_mobile`,
                    triggerElement: e.currentTarget,
                  });
                }}
                className="flex items-center justify-center w-full py-3 px-4 text-xs font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors cursor-pointer"
              >
                PRENDRE LE PLAN
              </button>
              <p className="text-[11px] text-center text-[#A5A5A0]">
                Paiement et accès via Chariow.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
