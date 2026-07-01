'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Sparkles, Wand2, CheckCircle2 } from 'lucide-react'

interface Props {
  slug: string
  titulo: string
  subtitulo?: string
  sinopse?: string
  nomeAutor: string
}

/* ── Dados ───────────────────────────────────────────────────────── */

const ESTILOS = [
  { id: 'artistico',   label: 'Artístico',    desc: 'Pintura e expressão artística',    img: '/capa-cards/estilos/Artistico.webp',    gradient: 'linear-gradient(135deg,#1a0533,#6b21a8,#c026d3)' },
  { id: 'realista',    label: 'Realista',      desc: 'Fotográfico e realista',           img: '/capa-cards/estilos/Realismo.webp',     gradient: 'linear-gradient(135deg,#0c1a2e,#1e3a5f,#2563eb)' },
  { id: 'minimalista', label: 'Minimalista',   desc: 'Limpo e minimalista',              img: '/capa-cards/estilos/Minimalista.webp',  gradient: 'linear-gradient(135deg,#111827,#1f2937,#374151)' },
  { id: 'ilustrado',   label: 'Ilustrado',     desc: 'Ilustração artística',             img: '/capa-cards/estilos/Ilustrado.webp',    gradient: 'linear-gradient(135deg,#064e3b,#065f46,#10b981)' },
  { id: 'abstrato',    label: 'Abstrato',      desc: 'Formas e movimento',               img: '/capa-cards/estilos/Abstrato.webp',     gradient: 'linear-gradient(135deg,#1e1b4b,#3730a3,#6366f1)' },
  { id: 'classico',    label: 'Clássico',      desc: 'Elegante e tradicional',           img: '/capa-cards/estilos/Classico.webp',     gradient: 'linear-gradient(135deg,#1c0a00,#78350f,#d97706)' },
]

const CORES = [
  { id: 'quentes',  label: 'Cores Quentes',       desc: 'Vermelho, laranja, dourado',    img: '/capa-cards/cores/Cores%20Quentes.webp',          gradient: 'linear-gradient(135deg,#7c2d12,#dc2626,#f59e0b)' },
  { id: 'frias',    label: 'Cores Frias',          desc: 'Azul, lilás, turquesa',         img: '/capa-cards/cores/Cores%20Frias.webp',            gradient: 'linear-gradient(135deg,#0c4a6e,#0891b2,#818cf8)' },
  { id: 'escuro',   label: 'Escuro e Misterioso',  desc: 'Preto, roxo escuro, carmesim', img: '/capa-cards/cores/Escuro%20e%20Misterioso.webp',  gradient: 'linear-gradient(135deg,#0f0014,#3b0764,#7f1d1d)' },
  { id: 'natural',  label: 'Natural e Terroso',    desc: 'Verde, marrom, bege',           img: '/capa-cards/cores/Natural.webp',                  gradient: 'linear-gradient(135deg,#14532d,#3f6212,#78350f)' },
  { id: 'vibrante', label: 'Vibrante e Colorido',  desc: 'Brilhante e multicolorido',    img: '/capa-cards/cores/Vibrante%20e%20Colorido.webp',  gradient: 'linear-gradient(135deg,#7c3aed,#db2777,#f59e0b)' },
  { id: 'neutro',   label: 'Neutro e Elegante',    desc: 'Branco, cinza, prateado',      img: '/capa-cards/cores/Neutro%20e%20Elegante.webp',    gradient: 'linear-gradient(135deg,#1f2937,#4b5563,#9ca3af)' },
]

