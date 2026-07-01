'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Megaphone, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react'

/* ─── dados das seções ─────────────────────────────── */

const CORES = [
  { id: 'vibrante',  label: 'Vibrante e Colorido',  swatches: ['#ef4444','#3b82f6','#14b8a6','#a855f7'] },
  { id: 'elegante',  label: 'Elegante e Sóbrio',     swatches: ['#6b7280','#f5f5f5','#d4c49a','#1c1c1c'] },
  { id: 'quente',    label: 'Quente e Acolhedor',    swatches: ['#f97316','#fbbf24','#92400e','#dc2626'] },
  { id: 'frio',      label: 'Frio e Moderno',        swatches: ['#06b6d4','#3b82f6','#8b5cf6','#0ea5e9'] },
  { id: 'suave',     label: 'Suave e Delicado',      swatches: ['#f9a8d4','#93c5fd','#c4b5fd','#fde68a'] },
  { id: 'escuro',    label: 'Escuro e Misterioso',   swatches: ['#1e1b4b','#0f172a','#7f1d1d','#1f2937'] },
  { id: 'natural',   label: 'Natural e Orgânico',    swatches: ['#4ade80','#92400e','#d4c49a','#65a30d'] },
  { id: 'luxuoso',   label: 'Luxuoso e Dourado',     swatches: ['#b45309','#fbbf24','#1c1c1c','#ecfdf5'] },
]

const ESTILOS_VISUAL = [
  { id: 'profissional', label: 'Profissional',        desc: 'Formal, corporativo, confiança',       img: '/marketing-cards/estilo/profissional.webp' },
  { id: 'criativo',     label: 'Criativo e Artístico', desc: 'Ousado, visual, expressivo',           img: '/marketing-cards/estilo/criativo.webp' },
  { id: 'minimalista',  label: 'Minimalista',          desc: 'Limpo, simples, direto',               img: '/marketing-cards/estilo/minimalista.webp' },
  { id: 'emocional',    label: 'Emocional e Inspirador', desc: 'Tocante, motivador, humano',         img: '/marketing-cards/estilo/emocional.webp' },
  { id: 'divertido',    label: 'Divertido e Leve',    desc: 'Descontraído, jovem, animado',          img: '/marketing-cards/estilo/divertido.webp' },
  { id: 'literario',    label: 'Literário e Clássico', desc: 'Erudito, elegante, atemporal',         img: '/marketing-cards/estilo/literario.webp' },
]

const TONS = [
  { id: 'persuasivo', label: 'Persuasivo',          desc: 'Convence o leitor a comprar'       },
  { id: 'informativo', label: 'Informativo',         desc: 'Explica e educa sobre o livro'     },
  { id: 'emocional',   label: 'Emocional',           desc: 'Toca o coração do leitor'          },
  { id: 'urgente',     label: 'Urgente',             desc: 'Cria senso de pressa e escassez'   },
  { id: 'historia',    label: 'Contando uma história', desc: 'Narra como se fosse um conto'   },
  { id: 'amigo',       label: 'Conversa de amigo',  desc: 'Informal, próximo, autêntico'       },
]

const PUBLICOS = [
  { id: 'geral',          label: 'Público Geral',     desc: 'Para todos os leitores',              img: '/marketing-cards/publico/geral.webp' },
  { id: 'jovens',         label: 'Jovens (18–30)',     desc: 'Linguagem moderna e direta',          img: '/marketing-cards/publico/jovens.webp' },
  { id: 'adultos',        label: 'Adultos (30–50)',    desc: 'Maduro e com propósito',              img: '/marketing-cards/publico/adultos.webp' },
  { id: 'senior',         label: 'Leitores 50+',      desc: 'Experiência e sabedoria',             img: '/marketing-cards/publico/senior.webp' },
  { id: 'academicos',     label: 'Acadêmicos',        desc: 'Estudantes e pesquisadores',          img: '/marketing-cards/publico/academicos.webp' },
  { id: 'empreendedores', label: 'Empreendedores',    desc: 'Negócios e liderança',                img: '/marketing-cards/publico/empreendedores.webp' },
  { id: 'espirituais',    label: 'Espirituais',       desc: 'Autoconhecimento e fé',               img: '/marketing-cards/publico/espirituais.webp' },
  { id: 'familias',       label: 'Pais e Famílias',   desc: 'Educação e relacionamento',           img: '/marketing-cards/publico/familias.webp' },
]

