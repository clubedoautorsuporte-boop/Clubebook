'use client'

import { useCta } from './cta-context'
import { ArrowRight, Check } from 'lucide-react'

const INCLUDES = [
  'Título e subtítulo profissional',
  'Sumário com até 10 capítulos',
  'Descrição de cada capítulo',
  'Promessa e proposta de valor',
  'Mensagem de apresentação',
  'Entrega em ~47 min por e-mail',
]

export function LeadMagnet() {
  const { openModal } = useCta()

  return (
    <section className="relative overflow-hidden bg-[#040810] px-5 py-24 md:px-8">
      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(0,229,195,0.07)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#00e5c3]">
              Sem custo
            </p>
            <h2 className="font-heading text-[clamp(28px,3.5vw,46px)] font-extrabold leading-tight tracking-tighter text-white">
              O PLANEJAMENTO{' '}
              <span className="bg-gradient-to-r from-[#00e5c3] to-[#4f7fff] bg-clip-text text-transparent">
                COMPLETO DO SEU EBOOK
              </span>{' '}
              É GRÁTIS
            </h2>
            <p className="mt-4 text-[#6b7a99]">
              Antes de pagar qualquer coisa, receba o planejamento completo do seu ebook — com estrutura, capítulos e promessa — direto no WhatsApp em menos de 5 minutos.
            </p>
            <ul className="mt-6 space-y-2.5">
              {INCLUDES.map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#c8d3eb]">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#00e5c310] ring-1 ring-[#00e5c330]">
                    <Check className="size-3 text-[#00e5c3]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — CTA card */}
          <div className="relative rounded-2xl border border-[#1c2438] bg-[#0a0d18] p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00e5c340] to-transparent" />
            <p className="text-sm font-semibold text-white">Comece agora — é grátis</p>
            <p className="mt-1 text-xs text-[#6b7a99]">Sem cadastro. Sem cartão. Receba no WhatsApp em minutos.</p>

            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-[#1c2438] bg-[#080b14] px-4 py-3 text-sm text-[#3a4a66]">
                Qual é o tema do seu ebook?
              </div>
              <div className="rounded-xl border border-[#1c2438] bg-[#080b14] px-4 py-3 text-sm text-[#3a4a66]">
                Seu nome
              </div>
              <div className="rounded-xl border border-[#1c2438] bg-[#080b14] px-4 py-3 text-sm text-[#3a4a66]">
                WhatsApp com DDD
              </div>
            </div>

            <button
              onClick={openModal}
              className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00e5c3] to-[#00b89c] py-3.5 text-sm font-bold text-[#040810] shadow-[0_0_24px_rgba(0,229,195,0.3)] transition hover:shadow-[0_0_36px_rgba(0,229,195,0.5)]"
            >
              RECEBER MEU PLANEJAMENTO GRÁTIS
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>

            <p className="mt-3 text-center text-[10px] text-[#3a4a66]">
              Entrega em menos de 5 minutos • Sem spam
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