const ELEMENTOS = [
  { id: 'pessoa',    label: 'Pessoa / Personagem',  desc: 'Figura humana em destaque',  img: '/capa-cards/elementos/pessoa.jpg',    gradient: 'linear-gradient(135deg,#1e1b4b,#312e81,#4338ca)', emoji: '🧍' },
  { id: 'paisagem',  label: 'Paisagem / Cenário',   desc: 'Ambiente ou natureza',        img: '/capa-cards/elementos/paisagem.jpg',  gradient: 'linear-gradient(135deg,#0c4a6e,#155e75,#164e63)', emoji: '🏔️' },
  { id: 'objeto',    label: 'Objeto Simbólico',     desc: 'Item com significado',        img: '/capa-cards/elementos/objeto.jpg',    gradient: 'linear-gradient(135deg,#3b0764,#6b21a8,#a21caf)', emoji: '🔮' },
  { id: 'abstrato',  label: 'Formas Abstratas',     desc: 'Geometria e texturas',        img: '/capa-cards/elementos/abstrato.jpg',  gradient: 'linear-gradient(135deg,#1e3a5f,#1e40af,#3b82f6)', emoji: '🌀' },
  { id: 'tipografia',label: 'Apenas Tipografia',    desc: 'Texto como elemento visual',  img: '/capa-cards/elementos/tipografia.jpg',gradient: 'linear-gradient(135deg,#111827,#1f2937,#111827)', emoji: 'Aa' },
]

const FONTES = [
  { id: 'serifada',   label: 'Serifada',     desc: 'Clássica e elegante',   style: { fontFamily: 'Georgia, serif',             fontSize: '28px', letterSpacing: '-0.02em' } },
  { id: 'sem-serifa', label: 'Sem Serifa',   desc: 'Moderna e limpa',       style: { fontFamily: 'Arial, sans-serif',           fontSize: '28px', letterSpacing: '-0.01em', fontWeight: 800 } },
  { id: 'cursiva',    label: 'Cursiva',      desc: 'Sofisticada e fluida',  style: { fontFamily: 'Georgia, serif',             fontSize: '28px', fontStyle: 'italic' } },
  { id: 'display',    label: 'Display Bold', desc: 'Impactante e forte',    style: { fontFamily: 'Impact, sans-serif',         fontSize: '28px', letterSpacing: '0.05em' } },
  { id: 'manuscrita', label: 'Manuscrita',   desc: 'Pessoal e orgânica',    style: { fontFamily: "'Brush Script MT', cursive", fontSize: '28px' } },
  { id: 'geometrica', label: 'Geométrica',   desc: 'Futurista e precisa',   style: { fontFamily: 'Trebuchet MS, sans-serif',   fontSize: '26px', letterSpacing: '0.15em', fontWeight: 700 } },
]

const COR_FONTE = [
  { id: 'branco',    label: 'Branco',       hex: '#FFFFFF' },
  { id: 'preto',     label: 'Preto',        hex: '#111111' },
  { id: 'dourado',   label: 'Dourado',      hex: '#D4A017' },
  { id: 'prateado',  label: 'Prateado',     hex: '#C0C0C0' },
  { id: 'creme',     label: 'Creme',        hex: '#F5F0DC' },
  { id: 'vermelho',  label: 'Vermelho',     hex: '#DC2626' },
  { id: 'azul',      label: 'Azul Marinho', hex: '#1E40AF' },
  { id: 'esmeralda', label: 'Esmeralda',    hex: '#059669' },
]

/* ── Sub-componentes ─────────────────────────────────────────────── */

function SectionTitle({ number, title, optional }: { number: string; title: string; optional?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg,#4f7fff,#a855f7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', fontWeight: 900, color: '#fff',
      }}>{number}</div>
      <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: 0 }}>
        {title}
        {optional && <span style={{ fontSize: '11px', fontWeight: 500, color: '#5a6a84', marginLeft: 8 }}>(opcional)</span>}
      </h2>
    </div>
  )
}

