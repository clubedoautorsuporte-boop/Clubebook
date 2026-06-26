import Link from 'next/link'
import { Flame, TrendingUp, ArrowRight } from 'lucide-react'

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

const COR_CONCORRENCIA: Record<string, string> = {
  Baixa: 'bg-[#00e5c320] text-[#00e5c3]',
  Média: 'bg-amber-500/20 text-amber-400',
  Alta: 'bg-red-500/20 text-red-400',
}

export default function NichosPage() {
  return (
    <div className="px-5 py-6 md:px-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#ff620015]">
          <Flame className="size-5 text-orange-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Nichos Lucrativos</h1>
          <p className="text-sm text-[#6b7a99]">30 temas com alto potencial de revenda — clique para criar</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {NICHOS.map(({ nome, concorrencia, preco, demanda, categoria }) => (
          <div
            key={nome}
            className="group flex flex-col rounded-2xl border border-[#1c2438] bg-[#0f1523] p-4 transition-all hover:border-[#4f7fff40]"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <p className="font-semibold text-white">{nome}</p>
                <p className="text-[11px] text-[#3a4a66]">{categoria}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${COR_CONCORRENCIA[concorrencia]}`}>
                {concorrencia}
              </span>
            </div>

            <div className="mb-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6b7a99]">Demanda</span>
                <span className="font-semibold text-[#4f7fff]">{demanda}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#1c2438]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#4f7fff] to-[#00e5c3]"
                  style={{ width: `${demanda}%` }}
                />
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between">
              <span className="text-xs font-semibold text-[#00e5c3]">{preco}</span>
              <Link
                href="/"
                className="flex items-center gap-1 rounded-lg bg-[#4f7fff15] px-2.5 py-1.5 text-[11px] font-semibold text-[#4f7fff] opacity-0 transition-all group-hover:opacity-100"
              >
                Criar
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
