'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ImageIcon, Wand2, Download, Sparkles } from 'lucide-react'

interface Capitulo {
  numero: number
  titulo: string
  descricao: string
}

interface Props {
  slug: string
  titulo: string
  nomeAutor: string
  capitulos: Capitulo[]
}

const ESTILOS = [
  { id: 'ilustrado',   label: 'Ilustrado',   color: '#10b981' },
  { id: 'artistico',   label: 'Artístico',   color: '#a855f7' },
  { id: 'realista',    label: 'Realista',    color: '#3b82f6' },
  { id: 'minimalista', label: 'Minimalista', color: '#6b7280' },
  { id: 'abstrato',    label: 'Abstrato',    color: '#f59e0b' },
]

function ChapterCard({
  cap, estilo, titulo, nomeAutor,
}: { cap: Capitulo; estilo: string; titulo: string; nomeAutor: string }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const gerar = async () => {
    setLoading(true)
    setErro('')
    if (imgUrl) URL.revokeObjectURL(imgUrl)
    setImgUrl(null)

    try {
      const res = await fetch('/api/generate-illustration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterTitle: cap.titulo,
          chapterDesc: cap.descricao,
          estilo,
          titulo,
          nomeAutor,
        }),
      })
      if (!res.ok) throw new Error('erro')
      const blob = await res.blob()
      setImgUrl(URL.createObjectURL(blob))
    } catch {
      setErro('Não foi possível gerar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.07)',
      background: '#0d1220',
    }}>
      {/* Header do capítulo */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#5a6a84', margin: '0 0 4px' }}>
              Capítulo {cap.numero}
            </p>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#e0e8f0', margin: '0 0 6px', lineHeight: 1.3 }}>
              {cap.titulo}
            </h3>
            <p style={{ fontSize: 12, color: '#4a5a70', margin: 0, lineHeight: 1.5 }}>
              {cap.descricao.slice(0, 120)}…
            </p>
          </div>
          <button
            onClick={gerar}
            disabled={loading}
            style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
              borderRadius: 10, padding: '8px 16px', fontSize: 12, fontWeight: 700,
              background: loading ? 'rgba(168,85,247,0.05)' : 'rgba(168,85,247,0.12)',
              border: '1px solid rgba(168,85,247,0.25)',
              color: '#a855f7', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1, whiteSpace: 'nowrap' as const,
            }}
          >
            <Wand2 style={{ width: 12, height: 12 }} />
            {loading ? 'Gerando…' : imgUrl ? 'Gerar Outra' : 'Gerar'}
          </button>
        </div>
      </div>

      {/* Área da ilustração */}
      {(loading || imgUrl) && (
        <div style={{ padding: '16px 20px' }}>
          {loading ? (
            <div style={{
              height: 200, borderRadius: 10,
              background: 'linear-gradient(135deg,#0a0e1a,#14203a)',
              border: '1px solid rgba(168,85,247,0.1)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              <ImageIcon style={{ width: 28, height: 28, color: '#4a5a70', opacity: 0.5 }} />
              <p style={{ fontSize: 12, color: '#3a4a60', margin: 0 }}>Criando ilustração…</p>
            </div>
          ) : imgUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <img
                src={imgUrl}
                alt={`Ilustração: ${cap.titulo}`}
                style={{ width: '100%', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}
              />
              <a
                href={imgUrl}
                download={`capitulo-${cap.numero}.jpg`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
                  borderRadius: 8, padding: '7px 14px', fontSize: 11, fontWeight: 700,
                  background: 'rgba(79,127,255,0.1)', border: '1px solid rgba(79,127,255,0.25)',
                  color: '#4f7fff', textDecoration: 'none',
                }}
              >
                <Download style={{ width: 11, height: 11 }} /> Baixar
              </a>
            </div>
          ) : null}
        </div>
      )}

      {erro && (
        <div style={{ padding: '0 20px 16px' }}>
          <p style={{ fontSize: 12, color: '#f87171', margin: 0 }}>{erro}</p>
        </div>
      )}
    </div>
  )
}

export function IllustrationCreator({ slug, titulo, nomeAutor, capitulos }: Props) {
  const [estilo, setEstilo] = useState('ilustrado')

  return (
    <div style={{ minHeight: '100vh', background: '#080e24', color: 'white', paddingBottom: 60 }}>

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(8,14,36,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
          <Link href={`/dashboard/biblioteca/${slug}/ilustrar`} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 600, color: '#5a6a84', textDecoration: 'none',
          }}>
            <ArrowLeft style={{ width: 14, height: 14 }} /> Voltar
          </Link>
          <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#a855f7' }}>
            Ilustrar Livro
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Hero */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14,
            borderRadius: 999, padding: '6px 16px',
            background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)',
            fontSize: 10, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#a855f7',
          }}>
            <Sparkles style={{ width: 11, height: 11 }} /> Ilustrações por IA
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>{titulo}</h1>
          <p style={{ fontSize: 13, color: '#5a6a84', margin: 0 }}>
            Gere uma ilustração exclusiva para cada capítulo do seu livro
          </p>
        </div>

        {/* Seletor de estilo */}
        <div style={{
          borderRadius: 14, padding: '18px 20px',
          background: '#0d1220', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#5a6a84', margin: '0 0 14px' }}>
            Estilo das Ilustrações
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {ESTILOS.map(e => (
              <button
                key={e.id}
                onClick={() => setEstilo(e.id)}
                style={{
                  borderRadius: 999, padding: '7px 16px', fontSize: 12, fontWeight: 700,
                  border: estilo === e.id ? `1px solid ${e.color}` : '1px solid rgba(255,255,255,0.08)',
                  background: estilo === e.id ? `${e.color}22` : 'transparent',
                  color: estilo === e.id ? e.color : '#5a6a84',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de capítulos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {capitulos.map(cap => (
            <ChapterCard
              key={cap.numero}
              cap={cap}
              estilo={estilo}
              titulo={titulo}
              nomeAutor={nomeAutor}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
