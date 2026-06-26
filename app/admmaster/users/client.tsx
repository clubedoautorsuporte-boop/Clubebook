'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Users, Coins, BookOpen, FileText, ChevronRight, Loader2, Trash2, TriangleAlert } from 'lucide-react'
import type { UserRow } from './page'

const ADMIN_EMAIL = 'clubedoautor.suporte@gmail.com'

export default function UsersClient({ initialUsers, total }: { initialUsers: UserRow[]; total: number }) {
  const router = useRouter()
  const [users, setUsers] = useState<UserRow[]>(initialUsers)
  const [q, setQ] = useState('')
  const [totalCount, setTotalCount] = useState(total)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(Math.ceil(total / 20))
  const [isPending, startTransition] = useTransition()

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function search(query: string, pg = 1) {
    startTransition(async () => {
      const res = await fetch(`/api/admmaster/users?q=${encodeURIComponent(query)}&page=${pg}`)
      const data = await res.json()
      setUsers(data.users)
      setTotalCount(data.total)
      setPage(data.page)
      setPages(data.pages)
    })
  }

  function handleQ(v: string) { setQ(v); search(v, 1) }
  function handlePage(pg: number) { search(q, pg) }

  function openDelete(e: React.MouseEvent, u: UserRow) {
    e.preventDefault()
    e.stopPropagation()
    setDeleteTarget(u)
    setDeleteConfirm('')
    setDeleteError('')
  }

  async function confirmDelete() {
    if (!deleteTarget || deleteConfirm !== 'DELETAR') return
    setDeleting(true)
    setDeleteError('')
    const res = await fetch(`/api/admmaster/users/${deleteTarget.id}`, { method: 'DELETE' })
    const data = await res.json()
    if (res.ok) {
      setUsers(prev => prev.filter(u => u.id !== deleteTarget.id))
      setTotalCount(prev => prev - 1)
      setDeleteTarget(null)
    } else {
      setDeleteError(data.error ?? 'Erro ao deletar')
    }
    setDeleting(false)
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl">

      {/* Modal de confirmação */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-[#0d1120] p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-500/15">
                <TriangleAlert className="size-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Deletar usuário</h2>
                <p className="text-[12px] text-[#4a5578]">Esta ação não pode ser desfeita</p>
              </div>
            </div>

            <div className="mb-4 rounded-xl border border-[#1a2035] bg-[#080c1a] p-3">
              <p className="text-[13px] font-semibold text-white">{deleteTarget.name ?? 'Sem nome'}</p>
              <p className="text-[11px] text-[#4a5578]">{deleteTarget.email}</p>
              <div className="mt-2 flex gap-3 text-[11px] text-[#2e3a55]">
                <span>{deleteTarget._count.deliveries} ebooks desvinculados</span>
                <span>{deleteTarget._count.drafts} rascunhos deletados</span>
              </div>
            </div>

            <p className="mb-2 text-[12px] text-[#4a5578]">
              Digite <span className="font-bold text-red-400">DELETAR</span> para confirmar:
            </p>
            <input
              autoFocus
              type="text"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && confirmDelete()}
              placeholder="DELETAR"
              className="mb-4 w-full rounded-xl border border-red-500/20 bg-[#080c1a] px-4 py-2.5 text-sm text-white placeholder:text-[#2e3a55] focus:border-red-500/50 focus:outline-none"
            />

            {deleteError && <p className="mb-3 text-[12px] text-red-400">{deleteError}</p>}

            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 rounded-xl border border-[#1a2035] bg-[#080c1a] py-2.5 text-sm font-medium text-[#4a5578] transition hover:text-white disabled:opacity-40"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteConfirm !== 'DELETAR' || deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleting
                  ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  : <><Trash2 className="size-4" /> Deletar</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Usuários</h1>
          <p className="mt-1 text-sm text-[#4a5578]">{totalCount} usuário{totalCount !== 1 ? 's' : ''} cadastrado{totalCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#2e3a55]" />
          <input
            type="text"
            value={q}
            onChange={e => handleQ(e.target.value)}
            placeholder="Buscar por nome ou email…"
            className="w-72 rounded-xl border border-[#1a2035] bg-[#0d1120] py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-[#2e3a55] focus:border-purple-500/50 focus:outline-none"
          />
          {isPending && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 animate-spin text-purple-400" />}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#1a2035] bg-[#0d1120] overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] gap-4 border-b border-[#1a2035] px-5 py-3 text-[10px] font-bold text-[#2e3a55] tracking-widest">
          <span>AVATAR</span>
          <span>USUÁRIO</span>
          <span className="text-right">CRÉDITOS</span>
          <span className="text-right">EBOOKS</span>
          <span className="text-right">RASC.</span>
          <span className="text-right">ENTROU</span>
          <span />
        </div>

        {users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[#2e3a55]">
            <Users className="size-8 mb-2" />
            <p className="text-sm">Nenhum usuário encontrado</p>
          </div>
        )}

        {users.map(u => (
          <Link
            key={u.id}
            href={`/admmaster/users/${u.id}`}
            className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] gap-4 items-center border-b border-[#0a0e1a] px-5 py-3 hover:bg-[#0f1525] transition-colors group"
          >
            {/* Avatar */}
            {u.image
              ? <img src={u.image} alt="" className="h-8 w-8 rounded-full object-cover" />
              : <div className="grid h-8 w-8 place-items-center rounded-full bg-purple-600/20 text-[11px] font-bold text-purple-300">
                  {(u.name ?? u.email ?? '?')[0].toUpperCase()}
                </div>
            }

            {/* Name + email */}
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-white">{u.name ?? <span className="text-[#4a5578]">Sem nome</span>}</p>
              <p className="truncate text-[11px] text-[#4a5578]">{u.email}</p>
            </div>

            {/* Credits */}
            <div className="flex items-center gap-1 justify-end">
              <Coins className="size-3 text-amber-400" />
              <span className="text-[12px] font-bold text-amber-400">{u.credits.toLocaleString('pt-BR')}</span>
            </div>

            {/* Ebooks */}
            <div className="flex items-center gap-1 justify-end">
              <BookOpen className="size-3 text-[#00e5c3]" />
              <span className="text-[12px] font-bold text-[#00e5c3]">{u._count.deliveries}</span>
            </div>

            {/* Drafts */}
            <div className="flex items-center gap-1 justify-end">
              <FileText className="size-3 text-blue-400" />
              <span className="text-[12px] text-blue-400">{u._count.drafts}</span>
            </div>

            {/* Date */}
            <div className="text-right">
              <span className="text-[10px] text-[#2e3a55]">
                {new Date(u.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
              </span>
            </div>

            {/* Delete + arrow */}
            <div className="flex items-center gap-1.5 justify-end">
              {u.email !== ADMIN_EMAIL && (
                <button
                  onClick={e => openDelete(e, u)}
                  className="grid h-7 w-7 place-items-center rounded-lg border border-transparent text-[#2e3a55] opacity-0 group-hover:opacity-100 hover:!border-red-500/40 hover:!text-red-400 hover:bg-red-500/10 transition-all"
                  title="Deletar usuário"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
              <ChevronRight className="size-3 text-[#2e3a55]" />
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).slice(
            Math.max(0, page - 3), Math.min(pages, page + 2)
          ).map(pg => (
            <button
              key={pg}
              onClick={() => handlePage(pg)}
              className={`h-8 w-8 rounded-lg text-[12px] font-medium transition-all ${
                pg === page
                  ? 'bg-purple-600 text-white'
                  : 'border border-[#1a2035] bg-[#0d1120] text-[#4a5578] hover:text-white'
              }`}
            >
              {pg}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