const ESTILOS_IMG = [
  { id: 'cinematografico', label: 'Cinematográfico', desc: 'Iluminação dramática de cinema',     img: '/marketing-cards/estilo-img/cinematografico.webp' },
  { id: 'editorial',       label: 'Editorial',       desc: 'Estilo revista de moda',             img: '/marketing-cards/estilo-img/editorial.webp' },
  { id: 'aquarela',        label: 'Aquarela',        desc: 'Arte suave e artística',             img: '/marketing-cards/estilo-img/aquarela.webp' },
  { id: 'fotorrealista',   label: 'Fotorrealista',   desc: 'Como uma foto profissional',         img: '/marketing-cards/estilo-img/fotorrealista.webp' },
  { id: 'dramatico',       label: 'Dramático',       desc: 'Contraste forte e impactante',       img: '/marketing-cards/estilo-img/dramatico.webp' },
  { id: 'minimalista',     label: 'Minimalista',     desc: 'Clean e elegante',                   img: '/marketing-cards/estilo-img/minimalista.webp' },
  { id: 'vintage',         label: 'Vintage',         desc: 'Estética retrô e nostálgica',        img: '/marketing-cards/estilo-img/vintage.webp' },
  { id: 'luxo',            label: 'Luxo Moderno',    desc: 'Sofisticado e premium',              img: '/marketing-cards/estilo-img/luxo.webp' },
]

/* ─── helpers de UI ─────────────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 10, fontWeight: 900, textTransform: 'uppercase' as const,
      letterSpacing: '0.15em', color: '#5a6a84', margin: '0 0 14px',
    }}>
      {children}
    </p>
  )
}

/* ─── componente principal ──────────────────────────── */

interface Props { slug: string; titulo: string; nomeAutor: string }

