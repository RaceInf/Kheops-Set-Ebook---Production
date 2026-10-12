import React from 'react';
import { prisma } from '@/lib/db';
import type { Lead } from '@prisma/client';
import { Users, FileText, Mail, Calendar, Shield } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

interface LeadsPageProps {
  searchParams: Promise<{
    source?: string;
  }>;
}

export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams;
  const selectedSource = params.source || 'all';

  let leads: Lead[] = [];
  let protocolCount = 0;
  let contactCount = 0;
  let otherCount = 0;

  try {
    const whereClause =
      selectedSource === 'all'
        ? {}
        : { source: selectedSource };

    const [allLeads, counts] = await Promise.all([
      prisma.lead.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lead.groupBy({
        by: ['source'],
        _count: true,
      }),
    ]);

    leads = allLeads;

    counts.forEach((c) => {
      if (c.source === 'protocole_du_batisseur') {
        protocolCount = c._count;
      } else if (c.source === 'formulaire_contact') {
        contactCount = c._count;
      } else {
        otherCount += c._count;
      }
    });
  } catch (error) {
    console.error('[Admin Leads Error]:', error);
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#565A5C]/30">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-semibold text-[#EEB149] uppercase tracking-widest flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              CRM KHEOPS SET
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF] uppercase">
            REGISTRE DES LEADS
          </h1>
          <p className="text-xs font-mono text-[#A5A5A0] mt-1">
            Total des contacts qualifiés capturés via les formulaires du site.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3.5 py-2 bg-[#151515] border border-[#565A5C]/40 text-[#F3F1EB]">
            Total : <span className="text-[#EEB149] font-bold">{leads.length}</span> contacts
          </div>
        </div>
      </div>

      {/* Barre de Filtres par Source */}
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/admin/leads"
          className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-all border ${
            selectedSource === 'all'
              ? 'bg-[#EEB149] text-[#090909] border-[#EEB149] font-bold'
              : 'bg-[#151515] text-[#A5A5A0] border-[#565A5C]/40 hover:text-[#FFFFFF] hover:border-[#EEB149]/50'
          }`}
        >
          Tous ({protocolCount + contactCount + otherCount || leads.length})
        </Link>

        <Link
          href="/admin/leads?source=protocole_du_batisseur"
          className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-all border ${
            selectedSource === 'protocole_du_batisseur'
              ? 'bg-[#EEB149] text-[#090909] border-[#EEB149] font-bold'
              : 'bg-[#151515] text-[#A5A5A0] border-[#565A5C]/40 hover:text-[#FFFFFF] hover:border-[#EEB149]/50'
          }`}
        >
          Protocole ({protocolCount})
        </Link>

        <Link
          href="/admin/leads?source=formulaire_contact"
          className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-all border ${
            selectedSource === 'formulaire_contact'
              ? 'bg-[#EEB149] text-[#090909] border-[#EEB149] font-bold'
              : 'bg-[#151515] text-[#A5A5A0] border-[#565A5C]/40 hover:text-[#FFFFFF] hover:border-[#EEB149]/50'
          }`}
        >
          Contact ({contactCount})
        </Link>
      </div>

      {/* Tableau complet des leads avec scroll horizontal */}
      <div className="bg-[#151515] border border-[#565A5C]/40 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-[#090909] border-b border-[#565A5C]/30 text-[10px] font-mono text-[#565A5C] uppercase tracking-wider">
                <th className="py-3.5 px-6 font-medium">Adresse Email</th>
                <th className="py-3.5 px-6 font-medium">Prénom</th>
                <th className="py-3.5 px-6 font-medium">Source d’acquisition</th>
                <th className="py-3.5 px-6 font-medium text-right">Date de capture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#565A5C]/20 font-mono text-xs">
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#090909]/40 transition-colors">
                    <td className="py-3.5 px-6 text-[#FFFFFF] font-medium">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#565A5C]" />
                        <span>{lead.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-[#A5A5A0]">
                      {lead.firstName || <span className="text-[#565A5C] italic">—</span>}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EEB149]/10 text-[#EEB149] border border-[#EEB149]/30 text-[10px] font-mono uppercase tracking-wider">
                        <FileText className="w-3 h-3" />
                        {lead.source === 'protocole_du_batisseur'
                          ? 'Protocole du Bâtisseur'
                          : lead.source === 'formulaire_contact'
                          ? 'Formulaire de Contact'
                          : lead.source || 'Autre'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right text-[#565A5C] text-[11px]">
                      <div className="flex items-center justify-end gap-1.5">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(lead.createdAt)}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-xs font-mono text-[#565A5C]">
                    <Shield className="w-6 h-6 mx-auto mb-2 opacity-40 text-[#EEB149]" />
                    Aucun lead trouvé pour ce filtre.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#090909] border-t border-[#565A5C]/30 flex items-center justify-between text-[11px] font-mono text-[#565A5C]">
          <span>Protection des données RGPD active</span>
          <span>Synchronisation automatique Brevo</span>
        </div>
      </div>
    </div>
  );
}
