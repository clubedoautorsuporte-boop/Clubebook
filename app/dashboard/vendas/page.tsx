import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { TrendingUp, BookOpen, ExternalLink, Clock, Zap, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import type { BriefingPlan } from '@/lib/generate-pdf'

const GRADIENTS = [
  ['#1e3a5f', '#2563eb'], ['#0f4c3a', '#10b981'], ['#3b1f6b', '#8b5cf6'],
  ['#7c2d12', '#f97316'], ['#1e3a5f', '#0ea5e9'], ['#14532d', '#22c55e'],
  ['#831843', '#ec4899'], ['#1e1b4b', '#6366f1'],
]
function titleGrad(t: string): [string, string] {
  let h = 0; for (let i = 0; i < t.length; i++) h = t.charCodeAt(i) + ((h << 5) - h)
  return GRADIENTS[Math.abs(h) % GRADIENTS.length] as [string, string]
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const PLATFORMS = [
  { name: 'Hotmart',  commission: '70%', color: '#ff4d00', url: 'https://hotmart.com' },
  { name: 'Eduzz',    commission: '70%', color: '#5c6bc0', url: 'https://eduzz.com' },
  { name: 'Amazon KDP', commission: '35%', color: '#ff9900', url: 'https://kdp.amazon.com' },
  { name: 'Gumroad',  commission: '91%', color: '#ff90e8', url: 'https://gumroad.com' },
]

export default async function VendasPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const deliveries = await prisma.delivery.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: { slug: true, planJson: true, createdAt: true, expiresAt: true },
  }).catch(() => [])

  const ebooks = deliveries.map(d => {
    const plan = d.planJson as BriefingPlan
    const expired = d.expiresAt < new Date()
    return {
      slug: d.slug,
      titulo: plan.titulo ?? 'Sem título',
      subtitulo: plan.subtitulo ?? '',
      capitulos: Array.isArray(plan.capitulos) ? plan.capitulos.length : 0,
      createdAt: d.createdAt.toISOString(),
      expired,
    }
  })

  const ativos = ebooks.filter(e => !e.expired)
  const total = ebooks.length

  return (
    <div className="px-5 pt-6 pb-12 md:px-8">

      {/* Header */}
      <div className="mb-7 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Vendas</h1>
          <p className="mt-0.5 text-sm text-[#6b7a99]">Gerencie e distribua seus ebooks nas plataformas</p>
        </div>
        <Link
          href="/dashboard/criar"
          className="flex items-center gap-1.5 rounded-xl bg-[#4f7fff] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#3a6be0]"
        >
          <Zap className="size-4" /> Criar ebook
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Ebooks criados', value: total, color: 'text-white' },
          { label: 'Disponíveis', value: ativos.length, color: 'text-[#00e5c3]' },
          { label: 'Plataformas', value: 4, color: 'text-[#4f7fff]' },
          { label: 'Expirados', value: total - ativos.length, color: 'text-[#6b7a99]' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-4">
            <p className="text-[11px] text-[#6b7a99]">{s.label}</p>
            <p className={`mt-1 text-3xl font-extrabold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Ebooks para vender */}
      <div className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
          <ShoppingBag className="size-4 text-[#4f7fff]" />
          Seus ebooks disponíveis para venda
        </h2>

        {ativos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#1c2438] py-14 text-center">
            <BookOpen className="mx-auto mb-3 size-8 text-[#2a3553]" />
            <p className="font-semibold text-[#6b7a99]">Nenhum ebook disponível ainda</p>
            <p className="mt-1 text-sm text-[#3a4a66]">Crie seu primeiro ebook para começar a vender</p>
            <Link
              href="/dashboard/criar"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#4f7fff15] px-5 py-2.5 text-sm font-semibold text-[#4f7fff] transition hover:bg-[#4f7fff25]"
            >
              Criar agora
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ativos.map(eb => {
              const [from, to] = titleGrad(eb.titulo)
              return (
                <div key={eb.slug} className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] overflow-hidden transition hover:border-[#4f7fff40]">
                  {/* Mini capa */}
                  <div className="flex h-28 items-end justify-between p-4" style={{ background: `linear-gradient(145deg,${from},${to})` }}>
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/15 text-xl font-extrabold text-white backdrop-blur-sm">
                      {eb.titulo.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="rounded-full bg-[#00e5c3]/20 px-2 py-0.5 text-[9px] font-bold uppercase text-[#00e5c3]">Disponível</span>
                      <span className="rounded-md bg-black/30 px-1.5 py-0.5 text-[9px] text-white/70">{eb.capitulos} caps</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-1 text-sm font-bold text-white">{eb.titulo}</h3>
                    {eb.subtitulo && <p className="mt-0.5 line-clamp-1 text-[11px] text-[#6b7a99]">{eb.subtitulo}</p>}
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#3a4a66]">
                      <Clock className="size-3" /> {formatDate(eb.createdAt)}
                    </div>

                    {/* Plataformas rápidas */}
                    <p className="mt-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#2a3553]">Publicar em:</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {PLATFORMS.map(p => (
                        <a
                          key={p.name}
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-lg border border-[#1c2438] bg-[#080b14] px-2.5 py-1.5 text-[10px] transition hover:border-[#4f7fff40]"
                        >
                          <span className="font-semibold text-[#c4d0e8]">{p.name}</span>
                          <span className="text-[#3a4a66]">{p.commission}</span>
                        </a>
                      ))}
                    </div>

                    {/* Ações */}
                    <div className="mt-3 flex gap-2">
                      <Link
                        href={`/receiver/${eb.slug}`}
                        className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-[#1c2438] bg-[#080b14] py-2 text-[11px] font-medium text-[#c4d0e8] transition hover:border-[#4f7fff40]"
                      >
                        <ExternalLink className="size-3" /> Ver briefing
                      </Link>
                      <a
                        href={`/api/pdf/${eb.slug}`}
                        download
                        className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#4f7fff15] py-2 text-[11px] font-semibold text-[#4f7fff] transition hover:bg-[#4f7fff25]"
                      >
                        ↓ Baixar PDF
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Guia de plataformas */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
          <TrendingUp className="size-4 text-[#00e5c3]" />
          Onde vender seu ebook
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {PLATFORMS.map(p => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-[#1c2438] bg-[#0b0f1c] px-5 py-4 transition hover:border-[#4f7fff40] hover:bg-[#0f1523]"
            >
              <div>
                <p className="font-bold text-white">{p.name}</p>
                <p className="mt-0.5 text-xs text-[#6b7a99]">Comissão para você: <span className="font-semibold text-[#00e5c3]">{p.commission}</span></p>
              </div>
              <ExternalLink className="size-4 text-[#3a4a66] transition group-hover:text-[#4f7fff]" />
            </a>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-[#2a3553]">
          <Link href="/dashboard/plataformas" className="text-[#4f7fff] hover:underline">Ver comparativo completo das plataformas →</Link>
        </p>
      </div>
    </div>
  )
}
