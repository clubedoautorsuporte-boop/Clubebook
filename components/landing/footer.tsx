import { AtSign, Globe, Heart, Mail } from 'lucide-react'
import Image from 'next/image'

const COLUMNS = [
  {
    title: 'Produto',
    links: ['Como funciona', 'Recursos', 'Preço', 'Trilhas'],
  },
  {
    title: 'Para autores',
    links: ['Criar ebook', 'Formatos', 'Direitos comerciais', 'Garantia'],
  },
  {
    title: 'Conteúdo',
    links: ['Blog', 'Guias gratuitos', 'Exemplos', 'Novidades'],
  },
  {
    title: 'Ajuda',
    links: ['Central de ajuda', 'Termos de uso', 'Privacidade', 'Contato'],
  },
]

const SOCIALS = [AtSign, Globe, Mail]

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink px-5 pb-8 pt-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 border-b border-line pb-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="Clube do Autor IA" width={108} height={108} className="object-contain" style={{ width: 108, height: 'auto' }} />
              <span className="font-heading text-base font-extrabold text-foreground">
                Clube do Autor <span className="text-brand">IA</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-dim">
              A plataforma que transforma a sua ideia em um ebook profissional,
              pronto para vender, em menos de 1 hora.
            </p>
            <div className="mt-5 flex gap-2.5">
              {SOCIALS.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex size-9 items-center justify-center rounded-lg border border-line text-dim transition-colors hover:border-brand/40 hover:text-foreground"
                  aria-label="Rede social"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map(({ title, links }) => (
            <div key={title}>
              <div className="mb-4 text-[13px] font-bold uppercase tracking-wider text-foreground">
                {title}
              </div>
              <ul className="flex flex-col gap-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-dim transition-colors hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <p className="text-xs text-dim">
            © 2025 Clube do Autor IA · Todos os direitos reservados
          </p>
          <p className="flex items-center gap-1.5 text-xs text-dim">
            Feito com
            <Heart className="size-3 fill-pink text-pink" aria-hidden="true" />
            por Aurora IA
          </p>
        </div>
      </div>
    </footer>
  )
}
