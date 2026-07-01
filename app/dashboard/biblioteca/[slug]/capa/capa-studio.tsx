'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Upload, Wand2, CheckCircle2 } from 'lucide-react'

interface Props {
  slug: string
  titulo: string
  subtitulo?: string
  sinopse?: string
  nomeAutor: string
}

/* ── Opções ──────────────────────────────────────────────────────── */

const ESTILOS = [
  { id: 'artistico',   label: 'Artístico',    desc: 'Pintura e expressão',    gradient: 'linear-gradient(135deg,#1a0533,#6b21a8,#c026d3)', emoji: '🎨' },
  { id: 'realista',    label: 'Realista',      desc: 'Fotográfico e realista',  gradient: 'linear-gradient(135deg,#0c1a2e,#1e3a5f,#2563eb)', emoji: '📷' },
  { id: 'minimalista', label: 'Minimalista',   desc: 'Limpo e minimalista',     gradient: 'linear-gradient(135deg,#111827,#1f2937,#374151)', emoji: '◻' },
  { id: 'ilustrado',   label: 'Ilustrado',     desc: 'Ilustração artística',    gradient: 'linear-gradient(135deg,#064e3b,#065f46,#10b981)', emoji: '✏️' },
  { id: 'abstrato',    label: 'Abstrato',      desc: 'Formas e movimento',      gradient: 'linear-gradient(135deg,#1e1b4b,#3730a3,#6366f1)', emoji: '🌀' },
  { id: 'classico',    label: 'Clássico',      desc: 'Elegante e tradicional',  gradient: 'linear-gradient(135deg,#1c0a00,#78350f,#d97706)', emoji: '📜' },
]

const CORES = [
  { id: 'quentes',    label: 'Cores Quentes',       desc: 'Vermelho, laranja, dourado', gradient: 'linear-gradient(135deg,#7c2d12,#dc2626,#f59e0b)' },
  { id: 'frias',      label: 'Cores Frias',          desc: 'Azul, lilás, turquesa',      gradient: 'linear-gradient(135deg,#0c4a6e,#0891b2,#818cf8)' },
  { id: 'escuro',     label: 'Escuro e Misterioso',  desc: 'Preto, roxo escuro, carmesim', gradient: 'linear-gradient(135deg,#0f0014,#3b0764,#7f1d1d)' },
  { id: 'natural',    label: 'Natural e Terroso',    desc: 'Verde, marrom, bege',        gradient: 'linear-gradient(135deg,#14532d,#3f6212,#78350f)' },
  { id: 'vibrante',   label: 'Vibrante e Colorido',  desc: 'Brilhante e multicolorido',  gradient: 'linear-gradient(135deg,#7c3aed,#db2777,#f59e0b)' },
  { id: 'neutro',     label: 'Neutro e Elegante',    desc: 'Branco, cinza, prateado',    gradient: 'linear-gradient(135deg,#1f2937,#4b5563,#9ca3af)' },
]

const ELEMENTOS = [
  { id: 'pessoa',    label: 'Pessoa / Personagem',  desc: 'Figura humana em destaque',   icon: '🧍' },
  { id: 'paisagem',  label: 'Paisagem / Cenário',   desc: 'Ambiente ou natureza',         icon: '🏔️' },
  { id: 'objeto',    label: 'Objeto Simbólico',     desc: 'Item com significado',         icon: '🔮' },
  { id: 'abstrato',  label: 'Formas Abstratas',     desc: 'Geometria e texturas',         icon: '🌀' },
  { id: 'tipografia',label: 'Apenas Tipografia',    desc: 'Texto como elemento visual',   icon: '🔤' },
]

