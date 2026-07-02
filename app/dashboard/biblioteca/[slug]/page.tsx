import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download } from 'lucide-react'
import { getDelivery } from '@/lib/delivery-store'
import { CheckoutButton } from '@/components/checkout-button'

const SLUG_RE = /^[a-f0-9]{32}$/
type Props = { params: Promise<{ slug: string }> }

function estimarPaginas(blocos: string[]): number {
  const chars = blocos.join(' ').length
  return Math.max(4, Math.round(chars / 1800))
}

export default async function BibliotecaLivroPage({ params }: Props) {
  const { slug } = await params
  if (!SLUG_RE.test(slug)) notFound()

  const delivery = await getDelivery(slug)
  if (!delivery) notFound()

  const { planJson: plan, nomeAutor } = delivery
  const capitulos = plan.capitulos ?? []
  const livroGerado = delivery.tipo === 'livro'

  return (
    <div style={{ minHeight: '100vh', background: '#080e24' }}>

      {/* ── Topbar ── */}
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

      {/* ── Corpo do livro (fundo branco) ── */}
      <div style={{ background: '#fff', minHeight: 'calc(100vh - 48px)', paddingBottom: livroGerado ? 60 : 120 }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '56px 40px 0' }}>

          {/* Capa */}
          <div style={{ textAlign: 'center', marginBottom: 64, paddingBottom: 48, borderBottom: '2px solid #111' }}>
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#999', margin: '0 0 20px' }}>
              Clube do Autor IA
            </p>
            <h1 style={{ fontSize: 36, fontWeight: 900, color: '#111', margin: '0 0 14px', lineHeight: 1.15, fontFamily: 'Georgia, serif', letterSpacing: '-0.01em' }}>
              {plan.titulo}
            </h1>
            {plan.subtitulo && (
              <p style={{ fontSize: 17, color: '#555', margin: '0 0 24px', fontFamily: 'Georgia, serif', fontStyle: 'italic', lineHeight: 1.5 }}>
                {plan.subtitulo}
              </p>
            )}
            <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
              por <strong style={{ color: '#222', fontWeight: 700 }}>{nomeAutor ?? plan.autor}</strong>
              <span style={{ color: '#ccc', margin: '0 10px' }}>·</span>
              {capitulos.length} capítulos
            </p>
          </div>

          {/* Promessa como epígrafe */}
          {plan.promessa && (
            <div style={{ textAlign: 'center', margin: '0 auto 56px', maxWidth: 500, paddingBottom: 48, borderBottom: '1px solid #eee' }}>
              <p style={{ fontSize: 15, color: '#555', fontFamily: 'Georgia, serif', fontStyle: 'italic', lineHeight: 1.9, margin: 0 }}>
                &ldquo;{plan.promessa}&rdquo;
              </p>
            </div>
          )}

          {/* ── Livro gerado: conteúdo completo ── */}
          {livroGerado && capitulos.map((cap, i) => (
            <div key={i} style={{ marginBottom: 72 }}>
              <div style={{ textAlign: 'center', marginBottom: 36, paddingBottom: 24, borderBottom: '1px solid #eee' }}>
                <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#bbb', margin: '0 0 10px' }}>
                  Capítulo {cap.numero}
                </p>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: 0, fontFamily: 'Georgia, serif', lineHeight: 1.3 }}>
                  {cap.titulo}
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {(cap.blocos ?? []).map((bloco, j) => (
                  <p key={j} style={{ fontSize: 16, lineHeight: 1.9, color: '#2a2a2a', margin: 0, fontFamily: 'Georgia, serif', textAlign: 'justify', textIndent: j === 0 ? 0 : '2em' }}>
                    {bloco}
                  </p>
                ))}
              </div>
              {i < capitulos.length - 1 && (
                <div style={{ textAlign: 'center', margin: '52px 0 0', color: '#ccc', fontSize: 16, letterSpacing: '0.5em' }}>✦ ✦ ✦</div>
              )}
            </div>
          ))}

          {/* ── Preview: todos os capítulos no estilo "o que vai ter" ── */}
          {!livroGerado && capitulos.map((cap, i) => {
            const paginas = estimarPaginas(cap.blocos ?? [])

            // Separa blocos normais de "Propósito:"
            const blocos = cap.blocos ?? []
            const propIdx = blocos.findIndex(b => b.toLowerCase().startsWith('propósito') || b.toLowerCase().startsWith('proposito'))
            const topicos = propIdx >= 0 ? blocos.slice(0, propIdx) : blocos
            const proposito = propIdx >= 0 ? blocos[propIdx] : null

            return (
              <div key={i} style={{ marginBottom: 52, paddingBottom: 48, borderBottom: '1px solid #e8e8e8' }}>

                {/* Cabeçalho do capítulo */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
                  <h2 style={{
                    fontSize: 14, fontWeight: 900, color: '#111',
                    margin: 0, lineHeight: 1.35, textTransform: 'uppercase', letterSpacing: '0.04em',
                    fontFamily: 'system-ui, sans-serif',
                    flex: 1,
                  }}>
                    {cap.titulo}
                  </h2>
                  <span style={{ fontSize: 11, color: '#bbb', whiteSpace: 'nowrap', fontFamily: 'Georgia, serif', marginTop: 2 }}>
                    ~{paginas}p
                  </span>
                </div>

                {/* Descrição */}
                {cap.descricao && (
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: '#333', margin: '0 0 18px', fontFamily: 'Georgia, serif', textAlign: 'justify' }}>
                    {cap.descricao}
                  </p>
                )}

                {/* Tópicos como bullets */}
                {topicos.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: proposito ? 16 : 0 }}>
                    {topicos.map((t, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{ color: '#888', fontSize: 11, marginTop: 4, flexShrink: 0 }}>♦</span>
                        <p style={{ fontSize: 14, lineHeight: 1.65, color: '#444', margin: 0, fontFamily: 'Georgia, serif' }}>
                          {t}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Propósito em itálico */}
                {proposito && (
                  <p style={{ fontSize: 13, lineHeight: 1.75, color: '#777', margin: 0, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                    {proposito}
                  </p>
                )}
              </div>
            )
          })}

          {/* Mensagem final (livro gerado) */}
          {livroGerado && plan.mensagem_final && (
            <div style={{ textAlign: 'center', marginTop: 64, paddingTop: 48, borderTop: '1px solid #eee' }}>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#bbb', margin: '0 0 20px' }}>Fim</p>
              {plan.mensagem_final.split('\n').filter(Boolean).map((p, i) => (
                <p key={i} style={{ fontSize: 14, color: '#888', fontFamily: 'Georgia, serif', fontStyle: 'italic', lineHeight: 1.8, margin: '0 0 12px' }}>{p}</p>
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
