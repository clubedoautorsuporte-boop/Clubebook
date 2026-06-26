import Link from 'next/link'
import { Plus, Upload, BookMarked } from 'lucide-react'

const ACTIONS = [
  {
    icon: Plus,
    title: 'Criar novo ebook',
    description: 'A Aurora IA escreve, formata e entrega em ~47 minutos',
    href: '/',
    color: 'from-[#4f7fff] to-[#2554e0]',
    iconBg: 'bg-[#4f7fff20] text-[#4f7fff]',
  },
  {
    icon: Upload,
    title: 'Importar briefing',
    description: 'Envie suas ideias, rascunhos ou roteiros para a Aurora transformar',
    href: '/',
    color: 'from-[#00e5c3] to-[#00b89c]',
    iconBg: 'bg-[#00e5c320] text-[#00e5c3]',
  },
  {
    icon: BookMarked,
    title: 'Ver exemplos',
    description: 'Explore ebooks criados por outros autores do clube',
    href: '/',
    color: 'from-[#a78bfa] to-[#7c3aed]',
    iconBg: 'bg-[#a78bfa20] text-[#a78bfa]',
  },
]

export function EmptyState() {
  return (
    <div className="mt-2">
      <div className="grid gap-4 sm:grid-cols-3">
        {ACTIONS.map(({ icon: Icon, title, description, href, iconBg }) => (
          <Link
            key={title}
            href={href}
            className="group flex flex-col items-center rounded-2xl border border-[#1c2438] bg-[#0f1523] p-8 text-center transition-all hover:border-[#4f7fff40] hover:shadow-[0_0_32px_rgba(79,127,255,0.08)]"
          >
            <div className={`mb-4 grid h-14 w-14 place-items-center rounded-2xl ${iconBg} transition-transform group-hover:scale-110`}>
              <Icon className="size-6" />
            </div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#6b7a99]">{description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center justify-center py-10 text-center">
        <p className="text-sm text-[#3a4a66]">Nenhum ebook ainda. Comece criando o primeiro!</p>
      </div>
    </div>
  )
}
