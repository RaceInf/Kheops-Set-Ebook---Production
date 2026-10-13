'use server';

import { prisma } from '@/lib/db';
import { sendBrevoMarketingEmail, getBrevoMarketingStats, type BrevoMarketingStats } from '@/lib/brevo';
import { revalidatePath } from 'next/cache';

export interface RelanceActionResult {
  success: boolean;
  count?: number;
  message?: string;
  error?: string;
}

export async function fetchMarketingStatsAction(): Promise<BrevoMarketingStats> {
  return await getBrevoMarketingStats();
}

/**
 * Server Action pour envoyer un email de relance ciblé
 */
export async function triggerManualRelanceAction(params: {
  segment: string;
  subject: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
}): Promise<RelanceActionResult> {
  const { segment, subject, message, ctaText, ctaUrl } = params;

  if (!subject || subject.trim() === '') {
    return { success: false, error: 'L’objet de l’email est obligatoire.' };
  }

  if (!message || message.trim() === '') {
    return { success: false, error: 'Le corps du message ne peut pas être vide.' };
  }

  try {
    let rawRecipients: Array<{ email: string; name?: string | null }> = [];

    if (segment === 'protocol_non_buyers') {
      // 1. Leads Protocole n'ayant pas encore acheté
      const completedOrders = await prisma.order.findMany({
        where: { status: { in: ['COMPLETED', 'completed', 'PAID', 'paid'] } },
        select: { email: true },
      });
      const buyerEmails = new Set(completedOrders.map((o) => o.email.toLowerCase()));

      const protocolLeads = await prisma.lead.findMany({
        where: { source: 'protocole_du_batisseur' },
        select: { email: true, firstName: true },
      });

      rawRecipients = protocolLeads
        .filter((l) => !buyerEmails.has(l.email.toLowerCase()))
        .map((l) => ({ email: l.email, name: l.firstName }));
    } else if (segment === 'all_protocol_leads') {
      // 2. Tous les leads Protocole
      const leads = await prisma.lead.findMany({
        where: { source: 'protocole_du_batisseur' },
        select: { email: true, firstName: true },
      });
      rawRecipients = leads.map((l) => ({ email: l.email, name: l.firstName }));
    } else if (segment === 'capital_buyers') {
      // 3. Acheteurs du Capital du Bâtisseur
      const buyers = await prisma.order.findMany({
        where: {
          productSlug: { in: ['le-capital-du-batisseur', 'captaldubatisseur'] },
          status: { in: ['COMPLETED', 'completed', 'PAID', 'paid'] },
        },
        select: { email: true },
      });
      rawRecipients = buyers.map((b) => ({ email: b.email, name: null }));
    } else if (segment === 'code_buyers') {
      // 4. Acheteurs du Code du Bâtisseur
      const buyers = await prisma.order.findMany({
        where: {
          productSlug: { in: ['le-code-du-batisseur', 'codedubatisseur'] },
          status: { in: ['COMPLETED', 'completed', 'PAID', 'paid'] },
        },
        select: { email: true },
      });
      rawRecipients = buyers.map((b) => ({ email: b.email, name: null }));
    } else {
      // 5. Tous les contacts confondus
      const [leads, orders] = await Promise.all([
        prisma.lead.findMany({ select: { email: true, firstName: true } }),
        prisma.order.findMany({ select: { email: true } }),
      ]);
      rawRecipients = [
        ...leads.map((l) => ({ email: l.email, name: l.firstName })),
        ...orders.map((o) => ({ email: o.email, name: null })),
      ];
    }

    // Déduplication stricte par adresse email
    const seen = new Set<string>();
    const validRecipients: Array<{ email: string; name?: string }> = [];

    for (const r of rawRecipients) {
      const cleanEmail = r.email.trim().toLowerCase();
      if (cleanEmail && cleanEmail.includes('@') && !seen.has(cleanEmail)) {
        seen.add(cleanEmail);
        validRecipients.push({ email: cleanEmail, name: r.name || undefined });
      }
    }

    if (validRecipients.length === 0) {
      return {
        success: false,
        error: 'Aucun contact valide trouvé dans le segment sélectionné.',
      };
    }

    // Appel d'envoi Brevo
    const sendResult = await sendBrevoMarketingEmail({
      recipients: validRecipients,
      subject: subject.trim(),
      message: message.trim(),
      ctaText: ctaText?.trim() || undefined,
      ctaUrl: ctaUrl?.trim() || undefined,
    });

    if (!sendResult.ok) {
      return {
        success: false,
        error: sendResult.error || 'Erreur lors de l’envoi de la campagne via Brevo.',
      };
    }

    revalidatePath('/admin/marketing');
    revalidatePath('/admin/logs');

    return {
      success: true,
      count: sendResult.count,
      message: `Campagne délivrée à ${sendResult.count} contact(s) avec succès.`,
    };
  } catch (error) {
    console.error('[triggerManualRelanceAction Error]:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inattendue.',
    };
  }
}
