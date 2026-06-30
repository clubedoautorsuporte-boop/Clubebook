import Link from 'next/link'
import { Flame, ArrowRight, TrendingUp, Target, DollarSign, BarChart3 } from 'lucide-react'

const NICHOS = [
  { nome: 'Finanças Pessoais', concorrencia: 'Média', preco: 'R$27–97', demanda: 90, categoria: 'Dinheiro' },
  { nome: 'Emagrecimento', concorrencia: 'Alta', preco: 'R$29–79', demanda: 95, categoria: 'Saúde' },
  { nome: 'Marketing Digital', concorrencia: 'Alta', preco: 'R$37–147', demanda: 88, categoria: 'Negócios' },
  { nome: 'IA e Tecnologia', concorrencia: 'Baixa', preco: 'R$47–197', demanda: 92, categoria: 'Tecnologia' },
  { nome: 'Autoajuda', concorrencia: 'Alta', preco: 'R$19–59', demanda: 85, categoria: 'Desenvolvimento' },
  { nome: 'Culinária Saudável', concorrencia: 'Média', preco: 'R$19–47', demanda: 78, categoria: 'Saúde' },
  { nome: 'Produtividade', concorrencia: 'Média', preco: 'R$27–67', demanda: 82, categoria: 'Desenvolvimento' },
  { nome: 'Vendas Online', concorrencia: 'Média', preco: 'R$37–97', demanda: 86, categoria: 'Negócios' },
  { nome: 'Investimentos', concorrencia: 'Alta', preco: 'R$47–197', demanda: 93, categoria: 'Dinheiro' },
  { nome: 'Mindfulness', concorrencia: 'Baixa', preco: 'R$19–49', demanda: 74, categoria: 'Saúde Mental' },
  { nome: 'Criação de Conteúdo', concorrencia: 'Média', preco: 'R$27–97', demanda: 84, categoria: 'Digital' },
  { nome: 'E-commerce', concorrencia: 'Média', preco: 'R$37–127', demanda: 80, categoria: 'Negócios' },
  { nome: 'Fitness', concorrencia: 'Alta', preco: 'R$27–67', demanda: 89, categoria: 'Saúde' },
  { nome: 'Maternidade', concorrencia: 'Baixa', preco: 'R$19–47', demanda: 76, categoria: 'Família' },
  { nome: 'Desenvolvimento Pessoal', concorrencia: 'Alta', preco: 'R$19–67', demanda: 87, categoria: 'Desenvolvimento' },
  { nome: 'Freelancer', concorrencia: 'Baixa', preco: 'R$29–77', demanda: 72, categoria: 'Carreira' },
  { nome: 'Empreendedorismo', concorrencia: 'Alta', preco: 'R$37–147', demanda: 88, categoria: 'Negócios' },
  { nome: 'Nutrição', concorrencia: 'Média', preco: 'R$27–67', demanda: 81, categoria: 'Saúde' },
  { nome: 'Criptomoedas', concorrencia: 'Alta', preco: 'R$47–167', demanda: 79, categoria: 'Dinheiro' },
  { nome: 'Design Gráfico', concorrencia: 'Baixa', preco: 'R$27–87', demanda: 70, categoria: 'Digital' },
  { nome: 'Saúde Mental', concorrencia: 'Baixa', preco: 'R$19–57', demanda: 83, categoria: 'Saúde Mental' },
  { nome: 'Drop Shipping', concorrencia: 'Média', preco: 'R$37–97', demanda: 76, categoria: 'Negócios' },
  { nome: 'Línguas Estrangeiras', concorrencia: 'Média', preco: 'R$27–77', demanda: 73, categoria: 'Educação' },
  { nome: 'Coaching', concorrencia: 'Média', preco: 'R$29–97', demanda: 77, categoria: 'Desenvolvimento' },
  { nome: 'Pet Care', concorrencia: 'Baixa', preco: 'R$19–47', demanda: 68, categoria: 'Pets' },
  { nome: 'Fotografia', concorrencia: 'Baixa', preco: 'R$27–77', demanda: 67, categoria: 'Arte' },
  { nome: 'Negócios Digitais', concorrencia: 'Alta', preco: 'R$47–197', demanda: 91, categoria: 'Negócios' },
  { nome: 'Educação Financeira', concorrencia: 'Média', preco: 'R$27–97', demanda: 88, categoria: 'Dinheiro' },
  { nome: 'Relacionamentos', concorrencia: 'Baixa', preco: 'R$19–57', demanda: 80, categoria: 'Pessoas' },
  { nome: 'Moda Sustentável', concorrencia: 'Baixa', preco: 'R$19–47', demanda: 65, categoria: 'Estilo' },
]

const COR: Record<string, { bar: string; color: string }> = {
  Baixa: { bar: '#00e5c3', color: '#00e5c3' },
  Média: { bar: '#f97316', color: '#f97316' },
  Alta:  { bar: '#e53935', color: '#e53935' },
}

