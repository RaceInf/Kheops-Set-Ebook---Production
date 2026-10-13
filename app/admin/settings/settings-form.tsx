'use client';

import React, { useState, useActionState } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Megaphone,
  Hammer,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { updateGlobalSettingsAction, type GlobalSettingsData } from '@/lib/settings-actions';

interface SettingsFormProps {
  initialSettings: GlobalSettingsData;
}

const initialFormState: { success?: boolean; error?: string } = {};

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [maintenanceMode, setMaintenanceMode] = useState(initialSettings.maintenanceMode);
  const [bannerActive, setBannerActive] = useState(initialSettings.announcementBannerActive);
  const [bannerText, setBannerText] = useState(initialSettings.announcementBannerText || '');
  const [bannerLink, setBannerLink] = useState(initialSettings.announcementBannerLink || '');

  const [state, formAction, isPending] = useActionState(updateGlobalSettingsAction, initialFormState);

  return (
    <form action={formAction} className="space-y-8 font-mono">
      {state.success && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Paramètres globaux sauvegardés et caches revalidés instantanément.</span>
        </div>
      )}

      {state.error && (
        <div className="p-4 bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* 1. SECTION MODE MAINTENANCE */}
      <div className="bg-[#151515] border border-[#565A5C]/40 p-6 sm:p-8 shadow-xl relative">
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#EEB149]" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 mb-5 border-b border-[#565A5C]/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#090909] border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Hammer className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-[#FFFFFF] uppercase tracking-tight">
                Mode Maintenance du Chantier
              </h2>
              <span className="text-[11px] text-[#A5A5A0] tracking-wide block">
                Verrouille l&apos;accès au site public pour des opérations de mise à niveau
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#090909] peer-focus:outline-none border border-[#565A5C] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#A5A5A0] peer-checked:after:bg-[#090909] peer-checked:bg-amber-500 after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        <div className="space-y-3 text-xs text-[#A5A5A0]">
          <div className="p-3 bg-[#090909] border border-[#565A5C]/30 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Lorsque le mode maintenance est <span className="text-[#FFFFFF] font-bold">ACTIF</span>, les visiteurs publics sont redirigés vers l&apos;écran de maintenance sobre Kheops Set. Les administrateurs connectés continuent d&apos;accéder librement au site et au Dashboard.
            </p>
          </div>

          {maintenanceMode && (
            <div className="p-3 bg-amber-950/30 border border-amber-500/40 text-amber-200 text-[11px] flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">ATTENTION : Le mode maintenance sera actif après enregistrement.</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. SECTION BANNIÈRE D'ANNONCE GLOBALE */}
      <div className="bg-[#151515] border border-[#565A5C]/40 p-6 sm:p-8 shadow-xl relative">
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#EEB149]" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 mb-5 border-b border-[#565A5C]/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#090909] border border-[#EEB149]/40 flex items-center justify-center text-[#EEB149]">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-[#FFFFFF] uppercase tracking-tight">
                Bannière d&apos;Annonce Globale
              </h2>
              <span className="text-[11px] text-[#A5A5A0] tracking-wide block">
                Message d&apos;impact affiché tout en haut du site public (promotions, nouveautés)
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="announcementBannerActive"
              checked={bannerActive}
              onChange={(e) => setBannerActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#090909] peer-focus:outline-none border border-[#565A5C] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#A5A5A0] peer-checked:after:bg-[#090909] peer-checked:bg-[#EEB149] after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        <div className="space-y-5 text-xs">
          {/* Texte de la bannière */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A5A5A0] mb-2">
              Texte de l&apos;Annonce
            </label>
            <input
              type="text"
              name="announcementBannerText"
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              placeholder="Ex : OFFRE EXCEPTIONNELLE · -50% sur Le Capital du Bâtisseur cette semaine"
              className="w-full bg-[#090909] border border-[#565A5C]/40 px-3.5 py-3 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#EEB149] transition-colors"
            />
          </div>

          {/* Lien de redirection */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A5A5A0] mb-2">
              Lien de Redirection (Optionnel)
            </label>
            <input
              type="text"
              name="announcementBannerLink"
              value={bannerLink}
              onChange={(e) => setBannerLink(e.target.value)}
              placeholder="Ex : /ebooks/le-capital-du-batisseur"
              className="w-full bg-[#090909] border border-[#565A5C]/40 px-3.5 py-3 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#EEB149] transition-colors"
            />
          </div>

          {/* Prévisualisation en direct */}
          {bannerActive && (
            <div className="space-y-2 pt-2">
              <span className="text-[10px] text-[#565A5C] uppercase tracking-wider block">
                Aperçu en direct sur le site :
              </span>
              <div className="p-3 bg-[#EEB149] text-[#090909] font-bold text-center text-xs flex items-center justify-center gap-2 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{bannerText || 'Texte de votre annonce...'}</span>
                {bannerLink && <ExternalLink className="w-3 h-3 shrink-0 ml-1" />}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bouton de sauvegarde */}
      <div className="flex items-center justify-end pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3.5 bg-[#EEB149] hover:bg-[#EEB149]/90 disabled:opacity-50 text-[#090909] text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-xl"
        >
          <Save className="w-4 h-4" />
          <span>{isPending ? 'Enregistrement...' : 'Enregistrer les paramètres'}</span>
        </button>
      </div>
    </form>
  );
}
