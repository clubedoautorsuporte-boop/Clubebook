'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Rocket, CheckCircle2, Circle, Copy, Check,
  ChevronDown, ChevronUp, Target, Megaphone, TrendingUp,
  Globe, ShoppingCart, Zap, Clock, Star, Users, Tag,
} from 'lucide-react'

interface Props { slug: string; titulo: string; nomeAutor: string }

const FASES = [
  {
    id: 'pre', label: 'Pré-lançamento', sub: '30 dias antes', emoji: '🎯',
    cor: '#a855f7', corBg: 'rgba(168,85,247,0.08)', corBorder: 'rgba(168,85,247,0.2)',
    itens: [
      { id: 'pre1', label: 'Publicar na Amazon KDP',        desc: 'Crie conta, faça upload do EPUB e configure a ficha' },
      { id: 'pre2', label: 'Configurar capa e preço',       desc: 'Defina a faixa de preço ideal para seu gênero' },
      { id: 'pre3', label: 'Escrever sinopse otimizada',    desc: 'Use palavras-chave do gênero para aparecer nas buscas' },
      { id: 'pre4', label: 'Montar lista de contatos',      desc: 'E-mails, grupos de WhatsApp, seguidores próximos' },
      { id: 'pre5', label: 'Criar material visual',         desc: 'Banners, cards e arte para redes sociais' },
      { id: 'pre6', label: 'Agendar posts de aquecimento',  desc: 'Crie antecipação: "algo vem aí..." nos próximos dias' },
      { id: 'pre7', label: 'Pedir apoio de parceiros',      desc: 'Influenciadores do nicho que podem divulgar no dia D' },
    ],
  },
  {
    id: 'semana', label: 'Semana do lançamento', sub: '7 dias antes', emoji: '📣',
    cor: '#f59e0b', corBg: 'rgba(245,158,11,0.08)', corBorder: 'rgba(245,158,11,0.2)',
    itens: [
      { id: 'sem1', label: 'Anunciar a data oficial',          desc: 'Post com countdown — "em X dias meu livro chega!"' },
      { id: 'sem2', label: 'Enviar e-mail de pré-lançamento',  desc: 'Avise sua lista com link de pré-venda se houver' },
      { id: 'sem3', label: 'Postar trecho do livro',           desc: 'Compartilhe um parágrafo poderoso para gerar curiosidade' },
      { id: 'sem4', label: 'Stories de contagem regressiva',   desc: '7, 6, 5... dias — mantenha o público aquecido' },
      { id: 'sem5', label: 'Confirmar com parceiros',          desc: 'Lembre quem vai divulgar da data exata e do link' },
    ],
  },
  {
    id: 'diaD', label: 'Dia do lançamento', sub: 'O grande dia 🚀', emoji: '🚀',
    cor: '#ef4444', corBg: 'rgba(239,68,68,0.08)', corBorder: 'rgba(239,68,68,0.2)',
    itens: [
      { id: 'dia1', label: 'Post de lançamento no Instagram', desc: 'Use o script personalizado na seção abaixo' },
      { id: 'dia2', label: 'Enviar e-mail para sua lista',    desc: 'Anúncio oficial com link direto de compra' },
      { id: 'dia3', label: 'Mensagem nos grupos de WhatsApp', desc: 'Família, amigos, grupos do nicho' },
      { id: 'dia4', label: 'Story ao vivo mostrando a página', desc: 'Mostre a tela de compra em tempo real' },
      { id: 'dia5', label: 'Responder todos os comentários',  desc: 'Engajamento no dia D aumenta o alcance orgânico' },
    ],
  },
  {
    id: 'pos', label: 'Pós-lançamento', sub: 'Primeiros 30 dias', emoji: '📈',
    cor: '#10b981', corBg: 'rgba(16,185,129,0.08)', corBorder: 'rgba(16,185,129,0.2)',
    itens: [
      { id: 'pos1', label: 'Pedir avaliações aos leitores',    desc: 'Avaliações aumentam rankeamento orgânico nas plataformas' },
      { id: 'pos2', label: 'Criar conteúdo sobre os bastidores', desc: 'Mostre como foi o processo de criar o livro' },
      { id: 'pos3', label: 'Analisar os primeiros resultados', desc: 'Visualizações, cliques, conversões e receita' },
      { id: 'pos4', label: 'Testar anúncios pagos',            desc: 'Meta Ads com público do nicho — R$10/dia já funciona' },
      { id: 'pos5', label: 'Planejar o próximo livro',         desc: 'Use o momentum atual para lançar o próximo em breve' },
    ],
  },
]

