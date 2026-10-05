import { ImageResponse } from 'next/og';
import { getProductBySlug } from '@/lib/products';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  const title = product?.title || 'KHEOPS SET';
  const subtitle = product?.subtitle || 'L’Acier Bienveillant · Outils de Décision';
  const pageCount = product?.pageCount || 49;
  const price = product?.price ? `${product.price.toLocaleString('fr-FR')} FCFA` : '10 000 FCFA';

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
        {/* Ligne d'or supérieure technique */}
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

        {/* Header technique */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              fontSize: '24px',
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
              color: '#EEB149',
              fontWeight: 600,
              border: '1px solid #EEB149',
              padding: '6px 16px',
            }}
          >
            EBOOK PDF · {pageCount} PAGES
          </div>
        </div>

        {/* Titre et Promesse du Produit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: '18px',
              letterSpacing: '0.22em',
              color: '#A5A5A0',
              fontWeight: 600,
            }}
          >
            MANUEL DE CONSTRUCTION STRATÉGIQUE
          </div>
          <div
            style={{
              fontSize: '56px',
              fontWeight: 800,
              lineHeight: 1.15,
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

        {/* Footer avec prix et mentions Chariow */}
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
              display: 'flex',
              gap: '24px',
              fontSize: '15px',
              color: '#A5A5A0',
              letterSpacing: '0.08em',
            }}
          >
            <span>PAIEMENT ET ACCÈS VIA CHARIOW</span>
            <span>·</span>
            <span>LIVRAISON INSTANTANÉE</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#EEB149',
              }}
            >
              {price}
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
