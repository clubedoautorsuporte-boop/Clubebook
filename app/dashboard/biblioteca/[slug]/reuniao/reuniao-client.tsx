'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Props { slug: string; titulo: string; nomeAutor: string }

const PAIN_POINTS = [
  { emoji: '🧠', titulo: 'Falta de tempo', desc: 'Você sabe o que quer escrever mas nunca consegue sentar e começar' },
  { emoji: '💬', titulo: 'Dúvida sobre estrutura', desc: 'Não sabe por onde começar, como organizar capítulos, o que incluir' },
  { emoji: '😰', titulo: 'Medo de errar', desc: 'Teme que o livro não fique bom o suficiente para publicar' },
]

const DELIVERABLES = [
  { titulo: 'Roteiro completo', desc: 'Estrutura do seu livro capítulo a capítulo' },
  { titulo: 'Livro escrito pela Aurora', desc: 'O texto completo gerado na reunião' },
  { titulo: 'Edição especializada', desc: 'Revisão e ajustes com o especialista' },
  { titulo: 'Capa profissional', desc: 'Design criado especialmente para o seu livro' },
  { titulo: 'Ficha técnica', desc: 'Todos os dados para publicação' },
  { titulo: 'Suporte pós-reunião', desc: '7 dias de acompanhamento por WhatsApp' },
]

const STEPS = [
  { n: 1, titulo: 'Você agenda', desc: 'Escolha data e horário disponível no calendário' },
  { n: 2, titulo: 'Fale com o especialista', desc: 'Na reunião, você conta sua história, ideias e objetivos' },
  { n: 3, titulo: 'Aurora escreve ao vivo', desc: 'Enquanto você fala, a Aurora já está construindo seu livro' },
  { n: 4, titulo: 'Revisão juntos', desc: 'Você e o especialista ajustam o texto em tempo real' },
  { n: 5, titulo: 'Pronto para publicar', desc: 'Você sai da reunião com o livro completo em mãos' },
]

const FAQS = [
  { q: 'Preciso ter alguma experiência para participar?', r: 'Não! A reunião é feita para qualquer pessoa, independente de experiência com escrita ou publicação.' },
  { q: 'Quanto tempo dura a reunião?', r: 'Exatamente 1 hora. Nesse tempo conseguimos estruturar e escrever seu livro completo com a ajuda da Aurora.' },
  { q: 'Vou realmente sair com o livro pronto?', r: 'Sim. A grande maioria dos participantes sai da reunião com o texto completo gerado. Casos excepcionais recebem o livro em até 24h.' },
  { q: 'A reunião é online ou presencial?', r: '100% online, pelo Google Meet ou Zoom. Você participa de qualquer lugar.' },
  { q: 'Como funciona o suporte pós-reunião?', r: 'Você tem 7 dias de acesso direto ao especialista por WhatsApp para tirar dúvidas sobre publicação e distribuição.' },
  { q: 'Posso remarcar se não puder comparecer?', r: 'Sim, com até 24h de antecedência você pode remarcar sem custo adicional.' },
  { q: 'O livro gerado é meu?', r: '100% seu. Todos os direitos autorais pertencem a você.' },
  { q: 'Qual idioma é usado na reunião?', r: 'Português brasileiro. Tradução para outros idiomas está disponível como serviço adicional.' },
]