const PLATAFORMAS = [
  {
    nome: 'Amazon KDP', cor: '#ff9900', emoji: '📦',
    desc: 'Maior marketplace de e-books do mundo. Distribuição global automática.',
    passos: ['Criar conta em kdp.amazon.com', 'Fazer upload do arquivo EPUB', 'Configurar preço e territórios', 'Aguardar aprovação (24-72h)'],
  },
  {
    nome: 'Hotmart', cor: '#ed1651', emoji: '🔥',
    desc: 'Plataforma brasileira líder em infoprodutos. Ótimo para livros de nicho.',
    passos: ['Criar conta gratuita em hotmart.com', 'Cadastrar produto → E-book', 'Definir comissão para afiliados', 'Copiar link de vendas'],
  },
  {
    nome: 'Kiwify', cor: '#7c3aed', emoji: '🥝',
    desc: 'Plataforma nova e com as menores taxas do mercado brasileiro.',
    passos: ['Acessar kiwify.com.br', 'Criar produto digital', 'Fazer upload do PDF/EPUB', 'Configurar checkout e receber'],
  },
  {
    nome: 'Clube de Autores', cor: '#4f7fff', emoji: '📚',
    desc: 'Plataforma nacional com impressão sob demanda. Seu livro também em papel!',
    passos: ['Criar conta em clubedeautores.com.br', 'Submeter o manuscrito', 'Escolher capa e formato', 'Disponível em print e digital'],
  },
]

const PRECOS: Record<string, { min: number; max: number; sug: number; tip: string }> = {
  autoajuda:  { min: 29.90, max: 59.90, sug: 44.90, tip: 'Livros de autoajuda com transformação concreta vendem melhor entre R$39–R$49' },
  romance:    { min: 19.90, max: 44.90, sug: 32.90, tip: 'Romances digitais competem com a Amazon global — preço acessível converte mais' },
  negocios:   { min: 39.90, max: 89.90, sug: 57.90, tip: 'Livros de negócios têm maior percepção de valor — não baixe demais' },
  infantil:   { min: 14.90, max: 34.90, sug: 24.90, tip: 'Faixa popular para infantil digital — competitivo e acessível para famílias' },
  ficcao:     { min: 19.90, max: 44.90, sug: 29.90, tip: 'Ficção compete diretamente com grandes editoras — preço moderado é estratégico' },
  espiritual: { min: 24.90, max: 54.90, sug: 39.90, tip: 'Nicho fiel disposto a pagar mais por conteúdo de valor espiritual' },
  educacao:   { min: 34.90, max: 79.90, sug: 49.90, tip: 'Material educacional tem alto valor percebido — precifique com confiança' },
  outros:     { min: 24.90, max: 49.90, sug: 34.90, tip: 'Preço médio seguro para nichos diversos' },
}

