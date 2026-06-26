'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { BookOpen, Settings, HelpCircle, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

type SidebarProps = {
  userName?: string | null
  userImage?: string | null
  userEmail?: string | null
}

const NAV = [
  { href: '/dashboard', icon: BookOpen, label: 'Meus Ebooks' },
  { href: '/dashboard/configuracoes', icon: Settings, label: 'Configurações' },
  { href: 'mailto:clubedoautor.suporte@gmail.com', icon: HelpCircle, label: 'Suporte', external: true },
]

function Avatar({ name, image }: { name?: string | null; image?: string | null }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name ?? 'Avatar'}
        className="h-8 w-8 rounded-full object-cover ring-1 ring-[#1c2438]"
      />
    )
  }
  const initials = name?.split(' ').slice(0, 2).map(w => w[0]).join('') ?? '?'
  return (
    <div className="grid h-8 w-8 place-items-center rounded-full bg-[#4f7fff20] text-xs font-bold text-[#4f7fff]">
      {initials}
    </div>
  )
}

export function Sidebar({ userName, userImage, userEmail }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-[#1c2438] bg-[#080b14] px-4 py-6">
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center gap-2.5 px-2">
        <Image src="/logo.png" alt="Clube do Autor IA" width={32} height={32} className="rounded-md object-contain" />
        <span className="text-sm font-bold text-white">Clube do Autor IA</span>
      </Link>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(({ href, icon: Icon, label, external }) => {
          const active = !external && pathname === href
          return (
            <Link
              key={href}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-[#4f7fff15] font-semibold text-[#4f7fff]'
                  : 'text-[#6b7a99] hover:bg-[#0f1523] hover:text-white',
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t border-[#1c2438] pt-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <Avatar name={userName} image={userImage} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{userName ?? 'Usuário'}</p>
            {userEmail && (
              <p className="truncate text-xs text-[#3a4a66]">{userEmail}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#6b7a99] transition-colors hover:bg-[#0f1523] hover:text-red-400"
        >
          <LogOut className="size-4 shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  )
}

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[#1c2438] bg-[#080b14] md:hidden">
      {NAV.filter(n => !n.external).map(({ href, icon: Icon, label }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-3 text-[10px] transition-colors',
              active ? 'text-[#4f7fff]' : 'text-[#3a4a66]',
            )}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        )
      })}
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="flex flex-1 flex-col items-center gap-1 py-3 text-[10px] text-[#3a4a66] transition-colors hover:text-red-400"
      >
        <LogOut className="size-5" />
        Sair
      </button>
    </nav>
  )
}
