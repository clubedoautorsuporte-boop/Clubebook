'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, TrendingUp, Gem, Plus,
  Upload, Library, ArrowRight, Info,
  PenLine, Sparkles, Clock, BarChart2,
  BookMarked, FileText, ChevronRight,
  Star, Zap, Target, Award,
} from 'lucide-react'
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts'

// ── Types ──────────────────────────────────────────────────────────────────
type EbookRow = {
  slug: string; titulo: string; subtitulo: string
  capitulosCount: number; createdAt: string; expired: boolean; tipo: string
}
type DraftRow = {
  id: string; titulo: string; genero: string
  nomeAutor: string; step: number; updatedAt: string
}
type ChartPoint = { date: string; livros: number; previews: number; rascunhos: number; total: number }
type RecentItem = { label: string; tipo: 'livro' | 'preview' | 'rascunho'; time: string }

const STEP_LABEL: Record<number, string> = {
  1: 'Início',
  2: 'Gênero',
  3: 'Personagens',
  4: 'Enredo',
  5: 'Capítulos',
  6: 'Revisão',
  7: 'Finalização',
}

const GENERO_COLOR: Record<string, string> = {
  Romance:   '#f472b6',
  Ficção:    '#4f7fff',
  Fantasia:  '#a855f7',
  Terror:    '#ef4444',
  Negócios:  '#00e5c3',
  Autoajuda: '#f97316',
  Infantil:  '#facc15',
}

// ── Fade wrapper ───────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ── Book cover placeholder ────────────────────────────────────────────────
function BookCover({ titulo, genero, color }: { titulo: string; genero?: string; color: string }) {
  const initials = titulo.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: `linear-gradient(160deg, rgba(255,255,255,0.04) 0%, ${color}22 100%)`,
        border: `1px solid ${color}30`,
      }}>
      <div className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at 30% 30%, ${color}18 0%, transparent 60%)` }} />
      {/* Linhas decorativas de páginas */}
      <div className="absolute inset-0 flex flex-col justify-center px-3 gap-1 opacity-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-px w-full rounded-full" style={{ background: color }} />
        ))}
      </div>
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black"
          style={{ background: `${color}22`, border: `2px solid ${color}40`, color }}>
          {initials}
        </div>
        {genero && (
          <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}>
            {genero}
          </span>
        )}
      </div>
      {/* Lombada */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
        style={{ background: `linear-gradient(180deg, ${color} 0%, ${color}66 100%)` }} />
    </div>
  )
}

// ── Draft progress bar ─────────────────────────────────────────────────────
function StepBar({ step }: { step: number }) {
  const total = 7
  const pct = Math.round((step / total) * 100)
  const color = pct >= 80 ? '#00e5c3' : pct >= 50 ? '#4f7fff' : '#f97316'
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold" style={{ color }}>{STEP_LABEL[step] ?? `Etapa ${step}`}</span>
        <span className="text-[10px] font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1 w-full rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}cc, ${color})`, boxShadow: `0 0 8px ${color}60` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}

// ── Chart tooltip ──────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl p-3 shadow-2xl text-xs"
      style={{ background: 'rgba(8,12,32,0.97)', border: '1px solid rgba(79,127,255,0.2)', backdropFilter: 'blur(16px)' }}>
      <p className="font-bold text-white mb-2">{label}</p>
      {payload.map((p: { name: string; value: number; color: string }) => (
        <div key={p.name} className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color, boxShadow: `0 0 6px ${p.color}` }} />
            <span style={{ color: p.color }}>{p.name}</span>
          </div>
          <span className="font-bold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

// ── Action card ────────────────────────────────────────────────────────────
function ActionCard({ icon: Icon, color, bg, label, desc, href, badge }: {
  icon: React.ElementType; color: string; bg: string; label: string
  desc: string; href: string; badge?: string
}) {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.015 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
      <Link href={href}
        className="group relative flex flex-col gap-4 rounded-2xl p-5 h-full overflow-hidden transition-all"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `radial-gradient(circle at 30% 40%, ${color}08, transparent 60%)` }} />
        {badge && (
          <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}>
            {badge}
          </span>
        )}
        <div className="grid h-11 w-11 place-items-center rounded-xl transition-transform group-hover:scale-110"
          style={{ background: bg, border: `1px solid ${color}25` }}>
          <Icon className="size-5" style={{ color }} />
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-bold text-white mb-1">{label}</p>
          <p className="text-[11px] text-[#5a6a84] leading-relaxed">{desc}</p>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold transition-all group-hover:gap-2"
          style={{ color }}>
          Acessar <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  )
}