export function LancamentoClient({ slug, titulo, nomeAutor }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [openFase, setOpenFase]   = useState<string>('pre')
  const [genero, setGenero]       = useState('autoajuda')
  const [copied, setCopied]       = useState<string | null>(null)
  const [openPlat, setOpenPlat]   = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(`lancamento-${slug}`)
    if (saved) {
      try { setChecked(new Set(JSON.parse(saved))) } catch { /* ignore */ }
    }
  }, [slug])

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      localStorage.setItem(`lancamento-${slug}`, JSON.stringify([...next]))
      return next
    })
  }

  const total   = FASES.reduce((a, f) => a + f.itens.length, 0)
  const done    = [...checked].filter(id => FASES.flatMap(f => f.itens).some(i => i.id === id)).length
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0
  const R       = 52
  const circ    = 2 * Math.PI * R
  const dash    = circ - (pct / 100) * circ
  const ringCol = pct < 40 ? '#ef4444' : pct < 75 ? '#f59e0b' : '#10b981'

  const SCRIPTS = {
    instagram: `🚀 MEU LIVRO ACABOU DE SER LANÇADO!\n\n"${titulo}" já está disponível!\n\n✨ Escrevi esse livro pensando em pessoas que querem transformar sua história.\n\n📖 Link na bio para garantir o seu!\n\n— ${nomeAutor} 🙏`,
    whatsapp:  `Oi! Tenho uma novidade que quero compartilhar com vocês 🎉\n\nMeu livro "${titulo}" acabou de ser lançado!\n\nÉ muito especial pra mim e tenho certeza que vai fazer a diferença.\n\nLink para comprar: [cole seu link aqui]\n\nConto com o apoio de vocês! 🙏\n— ${nomeAutor}`,
    email:     `Assunto: 🚀 [${nomeAutor}] Meu livro chegou!\n\nOlá!\n\nEste é um dos dias mais especiais da minha vida.\n\nDepois de muito trabalho e dedicação, meu livro "${titulo}" está finalmente disponível.\n\nEscrevi cada página pensando em como posso ajudar você.\n\n👉 Clique aqui para garantir o seu: [link]\n\nCom carinho e gratidão,\n${nomeAutor}`,
  }

  const copy = async (key: string) => {
    await navigator.clipboard.writeText(SCRIPTS[key as keyof typeof SCRIPTS])
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const preco = PRECOS[genero] || PRECOS.outros
  const pctSug = ((preco.sug - preco.min) / (preco.max - preco.min)) * 100

  return (
    <div style={{ minHeight: '100vh', background: '#080e24', color: 'white', paddingBottom: 80 }}>

      {/* ── Top bar ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(8,14,36,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
          <Link href={`/dashboard/biblioteca/${slug}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#5a6a84', textDecoration: 'none' }}>
            <ArrowLeft style={{ width: 14, height: 14 }} /> Voltar ao meu livro
          </Link>
          <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#f59e0b' }}>
            🚀 Plano de Lançamento
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 20px', display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* ── Hero ── */}
        <div style={{ borderRadius: 24, padding: '36px 32px', background: 'linear-gradient(135deg,#0a0e1c,#111827)', border: '1px solid rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' as const }}>
          {/* Progress ring */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={60} cy={60} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={10} />
              <circle cx={60} cy={60} r={R} fill="none" stroke={ringCol}
                strokeWidth={10} strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={dash}
                style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease' }}
              />
            </svg>
            <div style={{ marginTop: -76, width: 120, textAlign: 'center' as const, pointerEvents: 'none' }}>
              <p style={{ fontSize: 26, fontWeight: 900, color: ringCol, margin: 0, lineHeight: 1 }}>{pct}%</p>
              <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#3a4a60', margin: '4px 0 0' }}>pronto</p>
            </div>
            <p style={{ fontSize: 11, color: '#4a5a70', margin: 0 }}>{done}/{total} tarefas</p>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12, borderRadius: 999, padding: '4px 12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', fontSize: 10, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#f59e0b' }}>
              <Rocket style={{ width: 11, height: 11 }} /> Central de Lançamento
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 6px', lineHeight: 1.2 }}>{titulo}</h1>
            <p style={{ fontSize: 13, color: '#5a6a84', margin: '0 0 20px' }}>por {nomeAutor}</p>

            {pct === 100 ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 12, padding: '10px 20px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', fontSize: 13, fontWeight: 700, color: '#10b981' }}>
                <CheckCircle2 style={{ width: 16, height: 16 }} /> Pronto para lançar! 🎉
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg,${ringCol},${ringCol}aa)`, borderRadius: 999, transition: 'width 0.5s ease' }} />
                </div>
                <p style={{ fontSize: 11, color: '#4a5a70', margin: 0 }}>
                  {pct < 40 ? '🔴 Ainda no início — comece pelas tarefas de pré-lançamento'
                    : pct < 75 ? '🟡 Bom progresso — continue, o lançamento está chegando!'
                    : '🟢 Quase lá — termine os últimos detalhes e lance!'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Fases ── */}
        <div>
          <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#5a6a84', margin: '0 0 16px' }}>
            Checklist por fase
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FASES.map(fase => {
              const isOpen   = openFase === fase.id
              const faseDone = fase.itens.filter(i => checked.has(i.id)).length
              const faseTotal = fase.itens.length
              const fazePct  = Math.round((faseDone / faseTotal) * 100)

              return (
                <div key={fase.id} style={{ borderRadius: 16, border: `1px solid ${isOpen ? fase.corBorder : 'rgba(255,255,255,0.06)'}`, background: isOpen ? fase.corBg : '#0a101e', overflow: 'hidden', transition: 'all 0.2s' }}>
                  {/* Header */}
                  <button
                    onClick={() => setOpenFase(isOpen ? '' : fase.id)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}
                  >
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{fase.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: isOpen ? fase.cor : '#c0d0e0', margin: '0 0 2px' }}>{fase.label}</p>
                      <p style={{ fontSize: 11, color: '#4a5a70', margin: 0 }}>{fase.sub}</p>
                    </div>
                    {/* Mini progress */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: fazePct === 100 ? '#10b981' : fase.cor }}>
                        {faseDone}/{faseTotal}
                      </span>
                      <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }}>
                        <div style={{ height: '100%', width: `${fazePct}%`, background: fazePct === 100 ? '#10b981' : fase.cor, borderRadius: 999, transition: 'width 0.3s' }} />
                      </div>
                      {isOpen
                        ? <ChevronUp style={{ width: 14, height: 14, color: '#4a5a70' }} />
                        : <ChevronDown style={{ width: 14, height: 14, color: '#4a5a70' }} />}
                    </div>
                  </button>

                  {/* Items */}
                  {isOpen && (
                    <div style={{ padding: '0 20px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {fase.itens.map(item => {
                        const isChecked = checked.has(item.id)
                        return (
                          <button
                            key={item.id}
                            onClick={() => toggle(item.id)}
                            style={{
                              display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', borderRadius: 12,
                              background: isChecked ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${isChecked ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)'}`,
                              cursor: 'pointer', textAlign: 'left' as const, transition: 'all 0.15s',
                            }}
                          >
                            {isChecked
                              ? <CheckCircle2 style={{ width: 18, height: 18, color: '#10b981', flexShrink: 0, marginTop: 1 }} />
                              : <Circle style={{ width: 18, height: 18, color: '#3a4a60', flexShrink: 0, marginTop: 1 }} />}
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 600, color: isChecked ? '#10b981' : '#c0d0e0', margin: '0 0 2px', textDecoration: isChecked ? 'line-through' : 'none' }}>
                                {item.label}
                              </p>
                              <p style={{ fontSize: 11, color: '#4a5a70', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Scripts prontos ── */}
        <div>
          <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#5a6a84', margin: '0 0 6px' }}>
            Scripts de divulgação
          </p>
          <p style={{ fontSize: 12, color: '#3a4a60', margin: '0 0 16px' }}>
            Personalizados com o título do seu livro — só copiar e colar.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {([
              { key: 'instagram', label: 'Instagram / Feed', icon: Target, cor: '#e1306c', emoji: '📸' },
              { key: 'whatsapp',  label: 'WhatsApp',          icon: Users,  cor: '#25d366', emoji: '💬' },
              { key: 'email',     label: 'E-mail para lista', icon: Megaphone, cor: '#4f7fff', emoji: '📧' },
            ] as const).map(s => (
              <div key={s.key} style={{ borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', background: '#0a101e', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{s.emoji}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#c0d0e0' }}>{s.label}</span>
                  </div>
                  <button
                    onClick={() => copy(s.key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none',
                      background: copied === s.key ? 'rgba(16,185,129,0.15)' : 'rgba(79,127,255,0.1)',
                      color: copied === s.key ? '#10b981' : '#4f7fff',
                      transition: 'all 0.2s',
                    }}
                  >
                    {copied === s.key
                      ? <><Check style={{ width: 11, height: 11 }} /> Copiado!</>
                      : <><Copy style={{ width: 11, height: 11 }} /> Copiar</>}
                  </button>
                </div>
                {/* Content */}
                <pre style={{ margin: 0, padding: '14px 16px', fontSize: 12, color: '#8a9ab8', lineHeight: 1.7, whiteSpace: 'pre-wrap' as const, fontFamily: 'inherit', overflowX: 'auto' }}>
                  {SCRIPTS[s.key as keyof typeof SCRIPTS]}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* ── Estratégia de preço ── */}
        <div>
          <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#5a6a84', margin: '0 0 16px' }}>
            Estratégia de preço
          </p>
          <div style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', background: '#0a101e', padding: '24px' }}>
            {/* Genre selector */}
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 24 }}>
              {Object.entries({ autoajuda: '🧠 Autoajuda', romance: '💕 Romance', negocios: '💼 Negócios', infantil: '🧒 Infantil', ficcao: '🌌 Ficção', espiritual: '✨ Espiritual', educacao: '📐 Educação' }).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setGenero(k)}
                  style={{
                    borderRadius: 999, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
                    background: genero === k ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                    color: genero === k ? '#f59e0b' : '#5a6a84',
                    outline: genero === k ? '1px solid rgba(245,158,11,0.35)' : '1px solid transparent',
                    transition: 'all 0.15s',
                  }}
                >{v}</button>
              ))}
            </div>

            {/* Price range visual */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: '#5a6a84', fontWeight: 600 }}>R$ {preco.min.toFixed(2).replace('.', ',')}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Tag style={{ width: 13, height: 13, color: '#f59e0b' }} />
                <span style={{ fontSize: 13, fontWeight: 900, color: '#f59e0b' }}>R$ {preco.sug.toFixed(2).replace('.', ',')} sugerido</span>
              </div>
              <span style={{ fontSize: 13, color: '#5a6a84', fontWeight: 600 }}>R$ {preco.max.toFixed(2).replace('.', ',')}</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.05)', position: 'relative', overflow: 'visible', marginBottom: 16 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '100%', borderRadius: 999, background: 'linear-gradient(90deg,rgba(239,68,68,0.3),rgba(245,158,11,0.4),rgba(16,185,129,0.3))' }} />
              <div style={{ position: 'absolute', top: '50%', left: `${pctSug}%`, transform: 'translate(-50%,-50%)', width: 18, height: 18, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 10px rgba(245,158,11,0.6)', border: '2px solid #fff', transition: 'left 0.4s ease' }} />
            </div>
            <p style={{ fontSize: 12, color: '#5a6a84', margin: 0, lineHeight: 1.6, padding: '12px 14px', borderRadius: 10, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)' }}>
              💡 {preco.tip}
            </p>
          </div>
        </div>

        {/* ── Plataformas ── */}
        <div>
          <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#5a6a84', margin: '0 0 16px' }}>
            Onde distribuir seu livro
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {PLATAFORMAS.map(p => {
              const isOpen = openPlat === p.nome
              return (
                <div key={p.nome} style={{ borderRadius: 14, border: `1px solid ${isOpen ? p.cor + '44' : 'rgba(255,255,255,0.07)'}`, background: isOpen ? `${p.cor}08` : '#0a101e', overflow: 'hidden', transition: 'all 0.15s' }}>
                  <button
                    onClick={() => setOpenPlat(isOpen ? null : p.nome)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}
                  >
                    <span style={{ fontSize: 22 }}>{p.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: isOpen ? p.cor : '#c0d0e0', margin: '0 0 2px' }}>{p.nome}</p>
                      <p style={{ fontSize: 10, color: '#4a5a70', margin: 0, lineHeight: 1.4 }}>{p.desc}</p>
                    </div>
                    {isOpen ? <ChevronUp style={{ width: 13, height: 13, color: '#4a5a70', flexShrink: 0 }} /> : <ChevronDown style={{ width: 13, height: 13, color: '#4a5a70', flexShrink: 0 }} />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {p.passos.map((passo, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <span style={{ width: 20, height: 20, borderRadius: '50%', background: `${p.cor}22`, border: `1px solid ${p.cor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: p.cor, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                          <span style={{ fontSize: 12, color: '#8a9ab8', lineHeight: 1.5 }}>{passo}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── CTA Final ── */}
        <div style={{ borderRadius: 20, padding: '28px', background: 'linear-gradient(135deg,#0a1040,#0d1830)', border: '1px solid rgba(245,158,11,0.15)', textAlign: 'center' as const }}>
          <span style={{ fontSize: 32 }}>🚀</span>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: '12px 0 8px' }}>
            {pct === 100 ? 'Você está pronto para lançar!' : `${100 - pct}% para o lançamento completo`}
          </h2>
          <p style={{ fontSize: 13, color: '#5a6a84', margin: '0 0 20px', lineHeight: 1.6, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
            {pct === 100
              ? 'Parabéns! Você completou todas as etapas. Agora é hora de lançar e celebrar!'
              : 'Complete as etapas acima e veja o progresso crescer. Cada tarefa concluída te aproxima do lançamento.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <Link href={`/dashboard/biblioteca/${slug}/marketing`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 12, padding: '11px 22px', fontSize: 13, fontWeight: 700, color: '#fff', background: 'rgba(79,127,255,0.15)', border: '1px solid rgba(79,127,255,0.25)', textDecoration: 'none' }}>
              <Megaphone style={{ width: 15, height: 15 }} /> Kit de Marketing
            </Link>
            <Link href={`/dashboard/biblioteca/${slug}/reuniao`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 12, padding: '11px 22px', fontSize: 13, fontWeight: 700, color: '#000', background: '#f59e0b', textDecoration: 'none' }}>
              <Zap style={{ width: 15, height: 15 }} /> Reunião com Especialista
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
