import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Ebook — Kheops Set',
  description: 'Détail ebook.',
};

export default function EbookDetailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-[#FFFFFF]">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-[920px] mx-auto w-full space-y-8">
        <h1 className="font-display text-3xl font-bold">Détail ebook</h1>
        <p className="text-[#A5A5A0]">Page épurée.</p>
      </main>
      <Footer />
    </div>
  );
}
