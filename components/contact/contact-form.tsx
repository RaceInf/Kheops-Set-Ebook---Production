'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  TurnstileField,
  type TurnstileFieldHandle,
} from '@/components/resource/TurnstileField';

export function ContactForm() {
  const turnstileRef = useRef<TurnstileFieldHandle>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot

  const isDev = process.env.NODE_ENV === 'development';
  const hasSiteKey = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  const [turnstileToken, setTurnstileToken] = useState(
    isDev && !hasSiteKey ? 'dev-turnstile-token' : ''
  );

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken('');
  }, []);

  const resetTurnstile = () => {
    if (isDev && !hasSiteKey) {
      setTurnstileToken('dev-turnstile-token');
    } else {
      setTurnstileToken('');
    }
    turnstileRef.current?.reset();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'loading') return;

    if (!turnstileToken) {
      setStatus('error');
      setFeedback(
        'La vérification de sécurité ne s’est pas chargée. Désactive temporairement ton bloqueur de contenu, puis réessaie.'
      );
      return;
    }

    setStatus('loading');
    setFeedback('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          website,
          turnstileToken,
        }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setStatus('success');
        setFeedback(data.message || 'Merci. Ton message a bien été envoyé.');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        resetTurnstile();
      } else {
        setStatus('error');
        resetTurnstile();

        if (res.status === 429) {
          setFeedback('Trop de tentatives. Réessaie plus tard.');
        } else if (res.status === 503) {
          setFeedback(
            data.devNotice ||
              'Le service est temporairement indisponible. Réessaie dans quelques instants.'
          );
        } else if (res.status === 400) {
          setFeedback(data.error || 'Veuillez vérifier les informations saisies.');
        } else {
          setFeedback(
            data.error || 'Impossible d’envoyer le message pour le moment.'
          );
        }
      }
    } catch {
      setStatus('error');
      resetTurnstile();
      setFeedback('La connexion a échoué. Vérifie Internet puis réessaie.');
    }
  };

  const isSubmitDisabled = status === 'loading' || !turnstileToken;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="p-6 sm:p-10 bg-[#151515] border border-[#565A5C]/45 space-y-6"
    >
      {/* Honeypot anti-spam */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Site web</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-xs font-mono text-[#A5A5A0] tracking-wider mb-2"
          >
            NOM COMPLET <span className="text-[#EEB149]">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full min-h-[44px] bg-[#090909] border border-[#565A5C]/50 px-4 py-3 text-sm text-[#F3F1EB] focus:outline-none focus:border-[#EEB149] focus-visible:ring-1 focus-visible:ring-[#EEB149] transition-colors"
            placeholder="Ton nom"
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="block text-xs font-mono text-[#A5A5A0] tracking-wider mb-2"
          >
            ADRESSE EMAIL <span className="text-[#EEB149]">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full min-h-[44px] bg-[#090909] border border-[#565A5C]/50 px-4 py-3 text-sm text-[#F3F1EB] focus:outline-none focus:border-[#EEB149] focus-visible:ring-1 focus-visible:ring-[#EEB149] transition-colors"
            placeholder="ton.email@exemple.com"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="block text-xs font-mono text-[#A5A5A0] tracking-wider mb-2"
        >
          SUJET <span className="text-[#EEB149]">*</span>
        </label>
        <input
          id="contact-subject"
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full min-h-[44px] bg-[#090909] border border-[#565A5C]/50 px-4 py-3 text-sm text-[#F3F1EB] focus:outline-none focus:border-[#EEB149] focus-visible:ring-1 focus-visible:ring-[#EEB149] transition-colors"
          placeholder="Objet de ton message"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-xs font-mono text-[#A5A5A0] tracking-wider mb-2"
        >
          MESSAGE <span className="text-[#EEB149]">*</span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-[#090909] border border-[#565A5C]/50 px-4 py-3 text-sm text-[#F3F1EB] focus:outline-none focus:border-[#EEB149] focus-visible:ring-1 focus-visible:ring-[#EEB149] transition-colors resize-none"
          placeholder="Écris ton message avec précision..."
        />
      </div>

      {/* Widget Turnstile */}
      <TurnstileField
        ref={turnstileRef}
        onVerify={handleTurnstileVerify}
        onExpire={handleTurnstileExpire}
      />

      {/* Zone de feedback accessible avec aria-live */}
      <div aria-live="polite">
        {feedback && (
          <div
            role={status === 'error' ? 'alert' : 'status'}
            className={`p-4 border text-xs font-mono ${
              status === 'success'
                ? 'bg-[#EEB149]/10 border-[#EEB149]/40 text-[#EEB149]'
                : 'bg-red-950/40 border-red-800/50 text-red-400'
            }`}
          >
            {feedback}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className={`w-full min-h-[48px] py-4 px-8 font-mono text-xs font-bold tracking-widest uppercase transition-all duration-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EEB149] ${
          isSubmitDisabled
            ? 'bg-[#151515] border border-[#565A5C]/40 text-[#A5A5A0]/60 cursor-not-allowed'
            : 'bg-[#EEB149] hover:bg-[#EEB149]/90 text-[#090909] cursor-pointer shadow-lg hover:shadow-[#EEB149]/20'
        }`}
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-[#090909] border-t-transparent animate-spin rounded-full" />
            TRANSMISSION DU MESSAGE...
          </span>
        ) : (
          'ENVOYER LE MESSAGE'
        )}
      </button>

      <p className="text-[11px] font-mono text-[#A5A5A0]/80 text-center flex items-center justify-center gap-1.5">
        <svg className="w-3.5 h-3.5 text-[#EEB149] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="5" y="11" width="14" height="10" />
          <path d="M8 11V7C8 4.79086 9.79086 3 12 3V3C14.2091 3 16 4.79086 16 7V11" />
        </svg>
        <span>Vos coordonnées restent strictement confidentielles.</span>
      </p>
    </form>
  );
}
