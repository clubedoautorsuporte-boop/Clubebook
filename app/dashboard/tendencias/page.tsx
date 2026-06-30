import Link from 'next/link'
import { CalendarDays, TrendingUp, ArrowRight } from 'lucide-react'

const TENDENCIAS = [
  { tema: 'IA para Iniciantes', motivo: 'Explosão de interesse em ChatGPT e ferramentas de IA no Brasil', crescimento: '+340%', preco: 'R$47–127', urgencia: 'Quente agora', cor: '#e53935' },
  { tema: 'Renda Extra Online', motivo: 'Crise econômica aumenta busca por fontes de renda alternativas', crescimento: '+210%', preco: 'R$27–97', urgencia: 'Quente agora', cor: '#e53935' },
  { tema: 'Saúde Hormonal Feminina', motivo: 'Tendência global de autocuidado e medicina integrativa', crescimento: '+180%', preco: 'R$29–79', urgencia: 'Em alta', cor: '#f97316' },
  { tema: 'Automação de Negócios', motivo: 'Pequenas empresas buscam reduzir custos com automação', crescimento: '+155%', preco: 'R$47–197', urgencia: 'Em alta', cor: '#f97316' },
  { tema: 'Mindset Financeiro', motivo: 'Educação financeira domina redes sociais em 2026', crescimento: '+130%', preco: 'R$19–67', urgencia: 'Em alta', cor: '#f97316' },
  { tema: 'Criação de Infoprodutos', motivo: 'Mercado de cursos e ebooks cresce 45% ao ano no Brasil', crescimento: '+120%', preco: 'R$37–147', urgencia: 'Subindo', cor: '#4f7fff' },
  { tema: 'Ansiedade e Produtividade', motivo: 'Burnout pós-pandemia ainda gera alta demanda por soluções', crescimento: '+98%', preco: 'R$19–57', urgencia: 'Subindo', cor: '#4f7fff' },
  { tema: 'Marketing no TikTok', motivo: 'TikTok Shop cresce no Brasil, empreendedores buscam guias práticos', crescimento: '+95%', preco: 'R$27–77', urgencia: 'Subindo', cor: '#4f7fff' },
]

export default function TendenciasPage() {
  return (
    <div className="px-5 py-6 md:px-8">

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: 'linear-gradient(135deg,#4f7fff,#2554e0)', boxShadow: '0 4px 20px rgba(79,127,255,0.4)' }}>
            <TrendingUp className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Tendências</h1>
            <p className="text-sm text-[#a0b0c8]">Temas em alta para criar e revender agora</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-[#1c2438] px-3 py-1.5 text-[11px] text-[#a0b0c8]" style={{ background: '#0d1220' }}>
          <CalendarDays className="size-3" /> Jun/2026
        </span>
      </div>

      <div className="rounded-xl border border-[#1c2438] overflow-hidden" style={{ background: '#0d1220' }}>
        <div className="border-b border-[#1c2438] px-5 py-4">
          <p className="text-[12px] font-bold uppercase tracking-wider text-[#a0b0c8]">Ordenado por crescimento</p>
        </div>
        <div className="divide-y divide-[#1c2438]">
          {TENDENCIAS.map(({ tema, motivo, crescimento, preco, urgencia, cor }, i) => (
            <div key={tema} className="flex items-center gap-4 px-5 py-4 transition hover:bg-white/5 group">
              <span className="w-6 shrink-0 text-center text-[13px] font-black text-[#1c2438]">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[13px] font-bold text-white">{tema}</p>
                  <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ background: `${cor}18`, color: cor }}>
                    {urgencia}
                  </span>
                </div>
                <p className="text-[11px] text-[#a0b0c8] line-clamp-1">{motivo}</p>
              </div>
              <div className="shrink-0 text-right hidden sm:block">
                <p className="text-[13px] font-bold text-[#00e5c3]">{crescimento}</p>
                <p className="text-[10px] text-[#8896b0]">{preco}</p>
              </div>
              <Link
                href="/dashboard/criar"
                className="shrink-0 flex items-center gap-1 rounded-lg border border-[#1c2438] px-3 py-1.5 text-[11px] font-semibold text-[#a0b0c8] opacity-0 transition group-hover:opacity-100 hover:border-[#2a3553] hover:text-white"
                style={{ background: '#0b0f1c' }}
              >
                Criar <ArrowRight className="size-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
