'use client'

import { useParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import {
  ArrowLeft, Loader2, Copy, Check, Sparkles, RefreshCw,
  BookOpen, Image, Palette, Headphones, Rocket, Megaphone,
  Globe, Brush, PenTool, RefreshCw as RewriteIcon, Scissors, AlignLeft,
  BarChart2, Type, Layers, Database, Search, Wrench, ChevronDown,
  Download, FileText, Wand2,
} from 'lucide-react'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────────────────────────

type Field =
  | { type: 'text'; key: string; label: string; placeholder: string; required?: boolean }
  | { type: 'textarea'; key: string; label: string; placeholder: string; rows?: number; required?: boolean }
  | { type: 'select'; key: string; label: string; options: string[]; required?: boolean }
  | { type: 'radio'; key: string; label: string; options: { label: string; value: string }[] }
  | { type: 'tags'; key: string; label: string; options: string[] }

type ToolConfig = {
  titulo: string
  subtitulo: string
  icon: React.ElementType
  cor: string
  preco?: string
  creditos?: string
  tipo: 'pago' | 'credito'
  descricaoFerramenta: string
  fields: Field[]
  buildPrompt: (values: Record<string, string>) => string
  outputLabel: string
  outputSections?: string[]
}

// ─── Configs por ferramenta ───────────────────────────────────────────────────

const TOOLS: Record<string, ToolConfig> = {
  'escrita-livro': {
    titulo: 'Escrita do Livro',
    subtitulo: 'Geração completa com IA',
    icon: BookOpen, cor: '#4f7fff', preco: 'R$ 49,99', tipo: 'pago',
    descricaoFerramenta: 'Preencha as informações abaixo e a Aurora IA escreverá o esboço completo do seu livro com estrutura de capítulos, sinopse e o primeiro capítulo.',
    fields: [
      { type: 'text', key: 'titulo', label: 'Título do livro', placeholder: 'Ex: O Segredo das Finanças Simples', required: true },
      { type: 'select', key: 'genero', label: 'Gênero', options: ['Autoajuda', 'Finanças', 'Romance', 'Ficção Científica', 'Fantasia', 'Negócios', 'Desenvolvimento Pessoal', 'Educação', 'Thriller', 'Terror', 'Biografia', 'Infantil', 'Outro'], required: true },
      { type: 'text', key: 'publico', label: 'Público-alvo', placeholder: 'Ex: Jovens adultos de 20-35 anos interessados em independência financeira' },
      { type: 'radio', key: 'tom', label: 'Tom de voz', options: [{ label: 'Motivacional 🔥', value: 'motivacional' }, { label: 'Técnico 📊', value: 'tecnico' }, { label: 'Casual 😊', value: 'casual' }, { label: 'Inspirador 💡', value: 'inspirador' }] },
      { type: 'select', key: 'capitulos', label: 'Número de capítulos', options: ['5 capítulos', '8 capítulos', '10 capítulos', '12 capítulos', '15 capítulos', '20 capítulos'] },
      { type: 'textarea', key: 'descricao', label: 'Descrição do livro', placeholder: 'Do que se trata o livro? Qual problema ele resolve? Qual é o grande insight?', rows: 4, required: true },
    ],
    buildPrompt: (v) => `Crie a estrutura completa de um livro com as seguintes informações:

TÍTULO: ${v.titulo}
GÊNERO: ${v.genero}
PÚBLICO-ALVO: ${v.publico || 'Geral'}
TOM DE VOZ: ${v.tom || 'motivacional'}
NÚMERO DE CAPÍTULOS: ${v.capitulos || '10 capítulos'}
DESCRIÇÃO: ${v.descricao}

Entregue:
1. SINOPSE (150 palavras)
2. ESTRUTURA COMPLETA (lista de todos os capítulos com título e breve descrição de cada um)
3. PRIMEIRO CAPÍTULO COMPLETO (mínimo 800 palavras, com introdução impactante, desenvolvimento e gancho para o próximo capítulo)

Formate de forma clara com separadores entre as seções.`,
    outputLabel: 'Seu livro gerado',
    outputSections: ['Sinopse', 'Estrutura', 'Capítulo 1'],
  },

  'capa-profissional': {
    titulo: 'Capa Profissional',
    subtitulo: '4 variações de conceito visual',
    icon: Image, cor: '#8b5cf6', preco: 'R$ 99,99', tipo: 'pago',
    descricaoFerramenta: 'Descreva seu livro e receba 4 conceitos visuais completos de capa com paleta de cores, tipografia e direção de arte.',
    fields: [
      { type: 'text', key: 'titulo', label: 'Título do livro', placeholder: 'Ex: Mente Milionária', required: true },
      { type: 'text', key: 'subtitulo', label: 'Subtítulo (opcional)', placeholder: 'Ex: Como reprogramar suas finanças em 30 dias' },
      { type: 'select', key: 'genero', label: 'Gênero', options: ['Autoajuda', 'Finanças', 'Romance', 'Ficção Científica', 'Fantasia', 'Negócios', 'Thriller', 'Terror', 'Infantil', 'Outro'] },
      { type: 'radio', key: 'estilo', label: 'Estilo visual', options: [{ label: 'Minimalista moderno', value: 'minimalista' }, { label: 'Dramático e sombrio', value: 'dramatico' }, { label: 'Colorido e vibrante', value: 'vibrante' }, { label: 'Clássico literário', value: 'classico' }] },
      { type: 'tags', key: 'emocao', label: 'Emoção que a capa deve transmitir', options: ['Confiança', 'Mistério', 'Esperança', 'Urgência', 'Luxo', 'Aventura', 'Calma', 'Poder'] },
      { type: 'textarea', key: 'referencia', label: 'Referências ou inspirações (opcional)', placeholder: 'Ex: Algo como as capas da série Harry Potter, com cores escuras e elementos mágicos...', rows: 2 },
    ],
    buildPrompt: (v) => `Crie 4 conceitos visuais DISTINTOS de capa para o livro abaixo:

TÍTULO: ${v.titulo}
SUBTÍTULO: ${v.subtitulo || 'Não há'}
GÊNERO: ${v.genero || 'Não especificado'}
ESTILO: ${v.estilo || 'minimalista'}
EMOÇÃO: ${v.emocao || 'Não especificado'}
REFERÊNCIAS: ${v.referencia || 'Nenhuma'}

Para cada um dos 4 conceitos, entregue:
- NOME DO CONCEITO (ex: "Conceito Aurora", "Conceito Sombra")
- PALETA DE CORES: 3 cores principais com código HEX
- TIPOGRAFIA: fonte principal e secundária sugeridas (fontes do Google Fonts)
- COMPOSIÇÃO: descrição detalhada dos elementos visuais, posição e hierarquia
- MOOD: a sensação que esse conceito transmite
- PROMPT PARA IA: prompt em inglês pronto para gerar essa capa no Midjourney ou DALL-E

Separe cada conceito claramente.`,
    outputLabel: '4 conceitos de capa',
  },

  'ajuste-capa': {
    titulo: 'Ajuste de Capa',
    subtitulo: 'Refinamentos precisos na capa atual',
    icon: Palette, cor: '#ec4899', preco: 'R$ 19,99', tipo: 'pago',
    descricaoFerramenta: 'Descreva sua capa atual e o que deseja ajustar. Receba instruções precisas e alternativas criativas.',
    fields: [
      { type: 'text', key: 'titulo', label: 'Título do livro', placeholder: 'Ex: Finanças para Todos', required: true },
      { type: 'textarea', key: 'capaAtual', label: 'Descreva sua capa atual', placeholder: 'Ex: Fundo azul escuro, título em branco no centro com fonte serif, imagem de moedas no canto inferior...', rows: 3, required: true },
      { type: 'tags', key: 'ajuste', label: 'O que deseja ajustar?', options: ['Cores', 'Tipografia', 'Layout', 'Imagem de fundo', 'Título', 'Subtítulo', 'Contraste', 'Textura'] },
      { type: 'textarea', key: 'objetivo', label: 'O que você quer alcançar com o ajuste?', placeholder: 'Ex: Quero que fique mais moderno e transmita mais confiança para o público corporativo', rows: 2 },
      { type: 'radio', key: 'nivel', label: 'Nível do ajuste', options: [{ label: 'Pequeno refinamento', value: 'pequeno' }, { label: 'Ajuste moderado', value: 'moderado' }, { label: 'Reformulação completa', value: 'completo' }] },
    ],
    buildPrompt: (v) => `Analise a capa descrita e sugira ajustes específicos:

TÍTULO DO LIVRO: ${v.titulo}
CAPA ATUAL: ${v.capaAtual}
ELEMENTOS A AJUSTAR: ${v.ajuste || 'Geral'}
OBJETIVO: ${v.objetivo || 'Modernizar'}
NÍVEL DO AJUSTE: ${v.nivel || 'moderado'}

Entregue:
1. ANÁLISE DA CAPA ATUAL: pontos fortes e fracos
2. AJUSTES RECOMENDADOS: instruções detalhadas e precisas para cada elemento
3. ALTERNATIVA A: versão com ajuste conservador (mantém identidade)
4. ALTERNATIVA B: versão com ajuste ousado (nova identidade visual)
5. DICAS TÉCNICAS: especificações de cor (HEX), tamanho de fonte e proporções`,
    outputLabel: 'Plano de ajuste da capa',
  },

  'audiobook': {
    titulo: 'Audiobook Premium',
    subtitulo: 'Roteiro narrado profissional',
    icon: Headphones, cor: '#f97316', preco: 'R$ 409,99', tipo: 'pago',
    descricaoFerramenta: 'Cole o texto do seu capítulo e receba o roteiro adaptado para narração com marcações profissionais.',
    fields: [
      { type: 'text', key: 'titulo', label: 'Título do livro / capítulo', placeholder: 'Ex: Capítulo 1 — O Início da Jornada', required: true },
      { type: 'radio', key: 'narrador', label: 'Estilo do narrador', options: [{ label: 'Calmo e reflexivo', value: 'calmo' }, { label: 'Dramático e intenso', value: 'dramatico' }, { label: 'Animado e enérgico', value: 'animado' }, { label: 'Neutro e profissional', value: 'neutro' }] },
      { type: 'select', key: 'ritmo', label: 'Ritmo da narração', options: ['Lento e pausado', 'Moderado', 'Dinâmico', 'Variado conforme emoção'] },
      { type: 'textarea', key: 'texto', label: 'Texto do capítulo', placeholder: 'Cole aqui o texto que deseja adaptar para audiobook...', rows: 8, required: true },
    ],
    buildPrompt: (v) => `Adapte o texto abaixo para roteiro de audiobook profissional:

TÍTULO: ${v.titulo}
ESTILO DO NARRADOR: ${v.narrador || 'calmo'}
RITMO: ${v.ritmo || 'Moderado'}

TEXTO ORIGINAL:
${v.texto}

Entregue o texto adaptado com estas marcações profissionais de narração:
- [PAUSA CURTA] — pausa de 0,5 segundo
- [PAUSA LONGA] — pausa de 1-2 segundos
- [ÊNFASE] palavra [/ÊNFASE] — palavra com destaque
- [RITMO LENTO] trecho [/RITMO LENTO] — desacelerar
- [RITMO RÁPIDO] trecho [/RITMO RÁPIDO] — acelerar
- [EMOCIONAL] trecho [/EMOCIONAL] — tom emotivo
- [VOZ BAIXA] trecho [/VOZ BAIXA] — sussurar/intimidade
- (Nota do narrador: instrução específica) — direção de cena

Após o roteiro, inclua:
FICHA TÉCNICA DE NARRAÇÃO: tempo estimado, tom geral, instruções para o locutor.`,
    outputLabel: 'Roteiro de audiobook',
  },

  'preparacao-publicacao': {
    titulo: 'Preparação para Publicação',
    subtitulo: 'Checklist e textos prontos',
    icon: Rocket, cor: '#00e5c3', preco: 'R$ 39,99', tipo: 'pago',
    descricaoFerramenta: 'Informe os dados do livro e a plataforma de publicação. Receba checklist completo e todos os textos prontos para publicar.',
    fields: [
      { type: 'text', key: 'titulo', label: 'Título do livro', placeholder: 'Ex: Finanças Pessoais para Iniciantes', required: true },
      { type: 'text', key: 'autor', label: 'Nome do autor', placeholder: 'Ex: João Silva', required: true },
      { type: 'select', key: 'genero', label: 'Gênero / Categoria', options: ['Autoajuda', 'Finanças', 'Negócios', 'Romance', 'Ficção', 'Educação', 'Saúde', 'Culinária', 'Outro'] },
      { type: 'tags', key: 'plataforma', label: 'Plataforma(s) de publicação', options: ['Amazon KDP', 'Hotmart', 'Eduzz', 'Gumroad', 'Kiwify', 'Google Play Books', 'Smashwords'] },
      { type: 'textarea', key: 'sinopse', label: 'Sinopse breve do livro', placeholder: 'Descreva em 2-3 frases do que trata o livro e o que o leitor vai aprender/sentir', rows: 3, required: true },
      { type: 'text', key: 'preco', label: 'Preço pretendido (R$)', placeholder: 'Ex: 29,90' },
    ],
    buildPrompt: (v) => `Prepare a publicação completa do livro abaixo:

TÍTULO: ${v.titulo}
AUTOR: ${v.autor}
GÊNERO: ${v.genero || 'Não especificado'}
PLATAFORMAS: ${v.plataforma || 'Amazon KDP, Hotmart'}
SINOPSE: ${v.sinopse}
PREÇO: ${v.preco ? 'R$ ' + v.preco : 'A definir'}

Entregue TUDO pronto para publicar:

1. ✅ CHECKLIST DE PUBLICAÇÃO (passo a passo completo)
2. 📝 DESCRIÇÃO CURTA (150 caracteres — para metadados)
3. 📄 DESCRIÇÃO LONGA (400-500 palavras — para página de vendas)
4. 🔍 7 PALAVRAS-CHAVE (otimizadas para busca)
5. 📂 CATEGORIAS RECOMENDADAS (para cada plataforma informada)
6. 💰 ESTRATÉGIA DE PREÇO (justificativa e sugestão de precificação)
7. 🏷️ TAGS PARA REDES SOCIAIS (10 hashtags)`,
    outputLabel: 'Kit completo de publicação',
  },

  'material-marketing': {
    titulo: 'Material de Marketing',
    subtitulo: 'Copies e peças prontas',
    icon: Megaphone, cor: '#facc15', preco: 'R$ 7,99–19,99', tipo: 'pago',
    descricaoFerramenta: 'Informe o livro e o tipo de peça. Receba copy pronto, otimizado para conversão.',
    fields: [
      { type: 'text', key: 'titulo', label: 'Título do livro', placeholder: 'Ex: Desperte Seu Potencial', required: true },
      { type: 'text', key: 'nicho', label: 'Nicho / tema', placeholder: 'Ex: Desenvolvimento pessoal para mulheres 30+' },
      { type: 'text', key: 'preco', label: 'Preço do livro', placeholder: 'Ex: R$ 37' },
      { type: 'tags', key: 'peca', label: 'Tipo de peça', options: ['Post Instagram', 'Story Instagram', 'Email de lançamento', 'Email de abandono', 'Anúncio Facebook/Meta', 'Página de vendas', 'Bio do autor', 'Título de vídeo YouTube', 'Script de vídeo curto'] },
      { type: 'radio', key: 'angulo', label: 'Ângulo da comunicação', options: [{ label: 'Benefício direto', value: 'beneficio' }, { label: 'Dor/problema', value: 'dor' }, { label: 'Curiosidade/mistério', value: 'curiosidade' }, { label: 'Prova social', value: 'prova' }] },
      { type: 'textarea', key: 'diferencial', label: 'Diferencial do livro', placeholder: 'O que torna este livro único? Qual a promessa principal?', rows: 2 },
    ],
    buildPrompt: (v) => `Crie materiais de marketing de alta conversão para o livro abaixo:

TÍTULO: ${v.titulo}
NICHO: ${v.nicho || 'Não especificado'}
PREÇO: ${v.preco ? 'R$ ' + v.preco : 'Não informado'}
PEÇAS NECESSÁRIAS: ${v.peca || 'Post Instagram, Email de lançamento'}
ÂNGULO: ${v.angulo || 'beneficio'}
DIFERENCIAL: ${v.diferencial || 'Não informado'}

Para CADA peça solicitada, entregue o material completo com:
- Título/headline impactante
- Corpo do texto (pronto para usar, sem precisar editar)
- Call to action
- Emojis estratégicos onde aplicável
- Dicas de design/formato para cada peça

Foque em conversão real. Evite clichês.`,
    outputLabel: 'Materiais de marketing prontos',
  },

  'traducao': {
    titulo: 'Tradução',
    subtitulo: 'Tradução literária fiel ao estilo',
    icon: Globe, cor: '#06b6d4', preco: 'R$ 29,99 / idioma', tipo: 'pago',
    descricaoFerramenta: 'Cole o texto e selecione o idioma de destino. A IA preserva o estilo, tom e voz do autor na tradução.',
    fields: [
      { type: 'text', key: 'tituloLivro', label: 'Título do livro', placeholder: 'Ex: Segredos do Sucesso' },
      { type: 'select', key: 'idiomaOrigem', label: 'Idioma de origem', options: ['Português (BR)', 'Português (PT)', 'Inglês', 'Espanhol', 'Francês', 'Italiano', 'Alemão'] },
      { type: 'select', key: 'idiomaDestino', label: 'Idioma de destino', options: ['Inglês (US)', 'Inglês (UK)', 'Espanhol (ES)', 'Espanhol (LATAM)', 'Francês', 'Italiano', 'Alemão', 'Japonês', 'Mandarim', 'Árabe'], required: true },
      { type: 'radio', key: 'estilo', label: 'Prioridade da tradução', options: [{ label: 'Fidelidade literal', value: 'literal' }, { label: 'Fluência natural', value: 'fluente' }, { label: 'Adaptação cultural', value: 'cultural' }] },
      { type: 'textarea', key: 'texto', label: 'Texto para traduzir', placeholder: 'Cole aqui o trecho do livro que deseja traduzir...', rows: 8, required: true },
    ],
    buildPrompt: (v) => `Traduza o texto abaixo com qualidade literária profissional:

LIVRO: ${v.tituloLivro || 'Não informado'}
DE: ${v.idiomaOrigem || 'Português (BR)'}
PARA: ${v.idiomaDestino}
PRIORIDADE: ${v.estilo || 'fluente'}

TEXTO ORIGINAL:
${v.texto}

Entregue:
1. TRADUÇÃO COMPLETA (preserve o estilo, ritmo e voz do autor)
2. NOTAS DO TRADUTOR (explique escolhas importantes, adaptações culturais, termos sem equivalente direto)
3. GLOSSÁRIO (se houver termos técnicos ou culturais, liste original → traduzido)`,
    outputLabel: 'Tradução profissional',
  },

  'ilustracoes': {
    titulo: 'Ilustrações',
    subtitulo: 'Prompts para IA generativa',
    icon: Brush, cor: '#a78bfa', preco: 'R$ 9,99–14,99 / imagem', tipo: 'pago',
    descricaoFerramenta: 'Descreva a cena ou personagem e receba prompts detalhados prontos para Midjourney, DALL-E ou Leonardo AI.',
    fields: [
      { type: 'text', key: 'tituloLivro', label: 'Título do livro', placeholder: 'Ex: A Floresta Encantada' },
      { type: 'select', key: 'tipo', label: 'Tipo de ilustração', options: ['Cena narrativa', 'Personagem', 'Cenário/ambiente', 'Objeto mágico/especial', 'Mapa', 'Capa do livro', 'Ilustração de capítulo', 'Ícone/símbolo'] },
      { type: 'radio', key: 'estilo', label: 'Estilo artístico', options: [{ label: 'Realista', value: 'realista' }, { label: 'Aquarela', value: 'aquarela' }, { label: 'Anime/Mangá', value: 'anime' }, { label: 'Cartoon', value: 'cartoon' }] },
      { type: 'tags', key: 'ferramenta', label: 'Ferramenta de IA', options: ['Midjourney', 'DALL-E 3', 'Leonardo AI', 'Stable Diffusion', 'Adobe Firefly'] },
      { type: 'textarea', key: 'descricao', label: 'Descreva o que quer ilustrar', placeholder: 'Ex: Uma jovem feiticeira de cabelos ruivos, olhos verdes, vestindo manto azul escuro, em pé diante de um portal mágico brilhante na floresta à noite...', rows: 4, required: true },
      { type: 'select', key: 'humor', label: 'Atmosfera/humor', options: ['Épico e grandioso', 'Mágico e sonhador', 'Sombrio e misterioso', 'Alegre e colorido', 'Melancólico', 'Tenso e dramático'] },
    ],
    buildPrompt: (v) => `Crie prompts profissionais de ilustração para:

LIVRO: ${v.tituloLivro || 'Não informado'}
TIPO: ${v.tipo || 'Cena narrativa'}
ESTILO: ${v.estilo || 'realista'}
FERRAMENTA(S): ${v.ferramenta || 'Midjourney'}
DESCRIÇÃO: ${v.descricao}
ATMOSFERA: ${v.humor || 'Épico e grandioso'}

Entregue:
1. PROMPT PRINCIPAL em inglês (otimizado para a ferramenta escolhida, com parâmetros técnicos)
2. PROMPT ALTERNATIVO (variação de estilo/composição)
3. PROMPT DE PERSONAGEM (se aplicável — close-up, detalhes físicos)
4. NEGATIVE PROMPT (o que evitar na geração)
5. DICAS TÉCNICAS: parâmetros de qualidade, aspect ratio recomendado, seeds sugeridos
6. VERSÃO EM PORTUGUÊS (para referência do autor)`,
    outputLabel: 'Prompts de ilustração',
  },

  'novo-capitulo': {
    titulo: 'Criar novo capítulo',
    subtitulo: 'Capítulo completo com gancho',
    icon: PenTool, cor: '#4f7fff', creditos: '488 créditos', tipo: 'credito',
    descricaoFerramenta: 'Informe o contexto e a Aurora IA escreverá um capítulo completo com introdução, desenvolvimento e gancho para o próximo.',
    fields: [
      { type: 'text', key: 'tituloCapitulo', label: 'Título do capítulo', placeholder: 'Ex: Capítulo 3 — A Grande Virada', required: true },
      { type: 'text', key: 'tituloLivro', label: 'Título do livro', placeholder: 'Ex: O Caminho do Sucesso' },
      { type: 'select', key: 'genero', label: 'Gênero', options: ['Autoajuda', 'Ficção', 'Romance', 'Thriller', 'Fantasia', 'Negócios', 'Educação', 'Biografia', 'Outro'] },
      { type: 'textarea', key: 'contexto', label: 'O que aconteceu até aqui?', placeholder: 'Resuma brevemente o que ocorreu nos capítulos anteriores...', rows: 3 },
      { type: 'textarea', key: 'objetivo', label: 'Objetivo deste capítulo', placeholder: 'O que este capítulo deve revelar, ensinar ou fazer o leitor sentir?', rows: 2, required: true },
      { type: 'radio', key: 'extensao', label: 'Extensão desejada', options: [{ label: 'Curto (~500 palavras)', value: 'curto' }, { label: 'Médio (~1000 palavras)', value: 'medio' }, { label: 'Longo (~1500 palavras)', value: 'longo' }] },
    ],
    buildPrompt: (v) => `Escreva um capítulo completo para o livro abaixo:

TÍTULO DO CAPÍTULO: ${v.tituloCapitulo}
LIVRO: ${v.tituloLivro || 'Não informado'}
GÊNERO: ${v.genero || 'Não especificado'}
CONTEXTO ANTERIOR: ${v.contexto || 'Primeiro capítulo'}
OBJETIVO DO CAPÍTULO: ${v.objetivo}
EXTENSÃO: ${v.extensao || 'medio'}

Escreva o capítulo completo com:
- Abertura impactante (hook nos primeiros 2 parágrafos)
- Desenvolvimento sólido com progressão clara
- Encerramento com gancho poderoso para o próximo capítulo
- Tom consistente com o gênero
- Linguagem fluida e envolvente

Entregue o capítulo pronto, formatado e completo.`,
    outputLabel: 'Capítulo gerado',
  },

  'reescrever-capitulo': {
    titulo: 'Reescrever capítulo inteiro',
    subtitulo: 'Versão melhorada completa',
    icon: RefreshCw, cor: '#8b5cf6', creditos: '735 créditos', tipo: 'credito',
    descricaoFerramenta: 'Cole o capítulo atual, indique o problema e receba uma versão completamente reescrita e melhorada.',
    fields: [
      { type: 'text', key: 'tituloCapitulo', label: 'Título do capítulo', placeholder: 'Ex: Capítulo 2 — O Encontro' },
      { type: 'tags', key: 'problema', label: 'O que não está funcionando?', options: ['Ritmo lento', 'Diálogos artificiais', 'Falta profundidade', 'Tom inadequado', 'Falta coesão', 'Muito longo', 'Muito superficial', 'Estrutura fraca'] },
      { type: 'radio', key: 'foco', label: 'Foco da reescrita', options: [{ label: 'Manter conteúdo, melhorar forma', value: 'forma' }, { label: 'Aprofundar conteúdo', value: 'conteudo' }, { label: 'Reformulação completa', value: 'completo' }] },
      { type: 'textarea', key: 'instrucoes', label: 'Instruções específicas (opcional)', placeholder: 'Ex: Quero que fique mais emocional, com mais descrições sensoriais e menos explicações técnicas...' },
      { type: 'textarea', key: 'texto', label: 'Capítulo atual', placeholder: 'Cole aqui o texto do capítulo que deseja reescrever...', rows: 8, required: true },
    ],
    buildPrompt: (v) => `Reescreva o capítulo abaixo com melhorias substanciais:

CAPÍTULO: ${v.tituloCapitulo || 'Sem título'}
PROBLEMAS IDENTIFICADOS: ${v.problema || 'Geral'}
FOCO: ${v.foco || 'forma'}
INSTRUÇÕES ESPECÍFICAS: ${v.instrucoes || 'Nenhuma'}

TEXTO ORIGINAL:
${v.texto}

Reescreva o capítulo completo mantendo a essência da história mas com:
- Abertura mais impactante
- Melhor ritmo e fluidez
- Diálogos mais naturais (se houver)
- Descrições mais vívidas
- Encerramento mais forte

Após o capítulo reescrito, inclua uma seção "O QUE FOI MELHORADO" com as principais mudanças feitas.`,
    outputLabel: 'Capítulo reescrito',
  },

  'reescrever-secao': {
    titulo: 'Reescrever seção',
    subtitulo: 'Melhoria de trecho específico',
    icon: Scissors, cor: '#ec4899', creditos: '499 créditos', tipo: 'credito',
    descricaoFerramenta: 'Cole a seção e indique o objetivo. Receba a versão melhorada com explicação das mudanças.',
    fields: [
      { type: 'radio', key: 'objetivo', label: 'Objetivo da melhoria', options: [{ label: 'Mais fluidez', value: 'fluidade' }, { label: 'Mais impacto emocional', value: 'emocional' }, { label: 'Mais clareza', value: 'clareza' }, { label: 'Mais detalhes', value: 'detalhes' }] },
      { type: 'select', key: 'tom', label: 'Tom desejado', options: ['Manter o original', 'Mais formal', 'Mais casual', 'Mais poético', 'Mais direto', 'Mais dramático', 'Mais técnico'] },
      { type: 'textarea', key: 'instrucoes', label: 'Instruções adicionais (opcional)', placeholder: 'Ex: Adicione mais detalhes sensoriais, evite repetição do verbo "ser"...' },
      { type: 'textarea', key: 'texto', label: 'Seção a melhorar', placeholder: 'Cole aqui a seção do texto que deseja melhorar...', rows: 7, required: true },
    ],
    buildPrompt: (v) => `Reescreva a seção abaixo com foco específico:

OBJETIVO: ${v.objetivo || 'fluidade'}
TOM: ${v.tom || 'Manter o original'}
INSTRUÇÕES: ${v.instrucoes || 'Nenhuma'}

TEXTO ORIGINAL:
${v.texto}

Entregue:
1. VERSÃO MELHORADA (completa e pronta para usar)
2. O QUE MUDOU (lista das principais alterações e por quê)`,
    outputLabel: 'Seção reescrita',
  },

  'reescrever-paragrafo': {
    titulo: 'Reescrever parágrafo',
    subtitulo: '3 variações criativas',
    icon: AlignLeft, cor: '#f97316', creditos: '348 créditos', tipo: 'credito',
    descricaoFerramenta: 'Cole o parágrafo e receba 3 versões distintas: máximo impacto, máxima clareza e máxima emoção.',
    fields: [
      { type: 'select', key: 'contexto', label: 'Contexto do parágrafo', options: ['Abertura de capítulo', 'Cena de ação', 'Descrição de personagem', 'Descrição de cenário', 'Diálogo narrativo', 'Clímax', 'Conclusão', 'Reflexão do personagem', 'Outro'] },
      { type: 'radio', key: 'foco', label: 'Foco principal', options: [{ label: 'Impacto máximo', value: 'impacto' }, { label: 'Clareza máxima', value: 'clareza' }, { label: 'Emoção máxima', value: 'emocao' }] },
      { type: 'textarea', key: 'texto', label: 'Parágrafo original', placeholder: 'Cole aqui o parágrafo que deseja melhorar...', rows: 5, required: true },
    ],
    buildPrompt: (v) => `Reescreva o parágrafo abaixo em 3 versões distintas:

CONTEXTO: ${v.contexto || 'Geral'}
FOCO: ${v.foco || 'impacto'}

PARÁGRAFO ORIGINAL:
${v.texto}

Entregue EXATAMENTE 3 versões:

VERSÃO 1 — IMPACTO MÁXIMO: foco em causar surpresa, curiosidade ou forte impressão no leitor

VERSÃO 2 — CLAREZA MÁXIMA: foco em ser absolutamente compreensível, direto e sem ambiguidade

VERSÃO 3 — EMOÇÃO MÁXIMA: foco em criar conexão emocional profunda, usando recursos sensoriais e psicológicos

Após as 3 versões, indique qual você recomenda e por quê.`,
    outputLabel: '3 variações do parágrafo',
  },

  'corrigir-capitulo': {
    titulo: 'Corrigir texto do capítulo',
    subtitulo: 'Revisão ortográfica e gramatical',
    icon: Wrench, cor: '#00e5c3', creditos: '116 créditos', tipo: 'credito',
    descricaoFerramenta: 'Cole o texto e receba a versão corrigida com relatório detalhado de todas as correções feitas.',
    fields: [
      { type: 'tags', key: 'foco', label: 'Foco da revisão', options: ['Ortografia', 'Gramática', 'Pontuação', 'Concordância', 'Coesão', 'Repetição de palavras', 'Estilo', 'Todos'] },
      { type: 'select', key: 'norma', label: 'Norma do português', options: ['Português Brasileiro (BR)', 'Português Europeu (PT)'] },
      { type: 'textarea', key: 'texto', label: 'Texto para corrigir', placeholder: 'Cole aqui o texto do capítulo que deseja revisar...', rows: 8, required: true },
    ],
    buildPrompt: (v) => `Faça uma revisão completa do texto abaixo:

FOCO: ${v.foco || 'Todos'}
NORMA: ${v.norma || 'Português Brasileiro (BR)'}

TEXTO ORIGINAL:
${v.texto}

Entregue:
1. TEXTO CORRIGIDO (versão final limpa e pronta)
2. RELATÓRIO DE CORREÇÕES (lista de cada erro encontrado → correção aplicada → regra gramatical)
3. ESTATÍSTICAS: número total de correções por categoria (ortografia, gramática, pontuação, etc.)
4. DICAS RECORRENTES: padrões de erro do autor para evitar no futuro`,
    outputLabel: 'Texto corrigido + relatório',
  },

  'analise-editorial': {
    titulo: 'Análise editorial',
    subtitulo: 'Relatório editorial profissional',
    icon: BarChart2, cor: '#facc15', creditos: '65 créditos', tipo: 'credito',
    descricaoFerramenta: 'Cole o capítulo e receba uma análise editorial profissional com scores, pontos fortes, fracos e sugestões concretas.',
    fields: [
      { type: 'text', key: 'tituloCapitulo', label: 'Título do capítulo', placeholder: 'Ex: Capítulo 1 — O Despertar' },
      { type: 'select', key: 'genero', label: 'Gênero do livro', options: ['Ficção literária', 'Ficção popular', 'Romance', 'Thriller/Suspense', 'Fantasia', 'Autoajuda', 'Negócios', 'Biografia', 'Educativo', 'Infantojuvenil'] },
      { type: 'radio', key: 'nivel', label: 'Nível de crítica desejado', options: [{ label: 'Construtivo e gentil', value: 'gentil' }, { label: 'Equilibrado', value: 'equilibrado' }, { label: 'Crítico e exigente', value: 'critico' }] },
      { type: 'textarea', key: 'texto', label: 'Capítulo para análise', placeholder: 'Cole aqui o capítulo completo para análise editorial...', rows: 8, required: true },
    ],
    buildPrompt: (v) => `Faça uma análise editorial profissional do capítulo abaixo:

CAPÍTULO: ${v.tituloCapitulo || 'Não informado'}
GÊNERO: ${v.genero || 'Ficção'}
NÍVEL DE CRÍTICA: ${v.nivel || 'equilibrado'}

TEXTO:
${v.texto}

Entregue um relatório editorial completo:

📊 SCORES (de 0 a 10):
- Estrutura narrativa
- Ritmo e fluidez
- Desenvolvimento de personagens
- Diálogos
- Descrições e ambientação
- Originalidade
- Engajamento do leitor
- NOTA GERAL

✅ PONTOS FORTES (o que está funcionando bem)
⚠️ PONTOS DE MELHORIA (o que precisa de atenção)
💡 SUGESTÕES CONCRETAS (como melhorar cada ponto fraco)
📚 COMPARAÇÃO DE MERCADO (como este capítulo se posiciona no gênero)
🎯 PRÓXIMOS PASSOS (lista de ações prioritárias)`,
    outputLabel: 'Relatório editorial',
  },

  'editar-texto-capa': {
    titulo: 'Editar texto da capa',
    subtitulo: 'Copywriting de impacto',
    icon: Type, cor: '#06b6d4', creditos: '498 créditos', tipo: 'credito',
    descricaoFerramenta: 'Informe os dados do livro e receba título, subtítulo, tagline e texto da contracapa com copywriting de alta conversão.',
    fields: [
      { type: 'text', key: 'temaLivro', label: 'Tema / assunto do livro', placeholder: 'Ex: Como sair das dívidas e construir riqueza em 12 meses', required: true },
      { type: 'select', key: 'genero', label: 'Gênero', options: ['Autoajuda', 'Finanças', 'Negócios', 'Romance', 'Ficção', 'Thriller', 'Fantasia', 'Educação', 'Saúde', 'Outro'] },
      { type: 'text', key: 'publico', label: 'Público-alvo', placeholder: 'Ex: Pessoas endividadas entre 25-45 anos que querem mudar de vida' },
      { type: 'radio', key: 'tom', label: 'Tom do texto', options: [{ label: 'Motivacional e empoderador', value: 'motivacional' }, { label: 'Técnico e confiável', value: 'tecnico' }, { label: 'Provocativo e direto', value: 'provocativo' }, { label: 'Acolhedor e empático', value: 'acolhedor' }] },
      { type: 'textarea', key: 'promessa', label: 'Promessa principal do livro', placeholder: 'O que o leitor vai conquistar/aprender/sentir depois de ler?', rows: 2 },
    ],
    buildPrompt: (v) => `Crie todos os textos de capa e contracapa para o livro abaixo:

TEMA: ${v.temaLivro}
GÊNERO: ${v.genero || 'Não especificado'}
PÚBLICO: ${v.publico || 'Geral'}
TOM: ${v.tom || 'motivacional'}
PROMESSA: ${v.promessa || 'Não informada'}

Entregue TODAS as opções:

📌 TÍTULO PRINCIPAL (5 opções de títulos impactantes)
📌 SUBTÍTULO (3 opções de subtítulos complementares)
📌 TAGLINE (5 frases curtas de 1 linha para marketing)
📌 TEXTO DA CONTRACAPA (versão completa de 120-150 palavras)
📌 TEXTO DA CONTRACAPA (versão curta de 60-80 palavras)
📌 FRASE DE ABERTURA (para usar dentro do livro, na primeira página)

Para cada item, explique brevemente a estratégia de copywriting usada.`,
    outputLabel: 'Textos de capa completos',
  },

  'editar-estilo-capa': {
    titulo: 'Editar estilo da capa',
    subtitulo: 'Novas direções visuais',
    icon: Layers, cor: '#a78bfa', creditos: '720 créditos', tipo: 'credito',
    descricaoFerramenta: 'Informe o livro e receba um concept board textual completo com novas direções visuais para a capa.',
    fields: [
      { type: 'text', key: 'titulo', label: 'Título do livro', placeholder: 'Ex: A Última Fronteira', required: true },
      { type: 'select', key: 'genero', label: 'Gênero', options: ['Ficção Científica', 'Fantasia', 'Thriller', 'Romance', 'Autoajuda', 'Negócios', 'Terror', 'Histórico', 'YA', 'Infantil'] },
      { type: 'text', key: 'publicoAlvo', label: 'Público-alvo', placeholder: 'Ex: Jovens adultos apreciadores de ficção científica' },
      { type: 'tags', key: 'problemas', label: 'O que não está bom na capa atual?', options: ['Cores sem identidade', 'Tipografia fraca', 'Não representa o gênero', 'Visual desatualizado', 'Falta impacto', 'Muito genérico', 'Não atrai o público'] },
      { type: 'radio', key: 'direcao', label: 'Direção desejada', options: [{ label: 'Evolução do atual', value: 'evolucao' }, { label: 'Mudança radical', value: 'radical' }, { label: 'Acompanhar tendências do mercado', value: 'tendencia' }] },
      { type: 'textarea', key: 'referencia', label: 'Capas que admira (opcional)', placeholder: 'Ex: Gosto das capas da série Jogos Vorazes, Duna, It...', rows: 2 },
    ],
    buildPrompt: (v) => `Crie um concept board textual completo para redesign da capa:

LIVRO: ${v.titulo}
GÊNERO: ${v.genero || 'Não especificado'}
PÚBLICO: ${v.publicoAlvo || 'Geral'}
PROBLEMAS ATUAIS: ${v.problemas || 'Geral'}
DIREÇÃO: ${v.direcao || 'evolucao'}
REFERÊNCIAS: ${v.referencia || 'Nenhuma'}

Entregue um CONCEPT BOARD TEXTUAL completo com 3 direções criativas:

Para cada direção:
🎨 NOME DA DIREÇÃO (nome criativo do conceito)
🖼️ CONCEITO VISUAL (descrição vívida do que o leitor vai ver)
🎨 PALETA DE CORES (5 cores com HEX + nome descritivo de cada uma)
✍️ TIPOGRAFIA (família da fonte + peso + tamanho relativo + posicionamento)
📐 COMPOSIÇÃO (layout, hierarquia visual, regra dos terços)
✨ ELEMENTOS ESPECIAIS (texturas, efeitos, ícones, padrões)
🌍 REFERÊNCIAS DE MERCADO (capas famosas com estilo similar)
🤖 PROMPT MIDJOURNEY (prompt completo em inglês para gerar preview)`,
    outputLabel: 'Concept board visual',
  },

  'metadados': {
    titulo: 'Gerar metadados',
    subtitulo: 'SEO completo para publicação',
    icon: Database, cor: '#34d399', creditos: '260 créditos', tipo: 'credito',
    descricaoFerramenta: 'Informe os dados do livro e receba metadados completos otimizados para Amazon KDP, Hotmart e buscadores.',
    fields: [
      { type: 'text', key: 'titulo', label: 'Título do livro', placeholder: 'Ex: Finanças Pessoais do Zero', required: true },
      { type: 'text', key: 'autor', label: 'Nome do autor', placeholder: 'Ex: Maria Santos' },
      { type: 'select', key: 'genero', label: 'Gênero principal', options: ['Autoajuda', 'Finanças', 'Negócios', 'Romance', 'Ficção', 'Ficção Científica', 'Fantasia', 'Thriller', 'Terror', 'Educação', 'Saúde', 'Culinária', 'Viagem', 'Infantil', 'Outro'] },
      { type: 'select', key: 'plataforma', label: 'Plataforma principal', options: ['Amazon KDP', 'Hotmart', 'Eduzz', 'Kiwify', 'Google Play Books', 'Smashwords', 'Todas'] },
      { type: 'textarea', key: 'descricao', label: 'Descrição livre do livro', placeholder: 'Descreva o livro, seus temas principais, público e diferenciais...', rows: 4, required: true },
      { type: 'text', key: 'idioma', label: 'Idioma do livro', placeholder: 'Ex: Português Brasileiro' },
    ],
    buildPrompt: (v) => `Gere metadados SEO completos para publicação do livro:

TÍTULO: ${v.titulo}
AUTOR: ${v.autor || 'Não informado'}
GÊNERO: ${v.genero || 'Não especificado'}
PLATAFORMA: ${v.plataforma || 'Todas'}
IDIOMA: ${v.idioma || 'Português Brasileiro'}
DESCRIÇÃO: ${v.descricao}

Entregue TODOS os metadados:

📝 TÍTULO SEO (título otimizado para busca, máx. 60 caracteres)
📝 SUBTÍTULO SEO (complemento estratégico, máx. 100 caracteres)
📄 DESCRIÇÃO CURTA (máx. 150 caracteres — para cards e metadados)
📄 DESCRIÇÃO MÉDIA (250-300 palavras — para listagens)
📄 DESCRIÇÃO LONGA (500+ palavras — para página de produto)
🔍 PALAVRAS-CHAVE PRINCIPAIS (10 keywords com volume de busca estimado)
🔍 PALAVRAS-CHAVE DE CAUDA LONGA (10 frases de 3-5 palavras)
📂 CATEGORIAS BISAC (códigos e categorias para cada plataforma)
🏷️ TAGS (20 tags para redes sociais e plataformas)
🌐 SLUG URL SUGERIDO (URL amigável)
🔢 ISBN placeholder e metadados técnicos`,
    outputLabel: 'Metadados SEO completos',
  },

  'buscar-substituir': {
    titulo: 'Buscar e substituir',
    subtitulo: 'Consistência em todo o manuscrito',
    icon: Search, cor: '#fb7185', creditos: '30 créditos', tipo: 'credito',
    descricaoFerramenta: 'Cole o texto, defina as substituições e receba o manuscrito corrigido com relatório de todas as trocas feitas.',
    fields: [
      { type: 'textarea', key: 'substituicoes', label: 'O que substituir? (um por linha: ORIGINAL → NOVO)', placeholder: 'Ex:\nJoão → João Silva\ncastelo → palácio\nfeiticeira → maga', rows: 4, required: true },
      { type: 'radio', key: 'caseSensitive', label: 'Sensibilidade a maiúsculas', options: [{ label: 'Ignorar maiúsculas/minúsculas', value: 'ignorar' }, { label: 'Manter exato', value: 'exato' }] },
      { type: 'textarea', key: 'texto', label: 'Texto do manuscrito', placeholder: 'Cole aqui o texto completo onde deseja fazer as substituições...', rows: 8, required: true },
    ],
    buildPrompt: (v) => `Aplique as seguintes substituições no texto abaixo:

SUBSTITUIÇÕES A FAZER:
${v.substituicoes}

SENSIBILIDADE: ${v.caseSensitive || 'ignorar'}

TEXTO ORIGINAL:
${v.texto}

Entregue:
1. TEXTO ATUALIZADO (com todas as substituições aplicadas corretamente)
2. RELATÓRIO DE SUBSTITUIÇÕES (quantas vezes cada termo foi substituído e em qual contexto)
3. ALERTAS (casos onde a substituição pode ter gerado inconsistência ou leitura estranha)
4. SUGESTÕES ADICIONAIS (outros termos inconsistentes detectados que não foram solicitados)`,
    outputLabel: 'Texto atualizado + relatório',
  },
}

// ─── Componente principal ─────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="flex items-center gap-1.5 rounded-lg border border-[#1c2438] bg-[#0b0f1c] px-3 py-1.5 text-xs text-[#6b7a99] transition hover:text-white"
    >
      {copied ? <><Check className="size-3.5 text-[#00e5c3]" /> Copiado!</> : <><Copy className="size-3.5" /> Copiar resultado</>}
    </button>
  )
}

