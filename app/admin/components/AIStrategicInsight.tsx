'use client';

import React, { useState, useEffect } from 'react';
import { generateAIInsight, type AIInsightResult } from '@/lib/ai-actions';
import { Bot, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export function AIStrategicInsight() {
  const [data, setData] = useState<AIInsightResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [displayedLength, setDisplayedLength] = useState<number>(0);

  const fetchInsight = async () => {
    setLoading(true);
    setDisplayedLength(0);
    try {
      const result = await generateAIInsight();
      setData(result);
    } catch {
      setData({
        success: false,
        error: 'Impossible de contacter le service d’analyse.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadInitial() {
      setLoading(true);
      try {
        const result = await generateAIInsight();
        if (isMounted) {
          setData(result);
        }
      } catch {
        if (isMounted) {
          setData({
            success: false,
            error: 'Impossible de contacter le service d’analyse.',
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadInitial();

    return () => {
      isMounted = false;
    };
  }, []);

  // Effet machine à écrire basé sur la longueur du texte
  useEffect(() => {
    const fullText = data?.success ? data.insight || '' : '';
    if (!fullText) return;

    const interval = setInterval(() => {
      setDisplayedLength((prev) => {
        if (prev < fullText.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 12);

    return () => clearInterval(interval);
  }, [data]);

  const displayedText = (data?.insight || '').slice(0, displayedLength);

  return (
    <div className="border border-[#EEB149]/60 bg-[#EEB149]/5 p-6 sm:p-7 shadow-2xl relative transition-all">
      {/* Technical corner indicators */}
      <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#EEB149]" />
      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#EEB149]" />
      <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#EEB149]" />
      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#EEB149]" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 mb-4 border-b border-[#EEB149]/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#090909] border border-[#EEB149] flex items-center justify-center text-[#EEB149] shadow-md shadow-[#EEB149]/10">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#EEB149]">
                RAPPORT STRATÉGIQUE IA
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#EEB149]/20 text-[#EEB149] border border-[#EEB149]/30">
                DIRECTEUR DE STRATÉGIE
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#A5A5A0] tracking-wide block mt-0.5">
              Synthèse d&apos;ingénierie et recommandations décisionnelles (7 derniers jours)
            </span>
          </div>
        </div>

        <button
          onClick={fetchInsight}
          disabled={loading}
          className="px-3.5 py-2 bg-[#090909] border border-[#EEB149]/50 hover:border-[#EEB149] text-xs font-mono text-[#EEB149] hover:text-[#FFFFFF] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Calcul stratégique...' : 'Régénérer l’analyse'}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[110px] flex flex-col justify-center font-mono">
        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="relative">
              <Bot className="w-8 h-8 text-[#EEB149] animate-pulse" />
              <Sparkles className="w-4 h-4 text-[#FFFFFF] absolute -top-1 -right-1 animate-spin" />
            </div>
            <p className="text-xs text-[#EEB149] tracking-wider uppercase">
              Extraction des flux hebdomadaires & calcul décisionnel en cours...
            </p>
          </div>
        ) : data?.success ? (
          <div className="space-y-4">
            <div className="text-xs sm:text-sm text-[#F3F1EB] leading-relaxed whitespace-pre-line tracking-wide">
              {displayedText}
              {displayedText.length < (data.insight?.length || 0) && (
                <span className="inline-block w-2 h-4 bg-[#EEB149] ml-1 animate-pulse align-middle" />
              )}
            </div>

            {data.meta && (
              <div className="pt-3 border-t border-[#EEB149]/15 flex flex-wrap items-center gap-4 text-[10px] text-[#A5A5A0]">
                <span>Période : 7j</span>
                <span>•</span>
                <span>Ventes : {data.meta.ordersCount7d}</span>
                <span>•</span>
                <span>CA : {data.meta.totalRevenue7d} FCFA</span>
                <span>•</span>
                <span>Leads : {data.meta.leadsCount7d}</span>
                <span>•</span>
                <span>Erreurs : {data.meta.errorsCount7d}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-[#090909] border border-red-500/30 text-xs text-red-300 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block uppercase mb-0.5">Notice de configuration IA</span>
              <p className="text-[11px] text-red-200 leading-normal">
                {data?.error || 'Veuillez configurer GEMINI_API_KEY dans votre fichier .env.local.'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#EEB149]/15 flex items-center justify-between text-[10px] font-mono text-[#565A5C]">
        <span>Modèle actif : gemini-3.8-flash</span>
        <span className="text-[#EEB149]/80">Philosophie : L’Acier Bienveillant</span>
      </div>
    </div>
  );
}
