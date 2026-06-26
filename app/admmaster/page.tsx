import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Users, BookOpen, FileText, TrendingUp, Clock, ExternalLink } from 'lucide-react'

export default async function AdmMasterPage() {
  const [totalUsers, totalDeliveries, totalDrafts, recentUsers, recentDeliveries] = await Promise.all([
    prisma.user.count(),
    prisma.delivery.count(),
    prisma.draft.count(),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        id: true, name: true, email: true, image: true, credits: true, createdAt: true,
        _count: { select: { deliveries: true } },
      },
    }),
    prisma.delivery.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: {
        id: true, slug: true, nomeAutor: true, planJson: true, createdAt: true,
        user: { select: { id: true, name: true, email: true } },
      },
    }),
  ])

  const stats = [
    { label: 'Usuários cadastrados', value: totalUsers, icon: Users,     color: 'text-blue-400',   bg: 'bg-blue-500/10'   },
    { label: 'Ebooks gerados',       value: totalDeliveries, icon: BookOpen, color: 'text-[#00e5c3]', bg: 'bg-[#00e5c3]/10'  },
    { label: 'Rascunhos ativos',     value: totalDrafts, icon: FileText,  color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Média ebooks/usuário', value: totalUsers > 0 ? (totalDeliveries / totalUsers).toFixed(1) : '0', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ]

  return (
    <div className="p-6 md:p-8 max-w-6xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Visão Geral</h1>
        <p className="mt-1 text-sm text-[#4a5578]">Painel de controle completo da plataforma</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-[#1a2035] bg-[#0d1120] p-5">
            <div className={`mb-3 inline-grid h-9 w-9 place-items-center rounded-xl ${bg}`}>
              <Icon className={`size-4.5 ${color}`} />
            </div>
            <p className="text-2xl font-extrabold text-white">{value}</p>
            <p className="mt-1 text-[11px] text-[#4a5578]">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Últimos usuários */}
        <div className="rounded-2xl border border-[#1a2035] bg-[#0d1120]">
          <div className="flex items-center justify-between border-b border-[#1a2035] px-5 py-4">
            <h2 className="text-sm font-bold text-white">Últimos Usuários</h2>
            <Link href="/admmaster/users" className="text-[11px] text-purple-400 hover:text-purple-300">
              Ver todos →
            </Link>
          </div>
          <div className="divide-y divide-[#0f1525]">
            {recentUsers.map(u => (
              <Link key={u.id} href={`/admmaster/users/${u.id}`}
                className="flex items-center gap-3 px-5 py-3 hover:bg-[#0f1525] transition-colors">
                {u.image
                  ? <img src={u.image} alt="" className="h-8 w-8 rounded-full object-cover" />
                  : <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-purple-600/20 text-[11px] font-bold text-purple-300">
                      {(u.name ?? u.email ?? '?')[0].toUpperCase()}
                    </div>
                }
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-white">{u.name ?? 'Sem nome'}</p>
                  <p className="truncate text-[10px] text-[#4a5578]">{u.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-[#00e5c3]">{u._count.deliveries} ebooks</p>
                  <p className="text-[10px] text-[#4a5578]">{u.credits.toLocaleString('pt-BR')} créditos</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Últimos ebooks */}
        <div className="rounded-2xl border border-[#1a2035] bg-[#0d1120]">
          <div className="flex items-center justify-between border-b border-[#1a2035] px-5 py-4">
            <h2 className="text-sm font-bold text-white">Últimos Ebooks Gerados</h2>
            <Link href="/admmaster/ebooks" className="text-[11px] text-purple-400 hover:text-purple-300">
              Ver todos →
            </Link>
          </div>
          <div className="divide-y divide-[#0f1525]">
            {recentDeliveries.map(d => {
              const plan = d.planJson as { titulo?: string }
              return (
                <div key={d.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-500/10 text-[11px] font-bold text-blue-400">
                    <BookOpen className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-white">{plan.titulo ?? d.nomeAutor}</p>
                    <p className="truncate text-[10px] text-[#4a5578]">{d.user?.email ?? 'Lead anônimo'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[9px] text-[#2e3a55]">
                      <Clock className="size-3" />
                      {new Date(d.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <a href={`/receiver/${d.slug}`} target="_blank" rel="noopener noreferrer"
                      className="rounded-lg border border-[#1a2035] px-2 py-1 text-[9px] text-[#4a5578] hover:text-white transition-colors">
                      <ExternalLink className="size-3 inline" />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
