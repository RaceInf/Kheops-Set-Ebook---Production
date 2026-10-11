import React from 'react';
import { requireAdminSession } from '@/lib/auth/admin-guard';
import { getAdminProducts } from '@/lib/admin/db';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ProductManagementClient } from '@/components/admin/ProductManagementClient';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const session = await requireAdminSession();
  const products = await getAdminProducts();

  return (
    <>
      <AdminHeader
        emailMasked={session.emailMasked}
        title="Gestion des Produits"
        subtitle="Contrôle des CTA, URLs de paiement Chariow et visibilité"
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-5xl">
        <div className="p-4 bg-[#151515] border border-[#565A5C]/40 space-y-1">
          <p className="font-mono text-xs text-[#EEB149] font-bold">
            RÈGLE INTANGIBLE : LE PRIX XAF EST LA SOURCE DE VÉRITÉ
          </p>
          <p className="text-xs text-[#A5A5A0]">
            Les prix officiels de base (10 000 FCFA et 5 000 FCFA) ne sont jamais modifiés automatiquement.
          </p>
        </div>

        <ProductManagementClient initialProducts={products} />
      </main>
    </>
  );
}