const topNichos = [...NICHOS].sort((a, b) => b.demanda - a.demanda).slice(0, 5)
const baixaConcorrencia = NICHOS.filter(n => n.concorrencia === 'Baixa').length
const avgDemanda = Math.round(NICHOS.reduce((acc, n) => acc + n.demanda, 0) / NICHOS.length)

export default function NichosPage() {
  return (
    <div className="px-5 py-6 pb-16 md:px-8">

      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 4px 20px rgba(249,115,22,0.4)' }}>
          <Flame className="size-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Nichos Lucrativos</h1>
          <p className="text-sm text-[#a0b0c8]">{NICHOS.length} temas com alto potencial de revenda</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Nichos mapeados',   value: NICHOS.length,       icon: Target,    g: 'linear-gradient(135deg,#4f7fff,#2554e0)', s: 'rgba(79,127,255,0.4)' },
          { label: 'Baixa concorrência',value: baixaConcorrencia,   icon: TrendingUp, g: 'linear-gradient(135deg,#00e5c3,#00b09b)', s: 'rgba(0,229,195,0.4)' },
          { label: 'Demanda média',     value: `${avgDemanda}%`,    icon: BarChart3,  g: 'linear-gradient(135deg,#6366f1,#4338ca)', s: 'rgba(99,102,241,0.4)' },
          { label: 'Preço máximo',      value: 'R$197',             icon: DollarSign, g: 'linear-gradient(135deg,#ec4899,#be185d)', s: 'rgba(236,72,153,0.4)' },
        ].map(({ label, value, icon: Icon, g, s }) => (
          <div key={label} className="overflow-hidden rounded-xl border border-[#1c2438]" style={{ background: '#0d1220' }}>
            <div className="flex">
              <div className="grid w-[60px] shrink-0 place-items-center py-4" style={{ background: g, boxShadow: s }}>
                <Icon className="size-5 text-white" />
              </div>
              <div className="flex flex-col justify-center p-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#a0b0c8]">{label}</p>
                <p className="text-xl font-black text-white tabular-nums">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top 5 */}
      <div className="mb-6 rounded-xl border border-[#1c2438] overflow-hidden" style={{ background: '#0d1220' }}>
        <div className="flex items-center gap-2 border-b border-[#1c2438] px-5 py-4">
          <span className="text-base">🔥</span>
          <h2 className="text-[14px] font-bold text-white">Top 5 — Maior Demanda</h2>
        </div>
        <div className="grid grid-cols-1 divide-y divide-[#1c2438] sm:grid-cols-5 sm:divide-x sm:divide-y-0">
          {topNichos.map(({ nome, demanda, preco, concorrencia }, i) => {
            const c = COR[concorrencia]
            return (
              <Link key={nome} href="/dashboard/criar" className="flex flex-col gap-2 p-4 transition hover:bg-white/5">
                <span className="text-2xl font-black text-[#1c2438]">#{i + 1}</span>
                <p className="text-[13px] font-bold text-white leading-tight">{nome}</p>
                <div className="mt-auto space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8896b0]">Demanda</span>
                    <span className="text-[10px] font-bold" style={{ color: c.color }}>{demanda}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: '#1c2438' }}>
                    <div className="h-full rounded-full" style={{ width: `${demanda}%`, background: c.bar }} />
                  </div>
                  <p className="text-[10px] font-semibold text-[#4f7fff]">{preco}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* All nichos */}
      <div className="rounded-xl border border-[#1c2438] overflow-hidden" style={{ background: '#0d1220' }}>
        <div className="border-b border-[#1c2438] px-5 py-4">
          <h2 className="text-[14px] font-bold text-white">Todos os Nichos</h2>
          <p className="text-[11px] text-[#a0b0c8]">Clique em qualquer nicho para criar um ebook</p>
        </div>
        <div className="divide-y divide-[#1c2438]">
          {NICHOS.map(({ nome, concorrencia, preco, demanda, categoria }) => {
            const c = COR[concorrencia]
            return (
              <Link key={nome} href="/dashboard/criar"
                className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-white/5 group">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-white">{nome}</p>
                  <p className="text-[11px] text-[#8896b0]">{categoria}</p>
                </div>
                <div className="hidden w-28 sm:block">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-[#8896b0]">{demanda}%</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full" style={{ background: '#1c2438' }}>
                    <div className="h-full rounded-full" style={{ width: `${demanda}%`, background: c.bar }} />
                  </div>
                </div>
                <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ background: `${c.color}18`, color: c.color }}>{concorrencia}</span>
                <span className="shrink-0 text-[12px] font-bold text-white">{preco}</span>
                <ArrowRight className="size-3.5 text-[#8896b0] opacity-0 transition group-hover:opacity-100" />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