export function MarketingForm({ slug, titulo, nomeAutor }: Props) {
  const [cor, setCor]               = useState<string | null>(null)
  const [estiloVisual, setEstiloVisual] = useState<string | null>(null)
  const [tom, setTom]               = useState<string | null>(null)
  const [publico, setPublico]       = useState<string | null>(null)
  const [estiloImg, setEstiloImg]   = useState<string | null>(null)
  const [textoNasImagens, setTextoNasImagens] = useState<boolean | null>(null)
  const [instrucoes, setInstrucoes] = useState('')
  const formRef = useRef<HTMLDivElement>(null)

  // resumo do rodapé
  const selecionados = [cor, estiloVisual, tom, publico, estiloImg]
    .filter(Boolean).length + (textoNasImagens !== null ? 1 : 0)

  const legendaRodape = selecionados === 0
    ? 'Nenhuma preferência selecionada (a Aurora vai decidir)'
    : `${selecionados} preferência${selecionados > 1 ? 's' : ''} selecionada${selecionados > 1 ? 's' : ''}`

  // ─ Estilos reutilizáveis
  const cardImg = (selected: boolean): React.CSSProperties => ({
    borderRadius: 12,
    border: selected ? '2px solid #4f7fff' : '1px solid rgba(255,255,255,0.07)',
    overflow: 'hidden',
    cursor: 'pointer',
    background: '#0a101e',
    transition: 'border-color 0.15s, transform 0.12s',
    transform: selected ? 'scale(1.02)' : 'scale(1)',
    boxShadow: selected ? '0 0 0 3px rgba(79,127,255,0.18)' : 'none',
  })

  const cardText = (selected: boolean): React.CSSProperties => ({
    borderRadius: 12,
    padding: '14px 16px',
    border: selected ? '2px solid #4f7fff' : '1px solid rgba(255,255,255,0.07)',
    cursor: 'pointer',
    background: selected ? 'rgba(79,127,255,0.07)' : '#0a101e',
    transition: 'all 0.15s',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#080e24', color: 'white', paddingBottom: 100 }}>

      {/* ── Top bar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(8,14,36,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
          <Link href={`/dashboard/biblioteca/${slug}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#5a6a84', textDecoration: 'none' }}>
            <ArrowLeft style={{ width: 14, height: 14 }} /> Voltar ao meu livro
          </Link>
          <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#4f7fff' }}>
            Kit de Marketing
          </span>
        </div>
      </div>

      <div ref={formRef} style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── Hero ── */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 18,
            borderRadius: 999, padding: '6px 18px',
            background: 'rgba(79,127,255,0.1)', border: '1px solid rgba(79,127,255,0.2)',
            fontSize: 10, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#4f7fff',
          }}>
            <Megaphone style={{ width: 12, height: 12 }} /> Divulgação
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 0 8px', lineHeight: 1.25 }}>
            Como você quer sua divulgação?
          </h1>
          <p style={{ fontSize: 13, color: '#5a6a84', margin: '0 0 24px', lineHeight: 1.7 }}>
            Personalize o material de marketing para <strong style={{ color: '#8a9ab8' }}>{titulo}</strong> — a Aurora cria tudo para você.
          </p>

          {/* Step indicator */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, borderRadius: 999, background: '#0d1220', border: '1px solid rgba(255,255,255,0.07)', padding: '6px 6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 999, background: 'rgba(79,127,255,0.15)', border: '1px solid rgba(79,127,255,0.3)' }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#4f7fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff', flexShrink: 0 }}>1</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#4f7fff' }}>Personalizar</span>
            </div>
            <ChevronRight style={{ width: 14, height: 14, color: '#3a4a60', margin: '0 4px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 999 }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#3a4a60', flexShrink: 0 }}>2</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#3a4a60' }}>Escolher conteúdos</span>
            </div>
          </div>
        </div>

        {/* ── Seção: Cores ── */}
        <div style={{ marginBottom: 40 }}>
          <SectionTitle>Cores do material</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {CORES.map(c => (
              <button
                key={c.id}
                onClick={() => setCor(cor === c.id ? null : c.id)}
                style={{
                  ...cardText(cor === c.id),
                  textAlign: 'left' as const,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}
              >
                <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                  {c.swatches.map((s, i) => (
                    <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: s }} />
                  ))}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: cor === c.id ? '#fff' : '#8a9ab8', lineHeight: 1.35 }}>
                  {c.label}
                </span>
                {cor === c.id && <CheckCircle2 style={{ width: 13, height: 13, color: '#4f7fff', marginLeft: 'auto', flexShrink: 0 }} />}
              </button>
            ))}
          </div>
        </div>

        {/* ── Seção: Estilo visual ── */}
        <div style={{ marginBottom: 40 }}>
          <SectionTitle>Estilo visual</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {ESTILOS_VISUAL.map(e => (
              <button
                key={e.id}
                onClick={() => setEstiloVisual(estiloVisual === e.id ? null : e.id)}
                style={{ ...cardImg(estiloVisual === e.id), padding: 0, display: 'block', textAlign: 'left' as const }}
              >
                <div style={{ position: 'relative', height: 130 }}>
                  <img src={e.img} alt={e.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  {estiloVisual === e.id && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(79,127,255,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <CheckCircle2 style={{ width: 28, height: 28, color: '#fff' }} />
                    </div>
                  )}
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#e0e8f0', margin: '0 0 3px' }}>{e.label}</p>
                  <p style={{ fontSize: 11, color: '#5a6a84', margin: 0 }}>{e.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Seção: Tom dos textos ── */}
        <div style={{ marginBottom: 40 }}>
          <SectionTitle>Tom dos textos</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {TONS.map(t => (
              <button
                key={t.id}
                onClick={() => setTom(tom === t.id ? null : t.id)}
                style={{ ...cardText(tom === t.id), textAlign: 'left' as const }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: tom === t.id ? '#fff' : '#c0d0e0', margin: '0 0 3px' }}>{t.label}</p>
                    <p style={{ fontSize: 11, color: '#4a5a70', margin: 0, lineHeight: 1.4 }}>{t.desc}</p>
                  </div>
                  {tom === t.id && <CheckCircle2 style={{ width: 14, height: 14, color: '#4f7fff', flexShrink: 0, marginTop: 2 }} />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Seção: Público-alvo ── */}
        <div style={{ marginBottom: 40 }}>
          <SectionTitle>Público-alvo</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 }}>
            {PUBLICOS.map(p => (
              <button
                key={p.id}
                onClick={() => setPublico(publico === p.id ? null : p.id)}
                style={{ ...cardImg(publico === p.id), padding: 0, display: 'block', textAlign: 'left' as const }}
              >
                <div style={{ position: 'relative', height: 120 }}>
                  <img src={p.img} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  {publico === p.id && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(79,127,255,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <CheckCircle2 style={{ width: 26, height: 26, color: '#fff' }} />
                    </div>
                  )}
                </div>
                <div style={{ padding: '9px 12px' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#e0e8f0', margin: '0 0 2px' }}>{p.label}</p>
                  <p style={{ fontSize: 10, color: '#5a6a84', margin: 0 }}>{p.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Seção: Estilo das imagens ── */}
        <div style={{ marginBottom: 40 }}>
          <SectionTitle>Estilo das imagens</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 }}>
            {ESTILOS_IMG.map(e => (
              <button
                key={e.id}
                onClick={() => setEstiloImg(estiloImg === e.id ? null : e.id)}
                style={{ ...cardImg(estiloImg === e.id), padding: 0, display: 'block', textAlign: 'left' as const }}
              >
                <div style={{ position: 'relative', height: 120 }}>
                  <img src={e.img} alt={e.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  {estiloImg === e.id && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(79,127,255,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <CheckCircle2 style={{ width: 26, height: 26, color: '#fff' }} />
                    </div>
                  )}
                </div>
                <div style={{ padding: '9px 12px' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#e0e8f0', margin: '0 0 2px' }}>{e.label}</p>
                  <p style={{ fontSize: 10, color: '#5a6a84', margin: 0 }}>{e.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Seção: Texto nas imagens ── */}
        <div style={{ marginBottom: 40 }}>
          <SectionTitle>Texto nas imagens</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 480 }}>
            {[
              { value: true,  label: 'Sim, com texto', desc: 'Frases que geram desejo e curiosidade', emoji: '✍️' },
              { value: false, label: 'Não, sem texto',  desc: 'Imagens limpas e artísticas',          emoji: '🖼️' },
            ].map(opt => (
              <button
                key={String(opt.value)}
                onClick={() => setTextoNasImagens(textoNasImagens === opt.value ? null : opt.value)}
                style={{
                  ...cardText(textoNasImagens === opt.value),
                  textAlign: 'left' as const,
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>{opt.emoji}</div>
                <p style={{ fontSize: 13, fontWeight: 700, color: textoNasImagens === opt.value ? '#fff' : '#c0d0e0', margin: '0 0 4px' }}>{opt.label}</p>
                <p style={{ fontSize: 11, color: '#4a5a70', margin: 0, lineHeight: 1.4 }}>{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Seção: Instruções ── */}
        <div style={{ marginBottom: 40 }}>
          <SectionTitle>Suas instruções <span style={{ fontSize: 9, color: '#3a4a60', fontWeight: 600 }}>(opcional)</span></SectionTitle>
          <div style={{ position: 'relative' }}>
            <textarea
              value={instrucoes}
              onChange={e => setInstrucoes(e.target.value.slice(0, 2000))}
              placeholder="Ex: mencione que o livro foi escrito com inteligência artificial, destaque o aspecto motivacional, use o slogan 'transforme sua história'..."
              rows={5}
              style={{
                width: '100%', boxSizing: 'border-box',
                borderRadius: 12, padding: '14px 16px', fontSize: 13, lineHeight: 1.6,
                background: '#0a101e', border: '1px solid rgba(255,255,255,0.08)',
                color: '#c0d0e0', resize: 'vertical', outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <span style={{
              position: 'absolute', bottom: 10, right: 14,
              fontSize: 10, color: '#3a4a60',
            }}>
              {instrucoes.length}/2000
            </span>
          </div>
        </div>

      </div>

      {/* ── Barra inferior fixa ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        background: 'rgba(8,14,36,0.97)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: 860, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', gap: 16,
        }}>
          <span style={{ fontSize: 12, color: selecionados > 0 ? '#8a9ab8' : '#4a5a70', flex: 1 }}>
            {selecionados > 0
              ? <><span style={{ color: '#4f7fff', fontWeight: 700 }}>{selecionados}</span> preferência{selecionados > 1 ? 's' : ''} selecionada{selecionados > 1 ? 's' : ''}</>
              : 'Nenhuma preferência selecionada (a Aurora vai decidir)'}
          </span>
          <Link
            href={`/dashboard/biblioteca/${slug}/marketing/conteudos`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              borderRadius: 12, padding: '11px 24px', fontSize: 13, fontWeight: 800, color: '#fff',
              background: 'linear-gradient(135deg,#1a3a8f,#4f7fff)',
              boxShadow: '0 4px 20px rgba(79,127,255,0.35)',
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}
          >
            Escolher conteúdos <ArrowRight style={{ width: 15, height: 15 }} />
          </Link>
        </div>
      </div>

    </div>
  )
}
