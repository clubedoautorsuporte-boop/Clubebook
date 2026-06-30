import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Sidebar, BottomNav } from '@/components/dashboard/sidebar'
import { Bell, Plus, Sparkles } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Minha Área | Clube do Autor IA',
  robots: 'noindex',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/auth/login')

  const credits = (session.user as { credits?: number })?.credits ?? 1000
  const firstName = session.user?.name?.split(' ')[0] ?? 'Autor'
  const userId = session.user?.id
  const isAdmin = session.user?.email === 'clubedoautor.suporte@gmail.com'

  return (
    <div className="flex min-h-screen bg-[#080b14]">
      {/* Sidebar desktop */}
      <div className="hidden md:flex md:flex-col h-screen sticky top-0">
        <Sidebar
          userName={session.user?.name}
          userImage={session.user?.image}
          userEmail={session.user?.email}
          credits={credits}
          userId={userId}
          isAdmin={isAdmin}
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-[#1c2438] bg-[#080b14]/95 backdrop-blur-sm px-5 py-3 sticky top-0 z-30 h-[52px]">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-white">
              Olá, <span className="text-[#4f7fff]">{firstName}</span> 👋
            </h1>
            <span className="hidden text-[#2a3553] sm:inline">·</span>
            <p className="hidden text-[11px] text-[#3a4a66] sm:block">Bem-vindo à sua área de criação</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Aurora status */}
            <div className="hidden items-center gap-1.5 rounded-full border border-[#00e5c318] bg-[#00e5c306] px-2.5 py-1 sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00e5c3]" />
              <span className="text-[10px] font-medium text-[#00e5c3]">Aurora online</span>
            </div>

            {/* Credits badge */}
            <div className="hidden items-center gap-1 rounded-full border border-[#8b5cf625] bg-[#8b5cf606] px-2.5 py-1 sm:flex">
              <Sparkles className="size-3 text-[#8b5cf6]" />
              <span className="text-[10px] font-semibold text-[#8b5cf6]">{credits.toLocaleString('pt-BR')}</span>
            </div>

            {/* Notifications */}
            <button className="relative grid h-7 w-7 place-items-center rounded-lg border border-[#1c2438] bg-[#0b0f1c] text-[#6b7a99] transition hover:border-[#2a3553] hover:text-white">
              <Bell className="size-3.5" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#4f7fff]" />
            </button>

            {/* CTA */}
            <Link
              href="/dashboard/criar"
              className="hidden items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#4f7fff] to-[#2554e0] px-3 py-1.5 text-[13px] font-semibold text-white shadow-[0_0_16px_rgba(79,127,255,0.2)] transition hover:shadow-[0_0_24px_rgba(79,127,255,0.35)] hover:-translate-y-0.5 sm:flex"
            >
              <Plus className="size-3.5" />
              Criar Ebook
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          <div className="mx-auto w-full max-w-5xl">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom nav mobile */}
      <BottomNav />
    </div>
  )
}
