'use client';

import React from 'react';
import { useCurrency } from '@/context/currency-context';
import type { CurrencyCode } from '@/lib/products';
import { trackEvent } from '@/lib/analytics';

const CURRENCIES: { code: CurrencyCode; label: string }[] = [
  { code: 'XAF', label: 'XAF' },
  { code: 'EUR', label: 'EUR' },
  { code: 'USD', label: 'USD' },
];

interface CurrencySwitcherProps {
  variant?: 'navbar' | 'inline';
  className?: string;
}

export function CurrencySwitcher({
  variant = 'navbar',
  className = '',
}: CurrencySwitcherProps) {
  const { currency, setCurrency } = useCurrency();

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    trackEvent('currency_changed', { currency: code });
  };

  return (
    <div
      role="group"
      aria-label="Sélecteur de devise"
      className={`inline-flex items-center border border-[#565A5C]/40 bg-[#151515]/90 p-0.5 ${className}`}
    >
      {CURRENCIES.map((item) => {
        const isActive = currency === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => handleSelect(item.code)}
            aria-pressed={isActive}
            aria-label={`Afficher le prix en ${item.label}`}
            className={`font-mono tabular-nums transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
              variant === 'navbar' ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1 text-xs'
            } ${
              isActive
                ? 'bg-[#EEB149] text-[#090909] font-semibold'
                : 'text-[#A5A5A0] hover:text-[#FFFFFF]'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
