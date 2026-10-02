'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TurnstileField } from '@/components/resource/TurnstileField';
import { EmailCaptureSuccess } from '@/components/resource/EmailCaptureSuccess';
import type { NewsletterSource } from '@/lib/NewsletterSchema';
import { trackEvent } from '@/lib/analytics';

interface LeadCaptureFormProps {
  source?: NewsletterSource;
  bookSlug?: string;
  submitLabel?: string;
  consentText?: string;
  redirectOnSuccess?: boolean;
  compact?: boolean;
}

const SIMPLE_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LeadCaptureForm({
  source = 'protocole-du-batisseur',
  bookSlug,
  submitLabel = 'RECEVOIR LE PROTOCOLE',
  consentText = 'J’accepte de recevoir le guide et les prochains outils de Kheops Set par email. Je peux me désinscrire à tout moment.',
  redirectOnSuccess = true,
  compact = false,
}: LeadCaptureFormProps) {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // Honeypot invisible
  const [turnstileToken, setTurnstileToken] = useState('dev-turnstile-token');
  const [hasStarted, setHasStarted] = useState(false);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInteractionStart = () => {
    if (!hasStarted) {
      setHasStarted(true);
      trackEvent('free_resource_form_started', { source });
    }
  };

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken('');
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'loading') return; // Protection contre les doubles soumissions

    setErrorMessage('');

    const trimmedName = firstName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      setStatus('error');
      setErrorMessage('Entre ton prénom.');
      return;
    }

    if (!trimmedEmail || !SIMPLE_EMAIL_REGEX.test(trimmedEmail)) {
      setStatus('error');
      setErrorMessage('Entre une adresse email valide.');
      return;
    }

    if (!consent) {
      setStatus('error');
      setErrorMessage('Accepte les conditions pour recevoir le guide.');
      return;
    }

    if (!turnstileToken) {
      setStatus('error');
      setErrorMessage('Vérifie les informations saisies.');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: trimmedName,
          email: trimmedEmail,
          consent: true,
          source,
          turnstileToken,
          ...(bookSlug ? { bookSlug } : {}),
          website,
        }),
      });

      const data = (await response.json()) as { success?: boolean; error?: string };

      if (response.ok && data.success) {
        setStatus('success');

        if (source === 'protocole-du-batisseur') {
          trackEvent('free_resource_form_submitted', {
            resource_slug: 'protocole-du-batisseur',
          });
        } else {
          trackEvent('coming_soon_waitlist_submitted', {
            product_slug: bookSlug || 'livres-a-venir',
          });
        }

        if (redirectOnSuccess && source === 'protocole-du-batisseur') {
          router.push('/merci?ressource=protocole-du-batisseur');
        }
      } else {
        setStatus('error');
        setErrorMessage(
          data.error ||
            'Impossible d’envoyer le formulaire pour le moment. Réessaie plus tard.'
        );
      }
    } catch {
      setStatus('error');
      setErrorMessage(
        'Impossible d’envoyer le formulaire pour le moment. Réessaie plus tard.'
      );
    }
  };

  if (status === 'success') {
    return (
      <EmailCaptureSuccess
        message={
          source === 'protocole-du-batisseur'
            ? 'C’est bon. Ton protocole est prêt.'
            : 'C’est bon. Tu seras informé dès la sortie.'
        }
        showProtocolLink={source === 'protocole-du-batisseur'}
      />
    );
  }

  const formIdPrefix = bookSlug ? `waitlist-${bookSlug}` : `lead-${source}`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`bg-[#090909] text-[#FFFFFF] border border-[#565A5C]/50 ${
        compact ? 'p-5 space-y-4' : 'p-6 sm:p-10 space-y-5'
      }`}
    >
      {!compact && (
        <div className="border-b border-[#565A5C]/35 pb-4 flex items-center justify-between">
          <p className="font-mono text-xs text-[#EEB149] tracking-wider">
            ACCÈS IMMÉDIAT & GRATUIT
          </p>
          <span className="font-mono text-[11px] text-[#A5A5A0]">FORMAT PDF</span>
        </div>
      )}

      {/* Honeypot invisible anti-spam */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${formIdPrefix}-website`}>Site web</label>
        <input
          id={`${formIdPrefix}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {/* Champ Prénom (Obligatoire) */}
      <div>
        <label
          htmlFor={`${formIdPrefix}-firstname`}
          className="block text-xs font-mono text-[#F3F1EB] mb-2"
        >
          PRÉNOM <span className="text-[#EEB149]">*</span>
        </label>
        <input
          id={`${formIdPrefix}-firstname`}
          name="firstName"
          type="text"
          required
          autoComplete="given-name"
          value={firstName}
          onFocus={handleInteractionStart}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Ton prénom"
          className="w-full px-4 py-3 bg-[#151515] border border-[#565A5C]/60 text-sm text-[#FFFFFF] placeholder:text-[#A5A5A0]/60 focus:border-[#EEB149] focus:outline-none"
        />
      </div>

      {/* Champ Email (Obligatoire) */}
      <div>
        <label
          htmlFor={`${formIdPrefix}-email`}
          className="block text-xs font-mono text-[#F3F1EB] mb-2"
        >
          ADRESSE EMAIL <span className="text-[#EEB149]">*</span>
        </label>
        <input
          id={`${formIdPrefix}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onFocus={handleInteractionStart}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton.email@exemple.com"
          className="w-full px-4 py-3 bg-[#151515] border border-[#565A5C]/60 text-sm text-[#FFFFFF] placeholder:text-[#A5A5A0]/60 focus:border-[#EEB149] focus:outline-none"
        />
      </div>

      {/* Case de consentement (Obligatoire) */}
      <div className="flex items-start gap-3 pt-1">
        <input
          id={`${formIdPrefix}-consent`}
          name="consent"
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 w-4 h-4 accent-[#EEB149] bg-[#151515] border-[#565A5C] shrink-0 cursor-pointer"
        />
        <label
          htmlFor={`${formIdPrefix}-consent`}
          className="text-xs text-[#F3F1EB] leading-relaxed cursor-pointer"
        >
          {consentText}
        </label>
      </div>

      {/* Protection Cloudflare Turnstile */}
      <TurnstileField
        onVerify={handleTurnstileVerify}
        onExpire={handleTurnstileExpire}
      />

      {/* Message d'erreur simple */}
      {status === 'error' && errorMessage && (
        <p
          role="alert"
          className="text-xs font-mono text-[#EEB149] border border-[#EEB149]/60 bg-[#151515] p-3"
        >
          {errorMessage}
        </p>
      )}

      {/* Bouton de soumission */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-4 px-6 text-xs sm:text-sm font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors disabled:opacity-60 cursor-pointer"
      >
        {status === 'loading' ? 'PRÉPARATION EN COURS...' : submitLabel}
      </button>

      <p className="text-xs text-center text-[#A5A5A0]">
        Ton adresse reste privée. Tu peux te désinscrire à tout moment.
      </p>
    </form>
  );
}
