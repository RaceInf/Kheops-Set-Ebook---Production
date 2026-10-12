import React from 'react';
import type { Metadata } from 'next';
import { AdminSidebar } from './components/AdminSidebar';

export const metadata: Metadata = {
  title: 'Console Admin | Kheops Set',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#090909] text-[#FFFFFF] flex flex-col md:flex-row selection:bg-[#EEB149] selection:text-[#090909]">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
