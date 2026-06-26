import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { cache } from 'react'
import { Trophy } from 'lucide-react'

// cache() deduplica a query se dashboard/page.tsx já tiver chamado no mesmo request
const getEbookCount = cache(async (userId: string) =>
  prisma.delivery.count({ where: { userId } })
)
import { cn } from '@/lib/utils'

const BADGES = [
  {
    id: 'first',
    icone: '🎉',
    nome: 'Primeiro Passo',
    descricao: 'Criou seu primeiro ebook com a Aurora IA',
    requisito: (n: number) => n >= 1,
    meta: 1,
    cor: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30',
    corTexto: 'text-amber-400',
  },
  {
    id: 'five',
    icone: '📚',
    nome: 'Autor Produtivo',
    descricao: 'Criou 5 ebooks — você está construindo seu catálogo!',
    requisito: (n: number) => n >= 5,
    meta: 5,
    cor: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30',
    corTexto: 'text-blue-400',
  },
  {
    id: 'ten',
    icone: '⭐',
    nome: 'Escritor Expert',
    descricao: 'Criou 10 ebooks — um portfólio impressionante!',
    requisito: (n: number) => n >= 10,
    meta: 10,
    cor: 'from-purple-500/20 to-violet-500/10 border-purple-500/30',
    corTexto: 'text-purple-400',
  },
  {
    id: 'twentyfive',
    icone: '🚀',
    nome: 'Revendedor Master',
    descricao: 'Criou 25 ebooks — você é um profissional da palavra!',
    requisito: (n: number) => n >= 25,
    meta: 25,
    cor: 'from-[#4f7fff]/20 to-indigo-500/10 border-[#4f7fff]/30',
    corTexto: 'text-[#4f7fff]',
  },
  {
    id: 'fifty',
    icone: '👑',
    nome: 'Lenda do Clube',
    descricao: 'Criou 50 ebooks — você é uma referência no mercado digital!',
    requisito: (n: number) => n >= 50,
    meta: 50,
    cor: 'from-[#00e5c3]/20 to-teal-500/10 border-[#00e5c3]/30',
    corTexto: 'text-[#00e5c3]',
  },
  {
    id: 'indicar',
    icone: '🤝',
    nome: 'Indicador',
    descricao: 'Indicou um amigo que criou o primeiro ebook',
    requisito: () => false,
    meta: 1,
    cor: 'from-pink-500/20 to-rose-500/10 border-pink-500/30',
    corTexto: 'text-pink-400',
    emBreve: true,
  },
]

export default async function ConquistasPage() {
  const session = await auth()
  const userId = session?.user?.id

  let total = 0
  if (userId) {
    total = await getEbookCount(userId)
  }

  const nextBadge = BADGES.filter(b => !b.emBreve && !b.requisito(total))[0]

  return (
    <div className="px-5 py-6 md:px-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4f7fff15]">
          <Trophy className="size-5 text-[#4f7fff]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Conquistas</h1>
          <p className="text-sm text-[#6b7a99]">Desbloqueie badges criando e vendendo ebooks</p>
        </div>
        <div className="ml-auto rounded-xl border border-[#1c2438] bg-[#0f1523] px-4 py-2 text-center">
          <p className="text-xl font-extrabold text-white">{total}</p>
          <p className="text-[10px] text-[#3a4a66]">ebooks criados</p>
        </div>
      </div>

      {/* Next goal */}
      {nextBadge && (
        <div className="mb-6 rounded-2xl border border-[#4f7fff20] bg-[#4f7fff08] p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#4f7fff]">Próxima conquista</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl opacity-50">{nextBadge.icone}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{nextBadge.nome}</p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#1c2438]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#4f7fff] to-[#00e5c3]"
                  style={{ width: `${Math.min(100, (total / nextBadge.meta) * 100)}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-[#3a4a66]">{total} / {nextBadge.meta} ebooks</p>
            </div>
          </div>
        </div>
      )}

      {/* Badges grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BADGES.map(badge => {
          const unlocked = !badge.emBreve && badge.requisito(total)
          return (
            <div
              key={badge.id}
              className={cn(
                'relative overflow-hidden rounded-2xl border p-5 transition-all',
                unlocked
                  ? `bg-gradient-to-br ${badge.cor}`
                  : 'border-[#1c2438] bg-[#0f1523] opacity-50',
              )}
            >
              {badge.emBreve && (
                <span className="absolute right-3 top-3 rounded-full bg-[#1c2438] px-2 py-0.5 text-[9px] font-bold text-[#3a4a66]">
                  EM BREVE
                </span>
              )}
              <div className="mb-3 text-4xl">{badge.icone}</div>
              <h3 className={cn('font-bold', unlocked ? badge.corTexto : 'text-[#3a4a66]')}>
                {badge.nome}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#6b7a99]">{badge.descricao}</p>
              {unlocked && (
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white">
                  ✓ Desbloqueado
                </div>
              )}
              {!unlocked && !badge.emBreve && (
                <p className="mt-3 text-[11px] text-[#2a3553]">
                  Crie {badge.meta - total} ebook{badge.meta - total !== 1 ? 's' : ''} para desbloquear
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
