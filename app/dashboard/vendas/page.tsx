import { TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function VendasPage() {
  return (
    <div className="px-5 py-6 md:px-8 max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4f7fff15]">
          <TrendingUp className="size-5 text-[#4f7fff]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Vendas</h1>
          <p className="text-sm text-[#6b7a99]">Acompanhe as vendas dos seus ebooks</p>
        </div>
        <span className="ml-auto rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-bold text-amber-400">EM BREVE</span>
      </div>

      <div className="rounded-2xl border border-dashed border-[#1c2438] py-20 text-center">
        <p className="text-5xl mb-4">📊</p>
        <h2 className="text-lg font-bold text-white mb-2">Painel de vendas chegando em breve</h2>
        <p className="text-sm text-[#6b7a99] mb-6 max-w-sm mx-auto">
          Aqui você vai acompanhar cada venda dos seus ebooks em tempo real, integrado com Hotmart, Eduzz e outras plataformas.
        </p>
        <Link
          href="/dashboard/plataformas"
          className="inline-flex items-center gap-2 rounded-xl bg-[#4f7fff15] px-5 py-2.5 text-sm font-semibold text-[#4f7fff] transition hover:bg-[#4f7fff25]"
        >
          Ver plataformas disponíveis
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}
