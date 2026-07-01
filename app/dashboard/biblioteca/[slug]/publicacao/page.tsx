import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Globe, CheckCircle2, ArrowRight, Sparkles, BookOpen } from 'lucide-react'
import { getDelivery } from '@/lib/delivery-store'
import { CheckoutButton } from '@/components/checkout-button'

const SLUG_RE = /^[a-f0-9]{32}$/
type Props = { params: Promise<{ slug: string }> }

const ITENS = [
  { label: 'Descrição profissional para lojas',         valor: 'R$ 150,00' },
  { label: 'Sinopse editorial profissional',            valor: 'R$ 80,00'  },
  { label: 'Palavras-chave otimizadas (SEO)',           valor: 'R$ 120,00' },
  { label: 'Categorias estratégicas',                   valor: 'R$ 60,00'  },
  { label: 'Frase de impacto (tagline)',                valor: 'R$ 40,00'  },
  { label: 'Arquivos EPUB + PDF + DOCX',               valor: 'R$ 100,00' },
  { label: 'Ficha técnica completa',                    valor: 'R$ 60,00'  },
  { label: 'Kit de lançamento para redes sociais (4 posts)', valor: 'R$ 200,00' },
  { label: 'Estratégia de preço profissional',          valor: 'R$ 50,00'  },
  { label: 'Calendário de lançamento de 7 dias',       valor: 'R$ 300,00' },
  { label: 'Guia de dicas para autores best-seller',    valor: 'R$ 100,00' },
  { label: 'Mockups profissionais do livro',            valor: 'R$ 350,00' },
]

const PLATAFORMAS = ['Amazon KDP', 'Apple Books', 'Google Play Livros', 'Kobo', 'Barnes & Noble', 'Smashwords']

const BENEFICIOS = [
  { icon: '✅', title: '100% Seus Direitos',     desc: 'Você mantém todos os direitos autorais' },
  { icon: '🚫', title: 'Sem Assinatura',         desc: 'Pague uma vez, use para sempre' },
  { icon: '⚡', title: 'Pronto em Segundos',     desc: 'Nossa plataforma trabalha instantaneamente' },
  { icon: '🌍', title: '6 Plataformas',          desc: 'Material preparado para todas as maiores lojas' },
]

