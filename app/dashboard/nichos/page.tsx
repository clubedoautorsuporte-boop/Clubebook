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
  { nome: 'Moda Sustentável', concorrencia: 'Baixa', preco: 'R$19–47', demanda: 65, categoria: 'Estilo' },
  { nome: 'Negócios Digitais', concorrencia: 'Alta', preco: 'R$47–197', demanda: 91, categoria: 'Negócios' },
  { nome: 'Educação Financeira', concorrencia: 'Média', preco: 'R$27–97', demanda: 88, categoria: 'Dinheiro' },
  { nome: 'Relacionamentos', concorrencia: 'Baixa', preco: 'R$19–57', demanda: 80, categoria: 'Pessoas' },
]

const COR_CONCORRENCIA: Record<string, { badge: string; barColor: string }> = {
  Baixa: { badge: 'bg-[#00e5c320] text-[#00e5c3]', barColor: '#00e5c3' },
  Média: { badge: 'bg-amber-500/20 text-amber-400', barColor: '#f59e0b' },
  Alta:  { badge: 'bg-red-500/20 text-red-400',     barColor: '#f87171' },
}

const topNichos = [...NICHOS].sort((a, b) => b.demanda - a.demanda).slice(0, 5)
const baixaConcorrencia = NICHOS.filter(n => n.concorrencia === 'Baixa').length
const avgDemanda = Math.round(NICHOS.reduce((acc, n) => acc + n.demanda, 0) / NICHOS.length)

export default function NichosPage() {
  return (
    <div className="px-5 py-6 pb-16 md:px-8">

      {/* ── Header ── */}
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#f9731618]">
          <Flame className="size-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Nichos Lucrativos</h1>
          <p className="text-sm text-[#6b7a99]">{NICHOS.length} temas com alto potencial de revenda — clique para criar</p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[
          { label: 'Nichos mapeados', value: NICHOS.length, icon: Target, color: '#4f7fff', bg: '#4f7fff18' },
          { label: 'Baixa concorrência', value: baixaConcorrencia, icon: TrendingUp, color: '#00e5c3', bg: '#00e5c318' },
          { label: 'Demanda média', value: `${avgDemanda}%`, icon: BarChart3, color: '#8b5cf6', bg: '#8b5cf618' },
          { label: 'Preço máx. visto', value: 'R$197', icon: DollarSign, color: '#f59e0b', bg: '#f59e0b18' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] text-[#6b7a99]">{label}</p>
              <div className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: bg }}>
                <Icon className="size-3.5" style={{ color }} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Top 5 em destaque ── */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-px flex-1 bg-gradient-to-r from-[#f9731640] to-transparent" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400">🔥 Top 5 maior demanda</p>
          <span className="h-px flex-1 bg-gradient-to-l from-[#f9731640] to-transparent" />
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
          {topNichos.map(({ nome, demanda, preco, concorrencia }, i) => (
            <Link key={nome} href="/dashboard/criar"
              className="group flex flex-col gap-2 rounded-2xl border border-[#f9731620] bg-[#f9731608] p-3.5 transition hover:bg-[#f9731612] hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-[#f97316]/40">#{i + 1}</span>
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${COR_CONCORRENCIA[concorrencia].badge}`}>
                  {concorrencia}
                </span>
              </div>
              <p className="text-sm font-bold text-white leading-tight">{nome}</p>
              <div className="mt-auto">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] text-[#6b7a99]">Demanda</span>
                  <span className="text-[10px] font-bold text-[#f97316]">{demanda}%</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-[#1c2438]">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#f97316] to-[#facc15]"
                    style={{ width: `${demanda}%` }} />
                </div>
                <p className="mt-1.5 text-[10px] text-[#00e5c3] font-semibold">{preco}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Todos os nichos ── */}
      <div className="mb-3 flex items-center gap-2">
        <span className="h-px flex-1 bg-gradient-to-r from-[#4f7fff40] to-transparent" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#4f7fff]">Todos os nichos</p>
        <span className="h-px flex-1 bg-gradient-to-l from-[#4f7fff40] to-transparent" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {NICHOS.map(({ nome, concorrencia, preco, demanda, categoria }) => {
          const { badge, barColor } = COR_CONCORRENCIA[concorrencia]
          return (
            <div key={nome}
              className="group flex flex-col rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-4 transition-all hover:border-[#4f7fff30] hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="font-semibold text-white">{nome}</p>
                  <p className="text-[11px] text-[#3a4a66]">{categoria}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${badge}`}>{concorrencia}</span>
              </div>

              <div className="mb-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6b7a99]">Demanda</span>
                  <span className="font-bold" style={{ color: barColor }}>{demanda}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#1c2438]">
                  <div className="h-full rounded-full" style={{ width: `${demanda}%`, background: `linear-gradient(90deg, #4f7fff, ${barColor})` }} />
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs font-semibold text-[#00e5c3]">{preco}</span>
                <Link href="/dashboard/criar"
                  className="flex items-center gap-1 rounded-lg bg-[#4f7fff15] px-2.5 py-1.5 text-[11px] font-semibold text-[#4f7fff] opacity-0 transition-all group-hover:opacity-100">
                  Criar <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
