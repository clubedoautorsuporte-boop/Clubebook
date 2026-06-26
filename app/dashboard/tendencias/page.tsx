import Link from 'next/link'
import { CalendarDays, TrendingUp, ArrowRight } from 'lucide-react'

const TENDENCIAS = [
  {
    tema: 'IA para Iniciantes',
    motivo: 'Explosão de interesse em ChatGPT e ferramentas de IA no Brasil',
    crescimento: '+340%',
    preco: 'R$47–127',
    urgencia: 'Quente agora',
  },
  {
    tema: 'Renda Extra Online',
    motivo: 'Crise econômica aumenta busca por fontes de renda alternativas',
    crescimento: '+210%',
    preco: 'R$27–97',
    urgencia: 'Quente agora',
  },
  {
    tema: 'Saúde Hormonal Feminina',
    motivo: 'Tendência global de autocuidado e medicina integrativa',
    crescimento: '+180%',
    preco: 'R$29–79',
    urgencia: 'Em alta',
  },
  {
    tema: 'Automação de Negócios',
    motivo: 'Pequenas empresas buscam reduzir custos com automação',
    crescimento: '+155%',
    preco: 'R$47–197',
    urgencia: 'Em alta',
  },
  {
    tema: 'Mindset Financeiro',
    motivo: 'Educação financeira domina redes sociais em 2026',
    crescimento: '+130%',
    preco: 'R$19–67',
    urgencia: 'Em alta',
  },
  {
    tema: 'Criação de Infoprodutos',
    motivo: 'Mercado de cursos e ebooks cresce 45% ao ano no Brasil',
    crescimento: '+120%',
    preco: 'R$37–147',
    urgencia: 'Subindo',
  },
  {
    tema: 'Ansiedade e Produtividade',
    motivo: 'Burnout pós-pandemia ainda gera alta demanda por soluções',
    crescimento: '+98%',
    preco: 'R$19–57',
    urgencia: 'Subindo',
  },
  {
    tema: 'Marketing no TikTok',
    motivo: 'TikTok Shop cresce no Brasil, empreendedores buscam guias práticos',
    crescimento: '+95%',
    preco: 'R$27–77',
    urgencia: 'Subindo',
  },
]

const COR_URGENCIA: Record<string, string> = {
  'Quente agora': 'bg-red-500/20 text-red-400',
  'Em alta': 'bg-orange-500/20 text-orange-400',
  'Subindo': 'bg-[#4f7fff20] text-[#4f7fff]',
}

export default function TendenciasPage() {
  return (
    <div className="px-5 py-6 md:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4f7fff15]">
            <TrendingUp className="size-5 text-[#4f7fff]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Tendências</h1>
            <p className="text-sm text-[#6b7a99]">Temas em alta para criar e revender agora</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-[#1c2438] bg-[#0f1523] px-3 py-1.5 text-[11px] text-[#6b7a99]">
          <CalendarDays className="size-3" />
          Atualizado Jun/2026
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {TENDENCIAS.map(({ tema, motivo, crescimento, preco, urgencia }) => (
          <div
            key={tema}
            className="group relative overflow-hidden rounded-2xl border border-[#1c2438] bg-[#0f1523] p-5 transition-all hover:border-[#4f7fff40]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4f7fff30] to-transparent" />
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-bold text-white">{tema}</h3>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${COR_URGENCIA[urgencia]}`}>
                {urgencia}
              </span>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-[#6b7a99]">{motivo}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#00e5c3]">{crescimento} pesquisas</span>
                <span className="text-[#2a3553]">·</span>
                <span className="text-xs text-[#6b7a99]">{preco}</span>
              </div>
              <Link
                href="/dashboard/criar"
                className="flex items-center gap-1 rounded-lg bg-[#4f7fff15] px-3 py-1.5 text-xs font-semibold text-[#4f7fff] opacity-0 transition-all group-hover:opacity-100"
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
