import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ImageIcon, CheckCircle2, ArrowRight, Lock } from 'lucide-react'
import { getDelivery } from '@/lib/delivery-store'

const SLUG_RE = /^[a-f0-9]{32}$/
type Props = { params: Promise<{ slug: string }> }

export default async function IlustrarPage({ params }: Props) {
  const { slug } = await params
  if (!SLUG_RE.test(slug)) notFound()

  const delivery = await getDelivery(slug)
  if (!delivery) notFound()

  const livroGerado = true

  return (
    <div style={{ minHeight: '100vh', background: '#080e24', color: 'white' }}>

      {/* Top bar */}
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
          <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#a855f7' }}>
            Ilustrar Livro
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '80px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

        {/* Ícone */}
        <div style={{
          width: 88, height: 88, borderRadius: 24, marginBottom: 20,
          background: 'linear-gradient(135deg,#6b21a8,#a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 12px 40px rgba(168,85,247,0.35)',
        }}>
          <ImageIcon style={{ width: 40, height: 40, color: '#fff' }} strokeWidth={1.5} />
        </div>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20,
          borderRadius: 999, padding: '5px 14px',
          background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)',
          fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#a855f7',
        }}>
          <ImageIcon style={{ width: 11, height: 11 }} /> Ilustrações
        </div>

        {livroGerado ? (
          /* ── Página ativa (livro gerado) ── */
          <>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: '0 0 12px', lineHeight: 1.2 }}>
              Ilustre cada capítulo
            </h1>
            <p style={{ fontSize: 15, color: '#6a7a96', lineHeight: 1.7, margin: '0 0 32px' }}>
              Escolha um estilo artístico e a Aurora gera ilustrações exclusivas para cada capítulo do seu livro.
            </p>
            <Link href={`/dashboard/biblioteca/${slug}/ilustrar/criar`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                borderRadius: 14, padding: '14px 36px', fontSize: 15, fontWeight: 800, color: '#fff',
                background: 'linear-gradient(135deg,#6b21a8,#a855f7)',
                boxShadow: '0 6px 30px rgba(168,85,247,0.4)',
                textDecoration: 'none',
              }}>
              <ImageIcon style={{ width: 18, height: 18 }} /> Criar ilustrações
            </Link>
          </>
        ) : (
          /* ── Bloqueado: precisa gerar o livro ── */
          <>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: '0 0 16px', lineHeight: 1.2 }}>
              Falta um passo: gerar seu livro
            </h1>
            <p style={{ fontSize: 15, color: '#6a7a96', lineHeight: 1.7, margin: '0 0 32px', maxWidth: 480 }}>
              Para ilustrar cada capítulo com arte profissional sob medida, primeiro precisamos escrever seu livro.
              É rápido — em poucos minutos os capítulos ficam prontos e as ilustrações são desbloqueadas automaticamente.
            </p>

            {/* Benefícios */}
            <div style={{
              width: '100%', maxWidth: 420, borderRadius: 16, padding: '24px 28px', marginBottom: 32,
              background: '#0d1220', border: '1px solid rgba(168,85,247,0.15)',
              display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left',
            }}>
              {[
                'Ilustrações exclusivas por capítulo',
                'Estilo artístico à sua escolha',
                'Um livro visualmente irresistível',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CheckCircle2 style={{ width: 12, height: 12, color: '#a855f7' }} />
                  </div>
                  <span style={{ fontSize: 14, color: '#a0b0c8', fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link href={`/dashboard/biblioteca/${slug}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                borderRadius: 14, padding: '14px 36px', fontSize: 15, fontWeight: 800, color: '#fff',
                background: 'linear-gradient(135deg,#4f7fff,#a855f7)',
                boxShadow: '0 6px 30px rgba(79,127,255,0.4)',
                textDecoration: 'none',
              }}>
              Gerar meu livro agora <ArrowRight style={{ width: 18, height: 18 }} />
            </Link>
            <p style={{ fontSize: 12, color: '#3a4a60', marginTop: 12 }}>
              Leva só alguns minutos e seu livro fica pronto.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
