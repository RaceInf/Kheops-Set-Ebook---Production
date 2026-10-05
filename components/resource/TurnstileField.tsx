'use client';

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';

export interface TurnstileFieldHandle {
  reset: () => void;
}

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
      reset?: (widgetId: string) => void;
      remove?: (widgetId: string) => void;
    };
  }
}

export const TurnstileField = forwardRef<TurnstileFieldHandle, TurnstileFieldProps>(
  function TurnstileField({ onVerify, onExpire }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    const isDev = process.env.NODE_ENV === 'development';

    useImperativeHandle(ref, () => ({
      reset() {
        if (widgetIdRef.current && window.turnstile?.reset) {
          try {
            window.turnstile.reset(widgetIdRef.current);
          } catch {
            // ignore
          }
        }
      },
    }));

    useEffect(() => {
      // Toléré UNIQUEMENT en développement local strict si la clé de site n'est pas configurée
      if (!siteKey || siteKey.trim() === '') {
        if (isDev) {
          onVerify('dev-turnstile-token');
        }
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
              // En cas d'erreur de chargement Turnstile
              if (isMounted && onExpire) onExpire();
            },
          });
        } catch {
          // Erreur silencieuse
        }
      };

      if (window.turnstile) {
        renderWidget();
      } else {
        const existingScript = document.getElementById('cf-turnstile-script');
        if (!existingScript) {
          const script = document.createElement('script');
          script.id = 'cf-turnstile-script';
          script.src =
            'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
          script.async = true;
          script.defer = true;
          script.onload = renderWidget;
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
            // ignore
          }
          widgetIdRef.current = null;
        }
      };
    }, [siteKey, isDev, onVerify, onExpire]);

    if (!siteKey || siteKey.trim() === '') {
      if (isDev) return null;
      return (
        <p className="text-xs text-[#EEB149]/90 font-mono" role="alert">
          Clé Turnstile non configurée.
        </p>
      );
    }

    return (
      <div className="pt-1">
        <div ref={containerRef} aria-label="Vérification de sécurité anti-robot" />
      </div>
    );
  }
);
