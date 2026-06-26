'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Coins, BookOpen, FileText, Plus, Minus,
  SlidersHorizontal, CheckCircle2, AlertCircle, ExternalLink,
  Clock, User, Calendar,
} from 'lucide-react'
import type { UserFull } from './page'

type Op = 'add' | 'subtract' | 'set'

export default function UserDetailClient({ user: initial }: { user: UserFull }) {
  const [credits, setCredits] = useState(initial.credits)
  const [op, setOp] = useState<Op>('add')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)

  async function applyCredits() {
    const n = parseInt(amount, 10)
    if (isNaN(n) || n < 0) { setFeedback({ ok: false, msg: 'Valor inválido' }); return }
    setLoading(true)
    setFeedback(null)
    const res = await fetch('/api/admmaster/credits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: initial.id, operation: op, amount: n }),
    })
    const data = await res.json()
    if (res.ok) {
      setCredits(data.user.credits)
      setAmount('')
      setFeedback({
        ok: true,
        msg: `Créditos ${op === 'add' ? 'adicionados' : op === 'subtract' ? 'removidos' : 'definidos'}: ${data.user.credits.toLocaleString('pt-BR')} créditos`,
      })
    } else {
      setFeedback({ ok: false, msg: data.error ?? 'Erro' })
    }
    setLoading(false)
  }

  const PRESETS = [100, 500, 1000, 5000]

  return (
    <div className="p-6 md:p-8 max-w-5xl">

      {/* Back */}
      <Link href="/admmaster/users" className="mb-6 flex items-center gap-1.5 text-[12px] text-[#4a5578] hover:text-purple-400 transition-colors">
        <ArrowLeft className="size-3.5" /> Voltar para usuários
      </Link>

      {/* User header */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-[#1a2035] bg-[#0d1120] p-5">
        {initial.image
          ? <img src={initial.image} alt="" className="h-16 w-16 rounded-2xl object-cover" />
          : <div className="grid h-16 w-16 place-items-center rounded-2xl bg-purple-600/20 text-2xl font-bold text-purple-300">
              {(initial.name ?? initial.email ?? '?')[0].toUpperCase()}
            </div>
        }
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold text-white">{initial.name ?? 'Sem nome'}</h1>
          <p className="text-sm text-[#4a5578] flex items-center gap-1.5 mt-0.5">
            <User className="size-3" /> {initial.email}
          </p>
          <p className="text-[11px] text-[#2e3a55] flex items-center gap-1.5 mt-1">
            <Calendar className="size-3" /> Entrou em {new Date(initial.createdAt).toLocaleDateString('pt-BR', { dateStyle: 'long' })}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Créditos', value: credits.toLocaleString('pt-BR'), color: 'text-amber-400', icon: Coins },
            { label: 'Ebooks', value: initial.deliveries.length, color: 'text-[#00e5c3]', icon: BookOpen },
            { label: 'Rascunhos', value: initial.drafts.length, color: 'text-blue-400', icon: FileText },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-[#1a2035] bg-[#080c1a] px-4 py-3 text-center">
              <Icon className={`size-4 mx-auto mb-1 ${color}`} />
              <p className={`text-lg font-extrabold ${color}`}>{value}</p>
              <p className="text-[10px] text-[#2e3a55]">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">

        {/* Coluna esquerda: gestão de créditos */}
        <div className="lg:col-span-2 space-y-4">

          {/* Credit Management */}
          <div className="rounded-2xl border border-[#1a2035] bg-[#0d1120] p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
              <Coins className="size-4 text-amber-400" /> Gerenciar Créditos
            </h2>

            {/* Saldo atual */}
            <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-center">
              <p className="text-[10px] text-[#4a5578] mb-1">Saldo atual</p>
              <p className="text-3xl font-extrabold text-amber-400">{credits.toLocaleString('pt-BR')}</p>
              <p className="text-[10px] text-[#4a5578]">créditos</p>
            </div>

            {/* Operação */}
            <div className="mb-3 grid grid-cols-3 gap-1.5 rounded-xl border border-[#1a2035] bg-[#080c1a] p-1">
              {([['add','Adicionar',Plus],['subtract','Remover',Minus],['set','Definir',SlidersHorizontal]] as [Op,string,typeof Plus][]).map(([v, l, Icon]) => (
                <button
                  key={v}
                  onClick={() => setOp(v)}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-semibold transition-all ${
                    op === v
                      ? v === 'add' ? 'bg-[#00e5c3] text-black'
                        : v === 'subtract' ? 'bg-red-500 text-white'
                        : 'bg-purple-600 text-white'
                      : 'text-[#4a5578] hover:text-white'
                  }`}
                >
                  <Icon className="size-3" /> {l}
                </button>
              ))}
            </div>

            {/* Presets */}
            <div className="mb-3 grid grid-cols-4 gap-1.5">
              {PRESETS.map(p => (
                <button
                  key={p}
                  onClick={() => setAmount(String(p))}
                  className="rounded-lg border border-[#1a2035] bg-[#080c1a] py-1.5 text-[10px] font-bold text-[#4a5578] hover:text-white hover:border-purple-500/40 transition-all"
                >
                  {p.toLocaleString('pt-BR')}
                </button>
              ))}
            </div>

            {/* Input */}
            <input
              type="number"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Quantidade de créditos"
              className="mb-3 w-full rounded-xl border border-[#1a2035] bg-[#080c1a] px-4 py-2.5 text-sm text-white placeholder:text-[#2e3a55] focus:border-purple-500/50 focus:outline-none"
            />

            <button
              onClick={applyCredits}
              disabled={loading || !amount}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all disabled:opacity-40 ${
                op === 'add' ? 'bg-[#00e5c3] text-black hover:bg-[#00c9ad]'
                : op === 'subtract' ? 'bg-red-500 hover:bg-red-600'
                : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {loading
                ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                : op === 'add' ? <><Plus className="size-4" /> Adicionar créditos</>
                : op === 'subtract' ? <><Minus className="size-4" /> Remover créditos</>
                : <><SlidersHorizontal className="size-4" /> Definir créditos</>
              }
            </button>

            {feedback && (
              <div className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12px] ${
                feedback.ok
                  ? 'bg-[#00e5c3]/10 text-[#00e5c3] border border-[#00e5c3]/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {feedback.ok ? <CheckCircle2 className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}
                {feedback.msg}
              </div>
            )}
          </div>

          {/* Rascunhos */}
          {initial.drafts.length > 0 && (
            <div className="rounded-2xl border border-[#1a2035] bg-[#0d1120]">
              <div className="border-b border-[#1a2035] px-5 py-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="size-4 text-blue-400" /> Rascunhos ({initial.drafts.length})
                </h2>
              </div>
              <div className="divide-y divide-[#0a0e1a]">
                {initial.drafts.map(d => (
                  <div key={d.id} className="px-5 py-3">
                    <p className="text-[12px] font-semibold text-white truncate">{d.titulo}</p>
                    <div className="mt-1 flex items-center gap-3 text-[10px] text-[#2e3a55]">
                      <span>Etapa {d.step}/7</span>
                      {d.genero && <span>{d.genero}</span>}
                      <span className="flex items-center gap-1"><Clock className="size-2.5" />
                        {new Date(d.updatedAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Coluna direita: ebooks */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-[#1a2035] bg-[#0d1120]">
            <div className="border-b border-[#1a2035] px-5 py-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="size-4 text-[#00e5c3]" /> Ebooks Gerados ({initial.deliveries.length})
              </h2>
            </div>

            {initial.deliveries.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-[#2e3a55]">
                <BookOpen className="size-8 mb-2" />
                <p className="text-sm">Nenhum ebook gerado ainda</p>
              </div>
            )}

            <div className="divide-y divide-[#0a0e1a]">
              {initial.deliveries.map((d, i) => {
                const plan = d.planJson
                const expired = new Date(d.expiresAt) < new Date()
                const capCount = Array.isArray(plan.capitulos) ? plan.capitulos.length : 0

                // gradiente da capa baseado no índice
                const gradients = [
                  'from-blue-600 to-purple-600',
                  'from-teal-600 to-cyan-600',
                  'from-orange-600 to-red-600',
                  'from-green-600 to-teal-600',
                  'from-pink-600 to-purple-600',
                ]
                const grad = gradients[i % gradients.length]

                return (
                  <div key={d.id} className="flex items-center gap-4 px-5 py-4">
                    {/* Mini capa */}
                    <div className={`h-14 w-10 shrink-0 rounded-lg bg-gradient-to-br ${grad} flex items-center justify-center shadow-lg`}>
                      <BookOpen className="size-4 text-white/70" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold text-white">{plan.titulo ?? d.nomeAutor}</p>
                      {plan.subtitulo && (
                        <p className="truncate text-[11px] text-[#4a5578]">{plan.subtitulo}</p>
                      )}
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px]">
                        {capCount > 0 && (
                          <span className="rounded-full bg-[#080c1a] px-2 py-0.5 text-[#4a5578]">{capCount} cap.</span>
                        )}
                        <span className="flex items-center gap-1 text-[#2e3a55]">
                          <Clock className="size-2.5" />
                          {new Date(d.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                        {expired
                          ? <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-red-400">Expirado</span>
                          : <span className="rounded-full bg-[#00e5c3]/10 px-2 py-0.5 text-[#00e5c3]">Ativo</span>
                        }
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <a
                        href={`/receiver/${d.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-lg border border-[#1a2035] px-2.5 py-1.5 text-[11px] text-[#4a5578] hover:text-white hover:border-purple-500/40 transition-colors"
                      >
                        <ExternalLink className="size-3" /> Ver
                      </a>
                      <a
                        href={`/api/pdf/${d.slug}`}
                        download
                        className="flex items-center gap-1 rounded-lg bg-[#4f7fff] px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#3a6be0] transition-colors"
                      >
                        PDF
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
