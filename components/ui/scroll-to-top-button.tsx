'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Remonter tout en haut de la page"
      title="Remonter en haut"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#090909] border border-[#EEB149] text-[#EEB149] hover:bg-[#EEB149] hover:text-[#090909] shadow-[0_10px_30px_rgba(0,0,0,0.85)] flex items-center justify-center transition-colors duration-150 cursor-pointer print:hidden"
    >
      <ArrowUp className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}
