const TURNSTILE_VERIFY_ENDPOINT =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileVerificationResult {
  success: boolean;
  error?: string;
}

/**
 * ==============================================================================
 * VÉRIFICATION SERVEUR DU JETON CLOUDFLARE TURNSTILE
 * ==============================================================================
 *
 * RÈGLE ABSOLUE DE SÉCURITÉ :
 * - En Production et en Preview : aucun bypass n'est toléré. Le token est
 *   obligatoirement soumis à l'API de validation Cloudflare.
 * - Le bypass 'dev-turnstile-token' est STRICTEMENT interdit en Production et en Preview.
 *   Il ne peut être accepté que si process.env.NODE_ENV === 'development' ET que
 *   TURNSTILE_SECRET_KEY n'est pas encore configurée.
 */
export async function verifyTurnstileToken(
  token: string,
  clientIp?: string
): Promise<TurnstileVerificationResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  const isDev = process.env.NODE_ENV === 'development';

  // Si TURNSTILE_SECRET_KEY n'est pas renseignée
  if (!secretKey || secretKey.trim() === '') {
    // Toléré UNIQUEMENT en développement local strict
    if (isDev && token === 'dev-turnstile-token') {
      return { success: true };
    }
    // En Preview et en Production : refus strict
    return {
      success: false,
      error: 'TURNSTILE_SECRET_KEY non configurée en environnement de production/preview.',
    };
  }

  // En Production ou Preview : le token dev est formellement interdit
  if (!isDev && token === 'dev-turnstile-token') {
    return { success: false, error: 'Token de développement non autorisé.' };
  }

  if (!token || token.trim().length < 5) {
    return { success: false, error: 'Token Turnstile manquant ou trop court.' };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey.trim());
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
      return { success: false, error: 'Échec de réponse Cloudflare Turnstile' };
    }

    const result = (await response.json()) as { success?: boolean };
    return { success: Boolean(result.success) };
  } catch {
    return { success: false, error: 'Erreur réseau ou timeout lors de la vérification' };
  }
}
