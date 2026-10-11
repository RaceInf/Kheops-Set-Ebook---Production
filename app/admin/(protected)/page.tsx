import React from 'react';
import Link from 'next/link';
import { requireAdminSession } from '@/lib/auth/admin-guard';
import { getAdminOverviewStats, getAdminWebhookEvents } from '@/lib/admin/db';
import { getAuditLogsList } from '@/lib/admin/audit-log';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  TrendingUp,
  CreditCard,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Shield,
  Activity,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const session = await requireAdminSession();
  const stats = await getAdminOverviewStats();
  const recentLogs = await getAuditLogsList(5);
  const recentWebhooks = await getAdminWebhookEvents(3);

  return (
    <>
      <AdminHeader
        emailMasked={session.emailMasked}
        title="Vue d’ensemble"
        subtitle="Métriques clés, état des services et activité récente"
      />

      <main className="p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* Grille des KPIs clés */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-[#151515] border border-[#565A5C]/40 space-y-2">
            <div className="flex items-center justify-between text-[#A5A5A0]">
              <span className="font-mono text-xs uppercase tracking-wider">Visites estimées</span>
              <Users className="w-4 h-4 text-[#EEB149]" />
            </div>
            <p className="font-mono text-2xl font-bold text-[#FFFFFF]">
              {stats.estimated_visits.toLocaleString('fr-FR')}
            </p>
            <p className="font-mono text-[11px] text-[#A5A5A0]">Trafic organique direct & référé</p>
          </div>

          <div className="p-5 bg-[#151515] border border-[#565A5C]/40 space-y-2">
            <div className="flex items-center justify-between text-[#A5A5A0]">
              <span className="font-mono text-xs uppercase tracking-wider">Ventes confirmées</span>
              <CreditCard className="w-4 h-4 text-[#EEB149]" />
            </div>
            <p className="font-mono text-2xl font-bold text-[#FFFFFF]">
              {stats.total_orders_count}
            </p>
            <p className="font-mono text-[11px] text-[#EEB149]">Transactions Chariow validées</p>
          </div>

          <div className="p-5 bg-[#151515] border border-[#565A5C]/40 space-y-2">
            <div className="flex items-center justify-between text-[#A5A5A0]">
              <span className="font-mono text-xs uppercase tracking-wider">Chiffre d’affaires</span>
              <span className="font-mono text-xs text-[#EEB149]">XAF</span>
            </div>
            <p className="font-mono text-2xl font-bold text-[#EEB149]">
              {stats.total_revenue_xaf.toLocaleString('fr-FR')} FCFA
            </p>
            <p className="font-mono text-[11px] text-[#A5A5A0]">Base de vérité XAF inviolable</p>
          </div>

          <div className="p-5 bg-[#151515] border border-[#565A5C]/40 space-y-2">
            <div className="flex items-center justify-between text-[#A5A5A0]">
              <span className="font-mono text-xs uppercase tracking-wider">Taux de conversion</span>
              <TrendingUp className="w-4 h-4 text-[#EEB149]" />
            </div>
            <p className="font-mono text-2xl font-bold text-[#FFFFFF]">
              {stats.conversion_rate_percent} %
            </p>
            <p className="font-mono text-[11px] text-[#A5A5A0]">Visites vers ventes Chariow</p>
          </div>
        </div>

        {/* Santé des Intégrations & Alertes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-[#151515] border border-[#565A5C]/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#565A5C]/35">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#EEB149]" />
                <h2 className="font-display text-sm font-bold text-[#FFFFFF] uppercase tracking-wide">
                  État des Services & Intégrations
                </h2>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5">
                SERVICES OPÉRATIONNELS
              </span>
            </div>

            <ul className="space-y-3 font-mono text-xs">
              <li className="flex items-center justify-between p-2.5 bg-[#090909] border border-[#565A5C]/25">
                <span className="text-[#F3F1EB]">Chariow Checkout & Widget</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Connecté (Frame Snap)
                </span>
              </li>

              <li className="flex items-center justify-between p-2.5 bg-[#090909] border border-[#565A5C]/25">
                <span className="text-[#F3F1EB]">Frankfurter API Taux</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Taux live mis en cache
                </span>
              </li>

              <li className="flex items-center justify-between p-2.5 bg-[#090909] border border-[#565A5C]/25">
                <span className="text-[#F3F1EB]">Brevo Email Notifications</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Passerelle active
                </span>
              </li>

              <li className="flex items-center justify-between p-2.5 bg-[#090909] border border-[#565A5C]/25">
                <span className="text-[#F3F1EB]">Google Analytics 4</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Collecte balisée
                </span>
              </li>
            </ul>
          </div>

          {/* Raccourcis de gestion V1 */}
          <div className="p-6 bg-[#151515] border border-[#565A5C]/40 space-y-4">
            <div className="pb-3 border-b border-[#565A5C]/35">
              <h2 className="font-display text-sm font-bold text-[#FFFFFF] uppercase tracking-wide">
                Actions Rapides & Paramétrage
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/admin/products"
                className="p-4 bg-[#090909] border border-[#565A5C]/40 hover:border-[#EEB149] transition-colors space-y-1 block group"
              >
                <div className="flex items-center justify-between text-[#EEB149]">
                  <span className="font-mono text-xs font-bold uppercase">Produits</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-[#A5A5A0]">Activer/Désactiver les manuels et CTA</p>
              </Link>

              <Link
                href="/admin/settings"
                className="p-4 bg-[#090909] border border-[#565A5C]/40 hover:border-[#EEB149] transition-colors space-y-1 block group"
              >
                <div className="flex items-center justify-between text-[#EEB149]">
                  <span className="font-mono text-xs font-bold uppercase">Paramètres</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-[#A5A5A0]">Bascule Snap, fallback, tracking GA4</p>
              </Link>

              <Link
                href="/admin/currencies"
                className="p-4 bg-[#090909] border border-[#565A5C]/40 hover:border-[#EEB149] transition-colors space-y-1 block group"
              >
                <div className="flex items-center justify-between text-[#EEB149]">
                  <span className="font-mono text-xs font-bold uppercase">Devises</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-[#A5A5A0]">Vérifier et forcer les taux Frankfurter</p>
              </Link>

              <Link
                href="/admin/webhooks"
                className="p-4 bg-[#090909] border border-[#565A5C]/40 hover:border-[#EEB149] transition-colors space-y-1 block group"
              >
                <div className="flex items-center justify-between text-[#EEB149]">
                  <span className="font-mono text-xs font-bold uppercase">Webhooks</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-[#A5A5A0]">Journal des réceptions Chariow</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Dernières entrées du Journal d'Audit & Webhooks */}
        <div className="p-6 bg-[#151515] border border-[#565A5C]/40 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#565A5C]/35">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#EEB149]" />
              <h2 className="font-display text-sm font-bold text-[#FFFFFF] uppercase tracking-wide">
                Journal d’activité récent (Audit Trail)
              </h2>
            </div>
            <Link
              href="/admin/audit-log"
              className="font-mono text-xs text-[#EEB149] hover:underline"
            >
              Voir tout le journal →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#565A5C]/30 text-[#A5A5A0] text-[11px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Entité</th>
                  <th className="py-2.5 px-3">Détail</th>
                  <th className="py-2.5 px-3">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#565A5C]/20 text-[#F3F1EB]">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#090909]/40">
                    <td className="py-2.5 px-3 text-[#A5A5A0]">
                      {new Date(log.created_at).toLocaleString('fr-FR', {
                        dateStyle: 'short',
                        timeStyle: 'medium',
                      })}
                    </td>
                    <td className="py-2.5 px-3 text-[#EEB149]">{log.action}</td>
                    <td className="py-2.5 px-3 uppercase text-[11px]">{log.entity}</td>
                    <td className="py-2.5 px-3 max-w-xs truncate">{log.summary}</td>
                    <td className="py-2.5 px-3 text-[#A5A5A0]">{log.admin_identifier_masked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
