'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Shield, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { CheckoutButton } from '@/components/checkout-button'

const PROBLEMAS = [
  { titulo: 'Livrarias físicas não vão te aceitar.', desc: 'Nenhuma. Saraiva, Cultura, Travessa — nenhuma vende livro sem ISBN.' },
  { titulo: 'A Amazon te dá um código grátis — mas ele NÃO é seu.', desc: 'Você não pode levar pra outra plataforma. Se a Amazon te banir amanhã, você perde tudo.' },
  { titulo: 'Bibliotecas não catalogam.', desc: 'Seu livro nunca vai entrar em escola, universidade, biblioteca pública. Você fica fora de licitações milionárias.' },
  { titulo: 'Distribuidoras não trabalham com você.', desc: 'Sem ISBN, você é amador. Com ISBN, você é autor profissional.' },
  { titulo: 'Imprensa não vai te divulgar.', desc: 'Jornalistas, blogs, podcasts especializados pedem ISBN antes de qualquer matéria.' },
]

const ENTREGAVEIS = [
  'Número ISBN oficial registrado em seu nome',
  'Certificado digital de registro (PDF profissional com sua capa)',
  'Guia completo de publicação (Amazon KDP, Apple Books, Google Play, Kobo e mais)',
]

const PLATAFORMAS = [
  { nome: 'Amazon KDP', emoji: '📦' },
  { nome: 'Apple Books', emoji: '🍎' },
  { nome: 'Google Play Livros', emoji: '📚' },
  { nome: 'Kobo', emoji: '📖' },
  { nome: 'Barnes & Noble', emoji: '🏛️' },
  { nome: 'Livrarias Físicas', emoji: '🏪' },
]

const FAQS = [
  { q: 'Por que não usar o código grátis da Amazon?', r: 'O código da Amazon é deles, não seu. Se sua conta for suspensa ou você quiser migrar, perde tudo. Com seu próprio ISBN, o livro é seu em qualquer lugar.' },
  { q: 'Quanto tempo leva?', r: 'O registro na Câmara Brasileira do Livro leva em média 7 dias úteis. Você recebe o ISBN por e-mail assim que for emitido.' },
  { q: 'Preciso enviar algum documento?', r: 'Não. A Aurora cuida de toda a burocracia. Você só confirma os dados do livro — nós fazemos o resto.' },
  { q: 'E se eu quiser usar o ISBN em outra plataforma depois?', r: 'Sem problema. O ISBN é seu para sempre e funciona em qualquer plataforma do mundo.' },
  { q: 'Tem alguma taxa escondida?', r: 'Nenhuma. R$ 199,99 inclui honorário, taxas oficiais da Câmara Brasileira do Livro e o certificado digital. Sem surpresas.' },
]

function Faq({ q, r }: { q: string; r: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: open ? 'rgba(249,115,22,0.04)' : '#0d1220' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{q}</span>
        {open ? <ChevronUp style={{ width: 16, height: 16, color: '#f97316', flexShrink: 0 }} /> : <ChevronDown style={{ width: 16, height: 16, color: '#5a6a84', flexShrink: 0 }} />}
      </button>
      {open && <div style={{ padding: '0 20px 16px' }}><p style={{ fontSize: 13, color: '#6a7a96', lineHeight: 1.7, margin: 0 }}>{r}</p></div>}
    </div>
  )
}

