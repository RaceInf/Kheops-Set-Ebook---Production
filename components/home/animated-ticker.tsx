'use client';

import React from 'react';

interface AnimatedTickerProps {
  direction?: 'left' | 'right';
  variant?: 'primary' | 'secondary';
}

const PRIMARY_ITEMS = [
  'STRUCTURE',
  'LIMITES',
  'CAPITAL',
  'DISCIPLINE',
  'ACTES',
  'TEMPS',
];

const SECONDARY_ITEMS = [
  'MOINS DE BRUIT',
  'PLUS DE PLAN',
  'MOINS DE PARAÎTRE',
  'PLUS DE CONSTRUCTION',
];

export function AnimatedTicker({
  direction = 'left',
  variant = 'primary',
}: AnimatedTickerProps) {
  const items = variant === 'primary' ? PRIMARY_ITEMS : SECONDARY_ITEMS;
  const repeatedGroups = [0, 1, 2, 3];

  return (
    <div
      aria-label={items.join(' · ')}
      className={`w-full overflow-hidden border-y border-[#565A5C]/35 py-3.5 select-none ${
        variant === 'primary' ? 'bg-[#151515] text-[#F3F1EB]' : 'bg-[#090909] text-[#A5A5A0]'
      }`}
    >
      <div
        className={`flex w-max items-center ${
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
        }`}
      >
        {repeatedGroups.map((groupIndex) => (
          <div
            key={groupIndex}
            aria-hidden={groupIndex > 0 ? true : undefined}
            className="flex items-center shrink-0"
          >
            {items.map((word) => (
              <span
                key={`${groupIndex}-${word}`}
                className="inline-flex items-center font-mono text-xs sm:text-sm tracking-[0.22em] px-4 sm:px-6 whitespace-nowrap"
              >
                <span>{word}</span>
                <span
                  aria-hidden="true"
                  className="ml-8 sm:ml-12 text-[#EEB149] font-bold"
                >
                  ·
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
