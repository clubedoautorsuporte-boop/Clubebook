import { Star } from 'lucide-react'
import { Eyebrow } from './ui'

const ITEMS = [
  {
    name: 'Carlos Mendes',
    role: 'Empreendedor digital',
    text: 'Nunca escrevi um livro na vida. Em 1h tinha um ebook de 60 páginas pronto para vender na Hotmart. Já fiz R$3.200 no primeiro mês.',
  },
  {
    name: 'Mariana Costa',
    role: 'Coach de carreira',
    text: 'A qualidade superou minhas expectativas. Parece que uma equipe editorial trabalhou no meu material. Recomendo sem hesitar.',
  },
  {
    name: 'Rafael Duarte',
    role: 'Criador de conteúdo',
    text: 'Usei para criar 4 ebooks em uma tarde. Minha autoridade no mercado de finanças disparou. O melhor ROI que já tive.',
  },
  {
    name: 'Patrícia Leal',
    role: 'Mentora de negócios',
    text: 'Pensava que IA não conseguiria capturar minha voz. Errei feio. O resultado ficou melhor do que se eu tivesse escrito.',
  },
]

export function Testimonials() {
  return (
    <section id="depoimentos" className="bg-surface px-5 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <Eyebrow>Autores reais</Eyebrow>
          <h2 className="max-w-2xl font-heading text-balance text-[clamp(26px,3.4vw,34px)] font-extrabold leading-[1.15] tracking-tight text-foreground">
            Quem criou com a Aurora, aprovou
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-dim">
            Mais de 1.200 ebooks entregues. Veja o que nossos autores dizem.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {ITEMS.map(({ name, role, text }) => (
            <div key={name} className="card-soft rounded-2xl p-7">
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-3.5 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="mb-5 text-[15px] italic leading-relaxed text-text">
                {`"${text}"`}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-brand-gradient font-heading text-sm font-extrabold text-white">
                  {name[0]}
                </div>
                <div>
                  <div className="font-heading text-sm font-bold text-foreground">
                    {name}
                  </div>
                  <div className="text-xs text-dim">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
