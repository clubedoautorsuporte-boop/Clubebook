'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, BookOpen, ExternalLink, Clock,
  Globe2, Download, ArrowRight, Percent,
  Store, Library, Plus, Wallet, Timer,
  ListOrdered, BarChart2, QrCode, AlertCircle,
  Zap, Users, BadgeDollarSign,
} from 'lucide-react'

// ── Tipos de tab ──────────────────────────────────────────────────────────
type Tab = 'visao' | 'livros' | 'divulgar' | 'financeiro'

const TABS: { id: Tab; label: string; sub: string; icon: React.ElementType }[] = [
  { id: 'visao',      label: 'Visão geral',    sub: 'Saldo e vendas',   icon: BarChart2       },
  { id: 'livros',     label: 'Meus livros',    sub: 'Vender e afiliação', icon: BookOpen       },
  { id: 'divulgar',   label: 'Divulgar & Ganhar', sub: 'Ganhe comissão', icon: Users          },
  { id: 'financeiro', label: 'Financeiro',     sub: 'Saques e IR',      icon: BadgeDollarSign },
]

const QUICK_LINKS = [
  { icon: Percent,  label: 'Cupons',         sub: 'Crie descontos',    href: '#', color: '#4f7fff' },
  { icon: Store,    label: 'Vitrine pública', sub: 'Como leitores veem', href: '#', color: '#00e5c3' },
  { icon: Library,  label: 'Biblioteca',     sub: 'Livros que comprei', href: '/dashboard/biblioteca', color: '#a855f7' },
  { icon: Plus,     label: 'Meus livros',    sub: 'Editar / publicar',  href: '/dashboard/biblioteca', color: '#f97316' },
]

const PLATFORMS = [
  { name: 'Hotmart',    commission: '70%', color: '#f97316', desc: 'Líder em infoprodutos no Brasil', url: 'https://hotmart.com' },
  { name: 'Eduzz',      commission: '70%', color: '#4f7fff', desc: 'Checkout e membros integrados',   url: 'https://eduzz.com' },
  { name: 'Amazon KDP', commission: '35%', color: '#a855f7', desc: 'Maior livraria digital do mundo', url: 'https://kdp.amazon.com' },
  { name: 'Gumroad',    commission: '91%', color: '#ec4899', desc: 'Pagamentos globais simples',      url: 'https://gumroad.com' },
]

// ── Gradientes por inicial ─────────────────────────────────────────────────
const GRADS: [string,string][] = [
  ['#1e3a5f','#2563eb'],['#0f4c3a','#10b981'],['#3b1f6b','#8b5cf6'],
  ['#7c2d12','#f97316'],['#1e3a5f','#0ea5e9'],['#14532d','#22c55e'],
]
function titleGrad(t: string): [string,string] {
  let h = 0; for (let i=0;i<t.length;i++) h=t.charCodeAt(i)+((h<<5)-h)
  return GRADS[Math.abs(h)%GRADS.length]
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'})
}

// ── Card de saldo ─────────────────────────────────────────────────────────
function BalanceCard({ icon: Icon, label, value, sub, color, accent }: {
  icon: React.ElementType; label: string; value: string; sub: string; color: string; accent: string
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="relative overflow-hidden rounded-2xl p-4"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}
    >
      <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-15"
        style={{ background: `radial-gradient(circle,${accent},transparent)` }} />
      <div className="flex items-center gap-2 mb-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg"
          style={{ background: `${color}18`, border: `1px solid ${color}25` }}>
          <Icon className="size-4" style={{ color }} />
        </div>
        <p className="text-[12px] font-semibold text-[#6a7a96]">{label}</p>
      </div>
      <p className="text-[24px] font-black text-white leading-none mb-1">{value}</p>
      <p className="text-[11px] text-[#4a5a74]">{sub}</p>
    </motion.div>
  )
}

