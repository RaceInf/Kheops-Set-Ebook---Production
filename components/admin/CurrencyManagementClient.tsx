'use client';

import React, { useState } from 'react';
import type { ExchangeRatesPayload } from '@/lib/currency-rates';
import { RefreshCw, CheckCircle2, Loader2, Coins, AlertCircle } from 'lucide-react';

export function CurrencyManagementClient({
  initialRates,
}: {
  initialRates: ExchangeRatesPayload;
}) {
  const [ratesData, setRatesData] = useState<ExchangeRatesPayload>(initialRates);
  const [refreshing, setRefreshing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/currencies/refresh', {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Échec de la récupération des taux en direct');
      }

      const data = await res.json();
      if (data?.rates) {
        setRatesData(data.rates);
        setSuccessMessage('Taux Frankfurter actualisés avec succès');
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Erreur lors de l’actualisation des taux'
      );
    } finally {
      setRefreshing(false);
    }
  };

  const eurRatePerXaf = ratesData.rates.EUR;
  const usdRatePerXaf = ratesData.rates.USD;

  return (
    <div className="space-y-6 max-w-4xl">
      {successMessage && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Règle intangible */}
      <div className="p-5 bg-[#151515] border border-[#565A5C]/40 space-y-2">
        <div className="flex items-center gap-2 text-[#EEB149]">
          <Coins className="w-4 h-4" />
          <h2 className="font-mono text-xs uppercase font-bold tracking-wider">
            RÈGLE DE PRIX SOURCE
          </h2>
        </div>
        <p className="text-xs text-[#F3F1EB] leading-relaxed">
          Le prix <strong>XAF (FCFA)</strong> est l’unique source de vérité officielle.
          Les prix <strong>EUR</strong> et <strong>USD</strong> sont des conversions purement indicatives
          mises à jour quotidiennement via l’API open-source Frankfurter. Le prix XAF n’est jamais
          altéré par les fluctuations du marché.
        </p>
      </div>

      {/* Carte des taux actuels */}
      <div className="p-6 bg-[#151515] border border-[#565A5C]/40 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#565A5C]/30">
          <div className="space-y-0.5">
            <h3 className="font-display text-base font-bold text-[#FFFFFF]">
              Taux de Change Frankfurter Actifs
            </h3>
            <p className="font-mono text-xs text-[#A5A5A0]">
              Source : <strong className="text-[#EEB149] uppercase">{ratesData.source}</strong> · Date marché :{' '}
              <strong>{ratesData.market.date || 'Live'}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#090909] border border-[#EEB149]/50 hover:bg-[#EEB149] hover:text-[#090909] text-[#EEB149] font-mono text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            {refreshing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>FORCER L’ACTUALISATION</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 bg-[#090909] border border-[#565A5C]/30 space-y-1">
            <span className="text-[#A5A5A0] text-[11px]">1 EUR en XAF (Fixe / Marché)</span>
            <p className="text-base font-bold text-[#FFFFFF]">
              {ratesData.market.EUR_TO_XAF} FCFA
            </p>
            <p className="text-[10px] text-[#A5A5A0]">Parité Zone Franc</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#565A5C]/30 space-y-1">
            <span className="text-[#A5A5A0] text-[11px]">1 EUR en USD</span>
            <p className="text-base font-bold text-[#FFFFFF]">
              $ {ratesData.market.EUR_TO_USD}
            </p>
            <p className="text-[10px] text-[#A5A5A0]">Cours Frankfurter</p>
          </div>

          <div className="p-4 bg-[#090909] border border-[#565A5C]/30 space-y-1">
            <span className="text-[#A5A5A0] text-[11px]">1 XAF en EUR</span>
            <p className="text-base font-bold text-[#EEB149]">
              {eurRatePerXaf.toFixed(6)} €
            </p>
            <p className="text-[10px] text-[#A5A5A0]">Facteur de conversion</p>
          </div>
        </div>

        {/* Exemples de conversion en direct */}
        <div className="space-y-3 pt-2 border-t border-[#565A5C]/30">
          <h4 className="font-mono text-xs font-bold text-[#A5A5A0] uppercase">
            Simulations sur les Manuels Actifs
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 bg-[#090909] border border-[#565A5C]/25 space-y-1">
              <span className="text-[#FFFFFF] font-bold">Le Capital du Bâtisseur (7 990 FCFA)</span>
              <div className="flex items-center gap-3 text-[#EEB149]">
                <span>≈ {(7990 * eurRatePerXaf).toFixed(2)} €</span>
                <span>≈ ${(7990 * usdRatePerXaf).toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 bg-[#090909] border border-[#565A5C]/25 space-y-1">
              <span className="text-[#FFFFFF] font-bold">Le Code du Bâtisseur (3 995 FCFA)</span>
              <div className="flex items-center gap-3 text-[#EEB149]">
                <span>≈ {(3995 * eurRatePerXaf).toFixed(2)} €</span>
                <span>≈ ${(3995 * usdRatePerXaf).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
