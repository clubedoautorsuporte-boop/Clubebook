import { signIn } from '@/auth'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Criar conta | Clube do Autor IA',
  robots: 'noindex',
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4">
      <div className="relative w-full max-w-sm">
        {/* Glow */}
        <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-teal-500/20 via-transparent to-transparent" />

        <div className="relative rounded-2xl border border-white/10 bg-[#0d0d14] p-8 shadow-2xl">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <Image src="/logo.png" alt="Clube do Autor IA" width={168} height={168} className="object-contain" style={{ width: 168, height: 'auto' }} />
            <div className="text-center">
              <div className="mb-1 inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-0.5 text-xs font-medium text-teal-400">
                <Sparkles className="h-3 w-3" />
                Grátis para começar
              </div>
              <h1 className="mt-2 text-xl font-bold text-white">Crie sua conta</h1>
              <p className="mt-1 text-sm text-white/40">Comece a criar seus ebooks hoje</p>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="flex flex-col gap-3">
            <form
              action={async () => {
                'use server'
                await signIn('google', { redirectTo: '/dashboard' })
              }}
            >
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow transition hover:bg-gray-100"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continuar com Google
              </button>
            </form>

          </div>

          <p className="mt-6 text-center text-xs text-white/30">
            Ao continuar, você aceita nossos termos de uso.
          </p>

          <p className="mt-4 text-center text-xs text-white/30">
            Já tem conta?{' '}
            <Link href="/auth/login" className="text-teal-400 hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
