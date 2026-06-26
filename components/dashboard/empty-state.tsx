import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-[#1c2438] bg-[#0f1523]">
        <BookOpen className="size-7 text-[#4f7fff]" />
      </div>
      <h3 className="text-lg font-semibold text-white">Nenhum ebook ainda</h3>
      <p className="mt-2 max-w-xs text-sm text-[#6b7a99]">
        Você ainda não gerou nenhum ebook. Crie o primeiro agora e ele aparece aqui.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(79,127,255,0.3)] transition hover:-translate-y-0.5"
      >
        Criar meu ebook
        <ArrowRight className="size-4" />
      </Link>
    </div>
  )
}
