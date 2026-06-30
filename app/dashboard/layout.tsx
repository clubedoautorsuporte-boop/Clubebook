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

  return (
    <div className="flex min-h-screen" style={{ background: '#05070d' }}>
      {/* Sidebar */}
      <div className="hidden md:flex shrink-0 h-screen sticky top-0 z-40">
        <Sidebar
          userName={session.user?.name}
          userImage={session.user?.image}
          userEmail={session.user?.email}
          credits={credits}
          userId={session.user?.id}
          isAdmin={session.user?.email === 'clubedoautor.suporte@gmail.com'}
        />
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-6 py-3"
          style={{
            background: 'rgba(5,7,13,0.82)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div>
            <h1 className="text-[19px] font-bold leading-tight text-white">
              Olá, {firstName}! 👋
            </h1>
            <p className="text-[12px] text-[#5a6a84]">Pronto para criar algo incrível hoje?</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div
              className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-2 w-52 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <Search className="size-3.5 shrink-0 text-[#3a4a66]" />
              <input
                type="text"
                placeholder="Buscar…"
                className="bg-transparent text-[12px] text-white placeholder-[#3a4a66] outline-none w-full"
              />
              <span className="hidden lg:block text-[10px] font-mono text-[#3a4a66] rounded px-1 py-0.5"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                ⌘K
              </span>
            </div>

            {/* Criar Livro */}
            <Link href="/dashboard/criar"
              className="hidden sm:flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12px] font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)', boxShadow: '0 4px 16px rgba(79,127,255,0.28)' }}>
              <Plus className="size-3.5" /> Criar Livro
            </Link>

            {/* Bell */}
            <button
              className="relative grid h-9 w-9 place-items-center rounded-xl transition-colors hover:bg-white/[0.06]"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <Bell className="size-4 text-[#8896b0]" />
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}>
                3
              </span>
            </button>

            {/* Credits */}
            <div className="hidden md:flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px]"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-[#a855f7]">◆</span>
              <span className="font-bold text-white">{credits.toLocaleString('pt-BR')}</span>
              <span className="text-[#5a6a84]">créditos</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