function FieldRenderer({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  const base = "w-full rounded-xl border border-[#1c2438] bg-[#080b14] px-4 py-2.5 text-sm text-white placeholder:text-[#3a4a66] focus:border-[#2a3553] focus:outline-none transition"

  if (field.type === 'text') {
    return (
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={base}
      />
    )
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={field.rows ?? 3}
        className={`${base} resize-none leading-relaxed`}
      />
    )
  }

  if (field.type === 'select') {
    return (
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`${base} appearance-none pr-10 cursor-pointer`}
        >
          <option value="">Selecione...</option>
          {field.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#3a4a66]" />
      </div>
    )
  }

  if (field.type === 'radio') {
    return (
      <div className="flex flex-wrap gap-2">
        {field.options.map(o => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`rounded-xl border px-4 py-2 text-xs font-medium transition ${
              value === o.value
                ? 'border-[#4f7fff50] bg-[#4f7fff15] text-[#4f7fff]'
                : 'border-[#1c2438] bg-[#0b0f1c] text-[#6b7a99] hover:border-[#2a3553] hover:text-white'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    )
  }

  if (field.type === 'tags') {
    const selected = value ? value.split(',').map(s => s.trim()).filter(Boolean) : []
    const toggle = (opt: string) => {
      const next = selected.includes(opt)
        ? selected.filter(s => s !== opt)
        : [...selected, opt]
      onChange(next.join(', '))
    }
    return (
      <div className="flex flex-wrap gap-2">
        {field.options.map(o => (
          <button
            key={o}
            type="button"
            onClick={() => toggle(o)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition ${
              selected.includes(o)
                ? 'border-[#4f7fff50] bg-[#4f7fff15] text-[#4f7fff]'
                : 'border-[#1c2438] bg-[#0b0f1c] text-[#6b7a99] hover:border-[#2a3553] hover:text-white'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    )
  }

  return null
}

export default function FerramentaPage() {
  const params = useParams()
  const slug = params.ferramenta as string
  const tool = TOOLS[slug]

  const [values, setValues] = useState<Record<string, string>>({})
  const [resultado, setResultado] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (streamingText || resultado) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [streamingText, resultado])

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-[#6b7a99]">Ferramenta não encontrada.</p>
        <Link href="/dashboard/kit-ferramentas" className="text-sm text-[#4f7fff] hover:underline">← Voltar ao Kit</Link>
      </div>
    )
  }

  const Icon = tool.icon
  const requiredFields = tool.fields.filter(f => 'required' in f && f.required)
  const isFormValid = requiredFields.every(f => (values[f.key] ?? '').trim().length > 0)

  async function gerarResultado() {
    if (!isFormValid || isLoading) return
    setIsLoading(true)
    setResultado('')
    setStreamingText('')

    const prompt = tool.buildPrompt(values)

    try {
      const res = await fetch('/api/kit-ferramentas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ferramenta: slug,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      if (!res.ok || !res.body) throw new Error('Erro na API')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        setStreamingText(full)
      }

      setResultado(full)
    } catch {
      setResultado('Ocorreu um erro. Tente novamente.')
    } finally {
      setIsLoading(false)
      setStreamingText('')
    }
  }

  function resetar() {
    setResultado('')
    setStreamingText('')
  }

  const outputText = streamingText || resultado

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-[#1c2438] bg-[#080b14] px-5 py-4 md:px-8">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <Link href="/dashboard/kit-ferramentas" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#1c2438] text-[#6b7a99] transition hover:text-white">
            <ArrowLeft className="size-4" />
          </Link>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: `${tool.cor}20` }}>
            <Icon className="size-5" style={{ color: tool.cor }} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-bold text-white">{tool.titulo}</h1>
            <p className="text-xs text-[#6b7a99]">{tool.subtitulo}</p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            {tool.tipo === 'pago'
              ? <span className="rounded-lg bg-[#4f7fff15] px-3 py-1 text-xs font-bold text-[#4f7fff]">{tool.preco}</span>
              : <span className="rounded-lg px-3 py-1 text-xs font-bold" style={{ background: `${tool.cor}18`, color: tool.cor }}>−{tool.creditos}</span>
            }
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-8 pb-16 md:px-8">
        {/* Formulário */}
        {!resultado && (
          <div className="space-y-6">
            {/* Descrição */}
            <div className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="size-4 mt-0.5 shrink-0" style={{ color: tool.cor }} />
                <p className="text-sm leading-relaxed text-[#8b99c0]">{tool.descricaoFerramenta}</p>
              </div>
            </div>

            {/* Campos */}
            <div className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-6 space-y-5">
              {tool.fields.map(field => (
                <div key={field.key}>
                  <label className="mb-2 block text-xs font-semibold text-[#8b99c0]">
                    {field.label}
                    {'required' in field && field.required && <span className="ml-1" style={{ color: tool.cor }}>*</span>}
                  </label>
                  <FieldRenderer
                    field={field}
                    value={values[field.key] ?? ''}
                    onChange={v => setValues(prev => ({ ...prev, [field.key]: v }))}
                  />
                </div>
              ))}
            </div>

            {/* Botão gerar */}
            <button
              onClick={gerarResultado}
              disabled={!isFormValid || isLoading}
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition disabled:opacity-40"
              style={{ background: `linear-gradient(135deg, ${tool.cor}, ${tool.cor}99)`, boxShadow: `0 0 24px ${tool.cor}40` }}
            >
              {isLoading
                ? <><Loader2 className="size-4 animate-spin" /> Gerando com IA...</>
                : <><Wand2 className="size-4" /> Gerar com Aurora IA</>
              }
            </button>

            {!isFormValid && (
              <p className="text-center text-xs text-[#3a4a66]">Preencha os campos obrigatórios (*) para continuar</p>
            )}
          </div>
        )}

        {/* Streaming */}
        {isLoading && streamingText && (
          <div ref={resultRef} className="space-y-4">
            <div className="flex items-center gap-2 rounded-2xl border border-[#1c2438] bg-[#0b0f1c] px-5 py-3">
              <Loader2 className="size-4 animate-spin shrink-0" style={{ color: tool.cor }} />
              <span className="text-xs text-[#6b7a99]">Aurora IA gerando seu resultado...</span>
            </div>
            <div className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-6">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#c8d3f5]">
                {streamingText}
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current align-middle" style={{ color: tool.cor }} />
              </p>
            </div>
          </div>
        )}

        {/* Resultado final */}
        {resultado && !isLoading && (
          <div ref={resultRef} className="space-y-4">
            {/* Header resultado */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: `${tool.cor}20` }}>
                  <Sparkles className="size-3.5" style={{ color: tool.cor }} />
                </div>
                <span className="text-sm font-semibold text-white">{tool.outputLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <CopyButton text={resultado} />
                <button
                  onClick={resetar}
                  className="flex items-center gap-1.5 rounded-lg border border-[#1c2438] bg-[#0b0f1c] px-3 py-1.5 text-xs text-[#6b7a99] transition hover:text-white"
                >
                  <RefreshCw className="size-3.5" /> Refazer
                </button>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-6">
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-[#c8d3f5] font-sans">{resultado}</pre>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={resetar}
                className="flex items-center gap-2 rounded-xl border border-[#1c2438] bg-[#0b0f1c] px-4 py-2.5 text-sm text-[#6b7a99] transition hover:text-white"
              >
                <ArrowLeft className="size-4" /> Ajustar e regerar
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([resultado], { type: 'text/plain' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${tool.titulo.replace(/\s+/g, '-').toLowerCase()}-resultado.txt`
                  a.click()
                }}
                className="flex items-center gap-2 rounded-xl border border-[#1c2438] bg-[#0b0f1c] px-4 py-2.5 text-sm text-[#6b7a99] transition hover:text-white"
              >
                <Download className="size-4" /> Baixar como .txt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
