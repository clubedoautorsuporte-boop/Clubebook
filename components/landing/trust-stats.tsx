'use client'

import { motion } from 'motion/react'

const STATS = [
  { value: '+1.200', label: 'ebooks entregues', sub: 'em mais de 40 nichos diferentes' },
  { value: '47min', label: 'tempo médio de entrega', sub: 'do pagamento ao PDF no e-mail' },
  { value: '98%', label: 'de aprovação', sub: 'dos autores recomendam para amigos' },
  { value: 'R$67', label: 'preço único', sub: 'sem assinatura, sem surpresas' },
]

export function TrustStats() {
  return (
    <section className="bg-[#080b14] px-5 py-24 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#3a4a66]">Resultados reais</p>
          <h2 className="font-heading text-[clamp(28px,4vw,52px)] font-extrabold leading-tight tracking-tighter text-white">
            NÃO SOMOS UMA PROMESSA,{' '}
            <span className="bg-gradient-to-r from-[#4f7fff] to-[#00e5c3] bg-clip-text text-transparent">
              SOMOS UM PRODUTO
            </span>
          </h2>
          <p className="mt-4 text-[#6b7a99]">Números que comprovam o que a Aurora IA entrega todo dia.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map(({ value, label, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="flex flex-col items-center rounded-2xl border border-[#1c2438] bg-[#0a0d18] p-6 text-center"
            >
              <div className="font-heading text-[clamp(32px,4vw,52px)] font-extrabold leading-none text-white">
                <span className="bg-gradient-to-r from-[#4f7fff] to-[#00e5c3] bg-clip-text text-transparent">
                  {value}
                </span>
              </div>
              <div className="mt-2 text-sm font-semibold text-white">{label}</div>
              <div className="mt-1 text-xs text-[#6b7a99]">{sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
