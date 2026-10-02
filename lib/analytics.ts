export type KheopsAnalyticsEvent =
  | 'view_free_resource_page'
  | 'free_resource_form_started'
  | 'free_resource_form_submitted'
  | 'free_resource_download_clicked'
  | 'whatsapp_channel_clicked'
  | 'facebook_follow_clicked'
  | 'view_thank_you_page'
  | 'view_product'
  | 'click_buy_chariow'
  | 'currency_changed'
  | 'coming_soon_waitlist_submitted';

// Liste stricte des clés de métadonnées autorisées (aucune donnée personnelle)
export interface SafeAnalyticsProps {
  product_slug?: string;
  currency?: string;
  resource_slug?: string;
  source?: string;
  location?: string;
}

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      eventParams?: Record<string, string | number | boolean>
    ) => void;
    clarity?: (command: 'event', eventName: string) => void;
  }
}

/**
 * Envoie un événement analytics respectueux de la vie privée (GA4 / Microsoft Clarity).
 * Ne transmet jamais d'email, de prénom, de message, de token Turnstile ni d'URL privée.
 */
export function trackEvent(
  eventName: KheopsAnalyticsEvent,
  props?: SafeAnalyticsProps
): void {
  if (typeof window === 'undefined') return;

  const safePayload: Record<string, string> = {};
  if (props?.product_slug) safePayload.product_slug = props.product_slug;
  if (props?.currency) safePayload.currency = props.currency;
  if (props?.resource_slug) safePayload.resource_slug = props.resource_slug;
  if (props?.source) safePayload.source = props.source;
  if (props?.location) safePayload.location = props.location;

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, safePayload);
    }
    if (typeof window.clarity === 'function') {
      window.clarity('event', eventName);
    }
  } catch {
    // Silence analytics errors
  }
}