// ── Project card (draft) ────────────────────────────────────────────────────
function DraftCard({ draft }: { draft: DraftRow }) {
  const color = GENERO_COLOR[draft.genero] ?? '#4f7fff'
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      className="group relative flex flex-col rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Cover */}
      <div className="relative h-44 p-4">
        <BookCover titulo={draft.titulo} genero={draft.genero} color={color} />
      </div>
      {/* Info */}
      <div className="flex flex-col gap-3 p-4 pt-2">
        <div>
          <p className="text-[13px] font-bold text-white leading-snug line-clamp-2">{draft.titulo}</p>
          <p className="text-[10px] text-[#5a6a84] mt-0.5 flex items-center gap-1">
            <Clock className="size-3" />
            Por {draft.nomeAutor}
          </p>
        </div>
        <StepBar step={draft.step} />
        <Link href={`/dashboard/criar?draft=${draft.id}`}
          className="flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
          style={{ background: `linear-gradient(135deg, ${color}cc, ${color})`, boxShadow: `0 4px 16px ${color}30` }}>
          Continuar <ChevronRight className="size-3.5" />
        </Link>
      </div>
    </motion.div>
  )
}

// ── Published book card ─────────────────────────────────────────────────────
function BookCard({ row }: { row: EbookRow }) {
  const color = row.tipo === 'livro' ? '#00e5c3' : '#4f7fff'
  const isComplete = row.tipo === 'livro'
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      className="group relative flex flex-col rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Badge */}
      {isComplete && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest"
          style={{ background: 'rgba(0,229,195,0.15)', color: '#00e5c3', border: '1px solid rgba(0,229,195,0.3)' }}>
          <Star className="size-2.5" fill="#00e5c3" /> Completo
        </div>
      )}
      {/* Cover */}
      <div className="relative h-44 p-4">
        <BookCover titulo={row.titulo} color={color} />
      </div>
      {/* Info */}
      <div className="flex flex-col gap-3 p-4 pt-2">
        <div>
          <p className="text-[13px] font-bold text-white leading-snug line-clamp-2">{row.titulo}</p>
          {row.subtitulo && (
            <p className="text-[10px] text-[#5a6a84] mt-0.5 line-clamp-1">{row.subtitulo}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>
            {row.capitulosCount} cap.
          </span>
          {row.expired && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              Expirado
            </span>
          )}
        </div>
        <Link href={`/dashboard/biblioteca/${row.slug}`}
          className="flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
          style={{ background: `linear-gradient(135deg, ${color}cc, ${color})`, boxShadow: `0 4px 16px ${color}30` }}>
          Ver livro <ChevronRight className="size-3.5" />
        </Link>
      </div>
    </motion.div>
  )
}

// ── Stat pill ──────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: string; color: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl p-4"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
        style={{ background: `${color}14`, border: `1px solid ${color}20` }}>
        <Icon className="size-4" style={{ color }} />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5a6a84]">{label}</p>
        <p className="text-[20px] font-black text-white leading-none tracking-tight">{value}</p>
      </div>
    </div>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────
function EmptyProjects() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="col-span-full flex flex-col items-center gap-5 rounded-2xl p-12 text-center"
      style={{ background: 'rgba(79,127,255,0.04)', border: '1px dashed rgba(79,127,255,0.2)' }}>
      <div className="grid h-16 w-16 place-items-center rounded-2xl"
        style={{ background: 'rgba(79,127,255,0.1)', border: '1px solid rgba(79,127,255,0.2)' }}>
        <BookOpen className="size-7 text-[#4f7fff]" />
      </div>
      <div>
        <p className="text-[15px] font-bold text-white mb-1">Nenhum projeto ainda</p>
        <p className="text-[12px] text-[#5a6a84]">Comece criando seu primeiro livro com a IA da Aurora</p>
      </div>
      <Link href="/dashboard/criar"
        className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-[13px] font-bold text-white transition-all hover:scale-105"
        style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)', boxShadow: '0 6px 24px rgba(79,127,255,0.4)' }}>
        <Plus className="size-4" /> Criar primeiro livro
      </Link>
    </motion.div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────
