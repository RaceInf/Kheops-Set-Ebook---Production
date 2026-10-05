import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#090909',
          border: '1.5px solid #EEB149',
          position: 'relative',
        }}
      >
        {/* Monogramme K architectural */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            position: 'relative',
          }}
        >
          {/* Mât vertical blanc */}
          <div
            style={{
              position: 'absolute',
              left: '2px',
              top: '1px',
              width: '4px',
              height: '18px',
              backgroundColor: '#FFFFFF',
            }}
          />
          {/* Diagonale supérieure or */}
          <div
            style={{
              position: 'absolute',
              right: '2px',
              top: '1px',
              width: '10px',
              height: '4px',
              backgroundColor: '#EEB149',
              transform: 'rotate(-45deg)',
              transformOrigin: 'left bottom',
            }}
          />
          {/* Diagonale inférieure or */}
          <div
            style={{
              position: 'absolute',
              right: '2px',
              bottom: '1px',
              width: '10px',
              height: '4px',
              backgroundColor: '#EEB149',
              transform: 'rotate(45deg)',
              transformOrigin: 'left top',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