export function IsbnClient({ slug, titulo }: { slug: string; titulo: string }) {
  return (
    <div style={{ minHeight: '100vh', background: '#080e24', color: 'white', paddingBottom: 80 }}>

      {/* Top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(8,14,36,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
          <Link href={`/dashboard/biblioteca/${slug}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#5a6a84', textDecoration: 'none' }}>
            <ArrowLeft style={{ width: 14, height: 14 }} /> Voltar ao livro
          </Link>
          <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#f97316' }}>ISBN Oficial</span>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px', display: 'flex', flexDirection: 'column', gap: 48 }}>

        {/* Hero */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24, borderRadius: 999, padding: '5px 14px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', fontSize: 10, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#f97316' }}>
            <AlertTriangle style={{ width: 11, height: 11 }} /> Registro Oficial — Aurora
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', margin: '0 0 16px', lineHeight: 1.15 }}>
            Sem ISBN, seu livro{' '}<span style={{ color: '#f97316' }}>oficialmente<br />não existe.</span>
          </h1>
          <p style={{ fontSize: 14, color: '#6a7a96', lineHeight: 1.7, margin: '0 0 12px', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            O ISBN é o <strong style={{ color: '#a0b0c8' }}>CPF do seu livro</strong>. É o que diz pro mundo inteiro — Amazon, Apple Books, Google Play, Kobo, bibliotecas, livrarias físicas — que esse livro é <strong style={{ color: '#fff' }}>seu</strong>, que ele existe legalmente, e que pode ser vendido em <strong style={{ color: '#fff' }}>qualquer lugar do planeta</strong>.
          </p>
          <p style={{ fontSize: 13, color: '#4a5a70', fontStyle: 'italic' }}>Vamos registrar o ISBN de: <strong style={{ color: '#a0b0c8' }}>"{titulo}"</strong></p>
        </div>

        {/* A verdade */}
        <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(127,29,29,0.08)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(239,68,68,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle style={{ width: 16, height: 16, color: '#ef4444' }} />
              <h2 style={{ fontSize: 15, fontWeight: 900, color: '#fff', margin: 0 }}>A verdade que ninguém te conta</h2>
            </div>
            <p style={{ fontSize: 13, color: '#6a7a96', margin: '8px 0 0', lineHeight: 1.6 }}>Você passou semanas escrevendo. Investiu na capa, na revisão, no marketing. Mas se você tentar publicar seu livro <strong style={{ color: '#ef4444' }}>sem ISBN</strong>:</p>
          </div>
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {PROBLEMAS.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 12 }}>
                <XCircle style={{ width: 16, height: 16, color: '#ef4444', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#f87171', margin: '0 0 3px' }}>{p.titulo}</p>
                  <p style={{ fontSize: 12, color: '#6a7a96', margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ margin: '0 24px 20px', borderRadius: 10, padding: '14px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <p style={{ fontSize: 12, color: '#fca5a5', lineHeight: 1.6, margin: 0 }}>Resumindo: sem ISBN, seu livro <strong>não é vendável de verdade</strong>. Você fica preso a uma única plataforma, sem prova de autoria, sem entrar no mercado profissional.</p>
          </div>
        </div>

        {/* A gente cuida */}
        <div style={{ borderRadius: 20, padding: '28px', background: '#0d1220', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Shield style={{ width: 18, height: 18, color: '#00e5c3' }} />
            <h2 style={{ fontSize: 16, fontWeight: 900, color: '#fff', margin: 0 }}>A gente cuida de tudo. Você só recebe pronto.</h2>
          </div>
          <p style={{ fontSize: 13, color: '#6a7a96', lineHeight: 1.7, margin: '0 0 24px' }}>Um agente especializado da Aurora vai registrar seu ISBN oficial direto na Câmara Brasileira do Livro. Sem você precisar entender de nada, sem formulários gigantes, sem ligar pra órgão nenhum.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[
              { icon: '🤝', title: 'Você não envia nada', desc: 'A gente cuida de tudo por aqui' },
              { icon: '💰', title: 'Nós pagamos as taxas', desc: 'Todas as taxas oficiais por conta da Aurora' },
              { icon: '✅', title: '100% seus direitos', desc: 'ISBN no seu nome. Qualquer plataforma' },
            ].map((b, i) => (
              <div key={i} style={{ borderRadius: 12, padding: '16px 12px', textAlign: 'center', background: 'rgba(0,229,195,0.04)', border: '1px solid rgba(0,229,195,0.12)' }}>
                <span style={{ fontSize: 22, display: 'block', marginBottom: 8 }}>{b.icon}</span>
                <p style={{ fontSize: 11, fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>{b.title}</p>
                <p style={{ fontSize: 10, color: '#5a6a84', margin: 0, lineHeight: 1.4 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Entregáveis */}
        <div style={{ borderRadius: 20, padding: '28px', background: '#0d1220', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 900, color: '#fff', margin: '0 0 20px' }}>O que você recebe (tudo incluído)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {ENTREGAVEIS.map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: 'rgba(0,229,195,0.12)', border: '1px solid rgba(0,229,195,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 style={{ width: 12, height: 12, color: '#00e5c3' }} />
                </div>
                <span style={{ fontSize: 13, color: '#a0b0c8', lineHeight: 1.5 }}>{e}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plataformas */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>Com seu ISBN, seu livro entra em qualquer lugar</h2>
          <p style={{ fontSize: 13, color: '#5a6a84', margin: '0 0 24px' }}>Mais de 240 mil livrarias no mundo todo aceitam o padrão ISBN</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
            {PLATAFORMAS.map((p, i) => (
              <div key={i} style={{ borderRadius: 12, padding: '16px 12px', textAlign: 'center', background: '#0d1220', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: 24, display: 'block', marginBottom: 6 }}>{p.emoji}</span>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#a0b0c8', margin: 0 }}>{p.nome}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparativo */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: '#fff', textAlign: 'center', margin: '0 0 20px' }}>Faz a conta com a gente.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ borderRadius: 16, padding: '20px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#ef4444', margin: '0 0 16px' }}>😰 Por fora, com despachante</p>
              {[['Honorário do despachante','R$ 450,00'],['Taxas dos órgãos oficiais','R$ 90,00'],['Burocracia & envios','R$ 80,00'],['3 a 4 semanas de registro','+stress']].map(([l,v],i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: '#6a7a96' }}>{l}</span>
                  <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 700 }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(239,68,68,0.2)', paddingTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>Total</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#ef4444' }}>R$ 600+</span>
                </div>
              </div>
            </div>
            <div style={{ borderRadius: 16, padding: '20px', background: 'linear-gradient(135deg,rgba(249,115,22,0.08),rgba(249,115,22,0.04))', border: '1px solid rgba(249,115,22,0.3)' }}>
              <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#f97316', margin: '0 0 16px' }}>⚡ Com a Aurora, tudo incluído</p>
              {[['Honorário do especialista','Incluso'],['Taxas dos órgãos oficiais','A gente paga'],['Burocracia & envios','A gente cuida'],['Acompanhamento na plataforma','7 dias']].map(([l,v],i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: '#6a7a96' }}>{l}</span>
                  <span style={{ fontSize: 12, color: '#00e5c3', fontWeight: 700 }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(249,115,22,0.2)', paddingTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>Você paga apenas</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: '#f97316' }}>R$ 199,99</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Principal */}
        <div style={{ borderRadius: 20, padding: '40px 32px', textAlign: 'center', background: 'linear-gradient(135deg,#1c0a00,#2d1200,#1a0800)', border: '1px solid rgba(249,115,22,0.35)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,0.2),transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16, borderRadius: 999, padding: '4px 14px', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', fontSize: 10, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#f97316' }}>
              <Sparkles style={{ width: 10, height: 10 }} /> Oferta direta da Aurora
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>Quer seu ISBN oficial em 7 dias úteis?</h2>
            <p style={{ fontSize: 13, color: '#6a7a96', margin: '0 0 24px', lineHeight: 1.6 }}>Um único pagamento e a gente cuida de tudo. Sem mensalidade, sem letra miúda, sem surpresa.</p>
            <div style={{ margin: '0 0 24px' }}>
              <span style={{ fontSize: 16, color: '#4a5a70', textDecoration: 'line-through' }}>R$ 600,00</span>
              <div style={{ fontSize: 48, fontWeight: 900, color: '#f97316', lineHeight: 1.1 }}>R$ 199,99</div>
              <p style={{ fontSize: 12, color: '#5a6a84', marginTop: 4 }}>PIX + Cartão + Créditos</p>
            </div>
            <CheckoutButton slug={slug} title={`ISBN — ${titulo}`} amount={199.99}>
              🔖 Quero meu ISBN agora
            </CheckoutButton>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 14, flexWrap: 'wrap' }}>
              {['7 dias úteis', 'Garantia Aurora oficial', '100% seus direitos'].map((t, i) => (
                <span key={i} style={{ fontSize: 11, color: '#6a7a96', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 style={{ width: 11, height: 11, color: '#00e5c3' }} /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#fff', textAlign: 'center', margin: '0 0 20px' }}>Dúvidas que todo autor tem</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQS.map((f, i) => <Faq key={i} q={f.q} r={f.r} />)}
          </div>
        </div>

      </div>
    </div>
  )
}
