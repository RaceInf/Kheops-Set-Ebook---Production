export type KheopsAnalyticsEvent =
  | 'view_free_resource_page'
  | 'free_resource_form_started'
  | 'free_resource_form_submitted'
  | 'free_resource_download_clicked'
  | 'whatsapp_channel_clicked'
  | 'facebook_follow_clicked'
  | 'view_thank_you_page'
  | 'view_product'
  | 'begin_checkout'
  | 'click_buy_chariow'
  | 'cta_click'
  | 'currency_changed'
  | 'contact_form_submitted';

// Liste stricte des clés de métadonnées autorisées (aucune donnée personnelle)
export interface SafeAnalyticsProps {
  product_slug?: string;
  currency?: string;
  resource_slug?: string;
  source?: string;
  location?: string;
}

export interface CtaClickParams {
  cta_name: 'capital_checkout' | 'code_checkout';
  cta_location: 'home' | 'catalogue' | 'product_page' | string;
  link_url: string;
}

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      eventName: string | Date,
      eventParams?: Record<string, string | number | boolean | undefined>
    ) => void;
    dataLayer?: unknown[];
    clarity?: (command: 'event', eventName: string) => void;
  }
}

/**
 * Envoie un événement GA4 custom 'cta_click' à chaque clic sur un bouton d'achat Chariow.
 * Paramètres :
 * - cta_name : "capital_checkout" | "code_checkout"
 * - cta_location : "home" | "catalogue" | "product_page"
 * - link_url : URL exacte du checkout Chariow
 * - transport_type: 'beacon'
 */
export function trackCtaClick({
  cta_name,
  cta_location,
  link_url,
}: CtaClickParams): void {
  if (typeof window === 'undefined') return;

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'cta_click', {
        cta_name,
        cta_location,
        link_url,
        transport_type: 'beacon',
      });
    }
  } catch {
    // Silence analytics errors
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
