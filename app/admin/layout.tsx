import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administration Privée | Kheops Set',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#090909] text-[#F3F1EB]">
      {children}
    </div>
  );
}
