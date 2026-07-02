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
  resumo: string
  topicos: string[]
  proposito: string
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
  resumosFallback: string[]
}

const CACHE_KEY = (slug: string) => `roteiro_v2_${slug}`

export function RoteiroClient({ slug, titulo, autor, premissa, publico_alvo, sinopse, capitulos, tipo, paginas, resumosFallback }: Props) {
  const [roteiro, setRoteiro] = useState<RoteiroCapitulo[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  async function gerarRoteiro(force = false) {
    // Tenta cache primeiro
    if (!force) {
      try {
        const cached = localStorage.getItem(CACHE_KEY(slug))
        if (cached) {
          setRoteiro(JSON.parse(cached))
          setLoading(false)
          return
        }
      } catch {}
    }

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
      try { localStorage.setItem(CACHE_KEY(slug), JSON.stringify(data.capitulos)) } catch {}
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
          Estrutura de Capítulos
        </p>

        {!loading && (
          <button
            onClick={() => gerarRoteiro(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 700, cursor: 'pointer',
              color: '#888', background: 'transparent',
              border: '1px solid #e8e8e8', borderRadius: 7, padding: '5px 12px',
              fontFamily: 'system-ui',
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
            Regenerar
          </button>
        )}
      </div>

      {erro && (
        <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: '#dc2626', margin: 0, fontFamily: 'system-ui' }}>
            {erro} —{' '}
            <button onClick={() => gerarRoteiro(true)} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: 13, fontWeight: 700, padding: 0 }}>
              Tentar novamente
            </button>
          </p>
        </div>
      )}

      {/* Cabeçalho da tabela */}
      <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 48px', gap: 12, borderBottom: '1px solid #ddd', paddingBottom: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#bbb', fontFamily: 'system-ui' }}>Cap</span>
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#bbb', fontFamily: 'system-ui' }}>Estrutura de Capítulos</span>
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#bbb', fontFamily: 'system-ui', textAlign: 'right' }}>Págs</span>
      </div>

      {/* Capítulos */}
      <div>
        {capitulos.map((cap, i) => {
          const rc = roteiro?.find(r => r.numero === cap.numero)
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
                <p style={{ fontSize: 13, fontWeight: 800, color: '#111', margin: '0 0 10px', lineHeight: 1.4, fontFamily: 'system-ui', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  {cap.titulo}
                </p>

                {loading ? (
                  /* Enquanto a IA gera, mostra o resumo estático do planejamento */
                  <p style={{
                    fontSize: 14, lineHeight: 1.78, color: '#555',
                    margin: 0, fontFamily: 'Georgia, serif', textAlign: 'justify',
                    display: '-webkit-box',
                    WebkitLineClamp: 9,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {resumosFallback[i] ?? ''}
                  </p>
                ) : rc ? (
                  <>
                    <p style={{ fontSize: 14, lineHeight: 1.78, color: '#333', margin: '0 0 12px', fontFamily: 'Georgia, serif', textAlign: 'justify' }}>
                      {rc.resumo}
                    </p>

                    {rc.topicos?.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: rc.proposito ? 10 : 0 }}>
                        {rc.topicos.map((t, j) => (
                          <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <span style={{ color: '#ccc', flexShrink: 0, marginTop: 2, fontSize: 13 }}>•</span>
                            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#666', margin: 0, fontFamily: 'Georgia, serif' }}>{t}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {rc.proposito && (
                      <p style={{ fontSize: 12, lineHeight: 1.6, color: '#aaa', margin: 0, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                        Propósito: {rc.proposito}
                      </p>
                    )}
                  </>
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

    </div>
  )
}
