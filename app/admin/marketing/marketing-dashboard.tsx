'use client';

import React, { useState, useTransition } from 'react';
import {
  Send,
  Mail,
  Users,
  Eye,
  MousePointerClick,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Clock,
} from 'lucide-react';
import type { BrevoMarketingStats } from '@/lib/brevo';
import { triggerManualRelanceAction } from '@/lib/marketing-actions';

interface MarketingDashboardProps {
  initialStats: BrevoMarketingStats;
}

const TEMPLATES: Record<string, { subject: string; message: string; ctaText: string }> = {
  protocol_non_buyers: {
    subject: 'KHEOPS SET · As-tu commencé à boucher les fuites ?',
    message: `Tu as téléchargé Le Protocole d’Isolation il y a quelques jours.

Ce document est un pare-feu d'urgence. Il stoppe l'hémorragie de ton temps et de ton énergie.

Mais stopper les fuites ne suffit pas pour bâtir.

Une vie solide a besoin d'un plan financier clair et de décisions répétées :
1. Regarder tes comptes sans complaisance.
2. Éliminer le paraître qui te vide.
3. Poser des limites strictes à ceux qui consomment ton avenir.

Le Capital du Bâtisseur contient le plan complet pour transformer tes revenus en socle inébranlable.

Passe à l'exécution.`,
    ctaText: 'PRENDRE LE PLAN DU BÂTISSEUR',
  },
  capital_buyers: {
    subject: 'KHEOPS SET · L’étape suivante de ton chantier personnel',
    message: `Tu as investi dans Le Capital du Bâtisseur. Tes fondations financières sont en train de se stabiliser.

Maintenant, la question n'est plus ton argent : c'est ta posture quotidienne et ta capacité à tenir sur 5, 10 ou 20 ans sans dévier.

Le Code du Bâtisseur aborde la discipline intérieure, le refus de la dispersion et la construction d'une autorité calme.

Si tes fondations sont prêtes, pose la structure.`,
    ctaText: 'DÉCOUVRIR LE CODE DU BÂTISSEUR',
  },
  all_protocol_leads: {
    subject: 'KHEOPS SET · Rappel d’ingénierie : Les excuses expliquent, les actes changent',
    message: `Le bruit du monde te pousse à attendre un moment parfait.

Ce moment n'arrivera pas.

Ceux qui bâtissent ne sont ni plus motivés, ni plus chanceux : ils ont simplement un protocole fermé et ils l'exécutent chaque semaine, peu importe l'humeur.

Protège ton temps aujourd'hui. Fais une décision concrète.`,
    ctaText: 'CONSULTER LES OUTILS KHEOPS',
  },
};