function VisualCard({
  img, gradient, label, desc, selected, onClick, tall,
}: {
  img: string; gradient: string; label: string; desc: string
  selected: boolean; onClick: () => void; tall?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative', border: 'none', padding: 0, cursor: 'pointer', outline: 'none',
        borderRadius: 16, overflow: 'hidden', background: 'transparent',
        outline: selected ? '2px solid #4f7fff' : '2px solid rgba(255,255,255,0.07)',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
        transition: 'outline 0.15s, transform 0.12s',
        boxShadow: selected ? '0 0 0 4px rgba(79,127,255,0.2)' : 'none',
      } as React.CSSProperties}
    >
      {/* Imagem ou gradiente */}
      <div style={{ position: 'relative', height: tall ? 180 : 150, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: gradient }} />
        <img
          src={img}
          alt={label}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Overlay escuro na parte inferior para legibilidade */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)',
        }} />
        {/* Label sobre a imagem */}
        <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12 }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.2 }}>{label}</p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', margin: '3px 0 0', lineHeight: 1.3 }}>{desc}</p>
        </div>
      </div>

      {/* Check */}
      {selected && (
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: '#4f7fff', borderRadius: '50%', padding: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CheckCircle2 style={{ width: 14, height: 14, color: '#fff' }} />
        </div>
      )}
    </button>
  )
}

