'use client'

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { CtaModal } from './cta-modal'
import { ChatWidget } from './chat-widget'

type CtaContextValue = {
  openModal: () => void
}

const CtaContext = createContext<CtaContextValue | null>(null)

export function useCta() {
  const ctx = useContext(CtaContext)
  if (!ctx) throw new Error('useCta must be used within CtaProvider')
  return ctx
}

export function CtaProvider({ children }: { children: ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <CtaContext.Provider value={{ openModal: () => setModalOpen(true) }}>
      {children}
      <ChatWidget />
      <CtaModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </CtaContext.Provider>
  )
}
