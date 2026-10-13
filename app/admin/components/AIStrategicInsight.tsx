'use client';

import React, { useState } from 'react';
import { generateAIInsight, type AIInsightResult } from '@/lib/ai-actions';
import { Bot, Sparkles, RefreshCw, AlertCircle, Send, Calendar, MessageSquare } from 'lucide-react';

type PeriodOption = '7d' | '30d' | 'year' | 'all';

export function AIStrategicInsight() {
  const [period, setPeriod] = useState<PeriodOption>('7d');
  const [promptInput, setPromptInput] = useState('');
  const [data, setData] = useState<AIInsightResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);

  const handleGenerateReport = async (selectedPeriod: PeriodOption = period) => {
    setLoading(true);
    try {
      const result = await generateAIInsight(selectedPeriod);
      setData(result);
      if (result.success && result.insight) {
        setChatHistory([{ role: 'assistant', text: result.insight }]);
      }
    } catch {
      setData({
        success: false,
        error: 'Impossible de contacter le service d’analyse.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || loading) return;

    const userMsg = promptInput.trim();
    setPromptInput('');
    setLoading(true);

    const newHistory = [...chatHistory, { role: 'user' as const, text: userMsg }];
    setChatHistory(newHistory);

    try {
      const result = await generateAIInsight(period, userMsg);
      if (result.success && result.insight) {
        setChatHistory([...newHistory, { role: 'assistant', text: result.insight }]);
        setData(result);
      } else {
        setChatHistory([
          ...newHistory,
          { role: 'assistant', text: result.error || 'Erreur lors de la génération de la réponse.' },
        ]);
      }
    } catch {
      setChatHistory([
        ...newHistory,
        { role: 'assistant', text: 'Impossible de joindre l’assistant stratégique.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-[#EEB149]/60 bg-[#EEB149]/5 p-6 sm:p-8 shadow-2xl relative transition-all">
      {/* Technical corner indicators */}
      <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#EEB149]" />
      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#EEB149]" />
      <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#EEB149]" />
      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#EEB149]" />

      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 mb-6 border-b border-[#EEB149]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#090909] border border-[#EEB149] flex items-center justify-center text-[#EEB149] shadow-md shadow-[#EEB149]/10">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#EEB149]">
                DIRECTEUR DE STRATÉGIE IA
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#EEB149]/20 text-[#EEB149] border border-[#EEB149]/30">
                ACTIF SUR DEMANDE
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#A5A5A0] tracking-wide block mt-0.5">
              Analyse décisionnelle sur-mesure et discussion interactive connectée au CRM
            </span>
          </div>
        </div>

        {/* Période Selectors & Generate Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-[#090909] border border-[#EEB149]/30 p-1">
            {(
              [
                { id: '7d', label: '7 jours' },
                { id: '30d', label: '30 jours' },
                { id: 'year', label: 'Cette année' },
                { id: 'all', label: 'Tout' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                onClick={() => setPeriod(opt.id)}
                className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                  period === opt.id
                    ? 'bg-[#EEB149] text-[#090909] font-bold'
                    : 'text-[#A5A5A0] hover:text-[#FFFFFF]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleGenerateReport(period)}
            disabled={loading}
            className="px-4 py-2 bg-[#090909] border border-[#EEB149] hover:bg-[#EEB149] hover:text-[#090909] text-xs font-mono text-[#EEB149] font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Générer le rapport</span>
          </button>
        </div>
      </div>

      {/* Chat & Insight Messages Area */}
      <div className="space-y-4 mb-6 max-h-[450px] overflow-y-auto pr-2">
        {chatHistory.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-[#A5A5A0] space-y-3 bg-[#090909]/40 border border-[#EEB149]/20 p-6">
            <Sparkles className="w-8 h-8 text-[#EEB149] mx-auto opacity-60" />
            <p className="text-[#F3F1EB]">
              Le Directeur de Stratégie attend vos instructions ou votre demande de rapport.
            </p>
            <p className="text-[11px] text-[#565A5C]">
              Cliquez sur « Générer le rapport » ci-dessus ou posez une question dans le champ de discussion ci-dessous.
            </p>
          </div>
        ) : (
          chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`p-4 font-mono text-xs leading-relaxed border ${
                msg.role === 'assistant'
                  ? 'bg-[#090909] border-[#EEB149]/40 text-[#F3F1EB]'
                  : 'bg-[#151515] border-[#565A5C]/40 text-[#FFFFFF] ml-8 sm:ml-16'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#565A5C]/20 text-[10px] text-[#EEB149]">
                {msg.role === 'assistant' ? (
                  <>
                    <Bot className="w-3.5 h-3.5" />
                    <span>DIRECTEUR DE STRATÉGIE (KHEOPS SET)</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-3.5 h-3.5 text-[#A5A5A0]" />
                    <span className="text-[#A5A5A0]">VOTRE REQUÊTE</span>
                  </>
                )}
              </div>
              <div className="whitespace-pre-line tracking-wide">{msg.text}</div>
            </div>
          ))
        )}

        {loading && (
          <div className="p-4 bg-[#090909] border border-[#EEB149]/30 text-xs font-mono text-[#EEB149] flex items-center gap-3">
            <Bot className="w-4 h-4 animate-pulse" />
            <span>Analyse des registres et formulation de la stratégie en cours...</span>
          </div>
        )}
      </div>

      {/* Chat Input Form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Posez une question au Directeur de Stratégie (ex: Comment augmenter nos conversions ce mois-ci ?)..."
            className="w-full bg-[#090909] border border-[#EEB149]/40 px-4 py-3 text-xs font-mono text-[#FFFFFF] placeholder:text-[#565A5C] focus:outline-none focus:border-[#EEB149] focus:ring-1 focus:ring-[#EEB149] transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !promptInput.trim()}
          className="px-5 py-3 bg-[#EEB149] hover:bg-[#EEB149]/90 disabled:opacity-50 text-[#090909] font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <span>Envoyer</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      <div className="mt-4 pt-3 border-t border-[#EEB149]/15 flex items-center justify-between text-[10px] font-mono text-[#565A5C]">
        <span>Modèle : gemini-3.8-flash</span>
        <span>Accès direct : Base PostgreSQL & Logs</span>
      </div>
    </div>
  );
}
