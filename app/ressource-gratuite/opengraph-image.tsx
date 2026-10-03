import { ImageResponse } from 'next/og';

export const alt = 'Le Protocole du Bâtisseur — Guide Gratuit PDF | Kheops Set';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
              backgroundColor: '#EEB149',
              color: '#090909',
              padding: '6px 18px',
              fontWeight: 700,
            }}
          >
            RESSOURCE GRATUITE
          </div>
        </div>

        {/* Center Title and Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: '18px',
              letterSpacing: '0.18em',
              color: '#A5A5A0',
              fontWeight: 600,
            }}
          >
            LE PREMIER PLAN · FICHE TECHNIQUE EN 6 PAGES
          </div>
          <div
            style={{
              fontSize: '58px',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#FFFFFF',
            }}
          >
            Le Protocole du Bâtisseur
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#F3F1EB',
              maxWidth: '900px',
              lineHeight: 1.4,
            }}
          >
            Une fiche simple et sans complaisance pour identifier ce qui vide ton temps, ton argent et ton attention.
          </div>
        </div>

        {/* Bottom Bar */}
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
            ACCÈS IMMÉDIAT EN FORMAT PDF
          </div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#EEB149',
              letterSpacing: '0.1em',
            }}
          >
            TÉLÉCHARGEMENT DIRECT
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
