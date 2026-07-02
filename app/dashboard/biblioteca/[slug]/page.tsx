import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, RefreshCw, Pencil } from 'lucide-react'
import { getDelivery } from '@/lib/delivery-store'
import { CheckoutButton } from '@/components/checkout-button'
import { RoteiroClient } from './roteiro-client'

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

function stripBlocoPrefix(text: string): string {
  // Remove "Bloco 1:", "Bloco 2 -", etc.
  return text.replace(/^[Bb]loco\s*\d+\s*[:\-–]\s*/i, '').trim()
}

function montarResumoCapitulo(descricao: string, blocos: string[]): string {
  const desc = stripMd(descricao ?? '')
  // Filtra blocos que são planejamento (short) ou início de prosa, remove prefixo "Bloco N:"
  const extras = blocos
    .map(b => stripBlocoPrefix(stripMd(b)))
    .filter(b => b.length > 10 && !/^propósito|^proposito/i.test(b))
  return [desc, ...extras].filter(Boolean).join(' ')
}

function estimarPaginas(blocos: string[]): number {
  const chars = blocos.join(' ').length
  return Math.max(4, Math.round(chars / 1800))
}

function formatDate(d: Date) {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ── Sub-componentes de seção ──────────────────────────────────────────────────

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#111', margin: '0 0 8px', fontFamily: 'system-ui, sans-serif' }}>
        {titulo}
      </p>
      {children}
    </div>
  )
}

