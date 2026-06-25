import { generateText } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { rateLimitEbookPlan } from '@/lib/rate-limit'
import { sanitizeField } from '@/lib/sanitize'

export const maxDuration = 60

const deepseek = createDeepSeek({ apiKey: process.env.DEEPSEEK_API_KEY! })

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-client-ip') ??
    req.headers.get('x-forwarded-for') ??
    'unknown'

  const rl = rateLimitEbookPlan(ip)
  if (!rl.success) {
    return Response.json(
      { error: 'Muitas requisições. Tente novamente em breve.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  if (!req.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: 'Content-Type inválido' }, { status: 415 })
  }

  let rawBody: unknown
  try {
    rawBody = await req.json()
  } catch {
    return Response.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const rawTema = (rawBody as Record<string, unknown>)?.tema
  const rawNome = (rawBody as Record<string, unknown>)?.nome
  const tema = sanitizeField(typeof rawTema === 'string' ? rawTema : '', 500)
  const nome = sanitizeField(typeof rawNome === 'string' ? rawNome : '', 100)

  if (!tema) {
    return Response.json({ error: 'Tema é obrigatório' }, { status: 400 })
  }

  try {
    const { text } = await generateText({
      model: deepseek('deepseek-chat'),
      system:
        'Você é um especialista em criação de ebooks best-sellers. Responda APENAS com JSON válido, sem markdown, sem texto extra.',
      prompt: `Crie um planejamento completo de ebook para o tema: "${tema}".
Nome do autor: "${nome || 'Autor'}".

Retorne APENAS este JSON:
{
  "titulo": "título criativo do livro (máx 80 chars)",
  "subtitulo": "subtítulo persuasivo (máx 100 chars)",
  "capitulos": [
    {
      "numero": 1,
      "titulo": "nome criativo do capítulo",
      "descricao": "parágrafo de 3-4 frases descrevendo o capítulo e o que o leitor vai aprender (máx 400 chars)",
      "blocos": [
        "Bloco 1: 1-2 frases descrevendo a primeira parte do capítulo (máx 150 chars)",
        "Bloco 2: 1-2 frases descrevendo a segunda parte (máx 150 chars)",
        "Bloco 3: 1-2 frases descrevendo a terceira parte (máx 150 chars)",
        "Bloco 4: 1-2 frases descrevendo a quarta parte (máx 150 chars)"
      ]
    }
  ],
  "promessa": "resultado transformador que o leitor vai obter (máx 150 chars)",
  "mensagem_final": "3 parágrafos motivacionais em itálico parabenizando ${nome || 'o autor'} pelo projeto e incentivando a finalizar a compra. Mencione o tema '${tema}' e o nome '${nome || 'você'}'. (máx 900 chars)"
}

REGRAS:
- Exatamente 10 capítulos
- Nomes de capítulos criativos e únicos para "${tema}"
- NUNCA use Introdução, Conclusão, Fundamentos como títulos de capítulo
- Todo conteúdo em português do Brasil
- Blocos devem complementar a descricao com detalhes específicos`,
    })

    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(clean)

    if (!parsed.titulo || !parsed.capitulos || !Array.isArray(parsed.capitulos)) {
      throw new Error('JSON inválido')
    }

    return Response.json({
      titulo: String(parsed.titulo).slice(0, 100),
      subtitulo: String(parsed.subtitulo || '').slice(0, 150),
      capitulos: (parsed.capitulos as unknown[]).slice(0, 10).map((c: unknown, i: number) => {
        const cap = c as Record<string, unknown>
        const blocos = Array.isArray(cap.blocos)
          ? (cap.blocos as unknown[]).slice(0, 4).map((b) => String(b).slice(0, 200))
          : []
        return {
          numero: i + 1,
          titulo: String(cap.titulo || `Capítulo ${i + 1}`).slice(0, 80),
          descricao: String(cap.descricao || '').slice(0, 400),
          blocos,
        }
      }),
      promessa: String(parsed.promessa || '').slice(0, 200),
      mensagem_final: String(parsed.mensagem_final || '').slice(0, 900),
    })
  } catch (err) {
    console.error('[ebook-plan] error:', err)
    const nomeAutor = nome || 'você'
    return Response.json(
      {
        titulo: `${tema}: O Guia Definitivo`,
        subtitulo: 'Tudo que você precisa saber para transformar sua vida',
        capitulos: [
          { numero: 1, titulo: `Os Segredos de ${tema}`, descricao: `Descubra os fundamentos essenciais que ninguém te contou sobre ${tema}. Este capítulo revela os conceitos que vão transformar sua visão sobre o tema e apontar o caminho certo desde o início.`, blocos: ['Bloco 1: Apresentação do tema e sua relevância no mundo atual.', 'Bloco 2: Os principais conceitos que todo iniciante precisa conhecer.', 'Bloco 3: Como este conhecimento pode transformar sua vida.', 'Bloco 4: O mapa do caminho que será percorrido ao longo do livro.'] },
          { numero: 2, titulo: `Como Começar do Zero`, descricao: `Um guia passo a passo para quem está iniciando em ${tema}. Aprenda os primeiros passos com clareza e confiança, sem precisar de experiência prévia.`, blocos: ['Bloco 1: Os primeiros passos práticos para dar início à jornada.', 'Bloco 2: Ferramentas e recursos essenciais para o iniciante.', 'Bloco 3: Como criar uma rotina de aprendizado eficiente.', 'Bloco 4: Primeiros resultados: o que esperar nas primeiras semanas.'] },
          { numero: 3, titulo: `Técnicas que Fazem a Diferença`, descricao: `Mergulhe fundo nas estratégias mais poderosas para avançar em ${tema}. Conteúdo exclusivo para quem quer ir além do básico e alcançar resultados extraordinários.`, blocos: ['Bloco 1: As técnicas mais utilizadas pelos especialistas do setor.', 'Bloco 2: Como aplicar cada técnica de forma prática e eficaz.', 'Bloco 3: Adaptando as estratégias para sua realidade específica.', 'Bloco 4: Medindo e ajustando resultados para maximizar o sucesso.'] },
          { numero: 4, titulo: `Os 7 Erros que Todo Mundo Comete`, descricao: `Evite os erros que 90% das pessoas cometem ao trabalhar com ${tema}. Aprenda com os fracassos alheios para ter sucesso mais rápido e com menos frustrações.`, blocos: ['Bloco 1: O erro mais comum que sabota os resultados logo no começo.', 'Bloco 2: Armadilhas mentais que impedem o progresso consistente.', 'Bloco 3: Erros de estratégia que custam tempo e dinheiro.', 'Bloco 4: Como identificar e corrigir erros antes que se tornem hábitos.'] },
          { numero: 5, titulo: `${tema} na Prática`, descricao: `Exemplos reais e casos de sucesso em ${tema}. Veja como aplicar tudo que aprendeu no mundo real com histórias inspiradoras de pessoas comuns.`, blocos: ['Bloco 1: Casos reais de sucesso que provam que qualquer um pode chegar lá.', 'Bloco 2: Análise detalhada de estratégias que funcionaram.', 'Bloco 3: Lições aprendidas e como adaptá-las ao seu contexto.', 'Bloco 4: Exercícios práticos para implementar o aprendizado imediatamente.'] },
          { numero: 6, titulo: `Acelerando seus Resultados`, descricao: `Estratégias comprovadas para multiplicar seus resultados em ${tema}. Trabalhe de forma mais inteligente, não apenas mais duro, e veja sua evolução decolar.`, blocos: ['Bloco 1: O princípio da alavancagem: como fazer mais com menos esforço.', 'Bloco 2: Técnicas de produtividade específicas para este contexto.', 'Bloco 3: Como criar sistemas que trabalham por você.', 'Bloco 4: Aceleradores de resultado que a maioria desconhece.'] },
          { numero: 7, titulo: `Ferramentas e Recursos Essenciais`, descricao: `As melhores ferramentas e recursos para dominar ${tema}. Tudo que você precisa para ter resultados profissionais sem complicação.`, blocos: ['Bloco 1: Visão geral das principais ferramentas disponíveis no mercado.', 'Bloco 2: Como escolher as ferramentas certas para o seu perfil.', 'Bloco 3: Configurando e otimizando cada ferramenta para máxima eficiência.', 'Bloco 4: Recursos gratuitos e pagos: onde investir seu tempo e dinheiro.'] },
          { numero: 8, titulo: `Construindo sua Autoridade`, descricao: `Como se tornar uma referência reconhecida em ${tema}. Estratégias para construir credibilidade, atrair oportunidades e ser procurado pelos melhores.`, blocos: ['Bloco 1: O que significa ser autoridade e por que isso muda tudo.', 'Bloco 2: Como construir uma reputação sólida do zero.', 'Bloco 3: Estratégias de posicionamento que atraem as melhores oportunidades.', 'Bloco 4: Mantendo e expandindo sua autoridade ao longo do tempo.'] },
          { numero: 9, titulo: `Superando Obstáculos`, descricao: `Como lidar com os desafios, bloqueios e momentos difíceis em ${tema}. Estratégias mentais e práticas para manter a consistência mesmo nos dias difíceis.`, blocos: ['Bloco 1: Os obstáculos mais comuns e por que eles surgem.', 'Bloco 2: Técnicas mentais para superar bloqueios e manter o foco.', 'Bloco 3: Como transformar adversidades em oportunidades de crescimento.', 'Bloco 4: Construindo resiliência para continuar mesmo quando é difícil.'] },
          { numero: 10, titulo: `Seu Próximo Nível`, descricao: `O roteiro completo para dar o próximo grande salto em ${tema}. Ação, consistência e os passos finais para alcançar o sucesso que você sempre sonhou.`, blocos: ['Bloco 1: Revisão dos principais aprendizados da jornada percorrida.', 'Bloco 2: Como criar um plano de ação personalizado para os próximos 90 dias.', 'Bloco 3: Metas de curto, médio e longo prazo para seu crescimento contínuo.', 'Bloco 4: A mensagem final: você tem tudo que precisa para transformar sua vida.'] },
        ],
        promessa: `Após ler este ebook, você terá todo o conhecimento para se destacar em ${tema} e alcançar resultados extraordinários.`,
        mensagem_final: `${nomeAutor}, quero parabenizá-lo de coração pelo projeto incrível do seu livro! O tema que você escolheu é simplesmente encantador e cheio de potencial para impactar a vida de muitas pessoas. Você conseguiu criar uma proposta que toca o coração e certamente vai ressoar com muitos leitores. O potencial desse livro é imenso!\n\nA maneira como você pensa sobre ${tema} é brilhante, e este ebook tem tudo para se tornar um grande sucesso. Você tem um talento incrível, e posso ver o quanto este livro poderá inspirar e transformar a vida das pessoas.\n\nEstou aqui, pronto para dar vida a essa história e começar a escrever todo o conteúdo para você. Assim que fizer o pagamento, poderei iniciar o trabalho imediatamente e, em menos de uma hora, você terá o livro pronto em suas mãos!`,
      },
      { status: 200 },
    )
  }
}
