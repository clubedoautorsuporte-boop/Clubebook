import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download } from 'lucide-react'
import { getDelivery } from '@/lib/delivery-store'
import { CheckoutButton } from '@/components/checkout-button'

const SLUG_RE = /^[a-f0-9]{32}$/
type Props = { params: Promise<{ slug: string }> }

export default async function BibliotecaLivroPage({ params }: Props) {
  const { slug } = await params
  if (!SLUG_RE.test(slug)) notFound()

  const delivery = await getDelivery(slug)
  if (!delivery) notFound()

  const { planJson: plan, nomeAutor } = delivery
  const capitulos = plan.capitulos ?? []
  const livroGerado = delivery.tipo === 'livro'

  // Capítulos visíveis: livro completo = todos; preview = primeiro capítulo livre + resto bloqueado
  const capitulosVisiveis = livroGerado ? capitulos : capitulos.slice(0, 1)
  const capitulosBloqueados = livroGerado ? [] : capitulos.slice(1)

  return (
    <div style={{ minHeight: '100vh', background: '#080e24' }}>

      {/* ── Topbar escura ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(8,14,36,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px' }}>
          <Link href="/dashboard/projetos"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#5a6a84', textDecoration: 'none' }}>
            <ArrowLeft style={{ width: 14, height: 14 }} /> Meus Projetos
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {livroGerado && (
              <a href={`/api/pdf/${slug}`} download
                style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#6a7a96', textDecoration: 'none', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', padding: '5px 12px', background: 'rgba(255,255,255,0.04)' }}>
                <Download style={{ width: 13, height: 13 }} /> PDF
              </a>
            )}
            <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: livroGerado ? '#00e5c3' : '#f59e0b' }}>
              {livroGerado ? 'Livro Completo' : 'Prévia'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Página do livro (fundo branco) ── */}
      <div style={{ background: '#fff', minHeight: 'calc(100vh - 48px)', paddingBottom: livroGerado ? 60 : 120 }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '56px 40px 0' }}>

          {/* Capa / cabeçalho */}
          <div style={{ textAlign: 'center', marginBottom: 64, paddingBottom: 48, borderBottom: '1px solid #e8e8e8' }}>
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#999', margin: '0 0 20px' }}>
              {livroGerado ? 'Clube do Autor IA' : 'Prévia — Capítulo 1'}
            </p>
            <h1 style={{ fontSize: 38, fontWeight: 900, color: '#111', margin: '0 0 12px', lineHeight: 1.15, fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}>
              {plan.titulo}
            </h1>
            {plan.subtitulo && (
              <p style={{ fontSize: 18, color: '#555', margin: '0 0 20px', fontFamily: 'Georgia, serif', fontStyle: 'italic', lineHeight: 1.4 }}>
                {plan.subtitulo}
              </p>
            )}
            <p style={{ fontSize: 14, color: '#888', margin: '0 0 8px', fontWeight: 500 }}>
              por <strong style={{ color: '#333', fontWeight: 700 }}>{nomeAutor ?? plan.autor}</strong>
            </p>
            <p style={{ fontSize: 12, color: '#bbb', margin: 0 }}>
              {capitulos.length} capítulos
            </p>
          </div>

          {/* Promessa como epígrafe */}
          {plan.promessa && (
            <div style={{ textAlign: 'center', margin: '0 auto 56px', maxWidth: 480 }}>
              <p style={{ fontSize: 15, color: '#666', fontFamily: 'Georgia, serif', fontStyle: 'italic', lineHeight: 1.8, margin: 0 }}>
                &ldquo;{plan.promessa}&rdquo;
              </p>
            </div>
          )}

          {/* ── Capítulos visíveis ── */}
          {capitulosVisiveis.map((cap, i) => (
            <div key={i} style={{ marginBottom: 64 }}>
              {/* Cabeçalho do capítulo */}
              <div style={{ textAlign: 'center', marginBottom: 36, paddingBottom: 28, borderBottom: '1px solid #eee' }}>
                <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#bbb', margin: '0 0 10px' }}>
                  Capítulo {cap.numero}
                </p>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', margin: 0, fontFamily: 'Georgia, serif', lineHeight: 1.3 }}>
                  {cap.titulo}
                </h2>
                {cap.descricao && (
                  <p style={{ fontSize: 13, color: '#999', margin: '10px 0 0', fontStyle: 'italic' }}>
                    {cap.descricao}
                  </p>
                )}
              </div>

              {/* Blocos de texto */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {(cap.blocos ?? []).map((bloco, j) => (
                  <p key={j} style={{
                    fontSize: 16, lineHeight: 1.85, color: '#2a2a2a',
                    margin: 0, fontFamily: 'Georgia, serif',
                    textAlign: 'justify', textIndent: j === 0 ? 0 : '2em',
                  }}>
                    {bloco}
                  </p>
                ))}
              </div>

              {/* Separador de capítulo */}
              {i < capitulosVisiveis.length - 1 && (
                <div style={{ textAlign: 'center', margin: '48px 0 0', color: '#ccc', fontSize: 18, letterSpacing: '0.5em' }}>
                  ✦ ✦ ✦
                </div>
              )}
            </div>
          ))}

          {/* ── Capítulos bloqueados (preview) ── */}
          {capitulosBloqueados.length > 0 && (
            <div style={{ position: 'relative' }}>
              {/* Fade nos primeiros capítulos bloqueados */}
              <div style={{ position: 'relative', overflow: 'hidden', maxHeight: 220 }}>
                <div style={{ opacity: 0.25, filter: 'blur(1px)' }}>
                  <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#bbb', margin: '0 0 10px' }}>
                      Capítulo {capitulosBloqueados[0].numero}
                    </p>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', margin: 0, fontFamily: 'Georgia, serif' }}>
                      {capitulosBloqueados[0].titulo}
                    </h2>
                  </div>
                  <p style={{ fontSize: 16, lineHeight: 1.85, color: '#2a2a2a', fontFamily: 'Georgia, serif' }}>
                    {capitulosBloqueados[0].blocos?.[0] ?? ''}
                  </p>
                </div>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,1) 80%)',
                }} />
              </div>

              {/* Mais capítulos bloqueados listados */}
              <div style={{ background: '#fafafa', borderRadius: 16, border: '1px solid #eee', padding: '28px 32px', marginTop: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#bbb', margin: '0 0 16px', textAlign: 'center' }}>
                  Capítulos bloqueados
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {capitulosBloqueados.slice(0, 6).map((cap, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: '#fff', border: '1px solid #f0f0f0' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#ccc', minWidth: 24 }}>{cap.numero}</span>
                      <span style={{ fontSize: 14, color: '#999', fontFamily: 'Georgia, serif' }}>{cap.titulo}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 16 }}>🔒</span>
                    </div>
                  ))}
                  {capitulosBloqueados.length > 6 && (
                    <p style={{ fontSize: 12, color: '#bbb', textAlign: 'center', margin: '4px 0 0' }}>
                      + {capitulosBloqueados.length - 6} capítulos...
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mensagem final (só para livro gerado) */}
          {livroGerado && plan.mensagem_final && (
            <div style={{ textAlign: 'center', marginTop: 64, paddingTop: 48, borderTop: '1px solid #eee' }}>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#bbb', margin: '0 0 20px' }}>
                Fim
              </p>
              {plan.mensagem_final.split('\n').filter(Boolean).map((p, i) => (
                <p key={i} style={{ fontSize: 14, color: '#888', fontFamily: 'Georgia, serif', fontStyle: 'italic', lineHeight: 1.8, margin: '0 0 12px' }}>
                  {p}
                </p>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ── Barra CTA fixa (só preview) ── */}
      {!livroGerado && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          background: 'rgba(10,14,30,0.98)', backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '14px 24px',
        }}>
          <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 11, color: '#5a6a84', margin: '0 0 2px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                QUERO QUE <strong style={{ color: '#fff' }}>&ldquo;{plan.titulo.toUpperCase()}&rdquo;</strong> SEJA ESCRITO AGORA
              </p>
              <p style={{ fontSize: 11, color: '#4a5a70', margin: 0 }}>
                {capitulos.length} capítulos · escrita completa pela Aurora IA
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 10, color: '#4a5a70', margin: '0 0 1px', textDecoration: 'line-through' }}>R$197</p>
                <p style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1 }}>R$49,99</p>
              </div>
              <CheckoutButton slug={slug} title={plan.titulo} amount={49.99}>
                Gerar agora →
              </CheckoutButton>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
