'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  FolderOpen, TrendingUp, Gem, Library, Gift,
  Package2, Settings, LogOut, Plus, Coins,
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
  { href: '/dashboard',                 icon: FolderOpen, label: 'Projetos'        },
  { href: '/dashboard/vendas',          icon: TrendingUp, label: 'Receita'         },
  { href: '/dashboard/creditos',        icon: Gem,        label: 'Créditos'        },
  { href: '/dashboard/biblioteca',      icon: Library,    label: 'Biblioteca'      },
  { href: '/dashboard/indicar',         icon: Gift,       label: 'Indique e Ganhe' },
  { href: '/dashboard/kit-ferramentas', icon: Package2,   label: 'Recursos'        },
  { href: '/dashboard/configuracoes',   icon: Settings,   label: 'Configurações'   },
]

function Avatar({ name, image }: { name?: string | null; image?: string | null }) {
  if (image) return <img src={image} alt={name ?? ''} className="h-8 w-8 rounded-full object-cover" />
  const initials = name?.split(' ').slice(0, 2).map(w => w[0]).join('') ?? '?'
  return (
    <div className="grid h-8 w-8 place-items-center rounded-full text-xs font-bold text-white"
      style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
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
          ? 'bg-[#111827] text-white'
          : 'text-[#9aa5bc] hover:bg-[#0d1117] hover:text-[#8896b0]',
      )}
    >
      <Icon className={cn('size-4 shrink-0', active ? 'text-[#f97316]' : 'text-[#7080a0]')} />
      <span>{label}</span>
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#f97316]" />}
    </Link>
  )
}

function SidebarInner({ userName, userImage, credits = 0, isAdmin }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className="flex h-full w-[240px] flex-col"
      style={{ background: '#080c14', borderRight: '1px solid #0f1828' }}
    >
      {/* ── Brand ── */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid #0f1828' }}>
        <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-lg shrink-0" />
        <div>
          <p className="text-[13px] font-bold leading-tight text-white">Clube do Autor</p>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#7080a0]">IA Platform</p>
        </div>
      </div>

      {/* ── Widgets acima das categorias ── */}
      <div className="px-3 pt-4 pb-3 flex flex-col gap-2">

        {/* Créditos */}
        <div
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5"
          style={{ background: '#0d1220', border: '1px solid #131e30' }}
        >
          {/* Badge laranja com ícone */}
          <div
            className="grid h-8 w-8 shrink-0 place-items-center rounded-xl"
            style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 12px rgba(249,115,22,0.4)' }}
          >
            <Coins className="size-4 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-black leading-none text-white tabular-nums">
              {credits.toLocaleString('pt-BR')}
            </p>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#7080a0] mt-0.5">Créditos</p>
          </div>

          {/* Botão "+" laranja */}
          <Link
            href="/dashboard/creditos"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}
            title="Comprar créditos"
          >
            <Plus className="size-3.5 text-white" />
          </Link>
        </div>

        {/* Novo Livro */}
        <Link
          href="/dashboard/criar"
          className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-[13px] font-semibold text-[#a0b0c8] transition hover:text-white"
          style={{ background: '#0d1220', border: '1px solid #131e30' }}
        >
          <span
            className="grid h-5 w-5 place-items-center rounded-md"
            style={{ background: 'rgba(0,229,195,0.15)' }}
          >
            <Plus className="size-3 text-[#00e5c3]" />
          </span>
          Novo Livro
        </Link>
      </div>

      {/* ── Divisor ── */}
      <div className="mx-4 mb-2" style={{ height: 1, background: '#0f1828' }} />

      {/* ── Categorias ── */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 pb-4 scrollbar-none">
        {NAV.map(({ href, icon, label }) => (
          <NavItem
            key={href}
            href={href}
            icon={icon}
            label={label}
            active={href === '/dashboard' ? pathname === href : pathname.startsWith(href)}
          />
        ))}
      </nav>

      {/* ── Usuário ── */}
      <div className="px-3 pb-4" style={{ borderTop: '1px solid #0f1828', paddingTop: '1rem' }}>
        <div className="flex items-center gap-2.5 rounded-xl px-2 py-2 transition hover:bg-[#0d1220]">
          <Avatar name={userName} image={userImage} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-[#8896b0]">{userName ?? 'Usuário'}</p>
            <p className="text-[10px] text-[#7080a0]">Membro ativo</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            title="Sair"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[#7080a0] transition hover:bg-white/10 hover:text-white"
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

      {/* Botão hamburger mobile */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 grid h-9 w-9 place-items-center rounded-xl md:hidden"
        style={{ background: '#0d1220', border: '1px solid #131e30' }}
      >
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#6b7a99" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Drawer mobile */}
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
    { href: '/dashboard',               icon: FolderOpen, label: 'Projetos'  },
    { href: '/dashboard/criar',         icon: Plus,       label: 'Criar',    highlight: true },
    { href: '/dashboard/creditos',      icon: Gem,        label: 'Créditos'  },
    { href: '/dashboard/indicar',       icon: Gift,       label: 'Indicar'   },
    { href: '/dashboard/configuracoes', icon: Settings,   label: 'Config'    },
  ]
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex md:hidden"
      style={{ background: '#080c14', borderTop: '1px solid #0f1828' }}
    >
      {items.map(({ href, icon: Icon, label, highlight }) => (
        <Link key={href} href={href} className={cn(
          'flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors',
          highlight ? 'text-[#00e5c3]' : pathname === href ? 'text-white' : 'text-[#7080a0]',
        )}>
          <Icon className="size-5" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
