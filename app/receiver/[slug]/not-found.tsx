import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      </div>
      <h1 className="mb-3 text-2xl font-bold text-white">
        Planejamento não encontrado
      </h1>
      <p className="mb-8 max-w-sm text-sm text-white/50">
        Este link pode ter expirado ou é inválido. Os planejamentos ficam disponíveis por 30 dias.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl border border-teal-500/40 bg-teal-500/10 px-6 py-3 text-sm font-semibold text-teal-400 transition hover:bg-teal-500/20"
      >
        Criar meu ebook →
      </Link>
    </div>
  )
}