/* ── Main ────────────────────────────────────────────────────────── */

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
    setTimeout(() => setGerando(false), 3000)
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 100, background: '#080e24', color: 'white' }}>

      {/* ── Top bar ──────────────────────────────────────────────── */}
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
          <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#4f7fff' }}>
            Cover Studio
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px', display: 'flex', flexDirection: 'column', gap: 48 }}>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            borderRadius: 999, padding: '6px 16px', marginBottom: 16,
            background: 'rgba(79,127,255,0.1)', color: '#4f7fff',
            border: '1px solid rgba(79,127,255,0.2)', fontSize: 10, fontWeight: 900,
            textTransform: 'uppercase', letterSpacing: '0.15em',
          }}>
            <Sparkles style={{ width: 12, height: 12 }} /> Personalize sua capa
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 0 8px', lineHeight: 1.2 }}>{titulo}</h1>
          <p style={{ fontSize: 13, color: '#5a6a84', margin: 0 }}>Conte como você imagina a capa ideal</p>
        </div>

        {/* ── Info do livro ─────────────────────────────────────── */}
        <div style={{
          borderRadius: 14, padding: '14px 18px',
          background: '#0d1220', border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <Sparkles style={{ width: 14, height: 14, color: '#4f7fff', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#4f7fff', marginBottom: 6 }}>
              A Aurora já sabe sobre seu livro
            </p>
            <p style={{ fontSize: 12, color: '#6a7a96', lineHeight: 1.6, margin: 0 }}>
              <span style={{ fontWeight: 700, color: '#a0b0c8' }}>Título:</span> {titulo}
              {nomeAutor && <> · <span style={{ fontWeight: 700, color: '#a0b0c8' }}>Autor:</span> {nomeAutor}</>}
              {sinopse && <><br /><span style={{ fontWeight: 700, color: '#a0b0c8' }}>Sinopse:</span> {sinopse.slice(0, 140)}…</>}
            </p>
          </div>
        </div>

        {/* ── 1. Estilo ─────────────────────────────────────────── */}
        <div>
          <SectionTitle number="1" title="Que estilo você imagina para sua capa?" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {ESTILOS.map(e => (
              <VisualCard
                key={e.id}
                img={e.img}
                gradient={e.gradient}
                label={e.label}
                desc={e.desc}
                selected={estilo === e.id}
                onClick={() => setEstilo(e.id)}
                tall
              />
            ))}
          </div>
        </div>

        {/* ── 2. Cores ─────────────────────────────────────────── */}
        <div>
          <SectionTitle number="2" title="Quais cores representam melhor seu livro?" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {CORES.map(c => (
              <VisualCard
                key={c.id}
                img={c.img}
                gradient={c.gradient}
                label={c.label}
                desc={c.desc}
                selected={cores === c.id}
                onClick={() => setCores(c.id)}
              />
            ))}
          </div>
        </div>

        {/* ── 3. Elemento ───────────────────────────────────────── */}
        <div>
          <SectionTitle number="3" title="O que gostaria de ver na capa?" optional />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {ELEMENTOS.map(el => (
              <VisualCard
                key={el.id}
                img={el.img}
                gradient={el.gradient}
                label={el.label}
                desc={el.desc}
                selected={elemento === el.id}
                onClick={() => setElemento(el.id === elemento ? '' : el.id)}
              />
            ))}
          </div>
        </div>

        {/* ── 4. Fonte ─────────────────────────────────────────── */}
        <div>
          <SectionTitle number="4" title="Estilo da fonte do título" optional />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {FONTES.map(f => (
              <button
                key={f.id}
                onClick={() => setFonte(f.id === fonte ? '' : f.id)}
                style={{
                  borderRadius: 14, padding: '24px 16px', cursor: 'pointer', border: 'none',
                  outline: fonte === f.id ? '2px solid #4f7fff' : '2px solid rgba(255,255,255,0.07)',
                  background: fonte === f.id ? 'rgba(79,127,255,0.08)' : '#0d1220',
                  boxShadow: fonte === f.id ? '0 0 0 4px rgba(79,127,255,0.15)' : 'none',
                  transform: fonte === f.id ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.15s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
                } as React.CSSProperties}
              >
                <span style={{ ...f.style, color: '#fff', lineHeight: 1.1 }}>ABCDEF</span>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', margin: '0 0 3px' }}>{f.label}</p>
                  <p style={{ fontSize: 11, color: '#5a6a84', margin: 0 }}>{f.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── 5. Cor da fonte ──────────────────────────────────── */}
        <div>
          <SectionTitle number="5" title="Cor da fonte" optional />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {COR_FONTE.map(c => (
              <button key={c.id} onClick={() => setCorFonte(c.id === corFonte ? '' : c.id)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                <div style={{
                  width: 50, height: 50, borderRadius: '50%', background: c.hex,
                  border: corFonte === c.id ? '3px solid #4f7fff' : c.id === 'branco' ? '2px solid rgba(255,255,255,0.2)' : '2px solid transparent',
                  boxShadow: corFonte === c.id ? '0 0 0 3px rgba(79,127,255,0.25)' : 'none',
                  transition: 'all 0.15s',
                }} />
                <span style={{ fontSize: 11, color: corFonte === c.id ? '#fff' : '#5a6a84', fontWeight: corFonte === c.id ? 700 : 400 }}>{c.label}</span>
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
              width: '100%', borderRadius: 12, padding: '14px 16px', boxSizing: 'border-box',
              background: '#0d1220', border: '1px solid rgba(255,255,255,0.08)',
              color: '#a0b0c8', fontSize: 13, resize: 'none', outline: 'none',
              fontFamily: 'inherit', lineHeight: 1.6,
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(79,127,255,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
          <p style={{ textAlign: 'right', fontSize: 10, color: '#3a4a60', marginTop: 4 }}>{descricao.length}/500</p>
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
              width: '100%', borderRadius: 12, padding: '14px 16px', boxSizing: 'border-box',
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
          <p style={{ fontSize: 11, color: '#5a6a84', margin: 0 }}>
            Selecione um estilo e uma paleta de cores para continuar
          </p>
        )}
        <button
          onClick={handleGerar}
          disabled={!canGenerate || gerando}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            borderRadius: 14, padding: '14px 40px', fontSize: 15, fontWeight: 800, color: '#fff',
            background: canGenerate ? 'linear-gradient(135deg,#4f7fff,#a855f7)' : 'rgba(255,255,255,0.06)',
            border: 'none',
            boxShadow: canGenerate ? '0 6px 30px rgba(79,127,255,0.4)' : 'none',
            cursor: canGenerate ? 'pointer' : 'not-allowed',
            opacity: gerando ? 0.7 : 1,
            transition: 'all 0.2s',
          }}
        >
          <Wand2 style={{ width: 18, height: 18 }} />
          {gerando ? 'Gerando sua capa...' : 'Gerar Capa'}
        </button>
      </div>
    </div>
  )
}
