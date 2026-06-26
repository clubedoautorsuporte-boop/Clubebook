'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { BookOpen, LayoutDashboard, Settings, HelpCircle, LogOut, Plus, TrendingUp } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

type SidebarProps = {
  userName?: string | null
  userImage?: string | null
  userEmail?: string | null
  ebookCount?: number
}

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Meus Ebooks' },
  { href: '/dashboard/stats', icon: TrendingUp, label: 'Estatísticas' },
  { href: '/dashboard/configuracoes', icon: Settings, label: 'Configurações' },
  { href: 'mailto:clubedoautor.suporte@gmail.com', icon: HelpCircle, label: 'Suporte', external: true },
]

function Avatar({ name, image }: { name?: string | null; image?: string | null }) {
  if (image) return <img src={image} alt={name ?? ''} className="h-9 w-9 rounded-full object-cover ring-2 ring-[#1c2438]" />
  const initials = name?.split(' ').slice(0, 2).map(w => w[0]).join('') ?? '?'
  return (
    <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#4f7fff] to-[#00e5c3] text-sm font-bold text-white">
      {initials}
    </div>
  )
}

export function Sidebar({ userName, userImage, userEmail, ebookCount = 0 }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-[#1c2438] bg-[#080b14]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-[#1c2438] px-5 py-5">
        <Image src="/logo.png" alt="Clube do Autor IA" width={32} height={32} className="rounded-lg object-contain" />
        <div>
          <div className="text-sm font-bold text-white">Clube do Autor</div>
          <div className="text-[10px] font-semibold text-[#00e5c3]">IA</div>
        </div>
      </div>

      {/* CTA criar */}
      <div className="px-4 pt-5">
        <Link
          href="/"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(79,127,255,0.3)] transition hover:shadow-[0_0_28px_rgba(79,127,255,0.45)]"
        >
          <Plus className="size-4" />
          Criar Novo Ebook
        </Link>
      </div>

      {/* Nav */}
      <nav className="mt-4 flex flex-1 flex-col gap-0.5 px-3">
        {NAV.map(({ href, icon: Icon, label, external }) => {
          const active = !external && pathname === href
          return (
            <Link
              key={href}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all',
                active
                  ? 'bg-[#4f7fff15] font-semibold text-[#4f7fff]'
                  : 'text-[#6b7a99] hover:bg-[#0f1523] hover:text-white',
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
              {label === 'Meus Ebooks' && ebookCount > 0 && (
                <span className="ml-auto rounded-full bg-[#4f7fff20] px-2 py-0.5 text-[10px] font-bold text-[#4f7fff]">
                  {ebookCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t border-[#1c2438] p-4">
        <div className="flex items-center gap-3 rounded-xl p-2">
          <Avatar name={userName} image={userImage} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{userName ?? 'Usuário'}</p>
            {userEmail && <p className="truncate text-[11px] text-[#3a4a66]">{userEmail}</p>}
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-[#3a4a66] transition hover:bg-[#0f1523] hover:text-red-400"
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
        { href: '/', icon: Plus, label: 'Criar', highlight: true },
        { href: '/dashboard/configuracoes', icon: Settings, label: 'Config.' },
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
