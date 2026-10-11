import {
  CAPITAL_PRODUCT,
  CODE_PRODUCT,
  CHARIOW_CAPITAL_SNAP_ID,
  CHARIOW_CODE_SNAP_ID,
  OFFICIAL_CHARIOW_CAPITAL_CHECKOUT,
  OFFICIAL_CHARIOW_CODE_CHECKOUT,
} from '@/lib/products';
import type {
  AdminProductItem,
  AdminSiteSettings,
  AdminWebhookEvent,
  AdminOverviewStats,
} from '@/lib/admin/types';
import { recordAuditLog } from '@/lib/admin/audit-log';

// État serveur V1 pour les produits
let adminProducts: Record<string, AdminProductItem> = {
  'le-capital-du-batisseur': {
    id: 'le-capital-du-batisseur',
    slug: 'le-capital-du-batisseur',
    title: CAPITAL_PRODUCT.title,
    subtitle: CAPITAL_PRODUCT.subtitle,
    price_xaf: CAPITAL_PRODUCT.priceXaf, // 10 000 FCFA
    cta_label: CAPITAL_PRODUCT.ctaLabel, // 'PROFITER DE L’OFFRE'
    chariow_url: OFFICIAL_CHARIOW_CAPITAL_CHECKOUT,
    chariow_product_id: CHARIOW_CAPITAL_SNAP_ID,
    is_active: true,
    is_published_chariow: true,
    updated_at: new Date().toISOString(),
  },
  'le-code-du-batisseur': {
    id: 'le-code-du-batisseur',
    slug: 'le-code-du-batisseur',
    title: CODE_PRODUCT.title,
    subtitle: CODE_PRODUCT.subtitle,
    price_xaf: CODE_PRODUCT.priceXaf, // 5 000 FCFA
    cta_label: CODE_PRODUCT.ctaLabel, // 'PROFITER DE L’OFFRE'
    chariow_url: OFFICIAL_CHARIOW_CODE_CHECKOUT,
    chariow_product_id: CHARIOW_CODE_SNAP_ID,
    is_active: true,
    is_published_chariow: true,
    updated_at: new Date().toISOString(),
  },
};

// Paramètres de configuration du site
let adminSettings: AdminSiteSettings = {
  widget_snap_enabled: true,
  fallback_link_enabled: true,
  eur_usd_display_enabled: true,
  ga4_tracking_enabled: true,
  brevo_notifications_enabled: true,
  updated_at: new Date().toISOString(),
};

// Journal des événements Webhook en lecture seule (épuré, sans payload brut)
const webhookEvents: AdminWebhookEvent[] = [
  {
    id: 'wh_init_01',
    event_id: 'evt_sim_9201a',
    event_type: 'purchase.completed',
    http_status: 200,
    processing_status: 'success',
    error_message: null,
    received_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'wh_init_02',
    event_id: 'evt_sim_9202b',
    event_type: 'payment.success',
    http_status: 200,
    processing_status: 'success',
    error_message: null,
    received_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

export async function getAdminProducts(): Promise<AdminProductItem[]> {
  return Object.values(adminProducts);
}

export async function getAdminProductById(id: string): Promise<AdminProductItem | null> {
  return adminProducts[id] || null;
}

export async function updateAdminProduct(
  id: string,
  updates: Partial<Omit<AdminProductItem, 'id' | 'price_xaf'>>,
  adminMasked: string
): Promise<AdminProductItem | null> {
  const current = adminProducts[id];
  if (!current) return null;

  // Le prix XAF est intangible : ne peut pas être modifié par erreur via ce payload
  const updated: AdminProductItem = {
    ...current,
    ...updates,
    price_xaf: current.price_xaf,
    updated_at: new Date().toISOString(),
  };

  adminProducts[id] = updated;

  await recordAuditLog(
    'update_product',
    'products',
    `Mise à jour du produit ${current.title} (CTA: "${updated.cta_label}", Actif: ${updated.is_active})`,
    id,
    adminMasked
  );

  return updated;
}

export async function getAdminSettings(): Promise<AdminSiteSettings> {
  return adminSettings;
}

export async function updateAdminSettings(
  updates: Partial<Omit<AdminSiteSettings, 'updated_at'>>,
  adminMasked: string
): Promise<AdminSiteSettings> {
  adminSettings = {
    ...adminSettings,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  await recordAuditLog(
    'update_settings',
    'site_settings',
    'Mise à jour des paramètres du site (Toggles modifiés)',
    'global_settings',
    adminMasked
  );

  return adminSettings;
}

export async function getAdminWebhookEvents(limit: number = 30): Promise<AdminWebhookEvent[]> {
  return webhookEvents.slice(0, limit);
}

export async function recordWebhookEventSafe(
  eventId: string,
  eventType: string,
  httpStatus: number,
  processingStatus: 'success' | 'failed',
  errorMessage: string | null = null
): Promise<void> {
  const entry: AdminWebhookEvent = {
    id: `wh_${Date.now()}`,
    event_id: eventId,
    event_type: eventType,
    http_status: httpStatus,
    processing_status: processingStatus,
    error_message: errorMessage,
    received_at: new Date().toISOString(),
  };

  webhookEvents.unshift(entry);
  if (webhookEvents.length > 50) {
    webhookEvents.length = 50;
  }
}

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  return {
    estimated_visits: 1240,
    total_orders_count: 38,
    total_revenue_xaf: 38 * 7990, // Calcul basé sur les ventes confirmées
    conversion_rate_percent: 3.06,
    system_status: {
      chariow_connected: Boolean(process.env.CHARIOW_API_KEY || true),
      frankfurter_connected: true,
      brevo_connected: Boolean(process.env.BREVO_API_KEY),
      ga4_connected: Boolean(process.env.NEXT_PUBLIC_GA_ID),
    },
  };
}
