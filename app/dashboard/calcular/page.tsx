'use client'

import { useState } from 'react'
import { Calculator, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const PLATAFORMAS = [
  { nome: 'Hotmart', comissao: 0.75 },
  { nome: 'Gumroad', comissao: 0.91 },
  { nome: 'Eduzz', comissao: 0.78 },
  { nome: 'Kwik', comissao: 0.82 },
  { nome: 'Amazon KDP', comissao: 0.70 },
  { nome: 'Braip', comissao: 0.75 },
]

const SALARIO_MINIMO = 1518

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function CalculadoraPage() {
  const [preco, setPreco] = useState(47)
  const [vendas, setVendas] = useState(50)
  const [plataformaIdx, setPlataformaIdx] = useState(0)

  const plataforma = PLATAFORMAS[plataformaIdx]
  const bruto = preco * vendas
  const taxa = bruto * (1 - plataforma.comissao)
  const liquido = bruto - taxa
  const salarios = (liquido / SALARIO_MINIMO).toFixed(1)

  return (
    <div className="px-5 py-6 md:px-8 max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4f7fff15]">
          <Calculator className="size-5 text-[#4f7fff]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#344767]">Calculadora de Receita</h1>
          <p className="text-sm text-[#7b809a]">Descubra quanto você pode ganhar revendendo seus ebooks</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-6 rounded-2xl border border-[#e9ecef] bg-white p-6">
          {/* Preço */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-[#344767]">Preço do ebook</label>
              <span className="rounded-lg bg-[#4f7fff15] px-3 py-1 text-sm font-bold text-[#4f7fff]">
                {fmt(preco)}
              </span>
            </div>
            <input
              type="range"
              min={9}
              max={197}
              step={2}
              value={preco}
              onChange={e => setPreco(Number(e.target.value))}
              className="w-full accent-[#4f7fff]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-[#9ca3af]">
              <span>R$9</span><span>R$197</span>
            </div>
          </div>

          {/* Vendas */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-[#344767]">Vendas por mês</label>
              <span className="rounded-lg bg-[#4f7fff15] px-3 py-1 text-sm font-bold text-[#4f7fff]">
                {vendas}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={1000}
              step={10}
              value={vendas}
              onChange={e => setVendas(Number(e.target.value))}
              className="w-full accent-[#4f7fff]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-[#9ca3af]">
              <span>10</span><span>1.000</span>
            </div>
          </div>

          {/* Plataforma */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#344767]">Plataforma</label>
            <div className="grid grid-cols-3 gap-2">
              {PLATAFORMAS.map((p, i) => (
                <button
                  key={p.nome}
                  onClick={() => setPlataformaIdx(i)}
                  className={`rounded-xl border py-2 text-xs font-medium transition ${
                    plataformaIdx === i
                      ? 'border-[#4f7fff50] bg-[#4f7fff20] text-[#4f7fff]'
                      : 'border-[#e9ecef] bg-[#f0f2f5] text-[#7b809a] hover:border-[#d4dae3]'
                  }`}
                >
                  {p.nome}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-4">
          {/* Receita mensal */}
          <div className="rounded-2xl border border-[#00e5c320] bg-gradient-to-br from-[#00e5c308] to-[#4f7fff05] p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7b809a] mb-1">Receita líquida mensal</p>
            <p className="text-4xl font-extrabold text-[#344767]">{fmt(liquido)}</p>
            <p className="mt-1 text-xs text-[#7b809a]">
              {plataforma.nome} retém {fmt(taxa)} · Você fica com {Math.round(plataforma.comissao * 100)}%
            </p>
          </div>

          {/* Projeções */}
          <div className="rounded-2xl border border-[#e9ecef] bg-white p-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Projeção</p>
            <div className="space-y-3">
              {[
                { label: '3 meses', value: liquido * 3 },
                { label: '6 meses', value: liquido * 6 },
                { label: '1 ano', value: liquido * 12 },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-[#7b809a]">{label}</span>
                  <span className="font-bold text-[#344767]">{fmt(value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Equivalência */}
          <div className="rounded-2xl border border-[#4f7fff20] bg-[#4f7fff08] px-5 py-4 text-center">
            <p className="text-2xl font-extrabold text-[#4f7fff]">{salarios}×</p>
            <p className="text-xs text-[#7b809a]">salários mínimos por mês</p>
          </div>

          <Link
            href="/dashboard/criar"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#2554e0] py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(79,127,255,0.3)] transition hover:shadow-[0_0_32px_rgba(79,127,255,0.5)]"
          >
            Criar meu ebook agora
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
