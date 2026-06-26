import Link from 'next/link'
import { Library, ArrowRight } from 'lucide-react'

const TEMPLATES = [
  {
    categoria: 'Finanças',
    titulo: 'Livre das Dívidas: O Guia Definitivo',
    publicoAlvo: 'Endividados que querem reorganizar finanças',
    preco: 'R$37–97',
    capitulos: [
      'Diagnóstico Financeiro: Onde Você Está Agora',
      'Os 3 Tipos de Dívida e Como Priorizar',
      'O Método Bola de Neve na Prática',
      'Cortando Gastos Sem Sofrimento',
      'Negociando com Credores: Scripts Prontos',
      'Criando Sua Reserva de Emergência',
      'Investindo Seu Primeiro Real',
      'Mantendo o Controle para Sempre',
    ],
  },
  {
    categoria: 'Saúde',
    titulo: 'Emagreça 10kg em 60 Dias com Ciência',
    publicoAlvo: 'Pessoas que tentaram dietas e falharam',
    preco: 'R$27–67',
    capitulos: [
      'Por Que as Dietas Tradicionais Falham',
      'A Ciência do Déficit Calórico Sem Fome',
      'Os 10 Alimentos que Aceleram o Metabolismo',
      'Plano Alimentar Semana a Semana',
      'Exercícios para Quem Nunca Praticou',
      'Hábitos de Sono que Emagrecem',
      'Como Lidar com a Ansiedade Alimentar',
      'Mantendo o Peso para Toda a Vida',
    ],
  },
  {
    categoria: 'Marketing',
    titulo: 'De 0 a 10.000 Seguidores em 90 Dias',
    publicoAlvo: 'Empreendedores iniciando no digital',
    preco: 'R$47–127',
    capitulos: [
      'Escolhendo Seu Nicho com Dados',
      'A Anatomia do Perfil que Converte',
      'O Calendário de Conteúdo Imbatível',
      'Criando Reels que Viralizam',
      'Parcerias e Collabs Estratégicas',
      'Usando Hashtags do Jeito Certo',
      'Convertendo Seguidores em Clientes',
      'Métricas que Realmente Importam',
    ],
  },
  {
    categoria: 'IA e Tech',
    titulo: 'ChatGPT para Negócios: 50 Usos Práticos',
    publicoAlvo: 'Empresários e profissionais liberais',
    preco: 'R$47–147',
    capitulos: [
      'Entendendo a IA sem Tecnicismos',
      'Prompts Prontos para Vendas',
      'Automatizando Atendimento ao Cliente',
      'IA para Criar Conteúdo em Massa',
      'Análise de Dados com ChatGPT',
      'Integrando com Ferramentas Existentes',
      'Erros Fatais ao Usar IA',
      'O Futuro do Seu Negócio com IA',
    ],
  },
  {
    categoria: 'Desenvolvimento',
    titulo: 'Hábitos dos Milionários: O Manual',
    publicoAlvo: 'Profissionais que querem crescer',
    preco: 'R$19–57',
    capitulos: [
      'A Ciência dos Hábitos (Resumo Prático)',
      'A Rotina Matinal dos Top Performers',
      'Como Desenvolver Disciplina Real',
      'O Poder do Foco Profundo',
      'Relacionamentos que Aceleram o Sucesso',
      'Gestão de Energia, Não de Tempo',
      'Como Aprender Qualquer Coisa em 20h',
      'Seu Plano de 12 Semanas',
    ],
  },
  {
    categoria: 'Negócios',
    titulo: 'Seu Primeiro Infoproduto do Zero',
    publicoAlvo: 'Quem quer monetizar conhecimento',
    preco: 'R$37–97',
    capitulos: [
      'Descobrindo Seu Conhecimento Monetizável',
      'Validando Antes de Criar',
      'Estruturando Seu Infoproduto em 7 Dias',
      'Escolhendo a Plataforma Certa',
      'A Página de Vendas que Converte',
      'Seu Lançamento Semente (sem audiência)',
      'Escalonando com Afiliados',
      'Da Renda Extra ao Negócio Principal',
    ],
  },
]

const COR_CATEGORIA: Record<string, string> = {
  Finanças: 'bg-amber-500/20 text-amber-400',
  Saúde: 'bg-[#00e5c320] text-[#00e5c3]',
  Marketing: 'bg-purple-500/20 text-purple-400',
  'IA e Tech': 'bg-[#4f7fff20] text-[#4f7fff]',
  Desenvolvimento: 'bg-blue-500/20 text-blue-400',
  Negócios: 'bg-orange-500/20 text-orange-400',
}

export default function BibliotecaPage() {
  return (
    <div className="px-5 py-6 md:px-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4f7fff15]">
          <Library className="size-5 text-[#4f7fff]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Biblioteca de Templates</h1>
          <p className="text-sm text-[#6b7a99]">Estruturas prontas dos ebooks mais vendidos — clique para criar</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map(({ categoria, titulo, publicoAlvo, preco, capitulos }) => (
          <div
            key={titulo}
            className="group flex flex-col rounded-2xl border border-[#1c2438] bg-[#0f1523] p-5 transition-all hover:border-[#4f7fff40]"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${COR_CATEGORIA[categoria]}`}>
                {categoria}
              </span>
              <span className="text-xs font-semibold text-[#00e5c3]">{preco}</span>
            </div>

            <h3 className="mb-1.5 font-bold leading-tight text-white">{titulo}</h3>
            <p className="mb-4 text-xs leading-relaxed text-[#6b7a99]">Público: {publicoAlvo}</p>

            <div className="mb-5 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#3a4a66]">Sumário ({capitulos.length} capítulos)</p>
              {capitulos.slice(0, 4).map((cap, i) => (
                <p key={i} className="text-xs text-[#6b7a99]">
                  <span className="text-[#2a3553]">{i + 1}.</span> {cap}
                </p>
              ))}
              {capitulos.length > 4 && (
                <p className="text-[10px] text-[#2a3553]">+ {capitulos.length - 4} capítulos...</p>
              )}
            </div>

            <Link
              href="/dashboard/criar"
              className="mt-auto flex items-center justify-center gap-1.5 rounded-xl bg-[#4f7fff15] py-2.5 text-xs font-semibold text-[#4f7fff] transition hover:bg-[#4f7fff25]"
            >
              Usar este template
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
