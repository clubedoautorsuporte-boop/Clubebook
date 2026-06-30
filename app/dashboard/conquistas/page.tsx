import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { cache } from 'react'
import { Trophy, BookOpen, Award, Star } from 'lucide-react'

const getUser = cache(async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: { _count: { select: { ebooks: true } } },
  })
})

const CONQUISTAS = [
  { id: 'primeiro', icone: '🎉', titulo: 'Primeiro Ebook', desc: 'Crie seu primeiro ebook com a Aurora IA', meta: 1, campo: 'ebooksCount' as const, cor: '#4f7fff', g: 'linear-gradient(135deg,#4f7fff,#2554e0)' },
  { id: 'cinco', icone: '⭐', titulo: 'Criador de Conteúdo', desc: 'Crie 5 ebooks e prove que você é consistente', meta: 5, campo: 'ebooksCount' as const, cor: '#f97316', g: 'linear-gradient(135deg,#f97316,#ea580c)' },
  { id: 'dez', icone: '🔥', titulo: 'Fábrica de Ebooks', desc: 'Crie 10 ebooks e torne-se um criador ativo', meta: 10, campo: 'ebooksCount' as const, cor: '#e53935', g: 'linear-gradient(135deg,#ef5350,#e53935)' },
  { id: 'vinte', icone: '🏆', titulo: 'Mestre dos Ebooks', desc: 'Crie 20 ebooks — você é um profissional!', meta: 20, campo: 'ebooksCount' as const, cor: '#a855f7', g: 'linear-gradient(135deg,#a855f7,#7c3aed)' },
  { id: 'cinquenta', icone: '💎', titulo: 'Lenda da Plataforma', desc: 'Crie 50 ebooks e entre para o hall da fama', meta: 50, campo: 'ebooksCount' as const, cor: '#ec4899', g: 'linear-gradient(135deg,#ec4899,#be185d)' },
]

export default async function ConquistasPage() {
  const session = await auth()
  const userId = (session?.user as Record<string, unknown>)?.id as string | undefined
  const user = userId ? await getUser(userId) : null
  const ebooksCount = user?._count?.ebooks ?? 0

  const conquistadas = CONQUISTAS.filter(c => {
    if (c.campo === 'ebooksCount') return ebooksCount >= c.meta
    return false
  })

  return (
    <div className="px-5 py-6 pb-16 md:px-8">

      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 4px 20px rgba(249,115,22,0.4)' }}>
          <Trophy className="size-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Conquistas</h1>
          <p className="text-sm text-[#a0b0c8]">{conquistadas.length} de {CONQUISTAS.length} desbloqueadas</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { label: 'Ebooks criados', value: ebooksCount,            icon: BookOpen, g: 'linear-gradient(135deg,#4f7fff,#2554e0)', s: 'rgba(79,127,255,0.4)' },
          { label: 'Conquistas',     value: conquistadas.length,    icon: Award,    g: 'linear-gradient(135deg,#f97316,#ea580c)', s: 'rgba(249,115,22,0.4)' },
          { label: 'Pontos XP',      value: conquistadas.length * 100, icon: Star,  g: 'linear-gradient(135deg,#ec4899,#be185d)', s: 'rgba(236,72,153,0.4)' },
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONQUISTAS.map(({ id, icone, titulo, desc, meta, campo, cor, g }) => {
          const progresso = campo === 'ebooksCount' ? Math.min(ebooksCount, meta) : 0
          const desbloqueada = progresso >= meta
          const pct = Math.round((progresso / meta) * 100)

          return (
            <div key={id} className={`flex flex-col rounded-xl border overflow-hidden transition ${desbloqueada ? 'border-[#1c2438]' : 'border-[#1c2438] opacity-50'}`} style={{ background: '#0d1220' }}>
              {desbloqueada && <div className="h-0.5 w-full" style={{ background: g }} />}
              <div className="flex flex-col flex-1 p-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className={`text-3xl ${desbloqueada ? '' : 'grayscale'}`}>{icone}</span>
                  <div>
                    <p className="text-[13px] font-bold text-white">{titulo}</p>
                    {desbloqueada && (
                      <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ background: `${cor}18`, color: cor }}>
                        Desbloqueada ✓
                      </span>
                    )}
                  </div>
                </div>
                <p className="mb-4 text-[11px] leading-relaxed text-[#a0b0c8]">{desc}</p>
                <div className="mt-auto">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[10px] text-[#8896b0]">{progresso}/{meta}</span>
                    <span className="text-[10px] font-bold" style={{ color: desbloqueada ? cor : '#8896b0' }}>{pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: '#1c2438' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: desbloqueada ? g : '#2a3553' }} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