const FONTES = [
  { id: 'serifada',   label: 'Serifada',     desc: 'Clássica e elegante',    style: { fontFamily: 'Georgia, serif',           fontSize: '22px', letterSpacing: '-0.02em' } },
  { id: 'sem-serifa', label: 'Sem Serifa',   desc: 'Moderna e limpa',        style: { fontFamily: 'Arial, sans-serif',         fontSize: '22px', letterSpacing: '-0.01em', fontWeight: 800 } },
  { id: 'cursiva',    label: 'Cursiva',      desc: 'Sofisticada e fluida',   style: { fontFamily: 'Georgia, serif',            fontSize: '22px', fontStyle: 'italic' } },
  { id: 'display',    label: 'Display Bold', desc: 'Impactante e forte',     style: { fontFamily: 'Impact, sans-serif',        fontSize: '22px', letterSpacing: '0.05em' } },
  { id: 'manuscrita', label: 'Manuscrita',   desc: 'Pessoal e orgânica',     style: { fontFamily: "'Brush Script MT', cursive", fontSize: '22px' } },
  { id: 'geometrica', label: 'Geométrica',   desc: 'Futurista e precisa',    style: { fontFamily: 'Trebuchet MS, sans-serif',  fontSize: '22px', letterSpacing: '0.15em', fontWeight: 700 } },
]

const COR_FONTE = [
  { id: 'branco',      label: 'Branco',      hex: '#FFFFFF' },
  { id: 'preto',       label: 'Preto',       hex: '#111111' },
  { id: 'dourado',     label: 'Dourado',     hex: '#D4A017' },
  { id: 'prateado',    label: 'Prateado',    hex: '#C0C0C0' },
  { id: 'creme',       label: 'Creme',       hex: '#F5F0DC' },
  { id: 'vermelho',    label: 'Vermelho',    hex: '#DC2626' },
  { id: 'azul',        label: 'Azul Marinho',hex: '#1E40AF' },
  { id: 'esmeralda',   label: 'Esmeralda',   hex: '#059669' },
]

/* ── Sub-componentes ─────────────────────────────────────────────── */

function SectionTitle({ number, title, optional }: { number: string; title: string; optional?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg,#4f7fff,#a855f7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontWeight: 900, color: '#fff',
      }}>{number}</div>
      <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>
        {title}
        {optional && <span style={{ fontSize: '11px', fontWeight: 500, color: '#5a6a84', marginLeft: 8 }}>(opcional)</span>}
      </h2>
    </div>
  )
}

function SelectCard({
  selected, onClick, children, style,
}: { selected: boolean; onClick: () => void; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        border: selected ? '2px solid #4f7fff' : '2px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'transparent',
        padding: 0,
        outline: 'none',
        transition: 'border-color 0.15s, transform 0.1s',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
        ...style,
      }}
    >
      {children}
      {selected && (
        <div style={{
          position: 'absolute', top: 6, right: 6,
          background: '#4f7fff', borderRadius: '50%', padding: 2,
        }}>
          <CheckCircle2 style={{ width: 13, height: 13, color: '#fff' }} />
        </div>
      )}
    </button>
  )
}

/* ── Main component ──────────────────────────────────────────────── */

