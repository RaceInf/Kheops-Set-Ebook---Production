'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { CurrencyCode } from '@/lib/products';
import {
  FALLBACK_RATES,
  formatCurrencyAmount,
  CURRENCY_INDICATIVE_NOTICE,
  type CurrencyRates,
} from '@/lib/currency-rates';

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  rates: CurrencyRates;
  indicativeNotice: string;
  formatBaseXAF: (amountInXAF: number) => string;
  formatPrice: (amountInXAF: number, target?: CurrencyCode) => string;
  formatEstimated: (amountInXAF: number, target?: CurrencyCode) => string | null;
}

const STORAGE_KEY = 'kheops_preferred_currency';

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Toujours initialiser à 'XAF' côté serveur et client initial pour éviter tout Hydration Mismatch
  const [currency, setCurrencyState] = useState<CurrencyCode>('XAF');
  const [rates, setRates] = useState<CurrencyRates>(FALLBACK_RATES);

  useEffect(() => {
    // Synchroniser la devise enregistrée après l'hydratation initiale propre
    const frameId = requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
        if (saved && ['XAF', 'XOF', 'EUR', 'USD'].includes(saved)) {
          setCurrencyState(saved);
        }
      } catch {
        // Ignore storage access issues
      }
    });

    let isMounted = true;
    fetch('/api/rates')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.rates) {
          setRates(data.rates);
        }
      })
      .catch(() => {
        // Conserver les taux de secours fiables sans jamais bloquer l'interface
      });

    return () => {
      cancelAnimationFrame(frameId);
      isMounted = false;
    };
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const formatBaseXAF = useCallback((amountInXAF: number): string => {
    const formattedNumber = new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 0,
    })
      .format(Math.round(amountInXAF))
      .replace(/\u202f/g, ' ')
      .replace(/\u00a0/g, ' ');
    return `${formattedNumber} FCFA`;
  }, []);

  const formatPrice = useCallback(
    (amountInXAF: number, target: CurrencyCode = currency): string => {
      return formatCurrencyAmount(amountInXAF, target, rates);
    },
    [currency, rates]
  );

  const formatEstimated = useCallback(
    (amountInXAF: number, target: CurrencyCode = currency): string | null => {
      if (target === 'XAF') {
        return null;
      }
      return `≈ ${formatPrice(amountInXAF, target)}`;
    },
    [currency, formatPrice]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rates,
        indicativeNotice: CURRENCY_INDICATIVE_NOTICE,
        formatBaseXAF,
        formatPrice,
        formatEstimated,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
