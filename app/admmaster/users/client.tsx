'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Search, Users, Coins, BookOpen, FileText, ChevronRight, Loader2 } from 'lucide-react'
import type { UserRow } from './page'

export default function UsersClient({ initialUsers, total }: { initialUsers: UserRow[]; total: number }) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers)
  const [q, setQ] = useState('')
  const [totalCount, setTotalCount] = useState(total)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(Math.ceil(total / 20))
  const [isPending, startTransition] = useTransition()

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

  function handleQ(v: string) {
    setQ(v)
    search(v, 1)
  }

  function handlePage(pg: number) {
    search(q, pg)
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl">

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Usuários</h1>
          <p className="mt-1 text-sm text-[#4a5578]">{totalCount} usuário{totalCount !== 1 ? 's' : ''} cadastrado{totalCount !== 1 ? 's' : ''}</p>
        </div>

        {/* Search */}
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
        {/* Header row */}
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 border-b border-[#1a2035] px-5 py-3 text-[10px] font-bold text-[#2e3a55] tracking-widest">
          <span>AVATAR</span>
          <span>USUÁRIO</span>
          <span className="text-right">CRÉDITOS</span>
          <span className="text-right">EBOOKS</span>
          <span className="text-right">RASC.</span>
          <span className="text-right">ENTROU</span>
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
            className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center border-b border-[#0a0e1a] px-5 py-3 hover:bg-[#0f1525] transition-colors"
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

            {/* Date + arrow */}
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-[10px] text-[#2e3a55]">
                {new Date(u.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
              </span>
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
