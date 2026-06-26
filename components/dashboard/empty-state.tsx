import Link from 'next/link'
import { Plus, MessageSquare, BookOpen } from 'lucide-react'

const CARDS = [
  {
    icon: Plus,
    iconBg: 'bg-gradient-to-br from-[#4f7fff] to-[#2554e0]',
    iconColor: 'text-white',
    title: 'Criar novo ebook',
    description: 'A Aurora IA escreve, formata e entrega o ebook completo em ~47 minutos',
    href: '/dashboard/criar',
  },
  {
    icon: MessageSquare,
    iconBg: 'bg-[#0f1a2e]',
    iconColor: 'text-[#00e5c3]',
    title: 'Enviar ideia por WhatsApp',
    description: 'Mande seu tema pelo WhatsApp e receba o briefing completo antes de pagar',
    href: '/dashboard/criar',
  },
  {
    icon: BookOpen,
    iconBg: 'bg-[#0a1f18]',
    iconColor: 'text-[#00e5c3]',
    title: 'Ver exemplos de ebooks',
    description: 'Explore ebooks criados por nossos autores e inspire seu próximo lançamento',
    href: '/dashboard/biblioteca',
  },
]

export function EmptyState() {
  return (
    <div className="mt-4 flex flex-col items-center">
      {/* 3 Cards grandes — estilo Sábhia */}
      <div className="grid w-full gap-4 sm:grid-cols-3">
        {CARDS.map(({ icon: Icon, iconBg, iconColor, title, description, href }) => (
          <Link
            key={title}
            href={href}
            className="group flex flex-col items-center rounded-2xl border border-[#1c2438] bg-[#0b0f1c] px-6 pb-8 pt-10 text-center transition-all hover:border-[#4f7fff40] hover:bg-[#0d1220] hover:shadow-[0_0_40px_rgba(79,127,255,0.06)]"
          >
            <div className={`mb-5 grid h-16 w-16 place-items-center rounded-2xl ${iconBg} ${iconColor} transition-transform group-hover:scale-110`}>
              <Icon className="size-7" />
            </div>
            <h3 className="mb-2 font-semibold text-white">{title}</h3>
            <p className="text-sm leading-relaxed text-[#6b7a99]">{description}</p>
          </Link>
        ))}
      </div>

      {/* Empty state message */}
      <div className="mt-12 flex flex-col items-center gap-2 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0f1523]">
          <span className="text-2xl">✨</span>
        </div>
        <p className="text-sm text-[#6b7a99]">Nenhum ebook ainda. Comece seu primeiro!</p>
      </div>
    </div>
  )
}
