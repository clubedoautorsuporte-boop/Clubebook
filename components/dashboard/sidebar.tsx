'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  BookOpen, TrendingUp, Gem, Library,
  Gift, Wrench, Settings, LogOut, ChevronRight, Crown, Rocket,
  FolderOpen,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type SidebarProps = {
  userName?: string | null
  userImage?: string | null
  userEmail?: string | null
  credits?: number
  userId?: string | null
  isAdmin?: boolean
}

const NAV = [
  { href: '/dashboard/projetos',        icon: FolderOpen,      label: 'Projetos'        },
  { href: '/dashboard/biblioteca',      icon: BookOpen,        label: 'Livros'          },
  { href: '/dashboard/vendas',          icon: TrendingUp,      label: 'Receitas'        },
  { href: '/dashboard/creditos',        icon: Gem,             label: 'Créditos'        },
  { href: '/dashboard/kit-ferramentas', icon: Library,         label: 'Biblioteca'      },
  { href: '/dashboard/nichos',          icon: Wrench,          label: 'Ferramentas'     },
  { href: '/dashboard/indicar',         icon: Gift,            label: 'Indique e Ganhe' },
  { href: '/dashboard/configuracoes',   icon: Settings,        label: 'Configurações'   },
]

function Avatar({ name }: { name?: string | null; image?: string | null }) {
  const initial = name?.trim()[0]?.toUpperCase() ?? '?'
  return (
    <div className="relative">
      <div className="grid h-9 w-9 place-items-center rounded-full text-sm font-black text-white ring-2 ring-[#4f7fff40]"
        style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}>
        {initial}
      </div>
      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#08090f]" />
    </div>
  )
}

function NavItem({ href, icon: Icon, label, active }: {
  href: string; icon: React.ElementType; label: string; active: boolean
}) {
  return (
    <Link href={href} className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200">
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(79,127,255,0.22), rgba(168,85,247,0.22))',
            border: '1px solid rgba(79,127,255,0.35)',
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      {!active && (
        <div className="absolute inset-0 rounded-xl bg-transparent transition-colors duration-200 group-hover:bg-white/[0.04]" />
      )}
      <div
        className={cn(
          'relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-all duration-200',
          !active && 'bg-white/5 group-hover:bg-white/10',
        )}
        style={active ? {
          background: 'linear-gradient(135deg,#4f7fff,#a855f7)',
          boxShadow: '0 0 14px rgba(79,127,255,0.55)',
        } : {}}
      >
        <Icon className={cn('size-3.5', active ? 'text-white' : 'text-[#6b7a99] group-hover:text-[#a0b0c8]')} />
      </div>
      <span className={cn('relative z-10 transition-colors', active ? 'text-white font-semibold' : 'text-[#8896b0] group-hover:text-[#c4d0e8]')}>
        {label}
      </span>
      {active && <ChevronRight className="relative z-10 ml-auto size-3.5 text-[#4f7fff]" />}
    </Link>
  )
}

function SidebarInner({ userName, userImage, userEmail, credits = 0, isAdmin }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className="flex h-full w-[220px] flex-col"
      style={{
        background: 'linear-gradient(180deg,#07090f 0%,#050810 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Brand */}
      <div className="flex flex-col items-center px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', gap: '4px' }}>
        <div className="relative w-[78px] h-[78px]" style={{ filter: 'drop-shadow(0 0 18px rgba(79,127,255,0.5))' }}>
          <Image src="/logo2.png" alt="Logo" fill className="object-contain"
            style={{ mixBlendMode: 'screen' }} />
        </div>
        <div className="text-center" style={{ marginTop: '-2px' }}>
          <p className="text-[14px] font-bold leading-tight text-white tracking-tight">Clube do Autor</p>
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] mt-0.5"
            style={{ background: 'linear-gradient(90deg,#4f7fff,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            IA Platform
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4 scrollbar-none">
        <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.15em] text-[#2a3a56]">Menu</p>
        {NAV.map(({ href, icon, label }) => {
          const active = pathname.startsWith(href)
          return <NavItem key={href} href={href} icon={icon} label={label} active={active} />
        })}
        {isAdmin && (
          <>
            <p className="mt-4 mb-1 px-3 text-[9px] font-bold uppercase tracking-[0.15em] text-[#2a3a56]">Admin</p>
            <NavItem href="/dashboard/admin" icon={Settings} label="Admin" active={pathname.startsWith('/dashboard/admin')} />
          </>
        )}
      </nav>

      {/* Upgrade card */}
      <div className="relative mx-3 mb-3 overflow-hidden rounded-2xl p-4"
        style={{ background: 'linear-gradient(135deg,#0d1a3a,#1a0d40)', border: '1px solid rgba(168,85,247,0.25)' }}>
        <div className="pointer-events-none absolute inset-0 opacity-25"
          style={{ background: 'radial-gradient(circle at 80% 10%,#a855f7,transparent 60%)' }} />
        <div className="relative z-10">
          <div className="mb-2 flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded-lg"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
              <Crown className="size-3.5 text-white" />
            </div>
            <p className="text-[13px] font-bold text-white">Plano Pro</p>
          </div>
          <p className="mb-3 text-[11px] leading-relaxed text-[#8896b0]">
            Desbloqueie todos os recursos e aumente seus resultados.
          </p>
          <Link href="/dashboard/creditos"
            className="flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)', boxShadow: '0 4px 16px rgba(79,127,255,0.35)' }}>
            <Rocket className="size-3.5" /> Upgrade agora
          </Link>
        </div>
      </div>

      {/* User */}
      <div className="px-3 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
        <div className="flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-white/[0.04]">
          <Avatar name={userName} image={userImage} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-white">{userName ?? 'Usuário'}</p>
            <p className="text-[10px] font-medium text-[#f59e0b]">✦ Autor Premium</p>
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
      <div className="hidden h-full md:block">
        <SidebarInner {...props} />
      </div>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 grid h-9 w-9 place-items-center rounded-xl md:hidden"
        style={{ background: 'rgba(7,9,15,0.9)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
      >
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#8896b0" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: -220 }} animate={{ x: 0 }} exit={{ x: -220 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-y-0 left-0"
            >
              <SidebarInner {...props} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export function BottomNav() {
  const pathname = usePathname()
  const items = [
    { href: '/dashboard/projetos',      icon: FolderOpen,      label: 'Projetos', highlight: true },
    { href: '/dashboard/creditos',      icon: Gem,             label: 'Créditos' },
    { href: '/dashboard/indicar',       icon: Gift,            label: 'Indicar'  },
    { href: '/dashboard/configuracoes', icon: Settings,        label: 'Config'   },
  ]
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex md:hidden"
      style={{ background: 'rgba(5,7,13,0.96)', borderTop: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
      {items.map(({ href, icon: Icon, label, highlight }) => (
        <Link key={href} href={href} className={cn(
          'flex flex-1 flex-col items-center gap-1 py-3 text-[9px] font-bold uppercase tracking-wider transition-colors',
          highlight ? 'text-[#00e5c3]' : pathname === href ? 'text-white' : 'text-[#4a5a7a]',
        )}>
          <Icon className="size-5" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
