import React from 'react';
import { prisma } from '@/lib/db';
import type { Order } from '@prisma/client';
import { ShoppingCart, Coins, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

function getProductLabel(slug: string): string {
  if (slug === 'le-capital-du-batisseur' || slug === 'captaldubatisseur') {
    return 'Le Capital du Bâtisseur';
  }
  if (slug === 'le-code-du-batisseur' || slug === 'codedubatisseur') {
    return 'Le Code du Bâtisseur';
  }
  return slug;
}

export default async function AdminOrdersPage() {
  let orders: Order[] = [];
  let totalRevenue = 0;

  try {
    const allOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    orders = allOrders;

    totalRevenue = allOrders.reduce((acc, order) => {
      if (['COMPLETED', 'completed', 'PAID', 'paid'].includes(order.status)) {
        return acc + order.amount;
      }
      return acc;
    }, 0);
  } catch (error) {
    console.error('[Admin Orders Error]:', error);
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#565A5C]/30">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-semibold text-[#EEB149] uppercase tracking-widest flex items-center gap-1.5">
              <ShoppingCart className="w-3.5 h-3.5" />
              REGISTRE CHARIOW
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF] uppercase">
            VENTES ET TRANSACTIONS
          </h1>
          <p className="text-xs font-mono text-[#A5A5A0] mt-1">
            Ensemble des commandes numériques livrées via Chariow et enregistrées en base.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-[#151515] border border-[#565A5C]/40 text-xs font-mono text-[#F3F1EB]">
            Volume : <span className="text-[#EEB149] font-bold">{formatAmount(totalRevenue)} FCFA</span>
          </div>
          <div className="px-3.5 py-2 bg-[#151515] border border-[#565A5C]/40 text-xs font-mono text-[#F3F1EB]">
            Commandes : <span className="text-[#FFFFFF] font-bold">{orders.length}</span>
          </div>
        </div>
      </div>

      {/* Tableau des commandes */}
      <div className="bg-[#151515] border border-[#565A5C]/40 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#090909] border-b border-[#565A5C]/30 text-[10px] font-mono text-[#565A5C] uppercase tracking-wider">
                <th className="py-3.5 px-6 font-medium">ID Transaction</th>
                <th className="py-3.5 px-6 font-medium">Acheteur</th>
                <th className="py-3.5 px-6 font-medium">Produit commandé</th>
                <th className="py-3.5 px-6 font-medium">Montant</th>
                <th className="py-3.5 px-6 font-medium">Statut</th>
                <th className="py-3.5 px-6 font-medium text-right">Date & Heure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#565A5C]/20 font-mono text-xs">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#090909]/40 transition-colors">
                    <td className="py-3.5 px-6 text-[#A5A5A0] text-[11px]">
                      <span className="font-mono bg-[#090909] px-2 py-1 border border-[#565A5C]/30">
                        {order.chariowId ? order.chariowId.slice(-8) : order.id.slice(-8)}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-[#FFFFFF] font-medium">
                      {order.email}
                    </td>
                    <td className="py-3.5 px-6 text-[#F3F1EB]">
                      <span className="text-[11px] font-semibold">
                        {getProductLabel(order.productSlug)}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-[#EEB149] font-bold">
                      {formatAmount(order.amount)} {order.currency}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right text-[#565A5C] text-[11px]">
                      <div className="flex items-center justify-end gap-1.5">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs font-mono text-[#565A5C]">
                    <Coins className="w-6 h-6 mx-auto mb-2 opacity-40 text-[#EEB149]" />
                    Aucune vente enregistrée pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#090909] border-t border-[#565A5C]/30 flex items-center justify-between text-[11px] font-mono text-[#565A5C]">
          <span>Protection de livraison Chariow active</span>
          <span className="flex items-center gap-1 text-[#EEB149]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Vérification HMAC SHA-256
          </span>
        </div>
      </div>
    </div>
  );
}
