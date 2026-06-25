'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type UIMessage } from 'ai'
import { MessageCircle, Send, Sparkles, X } from 'lucide-react'

function messageText(message: UIMessage) {
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

const GREETING =
  'Olá! Sou a Aurora IA 👋\n\nPronta para criar seu ebook. Me conta: qual é o tema e o público que você quer atingir?'

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const loading = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = () => {
    if (!input.trim() || loading) return
    sendMessage({ text: input.trim() })
    setInput('')
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[520px] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="flex items-center gap-3 bg-brand-gradient px-5 py-4">
            <div className="flex size-9 items-center justify-center rounded-full bg-white/15">
              <Sparkles className="size-[18px] text-white" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white">Aurora IA</div>
              <div className="text-xs text-white/65">Assistente de criação</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 text-white/70 transition-colors hover:text-white"
              aria-label="Fechar chat"
            >
              <X className="size-[18px]" aria-hidden="true" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            <Bubble role="assistant" text={GREETING} />
            {messages.map((m) => (
              <Bubble key={m.id} role={m.role} text={messageText(m)} />
            ))}
            {loading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex w-fit items-center gap-1.5 rounded-2xl bg-line px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-[7px] animate-typing rounded-full bg-brand"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2.5 border-t border-line p-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Digite seu tema..."
              className="flex-1 rounded-full border border-line bg-ink px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-dim focus:border-brand/40"
            />
            <button
              onClick={send}
              disabled={loading}
              className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white shadow-lg shadow-brand/30 transition-opacity disabled:opacity-50"
              aria-label="Enviar mensagem"
            >
              <Send className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="fixed bottom-7 right-4 z-50 flex size-14 items-center justify-center rounded-full bg-brand-gradient text-white shadow-xl shadow-brand/40 transition-transform hover:scale-110"
        aria-label={open ? 'Fechar chat' : 'Abrir chat com a Aurora IA'}
      >
        {open ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <>
            <MessageCircle className="size-6" aria-hidden="true" />
            <span className="absolute -right-0.5 -top-0.5 size-3.5 rounded-full border-2 border-white bg-teal" />
          </>
        )}
      </button>
    </>
  )
}

function Bubble({ role, text }: { role: string; text: string }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
          isUser
            ? 'rounded-br-sm bg-brand-gradient text-white'
            : 'rounded-bl-sm bg-line text-text'
        }`}
      >
        {text}
      </div>
    </div>
  )
}
