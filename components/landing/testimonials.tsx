'use client'

import { motion } from 'motion/react'
import { TestimonialsColumn } from '@/components/ui/testimonials-columns'
import { Users } from 'lucide-react'

const TESTIMONIALS = [
  {
    text: 'Nunca escrevi um livro na vida. Em 1h tinha um ebook de 60 páginas pronto para vender na Hotmart. Já fiz R$3.200 no primeiro mês.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'Carlos Mendes',
    role: 'Empreendedor digital',
  },
  {
    text: 'A qualidade superou minhas expectativas. Parece que uma equipe editorial trabalhou no meu material. Recomendo sem hesitar.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    name: 'Mariana Costa',
    role: 'Coach de carreira',
  },
  {
    text: 'Usei para criar 4 ebooks em uma tarde. Minha autoridade no mercado de finanças disparou. O melhor ROI que já tive.',
    image: 'https://randomuser.me/api/portraits/men/55.jpg',
    name: 'Rafael Duarte',
    role: 'Criador de conteúdo',
  },
  {
    text: 'Pensava que IA não conseguiria capturar minha voz. Errei feio. O resultado ficou melhor do que se eu tivesse escrito.',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    name: 'Patrícia Leal',
    role: 'Mentora de negócios',
  },
  {
    text: 'Criei um ebook sobre nutrição funcional em menos de 1 hora. Já vendi mais de 80 cópias na primeira semana. Incrível!',
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    name: 'Fernanda Rocha',
    role: 'Nutricionista',
  },
  {
    text: 'A plataforma é intuitiva e o resultado é profissional. Consegui lançar meu primeiro infoproduto sem contratar redator.',
    image: 'https://randomuser.me/api/portraits/men/18.jpg',
    name: 'Leandro Farias',
    role: 'Designer UX',
  },
  {
    text: 'Testei 3 ferramentas de IA antes desta. Nenhuma chegou perto da qualidade de escrita e formatação entregue em 47 minutos.',
    image: 'https://randomuser.me/api/portraits/men/76.jpg',
    name: 'Thiago Brandão',
    role: 'Especialista em marketing',
  },
  {
    text: 'Professora há 12 anos. Nunca imaginei ter um ebook com minha metodologia tão bem estruturado e tão rápido.',
    image: 'https://randomuser.me/api/portraits/women/29.jpg',
    name: 'Simone Araujo',
    role: 'Educadora',
  },
  {
    text: 'Fiz o ebook sobre vendas consultivas e já uso como material de apoio nos meus cursos. A Aurora entendeu exatamente o que pedi.',
    image: 'https://randomuser.me/api/portraits/men/41.jpg',
    name: 'Bruno Carvalho',
    role: 'Consultor comercial',
  },
]

const col1 = TESTIMONIALS.slice(0, 3)
const col2 = TESTIMONIALS.slice(3, 6)
const col3 = TESTIMONIALS.slice(6, 9)

export function Testimonials() {
  return (
    <section id="depoimentos" className="relative overflow-hidden bg-[#080b14] px-5 py-24 md:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(0,229,195,0.04)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#00e5c330] bg-[#00e5c310] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#00e5c3]">
            <Users className="size-2.5" />
            Autores reais
          </span>
          <h2 className="font-heading text-[clamp(26px,3.4vw,38px)] font-extrabold leading-tight tracking-tight text-white">
            Quem criou com a Aurora, aprovou
          </h2>
          <p className="mt-3 max-w-md text-sm text-[#6b7a99]">
            Mais de 1.200 ebooks entregues. Veja o que nossos autores dizem.
          </p>
        </motion.div>

        {/* Columns */}
        <div className="flex justify-center gap-4 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[640px] overflow-hidden">
          <TestimonialsColumn testimonials={col1} duration={22} />
          <TestimonialsColumn testimonials={col2} duration={28} className="hidden md:block" />
          <TestimonialsColumn testimonials={col3} duration={25} className="hidden lg:block" />
        </div>
      </div>
    </section>
  )
}
