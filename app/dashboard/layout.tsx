import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Sidebar, BottomNav } from '@/components/dashboard/sidebar'
import { Bell, Plus } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Minha Área | Clube do Autor IA',
  robots: 'noindex',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/auth/login')

  const userId = session.user?.id
  let ebookCount = 0
  let credits = 1000
  if (userId) {
    try {
      // Queries paralelas — não esperam uma pela outra
      const [count, user] = await Promise.all([
        prisma.delivery.count({ where: { userId } }),
        prisma.user.findUnique({ where: { id: userId }, select: { credits: true } }),
      ])
      ebookCount = count
      if (user) credits = user.credits
    } catch {
      // silencioso — mantém valores padrão
    }
  }

  const firstName = session.user?.name?.split(' ')[0] ?? 'Autor'

  return (
    <div className="flex min-h-screen bg-[#080b14]">
      {/* Sidebar desktop */}
      <div className="hidden md:flex md:flex-col">
        <Sidebar
          userName={session.user?.name}
          userImage={session.user?.image}
          userEmail={session.user?.email}
          ebookCount={ebookCount}
          credits={credits}
          userId={userId}
        />
      </div>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-[#1c2438] bg-[#080b14] px-6 py-4">
          <div>
            <h1 className="text-base font-bold text-white">Olá, {firstName} 👋</h1>
            <p className="text-xs text-[#6b7a99]">Bem-vindo à sua área de criação</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 rounded-full border border-[#00e5c318] bg-[#00e5c308] px-3 py-1.5 sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00e5c3]" />
              <span className="text-[11px] font-medium text-[#00e5c3]">Aurora online · ~47min</span>
            </div>
            <button className="relative grid h-9 w-9 place-items-center rounded-xl border border-[#1c2438] text-[#6b7a99] transition hover:text-white">
              <Bell className="size-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#4f7fff]" />
            </button>
            <Link
              href="/dashboard/criar"
              className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_16px_rgba(79,127,255,0.3)] transition hover:-translate-y-0.5 sm:flex"
            >
              <Plus className="size-4" />
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
