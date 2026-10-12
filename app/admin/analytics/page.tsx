import React from 'react';
import { getAnalyticsDashboardData } from '@/lib/analytics-api';
import {
  Activity,
  Users,
  Compass,
  FileText,
  TrendingUp,
  Percent,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Monitor,
  Globe,
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const data = await getAnalyticsDashboardData();

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#565A5C]/30">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-semibold text-[#EEB149] uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              TÉLÉMÉTRIE & AUDIENCE GOOGLE ANALYTICS
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF] uppercase">
            ANALYTICS & CONVERSIONS EN TEMPS RÉEL
          </h1>
          <p className="text-xs font-mono text-[#A5A5A0] mt-1">
            Suivi complet de l&apos;audience GA4 et croisement direct avec les registres de vente Prisma.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-[#151515] border border-[#565A5C]/40 text-xs font-mono flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                data.configured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="text-[#F3F1EB]">
              {data.configured ? 'GA4 Data API : Connecté' : 'GA4 Non Configuré'}
            </span>
          </div>
        </div>
      </div>

      {!data.configured && (
        <div className="bg-[#151515] border border-amber-500/40 p-5 font-mono text-xs text-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider block text-amber-300">
              Configuration Google Analytics 4 Requise
            </span>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              Pour synchroniser l&apos;intégralité des flux GA4, configurez vos variables dans{' '}
              <code className="text-[#EEB149]">.env.local</code> :{' '}
              <code className="text-[#EEB149]">GA_PROPERTY_ID</code>,{' '}
              <code className="text-[#EEB149]">GA_CLIENT_EMAIL</code>, et{' '}
              <code className="text-[#EEB149]">GA_PRIVATE_KEY</code>.
            </p>
            {data.errorMessage && (
              <p className="text-[11px] text-amber-400/80 mt-1 italic">
                Statut : {data.errorMessage}
              </p>
            )}
          </div>
        </div>
      )}

      {/* KPIs Visiteurs & Sessions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#151515] border border-[#565A5C]/40 p-5 shadow-lg relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#A5A5A0]">
              Visiteurs Uniques (7j)
            </span>
            <div className="w-8 h-8 bg-[#090909] border border-[#565A5C]/40 flex items-center justify-center text-[#EEB149]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="font-mono text-3xl font-bold text-[#FFFFFF]">
            {data.totalUsers7d.toLocaleString('fr-FR')}
          </span>
          <span className="text-[11px] font-mono text-[#EEB149] mt-1 block flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Flux actif GA4
          </span>
        </div>

        <div className="bg-[#151515] border border-[#565A5C]/40 p-5 shadow-lg relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#A5A5A0]">
              Sessions Totales (7j)
            </span>
            <div className="w-8 h-8 bg-[#090909] border border-[#565A5C]/40 flex items-center justify-center text-[#EEB149]">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <span className="font-mono text-3xl font-bold text-[#EEB149]">
            {data.totalSessions7d.toLocaleString('fr-FR')}
          </span>
          <span className="text-[11px] font-mono text-[#565A5C] mt-1 block">
            Parcours démarrés
          </span>
        </div>

        <div className="bg-[#151515] border border-[#565A5C]/40 p-5 shadow-lg relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#A5A5A0]">
              Moyenne / Jour
            </span>
            <div className="w-8 h-8 bg-[#090909] border border-[#565A5C]/40 flex items-center justify-center text-[#EEB149]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <span className="font-mono text-3xl font-bold text-[#FFFFFF]">
            {Math.round(data.totalUsers7d / 7).toLocaleString('fr-FR')}
          </span>
          <span className="text-[11px] font-mono text-[#565A5C] mt-1 block">
            Visiteurs / 24h
          </span>
        </div>

        <div className="bg-[#151515] border border-[#565A5C]/40 p-5 shadow-lg relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#A5A5A0]">
              Taux Global Conversion
            </span>
            <div className="w-8 h-8 bg-[#090909] border border-[#565A5C]/40 flex items-center justify-center text-[#EEB149]">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <span className="font-mono text-3xl font-bold text-emerald-400">
            {data.totalUsers7d > 0
              ? `${(
                  (data.conversions.reduce((acc, c) => acc + c.sales, 0) / data.totalUsers7d) *
                  100
                ).toFixed(1)}%`
              : '0.0%'}
          </span>
          <span className="text-[11px] font-mono text-[#565A5C] mt-1 block">
            Ventes / Visiteurs totaux
          </span>
        </div>
      </div>

      {/* Graphique Visiteurs Quotidiens (Courbe / Barres animées CSS) */}
      <div className="bg-[#151515] border border-[#565A5C]/40 p-6 shadow-xl relative">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#565A5C]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#090909] border border-[#EEB149]/40 flex items-center justify-center text-[#EEB149]">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold uppercase text-[#FFFFFF] tracking-tight">
                Évolution de l&apos;Audience (7 derniers jours)
              </h2>
              <span className="text-[10px] font-mono text-[#A5A5A0] tracking-wider uppercase block">
                Visiteurs actifs journaliers mesurés par GA4
              </span>
            </div>
          </div>
        </div>

        <div className="h-48 sm:h-56 flex items-end gap-2 sm:gap-4 pt-6 px-2 border-b border-[#565A5C]/30 pb-2">
          {data.dailyVisitors.length > 0 ? (
            data.dailyVisitors.map((item, idx) => {
              const maxVal = Math.max(...data.dailyVisitors.map((d) => d.visitors), 10);
              const heightPct = Math.max(Math.round((item.visitors / maxVal) * 100), 8);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-[#EEB149] opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.visitors}
                  </span>
                  <div
                    className="w-full bg-[#EEB149]/80 group-hover:bg-[#EEB149] transition-all duration-300 relative"
                    style={{ height: `${heightPct}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#090909] border border-[#EEB149] px-1.5 py-0.5 text-[9px] font-mono text-[#EEB149] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {item.visitors} visiteurs
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#565A5C] truncate">
                    {item.date}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#565A5C]">
              Aucune donnée journalière GA4 disponible pour l&apos;instant.
            </div>
          )}
        </div>
      </div>

      {/* Tableau Clé : Taux de Conversion par Produit (GA4 + Prisma) */}
      <div className="bg-[#151515] border border-[#565A5C]/40 p-6 shadow-xl relative">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#565A5C]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#090909] border border-[#EEB149]/40 flex items-center justify-center text-[#EEB149]">
              <Percent className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold uppercase text-[#FFFFFF] tracking-tight">
                Taux de Conversion Réels (Ventes Prisma / Visiteurs GA4)
              </h2>
              <span className="text-[10px] font-mono text-[#A5A5A0] tracking-wider uppercase block">
                Rapprochement en direct entre le trafic produit et les commandes validées
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b border-[#565A5C]/25 text-[10px] font-mono text-[#565A5C] uppercase tracking-wider">
                <th className="pb-3 font-medium">Manuel d&apos;Ingénierie</th>
                <th className="pb-3 font-medium">Vues de Page (GA4)</th>
                <th className="pb-3 font-medium">Commandes Chariow (Prisma)</th>
                <th className="pb-3 font-medium text-right">Taux de Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#565A5C]/15 font-mono text-xs">
              {data.conversions.map((conv) => (
                <tr key={conv.productSlug} className="hover:bg-[#090909]/40 transition-colors">
                  <td className="py-3.5 text-[#FFFFFF] font-bold">
                    <Link
                      href={`/ebooks/${conv.productSlug}`}
                      target="_blank"
                      className="hover:text-[#EEB149] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>{conv.productTitle}</span>
                      <ExternalLink className="w-3 h-3 text-[#565A5C]" />
                    </Link>
                  </td>
                  <td className="py-3.5 text-[#A5A5A0]">
                    {conv.views.toLocaleString('fr-FR')} vues
                  </td>
                  <td className="py-3.5 text-[#EEB149] font-bold">
                    {conv.sales} ventes
                  </td>
                  <td className="py-3.5 text-right font-bold text-emerald-400">
                    <span className="inline-block px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30">
                      {conv.conversionRate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grille 2 Colonnes : Top 5 Pages & Sources de Trafic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Pages les plus visitées */}
        <div className="bg-[#151515] border border-[#565A5C]/40 p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#565A5C]/20">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#EEB149]" />
              <h2 className="font-display text-sm font-bold uppercase text-[#FFFFFF] tracking-tight">
                Top 5 des Pages Visitées
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#565A5C] uppercase">
              Par volume de vues
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {data.topPages.map((page, index) => (
              <div key={page.path} className="space-y-1.5">
                <div className="flex items-center justify-between text-[#F3F1EB]">
                  <div className="flex items-center gap-2 truncate max-w-[280px]">
                    <span className="text-[#565A5C] text-[10px] font-bold">0{index + 1}.</span>
                    <span className="truncate">{page.path}</span>
                  </div>
                  <span className="text-[#EEB149] font-bold shrink-0">
                    {page.views} vues ({page.percentage}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#090909] border border-[#565A5C]/30 overflow-hidden">
                  <div
                    className="h-full bg-[#EEB149] transition-all duration-500"
                    style={{ width: `${Math.max(page.percentage, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sources de Trafic */}
        <div className="bg-[#151515] border border-[#565A5C]/40 p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#565A5C]/20">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#EEB149]" />
              <h2 className="font-display text-sm font-bold uppercase text-[#FFFFFF] tracking-tight">
                Canaux & Sources d&apos;Acquisition
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#565A5C] uppercase">
              Par sessions
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {data.trafficSources.map((source) => (
              <div key={source.source} className="space-y-1.5">
                <div className="flex items-center justify-between text-[#F3F1EB]">
                  <span className="uppercase text-[11px] tracking-wider text-[#A5A5A0]">
                    {source.source}
                  </span>
                  <span className="text-[#FFFFFF] font-bold">
                    {source.sessions} sessions ({source.percentage}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#090909] border border-[#565A5C]/30 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.max(source.percentage, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
