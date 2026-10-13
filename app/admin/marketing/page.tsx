import React from 'react';
import { getBrevoMarketingStats } from '@/lib/brevo';
import { MarketingDashboard } from './marketing-dashboard';
import { Send, Mail, AlertCircle, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminMarketingPage() {
  const stats = await getBrevoMarketingStats();

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#565A5C]/30">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-semibold text-[#EEB149] uppercase tracking-widest flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              CAMPAGNES & RELANCES EMAIL
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF] uppercase">
            MARKETING & AUDIENCE BREVO
          </h1>
          <p className="text-xs font-mono text-[#A5A5A0] mt-1">
            Pilotage des flux d&apos;emails, suivi des 4 listes stratégiques et déclenchement de relances manuelles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-[#151515] border border-[#565A5C]/40 text-xs font-mono flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                stats.isConfigured ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="text-[#F3F1EB]">
              {stats.isConfigured ? 'Brevo v3 API : Connecté' : 'Brevo : Clé API en attente'}
            </span>
          </div>
        </div>
      </div>

      {!stats.isConfigured && (
        <div className="bg-[#151515] border border-amber-500/40 p-5 font-mono text-xs text-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider block text-amber-300">
              Notice d&apos;intégration Brevo
            </span>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              Pour synchroniser en temps réel les taux d&apos;ouverture, taux de clics et expédier des emails transactionnels depuis ce dashboard, assurez-vous d&apos;avoir renseigné <code className="text-[#EEB149]">BREVO_API_KEY</code> et <code className="text-[#EEB149]">BREVO_SENDER_EMAIL</code> dans votre fichier <span className="text-[#FFFFFF] underline">.env.local</span>.
            </p>
          </div>
        </div>
      )}

      <MarketingDashboard initialStats={stats} />
    </div>
  );
}
