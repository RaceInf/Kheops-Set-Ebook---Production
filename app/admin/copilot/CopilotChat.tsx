'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import Markdown from 'react-markdown';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Database,
  Terminal,
  RotateCcw,
  StopCircle,
} from 'lucide-react';
import { DateRangePicker, type DateRangeState } from './DateRangePicker';
import { subDays } from 'date-fns';

const QUICK_PROMPTS = [
  "Quel est le chiffre d'affaires total et le volume des ventes ?",
  "Quelle est la répartition des leads par source d'acquisition ?",
  "Quels sont les ebooks les plus vendus sur la période ?",
  "Y a-t-il eu des erreurs critiques ou des logs suspects ?",
];

export function CopilotChat() {
  const [dateRange, setDateRange] = useState<DateRangeState>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Configuration du transport HTTP vers notre API route
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/admin/chat',
        body: {
          dateRange: {
            from: dateRange.from ? dateRange.from.toISOString() : undefined,
            to: dateRange.to ? dateRange.to.toISOString() : undefined,
          },
        },
      }),
    [dateRange.from, dateRange.to]
  );

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport,
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Scroll automatique fluide vers le bas lors de la réception des tokens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || isLoading) return;

    setInput('');
    await sendMessage(
      { text: query },
      {
        body: {
          dateRange: {
            from: dateRange.from ? dateRange.from.toISOString() : undefined,
            to: dateRange.to ? dateRange.to.toISOString() : undefined,
          },
        },
      }
    );
  };

  const handleQuickPrompt = async (prompt: string) => {
    if (isLoading) return;
    setInput('');
    await sendMessage(
      { text: prompt },
      {
        body: {
          dateRange: {
            from: dateRange.from ? dateRange.from.toISOString() : undefined,
            to: dateRange.to ? dateRange.to.toISOString() : undefined,
          },
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] bg-[#090909] font-mono border border-[#565A5C]/40 relative">
      {/* 1. Barre d'outils supérieure : Titre et Sélecteur de Dates global */}
      <div className="p-3 sm:p-4 bg-[#151515] border-b border-[#565A5C]/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#090909] border border-[#EEB149]/40 flex items-center justify-center text-[#EEB149]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
                COPILOTE DATA ANALYST
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[10px] text-[#A5A5A0]">
              Moteur Gemini chirurgical connecté à PostgreSQL (Orders, Leads, Logs)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="p-2 bg-[#090909] hover:bg-[#151515] border border-[#565A5C]/40 text-[#A5A5A0] hover:text-[#FFFFFF] transition-colors cursor-pointer"
              title="Effacer la conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Zone d'affichage des messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center max-w-xl mx-auto text-center space-y-6 py-12">
            <div className="w-14 h-14 bg-[#151515] border border-[#EEB149]/40 flex items-center justify-center text-[#EEB149] shadow-xl">
              <Terminal className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] text-[#EEB149] uppercase tracking-widest font-bold">
                KHEOPS SET &middot; ACIER BIENVEILLANT
              </span>
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#FFFFFF] tracking-tight uppercase">
                Terminal en ligne. Quelle période et quelle donnée souhaitez-vous analyser ?
              </h2>
              <p className="text-xs text-[#A5A5A0] max-w-md mx-auto leading-relaxed">
                Posez vos questions sur le chiffre d&apos;affaires, les commandes, les leads ou les logs système. Les requêtes sont exécutées directement sur vos tables réelles.
              </p>
            </div>

            {/* Suggestions de requêtes rapides */}
            <div className="w-full space-y-2 pt-2">
              <span className="text-[10px] text-[#565A5C] uppercase tracking-wider block">
                Exemples de requêtes directes :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="p-3 bg-[#151515] hover:bg-[#151515]/80 border border-[#565A5C]/40 hover:border-[#EEB149] text-xs text-[#F3F1EB] transition-all text-left group flex items-start gap-2 cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#EEB149] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="leading-snug">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isUser = message.role === 'user';
            const textContent = message.parts
              ? message.parts
                  .filter((p) => p.type === 'text')
                  .map((p) => (p as { text: string }).text)
                  .join('')
              : (message as unknown as { content?: string }).content || '';

            const isCallingTools =
              !isUser &&
              message.parts?.some(
                (p) =>
                  p.type === 'tool-invocation' ||
                  p.type === 'dynamic-tool' ||
                  (p as { type: string }).type?.startsWith('tool-')
              );

            return (
              <div
                key={message.id}
                className={`flex gap-3 max-w-4xl ${
                  isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'
                }`}
              >
                {!isUser && (
                  <div className="w-7 h-7 shrink-0 bg-[#151515] border border-[#EEB149]/50 flex items-center justify-center text-[#EEB149] mt-1 shadow">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`relative p-4 sm:p-5 text-xs ${
                    isUser
                      ? 'bg-[#151515] border border-[#565A5C] text-[#FFFFFF] shadow-lg max-w-xl'
                      : 'bg-transparent text-[#F3F1EB] flex-1 leading-relaxed'
                  }`}
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap">{textContent}</div>
                  ) : (
                    <div className="space-y-3">
                      {/* Indicateur d'outil si l'IA a exécuté une requête Prisma */}
                      {isCallingTools && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EEB149]/10 border border-[#EEB149]/30 text-[#EEB149] text-[10px] uppercase font-bold mb-2">
                          <Database className="w-3 h-3" />
                          <span>Requête base de données exécutée</span>
                        </div>
                      )}

                      <div className="markdown-body prose prose-invert max-w-none text-xs text-[#F3F1EB] space-y-2 [&_p]:leading-relaxed [&_strong]:text-[#EEB149] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_table]:border-collapse [&_table]:border [&_table]:border-[#565A5C]/40 [&_th]:border [&_th]:border-[#565A5C]/40 [&_th]:p-2 [&_th]:text-[#EEB149] [&_th]:bg-[#151515] [&_td]:border [&_td]:border-[#565A5C]/40 [&_td]:p-2 [&_code]:bg-[#151515] [&_code]:text-[#EEB149] [&_code]:px-1.5 [&_code]:py-0.5">
                        <Markdown>{textContent}</Markdown>
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 shrink-0 bg-[#090909] border border-[#565A5C]/50 flex items-center justify-center text-[#A5A5A0] mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loader discret lors de l'appel d'outil ou du streaming */}
        {isLoading && (
          <div className="flex items-center gap-3 text-xs text-[#EEB149] pl-10 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span className="font-bold uppercase tracking-wider text-[11px]">
              Analyse des données en cours...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Zone de saisie épinglée en bas */}
      <div className="p-3 sm:p-4 bg-[#151515] border-t border-[#565A5C]/40 shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-5xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Interrogez le Copilote (ex: Quel est le volume de vente du Capital sur la période ?)..."
              disabled={isLoading}
              className="w-full bg-[#090909] border border-[#565A5C]/50 px-4 py-3 text-xs text-[#FFFFFF] placeholder:text-[#565A5C] focus:outline-none focus:border-[#EEB149] resize-none leading-relaxed transition-colors disabled:opacity-50"
            />
          </div>

          {isLoading ? (
            <button
              type="button"
              onClick={() => stop()}
              className="p-3 bg-red-950/60 hover:bg-red-900 border border-red-500/50 text-red-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              title="Interrompre la réponse"
            >
              <StopCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Arrêter</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-3 bg-[#EEB149] hover:bg-[#EEB149]/90 disabled:opacity-40 disabled:cursor-not-allowed text-[#090909] text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-lg"
              title="Envoyer la requête"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Analyser</span>
            </button>
          )}
        </form>

        <div className="flex items-center justify-between text-[10px] text-[#565A5C] mt-2 max-w-5xl mx-auto px-1">
          <span>Touche Entrée pour envoyer &middot; Shift+Entrée pour saut de ligne</span>
          <span>Données cryptées &middot; Aucune inférence externe</span>
        </div>
      </div>
    </div>
  );
}
