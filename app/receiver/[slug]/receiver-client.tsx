'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, CheckCircle, ChevronDown, ChevronUp,
  Shield, Headphones, Award, Sparkles,
} from 'lucide-react'

type Capitulo = { numero: number; titulo: string; descricao: string; blocos: string[] }

/* ── Chapters with expand/collapse ──────────────────────────────── */
export function ChaptersList({ capitulos }: { capitulos: Capitulo[] }) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? capitulos : capitulos.slice(0, 6)

  return (
    <div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {visible.map(cap => (
          <div key={cap.numero}
            className="flex gap-3.5 rounded-xl p-4 transition"
            style={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black"
              style={{ background: 'rgba(79,127,255,0.12)', color: '#4f7fff' }}>
              {String(cap.numero).padStart(2, '0')}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-white leading-snug">{cap.titulo}</p>
              {cap.descricao && (
                <p className="mt-0.5 text-[11px] line-clamp-2" style={{ color: '#5a6a84' }}>{cap.descricao}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {capitulos.length > 6 && (
        <button onClick={() => setShowAll(o => !o)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-3 text-[12px] font-semibold transition hover:text-white"
          style={{ border: '1px solid rgba(255,255,255,0.07)', color: '#5a6a84', background: 'rgba(255,255,255,0.02)' }}>
          {showAll
            ? <><ChevronUp className="size-3.5" /> Mostrar menos</>
            : <><ChevronDown className="size-3.5" /> Ver todos os {capitulos.length} capítulos</>
          }
        </button>
      )}
    </div>
  )
}

/* ── FAQ Item ────────────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <button onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-[13px] font-semibold text-white transition hover:text-[#4f7fff]">
        {q}
        {open
          ? <ChevronUp className="size-4 shrink-0 text-[#4f7fff]" />
          : <ChevronDown className="size-4 shrink-0 text-[#5a6a84]" />
        }
      </button>
      {open && <p className="pb-4 text-[12px] leading-relaxed" style={{ color: '#6a7a96' }}>{a}</p>}
    </div>
  )
}

const FAQS = [
  { q: 'E se eu quiser mudar algo depois?', a: 'Você pode editar o conteúdo diretamente no editor antes de finalizar. A Aurora gera o texto base e você personaliza à vontade.' },
  { q: 'Quanto tempo demora pra ficar pronto?', a: 'O livro completo fica pronto em menos de 1 hora após o pagamento. Você recebe por WhatsApp e e-mail.' },
  { q: 'É seguro pagar?', a: 'Sim. Utilizamos Stripe com criptografia SSL, os mesmos padrões de grandes bancos. Seu pagamento é 100% seguro.' },
  { q: 'Preciso saber escrever?', a: 'Não. A Aurora escreve tudo por você — do primeiro ao último capítulo. Você só precisa ter uma história ou ideia para contar.' },
  { q: 'De quem são os direitos do livro?', a: '100% seus. Você é o autor e detém todos os direitos sobre o conteúdo gerado.' },
]

export function FaqList() {
  return (
    <div className="rounded-2xl p-6" style={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.05)' }}>
      <h2 className="text-[15px] font-black text-white tracking-tight mb-4">Dúvidas frequentes</h2>
      {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
    </div>
  )
}

/* ── Pricing Block ───────────────────────────────────────────────── */
export function PricingBlock() {
  return (
    <div id="gerar" className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(79,127,255,0.25)', background: '#0d1220' }}>
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-end gap-6 mb-6">
          <div className="flex-1">
            <p className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: '#5a6a84' }}>
              Caminho tradicional
            </p>
            <p className="text-[18px] font-bold line-through" style={{ color: '#3a4a60' }}>~R$ 21.500</p>
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: '#00e5c3' }}>
              Hoje, com tudo pronto
            </p>
            <p className="text-[40px] font-black text-white leading-none">R$ 49<span className="text-[24px]">,99</span></p>
            <p className="text-[11px] mt-1" style={{ color: '#5a6a84' }}>PIX ou cartão · sem mensalidade</p>
          </div>
        </div>

        <Link href="#"
          className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[14px] font-black text-white transition hover:opacity-90 hover:scale-[1.01] mb-4"
          style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)', boxShadow: '0 8px 28px rgba(79,127,255,0.4)' }}>
          <Sparkles className="size-4" /> Gerar meu livro completo agora <ArrowRight className="size-4" />
        </Link>

        <div className="flex flex-wrap gap-3 text-[11px] mb-6" style={{ color: '#6a7a96' }}>
          {['Texto completo · todos os capítulos', 'EPUB + PDF + DOCX prontos', 'Edição ilimitada depois'].map(b => (
            <span key={b} className="flex items-center gap-1">
              <CheckCircle className="size-3 text-[#00e5c3]" /> {b}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Shield, label: 'Pagamento seguro', desc: 'PIX ou cartão' },
            { icon: Award, label: 'Edição ilimitada', desc: 'revise quando quiser' },
            { icon: Headphones, label: 'Suporte humano', desc: 'gente de verdade' },
            { icon: CheckCircle, label: 'Direitos 100% seus', desc: 'você é o autor' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col gap-1 rounded-xl p-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Icon className="size-4" style={{ color: '#4f7fff' }} />
              <p className="text-[11px] font-bold text-white">{label}</p>
              <p className="text-[10px]" style={{ color: '#5a6a84' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
