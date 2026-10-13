import React from 'react';
import { getGlobalSettings } from '@/lib/settings-actions';
import { SettingsForm } from './settings-form';
import { Settings, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await getGlobalSettings();

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#565A5C]/30">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-semibold text-[#EEB149] uppercase tracking-widest flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              CONFIGURATION DU SYSTÈME
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF] uppercase">
            PARAMÈTRES GLOBAUX
          </h1>
          <p className="text-xs font-mono text-[#A5A5A0] mt-1">
            Gestion du mode maintenance et configuration de la bannière d&apos;annonce publique.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-[#151515] border border-[#565A5C]/40 text-xs font-mono flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#EEB149]" />
            <span className="text-[#F3F1EB]">
              Accès Super-Administrateur
            </span>
          </div>
        </div>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
