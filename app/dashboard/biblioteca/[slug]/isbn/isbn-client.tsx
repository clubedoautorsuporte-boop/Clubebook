'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle, CheckCircle2, XCircle, Clock, Globe, BookOpen } from 'lucide-react'
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
  'Certificado digital Aurora de registro (PDF profissional com sua capa)',
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
  { q: 'E se eu quiser sacar o ISBN pra outra plataforma depois?', r: 'Sem problema. O ISBN é seu para sempre e funciona em qualquer plataforma do mundo.' },
  { q: 'Tem alguma taxa escondida?', r: 'Nenhuma. R$ 199,99 inclui honorário, taxas oficiais da Câmara Brasileira do Livro e o certificado digital. Sem surpresas.' },
]

function FaqItem({ q, r }: { q: string; r: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)',
      background: '#0d1117', overflow: 'hidden',
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 20px', background: 'transparent', border: 'none', cursor: 'pointer',
        textAlign: 'left', gap: 16,
      }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: '#e0e8f0', lineHeight: 1.4 }}>{q}</span>
        <span style={{
          width: 26, height: 26, borderRadius: 6, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: open ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.06)',
          color: open ? '#f59e0b' : '#5a6a84',
          fontSize: 18, fontWeight: 300,
        }}>
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 20px 18px' }}>
          <p style={{ fontSize: 13, color: '#6a7a96', lineHeight: 1.7, margin: 0 }}>{r}</p>
        </div>
      )}
    </div>
  )
}

