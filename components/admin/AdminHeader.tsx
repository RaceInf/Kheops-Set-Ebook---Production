'use client';

import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export function AdminHeader({
  emailMasked,
  title,
  subtitle,
}: {
  emailMasked: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="h-16 px-6 sm:px-8 border-b border-[#565A5C]/40 bg-[#151515] flex items-center justify-between shrink-0">
      <div className="space-y-0.5">
        <h1 className="font-display text-base sm:text-lg font-bold text-[#FFFFFF] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="font-mono text-[11px] text-[#A5A5A0]">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#090909] border border-[#565A5C]/40 text-[#A5A5A0] font-mono text-[11px]">
          <Lock className="w-3 h-3 text-[#EEB149]" />
          <span>SESSION SÉCURISÉE (8H)</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-[#090909] border border-[#EEB149]/40 text-[#EEB149] font-mono text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="truncate max-w-[140px] sm:max-w-xs">{emailMasked}</span>
        </div>
      </div>
    </header>
  );
}
