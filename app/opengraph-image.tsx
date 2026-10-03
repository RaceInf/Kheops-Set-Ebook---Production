import { ImageResponse } from 'next/og';

export const alt = 'Kheops Set — Le Capital du Bâtisseur | Outils de Décision';
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
        {/* Subtle architectural gold grid corner line */}
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
              fontSize: '15px',
              letterSpacing: '0.18em',
              color: '#EEB149',
              fontWeight: 600,
            }}
          >
            L’ACIER BIENVEILLANT
          </div>
        </div>

        {/* Main Center Statement */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: '20px',
              letterSpacing: '0.22em',
              color: '#A5A5A0',
              fontWeight: 600,
            }}
          >
            UNE VIE EST UN CHANTIER.
          </div>
          <div
            style={{
              fontSize: '62px',
              fontWeight: 800,
              lineHeight: 1.12,
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>Les mots ne construisent rien.</span>
            <span style={{ color: '#EEB149' }}>Les actes, oui.</span>
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#F3F1EB',
              maxWidth: '850px',
              marginTop: '8px',
            }}
          >
            Le guide pour reprendre le contrôle de ton argent, de ton temps et de tes décisions.
          </div>
        </div>

        {/* Bottom Technical Specs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(86, 90, 92, 0.4)',
            paddingTop: '28px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '36px',
              fontSize: '16px',
              color: '#A5A5A0',
              letterSpacing: '0.08em',
            }}
          >
            <span>STRUCTURE</span>
            <span>·</span>
            <span>LIMITES</span>
            <span>·</span>
            <span>CAPITAL</span>
            <span>·</span>
            <span>ACTES</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#EEB149',
              color: '#090909',
              padding: '10px 24px',
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '0.12em',
            }}
          >
            LE CAPITAL DU BÂTISSEUR
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
