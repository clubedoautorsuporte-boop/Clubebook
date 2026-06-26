'use client'

import { useState } from 'react'
import { GraduationCap, ChevronDown, Clock, BookOpen } from 'lucide-react'

const TUTORIAIS = [
  {
    titulo: 'Como publicar na Amazon KDP',
    nivel: 'Médio',
    tempo: '15 min',
    icone: '📦',
    passos: [
      'Acesse kdp.amazon.com e crie sua conta gratuita com e-mail',
      'Clique em "+ Criar" → Ebook Kindle',
      'Preencha título, subtítulo e descrição do seu ebook',
      'Faça upload do arquivo EPUB (use o que recebeu do Clube do Autor)',
      'Crie ou faça upload da capa (recomendamos 1600×2560px)',
      'Defina o preço: entre R$9,99 e R$199,99 para 70% de royalties',
      'Escolha as categorias certas (máx. 2 para aparecer nos resultados)',
      'Clique em "Publicar" — aprovação em até 72h',
    ],
  },
  {
    titulo: 'Como criar uma página de vendas na Hotmart',
    nivel: 'Fácil',
    tempo: '20 min',
    icone: '🔥',
    passos: [
      'Crie conta em hotmart.com → acesse "Meus Produtos"',
      'Clique em "+ Novo Produto" → Ebook/PDF',
      'Faça upload do arquivo PDF do seu ebook',
      'Configure o preço e crie o checkout (Hotmart oferece template pronto)',
      'Escreva headline poderosa: "Aprenda [resultado] em [tempo]"',
      'Adicione pelo menos 5 benefícios claros em bullet points',
      'Insira depoimentos (pode usar os de clientes beta)',
      'Ative e copie o link de vendas para divulgar',
    ],
  },
  {
    titulo: 'Como promover seu ebook no Instagram e Reels',
    nivel: 'Fácil',
    tempo: '10 min',
    icone: '📱',
    passos: [
      'Crie Reels curtos (30–60s) mostrando 1 dica do seu ebook',
      'Use texto na tela com fonte grande e legível',
      'Grave com voz ou use legenda automática',
      'CTA no final: "Link na bio para o ebook completo"',
      'Publique no mínimo 3x por semana para crescer',
      'Coloque o link da Hotmart/Gumroad na bio com LinkTree',
    ],
  },
  {
    titulo: 'Script de vendas para WhatsApp',
    nivel: 'Fácil',
    tempo: '5 min',
    icone: '💬',
    passos: [
      'Mensagem 1 (curiosidade): "Posso te enviar algo que pode mudar sua [área]?"',
      'Após resposta positiva → envie o título e 3 benefícios do ebook',
      'Mensagem 3: "Está com desconto de lançamento hoje — R$47 por R$29"',
      'Envie o link direto de pagamento (Hotmart ou PIX)',
      'Follow-up em 24h se não comprou: "Ainda consegui segurar o preço"',
      'Nunca peça para a pessoa chamar você — você sempre toma a iniciativa',
    ],
  },
  {
    titulo: 'Como precificar seu ebook corretamente',
    nivel: 'Fácil',
    tempo: '8 min',
    icone: '💰',
    passos: [
      'Pesquise concorrentes no mesmo nicho no Google e Hotmart',
      'Nicho de massa (autoajuda, culinária): R$19–47',
      'Nicho técnico (investimentos, marketing): R$47–127',
      'Nicho de transformação profunda: R$67–197',
      'Comece 20% abaixo do preço-alvo para gerar primeiros reviews',
      'Aumente o preço conforme acumula depoimentos e autoridade',
    ],
  },
  {
    titulo: 'Funil de vendas simples para iniciantes',
    nivel: 'Médio',
    tempo: '12 min',
    icone: '📐',
    passos: [
      'Topo: crie conteúdo gratuito (1 dica do ebook por dia no Instagram/TikTok)',
      'Meio: ofereça um capítulo de amostra grátis em troca do e-mail',
      'Base: envie sequência de 3 emails (dia 1, dia 3, dia 5) com o link de venda',
      'Use uma ferramenta de e-mail grátis: Mailchimp ou Brevo',
      'Recupere carrinho abandonado com oferta de 30% off em 24h',
      'Reengaje lista mensal com novo conteúdo ou produto relacionado',
    ],
  },
]

const COR_NIVEL: Record<string, string> = {
  Fácil: 'bg-[#00e5c320] text-[#00e5c3]',
  Médio: 'bg-amber-500/20 text-amber-400',
  Avançado: 'bg-red-500/20 text-red-400',
}

function Accordion({ tutorial }: { tutorial: typeof TUTORIAIS[0] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl border border-[#1c2438] bg-[#0f1523] overflow-hidden transition-all">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <span className="text-2xl">{tutorial.icone}</span>
        <div className="flex-1">
          <p className="font-semibold text-white">{tutorial.titulo}</p>
          <div className="mt-1 flex items-center gap-3">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${COR_NIVEL[tutorial.nivel]}`}>
              {tutorial.nivel}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-[#3a4a66]">
              <Clock className="size-3" />
              {tutorial.tempo} de leitura
            </span>
          </div>
        </div>
        <ChevronDown className={`size-4 shrink-0 text-[#3a4a66] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-[#1c2438] px-5 pb-5 pt-4">
          <ol className="space-y-3">
            {tutorial.passos.map((passo, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#4f7fff15] text-[10px] font-bold text-[#4f7fff]">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-[#c8d3eb]">{passo}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

export default function TutoriaisPage() {
  return (
    <div className="px-5 py-6 md:px-8 max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4f7fff15]">
          <GraduationCap className="size-5 text-[#4f7fff]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Tutoriais</h1>
          <p className="text-sm text-[#6b7a99]">Guias passo a passo para vender seus ebooks com sucesso</p>
        </div>
      </div>

      <div className="space-y-3">
        {TUTORIAIS.map(t => <Accordion key={t.titulo} tutorial={t} />)}
      </div>
    </div>
  )
}
