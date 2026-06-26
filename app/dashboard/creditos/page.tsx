import { Gem, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export default async function CreditosPage() {
  const session = await auth()
  const userId = session?.user?.id
  let total = 0
  if (userId) {
    total = await prisma.delivery.count({ where: { userId } })
  }

  return (
    <div className="px-5 py-6 md:px-8 max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4f7fff15]">
          <Gem className="size-5 text-[#4f7fff]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Créditos</h1>
          <p className="text-sm text-[#6b7a99]">Histórico de uso e recarga de créditos</p>
        </div>
      </div>

      {/* Current balance */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-yellow-500/5 p-5 text-center">
          <div className="text-4xl font-extrabold text-white">{total}</div>
          <div className="mt-1 text-xs font-semibold text-amber-400">EBOOKS CRIADOS</div>
        </div>
        <div className="flex-1 rounded-2xl border border-[#1c2438] bg-[#0f1523] p-5 text-center">
          <div className="text-4xl font-extrabold text-[#3a4a66]">∞</div>
          <div className="mt-1 text-xs font-semibold text-[#3a4a66]">SEM LIMITE</div>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-[#1c2438] py-16 text-center">
        <p className="text-4xl mb-3">💎</p>
        <h2 className="text-base font-bold text-white mb-2">Sistema de créditos chegando em breve</h2>
        <p className="text-sm text-[#6b7a99] mb-6 max-w-sm mx-auto">
          Em breve você poderá comprar pacotes de créditos para criar mais ebooks com desconto progressivo.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_16px_rgba(79,127,255,0.3)] transition hover:shadow-[0_0_24px_rgba(79,127,255,0.5)]"
        >
          Criar ebook agora
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}
