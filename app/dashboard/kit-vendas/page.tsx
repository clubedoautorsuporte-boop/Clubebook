'use client'

import { useState } from 'react'
import { ShoppingCart, Copy, Check, ArrowRight } from 'lucide-react'

function gerarCopy(titulo: string) {
  const t = titulo || 'Seu Ebook'
  return {
    pagina: `🚀 ${t.toUpperCase()} — O Guia Definitivo

✅ Descubra como ${t.toLowerCase()} pode transformar a sua vida em apenas alguns dias de leitura.

Você vai aprender:
• Como começar do zero, mesmo sem experiência
• Os erros que 90% das pessoas cometem (e como evitar)
• O método passo a passo que já ajudou centenas de pessoas
• Estratégias avançadas que os especialistas não contam

🎯 Não perca mais tempo tentando descobrir sozinho.

👉 GARANTA JÁ POR APENAS R$47
[link da sua plataforma de venda]

⚡ Bônus: suporte exclusivo por 30 dias + atualizações grátis`.trim(),

    whatsapp: `Oi! 👋

Acabei de lançar o ebook "${t}" e queria compartilhar com você!

📖 É um guia completo e prático que vai te ajudar a [benefício principal].

Estou vendendo por apenas R$47 (preço de lançamento!) e você pode baixar agora mesmo.

Quer o link? É só responder aqui 🙂`.trim(),

    instagram: `✨ Novo ebook lançado: "${t}" ✨

Se você sempre quis aprender sobre isso mas não sabia por onde começar, esse guia é pra você! 📖

👉 Link na bio para garantir o seu

#ebook #conhecimento #${t.toLowerCase().replace(/\s+/g, '').slice(0, 15)} #infoproduto #aprendizado #digitalproduct #livrodigital #leitura`.trim(),

    email: `ASSUNTO: Seu guia sobre ${t} chegou! 🎉

---

Olá [Nome],

Tenho uma novidade incrível para você.

Acabei de lançar "${t}" — um ebook completo que vai te mostrar exatamente como [resultado principal] sem [principal dor ou obstáculo].

O que você vai encontrar dentro:
✅ [Benefício 1]
✅ [Benefício 2]
✅ [Benefício 3]

E o melhor: está disponível por apenas R$47 no lançamento.

👉 [Link de compra]

Qualquer dúvida, é só responder esse email.

Até breve,
[Seu nome]`.trim(),
  }
}

function CopyBlock({ titulo, rotulo, texto }: { titulo: string; rotulo: string; texto: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(texto).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <div className="rounded-2xl border border-[#e9ecef] bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#7b809a]">{rotulo}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-lg border border-[#e9ecef] px-2.5 py-1 text-xs font-medium text-[#7b809a] transition hover:border-[#4f7fff40] hover:text-[#344767]"
        >
          {copied ? <Check className="size-3 text-[#00e5c3]" /> : <Copy className="size-3" />}
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-[#495057]">{texto}</pre>
    </div>
  )
}

export default function KitVendasPage() {
  const [titulo, setTitulo] = useState('')
  const [gerado, setGerado] = useState(false)
  const copy = gerado ? gerarCopy(titulo) : null

  return (
    <div className="px-5 py-6 md:px-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4f7fff15]">
          <ShoppingCart className="size-5 text-[#4f7fff]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#344767]">Kit de Vendas</h1>
          <p className="text-sm text-[#7b809a]">Copy pronta para vender seu ebook em qualquer canal</p>
        </div>
      </div>

      {/* Input */}
      <div className="mb-8 flex gap-3">
        <input
          type="text"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setGerado(true)}
          placeholder="Nome do seu ebook (ex: Finanças Pessoais para Iniciantes)"
          className="flex-1 rounded-xl border border-[#e9ecef] bg-white px-4 py-3 text-sm text-[#344767] placeholder:text-[#9ca3af] focus:border-[#4f7fff50] focus:outline-none"
        />
        <button
          onClick={() => setGerado(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] px-5 py-3 text-sm font-bold text-white shadow-[0_0_16px_rgba(79,127,255,0.3)] transition hover:shadow-[0_0_24px_rgba(79,127,255,0.5)]"
        >
          Gerar Kit
          <ArrowRight className="size-4" />
        </button>
      </div>

      {copy ? (
        <div className="space-y-4">
          <CopyBlock titulo={titulo} rotulo="Página de Vendas" texto={copy.pagina} />
          <CopyBlock titulo={titulo} rotulo="Pitch para WhatsApp" texto={copy.whatsapp} />
          <CopyBlock titulo={titulo} rotulo="Legenda para Instagram" texto={copy.instagram} />
          <CopyBlock titulo={titulo} rotulo="Sequência de E-mail" texto={copy.email} />
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#e9ecef] py-16 text-center">
          <p className="text-3xl mb-3">📝</p>
          <p className="text-sm text-[#7b809a]">Digite o nome do seu ebook acima e clique em "Gerar Kit"</p>
          <p className="mt-1 text-xs text-[#9ca3af]">Você receberá copy para página de vendas, WhatsApp, Instagram e e-mail</p>
        </div>
      )}
    </div>
  )
}
