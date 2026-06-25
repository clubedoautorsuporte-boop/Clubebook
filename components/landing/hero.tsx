'use client'

import {
  ArrowRight,
  Clock,
  FileText,
  Play,
  Shield,
  Sparkles,
} from 'lucide-react'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { DotPattern } from '@/components/ui/dot-pattern'
import { NumberTicker } from '@/components/ui/number-ticker'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { useCta } from './cta-context'

const STATS = [
  { value: 1200, prefix: '+', suffix: '', label: 'ebooks criados' },
  { value: 47, prefix: '', suffix: 'min', label: 'tempo médio' },
  { value: 100, prefix: '', suffix: '%', label: 'direitos seus' },
]

const MESSAGES = [
  { from: 'aurora', text: 'Olá! Pronto para criar seu ebook? Me conta o tema! 📚' },
  { from: 'user', text: 'Quero um ebook sobre produtividade para freelancers' },
  {
    from: 'aurora',
    text: 'Perfeito! 8 capítulos + revisão completa. Entregando em ~47 minutos ✨',
  },
] as const

const TASKS = ['✅ Índice', '✅ Caps 1-5', '⏳ Caps 6-8', '⌛ Revisão']

function FloatCard({
  icon: Icon,
  text,
  className,
  tone = 'brand',
}: {
  icon: typeof Clock
  text: string
  className?: string
  tone?: 'brand' | 'teal'
}) {
  return (
    <div
      className={`absolute flex items-center gap-2.5 rounded-2xl border border-line bg-surface/95 px-4 py-2.5 shadow-xl shadow-black/40 backdrop-blur-sm ${className}`}
    >
      <span
        className={`flex size-7 items-center justify-center rounded-lg ${
          tone === 'teal'
            ? 'bg-teal/15 text-teal'
            : 'bg-brand/15 text-brand-soft'
        }`}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="text-[13px] font-semibold text-foreground">{text}</span>
    </div>
  )
}

export function Hero() {
  const { openModal } = useCta()

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-hero-gradient px-5 pb-20 pt-32 md:px-8 md:pt-36"
    >
      <DotPattern
        className="opacity-40 [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]"
        id="hero-dots"
      />
      <div className="pointer-events-none absolute -right-24 -top-40 size-[700px] rounded-full bg-[radial-gradient(circle,rgba(79,127,255,0.18)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 size-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,229,195,0.1)_0%,transparent_65%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-2">
        {/* Left */}
        <div>
          <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/[0.07] px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-brand">
            <Sparkles className="size-3" aria-hidden="true" />
            Inteligência Artificial para Criadores
          </span>

          <h1 className="font-heading text-balance text-[clamp(38px,5.2vw,58px)] font-extrabold leading-[1.08] tracking-tight text-foreground">
            Sua ideia vira{' '}
            <AnimatedGradientText>ebook profissional</AnimatedGradientText> em
            menos de 1 hora
          </h1>

          <p className="mb-9 mt-6 max-w-md text-base leading-relaxed text-dim">
            Você escolhe o tema. A Aurora IA escreve, formata e entrega — PDF,
            DOCX e EPUB — com direitos comerciais 100% seus.
          </p>

          <div className="mb-12 flex flex-wrap gap-3.5">
            <ShimmerButton
              onClick={openModal}
              className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-8 py-4 text-base font-bold text-white shadow-[0_0_28px_rgba(79,127,255,0.4)] transition-transform hover:-translate-y-0.5"
            >
              Criar meu ebook agora
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </ShimmerButton>
            <a
              href="#trilhas"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-6 py-4 text-[15px] font-bold text-foreground transition-transform hover:-translate-y-0.5"
            >
              <Play className="size-4" aria-hidden="true" />
              Ver como funciona
            </a>
          </div>

          <div className="flex gap-9">
            {STATS.map(({ value, prefix, suffix, label }) => (
              <div key={label}>
                <div className="font-heading text-[26px] font-extrabold text-foreground">
                  <NumberTicker value={value} prefix={prefix} suffix={suffix} />
                </div>
                <div className="text-[13px] font-medium text-dim">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Aurora chat mockup with floating cards */}
        <div className="relative mx-auto w-full max-w-[420px] lg:mx-0 lg:ml-auto">
          <FloatCard
            icon={FileText}
            text="PDF · DOCX · EPUB"
            tone="brand"
            className="-left-4 top-10 z-20 hidden sm:flex"
          />
          <FloatCard
            icon={Shield}
            text="Direitos 100% seus"
            tone="teal"
            className="-right-4 bottom-24 z-20 hidden sm:flex"
          />

          <div className="card-glow relative rounded-3xl border border-line bg-surface p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-line pb-5">
              <div className="flex size-11 items-center justify-center rounded-full bg-brand-gradient shadow-[0_0_18px_rgba(79,127,255,0.5)]">
                <Sparkles className="size-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <div className="text-[15px] font-bold text-foreground">
                  Aurora IA
                </div>
                <div className="flex items-center gap-1.5 text-xs text-teal">
                  <span className="inline-block size-[7px] rounded-full bg-teal shadow-[0_0_8px_rgba(0,229,195,0.8)]" />
                  Online agora
                </div>
              </div>
              <div className="ml-auto rounded-full border border-teal/40 bg-teal/10 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-teal">
                Em produção
              </div>
            </div>

            {MESSAGES.map((m, i) => (
              <div
                key={i}
                className={`mb-3 flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                    m.from === 'user'
                      ? 'rounded-br-sm bg-brand-gradient text-white'
                      : 'rounded-bl-sm bg-line text-text'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            <div className="mt-5 rounded-xl border border-line bg-ink/60 p-3.5">
              <div className="mb-2 flex justify-between text-xs font-semibold text-dim">
                <span>Gerando conteúdo...</span>
                <span className="text-teal">73%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-line">
                <div className="h-full w-[73%] rounded-full bg-teal-gradient shadow-[0_0_12px_rgba(0,229,195,0.6)]" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {TASKS.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-ink/60 px-2.5 py-1 text-[11px] font-semibold text-dim"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute -right-4 -top-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-xl shadow-black/40">
              <Clock className="size-4 text-brand" aria-hidden="true" />
              <span className="font-heading text-[13px] font-extrabold text-ink">
                47 min
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
