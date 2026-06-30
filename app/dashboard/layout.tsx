import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Sidebar, BottomNav } from '@/components/dashboard/sidebar'
import { Bell, Plus, Search } from 'lucide-react'
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
    <div className="flex min-h-screen bg-[#060912]">
      {/* Sidebar desktop */}
      <div className="hidden md:flex md:flex-col h-screen sticky top-0 shrink-0">
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
        <header className="flex items-center justify-between border-b border-[#ffffff08] bg-[#060912]/95 backdrop-blur-sm px-5 py-3 sticky top-0 z-30 h-[56px]">
          {/* Left: greeting */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Olá, {firstName} 👋</span>
              <span className="hidden text-[#ffffff15] sm:inline">|</span>
              <span className="hidden text-[11px] text-[#3a4a66] sm:block">Bem-vindo à sua área</span>
            </div>
          </div>

          {/* Center: search */}
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-[#ffffff08] bg-[#ffffff04] px-3 py-2 w-64 focus-within:border-[#4f7fff40] transition">
            <Search className="size-3.5 text-[#3a4a66] shrink-0" />
            <input
              type="text"
              placeholder="Buscar no dashboard…"
              className="bg-transparent text-[12px] text-white placeholder-[#3a4a66] outline-none w-full"
            />
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {/* Aurora status */}
            <div className="hidden items-center gap-1.5 rounded-full border border-[#00e5c318] bg-[#00e5c306] px-2.5 py-1 sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00e5c3]" />
              <span className="text-[10px] font-medium text-[#00e5c3]">Aurora online</span>
            </div>

            {/* Notifications */}
            <button className="relative grid h-8 w-8 place-items-center rounded-xl border border-[#ffffff08] bg-[#ffffff04] text-[#6b7a99] transition hover:border-[#ffffff15] hover:text-white">
              <Bell className="size-3.5" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#4f7fff]" />
            </button>

            {/* CTA */}
            <Link
              href="/dashboard/criar"
              className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] px-3.5 py-2 text-[12px] font-semibold text-white shadow-[0_4px_16px_rgba(79,127,255,0.25)] transition hover:shadow-[0_4px_24px_rgba(79,127,255,0.4)] hover:-translate-y-0.5 sm:flex"
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
