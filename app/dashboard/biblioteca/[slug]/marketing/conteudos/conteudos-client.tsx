'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, CheckCircle2, Megaphone, Instagram, Mail, ShoppingCart, Globe, FileText, Star, Sparkles } from 'lucide-react'

const CONTEUDOS = [
  {
    id: 'posts-ig',
    icon: Instagram,
    label: 'Posts para Instagram',
    desc: '12 posts prontos para publicar',
    detalhes: ['Legenda otimizada', 'Sugestão de hashtags', 'Design do card incluso'],
    cor: '#e1306c',
  },
  {
    id: 'stories',
    icon: Instagram,
    label: 'Stories e Reels',
    desc: '8 roteiros de Stories + 4 ideias de Reels',
    detalhes: ['Scripts palavra por palavra', 'Trilha sonora sugerida', 'CTA personalizado'],
    cor: '#f77f00',
  },
  {
    id: 'amazon',
    icon: ShoppingCart,
    label: 'Descrição Amazon / Shopee',
    desc: 'Página de vendas otimizada para marketplaces',
    detalhes: ['Título SEO-ready', 'Bullets persuasivos', 'Descrição longa emocional'],
    cor: '#ff9900',
  },
  {
    id: 'email',
    icon: Mail,
    label: 'Sequência de E-mails',
    desc: '5 e-mails de lançamento em sequência',
    detalhes: ['E-mail de pré-lançamento', 'Dia do lançamento', 'Follow-up de vendas'],
    cor: '#4f7fff',
  },
  {
    id: 'landing',
    icon: Globe,
    label: 'Textos para Landing Page',
    desc: 'Copy completa para sua página de vendas',
    detalhes: ['Headline impactante', 'Seção de benefícios', 'Depoimentos sugeridos', 'CTA final'],
    cor: '#a855f7',
  },
  {
    id: 'press',
    icon: FileText,
    label: 'Press Release',
    desc: 'Nota de imprensa para blogs e portais',
    detalhes: ['Formato jornalístico', 'Bio do autor inclusa', 'Contato para assessoria'],
    cor: '#10b981',
  },
  {
    id: 'resenha',
    icon: Star,
    label: 'Roteiro de Resenha',
    desc: 'Guia para reviewers e influenciadores',
    detalhes: ['Pontos-chave do livro', 'Perguntas sugeridas', 'Template de resenha'],
    cor: '#f59e0b',
  },
  {
    id: 'google',
    icon: Globe,
    label: 'Anúncio Google / Meta Ads',
    desc: '6 variações de copy para anúncios pagos',
    detalhes: ['Headlines A/B testáveis', 'Descrições curtas', 'Textos para remarketing'],
    cor: '#ef4444',
  },
]

interface Props { slug: string; titulo: string; nomeAutor: string }

