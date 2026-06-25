'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Menu, X, LogIn, UserPlus } from 'lucide-react'
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

function Logo() {
  return (
    <a href="#inicio" className="flex items-center gap-2.5">
      <div className="flex size-9 items-center justify-center rounded-xl bg-brand-gradient shadow-[0_0_18px_rgba(79,127,255,0.5)]">
        <BookOpen className="size-5 text-white" aria-hidden="true" />
      </div>
      <span className="font-heading text-base font-extrabold leading-none text-foreground">
        Clube do Autor <span className="text-brand">IA</span>
      </span>
    </a>
  )
}

export function Header() {
  const { openModal } = useCta()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/auth/login"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <LogIn className="size-4" />
            Entrar
          </Link>
          <Link
            href="/auth/register"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-teal-500/20 transition hover:opacity-90"
          >
            <UserPlus className="size-4" />
            Criar conta
          </Link>
        </div>

        {/* Mobile: auth buttons + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/auth/login"
            className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogIn className="size-3.5" />
            Entrar
          </Link>
          <Link
            href="/auth/register"
            className="flex items-center gap-1 rounded-lg bg-teal-500 px-3 py-2 text-xs font-semibold text-black transition hover:bg-teal-400"
          >
            <UserPlus className="size-3.5" />
            Conta
          </Link>
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="flex size-9 items-center justify-center rounded-xl border border-line text-foreground"
            aria-label="Abrir menu"
          >
            {menuOpen ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <Menu className="size-4" aria-hidden="true" />
            )}
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

            {/* Auth buttons no drawer mobile */}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/5 pt-3">
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <LogIn className="size-4" />
                Entrar
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 py-3 text-sm font-semibold text-black transition hover:bg-teal-400"
              >
                <UserPlus className="size-4" />
                Criar conta
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
