'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { CurrencyCode } from '@/lib/products';

interface CurrencyRates {
  XAF: number;
  EUR: number;
  USD: number;
}

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  rates: CurrencyRates;
  formatBaseXAF: (amountInXAF: number) => string;
  formatPrice: (amountInXAF: number, target?: CurrencyCode) => string;
  formatEstimated: (amountInXAF: number, target?: CurrencyCode) => string | null;
}

const DEFAULT_RATES: CurrencyRates = {
  XAF: 1,
  EUR: 1 / 655.957,
  USD: 1 / 604.5,
};

const STORAGE_KEY = 'kheops_preferred_currency';

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Toujours initialiser à 'XAF' côté serveur et client initial pour éviter tout Hydration Mismatch
  const [currency, setCurrencyState] = useState<CurrencyCode>('XAF');
  const [rates, setRates] = useState<CurrencyRates>(DEFAULT_RATES);

  useEffect(() => {
    // Synchroniser la devise enregistrée après l'hydratation initiale propre
    const frameId = requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
        if (saved && ['XAF', 'EUR', 'USD'].includes(saved)) {
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
        // Keep safe fallback rates
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
      if (target === 'XAF') {
        return formatBaseXAF(amountInXAF);
      }

      const rate = rates[target] ?? DEFAULT_RATES[target];
      const converted = amountInXAF * rate;

      if (target === 'EUR') {
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(converted);
      }

      if (target === 'USD') {
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(converted);
      }

      return formatBaseXAF(amountInXAF);
    },
    [currency, rates, formatBaseXAF]
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