export function ConteudosClient({ slug, titulo, nomeAutor }: Props) {
  const [selecionados, setSelecionados] = useState<string[]>([])

  const toggle = (id: string) => {
    setSelecionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const todos = selecionados.length === CONTEUDOS.length
  const toggleTodos = () => setSelecionados(todos ? [] : CONTEUDOS.map(c => c.id))

  return (
    <div style={{ minHeight: '100vh', background: '#080e24', color: 'white', paddingBottom: 100 }}>

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(8,14,36,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
          <Link href={`/dashboard/biblioteca/${slug}/marketing`}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#5a6a84', textDecoration: 'none' }}>
            <ArrowLeft style={{ width: 14, height: 14 }} /> Voltar
          </Link>
          <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#4f7fff' }}>
            Kit de Marketing
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 18,
            borderRadius: 999, padding: '6px 18px',
            background: 'rgba(79,127,255,0.1)', border: '1px solid rgba(79,127,255,0.2)',
            fontSize: 10, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#4f7fff',
          }}>
            <Megaphone style={{ width: 12, height: 12 }} /> Divulgação
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>
            O que você quer no seu Kit?
          </h1>
          <p style={{ fontSize: 13, color: '#5a6a84', margin: '0 0 24px', lineHeight: 1.7 }}>
            Selecione os conteúdos de marketing para <strong style={{ color: '#8a9ab8' }}>{titulo}</strong>
          </p>

          {/* Step indicator */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, borderRadius: 999, background: '#0d1220', border: '1px solid rgba(255,255,255,0.07)', padding: '6px 6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 999 }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,229,195,0.15)', border: '1px solid rgba(0,229,195,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 style={{ width: 11, height: 11, color: '#00e5c3' }} />
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#00e5c3' }}>Personalizar</span>
            </div>
            <ChevronRight style={{ width: 14, height: 14, color: '#3a4a60', margin: '0 4px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 999, background: 'rgba(79,127,255,0.15)', border: '1px solid rgba(79,127,255,0.3)' }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#4f7fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff', flexShrink: 0 }}>2</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#4f7fff' }}>Escolher conteúdos</span>
            </div>
          </div>
        </div>

        {/* Toggle todos */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#5a6a84', margin: 0 }}>
            Escolha os conteúdos
          </p>
          <button
            onClick={toggleTodos}
            style={{
              fontSize: 11, fontWeight: 700, color: '#4f7fff',
              background: 'rgba(79,127,255,0.08)', border: '1px solid rgba(79,127,255,0.2)',
              borderRadius: 999, padding: '5px 14px', cursor: 'pointer',
            }}
          >
            {todos ? 'Desmarcar todos' : 'Selecionar todos'}
          </button>
        </div>

        {/* Grid de conteúdos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginBottom: 40 }}>
          {CONTEUDOS.map(c => {
            const Icon = c.icon
            const sel = selecionados.includes(c.id)
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                style={{
                  borderRadius: 14, padding: '16px', textAlign: 'left' as const, cursor: 'pointer',
                  background: sel ? 'rgba(79,127,255,0.07)' : '#0a101e',
                  border: sel ? '2px solid #4f7fff' : '1px solid rgba(255,255,255,0.07)',
                  transition: 'all 0.15s',
                  boxShadow: sel ? '0 0 0 3px rgba(79,127,255,0.12)' : 'none',
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: `${c.cor}18`, border: `1px solid ${c.cor}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon style={{ width: 16, height: 16, color: c.cor }} strokeWidth={2} />
                  </div>
                  {sel && <CheckCircle2 style={{ width: 16, height: 16, color: '#4f7fff', flexShrink: 0 }} />}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: sel ? '#fff' : '#c0d0e0', margin: '0 0 4px' }}>{c.label}</p>
                  <p style={{ fontSize: 11, color: '#5a6a84', margin: '0 0 10px', lineHeight: 1.4 }}>{c.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {c.detalhes.map((d, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: c.cor, flexShrink: 0 }} />
                        <span style={{ fontSize: 10, color: '#4a5a70' }}>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Preço e destaque */}
        <div style={{
          borderRadius: 20, padding: '28px 32px', marginBottom: 20,
          background: 'linear-gradient(135deg,#0a1840,#0d2060)',
          border: '1px solid rgba(79,127,255,0.2)',
          boxShadow: '0 8px 40px rgba(79,127,255,0.12)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Sparkles style={{ width: 16, height: 16, color: '#4f7fff' }} />
                <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#4f7fff' }}>
                  Kit Completo Aurora
                </span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>
                {selecionados.length === 0
                  ? 'Selecione ao menos 1 conteúdo'
                  : `${selecionados.length} conteúdo${selecionados.length > 1 ? 's' : ''} selecionado${selecionados.length > 1 ? 's' : ''}`}
              </h2>
              <p style={{ fontSize: 13, color: '#5a6a84', margin: 0, lineHeight: 1.6 }}>
                Gerado pela Aurora com suas preferências personalizadas
              </p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontSize: 12, color: '#5a6a84', margin: '0 0 4px', textDecoration: 'line-through' }}>de R$497,00</p>
              <p style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: '0 0 2px', lineHeight: 1 }}>R$197,00</p>
              <p style={{ fontSize: 11, color: '#4f7fff', margin: 0 }}>pagamento único</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(79,127,255,0.15)', marginTop: 20, paddingTop: 20, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {['✅ Pronto em minutos', '✅ 100% personalizado para seu livro', '✅ Arquivos editáveis inclusos', '✅ Suporte por 30 dias'].map((item, i) => (
              <span key={i} style={{ fontSize: 11, color: '#6a7a96', background: 'rgba(255,255,255,0.04)', borderRadius: 999, padding: '4px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                {item}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Barra inferior fixa */}
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
          <span style={{ fontSize: 12, color: '#4a5a70', flex: 1 }}>
            {selecionados.length === 0
              ? 'Selecione ao menos um conteúdo para continuar'
              : <><span style={{ color: '#4f7fff', fontWeight: 700 }}>{selecionados.length}</span> {selecionados.length > 1 ? 'conteúdos' : 'conteúdo'} no seu kit</>}
          </span>
          <button
            disabled={selecionados.length === 0}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              borderRadius: 12, padding: '11px 24px', fontSize: 13, fontWeight: 800, color: '#fff',
              background: selecionados.length > 0
                ? 'linear-gradient(135deg,#1a3a8f,#4f7fff)'
                : 'rgba(255,255,255,0.05)',
              border: 'none', cursor: selecionados.length > 0 ? 'pointer' : 'not-allowed',
              boxShadow: selecionados.length > 0 ? '0 4px 20px rgba(79,127,255,0.35)' : 'none',
              opacity: selecionados.length === 0 ? 0.4 : 1,
              transition: 'all 0.15s',
            }}
          >
            Gerar meu Kit de Marketing →
          </button>
        </div>
      </div>

    </div>
  )
}
