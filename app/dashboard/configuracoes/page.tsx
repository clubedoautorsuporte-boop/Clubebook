'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import {
  User, Mail, Shield, Bell, LogOut, Check,
  AlertTriangle, Smartphone, Lock, Globe,
} from 'lucide-react'

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${enabled ? 'bg-[#4f7fff]' : 'bg-[#1c2438]'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${enabled ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  )
}

export default function ConfiguracoesPage() {
  const { data: session } = useSession()
  const user = session?.user

  const [notifs, setNotifs] = useState({
    ebooks: true,
    novidades: true,
    dicas: false,
    marketing: false,
  })

  useEffect(() => {
    const saved = localStorage.getItem('notif-prefs')
    if (saved) {
      try { setNotifs(JSON.parse(saved)) } catch { /* ignore */ }
    }
  }, [])

  function updateNotif(key: keyof typeof notifs, val: boolean) {
    const next = { ...notifs, [key]: val }
    setNotifs(next)
    localStorage.setItem('notif-prefs', JSON.stringify(next))
  }

  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const cardCls = 'overflow-hidden rounded-2xl border border-[#1c2438]'
  const headerCls = 'flex items-center gap-2 border-b border-[#1c2438] px-5 py-4'
  const fieldCls = 'flex items-center gap-2 rounded-xl border border-[#1c2438] px-4 py-2.5'

  return (
    <div className="px-5 pt-6 pb-12 md:px-8 max-w-2xl">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="mt-0.5 text-sm text-[#a0b0c8]">Gerencie sua conta e preferências</p>
      </div>

      {/* Perfil */}
      <section className={`mb-6 ${cardCls}`} style={{ background: '#0d1220' }}>
        <div className={headerCls}>
          <User className="size-4 text-[#4f7fff]" />
          <h2 className="text-sm font-semibold text-white">Perfil</h2>
        </div>
        <div className="p-5">
          <div className="mb-5 flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0">
              {user?.image ? (
                <img src={user.image} alt={user.name ?? ''} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-[#1c2438]" />
              ) : (
                <div className="grid h-16 w-16 place-items-center rounded-2xl text-2xl font-extrabold text-white ring-2 ring-[#1c2438]"
                  style={{ background: 'linear-gradient(135deg,#4f7fff,#a855f7)' }}>
                  {user?.name?.charAt(0).toUpperCase() ?? '?'}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 rounded-full p-0.5" style={{ background: '#00e5c3' }}>
                <Check className="size-2.5 text-[#060a12]" />
              </span>
            </div>
            <div>
              <p className="font-bold text-white">{user?.name ?? '—'}</p>
              <p className="text-xs text-[#8896b0]">Foto importada do Google</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#a0b0c8]">Nome</label>
              <div className={`${fieldCls}`} style={{ background: '#0b0f1c' }}>
                <User className="size-3.5 shrink-0 text-[#8896b0]" />
                <span className="text-sm text-white">{user?.name ?? '—'}</span>
                <span className="ml-auto text-[10px] text-[#8896b0]">via Google</span>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#a0b0c8]">Email</label>
              <div className={`${fieldCls}`} style={{ background: '#0b0f1c' }}>
                <Mail className="size-3.5 shrink-0 text-[#8896b0]" />
                <span className="text-sm text-white">{user?.email ?? '—'}</span>
                <Lock className="ml-auto size-3 text-[#8896b0]" />
              </div>
              <p className="mt-1 text-[10px] text-[#8896b0]">O email não pode ser alterado pois está vinculado ao Google.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Segurança */}
      <section className={`mb-6 ${cardCls}`} style={{ background: '#0d1220' }}>
        <div className={headerCls}>
          <Shield className="size-4 text-[#4f7fff]" />
          <h2 className="text-sm font-semibold text-white">Segurança e Acesso</h2>
        </div>
        <div className="p-5">
          <div className={`flex items-center justify-between ${fieldCls}`} style={{ background: '#0b0f1c' }}>
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg border border-[#1c2438]" style={{ background: '#0d1220' }}>
                <Globe className="size-4 text-[#4285F4]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Google</p>
                <p className="text-[10px] text-[#8896b0]">{user?.email}</p>
              </div>
            </div>
            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-[#00e5c3]" style={{ background: 'rgba(0,229,195,0.12)' }}>
              <Check className="size-3" /> Conectado
            </span>
          </div>
          <div className={`mt-3 flex items-center gap-2 ${fieldCls}`} style={{ background: '#0b0f1c' }}>
            <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: '#1c2438' }}>
              <Smartphone className="size-4 text-[#8896b0]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#a0b0c8]">Autenticação 2 fatores</p>
              <p className="text-[10px] text-[#8896b0]">Gerenciado pelo Google</p>
            </div>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-amber-400" style={{ background: 'rgba(245,158,11,0.15)' }}>Via Google</span>
          </div>
        </div>
      </section>

      {/* Notificações */}
      <section className={`mb-6 ${cardCls}`} style={{ background: '#0d1220' }}>
        <div className={headerCls}>
          <Bell className="size-4 text-[#4f7fff]" />
          <h2 className="text-sm font-semibold text-white">Notificações</h2>
        </div>
        <div className="divide-y divide-[#1c2438]">
          {[
            { key: 'ebooks' as const, label: 'Ebook pronto', desc: 'Quando seu ebook for gerado com sucesso' },
            { key: 'novidades' as const, label: 'Novidades da plataforma', desc: 'Novos recursos e melhorias' },
            { key: 'dicas' as const, label: 'Dicas de vendas', desc: 'Estratégias semanais para vender mais' },
            { key: 'marketing' as const, label: 'Ofertas e promoções', desc: 'Pacotes de créditos em promoção' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-[11px] text-[#8896b0]">{desc}</p>
              </div>
              <Toggle enabled={notifs[key]} onChange={v => updateNotif(key, v)} />
            </div>
          ))}
        </div>
      </section>

      {/* Sessão */}
      <section className={`mb-6 ${cardCls}`} style={{ background: '#0d1220' }}>
        <div className={headerCls}>
          <LogOut className="size-4 text-[#4f7fff]" />
          <h2 className="text-sm font-semibold text-white">Sessão</h2>
        </div>
        <div className="p-5">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 rounded-xl border border-[#1c2438] px-4 py-2.5 text-sm font-semibold text-[#a0b0c8] transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
            style={{ background: '#0b0f1c' }}
          >
            <LogOut className="size-4" />
            Sair da conta
          </button>
        </div>
      </section>

      {/* Zona de perigo */}
      <section className="rounded-2xl border border-red-500/20" style={{ background: '#0d1220' }}>
        <div className="flex items-center gap-2 border-b border-red-500/20 px-5 py-4">
          <AlertTriangle className="size-4 text-red-400" />
          <h2 className="text-sm font-semibold text-red-400">Zona de perigo</h2>
        </div>
        <div className="p-5">
          <p className="mb-3 text-xs text-[#a0b0c8]">
            A exclusão da conta remove permanentemente todos os seus ebooks, rascunhos e histórico. Esta ação é irreversível.
          </p>
          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
              style={{ background: 'rgba(239,68,68,0.05)' }}
            >
              Excluir minha conta
            </button>
          ) : (
            <div className="rounded-xl border border-red-500/30 p-4" style={{ background: 'rgba(239,68,68,0.05)' }}>
              <p className="mb-3 text-sm font-semibold text-red-400">Tem certeza? Esta ação não pode ser desfeita.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="rounded-xl border border-[#1c2438] px-4 py-2 text-sm text-[#a0b0c8] transition hover:text-white"
                  style={{ background: '#0b0f1c' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => alert('Em breve. Contate suporte@clubedoautor.online')}
                  className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600"
                >
                  Confirmar exclusão
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