// ── Aba Visão Geral ───────────────────────────────────────────────────────
function TabVisao() {
  return (
    <div className="flex flex-col gap-5">
      {/* Saldos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <BalanceCard icon={Wallet}      label="Disponível pra saque" value="R$ 0,00" sub="Mín. R$ 100,00"          color="#00e5c3" accent="#00e5c3" />
        <BalanceCard icon={Timer}       label="Pendente (30d)"        value="R$ 0,00" sub="Janela antichargeback"   color="#f59e0b" accent="#f59e0b" />
        <BalanceCard icon={ListOrdered} label="Em fila de saque"      value="R$ 0,00" sub="Aguardando aprovação"    color="#a855f7" accent="#a855f7" />
        <BalanceCard icon={TrendingUp}  label="Lifetime líquido"      value="R$ 0,00" sub="R$ 0,00 bruto"          color="#4f7fff" accent="#4f7fff" />
      </div>

      {/* Sacar via PIX */}
      <div className="relative overflow-hidden rounded-2xl px-6 py-5 flex items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg,rgba(0,229,195,0.08),rgba(79,127,255,0.08))', border: '1px solid rgba(0,229,195,0.2)' }}>
        <div className="pointer-events-none absolute -left-8 -bottom-8 h-40 w-40 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle,#00e5c3,transparent)' }} />
        <div className="relative z-10 flex items-center gap-4">
          <div className="grid h-11 w-11 place-items-center rounded-xl shrink-0"
            style={{ background: 'rgba(0,229,195,0.15)', border: '1px solid rgba(0,229,195,0.25)' }}>
            <QrCode className="size-5 text-[#00e5c3]" />
          </div>
          <div>
            <p className="text-[15px] font-bold text-white">Sacar via PIX</p>
            <p className="text-[12px] text-[#6a7a96] mt-0.5">
              Saldo mínimo: <span className="text-white font-semibold">R$ 100,00</span>. Continue vendendo!
            </p>
          </div>
        </div>
        <button
          disabled
          className="relative z-10 flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white/50 shrink-0 cursor-not-allowed"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          title="Saldo mínimo de R$ 100,00 necessário">
          <QrCode className="size-4" /> Sacar agora
        </button>
      </div>

      {/* Vendas dos últimos 30 dias */}
      <div className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-[15px] font-bold text-white">Vendas dos últimos 30 dias</h3>
            <p className="text-[12px] text-[#5a6a84] mt-0.5">Histórico de transações realizadas</p>
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-xl"
            style={{ background: 'rgba(79,127,255,0.1)', border: '1px solid rgba(79,127,255,0.2)' }}>
            <BarChart2 className="size-4 text-[#4f7fff]" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-14 gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <TrendingUp className="size-7 text-[#2a3a56]" />
          </div>
          <p className="text-[14px] font-semibold text-[#3a4a66]">Nenhuma venda no período</p>
          <p className="text-[12px] text-[#2a3a56]">Compartilhe seu link da loja e comece a vender!</p>
          <Link href="/dashboard/criar"
            className="mt-2 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white transition-all hover:scale-105 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)', boxShadow: '0 4px 16px rgba(79,127,255,0.3)' }}>
            Criar e publicar livro <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Aba Meus Livros ───────────────────────────────────────────────────────
function TabLivros({ ebooks }: { ebooks: { slug: string; titulo: string; subtitulo: string; capitulos: number; createdAt: string; expired: boolean }[] }) {
  const ativos = ebooks.filter(e => !e.expired)
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-bold text-white">Ebooks disponíveis para venda</h3>
          <p className="text-[12px] text-[#5a6a84] mt-0.5">{ativos.length > 0 ? `${ativos.length} livro${ativos.length>1?'s':''} disponível${ativos.length>1?'is':''}` : 'Nenhum livro ainda'}</p>
        </div>
        <Link href="/dashboard/criar"
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[12px] font-bold text-white transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)', boxShadow: '0 4px 14px rgba(79,127,255,0.3)' }}>
          <Zap className="size-3.5" /> Criar livro
        </Link>
      </div>

      {ativos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl py-16 gap-3"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
          <div className="grid h-16 w-16 place-items-center rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <BookOpen className="size-8 text-[#2a3a56]" />
          </div>
          <p className="text-[14px] font-semibold text-[#3a4a66]">Nenhum ebook disponível ainda</p>
          <p className="text-[12px] text-[#2a3a56]">Crie seu primeiro ebook para começar a vender</p>
          <Link href="/dashboard/criar"
            className="mt-2 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}>
            Criar agora <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ativos.map(eb => {
            const [from, to] = titleGrad(eb.titulo)
            return (
              <motion.div key={eb.slug} whileHover={{ y: -3 }}
                className="overflow-hidden rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="relative h-28 flex items-end justify-between p-3"
                  style={{ background: `linear-gradient(145deg,${from},${to})` }}>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-lg font-black text-white backdrop-blur-sm">
                    {eb.titulo.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">Disponível</span>
                    <span className="rounded-lg bg-black/30 px-1.5 py-0.5 text-[9px] text-white/80">{eb.capitulos} caps</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-1 text-[13px] font-bold text-white">{eb.titulo}</h3>
                  {eb.subtitulo && <p className="mt-0.5 line-clamp-1 text-[11px] text-[#6a7a96]">{eb.subtitulo}</p>}
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-[#4a5a74]">
                    <Clock className="size-3" /> {fmtDate(eb.createdAt)}
                  </div>
                  <p className="mt-3 mb-2 text-[9px] font-bold uppercase tracking-widest text-[#4a5a74]">Publicar em:</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PLATFORMS.map(p => (
                      <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[10px] transition hover:bg-white/[0.06]"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <span className="font-semibold text-[#c4d0e8]">{p.name}</span>
                        <span className="font-bold" style={{ color: '#00e5c3' }}>{p.commission}</span>
                      </a>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link href={`/receiver/${eb.slug}`}
                      className="flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-[11px] font-medium text-[#8896b0] transition hover:bg-white/[0.06] hover:text-white"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <ExternalLink className="size-3" /> Ver
                    </Link>
                    <a href={`/api/pdf/${eb.slug}`} download
                      className="flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-[11px] font-semibold text-white transition hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}>
                      <Download className="size-3" /> PDF
                    </a>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Onde vender */}
      <div>
        <h3 className="text-[15px] font-bold text-white mb-3">Onde vender seu ebook</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {PLATFORMS.map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                style={{ background: `${p.color}15`, border: `1px solid ${p.color}25` }}>
                <Globe2 className="size-5" style={{ color: p.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white">{p.name}</p>
                <p className="text-[11px] text-[#5a6a84] mt-0.5">{p.desc}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[15px] font-black text-[#00e5c3]">{p.commission}</p>
                <p className="text-[10px] text-[#4a5a74]">comissão</p>
              </div>
              <ExternalLink className="size-4 text-[#3a4a66] transition group-hover:text-[#4f7fff]" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Aba Divulgar & Ganhar ─────────────────────────────────────────────────
function TabDivulgar() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="grid h-16 w-16 place-items-center rounded-2xl"
        style={{ background: 'linear-gradient(135deg,rgba(0,229,195,0.15),rgba(79,127,255,0.15))', border: '1px solid rgba(0,229,195,0.2)' }}>
        <Users className="size-8 text-[#00e5c3]" />
      </div>
      <p className="text-[16px] font-bold text-white">Em breve</p>
      <p className="text-[13px] text-[#5a6a84] text-center max-w-xs">
        O programa de afiliados e divulgação estará disponível em breve. Fique ligado!
      </p>
    </div>
  )
}

// ── Aba Financeiro ────────────────────────────────────────────────────────
function TabFinanceiro() {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl p-5 flex items-start gap-4"
        style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <AlertCircle className="size-5 text-[#f59e0b] shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-bold text-white">Nenhuma movimentação financeira</p>
          <p className="text-[12px] text-[#6a7a96] mt-0.5">
            Seus extratos, notas fiscais e dados para declaração de IR aparecerão aqui após as primeiras vendas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total recebido', value: 'R$ 0,00', icon: TrendingUp, color: '#00e5c3' },
          { label: 'Total sacado',   value: 'R$ 0,00', icon: Wallet,     color: '#4f7fff' },
          { label: 'A declarar IR',  value: 'R$ 0,00', icon: BadgeDollarSign, color: '#a855f7' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl p-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="grid h-8 w-8 place-items-center rounded-lg mb-3"
              style={{ background: `${color}15`, border: `1px solid ${color}20` }}>
              <Icon className="size-4" style={{ color }} />
            </div>
            <p className="text-[11px] text-[#5a6a84] mb-1">{label}</p>
            <p className="text-[22px] font-black text-white">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Fade wrapper ──────────────────────────────────────────────────────────
function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      key={Math.random()}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

// ── Page — client (usa tabs) ──────────────────────────────────────────────
// Dados passados via props (RSC chama um wrapper)
export default function VendasClientPage({ ebooks }: {
  ebooks: { slug: string; titulo: string; subtitulo: string; capitulos: number; createdAt: string; expired: boolean }[]
}) {
  const [tab, setTab] = useState<Tab>('visao')

  return (
    <div className="min-h-full px-5 pt-6 pb-16 md:px-6 flex flex-col gap-5">

      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-xl blur-lg opacity-60"
            style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }} />
          <div className="relative grid h-11 w-11 place-items-center rounded-xl"
            style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)', boxShadow: '0 4px 16px rgba(79,127,255,0.4)' }}>
            <TrendingUp className="size-5 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-[18px] font-bold text-white leading-tight">
            Painel do autor — Loja Clube do Autor
            <span className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold align-middle"
              style={{ background: 'rgba(79,127,255,0.2)', color: '#4f7fff', border: '1px solid rgba(79,127,255,0.3)' }}>
              BETA
            </span>
          </h1>
          <p className="text-[12px] text-[#5a6a84]">Vendas, saldo e saques PIX</p>
        </div>
      </div>

      {/* Tabs principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {TABS.map(({ id, label, sub, icon: Icon }) => {
          const active = tab === id
          return (
            <motion.button
              key={id}
              onClick={() => setTab(id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all"
              style={active ? {
                background: 'linear-gradient(135deg,#4f7fff,#a855f7)',
                boxShadow: '0 6px 20px rgba(79,127,255,0.35)',
                border: '1px solid transparent',
              } : {
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${active ? 'bg-white/20' : ''}`}
                style={!active ? { background: 'rgba(255,255,255,0.06)' } : {}}>
                <Icon className={`size-4 ${active ? 'text-white' : 'text-[#6a7a96]'}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-[13px] font-bold leading-tight ${active ? 'text-white' : 'text-[#c4d0e8]'}`}>{label}</p>
                <p className={`text-[10px] ${active ? 'text-white/70' : 'text-[#5a6a84]'}`}>{sub}</p>
              </div>
              {active && (
                <motion.div
                  layoutId="tab-glow"
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0))' }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {QUICK_LINKS.map(({ icon: Icon, label, sub, href, color }) => (
          <Link key={label} href={href}
            className="group flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:-translate-y-0.5"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
              style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
              <Icon className="size-4" style={{ color }} />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-white truncate">{label}</p>
              <p className="text-[10px] text-[#4a5a74]">{sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <FadeIn key={tab}>
          {tab === 'visao'      && <TabVisao />}
          {tab === 'livros'     && <TabLivros ebooks={ebooks} />}
          {tab === 'divulgar'   && <TabDivulgar />}
          {tab === 'financeiro' && <TabFinanceiro />}
        </FadeIn>
      </AnimatePresence>

    </div>
  )
}
