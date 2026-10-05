import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#090909',
          border: '4px solid #EEB149',
          padding: '16px',
          position: 'relative',
        }}
      >
        {/* Lignes techniques d'angle */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            width: '16px',
            height: '16px',
            borderTop: '2px solid #565A5C',
            borderLeft: '2px solid #565A5C',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '16px',
            height: '16px',
            borderTop: '2px solid #565A5C',
            borderRight: '2px solid #565A5C',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            width: '16px',
            height: '16px',
            borderBottom: '2px solid #565A5C',
            borderLeft: '2px solid #565A5C',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            width: '16px',
            height: '16px',
            borderBottom: '2px solid #565A5C',
            borderRight: '2px solid #565A5C',
          }}
        />

        {/* Monogramme KS architectural */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            position: 'relative',
          }}
        >
          {/* Mât vertical blanc pur */}
          <div
            style={{
              position: 'absolute',
              left: '12px',
              top: '4px',
              width: '14px',
              height: '72px',
              backgroundColor: '#FFFFFF',
            }}
          />
          {/* Bras oblique haut or */}
          <div
            style={{
              position: 'absolute',
              right: '12px',
              top: '8px',
              width: '42px',
              height: '14px',
              backgroundColor: '#EEB149',
              transform: 'rotate(-42deg)',
              transformOrigin: 'left bottom',
            }}
          />
          {/* Bras oblique bas or */}
          <div
            style={{
              position: 'absolute',
              right: '12px',
              bottom: '8px',
              width: '42px',
              height: '14px',
              backgroundColor: '#EEB149',
              transform: 'rotate(42deg)',
              transformOrigin: 'left top',
            }}
          />
        </div>

        {/* Label typographique */}
        <div
          style={{
            marginTop: '12px',
            fontSize: '13px',
            fontWeight: 800,
            letterSpacing: '0.22em',
            color: '#FFFFFF',
            fontFamily: 'monospace',
          }}
        >
          KHEOPS SET
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
