import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Sidebar, BottomNav } from '@/components/dashboard/sidebar'
import { EbookCard } from '@/components/dashboard/ebook-card'
import { EmptyState } from '@/components/dashboard/empty-state'
import { QuickCreate } from '@/components/dashboard/quick-create'
import { Bell, BookOpen, CheckCircle2, Clock4, Plus, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { BriefingPlan } from '@/lib/generate-pdf'

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id

  type DeliveryRow = {
    slug: string
    titulo: string
    subtitulo: string
    capitulosCount: number
    createdAt: string
    expired: boolean
  }

  let rows: DeliveryRow[] = []

  if (userId) {
    const deliveries = await prisma.delivery.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, slug: true, planJson: true, createdAt: true, expiresAt: true },
    })
    rows = deliveries.map((d: { id: string; slug: string; planJson: unknown; createdAt: Date; expiresAt: Date }) => {
      const plan = d.planJson as BriefingPlan
      return {
        slug: d.slug,
        titulo: plan.titulo ?? 'Sem título',
        subtitulo: plan.subtitulo ?? '',
        capitulosCount: Array.isArray(plan.capitulos) ? plan.capitulos.length : 0,
        createdAt: d.createdAt.toISOString(),
        expired: d.expiresAt < new Date(),
      }
    })
  }

  const total = rows.length
  const ativos = rows.filter(r => !r.expired).length
  const expirados = rows.filter(r => r.expired).length
  const firstName = session?.user?.name?.split(' ')[0] ?? 'Autor'

  return (
    <div className="flex min-h-screen bg-[#080b14]">
      {/* Sidebar desktop */}
      <div className="hidden md:flex md:flex-col">
        <Sidebar
          userName={session?.user?.name}
          userImage={session?.user?.image}
          userEmail={session?.user?.email}
          ebookCount={total}
          userId={userId}
        />
      </div>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-[#1c2438] bg-[#080b14] px-6 py-4">
          <div>
            <h1 className="text-lg font-bold text-white">Olá, {firstName} 👋</h1>
            <p className="text-xs text-[#6b7a99]">Bem-vindo à sua área de criação</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Aurora status */}
            <div className="hidden items-center gap-1.5 rounded-full border border-[#00e5c318] bg-[#00e5c308] px-3 py-1.5 sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00e5c3]" />
              <span className="text-[11px] font-medium text-[#00e5c3]">Aurora online · ~47min</span>
            </div>

            <button className="relative grid h-9 w-9 place-items-center rounded-xl border border-[#1c2438] text-[#6b7a99] transition hover:text-white">
              <Bell className="size-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#4f7fff]" />
            </button>
            <Link
              href="/"
              className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_16px_rgba(79,127,255,0.3)] transition hover:-translate-y-0.5 sm:flex"
            >
              <Plus className="size-4" />
              Criar Ebook
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-5 pb-24 pt-6 md:px-8 md:pb-8">

          {/* Banner */}
          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[#4f7fff20] bg-gradient-to-r from-[#4f7fff08] to-[#00e5c308] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#4f7fff15]">
                <Sparkles className="size-5 text-[#4f7fff]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Novidade: receba seu ebook em ~47 minutos</p>
                <p className="text-xs text-[#6b7a99]">PDF + DOCX + EPUB com direitos comerciais 100% seus</p>
              </div>
            </div>
            <Link href="/" className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#4f7fff] hover:underline">
              Criar agora <ArrowRight className="size-3" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            {[
              { label: 'Total de ebooks', value: total, icon: BookOpen, color: 'text-[#4f7fff]', bg: 'bg-[#4f7fff10]' },
              { label: 'Disponíveis', value: ativos, icon: CheckCircle2, color: 'text-[#00e5c3]', bg: 'bg-[#00e5c310]' },
              { label: 'Expirados', value: expirados, icon: Clock4, color: 'text-amber-400', bg: 'bg-amber-400/10' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="rounded-2xl border border-[#1c2438] bg-[#0f1523] p-4">
                <div className={`mb-3 inline-grid h-9 w-9 place-items-center rounded-xl ${bg} ${color}`}>
                  <Icon className="size-4" />
                </div>
                <div className="text-2xl font-extrabold text-white">{value}</div>
                <div className="mt-0.5 text-xs text-[#6b7a99]">{label}</div>
              </div>
            ))}
          </div>

          {/* Ebooks section */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Meus Ebooks</h2>
              <p className="text-xs text-[#6b7a99]">
                {total > 0 ? `Continue de onde parou ou crie um novo.` : 'Comece criando seu primeiro ebook.'}
              </p>
            </div>
            {total > 0 && (
              <Link href="/" className="flex items-center gap-1.5 rounded-xl border border-[#1c2438] bg-[#0f1523] px-3 py-2 text-xs font-semibold text-white transition hover:border-[#4f7fff40]">
                <Plus className="size-3.5" />
                Novo
              </Link>
            )}
          </div>

          {/* Quick create — always visible above ebook grid */}
          {total > 0 && (
            <div className="mb-6">
              <QuickCreate />
            </div>
          )}

          {total === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map(r => (
                <EbookCard key={r.slug} {...r} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Bottom nav mobile */}
      <BottomNav />
    </div>
  )
}
