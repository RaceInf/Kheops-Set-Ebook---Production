import React from 'react';

interface SaleBadgeProps {
  percentageText?: string | null;
  showPromoLabel?: boolean;
  className?: string;
}

export function SaleBadge({
  percentageText,
  showPromoLabel = true,
  className = '',
}: SaleBadgeProps) {
  if (!percentageText) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-xs tabular-nums ${className}`}
    >
      {showPromoLabel && (
        <span className="px-2 py-0.5 bg-[#EEB149] text-[#090909] font-bold tracking-wider">
          PROMO
        </span>
      )}
      <span className="px-2 py-0.5 border border-[#EEB149]/60 bg-[#090909] text-[#EEB149] font-semibold">
        {percentageText}
      </span>
    </span>
  );
}
