import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import {
  TrendingUp, BookOpen, ExternalLink, Clock, Zap, ShoppingBag,
  Globe2, DollarSign, Star, Rocket, BarChart3, Package,
} from 'lucide-react'
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
  { name: 'Hotmart',     commission: '70%', color: '#ff4d00', desc: 'Líder em infoprodutos no BR', url: 'https://hotmart.com' },
  { name: 'Eduzz',       commission: '70%', color: '#5c6bc0', desc: 'Checkout e membros integrados', url: 'https://eduzz.com' },
  { name: 'Amazon KDP',  commission: '35%', color: '#ff9900', desc: 'Maior livraria digital do mundo', url: 'https://kdp.amazon.com' },
  { name: 'Gumroad',     commission: '91%', color: '#ff90e8', desc: 'Pagamentos globais simples', url: 'https://gumroad.com' },
]

const NAV_CARDS = [
  { href: '/dashboard', icon: BookOpen, label: 'Meus Ebooks', desc: 'Voltar à estante', color: '#6b7a99' },
  { href: '/dashboard/vendas', icon: TrendingUp, label: 'Vendas', desc: 'Distribuição e plataformas', color: '#00e5c3', active: true },
  { href: '/dashboard/plataformas', icon: Globe2, label: 'Plataformas', desc: 'Comparativo completo', color: '#4f7fff' },
  { href: '/dashboard/kit-vendas', icon: Package, label: 'Kit de Vendas', desc: 'Copies e materiais', color: '#f97316' },
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
    return {
      slug: d.slug,
      titulo: plan.titulo ?? 'Sem título',
      subtitulo: plan.subtitulo ?? '',
      capitulos: Array.isArray(plan.capitulos) ? plan.capitulos.length : 0,
      createdAt: d.createdAt.toISOString(),
      expired: d.expiresAt < new Date(),
    }
  })

  const ativos = ebooks.filter(e => !e.expired)
  const total = ebooks.length

  const STATS = [
    { label: 'Ebooks criados', value: total, icon: BookOpen, color: '#4f7fff', bg: '#4f7fff18' },
    { label: 'Disponíveis', value: ativos.length, icon: Star, color: '#00e5c3', bg: '#00e5c318' },
    { label: 'Plataformas', value: 4, icon: Globe2, color: '#8b5cf6', bg: '#8b5cf618' },
    { label: 'Expirados', value: total - ativos.length, icon: Clock, color: '#6b7a99', bg: '#6b7a9918' },
  ]

  return (
    <div className="px-5 pt-6 pb-16 md:px-8">

      {/* ── Navegação em cards ── */}
      <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {NAV_CARDS.map(({ href, icon: Icon, label, desc, color, active }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-2 rounded-2xl border p-4 transition-all hover:-translate-y-0.5"
            style={{
              borderColor: active ? `${color}40` : '#1c2438',
              background: active ? `${color}0d` : '#0b0f1c',
            }}
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${color}18` }}>
              <Icon className="size-4" style={{ color }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">{label}</p>
              <p className="text-[11px] text-[#6b7a99] mt-0.5">{desc}</p>
            </div>
            {active && (
              <span className="mt-auto w-fit rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                style={{ background: `${color}25`, color }}>
                Ativo
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* ── Estatísticas ── */}
      <div className="mb-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] text-[#6b7a99]">{label}</p>
              <div className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: bg }}>
                <Icon className="size-3.5" style={{ color }} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Seus ebooks ── */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#4f7fff18]">
              <ShoppingBag className="size-4 text-[#4f7fff]" />
            </div>
            <h2 className="text-base font-bold text-white">Ebooks disponíveis para venda</h2>
          </div>
          <Link
            href="/dashboard/criar"
            className="flex items-center gap-1.5 rounded-xl bg-[#4f7fff] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#3a6be0]"
          >
            <Zap className="size-3.5" /> Criar
          </Link>
        </div>

        {ativos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#1c2438] py-14 text-center">
            <BookOpen className="mx-auto mb-3 size-8 text-[#2a3553]" />
            <p className="font-semibold text-[#6b7a99]">Nenhum ebook disponível ainda</p>
            <p className="mt-1 text-sm text-[#3a4a66]">Crie seu primeiro ebook para começar a vender</p>
            <Link href="/dashboard/criar"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#4f7fff15] px-5 py-2.5 text-sm font-semibold text-[#4f7fff] transition hover:bg-[#4f7fff25]">
              Criar agora
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ativos.map(eb => {
              const [from, to] = titleGrad(eb.titulo)
              return (
                <div key={eb.slug} className="overflow-hidden rounded-2xl border border-[#1c2438] bg-[#0b0f1c] transition hover:border-[#4f7fff30] hover:-translate-y-0.5">
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
                    <p className="mt-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#2a3553]">Publicar em:</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {PLATFORMS.map(p => (
                        <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-lg border border-[#1c2438] bg-[#080b14] px-2.5 py-1.5 text-[10px] transition hover:border-[#4f7fff30]">
                          <span className="font-semibold text-[#c4d0e8]">{p.name}</span>
                          <span className="text-[#3a4a66]">{p.commission}</span>
                        </a>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link href={`/receiver/${eb.slug}`}
                        className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-[#1c2438] bg-[#080b14] py-2 text-[11px] font-medium text-[#c4d0e8] transition hover:border-[#4f7fff30]">
                        <ExternalLink className="size-3" /> Ver briefing
                      </Link>
                      <a href={`/api/pdf/${eb.slug}`} download
                        className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#4f7fff15] py-2 text-[11px] font-semibold text-[#4f7fff] transition hover:bg-[#4f7fff25]">
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

      {/* ── Onde vender ── */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#00e5c318]">
            <TrendingUp className="size-4 text-[#00e5c3]" />
          </div>
          <h2 className="text-base font-bold text-white">Onde vender seu ebook</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {PLATFORMS.map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-[#1c2438] bg-[#0b0f1c] px-5 py-4 transition hover:border-[#4f7fff30] hover:bg-[#0f1523] hover:-translate-y-0.5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: `${p.color}18` }}>
                <Globe2 className="size-5" style={{ color: p.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white">{p.name}</p>
                <p className="mt-0.5 text-xs text-[#6b7a99]">{p.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-[#00e5c3]">{p.commission}</p>
                <p className="text-[10px] text-[#3a4a66]">comissão</p>
              </div>
              <ExternalLink className="size-4 text-[#3a4a66] transition group-hover:text-[#4f7fff]" />
            </a>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-[#4f7fff20] bg-[#4f7fff08] p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#4f7fff18]">
              <BarChart3 className="size-4 text-[#4f7fff]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Veja o comparativo completo</p>
              <p className="text-xs text-[#6b7a99]">Taxas, recursos e integrações de cada plataforma</p>
            </div>
            <Link href="/dashboard/plataformas"
              className="flex items-center gap-1.5 rounded-xl bg-[#4f7fff20] px-3 py-1.5 text-xs font-semibold text-[#4f7fff] transition hover:bg-[#4f7fff30]">
              <Rocket className="size-3.5" /> Ver mais
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
