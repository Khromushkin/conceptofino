import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ConceptoFino — Muebles a medida en Valencia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props {
  params: { locale: string }
}

export default function Image({ params }: Props) {
  const { locale } = params

  const taglines: Record<string, string> = {
    es: 'Muebles a medida · Diseño de interiores',
    en: 'Custom Furniture · Interior Design',
    ru: 'Мебель на заказ · Дизайн интерьера',
  }
  const tagline = taglines[locale] ?? taglines.es

  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1a1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#b8a088' }} />
        <div style={{ color: '#b8a088', fontSize: '16px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '32px', display: 'flex' }}>
          Valencia, España
        </div>
        <div style={{ color: '#faf8f5', fontSize: '80px', fontFamily: 'Georgia, serif', marginBottom: '24px', textAlign: 'center', display: 'flex' }}>
          ConceptoFino
        </div>
        <div style={{ width: '60px', height: '1px', background: '#b8a088', marginBottom: '24px', display: 'flex' }} />
        <div style={{ color: '#8a8a8a', fontSize: '22px', textAlign: 'center', display: 'flex' }}>
          {tagline}
        </div>
        <div style={{ position: 'absolute', bottom: '48px', color: '#b8a088', fontSize: '14px', letterSpacing: '0.15em', display: 'flex' }}>
          conceptofino.com
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: '#b8a088' }} />
      </div>
    ),
    { ...size },
  )
}
