import Link from 'next/link'
import { Plus, MessageSquare, BookOpen, Sparkles } from 'lucide-react'

const CARDS = [
  {
    icon: Plus,
    gradient: 'from-[#4f7fff] to-[#2554e0]',
    glow: 'rgba(79,127,255,0.15)',
    border: '#4f7fff25',
    title: 'Criar novo ebook',
    description: 'Aurora IA escreve, formata e entrega em ~47 min',
    href: '/dashboard/criar',
    cta: 'Começar agora',
    ctaColor: '#4f7fff',
  },
  {
    icon: MessageSquare,
    gradient: 'from-[#00e5c3] to-[#00b89f]',
    glow: 'rgba(0,229,195,0.12)',
    border: '#00e5c320',
    title: 'Enviar ideia por WhatsApp',
    description: 'Mande seu tema e receba o briefing antes de pagar',
    href: '/dashboard/criar',
    cta: 'Enviar ideia',
    ctaColor: '#00e5c3',
  },
  {
    icon: BookOpen,
    gradient: 'from-[#f97316] to-[#ea580c]',
    glow: 'rgba(249,115,22,0.12)',
    border: '#f9731620',
    title: 'Ver exemplos de ebooks',
    description: 'Explore ebooks criados e inspire-se para o próximo',
    href: '/dashboard/biblioteca',
    cta: 'Ver biblioteca',
    ctaColor: '#f97316',
  },
]

export function EmptyState() {
  return (
    <div className="mt-2">
      {/* Hero vazio */}
      <div className="mb-6 flex flex-col items-center py-8 text-center">
        <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#4f7fff20] to-[#8b5cf620] border border-[#4f7fff20]">
          <Sparkles className="size-6 text-[#4f7fff]" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">Nenhum ebook ainda</h3>
        <p className="text-sm text-[#6b7a99] max-w-xs">Comece agora — a Aurora IA escreve o seu primeiro livro completo em minutos.</p>
      </div>

      {/* Cards de ação */}
      <div className="grid gap-3 sm:grid-cols-3">
        {CARDS.map(({ icon: Icon, gradient, glow, border, title, description, href, cta, ctaColor }) => (
          <Link
            key={title}
            href={href}
            className="group flex flex-col gap-4 rounded-xl border p-5 transition-all hover:-translate-y-0.5"
            style={{ borderColor: border, boxShadow: `0 0 0 0 ${glow}` }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 8px 32px ${glow}`)}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 0 0 ${glow}`)}
          >
            <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${gradient} transition-transform group-hover:scale-105`}>
              <Icon className="size-5 text-white" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-white mb-1">{title}</h4>
              <p className="text-[12px] leading-relaxed text-[#6b7a99]">{description}</p>
            </div>
            <span
              className="mt-auto text-[11px] font-semibold transition group-hover:opacity-100 opacity-70"
              style={{ color: ctaColor }}
            >
              {cta} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
