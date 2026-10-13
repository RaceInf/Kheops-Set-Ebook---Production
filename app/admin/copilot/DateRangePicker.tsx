'use client';

import React, { useState } from 'react';
import { Calendar, ChevronDown, Clock } from 'lucide-react';
import { format, subDays, startOfYear } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface DateRangeState {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangePickerProps {
  value: DateRangeState;
  onChange: (range: DateRangeState) => void;
}

type PresetKey = '7d' | '30d' | 'year' | 'all' | 'custom';

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [activePreset, setActivePreset] = useState<PresetKey>('30d');
  const [isOpen, setIsOpen] = useState(false);

  const applyPreset = (key: PresetKey) => {
    setActivePreset(key);
    const now = new Date();

    if (key === '7d') {
      onChange({ from: subDays(now, 7), to: now });
      setIsOpen(false);
    } else if (key === '30d') {
      onChange({ from: subDays(now, 30), to: now });
      setIsOpen(false);
    } else if (key === 'year') {
      onChange({ from: startOfYear(now), to: now });
      setIsOpen(false);
    } else if (key === 'all') {
      onChange({ from: undefined, to: undefined });
      setIsOpen(false);
    } else if (key === 'custom') {
      // Garder ouvert pour la saisie personnalisée
    }
  };

  const handleCustomStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActivePreset('custom');
    const val = e.target.value;
    onChange({
      from: val ? new Date(val) : undefined,
      to: value.to,
    });
  };

  const handleCustomEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActivePreset('custom');
    const val = e.target.value;
    onChange({
      from: value.from,
      to: val ? new Date(val) : undefined,
    });
  };

  const formattedLabel = (() => {
    if (activePreset === 'all' || (!value.from && !value.to)) {
      return "Toutes les dates (Historique complet)";
    }
    if (value.from && value.to) {
      return `${format(value.from, 'dd MMM yyyy', { locale: fr })} → ${format(value.to, 'dd MMM yyyy', { locale: fr })}`;
    }
    if (value.from) {
      return `Depuis le ${format(value.from, 'dd MMM yyyy', { locale: fr })}`;
    }
    return "Période sélectionnée";
  })();

  return (
    <div className="relative font-mono text-xs">
      {/* Bouton déclencheur */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2 bg-[#151515] hover:bg-[#090909] border border-[#565A5C]/40 text-[#FFFFFF] flex items-center gap-2.5 transition-colors cursor-pointer shadow-md focus:outline-none focus:border-[#EEB149]"
      >
        <Calendar className="w-3.5 h-3.5 text-[#EEB149]" />
        <span className="text-[11px] font-medium tracking-wide">{formattedLabel}</span>
        <ChevronDown className={`w-3 h-3 text-[#A5A5A0] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Sélecteur */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#151515] border border-[#EEB149] p-4 shadow-2xl z-50 space-y-4">
          <div className="flex items-center justify-between border-b border-[#565A5C]/30 pb-2">
            <span className="text-[10px] text-[#EEB149] uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              PÉRIMÈTRE DE L&apos;ANALYSE
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#565A5C] hover:text-[#FFFFFF] text-[10px] uppercase cursor-pointer"
            >
              Fermer
            </button>
          </div>

          {/* Presets rapides */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => applyPreset('7d')}
              className={`px-2.5 py-2 text-[11px] text-left border transition-colors cursor-pointer ${
                activePreset === '7d'
                  ? 'bg-[#EEB149]/10 text-[#EEB149] border-[#EEB149]'
                  : 'bg-[#090909] text-[#A5A5A0] border-[#565A5C]/30 hover:border-[#EEB149]/50 hover:text-[#FFFFFF]'
              }`}
            >
              7 derniers jours
            </button>

            <button
              type="button"
              onClick={() => applyPreset('30d')}
              className={`px-2.5 py-2 text-[11px] text-left border transition-colors cursor-pointer ${
                activePreset === '30d'
                  ? 'bg-[#EEB149]/10 text-[#EEB149] border-[#EEB149]'
                  : 'bg-[#090909] text-[#A5A5A0] border-[#565A5C]/30 hover:border-[#EEB149]/50 hover:text-[#FFFFFF]'
              }`}
            >
              30 derniers jours
            </button>

            <button
              type="button"
              onClick={() => applyPreset('year')}
              className={`px-2.5 py-2 text-[11px] text-left border transition-colors cursor-pointer ${
                activePreset === 'year'
                  ? 'bg-[#EEB149]/10 text-[#EEB149] border-[#EEB149]'
                  : 'bg-[#090909] text-[#A5A5A0] border-[#565A5C]/30 hover:border-[#EEB149]/50 hover:text-[#FFFFFF]'
              }`}
            >
              Cette année
            </button>

            <button
              type="button"
              onClick={() => applyPreset('all')}
              className={`px-2.5 py-2 text-[11px] text-left border transition-colors cursor-pointer ${
                activePreset === 'all'
                  ? 'bg-[#EEB149]/10 text-[#EEB149] border-[#EEB149]'
                  : 'bg-[#090909] text-[#A5A5A0] border-[#565A5C]/30 hover:border-[#EEB149]/50 hover:text-[#FFFFFF]'
              }`}
            >
              Historique complet
            </button>
          </div>

          {/* Saisie personnalisée */}
          <div className="pt-2 border-t border-[#565A5C]/20 space-y-2.5">
            <span className="text-[10px] text-[#A5A5A0] uppercase tracking-wider block">
              Dates personnalisées :
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] text-[#565A5C] uppercase block mb-1">Du</label>
                <input
                  type="date"
                  value={value.from ? format(value.from, 'yyyy-MM-dd') : ''}
                  onChange={handleCustomStart}
                  className="w-full bg-[#090909] border border-[#565A5C]/40 px-2.5 py-1.5 text-[11px] text-[#FFFFFF] focus:outline-none focus:border-[#EEB149]"
                />
              </div>
              <div>
                <label className="text-[9px] text-[#565A5C] uppercase block mb-1">Au</label>
                <input
                  type="date"
                  value={value.to ? format(value.to, 'yyyy-MM-dd') : ''}
                  onChange={handleCustomEnd}
                  className="w-full bg-[#090909] border border-[#565A5C]/40 px-2.5 py-1.5 text-[11px] text-[#FFFFFF] focus:outline-none focus:border-[#EEB149]"
                />
              </div>
            </div>
          </div>

          <div className="pt-1 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 bg-[#EEB149] text-[#090909] text-[10px] font-bold uppercase tracking-wider hover:bg-[#EEB149]/90 cursor-pointer"
            >
              Appliquer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
