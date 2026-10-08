'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  TurnstileField,
  type TurnstileFieldHandle,
} from '@/components/resource/TurnstileField';
import { EmailCaptureSuccess } from '@/components/resource/EmailCaptureSuccess';
import { trackEvent } from '@/lib/analytics';

interface LeadCaptureFormProps {
  source?: 'protocole-du-batisseur';
  submitLabel?: string;
  consentText?: string;
  redirectOnSuccess?: boolean;
  compact?: boolean;
}

const SIMPLE_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LeadCaptureForm({
  submitLabel = "C'EST GRATUIT !",
  consentText = 'J’accepte de recevoir le guide et les prochains outils de Kheops Set par email.',
  redirectOnSuccess = true,
  compact = false,
}: LeadCaptureFormProps) {
  const router = useRouter();
  const turnstileRef = useRef<TurnstileFieldHandle>(null);

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // Honeypot invisible

  const isDev = process.env.NODE_ENV === 'development';
  const hasSiteKey = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  const [turnstileToken, setTurnstileToken] = useState(
    isDev && !hasSiteKey ? 'dev-turnstile-token' : ''
  );

  const [hasStarted, setHasStarted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInteractionStart = () => {
    if (!hasStarted) {
      setHasStarted(true);
      trackEvent('free_resource_form_started', { source: 'protocole-du-batisseur' });
    }
  };

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken('');
  }, []);

  const resetTurnstile = () => {
    // En développement sans clé, conserver le token dev
    if (isDev && !hasSiteKey) {
      setTurnstileToken('dev-turnstile-token');
    } else {
      setTurnstileToken('');
    }
    turnstileRef.current?.reset();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'loading') return; // Protection contre les doubles soumissions

    setErrorMessage('');

    const trimmedName = firstName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      setStatus('error');
      setErrorMessage('Entre ton prénom (2 caractères minimum).');
      return;
    }

    if (!trimmedEmail || !SIMPLE_EMAIL_REGEX.test(trimmedEmail)) {
      setStatus('error');
      setErrorMessage('Entre une adresse email valide.');
      return;
    }

    if (!consent) {
      setStatus('error');
      setErrorMessage('Accepte les conditions pour continuer.');
      return;
    }

    if (!turnstileToken) {
      setStatus('error');
      setErrorMessage(
        'La vérification de sécurité ne s’est pas chargée. Désactive temporairement ton bloqueur de contenu, puis réessaie.'
      );
      return;
    }

    setStatus('loading');

    const payload = {
      firstName: trimmedName,
      email: trimmedEmail,
      consent: true,
      turnstileToken,
      website,
    };

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
        code?: string;
        devNotice?: string;
      };

      if (response.ok && data.success) {
        setStatus('success');
        trackEvent('free_resource_form_submitted', {
          resource_slug: 'protocole-du-batisseur',
        });
        if (redirectOnSuccess) {
          router.push('/merci?ressource=protocole-du-batisseur');
        }
      } else {
        setStatus('error');
        resetTurnstile();

        if (response.status === 429) {
          setErrorMessage('Trop de tentatives. Réessaie plus tard.');
        } else if (response.status === 503) {
          setErrorMessage(
            data.devNotice ||
              'Le service est temporairement indisponible. Réessaie dans quelques instants.'
          );
        } else if (response.status === 400) {
          setErrorMessage(data.error || 'Vérifie les informations saisies.');
        } else {
          setErrorMessage(
            data.error ||
              'Le service est temporairement indisponible. Réessaie dans quelques instants.'
          );
        }
      }
    } catch {
      setStatus('error');
      resetTurnstile();
      setErrorMessage(
        'La connexion a échoué. Vérifie Internet puis réessaie.'
      );
    }
  };

  if (status === 'success' && !redirectOnSuccess) {
    return (
      <EmailCaptureSuccess
        message="C’est bon. Ton protocole est prêt."
        showProtocolLink={true}
      />
    );
  }

  const isSubmitDisabled = status === 'loading' || !turnstileToken;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`space-y-4 ${compact ? '' : 'p-6 sm:p-8 bg-[#151515] border border-[#565A5C]/40'}`}
    >
      {/* Honeypot invisible pour neutraliser les robots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="form-website-newsletter">Site web</label>
        <input
          id="form-website-newsletter"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="form-firstname-newsletter"
          className="block font-mono text-xs text-[#A5A5A0] tracking-wider"
        >
          PRÉNOM <span className="text-[#EEB149]">*</span>
        </label>
        <input
          id="form-firstname-newsletter"
          type="text"
          autoComplete="given-name"
          required
          value={firstName}
          onFocus={handleInteractionStart}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Ex : Koffi"
          className="w-full min-h-[44px] bg-[#090909] border border-[#565A5C]/60 focus:border-[#EEB149] focus-visible:ring-1 focus-visible:ring-[#EEB149] text-[#FFFFFF] px-4 py-3 text-sm font-sans outline-none transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="form-email-newsletter"
          className="block font-mono text-xs text-[#A5A5A0] tracking-wider"
        >
          ADRESSE EMAIL <span className="text-[#EEB149]">*</span>
        </label>
        <input
          id="form-email-newsletter"
          type="email"
          autoComplete="email"
          required
          value={email}
          onFocus={handleInteractionStart}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ex : koffi@exemple.com"
          className="w-full min-h-[44px] bg-[#090909] border border-[#565A5C]/60 focus:border-[#EEB149] focus-visible:ring-1 focus-visible:ring-[#EEB149] text-[#FFFFFF] px-4 py-3 text-sm font-sans outline-none transition-colors"
        />
      </div>

      {/* Case de consentement RGPD explicite */}
      <div className="flex items-start gap-3 pt-1">
        <input
          id="form-consent-newsletter"
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 w-4 h-4 min-w-[16px] min-h-[16px] bg-[#090909] border-[#565A5C] text-[#EEB149] focus:ring-1 focus:ring-[#EEB149] cursor-pointer accent-[#EEB149]"
        />
        <label
          htmlFor="form-consent-newsletter"
          className="text-xs text-[#A5A5A0] leading-relaxed cursor-pointer select-none"
        >
          {consentText}
        </label>
      </div>

      {/* Widget Cloudflare Turnstile */}
      <TurnstileField
        ref={turnstileRef}
        onVerify={handleTurnstileVerify}
        onExpire={handleTurnstileExpire}
      />

      {/* Message d'erreur accessible avec aria-live */}
      <div aria-live="polite">
        {errorMessage && (
          <p
            role="alert"
            className="text-xs font-mono text-red-400 bg-red-950/40 border border-red-800/50 p-3"
          >
            {errorMessage}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className={`w-full min-h-[48px] py-4 px-6 font-mono text-xs sm:text-sm font-bold tracking-wider transition-all duration-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EEB149] ${
          isSubmitDisabled
            ? 'bg-[#151515] border border-[#565A5C]/40 text-[#A5A5A0]/60 cursor-not-allowed'
            : 'bg-[#EEB149] hover:bg-[#EEB149]/90 text-[#090909] cursor-pointer shadow-lg hover:shadow-[#EEB149]/20'
        }`}
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-[#090909] border-t-transparent animate-spin rounded-full" />
            ENVOI EN COURS...
          </span>
        ) : (
          submitLabel
        )}
      </button>

      <p className="text-[11px] text-[#A5A5A0]/80 text-center font-mono pt-1 flex items-center justify-center gap-1.5">
        <svg className="w-3.5 h-3.5 text-[#EEB149] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="5" y="11" width="14" height="10" />
          <path d="M8 11V7C8 4.79086 9.79086 3 12 3V3C14.2091 3 16 4.79086 16 7V11" />
        </svg>
        <span>Tes informations restent confidentielles.</span>
      </p>
    </form>
  );
}
