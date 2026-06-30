import Link from 'next/link'
import { Library, ArrowRight, BookOpen, Layers, Tag } from 'lucide-react'

const TEMPLATES = [
  {
    categoria: 'Finanças',
    cor: '#f97316',
    titulo: 'Livre das Dívidas: O Guia Definitivo',
    publicoAlvo: 'Endividados que querem reorganizar finanças',
    preco: 'R$37–97',
    capitulos: ['Diagnóstico Financeiro: Onde Você Está Agora','Os 3 Tipos de Dívida e Como Priorizar','O Método Bola de Neve na Prática','Cortando Gastos Sem Sofrimento','Negociando com Credores: Scripts Prontos','Criando Sua Reserva de Emergência','Investindo Seu Primeiro Real','Mantendo o Controle para Sempre'],
  },
  {
    categoria: 'Saúde',
    cor: '#00e5c3',
    titulo: 'Emagreça 10kg em 60 Dias com Ciência',
    publicoAlvo: 'Pessoas que tentaram dietas e falharam',
    preco: 'R$27–67',
    capitulos: ['Por Que as Dietas Tradicionais Falham','A Ciência do Déficit Calórico Sem Fome','Os 10 Alimentos que Aceleram o Metabolismo','Plano Alimentar Semana a Semana','Exercícios para Quem Nunca Praticou','Hábitos de Sono que Emagrecem','Como Lidar com a Ansiedade Alimentar','Mantendo o Peso para Toda a Vida'],
  },
  {
    categoria: 'Marketing',
    cor: '#a855f7',
    titulo: 'De 0 a 10.000 Seguidores em 90 Dias',
    publicoAlvo: 'Empreendedores iniciando no digital',
    preco: 'R$47–127',
    capitulos: ['Escolhendo Seu Nicho com Dados','A Anatomia do Perfil que Converte','O Calendário de Conteúdo Imbatível','Criando Reels que Viralizam','Parcerias e Collabs Estratégicas','Usando Hashtags do Jeito Certo','Convertendo Seguidores em Clientes','Métricas que Realmente Importam'],
  },
  {
    categoria: 'IA e Tech',
    cor: '#4f7fff',
    titulo: 'ChatGPT para Negócios: 50 Usos Práticos',
    publicoAlvo: 'Empresários e profissionais liberais',
    preco: 'R$47–147',
    capitulos: ['Entendendo a IA sem Tecnicismos','Prompts Prontos para Vendas','Automatizando Atendimento ao Cliente','IA para Criar Conteúdo em Massa','Análise de Dados com ChatGPT','Integrando com Ferramentas Existentes','Erros Fatais ao Usar IA','O Futuro do Seu Negócio com IA'],
  },
  {
    categoria: 'Desenvolvimento',
    cor: '#0ea5e9',
    titulo: 'Hábitos dos Milionários: O Manual',
    publicoAlvo: 'Profissionais que querem crescer',
    preco: 'R$19–57',
    capitulos: ['A Ciência dos Hábitos (Resumo Prático)','A Rotina Matinal dos Top Performers','Como Desenvolver Disciplina Real','O Poder do Foco Profundo','Relacionamentos que Aceleram o Sucesso','Gestão de Energia, Não de Tempo','Como Aprender Qualquer Coisa em 20h','Seu Plano de 12 Semanas'],
  },
  {
    categoria: 'Negócios',
    cor: '#ec4899',
    titulo: 'Seu Primeiro Infoproduto do Zero',
    publicoAlvo: 'Quem quer monetizar conhecimento',
    preco: 'R$37–97',
    capitulos: ['Descobrindo Seu Conhecimento Monetizável','Validando Antes de Criar','Estruturando Seu Infoproduto em 7 Dias','Escolhendo a Plataforma Certa','A Página de Vendas que Converte','Seu Lançamento Semente (sem audiência)','Escalonando com Afiliados','Da Renda Extra ao Negócio Principal'],
  },
]

export default function BibliotecaPage() {
  const totalCaps = TEMPLATES.reduce((acc, t) => acc + t.capitulos.length, 0)

  return (
    <div className="px-5 py-6 pb-16 md:px-8">

      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 4px 20px rgba(249,115,22,0.4)' }}>
          <Library className="size-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Biblioteca de Templates</h1>
          <p className="text-sm text-[#a0b0c8]">Estruturas dos ebooks mais vendidos — clique para criar</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { label: 'Templates',  value: TEMPLATES.length, icon: Layers,   g: 'linear-gradient(135deg,#4f7fff,#2554e0)', s: 'rgba(79,127,255,0.4)' },
          { label: 'Categorias', value: TEMPLATES.length, icon: Tag,      g: 'linear-gradient(135deg,#6366f1,#4338ca)', s: 'rgba(99,102,241,0.4)' },
          { label: 'Capítulos',  value: totalCaps,        icon: BookOpen, g: 'linear-gradient(135deg,#00e5c3,#00b09b)', s: 'rgba(0,229,195,0.4)' },
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map(({ categoria, cor, titulo, publicoAlvo, preco, capitulos }) => (
          <div key={titulo} className="flex flex-col rounded-xl border border-[#1c2438] overflow-hidden transition hover:-translate-y-0.5 hover:border-[#2a3553]" style={{ background: '#0d1220' }}>
            <div className="h-0.5 w-full" style={{ background: cor }} />
            <div className="flex flex-col flex-1 p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ background: `${cor}18`, color: cor }}>
                  {categoria}
                </span>
                <span className="text-[12px] font-bold text-white">{preco}</span>
              </div>
              <h3 className="mb-1 text-[13px] font-bold text-white leading-snug">{titulo}</h3>
              <p className="mb-4 text-[11px] text-[#a0b0c8]">Público: {publicoAlvo}</p>
              <div className="mb-5 rounded-lg border border-[#1c2438] p-3" style={{ background: '#0b0f1c' }}>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#8896b0]">
                  Sumário · {capitulos.length} capítulos
                </p>
                <div className="space-y-1.5">
                  {capitulos.slice(0, 4).map((cap, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 text-[10px] font-bold tabular-nums" style={{ color: cor }}>{i + 1}.</span>
                      <p className="text-[11px] text-[#a0b0c8] leading-tight">{cap}</p>
                    </div>
                  ))}
                  {capitulos.length > 4 && (
                    <p className="text-[10px] text-[#8896b0] pl-4">+ {capitulos.length - 4} capítulos...</p>
                  )}
                </div>
              </div>
              <Link
                href="/dashboard/criar"
                className="mt-auto flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-[12px] font-bold text-white transition hover:opacity-90"
                style={{ background: `linear-gradient(135deg,${cor}dd,${cor})`, boxShadow: `0 4px 12px ${cor}40` }}
              >
                Usar este template <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
