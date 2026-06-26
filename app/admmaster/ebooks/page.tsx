import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { BookOpen, ExternalLink, Clock, User } from 'lucide-react'

export default async function EbooksPage() {
  const deliveries = await prisma.delivery.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true, slug: true, nomeAutor: true, planJson: true,
      createdAt: true, expiresAt: true,
      user: { select: { id: true, name: true, email: true } },
    },
  })

  const gradients = [
    'from-blue-600 to-purple-600',
    'from-teal-500 to-cyan-600',
    'from-orange-600 to-red-600',
    'from-green-600 to-teal-600',
    'from-pink-600 to-purple-600',
    'from-indigo-600 to-blue-600',
    'from-amber-500 to-orange-600',
    'from-red-600 to-pink-600',
  ]

  return (
    <div className="p-6 md:p-8 max-w-6xl">

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white">Ebooks Gerados</h1>
        <p className="mt-1 text-sm text-[#4a5578]">{deliveries.length} ebook{deliveries.length !== 1 ? 's' : ''} gerado{deliveries.length !== 1 ? 's' : ''} na plataforma</p>
      </div>

      <div className="rounded-2xl border border-[#1a2035] bg-[#0d1120] overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 border-b border-[#1a2035] px-5 py-3 text-[10px] font-bold text-[#2e3a55] tracking-widest">
          <span>CAPA</span>
          <span>EBOOK</span>
          <span className="text-right">USUÁRIO</span>
          <span className="text-right">AÇÕES</span>
        </div>

        {deliveries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[#2e3a55]">
            <BookOpen className="size-8 mb-2" />
            <p className="text-sm">Nenhum ebook gerado ainda</p>
          </div>
        )}

        {deliveries.map((d, i) => {
          const plan = d.planJson as { titulo?: string; subtitulo?: string; capitulos?: unknown[] }
          const expired = new Date(d.expiresAt) < new Date()
          const capCount = Array.isArray(plan.capitulos) ? plan.capitulos.length : 0
          const grad = gradients[i % gradients.length]

          return (
            <div key={d.id} className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center border-b border-[#0a0e1a] px-5 py-3">
              {/* Mini capa */}
              <div className={`h-12 w-9 rounded-lg bg-gradient-to-br ${grad} flex items-center justify-center`}>
                <BookOpen className="size-3.5 text-white/70" />
              </div>

              {/* Info */}
              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold text-white">{plan.titulo ?? d.nomeAutor}</p>
                {plan.subtitulo && (
                  <p className="truncate text-[11px] text-[#4a5578]">{plan.subtitulo}</p>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px]">
                  {capCount > 0 && (
                    <span className="text-[#2e3a55]">{capCount} caps.</span>
                  )}
                  <span className="flex items-center gap-1 text-[#2e3a55]">
                    <Clock className="size-2.5" />
                    {new Date(d.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                  {expired
                    ? <span className="rounded-full bg-red-500/10 px-1.5 py-0.5 text-red-400">Expirado</span>
                    : <span className="rounded-full bg-[#00e5c3]/10 px-1.5 py-0.5 text-[#00e5c3]">Ativo</span>
                  }
                </div>
              </div>

              {/* Usuário */}
              <div className="text-right">
                {d.user ? (
                  <Link href={`/admmaster/users/${d.user.id}`}
                    className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 transition-colors">
                    <User className="size-3" />
                    <span className="max-w-[120px] truncate">{d.user.name ?? d.user.email}</span>
                  </Link>
                ) : (
                  <span className="text-[11px] text-[#2e3a55]">Lead anônimo</span>
                )}
              </div>

              {/* Ações */}
              <div className="flex items-center gap-1.5">
                <a
                  href={`/receiver/${d.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg border border-[#1a2035] px-2.5 py-1.5 text-[11px] text-[#4a5578] hover:text-white hover:border-purple-500/40 transition-colors"
                >
                  <ExternalLink className="size-3" /> Ver
                </a>
                <a
                  href={`/api/pdf/${d.slug}`}
                  download
                  className="rounded-lg bg-[#4f7fff] px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#3a6be0] transition-colors"
                >
                  PDF
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
