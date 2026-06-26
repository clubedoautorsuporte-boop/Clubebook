'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Settings, HelpCircle, LogOut, Plus, TrendingUp,
  Gift, Copy, Check, Gem, Library, Flame,
  ShoppingCart, Globe2, Calculator, Store, GraduationCap, Trophy,
  CalendarDays,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { CreditsWidget } from './credits-widget'

type SidebarProps = {
  userName?: string | null
  userImage?: string | null
  userEmail?: string | null
  credits?: number
  userId?: string | null
}

const NAV_MAIN = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Meus Ebooks' },
  { href: '/dashboard/vendas', icon: TrendingUp, label: 'Vendas' },
  { href: '/dashboard/creditos', icon: Gem, label: 'Créditos' },
  { href: '/dashboard/biblioteca', icon: Library, label: 'Biblioteca' },
  { href: '/dashboard/indicar', icon: Gift, label: 'Indicar' },
]

const NAV_EXTRA = [
  { href: '/dashboard/nichos', icon: Flame, label: 'Nichos Lucrativos' },
  { href: '/dashboard/tendencias', icon: CalendarDays, label: 'Tendências' },
  { href: '/dashboard/kit-vendas', icon: ShoppingCart, label: 'Kit de Vendas' },
  { href: '/dashboard/plataformas', icon: Globe2, label: 'Plataformas' },
  { href: '/dashboard/calcular', icon: Calculator, label: 'Calculadora' },
  { href: '/dashboard/loja', icon: Store, label: 'Minha Loja' },
  { href: '/dashboard/tutoriais', icon: GraduationCap, label: 'Tutoriais' },
  { href: '/dashboard/conquistas', icon: Trophy, label: 'Conquistas' },
]

function Avatar({ name, image }: { name?: string | null; image?: string | null }) {
  if (image) return <img src={image} alt={name ?? ''} className="h-8 w-8 rounded-full object-cover" />
  const initials = name?.split(' ').slice(0, 2).map(w => w[0]).join('') ?? '?'
  return (
    <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#4f7fff] to-[#00e5c3] text-xs font-bold text-white">
      {initials}
    </div>
  )
}

function ReferralWidget({ userId }: { userId?: string | null }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/?ref=${userId ?? ''}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <div className="mx-3 mb-3 rounded-xl border border-[#00e5c318] bg-[#00e5c306] p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <Gift className="size-3.5 text-[#00e5c3]" />
        <span className="text-xs font-bold text-[#00e5c3]">Indique e ganhe</span>
      </div>
      <p className="text-[10px] leading-relaxed text-[#6b7a99] mb-2">
        Indique um amigo e ganhe 1 ebook grátis quando ele criar o primeiro.
      </p>
      <button
        onClick={copy}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#00e5c330] bg-[#00e5c310] py-1.5 text-[10px] font-semibold text-[#00e5c3] transition hover:bg-[#00e5c320]"
      >
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
        {copied ? 'Copiado!' : 'Copiar link'}
      </button>
    </div>
  )
}

export function Sidebar({ userName, userImage, userEmail, credits = 1000, userId }: SidebarProps) {
  const pathname = usePathname()

  const navItem = (href: string, Icon: React.ElementType, label: string, external = false) => {
    const active = !external && pathname === href
    return (
      <Link
        key={href}
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={cn(
          'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all',
          active
            ? 'bg-[#4f7fff15] font-semibold text-[#4f7fff]'
            : 'text-[#6b7a99] hover:bg-[#0f1523] hover:text-white',
        )}
      >
        <Icon className="size-4 shrink-0" />
        {label}
      </Link>
    )
  }

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-[#1c2438] bg-[#080b14]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4">
        <Image src="/logo.png" alt="Clube do Autor IA" width={30} height={30} className="rounded-lg object-contain" />
        <div>
          <div className="text-sm font-bold text-white">Clube do Autor</div>
          <div className="text-[10px] font-semibold text-[#00e5c3]">IA</div>
        </div>
      </div>

      {/* ECOSSISTEMA label */}
      <div className="mb-2 px-5">
        <p className="text-[9px] font-bold tracking-[0.2em] text-[#2a3553]">ECOSSISTEMA</p>
      </div>

      {/* Credits widget */}
      <CreditsWidget credits={credits} />

      {/* CTA criar */}
      <div className="px-3 mb-2">
        <Link
          href="/dashboard/criar"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] py-2.5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(79,127,255,0.25)] transition hover:shadow-[0_0_24px_rgba(79,127,255,0.4)]"
        >
          <Plus className="size-4" />
          Criar Novo Ebook
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-1">
        {/* Main nav */}
        <div className="flex flex-col gap-0.5">
          {NAV_MAIN.map(({ href, icon: Icon, label }) => navItem(href, Icon, label))}
        </div>

        {/* Divider */}
        <div className="my-3 border-t border-[#1c2438]" />

        {/* Extra nav */}
        <div className="flex flex-col gap-0.5">
          {NAV_EXTRA.map(({ href, icon: Icon, label }) => navItem(href, Icon, label))}
        </div>

        {/* Divider */}
        <div className="my-3 border-t border-[#1c2438]" />

        {/* Conta */}
        <div className="flex flex-col gap-0.5">
          {navItem('/dashboard/configuracoes', Settings, 'Configurações')}
          {navItem('mailto:clubedoautor.suporte@gmail.com', HelpCircle, 'Suporte', true)}
        </div>
      </nav>

      {/* Referral widget */}
      <ReferralWidget userId={userId} />

      {/* User */}
      <div className="border-t border-[#1c2438] px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={userName} image={userImage} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{userName ?? 'Usuário'}</p>
            <p className="text-[10px] text-[#3a4a66]">Autor</p>
          </div>
          <Link href="/dashboard/configuracoes" className="text-[#3a4a66] transition hover:text-white">
            <Settings className="size-3.5" />
          </Link>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="mt-2 flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-xs text-[#3a4a66] transition hover:bg-[#0f1523] hover:text-red-400"
        >
          <LogOut className="size-3.5" />
          Sair da conta
        </button>
      </div>
    </aside>
  )
}

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[#1c2438] bg-[#080b14] md:hidden">
      {[
        { href: '/dashboard', icon: LayoutDashboard, label: 'Ebooks' },
        { href: '/dashboard/criar', icon: Plus, label: 'Criar', highlight: true },
        { href: '/dashboard/nichos', icon: Flame, label: 'Nichos' },
        { href: '/dashboard/conquistas', icon: Trophy, label: 'Troféus' },
      ].map(({ href, icon: Icon, label, highlight }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors',
            highlight
              ? 'text-[#4f7fff]'
              : pathname === href ? 'text-[#4f7fff]' : 'text-[#3a4a66]',
          )}
        >
          <Icon className={cn('size-5', highlight && 'rounded-lg bg-[#4f7fff] p-1 text-white size-7')} />
          {label}
        </Link>
      ))}
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="flex flex-1 flex-col items-center gap-1 py-3 text-[10px] text-[#3a4a66]"
      >
        <LogOut className="size-5" />
        Sair
      </button>
    </nav>
  )
}
