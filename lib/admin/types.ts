export interface AdminProductItem {
  id: string; // 'le-capital-du-batisseur' | 'le-code-du-batisseur'
  slug: string;
  title: string;
  subtitle: string;
  price_xaf: number; // Source de vérité officielle
  cta_label: string;
  chariow_url: string;
  chariow_product_id: string;
  is_active: boolean;
  is_published_chariow: boolean;
  updated_at: string;
}

export interface AdminSiteSettings {
  widget_snap_enabled: boolean;
  fallback_link_enabled: boolean;
  eur_usd_display_enabled: boolean;
  ga4_tracking_enabled: boolean;
  brevo_notifications_enabled: boolean;
  updated_at: string;
}

export interface AdminWebhookEvent {
  id: string;
  event_id: string;
  event_type: string;
  http_status: number;
  processing_status: 'success' | 'failed';
  error_message: string | null;
  received_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_identifier_masked: string;
  action: string;
  entity: string;
  entity_id: string | null;
  summary: string;
  created_at: string;
}

export interface AdminOverviewStats {
  estimated_visits: number;
  total_orders_count: number;
  total_revenue_xaf: number;
  conversion_rate_percent: number;
  system_status: {
    chariow_connected: boolean;
    frankfurter_connected: boolean;
    brevo_connected: boolean;
    ga4_connected: boolean;
  };
}