export function DashboardClient({ rows, drafts, credits, chartData, recentActivity }: {
  rows: EbookRow[]
  drafts: DraftRow[]
  credits: number
  chartData: ChartPoint[]
  recentActivity: RecentItem[]
}) {
  const totalLivros   = rows.filter(r => r.tipo === 'livro').length
  const totalPreviews = rows.filter(r => r.tipo !== 'livro').length
  const totalProjetos = rows.length + drafts.length
  const hasChart      = chartData.some(p => p.total > 0)

  // Livro em rascunho mais avançado (para o banner CTA)
  const topDraft = drafts.length > 0
    ? drafts.reduce((best, d) => d.step > best.step ? d : best, drafts[0])
    : null

  return (
    <div className="flex min-h-full">

      {/* ── MAIN ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-6 p-6">

        {/* ── Cabeçalho da página ─────────────────────────────────────── */}
        <FadeUp delay={0.02}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[22px] font-black text-white tracking-tight">Meus Projetos</h1>
              <p className="text-[13px] text-[#5a6a84] mt-0.5">
                Continue de onde parou ou comece uma nova história.{' '}
                {totalProjetos > 0 && (
                  <span className="text-[#4f7fff] font-semibold">({totalProjetos} {totalProjetos === 1 ? 'projeto' : 'projetos'})</span>
                )}
              </p>
            </div>
            <Link href="/dashboard/criar"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white transition-all hover:scale-105 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#f97316,#facc15)', boxShadow: '0 6px 20px rgba(249,115,22,0.4)' }}>
              <Plus className="size-4" /> Criar Novo Livro
            </Link>
          </div>
        </FadeUp>

        {/* ── Banner CTA (se tiver rascunho avançado) ─────────────────── */}
        {topDraft && (
          <FadeUp delay={0.06}>
            <div className="relative overflow-hidden rounded-2xl p-6 flex items-center gap-6"
              style={{
                background: 'linear-gradient(135deg, #0a0f2e 0%, #111836 40%, #0d0a28 100%)',
                border: '1px solid rgba(79,127,255,0.2)',
              }}>
              {/* Orbs */}
              <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full opacity-25"
                style={{ background: 'radial-gradient(circle,#4f7fff,transparent 65%)' }} />
              <div className="pointer-events-none absolute right-24 -bottom-8 h-40 w-40 rounded-full opacity-15"
                style={{ background: 'radial-gradient(circle,#a855f7,transparent 65%)' }} />
              {/* Stars */}
              {[{t:'12%',l:'42%'},{t:'68%',l:'55%'},{t:'25%',l:'70%'}].map((d,i)=>(
                <div key={i} className="pointer-events-none absolute text-[#a855f7] opacity-50 text-xs">✦</div>
              ))}

              <div className="relative z-10 flex-1">
                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-3"
                  style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)' }}>
                  <Sparkles className="size-3" />
                  {STEP_LABEL[topDraft.step] ?? 'Em andamento'} · Falta finalizar
                </div>
                <h2 className="text-[20px] font-black text-white leading-tight mb-1">
                  Seu livro{' '}
                  <span style={{ background: 'linear-gradient(90deg,#f97316,#facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    &ldquo;{topDraft.titulo}&rdquo;
                  </span>{' '}
                  está pronto pra nascer
                </h2>
                <p className="text-[12px] text-[#6a7a96] mb-4">
                  O planejamento já foi entregue. Agora a Aurora escreve cada capítulo por você — por apenas{' '}
                  <strong className="text-white">R$ 49,99</strong>, pagamento único.
                </p>
                <Link href={`/dashboard/criar?draft=${topDraft.id}`}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-[#0a0f1e] transition-all hover:scale-105 hover:opacity-95"
                  style={{ background: 'linear-gradient(135deg,#f97316,#facc15)', boxShadow: '0 6px 24px rgba(249,115,22,0.45)' }}>
                  Gerar meu livro completo <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="hidden lg:block shrink-0">
                <div className="w-28 h-36 rounded-xl overflow-hidden relative"
                  style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(249,115,22,0.2)' }}>
                  <BookCover titulo={topDraft.titulo} genero={topDraft.genero} color="#f97316" />
                </div>
              </div>
            </div>
          </FadeUp>
        )}

        {/* ── 3 Action cards ───────────────────────────────────────────── */}
        <FadeUp delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ActionCard
              icon={Plus}
              color="#4f7fff"
              bg="rgba(79,127,255,0.12)"
              label="Criar novo livro"
              desc="A Aurora ajuda você a começar do zero com IA"
              href="/dashboard/criar"
            />
            <ActionCard
              icon={FileText}
              color="#00e5c3"
              bg="rgba(0,229,195,0.12)"
              label="Importar Rascunhos"
              desc="Mande rascunhos, ideias, PDFs — a Aurora transforma em livro"
              href="/dashboard/criar"
              badge="Em breve"
            />
            <ActionCard
              icon={BookMarked}
              color="#a855f7"
              bg="rgba(168,85,247,0.12)"
              label="Importar Livro Pronto"
              desc="Já escreveu? Traga e use capa, audiobook e publicação"
              href="/dashboard/biblioteca"
              badge="Em breve"
            />
          </div>
        </FadeUp>

        {/* ── Grade de projetos ─────────────────────────────────────────── */}
        <FadeUp delay={0.16}>
          <div>
            {(drafts.length > 0 || rows.length > 0) && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-[15px] font-bold text-white">Meus livros</h2>
                  <div className="flex items-center gap-2">
                    {drafts.length > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316', border: '1px solid rgba(249,115,22,0.2)' }}>
                        {drafts.length} em criação
                      </span>
                    )}
                    {rows.length > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(0,229,195,0.12)', color: '#00e5c3', border: '1px solid rgba(0,229,195,0.2)' }}>
                        {rows.length} gerado{rows.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                {rows.length > 0 && (
                  <Link href="/dashboard/biblioteca" className="text-[12px] font-semibold text-[#4f7fff] hover:underline flex items-center gap-1">
                    Ver biblioteca <ChevronRight className="size-3.5" />
                  </Link>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {drafts.map((d, i) => (
                <motion.div key={d.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + i * 0.06 }}>
                  <DraftCard draft={d} />
                </motion.div>
              ))}
              {rows.map((r, i) => (
                <motion.div key={r.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + (drafts.length + i) * 0.06 }}>
                  <BookCard row={r} />
                </motion.div>
              ))}
              {totalProjetos === 0 && <EmptyProjects />}
            </div>
          </div>
        </FadeUp>

        {/* ── Gráfico de atividade ──────────────────────────────────────── */}
        <FadeUp delay={0.28}>
          <div className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[15px] font-bold text-white">Atividade de Criação</h3>
                <p className="text-[11px] text-[#5a6a84] mt-0.5">Projetos criados nos últimos 6 meses</p>
              </div>
              <div className="flex items-center gap-4">
                {[{ c: '#00e5c3', l: 'Livros' }, { c: '#4f7fff', l: 'Prévias' }, { c: '#a855f7', l: 'Rascunhos' }].map(({ c, l }) => (
                  <div key={l} className="flex items-center gap-1.5 text-[11px] text-[#6a7a96]">
                    <span className="h-2 w-2 rounded-full" style={{ background: c, boxShadow: `0 0 5px ${c}` }} />
                    {l}
                  </div>
                ))}
              </div>
            </div>

            {hasChart ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#5a6a84', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#5a6a84', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTip />} cursor={{ stroke: 'rgba(79,127,255,0.15)', strokeWidth: 1 }} />
                  <Legend wrapperStyle={{ display: 'none' }} />
                  <Line type="monotone" dataKey="livros"    stroke="#00e5c3" strokeWidth={2.5} name="Livros"    dot={{ fill: '#00e5c3', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="previews"  stroke="#4f7fff" strokeWidth={2.5} name="Prévias"   dot={{ fill: '#4f7fff', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="rascunhos" stroke="#a855f7" strokeWidth={2.5} name="Rascunhos" dot={{ fill: '#a855f7', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <BarChart2 className="size-8 text-[#1c2a44]" />
                <p className="text-[12px] text-[#3a4a66]">Nenhuma atividade ainda — comece criando um livro</p>
              </div>
            )}
          </div>
        </FadeUp>

      </div>

      {/* ── RIGHT SIDEBAR ── */}
      <div className="hidden lg:flex flex-col gap-4 w-[270px] shrink-0 p-6 pl-0">

        {/* Créditos */}
        <FadeUp delay={0.06}>
          <div className="relative overflow-hidden rounded-2xl p-5"
            style={{
              background: 'linear-gradient(160deg,#0d0a28 0%,#150a38 100%)',
              border: '1px solid rgba(168,85,247,0.2)',
            }}>
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle,#a855f7,transparent)' }} />
            <div className="pointer-events-none absolute left-0 bottom-0 h-24 w-24 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle,#4f7fff,transparent)' }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="grid h-7 w-7 place-items-center rounded-lg"
                    style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.25)' }}>
                    <Gem className="size-3.5 text-[#a855f7]" />
                  </div>
                  <p className="text-[13px] font-bold text-white">Saldo</p>
                </div>
                <Info className="size-4 text-[#3a4a66]" />
              </div>

              <p className="text-[38px] font-black text-white leading-none tabular-nums mb-1"
                style={{ textShadow: '0 0 30px rgba(168,85,247,0.35)' }}>
                {credits.toLocaleString('pt-BR')}
              </p>
              <p className="text-[11px] text-[#6a7a96]">créditos disponíveis</p>
              <p className="text-[11px] text-[#a855f7] font-semibold mb-5">
                ≈ R$ {(credits / 100).toFixed(2)} em serviços
              </p>

              {/* Mini usage bar */}
              <div className="mb-5">
                <div className="flex justify-between text-[10px] text-[#5a6a84] mb-1.5">
                  <span>Uso estimado</span>
                  <span>{Math.max(0, 100 - Math.min(100, Math.round(credits / 10)))}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/5">
                  <div className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round(credits / 10))}%`,
                      background: 'linear-gradient(90deg,#4f7fff,#a855f7)',
                      boxShadow: '0 0 8px rgba(168,85,247,0.5)',
                    }} />
                </div>
              </div>

              <Link href="/dashboard/creditos"
                className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-bold text-white transition-all hover:scale-[1.02] hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)', boxShadow: '0 6px 20px rgba(79,127,255,0.3)' }}>
                Comprar créditos <Gem className="size-3.5" />
              </Link>
            </div>
          </div>
        </FadeUp>

        {/* Stats rápidas */}
        <FadeUp delay={0.14}>
          <div className="grid grid-cols-2 gap-3">
            <StatPill icon={BookOpen} label="Livros" value={String(totalLivros)} color="#00e5c3" />
            <StatPill icon={PenLine} label="Em criação" value={String(drafts.length)} color="#f97316" />
            <StatPill icon={Library} label="Prévias" value={String(totalPreviews)} color="#4f7fff" />
            <StatPill icon={Target} label="Projetos" value={String(totalProjetos)} color="#a855f7" />
          </div>
        </FadeUp>

        {/* Atividades recentes */}
        {recentActivity.length > 0 && (
          <FadeUp delay={0.22}>
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-[13px] font-bold text-white mb-4">Atividade recente</p>
              <div className="flex flex-col gap-3">
                {recentActivity.map(({ label, tipo, time }, idx) => {
                  const color = tipo === 'livro' ? '#00e5c3' : tipo === 'rascunho' ? '#f97316' : '#4f7fff'
                  const Icon = tipo === 'rascunho' ? PenLine : BookOpen
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                        style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                        <Icon className="size-3" style={{ color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold text-white truncate">{label || 'Sem título'}</p>
                        <p className="text-[10px] text-[#5a6a84] mt-0.5 flex items-center gap-1">
                          <Clock className="size-2.5" /> {time}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeUp>
        )}

        {/* Dica / Motivação */}
        <FadeUp delay={0.3}>
          <div className="relative overflow-hidden rounded-2xl p-5"
            style={{
              background: 'linear-gradient(135deg,rgba(249,115,22,0.07),rgba(250,204,21,0.05))',
              border: '1px solid rgba(249,115,22,0.18)',
            }}>
            <div className="pointer-events-none absolute -right-4 -bottom-4 h-20 w-20 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle,#f97316,transparent)' }} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="grid h-7 w-7 place-items-center rounded-lg"
                  style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.25)' }}>
                  <Zap className="size-3.5 text-[#f97316]" />
                </div>
                <p className="text-[12px] font-bold text-white">Dica do dia</p>
              </div>
              <p className="text-[11px] text-[#8896b0] leading-relaxed italic">
                &ldquo;A consistência é o segredo para o sucesso a longo prazo. Continue criando!&rdquo;
              </p>
            </div>
          </div>
        </FadeUp>

        {/* CTA criar — só se não tiver projetos */}
        {totalProjetos === 0 && (
          <FadeUp delay={0.36}>
            <div className="relative overflow-hidden rounded-2xl p-5"
              style={{
                background: 'linear-gradient(135deg,rgba(79,127,255,0.08),rgba(168,85,247,0.08))',
                border: '1px solid rgba(79,127,255,0.2)',
              }}>
              <div className="flex items-center gap-2 mb-2">
                <Award className="size-4 text-[#4f7fff]" />
                <p className="text-[13px] font-bold text-white">Comece agora!</p>
              </div>
              <p className="text-[11px] text-[#6a7a96] mb-3 leading-relaxed">
                Crie seu primeiro livro e veja seus dados aparecerem aqui.
              </p>
              <Link href="/dashboard/criar"
                className="flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}>
                <Plus className="size-3.5" /> Criar agora
              </Link>
            </div>
          </FadeUp>
        )}

      </div>
    </div>
  )
}