export default async function PublicacaoPage({ params }: Props) {
  const { slug } = await params
  if (!SLUG_RE.test(slug)) notFound()

  const delivery = await getDelivery(slug)
  if (!delivery) notFound()

  const { planJson: plan } = delivery

  return (
    <div style={{ minHeight: '100vh', background: '#080e24', color: 'white', paddingBottom: 80 }}>

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(8,14,36,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
          <Link href={`/dashboard/biblioteca/${slug}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#5a6a84', textDecoration: 'none' }}>
            <ArrowLeft style={{ width: 14, height: 14 }} /> Voltar ao meu livro
          </Link>
          <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#22d3ee' }}>
            Preparar Publicação
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px', display: 'flex', flexDirection: 'column', gap: 48 }}>

        {/* ── Hero ── */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, margin: '0 auto 20px',
            background: 'linear-gradient(135deg,#0891b2,#22d3ee)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 12px 40px rgba(34,211,238,0.3)',
          }}>
            <Globe style={{ width: 34, height: 34, color: '#fff' }} strokeWidth={1.5} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 0 12px', lineHeight: 1.2 }}>
            Vamos preparar tudo para você publicar!
          </h1>
          <p style={{ fontSize: 14, color: '#6a7a96', lineHeight: 1.7, margin: 0 }}>
            A Aurora vai preparar todos os textos e arquivos que as plataformas exigem.
            Você só vai precisar copiar e colar.
          </p>
        </div>

        {/* ── Como Funciona ── */}
        <div style={{ borderRadius: 20, padding: '32px 28px', background: '#0d1220', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', textAlign: 'center', margin: '0 0 28px' }}>Como Funciona</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { num: '1', title: 'Análise do seu livro',           desc: 'A Aurora lê e compreende cada capítulo' },
              { num: '2', title: 'Materiais profissionais criados', desc: 'Textos, palavras-chave e arquivos são preparados automaticamente' },
              { num: '3', title: 'Pronto para publicar',           desc: 'Acesse as plataformas — é simples copiar e colar' },
            ].map(s => (
              <div key={s.num} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', margin: '0 auto 12px',
                  background: 'linear-gradient(135deg,#4f7fff,#22d3ee)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 900, color: '#fff',
                }}>{s.num}</div>
                <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>{s.title}</p>
                <p style={{ fontSize: 11, color: '#5a6a84', lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── O que está incluso ── */}
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 900, color: '#6a7a96', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 20px' }}>
            Se você contratasse esses serviços separadamente:
          </h2>
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            {ITENS.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '13px 20px',
                background: i % 2 === 0 ? '#0d1220' : '#0a0e1e',
                borderBottom: i < ITENS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle2 style={{ width: 14, height: 14, color: '#22d3ee', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#a0b0c8' }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 12, color: '#4a5a70', textDecoration: 'line-through', flexShrink: 0 }}>{item.valor}</span>
              </div>
            ))}
            {/* Total */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', background: '#0d1220',
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Total separado:</span>
              <span style={{ fontSize: 14, color: '#4a5a70', textDecoration: 'line-through' }}>R$ 1.610,00</span>
            </div>
          </div>
        </div>

        {/* ── Pricing CTA ── */}
        <div style={{
          borderRadius: 20, padding: '36px 32px', textAlign: 'center',
          background: 'linear-gradient(135deg,#0a0f2e,#111836,#0d0a28)',
          border: '1px solid rgba(34,211,238,0.2)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -20, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,211,238,0.15),transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -20, right: 20, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle,rgba(79,127,255,0.15),transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 14, color: '#6a7a96', margin: '0 0 4px' }}>Você paga apenas:</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '0 0 8px' }}>
              <span style={{ fontSize: 18, color: '#3a4a60', textDecoration: 'line-through' }}>R$ 150,00</span>
              <span style={{ fontSize: 40, fontWeight: 900, color: '#fff' }}>R$ 49,99</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
              <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(34,211,238,0.15)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.3)' }}>
                67% de desconto
              </span>
              <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(79,127,255,0.15)', color: '#4f7fff', border: '1px solid rgba(79,127,255,0.3)' }}>
                Pronto em segundos
              </span>
            </div>
            <CheckoutButton slug={slug} title={`Publicação — ${plan.titulo}`} amount={49.99}>
              Preparar tudo para publicação
            </CheckoutButton>
            <p style={{ fontSize: 11, color: '#3a4a60', marginTop: 10 }}>Pagamento único · sem mensalidades</p>
          </div>
        </div>

        {/* ── Benefícios ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
          {BENEFICIOS.map((b, i) => (
            <div key={i} style={{
              borderRadius: 14, padding: '20px 18px',
              background: '#0d1220', border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <span style={{ fontSize: 24 }}>{b.icon}</span>
              <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', margin: 0 }}>{b.title}</p>
              <p style={{ fontSize: 12, color: '#5a6a84', margin: 0, lineHeight: 1.5 }}>{b.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Plataformas ── */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#6a7a96', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 11 }}>
            Seu livro estará pronto para essas plataformas
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {PLATAFORMAS.map((p, i) => (
              <div key={i} style={{
                padding: '8px 16px', borderRadius: 999,
                background: '#0d1220', border: '1px solid rgba(255,255,255,0.08)',
                fontSize: 12, fontWeight: 600, color: '#6a7a96',
              }}>{p}</div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#3a4a60', marginTop: 14 }}>
            Seu livro ficará disponível para leitores ao redor do mundo
          </p>
        </div>

        {/* ── CTA final ── */}
        <div style={{
          borderRadius: 20, padding: '40px 32px', textAlign: 'center',
          background: '#0d1220', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg,#4f7fff,#22d3ee)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles style={{ width: 26, height: 26, color: '#fff' }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 10px' }}>
            Pronto para publicar seu livro?
          </h2>
          <p style={{ fontSize: 13, color: '#6a7a96', margin: '0 0 24px', lineHeight: 1.6 }}>
            Mais de 6 horas de trabalho manual —{' '}
            <span style={{ color: '#22d3ee', fontWeight: 700 }}>prontas em segundos</span>.
          </p>
          <CheckoutButton slug={slug} title={`Publicação — ${plan.titulo}`} amount={49.99}>
            Preparar tudo para publicação
          </CheckoutButton>
          <p style={{ fontSize: 11, color: '#3a4a60', marginTop: 10 }}>
            Por apenas <span style={{ textDecoration: 'line-through' }}>R$ 150,00</span>{' '}
            <strong style={{ color: '#22d3ee' }}>R$ 49,99</strong> · sem mensalidades
          </p>
        </div>

      </div>
    </div>
  )
}
