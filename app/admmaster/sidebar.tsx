'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, BookOpen, FlaskConical,
  Shield, Settings, LogOut, ChevronRight,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const NAV = [
  { href: '/admmaster',       icon: LayoutDashboard, label: 'Visão Geral' },
  { href: '/admmaster/users', icon: Users,            label: 'Usuários' },
  { href: '/admmaster/ebooks',icon: BookOpen,         label: 'Ebooks Gerados' },
  { href: '/dashboard/admin', icon: FlaskConical,     label: 'Gerador Teste' },
]

export default function AdminSidebar() {
  const path = usePathname()

  function active(href: string) {
    if (href === '/admmaster') return path === '/admmaster'
    return path.startsWith(href)
  }

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-[#1a2035] bg-[#080c1a] sticky top-0 shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1a2035]">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-purple-600/20">
            <Shield className="size-4 text-purple-400" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-white leading-none">ADM MASTER</p>
            <p className="text-[9px] text-[#4a5578] mt-0.5">Clube do Autor IA</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-2 pb-2 text-[9px] font-bold text-[#2e3a55] tracking-widest">NAVEGAÇÃO</p>
        {NAV.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-all ${
              active(href)
                ? 'bg-purple-600/15 text-purple-300 font-semibold'
                : 'text-[#4a5578] hover:text-white hover:bg-[#0f1525]'
            }`}
          >
            <Icon className="size-3.5 shrink-0" />
            {label}
            {active(href) && <ChevronRight className="size-3 ml-auto text-purple-400" />}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-[#1a2035] pt-3 space-y-1">
        <Link href="/dashboard/configuracoes"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] text-[#4a5578] hover:text-white hover:bg-[#0f1525] transition-all">
          <Settings className="size-3.5" /> Configurações
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] text-[#4a5578] hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="size-3.5" /> Sair
        </button>
      </div>
    </aside>
  )
}
