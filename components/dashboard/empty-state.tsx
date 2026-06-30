'use client'

import Link from 'next/link'
import { Plus, MessageSquare, BookOpen } from 'lucide-react'

const CARDS = [
  {
    icon: Plus,
    gradient: 'linear-gradient(195deg,#49a3f1,#1A73E8)',
    shadow: 'rgba(26,115,232,0.4)',
    title: 'Criar novo ebook',
    description: 'Aurora IA escreve, formata e entrega em ~47 min',
    href: '/dashboard/criar',
    cta: 'Começar agora →',
    ctaColor: '#1A73E8',
  },
  {
    icon: MessageSquare,
    gradient: 'linear-gradient(195deg,#66BB6A,#43A047)',
    shadow: 'rgba(76,175,80,0.4)',
    title: 'Enviar ideia por WhatsApp',
    description: 'Mande seu tema e receba o briefing antes de pagar',
    href: '/dashboard/criar',
    cta: 'Enviar ideia →',
    ctaColor: '#43A047',
  },
  {
    icon: BookOpen,
    gradient: 'linear-gradient(195deg,#FFA726,#FB8C00)',
    shadow: 'rgba(251,140,0,0.4)',
    title: 'Ver exemplos de ebooks',
    description: 'Explore ebooks criados e inspire-se para o próximo',
    href: '/dashboard/biblioteca',
    cta: 'Ver biblioteca →',
    ctaColor: '#FB8C00',
  },
]

export function EmptyState() {
  return (
    <div className="py-6">
      <div className="mb-8 text-center">
        <p className="text-[13px] font-semibold uppercase tracking-widest text-[#7b809a] mb-2">Bem-vindo!</p>
        <h3 className="text-xl font-bold text-[#344767] mb-1">Nenhum ebook ainda</h3>
        <p className="text-sm text-[#7b809a] max-w-sm mx-auto">
          Comece agora — a Aurora IA escreve o seu primeiro livro completo em minutos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {CARDS.map(({ icon: Icon, gradient, shadow, title, description, href, cta, ctaColor }) => (
          <Link
            key={title}
            href={href}
            className="group flex flex-col gap-4 rounded-xl border border-[#e9ecef] p-5 transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
          >
            <div
              className="grid h-12 w-12 place-items-center rounded-xl transition-transform group-hover:scale-105"
              style={{ background: gradient, boxShadow: `0 4px 20px rgba(0,0,0,0.14),0 7px 10px -5px ${shadow}` }}
            >
              <Icon className="size-6 text-white" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#344767] mb-1">{title}</h4>
              <p className="text-[12px] leading-relaxed text-[#7b809a]">{description}</p>
            </div>
            <span className="mt-auto text-[11px] font-semibold" style={{ color: ctaColor }}>{cta}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
