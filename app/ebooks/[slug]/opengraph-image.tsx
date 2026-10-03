import { ImageResponse } from 'next/og';
import { getProductBySlug } from '@/lib/products';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  const title = product?.title || 'Ebook Kheops Set';
  const subtitle = product?.subtitle || 'L’Acier Bienveillant · Une vie est un chantier.';
  const tag = product?.tag || 'PLAN DE CONSTRUCTION';
  const pageCount = product?.pageCount ? `${product.pageCount} PAGES · FORMAT PDF` : 'FORMAT PDF';
  const price = product?.salePriceXaf || product?.priceXaf || 10000;
  const formattedPrice = `${new Intl.NumberFormat('fr-FR').format(price)} FCFA`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#090909',
          color: '#FFFFFF',
          padding: '64px 80px',
          fontFamily: 'sans-serif',
          border: '12px solid #151515',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '4px',
            backgroundColor: '#EEB149',
          }}
        />

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '0.2em',
              color: '#FFFFFF',
            }}
          >
            KHEOPS SET
          </div>
          <div
            style={{
              fontSize: '14px',
              letterSpacing: '0.18em',
              backgroundColor: '#151515',
              border: '1px solid #565A5C',
              padding: '6px 16px',
              color: '#EEB149',
              fontWeight: 600,
            }}
          >
            {tag}
          </div>
        </div>

        {/* Center Title and Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: '18px',
              letterSpacing: '0.15em',
              color: '#A5A5A0',
              fontWeight: 600,
            }}
          >
            {pageCount}
          </div>
          <div
            style={{
              fontSize: '56px',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#FFFFFF',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#F3F1EB',
              maxWidth: '900px',
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom Bar with Price */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(86, 90, 92, 0.4)',
            paddingTop: '24px',
          }}
        >
          <div
            style={{
              fontSize: '18px',
              color: '#A5A5A0',
              letterSpacing: '0.08em',
            }}
          >
            L’ACIER BIENVEILLANT · PAIEMENT ET LIVRAISON CHARIOW
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: '#EEB149',
              }}
            >
              {formattedPrice}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
