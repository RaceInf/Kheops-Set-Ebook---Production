'use client';

import React, { useState, useCallback } from 'react';
import { TurnstileField } from '@/components/resource/TurnstileField';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot
  const [turnstileToken, setTurnstileToken] = useState('dev-turnstile-token');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken('');
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      } else {
        setStatus('error');
        setFeedback(data.error || 'Veuillez vérifier les informations saisies.');
      }
    } catch {
      setStatus('error');
      setFeedback('Impossible d’envoyer le message pour le moment.');
    }
  };

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
            className="block text-xs font-mono text-[#F3F1EB] mb-2"
          >
            NOM <span className="text-[#EEB149]">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ton nom"
            className="w-full px-4 py-3 bg-[#090909] border border-[#565A5C]/60 text-sm text-[#FFFFFF] placeholder:text-[#A5A5A0]/60 focus:border-[#EEB149] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="block text-xs font-mono text-[#F3F1EB] mb-2"
          >
            EMAIL <span className="text-[#EEB149]">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ton.email@exemple.com"
            className="w-full px-4 py-3 bg-[#090909] border border-[#565A5C]/60 text-sm text-[#FFFFFF] placeholder:text-[#A5A5A0]/60 focus:border-[#EEB149] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="block text-xs font-mono text-[#F3F1EB] mb-2"
        >
          SUJET <span className="text-[#EEB149]">*</span>
        </label>
        <input
          id="contact-subject"
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Question sur Le Capital du Bâtisseur / Suivi de commande"
          className="w-full px-4 py-3 bg-[#090909] border border-[#565A5C]/60 text-sm text-[#FFFFFF] placeholder:text-[#A5A5A0]/60 focus:border-[#EEB149] focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-xs font-mono text-[#F3F1EB] mb-2"
        >
          MESSAGE <span className="text-[#EEB149]">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Explique ta demande avec précision..."
          className="w-full px-4 py-3 bg-[#090909] border border-[#565A5C]/60 text-sm text-[#FFFFFF] placeholder:text-[#A5A5A0]/60 focus:border-[#EEB149] focus:outline-none resize-y"
        />
      </div>

      {/* Cloudflare Turnstile anti-bot field */}
      <div className="pt-1">
        <TurnstileField
          onVerify={handleTurnstileVerify}
          onExpire={handleTurnstileExpire}
        />
      </div>

      {status === 'error' && (
        <p
          role="alert"
          className="text-xs font-mono text-[#EEB149] border border-[#EEB149]/50 bg-[#090909] p-3.5"
        >
          {feedback}
        </p>
      )}

      {status === 'success' && (
        <p
          role="status"
          className="text-xs font-mono text-[#090909] bg-[#EEB149] p-3.5 font-semibold"
        >
          {feedback}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full sm:w-auto px-8 py-4 text-xs sm:text-sm font-semibold tracking-wider bg-[#EEB149] text-[#090909] hover:bg-[#FFFFFF] transition-colors disabled:opacity-60 cursor-pointer"
      >
        {status === 'loading' ? 'ENVOI EN COURS...' : 'ENVOYER LE MESSAGE'}
      </button>
    </form>
  );
}