export function ReuniaoClient({ slug }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ minHeight: '100vh', background: '#080e24', color: '#e0e8f0', fontFamily: 'system-ui, sans-serif' }}>

      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(8,14,36,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 56,
      }}>
        <Link href={`/dashboard/biblioteca/${slug}`} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          color: '#8a9ab8', textDecoration: 'none', fontSize: 14,
        }}>
          ← Voltar ao meu livro
        </Link>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: '#f59e0b' }}>
          REUNIÃO COM ESPECIALISTA
        </span>
      </div>

      <section style={{ background: 'linear-gradient(160deg,#06020e,#0d1220)', padding: '80px 20px 72px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 100, padding: '6px 16px', marginBottom: 32,
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#f59e0b' }}>
              ⭐ SERVIÇO PREMIUM — EQUIPE AURORA
            </span>
          </div>

          <h1 style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.15, margin: '0 0 20px', color: '#fff' }}>
            Você fala. A Aurora e o especialista fazem.
          </h1>

          <p style={{ fontSize: 16, color: '#8a9ab8', lineHeight: 1.7, margin: '0 0 40px', maxWidth: 620, marginLeft: 'auto', marginRight: 'auto' }}>
            Em 1 hora de reunião, transformamos sua ideia num livro completo — do roteiro ao texto final, tudo cuidado por um especialista ao lado da Aurora.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <button style={{
              background: '#f59e0b', color: '#000', border: 'none',
              borderRadius: 10, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}>
              Agendar minha reunião agora
            </button>
            <a href="#como-funciona" style={{
              background: 'transparent', color: '#f59e0b',
              border: '1px solid rgba(245,158,11,0.4)',
              borderRadius: 10, padding: '14px 28px', fontSize: 15, fontWeight: 600,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
            }}>
              Ver como funciona
            </a>
          </div>

          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['✓ 1 hora dedicada ao seu livro', '✓ Especialista em publicação', '✓ Livro gerado na reunião'].map(t => (
              <span key={t} style={{ fontSize: 13, color: '#8a9ab8' }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '72px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 48, color: '#fff' }}>
            Seu livro talvez não esteja parado por falta de história.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
            {PAIN_POINTS.map(p => (
              <div key={p.titulo} style={{
                background: '#0d1220', borderRadius: 14,
                border: '1px solid rgba(220,38,38,0.2)',
                padding: '28px 24px',
              }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{p.emoji}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{p.titulo}</div>
                <div style={{ fontSize: 14, color: '#8a9ab8', lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '72px 20px', background: '#060b18' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 48, color: '#fff' }}>
            O que você recebe ao contratar
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {DELIVERABLES.map(d => (
                <div key={d.titulo} style={{
                  background: '#0a101e', borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.07)',
                  padding: '20px 18px',
                }}>
                  <div style={{ fontSize: 18, color: '#f59e0b', marginBottom: 8 }}>✅</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{d.titulo}</div>
                  <div style={{ fontSize: 12, color: '#8a9ab8', lineHeight: 1.5 }}>{d.desc}</div>
                </div>
              ))}
            </div>

            <div style={{
              background: 'linear-gradient(135deg,#1a0e00,#2a1600)',
              border: '1px solid rgba(245,158,11,0.35)',
              borderRadius: 16, padding: '36px 28px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16,
            }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#f59e0b', lineHeight: 1.2 }}>
                Pronto ainda na reunião
              </div>
              <div style={{ fontSize: 14, color: '#c8a96e', lineHeight: 1.7 }}>
                A maioria dos nossos alunos sai da reunião com o livro já escrito
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 22 }}>⭐⭐⭐⭐⭐</div>
                <div style={{ fontSize: 13, color: '#8a9ab8' }}>4.9/5 — baseado em +200 reuniões</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" style={{ padding: '72px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 56, color: '#fff' }}>
            Como funciona
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 560, margin: '0 auto' }}>
            {STEPS.map((s, i) => (
              <div key={s.n} style={{ display: 'flex', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'rgba(245,158,11,0.15)', border: '2px solid #f59e0b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, fontWeight: 800, color: '#f59e0b', flexShrink: 0,
                  }}>
                    {s.n}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ width: 2, flex: 1, minHeight: 40, background: 'rgba(245,158,11,0.2)', margin: '4px 0' }} />
                  )}
                </div>
                <div style={{ paddingBottom: i < STEPS.length - 1 ? 32 : 0, paddingTop: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{s.titulo}</div>
                  <div style={{ fontSize: 14, color: '#8a9ab8', lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '72px 20px', background: '#060b18' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 48, color: '#fff' }}>
            Como você entra na reunião. Como você sai dela.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
            <div style={{
              background: '#0d1220', borderRadius: 14,
              border: '1px solid rgba(220,38,38,0.25)',
              padding: '28px 24px',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: '#f87171', marginBottom: 20 }}>
                ANTES
              </div>
              {['Tem uma ideia...', 'Não sabe por onde começar', 'Preocupado com a qualidade', 'Sem tempo para escrever', 'Projeto parado há meses'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ color: '#f87171', fontSize: 16 }}>✗</span>
                  <span style={{ fontSize: 14, color: '#8a9ab8' }}>{t}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: '#0d1a10', borderRadius: 14,
              border: '1px solid rgba(245,158,11,0.3)',
              padding: '28px 24px',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: '#f59e0b', marginBottom: 20 }}>
                DEPOIS
              </div>
              {['Livro completo escrito', 'Capa profissional pronta', 'Dados para publicação', 'Pronto para vender', 'Sentindo orgulho da própria história'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ color: '#4ade80', fontSize: 16 }}>✓</span>
                  <span style={{ fontSize: 14, color: '#c8e6c9' }}>{t} ✓</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '72px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 40, color: '#fff' }}>
            Perguntas frequentes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)',
                background: '#0d1220', overflow: 'hidden',
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px 20px', background: 'transparent', border: 'none', cursor: 'pointer',
                    textAlign: 'left', gap: 16,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#e0e8f0', lineHeight: 1.4 }}>{faq.q}</span>
                  <span style={{
                    width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: openFaq === i ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.06)',
                    color: openFaq === i ? '#f59e0b' : '#5a6a84',
                    fontSize: 18, fontWeight: 300,
                  }}>
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 18px', fontSize: 14, color: '#8a9ab8', lineHeight: 1.7 }}>
                    {faq.r}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '72px 20px 80px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(160deg,#1a0e00,#2a1600)',
            border: '1px solid rgba(245,158,11,0.35)',
            borderRadius: 20, padding: '56px 40px', textAlign: 'center',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 100, padding: '6px 16px', marginBottom: 28,
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#f59e0b' }}>
                ⏰ VAGAS LIMITADAS — ESTA SEMANA
              </span>
            </div>

            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 16, lineHeight: 1.2 }}>
              Sua história não precisa continuar esperando.
            </h2>
            <p style={{ fontSize: 16, color: '#c8a96e', marginBottom: 32, lineHeight: 1.6 }}>
              Agenda uma reunião agora e saia dela com seu livro pronto.
            </p>

            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 15, color: '#8a9ab8', textDecoration: 'line-through', marginBottom: 4 }}>
                de R$997,00
              </div>
              <div style={{ fontSize: 48, fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>
                R$497,00
              </div>
              <div style={{ fontSize: 13, color: '#8a9ab8', marginTop: 6 }}>pagamento único</div>
            </div>

            <button style={{
              background: '#f59e0b', color: '#000', border: 'none',
              borderRadius: 12, padding: '16px 36px', fontSize: 16, fontWeight: 800, cursor: 'pointer',
              marginBottom: 28,
            }}>
              Agendar minha reunião agora →
            </button>

            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['✓ Garantia de 7 dias', '✓ Suporte incluso', '✓ Especialistas certificados'].map(t => (
                <span key={t} style={{ fontSize: 13, color: '#8a9ab8' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
