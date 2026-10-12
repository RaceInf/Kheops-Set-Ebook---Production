import React from 'react';
import { prisma } from '@/lib/db';
import type { SystemLog } from '@prisma/client';
import { Terminal, AlertTriangle, ShieldAlert, Info, Calendar, RefreshCw } from 'lucide-react';

export const dynamic = 'force-dynamic';

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date));
}

function getLogLevelStyle(level: string) {
  const norm = level.toUpperCase();
  if (norm === 'ERROR') {
    return {
      textColor: 'text-red-500/80',
      badgeBg: 'bg-red-950/40 border-red-500/40 text-red-400',
      icon: ShieldAlert,
    };
  }
  if (norm === 'WARN') {
    return {
      textColor: 'text-yellow-500/80',
      badgeBg: 'bg-yellow-950/40 border-yellow-500/40 text-yellow-400',
      icon: AlertTriangle,
    };
  }
  return {
    textColor: 'text-[#A5A5A0]',
    badgeBg: 'bg-[#151515] border-[#565A5C]/40 text-[#A5A5A0]',
    icon: Info,
  };
}

export default async function AdminLogsPage() {
  let logs: SystemLog[] = [];
  let errorCount = 0;
  let warnCount = 0;
  let infoCount = 0;

  try {
    logs = await prisma.systemLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    logs.forEach((log) => {
      const lvl = log.level.toUpperCase();
      if (lvl === 'ERROR') errorCount++;
      else if (lvl === 'WARN') warnCount++;
      else infoCount++;
    });
  } catch (error) {
    console.error('[Admin Logs Error]:', error);
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#565A5C]/30">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-semibold text-[#EEB149] uppercase tracking-widest flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              CONSOLE D’AUDIT KHEOPS
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF] uppercase">
            TERMINAL DE SÉCURITÉ & LOGS
          </h1>
          <p className="text-xs font-mono text-[#A5A5A0] mt-1">
            Surveillance en temps réel des erreurs applicatives, webhooks Chariow et blocages de sécurité.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 bg-[#151515] border border-red-500/30 text-red-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Erreurs : {errorCount}</span>
          </div>
          <div className="px-3 py-1.5 bg-[#151515] border border-yellow-500/30 text-yellow-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span>Avertissements : {warnCount}</span>
          </div>
          <div className="px-3 py-1.5 bg-[#151515] border border-[#565A5C]/40 text-[#A5A5A0] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#565A5C]" />
            <span>Total : {logs.length}</span>
          </div>
        </div>
      </div>

      {/* Terminal de Logs */}
      <div className="bg-[#090909] border border-[#565A5C]/50 shadow-2xl relative font-mono">
        {/* Barre technique style terminal */}
        <div className="px-4 py-3 bg-[#151515] border-b border-[#565A5C]/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="text-[11px] text-[#A5A5A0] ml-2 tracking-wider">
              syslog@kheops-security:~ (100 derniers événements)
            </span>
          </div>

          <span className="text-[10px] text-[#565A5C] uppercase tracking-wider">
            Audit Trail Actif
          </span>
        </div>

        {/* Liste des Logs */}
        <div className="divide-y divide-[#565A5C]/25 max-h-[700px] overflow-y-auto">
          {logs.length > 0 ? (
            logs.map((log) => {
              const { textColor, badgeBg, icon: Icon } = getLogLevelStyle(log.level);

              let formattedMeta = null;
              if (log.meta) {
                try {
                  const parsed = JSON.parse(log.meta);
                  formattedMeta = JSON.stringify(parsed, null, 2);
                } catch {
                  formattedMeta = log.meta;
                }
              }

              return (
                <div key={log.id} className="p-4 sm:p-5 hover:bg-[#151515]/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider ${badgeBg}`}>
                        <Icon className="w-3 h-3" />
                        {log.level}
                      </span>
                      <span className="text-xs text-[#FFFFFF] font-bold">
                        {log.event}
                      </span>
                    </div>

                    <span className="text-[11px] text-[#565A5C] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(log.createdAt)}
                    </span>
                  </div>

                  <p className={`text-xs ${textColor} break-words leading-relaxed pl-1`}>
                    {log.message}
                  </p>

                  {formattedMeta && (
                    <div className="mt-2.5 pt-2 border-t border-[#565A5C]/15">
                      <span className="text-[9px] uppercase tracking-widest text-[#565A5C] block mb-1">
                        Métadonnées Détectées
                      </span>
                      <pre className="p-2.5 bg-[#151515] border border-[#565A5C]/20 text-[10px] leading-tight text-[#A5A5A0] overflow-x-auto selection:bg-[#EEB149] selection:text-[#090909]">
                        {formattedMeta}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-16 text-center text-xs text-[#565A5C] space-y-2">
              <Terminal className="w-8 h-8 mx-auto opacity-30 text-[#EEB149]" />
              <p>Aucun événement critique ni incident de sécurité enregistré dans le terminal.</p>
              <p className="text-[10px] text-[#565A5C]">
                Les erreurs serveur, webhooks Chariow et rejets Turnstile / HoneyPot apparaîtront automatiquement ici.
              </p>
            </div>
          )}
        </div>

        {/* Footer Terminal */}
        <div className="p-3 bg-[#151515] border-t border-[#565A5C]/40 flex items-center justify-between text-[10px] text-[#565A5C]">
          <span>Protection PII / Données masquées à l’écriture</span>
          <span>Prisma Model : SystemLog</span>
        </div>
      </div>
    </div>
  );
}
