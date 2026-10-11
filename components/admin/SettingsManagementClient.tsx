'use client';

import React, { useState } from 'react';
import type { AdminSiteSettings } from '@/lib/admin/types';
import { Check, Loader2, Save, AlertCircle, Shield } from 'lucide-react';

export function SettingsManagementClient({
  initialSettings,
}: {
  initialSettings: AdminSiteSettings;
}) {
  const [settings, setSettings] = useState<AdminSiteSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleToggle = (key: keyof Omit<AdminSiteSettings, 'updated_at'>) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour des paramètres');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Erreur technique lors de la sauvegarde'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {errorMessage && (
        <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="p-6 bg-[#151515] border border-[#565A5C]/40 space-y-6">
        <div className="pb-4 border-b border-[#565A5C]/35">
          <h2 className="font-display text-base font-bold text-[#FFFFFF]">
            Options Générales & Bascules On/Off
          </h2>
          <p className="font-mono text-xs text-[#A5A5A0]">
            Contrôle des briques applicatives avec validation serveur stricte
          </p>
        </div>

        <div className="space-y-4 font-mono text-xs">
          {/* Option 1: Widget Snap */}
          <div className="p-4 bg-[#090909] border border-[#565A5C]/30 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[#FFFFFF] font-bold">Widget Snap Chariow</span>
              <p className="text-[11px] text-[#A5A5A0]">
                Affiche le terminal de paiement Chariow intégré dans la modale
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('widget_snap_enabled')}
              className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                settings.widget_snap_enabled
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-[#151515] text-[#A5A5A0] border border-[#565A5C]/40'
              }`}
            >
              {settings.widget_snap_enabled ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
            </button>
          </div>

          {/* Option 2: Fallback direct Chariow */}
          <div className="p-4 bg-[#090909] border border-[#565A5C]/30 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[#FFFFFF] font-bold">Lien de Secours Chariow</span>
              <p className="text-[11px] text-[#A5A5A0]">
                Affiche le lien de secours externe « Ouvrir le paiement sur Chariow ↗ » en bas de modale
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('fallback_link_enabled')}
              className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                settings.fallback_link_enabled
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-[#151515] text-[#A5A5A0] border border-[#565A5C]/40'
              }`}
            >
              {settings.fallback_link_enabled ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
            </button>
          </div>

          {/* Option 3: Affichage EUR/USD */}
          <div className="p-4 bg-[#090909] border border-[#565A5C]/30 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[#FFFFFF] font-bold">Conversions EUR & USD</span>
              <p className="text-[11px] text-[#A5A5A0]">
                Permet aux visiteurs de basculer sur les estimations indicatives EUR et USD
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('eur_usd_display_enabled')}
              className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                settings.eur_usd_display_enabled
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-[#151515] text-[#A5A5A0] border border-[#565A5C]/40'
              }`}
            >
              {settings.eur_usd_display_enabled ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
            </button>
          </div>

          {/* Option 4: Tracking GA4 */}
          <div className="p-4 bg-[#090909] border border-[#565A5C]/30 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[#FFFFFF] font-bold">Télémétrie GA4 (cta_click)</span>
              <p className="text-[11px] text-[#A5A5A0]">
                Émet un événement unique GA4 à chaque interaction avec un CTA d’achat
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('ga4_tracking_enabled')}
              className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                settings.ga4_tracking_enabled
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-[#151515] text-[#A5A5A0] border border-[#565A5C]/40'
              }`}
            >
              {settings.ga4_tracking_enabled ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
            </button>
          </div>

          {/* Option 5: Notifications Brevo */}
          <div className="p-4 bg-[#090909] border border-[#565A5C]/30 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[#FFFFFF] font-bold">Notifications Email Brevo</span>
              <p className="text-[11px] text-[#A5A5A0]">
                Envoi des notifications transactionnelles lors de la validation d’une commande
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('brevo_notifications_enabled')}
              className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                settings.brevo_notifications_enabled
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-[#151515] text-[#A5A5A0] border border-[#565A5C]/40'
              }`}
            >
              {settings.brevo_notifications_enabled ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-[#565A5C]/30 flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#A5A5A0]">
            Dernière mise à jour : {new Date(settings.updated_at).toLocaleString('fr-FR')}
          </span>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#EEB149] text-[#090909] font-mono text-xs font-bold hover:bg-[#FFFFFF] transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>ENREGISTREMENT...</span>
              </>
            ) : success ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>PARAMÈTRES MIS À JOUR</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>APPLIQUER LES PARAMÈTRES</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
