import Link from 'next/link'
import { Plus, MessageSquare, BookMarked } from 'lucide-react'
import { QuickCreate } from './quick-create'

const ACTIONS = [
  {
    icon: Plus,
    title: 'Criar novo ebook',
    description: 'A Aurora IA escreve, formata e entrega em ~47 minutos',
    href: '/',
    iconBg: 'bg-[#4f7fff20] text-[#4f7fff]',
  },
  {
    icon: MessageSquare,
    title: 'Enviar tema pelo WhatsApp',
    description: 'Fale com a Aurora e comece a criação direto no WhatsApp',
    href: '/',
    iconBg: 'bg-[#00e5c320] text-[#00e5c3]',
  },
  {
    icon: BookMarked,
    title: 'Ver ebooks de exemplo',
    description: 'Explore ebooks criados por outros autores do Clube',
    href: '/',
    iconBg: 'bg-[#a78bfa20] text-[#a78bfa]',
  },
]

export function EmptyState() {
  return (
    <div className="mt-2 space-y-6">
      {/* Quick Create */}
      <QuickCreate />

      {/* Action cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {ACTIONS.map(({ icon: Icon, title, description, href, iconBg }) => (
          <Link
            key={title}
            href={href}
            className="group flex flex-col items-center rounded-2xl border border-[#1c2438] bg-[#0f1523] p-7 text-center transition-all hover:border-[#4f7fff40] hover:shadow-[0_0_32px_rgba(79,127,255,0.07)]"
          >
            <div className={`mb-4 grid h-14 w-14 place-items-center rounded-2xl ${iconBg} transition-transform group-hover:scale-110`}>
              <Icon className="size-6" />
            </div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#6b7a99]">{description}</p>
          </Link>
        ))}
      </div>

      <p className="text-center text-xs text-[#3a4a66]">
        Nenhum ebook ainda. Comece criando o primeiro acima!
      </p>
    </div>
  )
}
