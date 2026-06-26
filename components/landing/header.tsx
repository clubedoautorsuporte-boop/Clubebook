'use client'

import { useEffect, useState } from 'react'
import { Menu, X, LogIn, UserPlus, LayoutDashboard } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useCta } from './cta-context'

const NAV = [
  { label: 'Início', href: '#inicio' },
  { label: 'Trilhas', href: '#trilhas' },
  { label: 'Recursos', href: '#recursos' },
  { label: 'Autores', href: '#depoimentos' },
  { label: 'Preço', href: '#preco' },
  { label: 'FAQ', href: '#faq' },
]

type HeaderProps = {
  isLoggedIn?: boolean
  userName?: string | null
  userImage?: string | null
}

function UserAvatar({ name, image }: { name?: string | null; image?: string | null }) {
  if (image) {
    return (
      <img src={image} alt={name ?? ''} className="h-7 w-7 rounded-full object-cover ring-1 ring-white/20" />
    )
  }
  const initials = name?.split(' ').slice(0, 2).map(w => w[0]).join('') ?? '?'
  return (
    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#4f7fff20] text-xs font-bold text-[#4f7fff]">
      {initials}
    </span>
  )
}

function Logo() {
  return (
    <a href="#inicio" className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="Clube do Autor IA"
        width={36}
        height={36}
        className="shrink-0 object-contain"
        style={{ width: 36, height: 36 }}
      />
      <span className="whitespace-nowrap font-heading text-sm font-extrabold leading-none text-foreground md:text-base">
        Clube do Autor <span className="text-brand">IA</span>
      </span>
    </a>
  )
}

export function Header({ isLoggedIn = false, userName, userImage }: HeaderProps) {
  const { openModal } = useCta()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const AuthButtons = ({ mobile = false }: { mobile?: boolean }) => {
    if (isLoggedIn) {
      return (
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center gap-2 rounded-xl font-semibold transition',
            mobile
              ? 'justify-center border border-[#4f7fff40] bg-[#4f7fff10] py-3 text-sm text-[#4f7fff] hover:bg-[#4f7fff20]'
              : 'border border-[#4f7fff40] bg-[#4f7fff10] px-4 py-2 text-sm text-[#4f7fff] hover:bg-[#4f7fff20]',
          )}
        >
          <UserAvatar name={userName} image={userImage} />
          {mobile ? 'Minha Área' : <span>{userName?.split(' ')[0] ?? 'Minha Área'}</span>}
          <LayoutDashboard className={cn('shrink-0', mobile ? 'size-4' : 'size-3.5')} />
        </Link>
      )
    }
    return (
      <>
        <Link
          href="/auth/login"
          className={cn(
            'flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 font-medium text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white',
            mobile ? 'justify-center py-3 text-sm' : 'px-4 py-2 text-sm',
          )}
        >
          <LogIn className={mobile ? 'size-4' : 'size-4'} />
          Entrar
        </Link>
        <Link
          href="/auth/register"
          className={cn(
            'flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 font-semibold text-black shadow-lg shadow-teal-500/20 transition hover:opacity-90',
            mobile ? 'justify-center py-3 text-sm' : 'px-4 py-2 text-sm',
          )}
        >
          <UserPlus className={mobile ? 'size-4' : 'size-4'} />
          {mobile ? 'Criar conta' : 'Criar conta'}
        </Link>
      </>
    )
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-line bg-ink/90 backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-dim transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden items-center gap-2 lg:flex">
          <AuthButtons />
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1.5 lg:hidden">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-lg border border-[#4f7fff40] bg-[#4f7fff10] px-2.5 py-1.5 text-xs font-semibold text-[#4f7fff]"
            >
              <UserAvatar name={userName} image={userImage} />
              <span className="hidden xs:inline">Área</span>
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white/70">
                <LogIn className="size-3.5" />
                Entrar
              </Link>
              <Link href="/auth/register" className="flex items-center gap-1 rounded-lg bg-teal-500 px-2.5 py-1.5 text-xs font-semibold text-black">
                <UserPlus className="size-3.5" />
                Conta
              </Link>
            </>
          )}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="flex size-8 items-center justify-center rounded-lg border border-line text-foreground"
            aria-label="Abrir menu"
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="border-b border-line bg-ink/95 px-5 py-4 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-dim transition-colors hover:bg-surface hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/5 pt-3">
              <AuthButtons mobile />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
