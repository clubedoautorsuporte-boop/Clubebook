import Link from 'next/link'
import { BookOpen, AlertCircle } from 'lucide-react'

export const metadata = {
  title: 'Erro de autenticação | Clube do Autor IA',
  robots: 'noindex',
}

const errorMessages: Record<string, string> = {
  Configuration: 'Problema de configuração no servidor. Tente novamente mais tarde.',
  AccessDenied: 'Acesso negado. Você cancelou o login ou não tem permissão.',
  Verification: 'O link de verificação expirou ou já foi usado.',
  Default: 'Ocorreu um erro durante o login. Por favor, tente novamente.',
}

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const message = errorMessages[error ?? 'Default'] ?? errorMessages.Default

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4">
      <div className="relative w-full max-w-sm">
        <div className="relative rounded-2xl border border-red-500/20 bg-[#0d0d14] p-8 shadow-2xl">
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <h1 className="text-xl font-bold text-white">Erro de autenticação</h1>
            <p className="text-sm text-white/50">{message}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/auth/login"
              className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Tentar novamente
            </Link>
            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500/10 px-4 py-2.5 text-sm font-medium text-teal-400 transition hover:bg-teal-500/20"
            >
              <BookOpen className="h-4 w-4" />
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
