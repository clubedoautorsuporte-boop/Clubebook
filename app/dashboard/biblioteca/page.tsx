import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  BookOpen, Plus, Sparkles, Clock, ChevronRight,
  Layers, CheckCircle2, FileText, Lock,
} from 'lucide-react'
import type { BriefingPlan } from '@/lib/generate-pdf'

// Gradientes determinísticos pelo slug
const GRADIENTS = [
  'linear-gradient(135deg,#1a1a6e,#4f7fff)',
  'linear-gradient(135deg,#065f46,#10b981)',
  'linear-gradient(135deg,#7c2d12,#f97316)',
  'linear-gradient(135deg,#4c1d95,#a855f7)',
  'linear-gradient(135deg,#7f1d1d,#ef4444)',
  'linear-gradient(135deg,#164e63,#06b6d4)',
  'linear-gradient(135deg,#14532d,#84cc16)',
  'linear-gradient(135deg,#831843,#ec4899)',
]
function bookGradient(slug: string) {
  const n = parseInt(slug[0], 16) % GRADIENTS.length
  return GRADIENTS[n]
}
function bookAccent(slug: string) {
  const colors = ['#4f7fff','#10b981','#f97316','#a855f7','#ef4444','#06b6d4','#84cc16','#ec4899']
  return colors[parseInt(slug[0], 16) % colors.length]
}

