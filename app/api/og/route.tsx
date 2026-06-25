import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '40px',
        }}
      >
        {/* Hexagon icon area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 110,
            height: 110,
            borderRadius: 24,
            background: 'rgba(255,255,255,0.18)',
            border: '2px solid rgba(255,255,255,0.3)',
            marginBottom: 36,
          }}
        >
          <div style={{ fontSize: 56 }}>📖</div>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: 52,
            fontWeight: 900,
            color: 'white',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 3,
            lineHeight: 1.2,
          }}
        >
          <span>SEU PLANEJAMENTO</span>
          <span>CHEGOU</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            marginTop: 20,
            fontSize: 20,
            color: 'rgba(255,255,255,0.75)',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          Clube do Autor IA
        </div>
      </div>
    ),
    {
      width: 800,
      height: 420,
    },
  )
}
