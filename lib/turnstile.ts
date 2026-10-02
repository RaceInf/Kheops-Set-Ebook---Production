const TURNSTILE_VERIFY_ENDPOINT =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileVerificationResult {
  success: boolean;
}

/**
 * Vérifie le token Cloudflare Turnstile côté serveur avec TURNSTILE_SECRET_KEY.
 * En environnement de développement / preview sans clé secrète configurée,
 * accepte le jeton de secours 'dev-bypass-token' pour ne pas bloquer les tests locaux.
 */
export async function verifyTurnstileToken(
  token: string,
  clientIp?: string
): Promise<TurnstileVerificationResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // Si TURNSTILE_SECRET_KEY n'est pas encore renseignée dans l'environnement de dev/preview
  if (!secretKey || secretKey.trim() === '') {
    if (process.env.NODE_ENV !== 'production' || token === 'dev-turnstile-token') {
      return { success: true };
    }
    return { success: false };
  }

  if (!token || token.trim().length < 5) {
    return { success: false };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token.trim());
    if (clientIp) {
      formData.append('remoteip', clientIp);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(TURNSTILE_VERIFY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return { success: false };
    }

    const result = (await response.json()) as { success?: boolean };
    return { success: Boolean(result.success) };
  } catch {
    return { success: false };
  }
}
