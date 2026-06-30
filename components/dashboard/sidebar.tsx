'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Settings, HelpCircle, LogOut, Plus, TrendingUp,
  Gift, Copy, Check, Gem, Library, Flame, ShoppingCart, Globe2,
  Calculator, Store, GraduationCap, Trophy, CalendarDays, FlaskConical,
  Wrench, ChevronRight, Menu, X,
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
  onCollapse?: (v: boolean) => void
}

const NAV_MAIN = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Meus Ebooks' },
  { href: '/dashboard/vendas', icon: TrendingUp, label: 'Vendas' },
  { href: '/dashboard/creditos', icon: Gem, label: 'Créditos' },
  { href: '/dashboard/biblioteca', icon: Library, label: 'Biblioteca' },
  { href: '/dashboard/indicar', icon: Gift, label: 'Indicar' },
]

const NAV_TOOLS = [
  { href: '/dashboard/kit-ferramentas', icon: Wrench, label: 'Kit Ferramentas' },
  { href: '/dashboard/nichos', icon: Flame, label: 'Nichos Lucrativos' },
  { href: '/dashboard/tendencias', icon: CalendarDays, label: 'Tendências' },
  { href: '/dashboard/kit-vendas', icon: ShoppingCart, label: 'Kit de Vendas' },
  { href: '/dashboard/plataformas', icon: Globe2, label: 'Plataformas' },
  { href: '/dashboard/calcular', icon: Calculator, label: 'Calculadora' },
  { href: '/dashboard/loja', icon: Store, label: 'Minha Loja' },
  { href: '/dashboard/tutoriais', icon: GraduationCap, label: 'Tutoriais' },
  { href: '/dashboard/conquistas', icon: Trophy, label: 'Conquistas' },
]

function Avatar({ name, image, size = 8 }: { name?: string | null; image?: string | null; size?: number }) {
  const cls = `h-${size} w-${size} rounded-full`
  if (image) return <img src={image} alt={name ?? ''} className={cn(cls, 'object-cover ring-2 ring-[#4f7fff30]')} />
  const initials = name?.split(' ').slice(0, 2).map(w => w[0]).join('') ?? '?'
  return (
    <div className={cn(cls, 'grid place-items-center bg-gradient-to-br from-[#4f7fff] to-[#00e5c3] text-xs font-bold text-white ring-2 ring-[#4f7fff30]')}>
      {initials}
    </div>
  )
}