export function IsbnClient({ slug, titulo }: { slug: string; titulo: string }) {
  return (
    <div style={{ minHeight: '100vh', background: '#080c18', color: 'white' }}>

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(8,12,24,0.96)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 20px' }}>
          <Link href={`/dashboard/biblioteca/${slug}`} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 500, color: '#6a7a96', textDecoration: 'none',
          }}>
            <ArrowLeft style={{ width: 14, height: 14 }} /> Voltar ao livro
          </Link>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            borderRadius: 999, padding: '5px 14px',
            background: '#ef4444', fontSize: 11, fontWeight: 800,
            textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#fff',
          }}>
            📋 ISBN OFICIAL
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 20px 80px', display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* Hero */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28,
            borderRadius: 999, padding: '7px 18px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            fontSize: 11, fontWeight: 700, color: '#a0b0c8', letterSpacing: '0.08em',
          }}>
            🔒 REGISTRO OFICIAL — EQUIPE AURORA
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: '#fff', margin: '0 0 20px', lineHeight: 1.15 }}>
            Sem ISBN, seu livro{' '}
            <span style={{ color: '#f59e0b' }}>oficialmente<br />não existe.</span>
          </h1>
          <p style={{ fontSize: 15, color: '#8a9ab8', lineHeight: 1.75, margin: '0 auto 16px', maxWidth: 580 }}>
            O ISBN é o <strong style={{ color: '#e0e8f0' }}>CPF do seu livro</strong>. É o que diz pro mundo inteiro — Amazon, Apple Books, Google Play, Kobo, bibliotecas, livrarias físicas — que esse livro é <strong style={{ color: '#fff' }}>seu</strong>, que ele existe legalmente, e que ele pode ser vendido em{' '}
            <strong style={{ color: '#fff' }}>qualquer lugar do planeta</strong>.
          </p>
          <p style={{ fontSize: 13, color: '#4a5a70', fontStyle: 'italic', margin: 0 }}>
            Vamos registrar o ISBN de: <strong style={{ color: '#8a9ab8' }}>"{titulo}"</strong>
          </p>
        </div>

        {/* A verdade */}
        <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(185,28,28,0.35)', background: 'rgba(69,10,10,0.25)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(185,28,28,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle style={{ width: 18, height: 18, color: '#f87171' }} />
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: 0 }}>A verdade que ninguém te conta</h2>
            </div>
            <p style={{ fontSize: 13, color: '#8a7a7a', margin: '8px 0 0', lineHeight: 1.6 }}>
              Você passou semanas escrevendo. Investiu na capa, na revisão, no marketing. Mas se você tentar publicar seu livro <strong style={{ color: '#f87171' }}>sem ISBN</strong>:
            </p>
          </div>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {PROBLEMAS.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <XCircle style={{ width: 18, height: 18, color: '#ef4444', flexShrink: 0, marginTop: 2 }} />
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#c0c0c0' }}>
                  <strong style={{ color: '#fff' }}>{p.titulo}</strong>{' '}{p.desc}
                </p>
              </div>
            ))}
          </div>
          <div style={{ margin: '0 20px 20px', borderRadius: 10, padding: '14px 18px', background: 'rgba(185,28,28,0.2)', border: '1px solid rgba(185,28,28,0.3)' }}>
            <p style={{ fontSize: 13, color: '#fca5a5', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
              Resumindo: sem ISBN, seu livro <strong>não é vendável de verdade.</strong> Você fica preso a uma única plataforma, sem prova de autoria, sem entrar no mercado profissional.
            </p>
          </div>
        </div>

        {/* A gente cuida */}
        <div style={{ borderRadius: 16, padding: '28px', background: '#0d1117', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,197,94,0.15)' }}>
              <CheckCircle2 style={{ width: 18, height: 18, color: '#22c55e' }} />
            </div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: 0 }}>A gente cuida de tudo. Você só recebe pronto.</h2>
          </div>
          <p style={{ fontSize: 13, color: '#6a7a96', lineHeight: 1.75, margin: '0 0 24px' }}>
            Um <strong style={{ color: '#a0b0c8' }}>agente literário especializado da Equipe Aurora</strong> vai pessoalmente registrar seu ISBN oficial direto na Câmara Brasileira do Livro. Sem você precisar entender de nada, sem preencher formulário gigante, sem ligar pra órgão nenhum.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[
              { icon: '✨', title: 'Você não envia nada', desc: 'A gente usa o livro que já tá aqui na Aurora' },
              { icon: '🛡️', title: 'Nós pagamos as taxas', desc: 'Todos os custos com órgãos oficiais por conta da Aurora' },
              { icon: '👑', title: '100% seus direitos', desc: 'O ISBN é seu. Vale pra Amazon, Apple, Google, qualquer plataforma' },
            ].map((b, i) => (
              <div key={i} style={{ borderRadius: 12, padding: '18px 14px', textAlign: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: 26, display: 'block', marginBottom: 10 }}>{b.icon}</span>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#e0e8f0', margin: '0 0 5px', lineHeight: 1.3 }}>{b.title}</p>
                <p style={{ fontSize: 11, color: '#4a5a70', margin: 0, lineHeight: 1.5 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* O que você recebe */}
        <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: '#0d1117' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookOpen style={{ width: 16, height: 16, color: '#f59e0b' }} />
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>O que você recebe (tudo incluído)</h2>
          </div>
          {ENTREGAVEIS.map((e, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px',
              borderBottom: i < ENTREGAVEIS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              background: i % 2 === 0 ? '#0d1117' : '#0a0e1a',
            }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 style={{ width: 13, height: 13, color: '#22c55e' }} />
              </div>
              <span style={{ fontSize: 14, color: '#c0d0e0', lineHeight: 1.5 }}>{e}</span>
            </div>
          ))}
        </div>

        {/* Plataformas */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>Com seu ISBN, seu livro entra em qualquer lugar</h2>
          <p style={{ fontSize: 13, color: '#5a6a84', margin: '0 0 24px' }}>
            Mais de <strong style={{ color: '#8a9ab8' }}>240 mil livrarias</strong> no mundo todo aceitam o padrão ISBN
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
            {PLATAFORMAS.map((p, i) => (
              <div key={i} style={{ borderRadius: 12, padding: '20px 14px', textAlign: 'center', background: '#0d1117', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: 30, display: 'block', marginBottom: 8 }}>{p.emoji}</span>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#a0b0c8', margin: 0 }}>{p.nome}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 24 }}>
            {[
              { icon: <Globe style={{ width: 13, height: 13 }} />, text: 'Reconhecido em 160+ países' },
              { icon: <BookOpen style={{ width: 13, height: 13 }} />, text: 'Aceito em bibliotecas públicas e universidades' },
              { icon: <CheckCircle2 style={{ width: 13, height: 13 }} />, text: <><strong>Padrão oficial</strong> da Câmara Brasileira do Livro</> },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#5a6a84' }}>
                <span style={{ color: '#8a9ab8' }}>{b.icon}</span>{b.text}
              </div>
            ))}
          </div>
        </div>

        {/* Comparativo */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', textAlign: 'center', margin: '0 0 24px' }}>Faz a conta com a gente.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
            {/* Badge flutuante */}
            <div style={{
              position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
              zIndex: 10, borderRadius: 999, padding: '5px 16px',
              background: '#f59e0b', fontSize: 10, fontWeight: 900,
              textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#000',
              whiteSpace: 'nowrap',
            }}>⚡ AQUI NA AURORA</div>

            {/* Esquerda */}
            <div style={{ padding: '36px 22px 24px', background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRight: 'none', borderRadius: '16px 0 0 16px' }}>
              <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#ef4444', margin: '0 0 18px' }}>
                😰 POR FORA, COM DESPACHANTE
              </p>
              {[
                { label: 'Honorário do despachante', val: 'R$ 450,00' },
                { label: 'Taxas dos órgãos oficiais', val: 'R$ 90,00' },
                { label: 'Burocracia & envios', val: 'R$ 60,00' },
                { label: '+ 3 a 4 semanas de espera', val: 'idas a cartório' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: '#6a7a96' }}>{r.label}</span>
                  <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 700, whiteSpace: 'nowrap' }}>{r.val}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 14, marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Total</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#ef4444' }}>R$ 600+</span>
              </div>
            </div>

            {/* Direita */}
            <div style={{ padding: '36px 22px 24px', background: 'linear-gradient(160deg,#1a0f00,#251400)', border: '2px solid rgba(245,158,11,0.5)', borderRadius: '0 16px 16px 0' }}>
              <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#f59e0b', margin: '0 0 18px' }}>
                ✅ COM A AURORA, TUDO INCLUÍDO
              </p>
              {[
                { label: 'Honorário do especialista', val: '✓ Incluso' },
                { label: 'Taxas dos órgãos oficiais', val: '✓ A gente paga' },
                { label: 'Burocracia & envios', val: '✓ A gente cuida' },
                { label: 'Acompanhamento aqui na plataforma', val: '+ 7 dias úteis' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: '#8a7a60' }}>{r.label}</span>
                  <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 700, whiteSpace: 'nowrap' }}>{r.val}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(245,158,11,0.2)', paddingTop: 14, marginTop: 8 }}>
                <p style={{ fontSize: 12, color: '#8a7a60', margin: '0 0 4px' }}>Você paga apenas</p>
                <span style={{ fontSize: 32, fontWeight: 900, color: '#f59e0b' }}>R$ 199,99</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#6a7a96', textAlign: 'center', marginTop: 20, lineHeight: 1.75 }}>
            Você economiza <strong style={{ color: '#22c55e' }}>mais de R$ 400</strong>, não precisa lidar com cartório, não preenche formulário, não paga taxa nenhuma por fora.<br />
            <strong style={{ color: '#e0e8f0' }}>A gente faz tudo. Você só assina o livro pronto.</strong>
          </p>
        </div>

        {/* CTA */}
        <div style={{ borderRadius: 20, padding: '44px 32px', textAlign: 'center', background: 'linear-gradient(160deg,#1a0e00,#2a1600,#1e1000)', border: '1px solid rgba(245,158,11,0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%,rgba(245,158,11,0.08),transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#f59e0b', margin: '0 0 12px' }}>
              OFERTA DIRETA DA AURORA
            </p>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 0 12px', lineHeight: 1.2 }}>
              Quer seu ISBN oficial em 7 dias úteis?
            </h2>
            <p style={{ fontSize: 13, color: '#8a7a60', margin: '0 0 28px', lineHeight: 1.65 }}>
              Um único pagamento de <strong style={{ color: '#f59e0b' }}>R$ 199,99</strong> e a gente cuida de tudo. Sem mensalidade, sem letra miúda, sem surpresa.
            </p>
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 13, color: '#4a5a70', textDecoration: 'line-through', margin: '0 0 4px' }}>R$ 600+</p>
              <div style={{ fontSize: 52, fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>R$ 199,99</div>
              <p style={{ fontSize: 12, color: '#6a5a40', marginTop: 6 }}>PIX · Cartão · Créditos</p>
            </div>
            <CheckoutButton slug={slug} title={`ISBN — ${titulo}`} amount={199.99}>
              🔖 QUERO MEU ISBN AGORA
            </CheckoutButton>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
              {[
                { icon: <Clock style={{ width: 12, height: 12 }} />, text: '7 dias úteis' },
                { icon: <CheckCircle2 style={{ width: 12, height: 12 }} />, text: 'Garantia Aurora oficial' },
                { icon: <BookOpen style={{ width: 12, height: 12 }} />, text: '100% seus direitos' },
              ].map((t, i) => (
                <span key={i} style={{ fontSize: 11, color: '#6a5a40', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ color: '#a0804a' }}>{t.icon}</span>{t.text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', textAlign: 'center', margin: '0 0 20px' }}>
            Dúvidas que todo autor tem
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQS.map((f, i) => <FaqItem key={i} q={f.q} r={f.r} />)}
          </div>
        </div>

      </div>
    </div>
  )
}
