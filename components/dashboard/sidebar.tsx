'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  FolderOpen, TrendingUp, Gem, Library, Gift,
  Package2, Settings, LogOut, Plus,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type SidebarProps = {
  userName?: string | null
  userImage?: string | null
  userEmail?: string | null
  credits?: number
  userId?: string | null
  isAdmin?: boolean
}

const NAV = [
  { href: '/dashboard',                icon: FolderOpen,  label: 'Projetos'       },
  { href: '/dashboard/vendas',         icon: TrendingUp,  label: 'Receita'        },
  { href: '/dashboard/creditos',       icon: Gem,         label: 'Créditos'       },
  { href: '/dashboard/biblioteca',     icon: Library,     label: 'Biblioteca'     },
  { href: '/dashboard/indicar',        icon: Gift,        label: 'Indique e Ganhe'},
  { href: '/dashboard/kit-ferramentas',icon: Package2,    label: 'Recursos'       },
  { href: '/dashboard/configuracoes',  icon: Settings,    label: 'Configurações'  },
]

function Avatar({ name, image }: { name?: string | null; image?: string | null }) {
  if (image) return <img src={image} alt={name ?? ''} className="h-9 w-9 rounded-full object-cover ring-2 ring-white/10" />
  const initials = name?.split(' ').slice(0, 2).map(w => w[0]).join('') ?? '?'
  return (
    <div
      className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white ring-2 ring-white/10"
      style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}
    >
      {initials}
    </div>
  )
}

function NavItem({ href, icon: Icon, label, active }: {
  href: string; icon: React.ElementType; label: string; active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150',
        active
          ? 'text-white shadow-[0_4px_20px_rgba(79,127,255,0.25)]'
          : 'text-[#6b7a99] hover:bg-white/5 hover:text-white',
      )}
      style={active ? { background: 'linear-gradient(135deg,#4f7fff,#a855f7)' } : {}}
    >
      <Icon className={cn('size-4 shrink-0', active ? 'text-white' : 'text-[#4a5a7a]')} />
      <span>{label}</span>
    </Link>
  )
}

function SidebarInner({ userName, userImage, credits = 0, isAdmin }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-[240px] flex-col border-r border-[#1c2438]" style={{ background: '#07090f' }}>

      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-[#1c2438] px-5 py-5">
        <Image src="/logo.png" alt="Logo" width={34} height={34} className="rounded-xl shrink-0" />
        <div>
          <p className="text-[13px] font-bold leading-tight text-white">Clube do Autor</p>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#3a4a66]">IA Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4 scrollbar-none">
        {NAV.map(({ href, icon, label }) => (
          <NavItem
            key={href}
            href={href}
            icon={icon}
            label={label}
            active={href === '/dashboard' ? pathname === href : pathname.startsWith(href)}
          />
        ))}

        {/* Criar novo — botão de ação rápida */}
        <div className="mt-4 border-t border-[#1c2438] pt-4">
          <Link
            href="/dashboard/criar"
            className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-bold text-white transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)', boxShadow: '0 4px 16px rgba(79,127,255,0.3)' }}
          >
            <Plus className="size-4" />
            Criar Projeto
          </Link>
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-[#1c2438] px-3 py-4">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/5">
          <Avatar name={userName} image={userImage} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-white">{userName ?? 'Usuário'}</p>
            <p className="text-[10px] text-[#3a4a66]">{credits.toLocaleString('pt-BR')} créditos</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            title="Sair"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[#3a4a66] transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>

    </aside>
  )
}

export function Sidebar(props: SidebarProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      {/* Desktop */}
      <div className="hidden h-full md:block">
        <SidebarInner {...props} />
      </div>

      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 grid h-9 w-9 place-items-center rounded-xl border border-[#1c2438] bg-[#07090f] text-[#6b7a99] md:hidden"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <SidebarInner {...props} />
          </div>
        </div>
      )}
    </>
  )
}

export function BottomNav() {
  const pathname = usePathname()
  const items = [
    { href: '/dashboard',          icon: FolderOpen, label: 'Projetos' },
    { href: '/dashboard/criar',    icon: Plus,       label: 'Criar',  highlight: true },
    { href: '/dashboard/creditos', icon: Gem,        label: 'Créditos' },
    { href: '/dashboard/indicar',  icon: Gift,       label: 'Indicar' },
    { href: '/dashboard/configuracoes', icon: Settings, label: 'Config' },
  ]
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[#1c2438] md:hidden" style={{ background: '#07090f' }}>
      {items.map(({ href, icon: Icon, label, highlight }) => (
        <Link key={href} href={href} className={cn(
          'flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors',
          highlight ? 'text-[#4f7fff]' : pathname === href ? 'text-white' : 'text-[#3a4a66]',
        )}>
          <Icon className="size-5" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
