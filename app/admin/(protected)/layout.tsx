import React from 'react';
import { requireAdminSession } from '@/lib/auth/admin-guard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protection serveur absolue : bloque l'exécution et redirige si non authentifié
  const session = await requireAdminSession();

  return (
    <div className="flex min-h-screen bg-[#090909] text-[#F3F1EB]">
      {/* Barre latérale d'administration */}
      <AdminSidebar emailMasked={session.emailMasked} />

      {/* Contenu principal de la console */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
