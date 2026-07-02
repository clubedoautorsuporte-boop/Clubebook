'use client'

import { useState, useEffect } from 'react'

interface Capitulo {
  numero: number
  titulo: string
  descricao?: string
  blocos?: string[]
}

interface RoteiroCapitulo {
  numero: number
  titulo: string
  linhas: string[]
}

interface Props {
  slug: string
  titulo: string
  autor: string
  premissa?: string
  publico_alvo?: string
  sinopse?: string
  capitulos: Capitulo[]
  tipo: string
  paginas: number[]
}

export function RoteiroClient({ titulo, autor, premissa, publico_alvo, sinopse, capitulos, tipo, paginas }: Props) {
  const [roteiro, setRoteiro] = useState<RoteiroCapitulo[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  async function gerarRoteiro() {
    setLoading(true)
    setErro(null)
    try {
      const res = await fetch('/api/roteiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, autor, premissa, publico_alvo, sinopse, capitulos, tipo }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro desconhecido')
      setRoteiro(data.capitulos)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao gerar roteiro')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { gerarRoteiro() }, [])

  return (
    <div style={{ marginBottom: 40 }}>

      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#111', margin: 0, fontFamily: 'system-ui' }}>
          Roteiro de Capítulos
        </p>

        {!loading && (
          <button
            onClick={gerarRoteiro}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 700, cursor: 'pointer',
              color: '#6366f1', background: 'transparent',
              border: '1px solid #e0e0e0', borderRadius: 7, padding: '5px 12px',
              transition: 'all 0.2s',
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
            Regenerar
          </button>
        )}
      </div>

      {erro && (
        <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: '#dc2626', margin: 0, fontFamily: 'system-ui' }}>
            {erro} —{' '}
            <button onClick={gerarRoteiro} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: 13, fontWeight: 700, padding: 0 }}>
              Tentar novamente
            </button>
          </p>
        </div>
      )}

      {/* Cabeçalho da tabela */}
      <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 48px', gap: 12, borderBottom: '1px solid #ddd', paddingBottom: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#bbb' }}>Cap</span>
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#bbb' }}>Estrutura de Capítulos</span>
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#bbb', textAlign: 'right' }}>Págs</span>
      </div>

      {/* Capítulos */}
      <div>
        {capitulos.map((cap, i) => {
          const roteiroCapitulo = roteiro?.find(r => r.numero === cap.numero)
          const pags = paginas[i] ?? 4

          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 48px', gap: 12, paddingBottom: 28, marginBottom: 28, borderBottom: i < capitulos.length - 1 ? '1px solid #f0f0f0' : 'none' }}>

              {/* Número */}
              <div>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#bbb', fontFamily: 'system-ui' }}>
                  {String(cap.numero).padStart(2, '0')}
                </span>
              </div>

              {/* Conteúdo */}
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: '#111', margin: '0 0 12px', lineHeight: 1.4, fontFamily: 'system-ui', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  {cap.titulo}
                </p>

                {loading ? (
                  /* Skeleton de 9 linhas */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <div key={j} style={{
                        height: 13, borderRadius: 4,
                        background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        width: j === 8 ? '55%' : j % 3 === 1 ? '85%' : '100%',
                      }} />
                    ))}
                  </div>
                ) : roteiroCapitulo ? (
                  /* 9 linhas numeradas geradas pela IA */
                  <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {roteiroCapitulo.linhas.slice(0, 9).map((linha, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 900, color: '#8b5cf6',
                          fontFamily: 'system-ui', flexShrink: 0, marginTop: 4,
                          minWidth: 16, textAlign: 'right',
                        }}>
                          {j + 1}.
                        </span>
                        <p style={{ fontSize: 13.5, lineHeight: 1.7, color: '#2d2d2d', margin: 0, fontFamily: 'Georgia, serif' }}>
                          {linha}
                        </p>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </div>

              {/* Páginas */}
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 11, color: '#bbb', fontFamily: 'Georgia, serif' }}>~{pags}p</span>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}