function Paragrafo({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 14, lineHeight: 1.8, color: '#333', margin: 0, fontFamily: 'Georgia, serif', textAlign: 'justify' }}>
      {children}
    </p>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default async function BibliotecaLivroPage({ params }: Props) {
  const { slug } = await params
  if (!SLUG_RE.test(slug)) notFound()

  const delivery = await getDelivery(slug)
  if (!delivery) notFound()

  const { planJson: plan, nomeAutor } = delivery
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = plan as any
  const capitulos = plan.capitulos ?? []
  const livroGerado = delivery.tipo === 'livro'

  const totalPaginas = capitulos.reduce((s: number, c: typeof capitulos[0]) => s + estimarPaginas(c.blocos ?? []), 0)

  return (
    <div style={{ minHeight: '100vh', background: '#1a1f35' }}>

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
          <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: livroGerado ? '#00e5c3' : '#f59e0b' }}>
            {livroGerado ? 'Livro Completo' : 'Planejamento'}
          </span>
        </div>
      </div>

      {/* ── Área de rolagem ── */}
      <div style={{ padding: '28px 20px', paddingBottom: livroGerado ? 48 : 120 }}>

        {/* ── Folha A4 ── */}
        <div style={{
          maxWidth: 760,
          margin: '0 auto',
          background: '#fff',
          borderRadius: 3,
          boxShadow: '0 2px 4px rgba(0,0,0,0.25), 0 16px 48px rgba(0,0,0,0.5), 3px 0 10px rgba(0,0,0,0.12), -3px 0 10px rgba(0,0,0,0.12)',
          padding: '56px 64px 72px',
        }}>

          {/* ── Cabeçalho do documento ── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
            <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#aaa', margin: 0, fontFamily: 'system-ui' }}>
              Planejamento Editorial
            </p>
            <p style={{ fontSize: 11, color: '#bbb', margin: 0, fontFamily: 'system-ui' }}>
              {formatDate(delivery.createdAt)}
            </p>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#111', margin: '0 0 6px', lineHeight: 1.2, fontFamily: 'Georgia, serif' }}>
            {plan.titulo}
          </h1>
          {plan.subtitulo && (
            <p style={{ fontSize: 15, color: '#666', margin: '0 0 10px', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              {plan.subtitulo}
            </p>
          )}
          <p style={{ fontSize: 12, color: '#888', margin: '0 0 20px', fontFamily: 'system-ui' }}>
            Planejado por <strong style={{ color: '#444' }}>{nomeAutor ?? plan.autor}</strong> &amp; SÁBHIA
          </p>

          {/* Botões de ação */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' as const }}>
            <Link href={`/dashboard/criar`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#555', background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: 7, padding: '6px 14px', textDecoration: 'none' }}>
              <RefreshCw style={{ width: 12, height: 12 }} /> Regenerar Planejamento
            </Link>
            <a href={`/api/pdf/${slug}`} download
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#555', background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: 7, padding: '6px 14px', textDecoration: 'none' }}>
              <Download style={{ width: 12, height: 12 }} /> Download
            </a>
          </div>

          <div style={{ borderTop: '2px solid #111', marginBottom: 36 }} />

          {/* ── Premissa ── */}
          {plan.premissa && (
            <Secao titulo="Premissa">
              <Paragrafo>{plan.premissa}</Paragrafo>
            </Secao>
          )}

          {/* ── Público-Alvo ── */}
          {p.publico_alvo && (
            <Secao titulo="Público-Alvo">
              <Paragrafo>{p.publico_alvo}</Paragrafo>
            </Secao>
          )}

          {/* ── Tom & Estilo ── */}
          {p.tom_estilo && (
            <Secao titulo="Tom & Estilo">
              <Paragrafo>{p.tom_estilo}</Paragrafo>
            </Secao>
          )}

          {/* ── Temas Centrais ── */}
          {Array.isArray(p.temas_centrais) && p.temas_centrais.length > 0 && (
            <Secao titulo="Temas Centrais">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {p.temas_centrais.map((tema: string, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ fontSize: 12, color: '#999', marginTop: 3, flexShrink: 0 }}>•</span>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: '#333', margin: 0, fontFamily: 'Georgia, serif' }}>{tema}</p>
                  </div>
                ))}
              </div>
            </Secao>
          )}

          {/* ── Sinopse ── */}
          {p.sinopse && (
            <Secao titulo="Sinopse">
              {String(p.sinopse).split('\n').filter(Boolean).map((par: string, i: number) => (
                <p key={i} style={{ fontSize: 14, lineHeight: 1.8, color: '#333', margin: '0 0 14px', fontFamily: 'Georgia, serif', textAlign: 'justify' }}>
                  {par}
                </p>
              ))}
            </Secao>
          )}

          {/* ── Arco Narrativo ── */}
          {p.arco_narrativo && (
            <Secao titulo="Arco Narrativo">
              <Paragrafo>{p.arco_narrativo}</Paragrafo>
            </Secao>
          )}

          {/* ── Divisor ── */}
          <div style={{ borderTop: '1px solid #ddd', margin: '8px 0 32px' }} />

          {/* ── Roteiro de Capítulos (gerado pela IA ao entrar na página) ── */}
          <RoteiroClient
            slug={slug}
            titulo={plan.titulo}
            autor={nomeAutor ?? plan.autor ?? 'Autor'}
            premissa={p.premissa}
            publico_alvo={p.publico_alvo}
            sinopse={p.sinopse}
            capitulos={capitulos}
            tipo={delivery.tipo ?? 'plano'}
            paginas={capitulos.map((cap: typeof capitulos[0]) =>
              estimarPaginas(cap.blocos ?? [])
            )}
          />

          {/* ── Notas de Pesquisa ── */}
          {Array.isArray(p.notas_pesquisa) && p.notas_pesquisa.length > 0 && (
            <>
              <div style={{ borderTop: '1px solid #ddd', margin: '0 0 28px' }} />
              <Secao titulo="Notas de Pesquisa">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {p.notas_pesquisa.map((nota: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ fontSize: 12, color: '#bbb', marginTop: 3, flexShrink: 0 }}>•</span>
                      <p style={{ fontSize: 13, lineHeight: 1.7, color: '#555', margin: 0, fontFamily: 'Georgia, serif' }}>{stripMd(nota)}</p>
                    </div>
                  ))}
                </div>
              </Secao>
            </>
          )}

          {/* ── Estimativa total ── */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <p style={{ fontSize: 12, color: '#888', margin: 0, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Estimativa total: ~{totalPaginas} páginas
            </p>
          </div>

        </div>
      </div>

      {/* ── CTA barra fixa (preview) ── */}
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
              <div style={{ textAlign: 'right' as const }}>
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
