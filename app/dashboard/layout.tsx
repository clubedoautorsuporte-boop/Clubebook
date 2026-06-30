import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Sidebar, BottomNav } from '@/components/dashboard/sidebar'
import { Bell, Search, Plus } from 'lucide-react'
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
    <div className="flex min-h-screen" style={{ background: '#060a12' }}>
      {/* Sidebar desktop */}
      <div className="hidden md:flex shrink-0 h-screen sticky top-0 z-40">
        <Sidebar
          userName={session.user?.name}
          userImage={session.user?.image}
          userEmail={session.user?.email}
          credits={credits}
          userId={userId}
          isAdmin={isAdmin}
        />
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#1c2438] px-6 py-3" style={{ background: 'rgba(6,10,18,0.85)', backdropFilter: 'blur(12px)' }}>
          <div className="flex flex-col">
            <nav className="flex items-center gap-1 text-[11px] text-[#8896b0]">
              <Link href="/" className="hover:text-[#a0b0c8] transition">Home</Link>
              <span>/</span>
              <span className="text-[#a0b0c8] font-medium">Dashboard</span>
            </nav>
            <p className="text-[15px] font-bold text-white">Olá, {firstName} 👋</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-[#1c2438] bg-[#0b0f1c] px-3 py-2 w-52 focus-within:border-[#4f7fff40] transition">
              <Search className="size-3.5 text-[#8896b0] shrink-0" />
              <input type="text" placeholder="Buscar…"
                className="bg-transparent text-[12px] text-white placeholder-[#8896b0] outline-none w-full" />
            </div>

            <button className="relative grid h-8 w-8 place-items-center rounded-xl border border-[#1c2438] text-[#a0b0c8] transition hover:bg-[#0f1523] hover:text-white">
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#e53935]" />
            </button>

            <Link
              href="/dashboard/criar"
              className="hidden sm:flex items-center gap-1.5 rounded-xl px-4 py-2 text-[12px] font-bold text-white transition hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #4f7fff, #a855f7)', boxShadow: '0 4px 16px rgba(79,127,255,0.35)' }}
            >
              <Plus className="size-3.5" /> Criar Ebook
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24 md:pb-6">
          <div className="mx-auto w-full max-w-6xl">
            {children}
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
