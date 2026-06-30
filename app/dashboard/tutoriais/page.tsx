'use client'

import { useState } from 'react'
import { GraduationCap, ChevronDown, Clock, Play } from 'lucide-react'

const TUTORIAIS = [
  {
    categoria: 'Início',
    itens: [
      { titulo: 'Como funciona o Clube do Autor IA', duracao: '3 min', conteudo: 'O Clube do Autor IA usa inteligência artificial para criar ebooks completos em português. Você escolhe o nicho, fornece o título e nossa IA (Aurora) gera estrutura, capítulos, conteúdo e formatação. O ebook sai pronto em PDF, DOCX e EPUB para você revender nas plataformas.' },
      { titulo: 'Criando seu primeiro ebook passo a passo', duracao: '5 min', conteudo: '1. Vá para "Criar Ebook" no menu lateral.\n2. Escolha um nicho lucrativo ou crie o seu.\n3. Insira um título atrativo (ex: "10 Hábitos dos Milionários").\n4. Aguarde a IA gerar — leva entre 10 e 30 minutos.\n5. Acesse "Meus Ebooks" para baixar seu PDF pronto.' },
      { titulo: 'Entendendo o sistema de créditos', duracao: '2 min', conteudo: 'Cada ebook consome aproximadamente 1.000 créditos. Os créditos não vencem e ficam disponíveis para sempre na sua conta. Você pode comprar créditos na página de Créditos e acumular para criar vários ebooks de uma vez.' },
    ],
  },
  {
    categoria: 'Criação de Conteúdo',
    itens: [
      { titulo: 'Como escolher o título certo para vender mais', duracao: '4 min', conteudo: 'Títulos que vendem seguem fórmulas testadas:\n• "Como [resultado] em [tempo] sem [obstáculo]"\n• "X [coisas/segredos/passos] para [resultado]"\n• "O Guia Definitivo de [nicho]"\n\nEvite títulos vagos como "Meu Ebook". Seja específico com números e promessas concretas.' },
      { titulo: 'Os nichos mais lucrativos para revender', duracao: '4 min', conteudo: 'Top nichos de maior faturamento em 2026:\n1. Finanças pessoais e investimentos (ticket: R$37–97)\n2. Emagrecimento e saúde (R$27–67)\n3. IA e tecnologia (R$47–197)\n4. Marketing digital (R$37–147)\n5. Empreendedorismo online (R$47–127)\n\nAcesse Nichos Lucrativos no menu para ver todos os 30 nichos mapeados.' },
      { titulo: 'Como revisar e melhorar o ebook gerado', duracao: '6 min', conteudo: 'Após gerar, acesse o ebook em "Meus Ebooks" e clique em "Ver". Você pode:\n• Revisar cada capítulo\n• Identificar pontos para enriquecer\n• Verificar formatação\n\nLembre-se: a IA cria a estrutura base. Uma revisão rápida de 15 minutos pode aumentar muito a qualidade e o valor percebido pelo comprador.' },
    ],
  },
  {
    categoria: 'Vendas e Monetização',
    itens: [
      { titulo: 'Onde vender seu ebook (plataformas recomendadas)', duracao: '5 min', conteudo: 'Melhores plataformas para iniciantes:\n• Hotmart: Mais fácil, saque via PIX, 70–80% de comissão\n• Gumroad: Internacional, ideal para vender em dólar\n• Eduzz: Ótimo sistema de afiliados\n\nRecomendamos começar pela Hotmart. Acesse "Plataformas" no menu para links diretos de cadastro.' },
      { titulo: 'Como precificar seu ebook para lucrar mais', duracao: '4 min', conteudo: 'Regras de precificação:\n• Nichos de dinheiro/negócios: R$47–127\n• Saúde e emagrecimento: R$27–79\n• Desenvolvimento pessoal: R$19–57\n• Tecnologia/IA: R$47–197\n\nNunca venda abaixo de R$19,90 — preços muito baixos transmitem baixo valor. Use R$X7 ou R$X9 (ex: R$47, R$97) pois convertem melhor.' },
      { titulo: 'Estratégias de divulgação no Instagram e WhatsApp', duracao: '7 min', conteudo: 'Instagram:\n• Poste 3 reels por semana sobre o tema do ebook\n• Use copy: "Aprenda [resultado] — link na bio"\n• Stories com enquete para engajamento\n\nWhatsApp:\n• Crie um grupo de antecipação\n• Ofereça preview gratuito de 2 capítulos\n• Use status para divulgar\n\nDica de ouro: use o Kit de Vendas gerado pela IA para ter copy profissional pronto.' },
    ],
  },
  {
    categoria: 'Avançado',
    itens: [
      { titulo: 'Escalonando: de 1 para 50 ebooks por mês', duracao: '8 min', conteudo: 'O segredo está em criar séries e nichar fundo:\n1. Escolha 1 nicho principal (ex: Finanças)\n2. Crie 5 ebooks com ângulos diferentes\n3. Monte um catálogo temático\n4. Ofereça bundle (3 ebooks por R$97)\n5. Recrute afiliados para escalar vendas\n\nCom créditos Ultra (100k) você pode criar até 100 ebooks e construir um negócio sólido de informação.' },
      { titulo: 'Como criar uma marca pessoal de autor', duracao: '6 min', conteudo: 'Ter uma marca pessoal aumenta em 3x o valor percebido:\n• Crie um perfil de "autor especialista"\n• Use sempre o mesmo avatar/foto\n• Defina uma bio clara (ex: "Especialista em finanças pessoais")\n• Publique consistentemente sobre o nicho\n\nVocê pode usar um pseudônimo — muitos autores de ebooks de sucesso usam.' },
    ],
  },
]

export default function TutoriaisPage() {
  const [aberto, setAberto] = useState<string | null>(null)
  const total = TUTORIAIS.reduce((acc, c) => acc + c.itens.length, 0)

  return (
    <div className="px-5 py-6 pb-16 md:px-8">

      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: 'linear-gradient(135deg,#4f7fff,#2554e0)', boxShadow: '0 4px 20px rgba(79,127,255,0.4)' }}>
          <GraduationCap className="size-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Tutoriais</h1>
          <p className="text-sm text-[#a0b0c8]">{total} guias para dominar a plataforma e vender mais</p>
        </div>
      </div>

      <div className="space-y-4">
        {TUTORIAIS.map(({ categoria, itens }) => (
          <div key={categoria} className="rounded-xl border border-[#1c2438] overflow-hidden" style={{ background: '#0d1220' }}>
            <div className="border-b border-[#1c2438] px-5 py-3" style={{ background: '#0b0f1c' }}>
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#a0b0c8]">{categoria}</p>
            </div>
            <div className="divide-y divide-[#1c2438]">
              {itens.map(({ titulo, duracao, conteudo }) => {
                const key = `${categoria}-${titulo}`
                const isOpen = aberto === key
                return (
                  <div key={titulo}>
                    <button
                      onClick={() => setAberto(isOpen ? null : key)}
                      className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-white/5"
                    >
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}>
                        <Play className="size-3.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-white">{titulo}</p>
                        <p className="flex items-center gap-1 text-[10px] text-[#8896b0]">
                          <Clock className="size-2.5" /> {duracao} de leitura
                        </p>
                      </div>
                      <ChevronDown className={`size-4 text-[#8896b0] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="border-t border-[#1c2438] px-5 py-4" style={{ background: '#0b0f1c' }}>
                        <pre className="whitespace-pre-wrap font-sans text-[12px] leading-relaxed text-[#a0b0c8]">{conteudo}</pre>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