function timeAgo(date: Date) {
  const diff  = Date.now() - date.getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins  < 60) return `há ${mins} min`
  if (hours < 24) return `há ${hours}h`
  if (days  <  7) return `há ${days} dia${days > 1 ? 's' : ''}`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function BookCover({ slug, titulo, size = 'md' }: { slug: string; titulo: string; size?: 'sm' | 'md' | 'lg' }) {
  const w = size === 'lg' ? 88 : size === 'md' ? 68 : 52
  const h = size === 'lg' ? 120 : size === 'md' ? 92 : 72
  const fs = size === 'lg' ? 18 : size === 'md' ? 14 : 11
  const initials = titulo.split(' ').filter(w => w.length > 2).slice(0, 2).map(w => w[0].toUpperCase()).join('') || titulo.slice(0, 2).toUpperCase()
  return (
    <div style={{
      width: w, height: h, borderRadius: size === 'lg' ? 12 : 8, flexShrink: 0,
      background: bookGradient(slug),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `4px 4px 16px rgba(0,0,0,0.5), inset -3px 0 0 rgba(0,0,0,0.3)`,
      position: 'relative',
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, borderRadius: '8px 0 0 8px', background: 'rgba(0,0,0,0.25)' }} />
      <span style={{ fontSize: fs, fontWeight: 900, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.05em', zIndex: 1 }}>
        {initials}
      </span>
    </div>
  )
}

export default async function BibliotecaPage() {
  const session = await auth()
  const userId  = session?.user?.id
  const email   = session?.user?.email
  const nome    = (session?.user?.name ?? 'Autor').split(' ')[0]

  type Row = {
    slug: string; titulo: string; subtitulo: string
    autor: string; caps: number; createdAt: Date; tipo: string
  }

  let livros: Row[]     = []
  let rascunhos: Row[]  = []

  if (userId || email) {
    const where = userId && email
      ? { OR: [{ userId }, { email }] }
      : userId ? { userId } : { email: email! }

    const deliveries = await prisma.delivery.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: { slug: true, planJson: true, createdAt: true, tipo: true, nomeAutor: true },
    })

    const toRow = (d: typeof deliveries[0]): Row => {
      const plan = d.planJson as BriefingPlan
      return {
        slug:      d.slug,
        titulo:    plan.titulo    ?? 'Sem título',
        subtitulo: plan.subtitulo ?? '',
        autor:     d.nomeAutor    ?? plan.autor ?? '',
        caps:      Array.isArray(plan.capitulos) ? plan.capitulos.length : 0,
        createdAt: d.createdAt,
        tipo:      d.tipo ?? 'preview',
      }
    }

    livros    = deliveries.filter(d => d.tipo === 'livro').map(toRow)
    rascunhos = deliveries.filter(d => d.tipo !== 'livro').map(toRow)
  }

  const totalCaps = livros.reduce((a, b) => a + b.caps, 0)

  return (
    <div style={{ padding: '28px 24px 80px', maxWidth: 960, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: '0 0 6px', lineHeight: 1.2 }}>
            Minha Biblioteca
          </h1>
          <p style={{ fontSize: 13, color: '#5a6a84', margin: 0 }}>
            Todos os seus livros num só lugar, {nome} ✨
          </p>
        </div>
        <Link href="/dashboard/criar" style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          borderRadius: 12, padding: '10px 20px', fontSize: 13, fontWeight: 700, color: '#fff',
          background: 'linear-gradient(135deg,#1a3a8f,#4f7fff)',
          boxShadow: '0 4px 20px rgba(79,127,255,0.3)', textDecoration: 'none',
        }}>
          <Plus style={{ width: 15, height: 15 }} /> Criar Novo Livro
        </Link>
      </div>

      {/* ── Stats ── */}
      {(livros.length > 0 || rascunhos.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 36 }}>
          {[
            { label: 'Livros gerados', value: livros.length,     icon: BookOpen,    cor: '#4f7fff' },
            { label: 'Planejamentos',  value: rascunhos.length,   icon: FileText,    cor: '#a855f7' },
            { label: 'Total de capítulos', value: totalCaps,     icon: Layers,      cor: '#10b981' },
          ].map(({ label, value, icon: Icon, cor }) => (
            <div key={label} style={{ borderRadius: 14, padding: '16px 18px', background: '#0d1220', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${cor}18`, border: `1px solid ${cor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon style={{ width: 16, height: 16, color: cor }} strokeWidth={2} />
              </div>
              <div>
                <p style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: '0 0 2px', lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: 10, color: '#4a5a70', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Livros gerados ── */}
      {livros.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <CheckCircle2 style={{ width: 15, height: 15, color: '#10b981' }} />
            <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#10b981', margin: 0 }}>
              Livros Completos
            </p>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#2a3a4a', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 999, padding: '2px 8px' }}>
              {livros.length}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {livros.map(livro => {
              const accent = bookAccent(livro.slug)
              return (
                <Link
                  key={livro.slug}
                  href={`/dashboard/biblioteca/${livro.slug}`}
                  style={{ textDecoration: 'none', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', background: '#0a101e', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.15s, transform 0.12s' }}
                  className="group"
                >
                  {/* Topo colorido */}
                  <div style={{ height: 3, background: bookGradient(livro.slug) }} />
                  <div style={{ padding: '18px 18px 16px', display: 'flex', gap: 14, flex: 1 }}>
                    <BookCover slug={livro.slug} titulo={livro.titulo} size="md" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, background: `${accent}18`, border: `1px solid ${accent}30`, borderRadius: 999, padding: '2px 8px' }}>
                          Livro completo
                        </span>
                      </div>
                      <h3 style={{ fontSize: 14, fontWeight: 800, color: '#e0e8f0', margin: '0 0 4px', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                        {livro.titulo}
                      </h3>
                      <p style={{ fontSize: 11, color: '#4a5a70', margin: '0 0 10px' }}>por {livro.autor}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 10, color: '#5a6a84', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Sparkles style={{ width: 10, height: 10, color: accent }} /> {livro.caps} cap.
                        </span>
                        <span style={{ fontSize: 10, color: '#3a4a60', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock style={{ width: 10, height: 10 }} /> {timeAgo(livro.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: '#4a5a70' }}>Ver pipeline de publicação</span>
                    <ChevronRight style={{ width: 13, height: 13, color: '#3a4a60' }} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Planejamentos pendentes ── */}
      {rascunhos.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Lock style={{ width: 13, height: 13, color: '#5a6a84' }} />
            <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#5a6a84', margin: 0 }}>
              Planejamentos — aguardando geração
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rascunhos.map(r => (
              <Link
                key={r.slug}
                href={`/dashboard/biblioteca/${r.slug}`}
                style={{ textDecoration: 'none', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', background: '#0a101e', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}
              >
                <BookCover slug={r.slug} titulo={r.titulo} size="sm" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: '#8a9ab8', margin: '0 0 3px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {r.titulo}
                  </h4>
                  <p style={{ fontSize: 11, color: '#3a4a60', margin: 0 }}>
                    {r.caps} capítulos planejados · {timeAgo(r.createdAt)}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 999, padding: '3px 10px' }}>
                    Gerar por R$49,99
                  </span>
                  <ChevronRight style={{ width: 13, height: 13, color: '#3a4a60' }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {livros.length === 0 && rascunhos.length === 0 && (
        <div style={{ borderRadius: 20, padding: '60px 32px', textAlign: 'center', background: '#0d1220', border: '1px solid rgba(255,255,255,0.06)', marginTop: 20 }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg,#0d1a3a,#1a0d40)', border: '1px solid rgba(79,127,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <BookOpen style={{ width: 36, height: 36, color: '#4f7fff' }} strokeWidth={1.5} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: '0 0 10px' }}>
            Sua biblioteca está esperando
          </h2>
          <p style={{ fontSize: 14, color: '#5a6a84', margin: '0 0 28px', lineHeight: 1.7, maxWidth: 380, marginLeft: 'auto', marginRight: 'auto' }}>
            Crie seu primeiro livro e ele aparece aqui com toda a linha de publicação pronta.
          </p>
          <Link href="/dashboard/criar" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            borderRadius: 14, padding: '13px 28px', fontSize: 14, fontWeight: 800, color: '#fff',
            background: 'linear-gradient(135deg,#1a3a8f,#4f7fff)',
            boxShadow: '0 6px 28px rgba(79,127,255,0.35)', textDecoration: 'none',
          }}>
            <Plus style={{ width: 16, height: 16 }} /> Criar meu primeiro livro
          </Link>
        </div>
      )}

    </div>
  )
}
