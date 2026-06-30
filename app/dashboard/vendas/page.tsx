import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import {
  TrendingUp, BookOpen, ExternalLink, Clock, Zap,
  Globe2, Star, BarChart3, Download, ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import type { BriefingPlan } from '@/lib/generate-pdf'

const GRADIENTS: [string, string][] = [
  ['#1e3a5f', '#2563eb'], ['#0f4c3a', '#10b981'], ['#3b1f6b', '#8b5cf6'],
  ['#7c2d12', '#f97316'], ['#1e3a5f', '#0ea5e9'], ['#14532d', '#22c55e'],
  ['#831843', '#ec4899'], ['#1e1b4b', '#6366f1'],
]
function titleGrad(t: string): [string, string] {
  let h = 0; for (let i = 0; i < t.length; i++) h = t.charCodeAt(i) + ((h << 5) - h)
  return GRADIENTS[Math.abs(h) % GRADIENTS.length]
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const PLATFORMS = [
  { name: 'Hotmart',    commission: '70%', color: '#f97316', desc: 'Líder em infoprodutos no BR',      url: 'https://hotmart.com' },
  { name: 'Eduzz',      commission: '70%', color: '#4f7fff', desc: 'Checkout e membros integrados',    url: 'https://eduzz.com' },
  { name: 'Amazon KDP', commission: '35%', color: '#a855f7', desc: 'Maior livraria digital do mundo',  url: 'https://kdp.amazon.com' },
  { name: 'Gumroad',    commission: '91%', color: '#ec4899', desc: 'Pagamentos globais simples',       url: 'https://gumroad.com' },
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

  return (
    <div className="px-5 pt-6 pb-16 md:px-8">

      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: 'linear-gradient(135deg,#00e5c3,#00b09b)', boxShadow: '0 4px 20px rgba(0,229,195,0.4)' }}>
          <TrendingUp className="size-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Vendas</h1>
          <p className="text-sm text-[#a0b0c8]">Distribua seus ebooks nas maiores plataformas</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Ebooks criados', value: total,              icon: BookOpen, g: 'linear-gradient(135deg,#4f7fff,#2554e0)', s: 'rgba(79,127,255,0.4)' },
          { label: 'Disponíveis',    value: ativos.length,      icon: Star,     g: 'linear-gradient(135deg,#00e5c3,#00b09b)', s: 'rgba(0,229,195,0.4)' },
          { label: 'Plataformas',    value: PLATFORMS.length,   icon: Globe2,   g: 'linear-gradient(135deg,#a855f7,#7c3aed)', s: 'rgba(168,85,247,0.4)' },
          { label: 'Expirados',      value: total - ativos.length, icon: Clock, g: 'linear-gradient(135deg,#78909c,#546e7a)', s: 'rgba(84,110,122,0.4)' },
        ].map(({ label, value, icon: Icon, g, s }) => (
          <div key={label} className="overflow-hidden rounded-xl border border-[#1c2438]" style={{ background: '#0d1220' }}>
            <div className="flex">
              <div className="grid w-[60px] shrink-0 place-items-center py-4" style={{ background: g, boxShadow: s }}>
                <Icon className="size-5 text-white" />
              </div>
              <div className="flex flex-col justify-center p-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#a0b0c8]">{label}</p>
                <p className="text-xl font-black text-white tabular-nums">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ebooks */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-white">Ebooks disponíveis para venda</h2>
          <Link href="/dashboard/criar"
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[12px] font-bold text-white transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}>
            <Zap className="size-3.5" /> Criar
          </Link>
        </div>

        {ativos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1c2438] py-14 text-center" style={{ background: '#0d1220' }}>
            <div className="mb-3 grid h-14 w-14 place-items-center rounded-xl" style={{ background: '#0b0f1c' }}>
              <BookOpen className="size-7 text-[#8896b0]" />
            </div>
            <p className="font-semibold text-white">Nenhum ebook disponível ainda</p>
            <p className="mt-1 text-[12px] text-[#a0b0c8]">Crie seu primeiro ebook para começar a vender</p>
            <Link href="/dashboard/criar"
              className="mt-4 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[12px] font-bold text-white transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}>
              Criar agora <ArrowRight className="size-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ativos.map(eb => {
              const [from, to] = titleGrad(eb.titulo)
              return (
                <div key={eb.slug} className="overflow-hidden rounded-xl border border-[#1c2438] transition hover:-translate-y-0.5 hover:border-[#2a3553]" style={{ background: '#0d1220' }}>
                  <div className="relative h-28 flex items-end justify-between p-3" style={{ background: `linear-gradient(145deg,${from},${to})` }}>
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/15 text-lg font-extrabold text-white backdrop-blur-sm">
                      {eb.titulo.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold text-white">Disponível</span>
                      <span className="rounded bg-black/30 px-1.5 py-0.5 text-[9px] text-white/80">{eb.capitulos} caps</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-1 text-[13px] font-bold text-white">{eb.titulo}</h3>
                    {eb.subtitulo && <p className="mt-0.5 line-clamp-1 text-[11px] text-[#a0b0c8]">{eb.subtitulo}</p>}
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-[#8896b0]">
                      <Clock className="size-3" /> {formatDate(eb.createdAt)}
                    </div>
                    <p className="mt-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#8896b0]">Publicar em:</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {PLATFORMS.map(p => (
                        <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-lg border border-[#1c2438] px-2.5 py-1.5 text-[10px] transition hover:border-[#2a3553]"
                          style={{ background: '#0b0f1c' }}>
                          <span className="font-semibold text-[#c4d0e8]">{p.name}</span>
                          <span className="font-bold text-[#00e5c3]">{p.commission}</span>
                        </a>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link href={`/receiver/${eb.slug}`}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#1c2438] py-2 text-[11px] font-medium text-[#a0b0c8] transition hover:border-[#2a3553] hover:text-white">
                        <ExternalLink className="size-3" /> Ver
                      </Link>
                      <a href={`/api/pdf/${eb.slug}`} download
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-semibold text-white transition hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}>
                        <Download className="size-3" /> PDF
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Onde vender */}
      <div>
        <h2 className="mb-4 text-[15px] font-bold text-white">Onde vender seu ebook</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {PLATFORMS.map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-[#1c2438] px-5 py-4 transition hover:-translate-y-0.5 hover:border-[#2a3553]"
              style={{ background: '#0d1220' }}>
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: `${p.color}18` }}>
                <Globe2 className="size-5" style={{ color: p.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white">{p.name}</p>
                <p className="mt-0.5 text-[11px] text-[#a0b0c8]">{p.desc}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[14px] font-bold text-[#00e5c3]">{p.commission}</p>
                <p className="text-[10px] text-[#8896b0]">comissão</p>
              </div>
              <ExternalLink className="size-4 text-[#8896b0] transition group-hover:text-[#4f7fff]" />
            </a>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4 rounded-xl border border-[#1c2438] p-4" style={{ background: '#0d1220' }}>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}>
            <BarChart3 className="size-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-white">Veja o comparativo completo</p>
            <p className="text-[11px] text-[#a0b0c8]">Taxas, recursos e integrações de cada plataforma</p>
          </div>
          <Link href="/dashboard/plataformas"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold text-white transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}>
            Ver mais
          </Link>
        </div>
      </div>
    </div>
  )
}