export function MarketingDashboard({ initialStats }: MarketingDashboardProps) {
  const [stats] = useState<BrevoMarketingStats>(initialStats);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [segment, setSegment] = useState<string>('protocol_non_buyers');
  const [subject, setSubject] = useState<string>(TEMPLATES.protocol_non_buyers.subject);
  const [message, setMessage] = useState<string>(TEMPLATES.protocol_non_buyers.message);
  const [ctaText, setCtaText] = useState<string>(TEMPLATES.protocol_non_buyers.ctaText);
  const [ctaUrl, setCtaUrl] = useState<string>('');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSending, startSendTransition] = useTransition();

  const handleSegmentChange = (newSegment: string) => {
    setSegment(newSegment);
    if (TEMPLATES[newSegment]) {
      setSubject(TEMPLATES[newSegment].subject);
      setMessage(TEMPLATES[newSegment].message);
      setCtaText(TEMPLATES[newSegment].ctaText);
    }
  };

  const handleSendCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    startSendTransition(async () => {
      const res = await triggerManualRelanceAction({
        segment,
        subject,
        message,
        ctaText,
        ctaUrl: ctaUrl.trim() || undefined,
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          text: res.message || 'Campagne envoyée avec succès.',
        });
        setTimeout(() => {
          setIsModalOpen(false);
          setFeedback(null);
        }, 3000);
      } else {
        setFeedback({
          type: 'error',
          text: res.error || 'Erreur lors de l’envoi de la relance.',
        });
      }
    });
  };

  return (
    <div className="space-y-8 font-mono">
      {/* 4 KPIs Globaux */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 : Emails Envoyés */}
        <div className="bg-[#151515] border border-[#565A5C]/40 p-5 shadow-lg relative group hover:border-[#EEB149]/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-wider text-[#A5A5A0]">
              Emails Délivrés (30j)
            </span>
            <div className="w-8 h-8 bg-[#090909] border border-[#565A5C]/40 flex items-center justify-center text-[#EEB149]">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <span className="font-mono text-3xl font-bold text-[#FFFFFF]">
            {stats.totalDelivered.toLocaleString('fr-FR')}
          </span>
          <span className="text-[11px] text-[#565A5C] mt-1 block">
            Via Brevo Transactional SMTP
          </span>
        </div>

        {/* KPI 2 : Taux d'Ouverture */}
        <div className="bg-[#151515] border border-[#565A5C]/40 p-5 shadow-lg relative group hover:border-emerald-500/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-wider text-[#A5A5A0]">
              Taux d’Ouverture
            </span>
            <div className="w-8 h-8 bg-[#090909] border border-[#565A5C]/40 flex items-center justify-center text-emerald-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <span className="font-mono text-3xl font-bold text-emerald-400">
            {stats.openRate}
          </span>
          <span className="text-[11px] text-[#565A5C] mt-1 block">
            {stats.uniqueOpens} ouvertures uniques
          </span>
        </div>

        {/* KPI 3 : Taux de Clic */}
        <div className="bg-[#151515] border border-[#565A5C]/40 p-5 shadow-lg relative group hover:border-[#EEB149]/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-wider text-[#A5A5A0]">
              Taux de Clic (CTR)
            </span>
            <div className="w-8 h-8 bg-[#090909] border border-[#565A5C]/40 flex items-center justify-center text-[#EEB149]">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <span className="font-mono text-3xl font-bold text-[#EEB149]">
            {stats.clickRate}
          </span>
          <span className="text-[11px] text-[#565A5C] mt-1 block">
            {stats.uniqueClicks} clics enregistrés
          </span>
        </div>

        {/* KPI 4 : Audience Totale */}
        <div className="bg-[#151515] border border-[#565A5C]/40 p-5 shadow-lg relative group hover:border-[#FFFFFF]/40 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-wider text-[#A5A5A0]">
              Audience Totale
            </span>
            <div className="w-8 h-8 bg-[#090909] border border-[#565A5C]/40 flex items-center justify-center text-[#FFFFFF]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="font-mono text-3xl font-bold text-[#FFFFFF]">
            {stats.totalAudience.toLocaleString('fr-FR')}
          </span>
          <span className="text-[11px] text-[#565A5C] mt-1 block">
            Contacts dans les 4 listes
          </span>
        </div>
      </div>

      {/* Bannière Action : Envoyer une relance manuelle */}
      <div className="bg-[#151515] border border-[#EEB149]/40 p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-2xl relative">
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#EEB149]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#EEB149]" />

        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#EEB149]/10 text-[#EEB149] border border-[#EEB149]/30 text-[10px] uppercase tracking-widest font-bold">
              ACTIONS MARKETING
            </span>
            <span className="text-xs text-[#A5A5A0]">· Segmentations & Campagnes</span>
          </div>
          <h2 className="font-display text-lg sm:text-xl font-bold uppercase text-[#FFFFFF] tracking-tight">
            Envoyer un email de relance manuel
          </h2>
          <p className="text-xs text-[#A5A5A0] leading-relaxed">
            Rédige et déclenche un message direct aux prospects du Protocole qui n&apos;ont pas encore acheté Le Capital, ou adresse une note aux acheteurs existants.
          </p>
        </div>

        <button
          onClick={() => {
            setFeedback(null);
            setIsModalOpen(true);
          }}
          className="px-6 py-3.5 bg-[#EEB149] hover:bg-[#EEB149]/90 text-[#090909] text-xs uppercase tracking-wider font-bold inline-flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>Envoyer une relance</span>
        </button>
      </div>

      {/* Cartes des 4 Listes Brevo & Répartition */}
      <div>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#565A5C]/30">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#EEB149]" />
            <h3 className="font-display text-sm font-bold uppercase text-[#FFFFFF] tracking-tight">
              État des 4 Listes de Diffusion Brevo
            </h3>
          </div>
          <span className="text-[11px] text-[#565A5C] uppercase">
            Synchronisation Brevo v3 & Prisma
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(stats.lists).map(([key, list]) => (
            <div
              key={key}
              className="bg-[#151515] border border-[#565A5C]/40 p-5 flex flex-col justify-between hover:border-[#EEB149]/40 transition-colors shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">
                    {list.name}
                  </h4>
                  <span className="font-mono text-lg font-bold text-[#EEB149]">
                    {list.count} contact{list.count > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-[11px] text-[#A5A5A0] leading-relaxed mb-4">
                  {list.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#565A5C]/20 flex items-center justify-between text-[10px] text-[#565A5C]">
                <span>Brevo List ID : {list.id ? `#${list.id}` : 'Non configuré'}</span>
                <span className="text-emerald-400">Actif</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODALE D'ENVOI DE RELANCE MANUELLE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#151515] border border-[#EEB149] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8">
            {/* Technical markers */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#EEB149]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#EEB149]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#EEB149]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#EEB149]" />

            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#565A5C]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#090909] border border-[#EEB149] flex items-center justify-center text-[#EEB149]">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold uppercase text-[#FFFFFF]">
                    Nouvelle Relance Marketing
                  </h3>
                  <span className="text-[10px] text-[#A5A5A0] uppercase block">
                    Envoi via Brevo Transactional SMTP
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#A5A5A0] hover:text-[#FFFFFF] p-1.5 transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div
                className={`mb-6 p-4 border text-xs flex items-center gap-2.5 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-red-950/40 border-red-500/50 text-red-300'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{feedback.text}</span>
              </div>
            )}

            <form onSubmit={handleSendCampaign} className="space-y-5 text-xs">
              {/* Choix du segment */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A5A5A0] mb-2">
                  Segment de Destinataires
                </label>
                <select
                  value={segment}
                  onChange={(e) => handleSegmentChange(e.target.value)}
                  className="w-full bg-[#090909] border border-[#565A5C]/40 px-3 py-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#EEB149] transition-colors"
                >
                  <option value="protocol_non_buyers">
                    Leads Protocole n’ayant pas encore acheté (Recommandé)
                  </option>
                  <option value="all_protocol_leads">
                    Tous les inscrits au Protocole du Bâtisseur
                  </option>
                  <option value="capital_buyers">
                    Acheteurs du Capital du Bâtisseur (Upsell Le Code)
                  </option>
                  <option value="code_buyers">
                    Acheteurs du Code du Bâtisseur
                  </option>
                  <option value="all_contacts">
                    Tous les contacts enregistrés (Leads + Clients)
                  </option>
                </select>
                <span className="text-[10px] text-[#565A5C] mt-1 block">
                  Filtrage automatique contre les doublons et les acheteurs selon le segment choisi.
                </span>
              </div>

              {/* Objet */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A5A5A0] mb-2">
                  Objet de l’email
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="KHEOPS SET · Objet de la relance"
                  className="w-full bg-[#090909] border border-[#565A5C]/40 px-3 py-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#EEB149] transition-colors"
                />
              </div>

              {/* Corps du message */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A5A5A0] mb-2">
                  Corps du message (Format sobre Kheops Set)
                </label>
                <textarea
                  rows={8}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écris ton message ici. Chaque paragraphe sera mis en forme selon la charte L’Acier Bienveillant..."
                  className="w-full bg-[#090909] border border-[#565A5C]/40 p-3 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#EEB149] transition-colors leading-relaxed font-mono resize-y"
                />
              </div>

              {/* Paramètres CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A5A5A0] mb-1.5">
                    Texte du Bouton CTA
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="PRENDRE LE PLAN DU BÂTISSEUR"
                    className="w-full bg-[#090909] border border-[#565A5C]/40 px-3 py-2 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#EEB149] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A5A5A0] mb-1.5">
                    URL de Redirection (Optionnel)
                  </label>
                  <input
                    type="text"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="https://... ou /ebooks/le-capital-du-batisseur"
                    className="w-full bg-[#090909] border border-[#565A5C]/40 px-3 py-2 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#EEB149] transition-colors"
                  />
                </div>
              </div>

              {/* Footer Modal Actions */}
              <div className="pt-4 border-t border-[#565A5C]/30 flex items-center justify-between">
                <span className="text-[10px] text-[#565A5C]">
                  Gabarit responsive sombre & or automatique
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSending}
                    className="px-4 py-2 text-xs text-[#A5A5A0] hover:text-[#FFFFFF] uppercase tracking-wider cursor-pointer"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-6 py-2.5 bg-[#EEB149] hover:bg-[#EEB149]/90 disabled:opacity-50 text-[#090909] text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-bounce' : ''}`} />
                    <span>{isSending ? 'Envoi en cours...' : 'Envoyer la relance'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
