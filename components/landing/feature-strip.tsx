import { Gauge, Sparkles, Zap } from 'lucide-react'

const ITEMS = [
  {
    icon: Zap,
    title: 'Entrega em ~47 minutos',
    desc: 'Da ideia ao arquivo pronto',
  },
  {
    icon: Sparkles,
    title: 'A IA que mais converte',
    desc: 'Qualidade editorial real',
  },
  {
    icon: Gauge,
    title: 'Pronto para vender 24h',
    desc: 'Publique em qualquer plataforma',
  },
]

export function FeatureStrip() {
  return (
    <section className="border-y border-line bg-surface px-5 py-8 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
        {ITEMS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand-soft">
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-[15px] font-bold text-foreground">
                {title}
              </div>
              <div className="text-[13px] text-dim">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
