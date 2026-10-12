import React from 'react';
import { getDashboardStats } from '@/lib/admin-actions';
import {
  Coins,
  ShoppingCart,
  Users,
  Percent,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  FileText,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';
import { AIStrategicInsight } from './components/AIStrategicInsight';

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

export default async function AdminCockpitPage() {
  const stats = await getDashboardStats();

  const kpis = [
    {
      title: 'Chiffre d’Affaires',
      value: `${formatAmount(stats.totalRevenue)} FCFA`,
      subtitle: 'Commandes validées',
      icon: Coins,
      accent: 'text-[#EEB149]',
      borderHover: 'hover:border-[#EEB149]/60',
    },
    {
      title: 'Total Ventes',
      value: stats.totalOrdersCount.toString(),
      subtitle: 'Transactions enregistrées',
      icon: ShoppingCart,
      accent: 'text-[#FFFFFF]',
      borderHover: 'hover:border-[#FFFFFF]/40',
    },
    {
      title: 'Nouveaux Leads',
      value: stats.totalLeadsCount.toString(),
      subtitle: 'Protocole & Inscrits',
      icon: Users,
      accent: 'text-[#EEB149]',
      borderHover: 'hover:border-[#EEB149]/60',
    },
    {
      title: 'Taux de Conversion',
      value: stats.conversionRate,
      subtitle: 'Visiteurs vers acheteurs',
      icon: Percent,
      accent: 'text-[#A5A5A0]',
      borderHover: 'hover:border-[#565A5C]',
    },
  ];

  return (
    <div className="space-y-8">
      {/* En-tête : CENTRE DE COMMANDEMENT */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#565A5C]/30">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-semibold text-[#EEB149] uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#EEB149] inline-block" />
              CENTRE DE COMMANDEMENT
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF] uppercase">
            COCKPIT KHEOPS SET
          </h1>
          <p className="text-xs font-mono text-[#A5A5A0] mt-1 tracking-wide">
            Vue instantanée des flux financiers, acquisitions de leads et de la santé opérationnelle.
          </p>
        </div>

        {/* Badge d'état base de données */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-[#151515] border border-[#565A5C]/40 flex items-center gap-2.5">
            {stats.dbConnected ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono text-[#F3F1EB]">
                  PostgreSQL : <span className="text-emerald-400 font-bold">ACTIF</span>
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-mono text-[#F3F1EB]">
                  Base : <span className="text-amber-400">En attente DATABASE_URL</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grille 4 KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className={`bg-[#151515] border border-[#565A5C]/40 p-5 transition-all relative ${kpi.borderHover} shadow-lg`}
            >
              {/* Technical corner indicators */}
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#565A5C]/40" />

              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#A5A5A0]">
                  {kpi.title}
                </span>
                <div className="w-8 h-8 bg-[#090909] border border-[#565A5C]/40 flex items-center justify-center text-[#EEB149]">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className={`font-mono text-2xl sm:text-3xl font-bold tracking-tight block ${kpi.accent}`}>
                  {kpi.value}
                </span>
                <span className="text-[11px] font-mono text-[#565A5C] mt-1 block">
                  {kpi.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section Rapport Stratégique IA — Directeur de Stratégie Kheops */}
      <AIStrategicInsight />

      {/* Grille divisée en deux colonnes : Transactions & Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne Gauche : Dernières transactions Chariow */}
        <div className="bg-[#151515] border border-[#565A5C]/40 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#565A5C]/20">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-[#090909] border border-[#EEB149]/40 flex items-center justify-center text-[#EEB149]">
                  <ShoppingCart className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="font-display text-sm font-bold uppercase text-[#FFFFFF] tracking-tight">
                    Dernières transactions Chariow
                  </h2>
                  <span className="text-[10px] font-mono text-[#A5A5A0] tracking-wider uppercase block">
                    Flux des ventes récentes
                  </span>
                </div>
              </div>

              <Link
                href="/admin/orders"
                className="text-xs font-mono text-[#EEB149] hover:text-[#FFFFFF] transition-colors flex items-center gap-1 uppercase tracking-wider"
              >
                <span>Tout voir</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Table des Commandes avec scroll horizontal responsive */}
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left border-collapse min-w-[480px]">
                <thead>
                  <tr className="border-b border-[#565A5C]/20 text-[10px] font-mono text-[#565A5C] uppercase tracking-wider">
                    <th className="pb-3 font-medium">Client / Email</th>
                    <th className="pb-3 font-medium">Manuel</th>
                    <th className="pb-3 font-medium">Montant</th>
                    <th className="pb-3 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#565A5C]/15 font-mono text-xs">
                  {stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#090909]/50 transition-colors">
                        <td className="py-3 text-[#F3F1EB] font-medium max-w-[160px] truncate">
                          {order.email}
                        </td>
                        <td className="py-3 text-[#A5A5A0]">
                          <span className="inline-block max-w-[140px] truncate text-[11px]">
                            {getProductLabel(order.productSlug)}
                          </span>
                        </td>
                        <td className="py-3 text-[#EEB149] font-bold">
                          {formatAmount(order.amount)} {order.currency}
                        </td>
                        <td className="py-3 text-right text-[11px] text-[#565A5C]">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-xs font-mono text-[#565A5C]">
                        <Clock className="w-5 h-5 mx-auto mb-2 opacity-50" />
                        Aucune transaction enregistrée pour le moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#565A5C]/20 flex items-center justify-between text-[11px] font-mono text-[#565A5C]">
            <span>Synchronisation : Webhook Chariow HMAC</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#EEB149]/10 text-[#EEB149] border border-[#EEB149]/20 text-[10px] font-mono font-medium">
              TEMPS RÉEL
            </span>
          </div>
        </div>

        {/* Colonne Droite : Dernières acquisitions Leads */}
        <div className="bg-[#151515] border border-[#565A5C]/40 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#565A5C]/20">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-[#090909] border border-[#EEB149]/40 flex items-center justify-center text-[#EEB149]">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="font-display text-sm font-bold uppercase text-[#FFFFFF] tracking-tight">
                    Dernières acquisitions Leads
                  </h2>
                  <span className="text-[10px] font-mono text-[#A5A5A0] tracking-wider uppercase block">
                    Capture Protocole & Formulaires
                  </span>
                </div>
              </div>

              <Link
                href="/admin/leads"
                className="text-xs font-mono text-[#EEB149] hover:text-[#FFFFFF] transition-colors flex items-center gap-1 uppercase tracking-wider"
              >
                <span>Tout voir</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Table des Leads avec scroll horizontal responsive */}
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left border-collapse min-w-[420px]">
                <thead>
                  <tr className="border-b border-[#565A5C]/20 text-[10px] font-mono text-[#565A5C] uppercase tracking-wider">
                    <th className="pb-3 font-medium">Contact</th>
                    <th className="pb-3 font-medium">Source</th>
                    <th className="pb-3 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#565A5C]/15 font-mono text-xs">
                  {stats.recentLeads.length > 0 ? (
                    stats.recentLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#090909]/50 transition-colors">
                        <td className="py-3">
                          <span className="text-[#F3F1EB] block font-medium max-w-[180px] truncate">
                            {lead.email}
                          </span>
                          {lead.firstName && (
                            <span className="text-[10px] text-[#A5A5A0] block truncate">
                              Prénom : {lead.firstName}
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EEB149]/10 text-[#EEB149] border border-[#EEB149]/30 text-[10px] font-mono uppercase tracking-wider">
                            <FileText className="w-3 h-3" />
                            {lead.source || 'Protocole'}
                          </span>
                        </td>
                        <td className="py-3 text-right text-[11px] text-[#565A5C]">
                          {formatDate(lead.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-xs font-mono text-[#565A5C]">
                        <UserCheck className="w-5 h-5 mx-auto mb-2 opacity-50" />
                        Aucun lead enregistré pour le moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#565A5C]/20 flex items-center justify-between text-[11px] font-mono text-[#565A5C]">
            <span>Autorépondeur : Brevo Listes synchronisées</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-medium">
              SÉCURISÉ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
