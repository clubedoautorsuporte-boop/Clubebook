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
      <div className="hidden md:flex md:flex-col">
        <Sidebar
          userName={session.user?.name}
          userImage={session.user?.image}
          userEmail={session.user?.email}
          credits={credits}
          userId={userId}
          isAdmin={isAdmin}
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-[#1c2438] bg-[#080b14]/95 backdrop-blur-sm px-6 py-3.5 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-sm font-bold text-white">Olá, {firstName} 👋</h1>
              <p className="text-[11px] text-[#6b7a99]">Bem-vindo à sua área de criação</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Aurora status */}
            <div className="hidden items-center gap-1.5 rounded-full border border-[#00e5c320] bg-[#00e5c308] px-3 py-1.5 sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00e5c3]" />
              <span className="text-[11px] font-medium text-[#00e5c3]">Aurora online</span>
            </div>

            {/* Credits badge */}
            <div className="hidden items-center gap-1.5 rounded-full border border-[#8b5cf630] bg-[#8b5cf608] px-3 py-1.5 sm:flex">
              <Sparkles className="size-3 text-[#8b5cf6]" />
              <span className="text-[11px] font-semibold text-[#8b5cf6]">{credits.toLocaleString('pt-BR')}</span>
            </div>

            {/* Notifications */}
            <button className="relative grid h-8 w-8 place-items-center rounded-xl border border-[#1c2438] bg-[#0b0f1c] text-[#6b7a99] transition hover:border-[#2a3553] hover:text-white">
              <Bell className="size-3.5" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#4f7fff]" />
            </button>

            {/* CTA */}
            <Link
              href="/dashboard/criar"
              className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(79,127,255,0.25)] transition hover:shadow-[0_0_28px_rgba(79,127,255,0.4)] hover:-translate-y-0.5 sm:flex"
            >
              <Plus className="size-3.5" />
              Criar Ebook
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          {children}
        </main>
      </div>

      {/* Bottom nav mobile */}
      <BottomNav />
    </div>
  )
}
