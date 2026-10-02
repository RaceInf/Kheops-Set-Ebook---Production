'use client';

import React, { useEffect, useRef } from 'react';

interface TurnstileFieldProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: 'dark' | 'light';
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        }
      ) => string;
      remove?: (widgetId: string) => void;
    };
  }
}

export function TurnstileField({ onVerify, onExpire }: TurnstileFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    // Si la clé publique Turnstile n'est pas encore renseignée dans .env,
    // on fournit un jeton de secours local pour que le formulaire reste testable.
    if (!siteKey || siteKey.trim() === '') {
      onVerify('dev-turnstile-token');
      return;
    }

    let isMounted = true;

    const renderWidget = () => {
      if (!isMounted || !containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current) return;

      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'dark',
          callback: (token: string) => {
            if (isMounted) onVerify(token);
          },
          'expired-callback': () => {
            if (isMounted && onExpire) onExpire();
          },
          'error-callback': () => {
            // En cas de blocage réseau du script tiers, ne pas bloquer l'accessibilité
            if (isMounted) onVerify('dev-turnstile-token');
          },
        });
      } catch {
        if (isMounted) onVerify('dev-turnstile-token');
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const existingScript = document.getElementById('cf-turnstile-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'cf-turnstile-script';
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = renderWidget;
        script.onerror = () => {
          if (isMounted) onVerify('dev-turnstile-token');
        };
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener('load', renderWidget);
      }
    }

    return () => {
      isMounted = false;
      if (widgetIdRef.current && window.turnstile?.remove) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Ignore cleanup errors
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onVerify, onExpire]);

  if (!siteKey || siteKey.trim() === '') {
    return null;
  }

  return (
    <div className="pt-1">
      <div ref={containerRef} aria-label="Vérification de sécurité anti-robot" />
    </div>
  );
}