function ReferralWidget({ userId, collapsed }: { userId?: string | null; collapsed: boolean }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/?ref=${userId ?? ''}`
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }
  if (collapsed) return null
  return (
    <div className="mx-3 mb-3 rounded-xl border border-[#00e5c315] bg-[#00e5c305] p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <Gift className="size-3 text-[#00e5c3]" />
        <span className="text-[10px] font-bold text-[#00e5c3]">Indique e ganhe</span>
      </div>
      <p className="text-[10px] leading-relaxed text-[#6b7a99] mb-2">Indique um amigo e ganhe 1 ebook grátis.</p>
      <button onClick={copy} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#00e5c325] bg-[#00e5c30c] py-1.5 text-[10px] font-semibold text-[#00e5c3] transition hover:bg-[#00e5c318]">
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
        {copied ? 'Copiado!' : 'Copiar link'}
      </button>
    </div>
  )
}

function NavItem({ href, icon: Icon, label, collapsed, active, external = false }: {
  href: string; icon: React.ElementType; label: string; collapsed: boolean; active: boolean; external?: boolean
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        'group relative flex items-center gap-3 rounded-xl transition-all duration-150',
        collapsed ? 'justify-center p-2.5' : 'px-3 py-2',
        active
          ? 'bg-gradient-to-r from-[#4f7fff20] to-[#4f7fff05] font-semibold text-[#4f7fff] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:rounded-full before:bg-[#4f7fff]'
          : 'text-[#6b7a99] hover:bg-[#ffffff06] hover:text-[#c4d0e8]',
      )}
    >
      <Icon className={cn('size-4 shrink-0', active ? 'text-[#4f7fff]' : '')} />
      {!collapsed && <span className="truncate text-[13px]">{label}</span>}
      {active && !collapsed && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#4f7fff]" />}
      {collapsed && (
        <div className="pointer-events-none absolute left-full ml-3 z-50 hidden rounded-lg border border-[#1c2438] bg-[#0d1220] px-2.5 py-1.5 text-xs font-medium text-white shadow-xl group-hover:block whitespace-nowrap">
          {label}
        </div>
      )}
    </Link>
  )
}

function SectionLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) return <div className="my-2 mx-auto h-px w-6 bg-[#1c2438]" />
  return <p className="mt-5 mb-2 px-3 text-[9px] font-bold tracking-[0.18em] text-[#2a3553] uppercase">{label}</p>
}

export function Sidebar({ userName, userImage, credits = 1000, userId, isAdmin, onCollapse }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const toggle = () => {
    const next = !collapsed
    setCollapsed(next)
    onCollapse?.(next)
  }

  return (
    <aside className={cn(
      'relative flex h-full flex-col border-r border-[#ffffff08] bg-[#080b14] transition-all duration-300',
      collapsed ? 'w-[68px]' : 'w-[230px]',
    )}>

      {/* Logo + Toggle */}
      <div className={cn('flex items-center border-b border-[#ffffff08] py-4 shrink-0', collapsed ? 'justify-center px-3' : 'justify-between px-4')}>
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Logo" width={28} height={28} className="rounded-lg shrink-0" />
            <div>
              <div className="text-[13px] font-bold text-white leading-tight">Clube do Autor</div>
              <div className="text-[9px] font-bold tracking-widest text-[#00e5c3]">IA PLATFORM</div>
            </div>
          </Link>
        )}
        {collapsed && <Image src="/logo.png" alt="Logo" width={28} height={28} className="rounded-lg" />}
        <button onClick={toggle} className={cn('grid h-7 w-7 place-items-center rounded-lg text-[#6b7a99] transition hover:bg-[#ffffff08] hover:text-white shrink-0', collapsed && 'mt-0')}>
          {collapsed ? <ChevronRight className="size-3.5" /> : <Menu className="size-3.5" />}
        </button>
      </div>

      {/* User card */}
      {!collapsed && (
        <div className="mx-3 mt-4 mb-2 flex items-center gap-3 rounded-xl bg-[#ffffff05] border border-[#ffffff08] px-3 py-2.5">
          <Avatar name={userName} image={userImage} size={8} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-white">{userName ?? 'Usuário'}</p>
            <p className="text-[10px] text-[#3a4a66]">Autor Premium</p>
          </div>
        </div>
      )}
      {collapsed && (
        <div className="flex justify-center mt-3 mb-1">
          <Avatar name={userName} image={userImage} size={8} />
        </div>
      )}

      {/* Credits pill */}
      <div className={cn('mx-3 mb-3 flex items-center gap-2 rounded-xl border border-[#8b5cf620] bg-[#8b5cf608] px-3 py-2', collapsed && 'justify-center px-0 border-transparent bg-transparent')}>
        {collapsed
          ? <Gem className="size-4 text-[#8b5cf6]" title={`${credits.toLocaleString('pt-BR')} créditos`} />
          : <>
              <Gem className="size-3.5 text-[#8b5cf6]" />
              <span className="flex-1 text-[11px] text-[#6b7a99]">Créditos</span>
              <span className="text-sm font-bold text-[#8b5cf6]">{credits.toLocaleString('pt-BR')}</span>
            </>
        }
      </div>

      {/* CTA */}
      <div className={cn('px-3 mb-4', collapsed && 'px-2')}>
        <Link
          href="/dashboard/criar"
          title={collapsed ? 'Criar Novo Ebook' : undefined}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_16px_rgba(79,127,255,0.25)] transition hover:shadow-[0_4px_24px_rgba(79,127,255,0.4)] hover:-translate-y-0.5"
        >
          <Plus className="size-4 shrink-0" />
          {!collapsed && 'Criar Novo Ebook'}
        </Link>
      </div>

      {/* Nav */}
      <nav className={cn('flex flex-1 flex-col overflow-y-auto', collapsed ? 'px-2' : 'px-3')}>
        <SectionLabel label="Navegação" collapsed={collapsed} />
        <div className="flex flex-col gap-0.5">
          {NAV_MAIN.map(({ href, icon, label }) => (
            <NavItem key={href} href={href} icon={icon} label={label} collapsed={collapsed} active={pathname === href} />
          ))}
        </div>

        <SectionLabel label="Ferramentas" collapsed={collapsed} />
        <div className="flex flex-col gap-0.5">
          {NAV_TOOLS.map(({ href, icon, label }) => (
            <NavItem key={href} href={href} icon={icon} label={label} collapsed={collapsed} active={pathname === href} />
          ))}
        </div>

        <SectionLabel label="Conta" collapsed={collapsed} />
        <div className="flex flex-col gap-0.5">
          <NavItem href="/dashboard/configuracoes" icon={Settings} label="Configurações" collapsed={collapsed} active={pathname === '/dashboard/configuracoes'} />
          <NavItem href="mailto:clubedoautor.suporte@gmail.com" icon={HelpCircle} label="Suporte" collapsed={collapsed} active={false} external />
          {isAdmin && (
            <NavItem href="/dashboard/admin" icon={FlaskConical} label="Gerador Teste" collapsed={collapsed} active={pathname === '/dashboard/admin'} />
          )}
        </div>
      </nav>

      <ReferralWidget userId={userId} collapsed={collapsed} />

      {/* Logout */}
      <div className={cn('border-t border-[#ffffff08] p-3', collapsed && 'flex justify-center')}>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          title="Sair"
          className={cn(
            'flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-[#3a4a66] transition hover:bg-[#ff444415] hover:text-red-400 w-full',
            collapsed && 'w-auto justify-center px-2',
          )}
        >
          <LogOut className="size-3.5 shrink-0" />
          {!collapsed && 'Sair da conta'}
        </button>
      </div>
    </aside>
  )
}

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[#ffffff08] bg-[#080b14]/95 backdrop-blur-sm md:hidden">
      {[
        { href: '/dashboard', icon: LayoutDashboard, label: 'Ebooks' },
        { href: '/dashboard/criar', icon: Plus, label: 'Criar', highlight: true },
        { href: '/dashboard/nichos', icon: Flame, label: 'Nichos' },
        { href: '/dashboard/conquistas', icon: Trophy, label: 'Troféus' },
      ].map(({ href, icon: Icon, label, highlight }) => (
        <Link key={href} href={href} className={cn(
          'flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors',
          highlight ? 'text-[#4f7fff]' : pathname === href ? 'text-[#4f7fff]' : 'text-[#3a4a66]',
        )}>
          <Icon className={cn('size-5', highlight && 'rounded-lg bg-[#4f7fff] p-1 text-white size-7')} />
          {label}
        </Link>
      ))}
      <button onClick={() => signOut({ callbackUrl: '/' })} className="flex flex-1 flex-col items-center gap-1 py-3 text-[10px] text-[#3a4a66]">
        <LogOut className="size-5" />
        Sair
      </button>
    </nav>
  )
}
