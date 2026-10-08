'use client';

import React from 'react';
import { useCurrency } from '@/context/currency-context';
import { CurrencySwitcher } from '@/components/ui/CurrencySwitcher';
import { SaleBadge } from '@/components/ui/SaleBadge';
import { calculatePriceInfo } from '@/lib/products';

export interface PriceDisplayProps {
  /** Prix normal ou de base en XAF */
  amountInXAF: number;
  /** Prix normal avant remise (optionnel, par défaut amountInXAF) */
  originalPriceXaf?: number;
  /** Prix promotionnel en XAF (ex: 7990 ou 3995) */
  salePriceXaf?: number;
  /** Pourcentage de réduction (ex: 20.1) */
  salePercentage?: number;
  /** Indique si la promotion est active */
  isOnSale?: boolean;
  /** Date de fin de promo optionnelle (ISO) */
  saleEndsAt?: string;
  showSelector?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PriceDisplay({
  amountInXAF,
  originalPriceXaf,
  salePriceXaf,
  salePercentage,
  isOnSale = false,
  saleEndsAt,
  showSelector = true,
  size = 'lg',
  className = '',
}: PriceDisplayProps) {
  const { formatPrice, currency } = useCurrency();

  const priceInfo = calculatePriceInfo({
    priceXaf: originalPriceXaf ?? amountInXAF,
    originalPriceXaf: originalPriceXaf ?? amountInXAF,
    salePriceXaf,
    salePercentage,
    isOnSale,
    saleEndsAt,
  });

  const primaryActiveFormatted = formatPrice(priceInfo.activePriceXaf, currency);
  const primaryOriginalFormatted =
    priceInfo.originalPriceXaf !== null
      ? formatPrice(priceInfo.originalPriceXaf, currency)
      : null;

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Ligne supérieure : Prix barré dans la devise choisie + Badge PROMO -20,1 % */}
      {priceInfo.isOnSale && primaryOriginalFormatted && (
        <div className="flex flex-wrap items-center gap-3">
          <span
            aria-label={`Prix normal : ${primaryOriginalFormatted}`}
            className="font-mono text-sm sm:text-base text-[#A5A5A0] line-through decoration-[#A5A5A0]/80 tabular-nums"
          >
            {primaryOriginalFormatted}
          </span>
          <SaleBadge percentageText={priceInfo.salePercentageText} showPromoLabel={true} />
        </div>
      )}

      {/* Ligne principale : Prix actif dans la devise sélectionnée uniquement + Sélecteur */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-baseline gap-3 font-mono tabular-nums">
          <span
            className={`font-bold tracking-tight text-[#EEB149] ${
              size === 'lg'
                ? 'text-2xl sm:text-3xl'
                : size === 'md'
                ? 'text-xl sm:text-2xl'
                : 'text-lg sm:text-xl'
            }`}
          >
            {primaryActiveFormatted}
          </span>
        </div>

        {showSelector && <CurrencySwitcher variant="inline" />}
      </div>
    </div>
  );
}
