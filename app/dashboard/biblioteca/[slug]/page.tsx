import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download } from 'lucide-react'
import { getDelivery } from '@/lib/delivery-store'
import { CheckoutButton } from '@/components/checkout-button'

const SLUG_RE = /^[a-f0-9]{32}$/
type Props = { params: Promise<{ slug: string }> }

function stripMd(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^[-*•]\s+/gm, '')
    .trim()
}

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
    <div style={{ minHeight: '100vh', background: '#1a1a2e' }}>

      {/* ── Topbar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(8,14,36,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px' }}>
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

      {/* ── Área de rolagem com fundo escuro ── */}
      <div style={{ padding: '32px 20px', paddingBottom: livroGerado ? 48 : 120 }}>

        {/* ── Folha A4 ── */}
        <div style={{
          maxWidth: 680,
          margin: '0 auto',
          background: '#fff',
          borderRadius: 3,
          boxShadow: '0 4px 6px rgba(0,0,0,0.3), 0 20px 60px rgba(0,0,0,0.5), 2px 0 8px rgba(0,0,0,0.15), -2px 0 8px rgba(0,0,0,0.15)',
          padding: '72px 80px',
          minHeight: 400,
        }}>

          {/* Capa */}
          <div style={{ textAlign: 'center', marginBottom: 56, paddingBottom: 40, borderBottom: '2px solid #111' }}>
            <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#aaa', margin: '0 0 18px' }}>
              Clube do Autor IA
            </p>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: '#111', margin: '0 0 12px', lineHeight: 1.2, fontFamily: 'Georgia, serif' }}>
              {plan.titulo}
            </h1>
            {plan.subtitulo && (
              <p style={{ fontSize: 16, color: '#555', margin: '0 0 20px', fontFamily: 'Georgia, serif', fontStyle: 'italic', lineHeight: 1.5 }}>
                {plan.subtitulo}
              </p>
            )}
            <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
              por <strong style={{ color: '#222', fontWeight: 700 }}>{nomeAutor ?? plan.autor}</strong>
              <span style={{ color: '#ddd', margin: '0 8px' }}>·</span>
              {capitulos.length} capítulos
            </p>
          </div>

          {/* Promessa */}
          {plan.promessa && (
            <div style={{ textAlign: 'center', margin: '0 auto 48px', maxWidth: 460 }}>
              <p style={{ fontSize: 14, color: '#666', fontFamily: 'Georgia, serif', fontStyle: 'italic', lineHeight: 1.9, margin: 0 }}>
                &ldquo;{plan.promessa}&rdquo;
              </p>
              <div style={{ marginTop: 32, borderTop: '1px solid #eee' }} />
            </div>
          )}

          {/* ── LIVRO GERADO: conteúdo completo ── */}
          {livroGerado && capitulos.map((cap, i) => (
            <div key={i} style={{ marginBottom: 64 }}>
              <div style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 20, borderBottom: '1px solid #eee' }}>
                <p style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#bbb', margin: '0 0 8px' }}>
                  Capítulo {cap.numero}
                </p>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a', margin: 0, fontFamily: 'Georgia, serif', lineHeight: 1.3 }}>
                  {cap.titulo}
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {(cap.blocos ?? []).map((bloco, j) => (
                  <p key={j} style={{ fontSize: 15, lineHeight: 1.9, color: '#2a2a2a', margin: 0, fontFamily: 'Georgia, serif', textAlign: 'justify', textIndent: j === 0 ? 0 : '2em' }}>
                    {stripMd(bloco)}
                  </p>
                ))}
              </div>
              {i < capitulos.length - 1 && (
                <div style={{ textAlign: 'center', margin: '48px 0 0', color: '#ccc', fontSize: 14, letterSpacing: '0.6em' }}>✦ ✦ ✦</div>
              )}
            </div>
          ))}

          {/* ── PREVIEW: todos capítulos com ~10 linhas de resumo ── */}
          {!livroGerado && capitulos.map((cap, i) => {
            const paginas = estimarPaginas(cap.blocos ?? [])
            const blocos = (cap.blocos ?? []).map(stripMd).filter(Boolean)

            // Propósito: último bloco que começa com "Propósito"
            const propIdx = blocos.findIndex(b => /^propósito|^proposito/i.test(b))
            const topicos = propIdx >= 0 ? blocos.slice(0, propIdx) : blocos
            const proposito = propIdx >= 0 ? blocos[propIdx] : null

            // Montar resumo: descrição + primeiros tópicos até ~10 linhas (~600 chars)
            const descricao = stripMd(cap.descricao ?? '')
            let resumo = descricao
            for (const t of topicos) {
              if ((resumo + ' ' + t).length < 580) resumo += (resumo ? ' ' + t : t)
              else break
            }

            return (
              <div key={i} style={{ marginBottom: 44, paddingBottom: 40, borderBottom: i < capitulos.length - 1 ? '1px solid #e8e8e8' : 'none' }}>

                {/* Título + páginas */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                  <h2 style={{ fontSize: 13, fontWeight: 900, color: '#111', margin: 0, lineHeight: 1.4, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'system-ui, sans-serif', flex: 1 }}>
                    {cap.titulo}
                  </h2>
                  <span style={{ fontSize: 11, color: '#bbb', whiteSpace: 'nowrap', fontFamily: 'Georgia, serif' }}>
                    ~{paginas}p
                  </span>
                </div>

                {/* Resumo ~10 linhas */}
                <p style={{
                  fontSize: 14, lineHeight: 1.75, color: '#333',
                  margin: '0 0 14px', fontFamily: 'Georgia, serif',
                  textAlign: 'justify',
                  display: '-webkit-box',
                  WebkitLineClamp: 10,
                  WebkitBoxOrient: 'vertical' as const,
                  overflow: 'hidden',
                }}>
                  {resumo}
                </p>

                {/* Propósito em itálico */}
                {proposito && (
                  <p style={{ fontSize: 12, lineHeight: 1.7, color: '#888', margin: 0, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                    {proposito}
                  </p>
                )}
              </div>
            )
          })}

          {/* Fim (livro gerado) */}
          {livroGerado && plan.mensagem_final && (
            <div style={{ textAlign: 'center', marginTop: 56, paddingTop: 40, borderTop: '1px solid #eee' }}>
              <p style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#bbb', margin: '0 0 20px' }}>Fim</p>
              {plan.mensagem_final.split('\n').filter(Boolean).map((p, i) => (
                <p key={i} style={{ fontSize: 13, color: '#888', fontFamily: 'Georgia, serif', fontStyle: 'italic', lineHeight: 1.8, margin: '0 0 10px' }}>{p}</p>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ── Barra CTA fixa (preview) ── */}
      {!livroGerado && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          background: 'rgba(10,14,30,0.98)', backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '14px 24px',
        }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
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