export function CapaStudio({ slug, titulo, subtitulo, sinopse, nomeAutor }: Props) {
  const [estilo, setEstilo] = useState('')
  const [cores, setCores] = useState('')
  const [elemento, setElemento] = useState('')
  const [fonte, setFonte] = useState('')
  const [corFonte, setCorFonte] = useState('')
  const [descricao, setDescricao] = useState('')
  const [naoQuero, setNaoQuero] = useState('')
  const [gerando, setGerando] = useState(false)

  const canGenerate = estilo && cores

  const handleGerar = async () => {
    if (!canGenerate) return
    setGerando(true)
    // TODO: integrar com geração de imagem
    setTimeout(() => setGerando(false), 3000)
  }

  return (
    <div className="min-h-full pb-24" style={{ background: '#080e24', color: 'white' }}>

      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(8,14,36,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="mx-auto max-w-4xl flex items-center justify-between px-5 py-3">
          <Link href={`/dashboard/biblioteca/${slug}`}
            className="flex items-center gap-2 text-[12px] font-semibold transition hover:text-white"
            style={{ color: '#5a6a84' }}>
            <ArrowLeft className="size-3.5" /> Voltar ao meu livro
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#4f7fff' }}>
              Cover Studio
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-8 space-y-10">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-[10px] font-black uppercase tracking-widest"
            style={{ background: 'rgba(79,127,255,0.1)', color: '#4f7fff', border: '1px solid rgba(79,127,255,0.2)' }}>
            <Sparkles className="size-3" /> Personalize sua capa
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{titulo}</h1>
          <p className="text-[13px]" style={{ color: '#5a6a84' }}>Conte como você imagina a capa ideal</p>
        </div>

        {/* ── Info do livro ─────────────────────────────────────── */}
        <div className="rounded-2xl p-4 flex items-start gap-4"
          style={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Sparkles className="size-4 shrink-0 mt-0.5" style={{ color: '#4f7fff' }} />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#4f7fff' }}>
              A Aurora já sabe sobre seu livro
            </p>
            <p className="text-[12px]" style={{ color: '#6a7a96' }}>
              <span className="font-semibold text-white">Título:</span> {titulo}
              {nomeAutor && <> · <span className="font-semibold text-white">Autor:</span> {nomeAutor}</>}
              {sinopse && <><br /><span className="font-semibold text-white">Sinopse:</span> {sinopse.slice(0, 120)}…</>}
            </p>
          </div>
        </div>

        {/* ── 1. Estilo ─────────────────────────────────────────── */}
        <div>
          <SectionTitle number="1" title="Que estilo você imagina para sua capa?" />
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {ESTILOS.map(e => (
              <SelectCard key={e.id} selected={estilo === e.id} onClick={() => setEstilo(e.id)}>
                <div style={{
                  height: 90, background: e.gradient,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 4,
                }}>
                  <span style={{ fontSize: 22 }}>{e.emoji}</span>
                </div>
                <div style={{ padding: '8px 10px', background: '#0d1220' }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{e.label}</p>
                  <p style={{ fontSize: 10, color: '#5a6a84', lineHeight: 1.3 }}>{e.desc}</p>
                </div>
              </SelectCard>
            ))}
          </div>
        </div>

        {/* ── 2. Cores ─────────────────────────────────────────── */}
        <div>
          <SectionTitle number="2" title="Quais cores representam melhor seu livro?" />
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {CORES.map(c => (
              <SelectCard key={c.id} selected={cores === c.id} onClick={() => setCores(c.id)}>
                <div style={{ height: 80, background: c.gradient }} />
                <div style={{ padding: '8px 10px', background: '#0d1220' }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{c.label}</p>
                  <p style={{ fontSize: 10, color: '#5a6a84', lineHeight: 1.3 }}>{c.desc}</p>
                </div>
              </SelectCard>
            ))}
          </div>
        </div>

        {/* ── 3. Elemento ───────────────────────────────────────── */}
        <div>
          <SectionTitle number="3" title="O que gostaria de ver na capa?" optional />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {ELEMENTOS.map(el => (
              <SelectCard key={el.id} selected={elemento === el.id} onClick={() => setElemento(el.id === elemento ? '' : el.id)}>
                <div style={{
                  padding: '20px 12px 14px',
                  background: elemento === el.id ? 'rgba(79,127,255,0.08)' : '#0d1220',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 28 }}>{el.icon}</span>
                  <p style={{ fontSize: 11, fontWeight: 800, color: '#fff', textAlign: 'center', lineHeight: 1.3 }}>{el.label}</p>
                  <p style={{ fontSize: 10, color: '#5a6a84', textAlign: 'center', lineHeight: 1.3 }}>{el.desc}</p>
                </div>
              </SelectCard>
            ))}
          </div>
        </div>

        {/* ── 4. Fonte ─────────────────────────────────────────── */}
        <div>
          <SectionTitle number="4" title="Estilo da fonte do título" optional />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FONTES.map(f => (
              <SelectCard key={f.id} selected={fonte === f.id} onClick={() => setFonte(f.id === fonte ? '' : f.id)}>
                <div style={{
                  padding: '20px 16px 14px',
                  background: fonte === f.id ? 'rgba(79,127,255,0.08)' : '#0d1220',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ ...f.style, color: '#fff', textAlign: 'center', lineHeight: 1.2 }}>
                    ABCDEF
                  </span>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{f.label}</p>
                    <p style={{ fontSize: 10, color: '#5a6a84', marginTop: 2 }}>{f.desc}</p>
                  </div>
                </div>
              </SelectCard>
            ))}
          </div>
        </div>

        {/* ── 5. Cor da fonte ──────────────────────────────────── */}
        <div>
          <SectionTitle number="5" title="Cor da fonte" optional />
          <div className="flex flex-wrap gap-3">
            {COR_FONTE.map(c => (
              <button
                key={c.id}
                onClick={() => setCorFonte(c.id === corFonte ? '' : c.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: c.hex,
                  border: corFonte === c.id
                    ? '3px solid #4f7fff'
                    : c.id === 'branco' ? '2px solid rgba(255,255,255,0.2)' : '2px solid transparent',
                  boxShadow: corFonte === c.id ? '0 0 0 2px rgba(79,127,255,0.3)' : 'none',
                  transition: 'border 0.15s, box-shadow 0.15s',
                }} />
                <span style={{ fontSize: 10, color: corFonte === c.id ? '#fff' : '#5a6a84', fontWeight: corFonte === c.id ? 700 : 400 }}>
                  {c.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── 6. Descrição livre ───────────────────────────────── */}
        <div>
          <SectionTitle number="6" title="Descreva com suas palavras como imagina sua capa" optional />
          <textarea
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            maxLength={500}
            placeholder="Ex: Quero uma capa com um pôr do sol sobre o mar, com tons dourados..."
            rows={4}
            style={{
              width: '100%', borderRadius: 12, padding: '14px 16px',
              background: '#0d1220', border: '1px solid rgba(255,255,255,0.08)',
              color: '#a0b0c8', fontSize: 13, resize: 'none', outline: 'none',
              fontFamily: 'inherit', lineHeight: 1.6,
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(79,127,255,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
          <p style={{ textAlign: 'right', fontSize: 10, color: '#3a4a60', marginTop: 4 }}>
            {descricao.length}/500
          </p>
        </div>

        {/* ── 7. Não quero ──────────────────────────────────────── */}
        <div>
          <SectionTitle number="7" title="Há algo que NÃO quer na capa?" optional />
          <textarea
            value={naoQuero}
            onChange={e => setNaoQuero(e.target.value)}
            maxLength={300}
            placeholder="Ex: Não quero rostos humanos, não quero cores escuras..."
            rows={3}
            style={{
              width: '100%', borderRadius: 12, padding: '14px 16px',
              background: '#0d1220', border: '1px solid rgba(255,255,255,0.08)',
              color: '#a0b0c8', fontSize: 13, resize: 'none', outline: 'none',
              fontFamily: 'inherit', lineHeight: 1.6,
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(79,127,255,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
        </div>

      </div>

      {/* ── Botão fixo no bottom ──────────────────────────────── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        background: 'rgba(8,14,36,0.97)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        {!canGenerate && (
          <p style={{ fontSize: 11, color: '#5a6a84' }}>
            Selecione um estilo e uma paleta de cores para continuar
          </p>
        )}
        <button
          onClick={handleGerar}
          disabled={!canGenerate || gerando}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            borderRadius: 14, padding: '14px 36px',
            fontSize: 14, fontWeight: 800, color: '#fff',
            background: canGenerate
              ? 'linear-gradient(135deg,#4f7fff,#a855f7)'
              : 'rgba(255,255,255,0.06)',
            border: 'none',
            boxShadow: canGenerate ? '0 6px 30px rgba(79,127,255,0.4)' : 'none',
            cursor: canGenerate ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            opacity: gerando ? 0.7 : 1,
          }}
        >
          <Wand2 style={{ width: 18, height: 18 }} />
          {gerando ? 'Gerando sua capa...' : 'Gerar Capa'}
        </button>
      </div>
    </div>
  )
}
