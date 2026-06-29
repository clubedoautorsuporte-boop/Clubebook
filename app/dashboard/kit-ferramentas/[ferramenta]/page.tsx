'use client'

import { useParams } from 'next/navigation'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  ArrowLeft, Loader2, Copy, Check, Sparkles, RefreshCw,
  BookOpen, Image, Palette, Headphones, Rocket, Megaphone,
  Globe, Brush, PenTool, Scissors, AlignLeft,
  BarChart2, Type, Layers, Database, Search, Wrench, ChevronDown,
  Download, Wand2, Library, Save, Clock, ChevronRight, X, FileText,
} from 'lucide-react'
import Link from 'next/link'
import type { EbookOption } from '@/app/api/kit-ferramentas/ebooks/route'

// ─── Field types ─────────────────────────────────────────────────────────────

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
  // Map field keys that can be auto-filled from ebook data
  autoFill?: Partial<Record<string, keyof EbookOption | 'capitulo_titulo' | 'capitulo_texto'>>
}

type SavedWork = { resultado: string; timestamp: string; ebookTitulo?: string; formValues?: Record<string, string> }

// ─── Tool configs ─────────────────────────────────────────────────────────────

const TOOLS: Record<string, ToolConfig> = {
  'escrita-livro': {
    titulo: 'Escrita do Livro', subtitulo: 'Geração completa com IA',
    icon: BookOpen, cor: '#4f7fff', preco: 'R$ 49,99', tipo: 'pago',
    descricaoFerramenta: 'Preencha as informações e a Aurora IA escreverá o esboço completo do seu livro com estrutura de capítulos, sinopse e o primeiro capítulo.',
    autoFill: { titulo: 'titulo', genero: 'genero', publico: 'publico', tom: 'tom' },
    fields: [
      { type: 'text', key: 'titulo', label: 'Título do livro', placeholder: 'Ex: O Segredo das Finanças Simples', required: true },
      { type: 'select', key: 'genero', label: 'Gênero', options: ['Autoajuda', 'Finanças', 'Romance', 'Ficção Científica', 'Fantasia', 'Negócios', 'Desenvolvimento Pessoal', 'Educação', 'Thriller', 'Terror', 'Biografia', 'Infantil', 'Outro'], required: true },
      { type: 'text', key: 'publico', label: 'Público-alvo', placeholder: 'Ex: Jovens adultos 20-35 anos interessados em finanças' },
      { type: 'radio', key: 'tom', label: 'Tom de voz', options: [{ label: 'Motivacional 🔥', value: 'motivacional' }, { label: 'Técnico 📊', value: 'tecnico' }, { label: 'Casual 😊', value: 'casual' }, { label: 'Inspirador 💡', value: 'inspirador' }] },
      { type: 'select', key: 'capitulos', label: 'Número de capítulos', options: ['5 capítulos', '8 capítulos', '10 capítulos', '12 capítulos', '15 capítulos', '20 capítulos'] },
      { type: 'textarea', key: 'descricao', label: 'Descrição do livro', placeholder: 'Do que se trata o livro? Qual problema ele resolve?', rows: 4, required: true },
    ],
    buildPrompt: (v) => `Crie a estrutura completa de um livro:\n\nTÍTULO: ${v.titulo}\nGÊNERO: ${v.genero}\nPÚBLICO: ${v.publico || 'Geral'}\nTOM: ${v.tom || 'motivacional'}\nCAPÍTULOS: ${v.capitulos || '10 capítulos'}\nDESCRIÇÃO: ${v.descricao}\n\nEntregue:\n1. SINOPSE (150 palavras)\n2. ESTRUTURA COMPLETA (todos os capítulos com título e descrição)\n3. PRIMEIRO CAPÍTULO COMPLETO (mínimo 800 palavras, abertura impactante e gancho)`,
    outputLabel: 'Seu livro gerado',
  },
  'capa-profissional': {
    titulo: 'Capa Profissional', subtitulo: '4 variações de conceito visual',
    icon: Image, cor: '#8b5cf6', preco: 'R$ 99,99', tipo: 'pago',
    descricaoFerramenta: 'Descreva seu livro e receba 4 conceitos visuais completos de capa com paleta de cores HEX, tipografia e prompts para Midjourney.',
    autoFill: { titulo: 'titulo', subtitulo: 'subtitulo', genero: 'genero' },
    fields: [
      { type: 'text', key: 'titulo', label: 'Título do livro', placeholder: 'Ex: Mente Milionária', required: true },
      { type: 'text', key: 'subtitulo', label: 'Subtítulo (opcional)', placeholder: 'Ex: Como reprogramar suas finanças em 30 dias' },
      { type: 'select', key: 'genero', label: 'Gênero', options: ['Autoajuda', 'Finanças', 'Romance', 'Ficção Científica', 'Fantasia', 'Negócios', 'Thriller', 'Terror', 'Infantil', 'Outro'] },
      { type: 'radio', key: 'estilo', label: 'Estilo visual', options: [{ label: 'Minimalista moderno', value: 'minimalista' }, { label: 'Dramático e sombrio', value: 'dramatico' }, { label: 'Colorido e vibrante', value: 'vibrante' }, { label: 'Clássico literário', value: 'classico' }] },
      { type: 'tags', key: 'emocao', label: 'Emoção que a capa deve transmitir', options: ['Confiança', 'Mistério', 'Esperança', 'Urgência', 'Luxo', 'Aventura', 'Calma', 'Poder'] },
      { type: 'textarea', key: 'referencia', label: 'Referências ou inspirações (opcional)', placeholder: 'Ex: Algo como as capas da série Harry Potter...', rows: 2 },
    ],
    buildPrompt: (v) => `Crie 4 conceitos visuais DISTINTOS de capa:\n\nTÍTULO: ${v.titulo}\nSUBTÍTULO: ${v.subtitulo || 'Não há'}\nGÊNERO: ${v.genero || 'Não especificado'}\nESTILO: ${v.estilo || 'minimalista'}\nEMOÇÃO: ${v.emocao || 'Não especificado'}\nREFERÊNCIAS: ${v.referencia || 'Nenhuma'}\n\nPara cada um dos 4 conceitos:\n- NOME DO CONCEITO\n- PALETA DE CORES: 3 cores com HEX\n- TIPOGRAFIA: fontes do Google Fonts\n- COMPOSIÇÃO: elementos, posição e hierarquia\n- MOOD\n- PROMPT MIDJOURNEY em inglês`,
    outputLabel: '4 conceitos de capa',
  },
  'ajuste-capa': {
    titulo: 'Ajuste de Capa', subtitulo: 'Refinamentos precisos na capa atual',
    icon: Palette, cor: '#ec4899', preco: 'R$ 19,99', tipo: 'pago',
    descricaoFerramenta: 'Descreva sua capa atual e o que deseja ajustar. Receba instruções precisas e duas alternativas criativas.',
    autoFill: { titulo: 'titulo' },
    fields: [
      { type: 'text', key: 'titulo', label: 'Título do livro', placeholder: 'Ex: Finanças para Todos', required: true },
      { type: 'textarea', key: 'capaAtual', label: 'Descreva sua capa atual', placeholder: 'Ex: Fundo azul escuro, título em branco com fonte serif, moedas no canto inferior...', rows: 3, required: true },
      { type: 'tags', key: 'ajuste', label: 'O que deseja ajustar?', options: ['Cores', 'Tipografia', 'Layout', 'Imagem de fundo', 'Título', 'Subtítulo', 'Contraste', 'Textura'] },
      { type: 'textarea', key: 'objetivo', label: 'O que você quer alcançar?', placeholder: 'Ex: Mais moderno e que transmita confiança para o público corporativo', rows: 2 },
      { type: 'radio', key: 'nivel', label: 'Nível do ajuste', options: [{ label: 'Pequeno refinamento', value: 'pequeno' }, { label: 'Ajuste moderado', value: 'moderado' }, { label: 'Reformulação completa', value: 'completo' }] },
    ],
    buildPrompt: (v) => `Analise a capa e sugira ajustes:\n\nLIVRO: ${v.titulo}\nCAPA ATUAL: ${v.capaAtual}\nAJUSTES: ${v.ajuste || 'Geral'}\nOBJETIVO: ${v.objetivo || 'Modernizar'}\nNÍVEL: ${v.nivel || 'moderado'}\n\nEntregue:\n1. ANÁLISE: pontos fortes e fracos\n2. AJUSTES RECOMENDADOS: instruções detalhadas por elemento\n3. ALTERNATIVA A: ajuste conservador\n4. ALTERNATIVA B: ajuste ousado\n5. DICAS TÉCNICAS: cores HEX, tamanho de fonte, proporções`,
    outputLabel: 'Plano de ajuste da capa',
  },
  'audiobook': {
    titulo: 'Audiobook Premium', subtitulo: 'Roteiro narrado profissional',
    icon: Headphones, cor: '#f97316', preco: 'R$ 409,99', tipo: 'pago',
    descricaoFerramenta: 'Cole o texto do capítulo e receba o roteiro adaptado para narração com marcações profissionais de pausa, ênfase e ritmo.',
    autoFill: { titulo: 'titulo', tituloCapitulo: 'capitulo_titulo', texto: 'capitulo_texto' },
    fields: [
      { type: 'text', key: 'titulo', label: 'Título do livro', placeholder: 'Ex: A Jornada do Herói' },
      { type: 'text', key: 'tituloCapitulo', label: 'Título do capítulo', placeholder: 'Ex: Capítulo 1 — O Início da Jornada', required: true },
      { type: 'radio', key: 'narrador', label: 'Estilo do narrador', options: [{ label: 'Calmo e reflexivo', value: 'calmo' }, { label: 'Dramático e intenso', value: 'dramatico' }, { label: 'Animado e enérgico', value: 'animado' }, { label: 'Neutro e profissional', value: 'neutro' }] },
      { type: 'select', key: 'ritmo', label: 'Ritmo da narração', options: ['Lento e pausado', 'Moderado', 'Dinâmico', 'Variado conforme emoção'] },
      { type: 'textarea', key: 'texto', label: 'Texto do capítulo', placeholder: 'Cole aqui o texto que deseja adaptar para audiobook...', rows: 8, required: true },
    ],
    buildPrompt: (v) => `Adapte o texto para roteiro de audiobook profissional:\n\nLIVRO: ${v.titulo || 'Não informado'}\nCAPÍTULO: ${v.tituloCapitulo}\nNARRADOR: ${v.narrador || 'calmo'}\nRITMO: ${v.ritmo || 'Moderado'}\n\nTEXTO:\n${v.texto}\n\nEntregue o texto com marcações: [PAUSA CURTA], [PAUSA LONGA], [ÊNFASE]...[/ÊNFASE], [RITMO LENTO]...[/RITMO LENTO], [EMOCIONAL]...[/EMOCIONAL]\nApós o roteiro: FICHA TÉCNICA com tempo estimado e instruções para o locutor.`,
    outputLabel: 'Roteiro de audiobook',
  },
  'preparacao-publicacao': {
    titulo: 'Preparação para Publicação', subtitulo: 'Checklist e textos prontos',
    icon: Rocket, cor: '#00e5c3', preco: 'R$ 39,99', tipo: 'pago',
    descricaoFerramenta: 'Informe os dados do livro e a plataforma. Receba checklist completo e todos os textos prontos para publicar.',
    autoFill: { titulo: 'titulo', autor: 'autor', genero: 'genero' },
    fields: [
      { type: 'text', key: 'titulo', label: 'Título do livro', placeholder: 'Ex: Finanças Pessoais para Iniciantes', required: true },
      { type: 'text', key: 'autor', label: 'Nome do autor', placeholder: 'Ex: João Silva', required: true },
      { type: 'select', key: 'genero', label: 'Gênero / Categoria', options: ['Autoajuda', 'Finanças', 'Negócios', 'Romance', 'Ficção', 'Educação', 'Saúde', 'Culinária', 'Outro'] },
      { type: 'tags', key: 'plataforma', label: 'Plataforma(s)', options: ['Amazon KDP', 'Hotmart', 'Eduzz', 'Gumroad', 'Kiwify', 'Google Play Books', 'Smashwords'] },
      { type: 'textarea', key: 'sinopse', label: 'Sinopse breve', placeholder: 'O que o livro ensina/conta e o que o leitor vai ganhar?', rows: 3, required: true },
      { type: 'text', key: 'preco', label: 'Preço pretendido (R$)', placeholder: 'Ex: 29,90' },
    ],
    buildPrompt: (v) => `Prepare a publicação completa:\n\nTÍTULO: ${v.titulo}\nAUTOR: ${v.autor}\nGÊNERO: ${v.genero || 'Não especificado'}\nPLATAFORMAS: ${v.plataforma || 'Amazon KDP, Hotmart'}\nSINOPSE: ${v.sinopse}\nPREÇO: ${v.preco ? 'R$ ' + v.preco : 'A definir'}\n\n1. ✅ CHECKLIST completo\n2. 📝 DESCRIÇÃO CURTA (150 chars)\n3. 📄 DESCRIÇÃO MÉDIA (300 palavras)\n4. 📄 DESCRIÇÃO LONGA (500+ palavras)\n5. 🔍 7 PALAVRAS-CHAVE\n6. 📂 CATEGORIAS para cada plataforma\n7. 💰 ESTRATÉGIA DE PREÇO\n8. 🏷️ 10 HASHTAGS`,
    outputLabel: 'Kit completo de publicação',
  },
  'material-marketing': {
    titulo: 'Material de Marketing', subtitulo: 'Copies e peças prontas',
    icon: Megaphone, cor: '#facc15', preco: 'R$ 7,99–19,99', tipo: 'pago',
    descricaoFerramenta: 'Informe o livro e o tipo de peça. Receba copy pronto e otimizado para conversão.',
    autoFill: { titulo: 'titulo', nicho: 'genero' },
    fields: [
      { type: 'text', key: 'titulo', label: 'Título do livro', placeholder: 'Ex: Desperte Seu Potencial', required: true },
      { type: 'text', key: 'nicho', label: 'Nicho / tema', placeholder: 'Ex: Desenvolvimento pessoal para mulheres 30+' },
      { type: 'text', key: 'preco', label: 'Preço do livro', placeholder: 'Ex: R$ 37' },
      { type: 'tags', key: 'peca', label: 'Tipo de peça', options: ['Post Instagram', 'Story Instagram', 'Email de lançamento', 'Email de abandono', 'Anúncio Facebook/Meta', 'Página de vendas', 'Bio do autor', 'Título de vídeo YouTube', 'Script de vídeo curto'] },
      { type: 'radio', key: 'angulo', label: 'Ângulo da comunicação', options: [{ label: 'Benefício direto', value: 'beneficio' }, { label: 'Dor/problema', value: 'dor' }, { label: 'Curiosidade', value: 'curiosidade' }, { label: 'Prova social', value: 'prova' }] },
      { type: 'textarea', key: 'diferencial', label: 'Diferencial do livro', placeholder: 'O que torna este livro único?', rows: 2 },
    ],
    buildPrompt: (v) => `Crie materiais de marketing de alta conversão:\n\nLIVRO: ${v.titulo}\nNICHO: ${v.nicho || 'Não especificado'}\nPREÇO: ${v.preco || 'Não informado'}\nPEÇAS: ${v.peca || 'Post Instagram, Email de lançamento'}\nÂNGULO: ${v.angulo || 'beneficio'}\nDIFERENCIAL: ${v.diferencial || 'Não informado'}\n\nPara CADA peça: headline, corpo pronto para usar, CTA, emojis estratégicos, dicas de design.`,
    outputLabel: 'Materiais de marketing prontos',
  },
  'traducao': {
    titulo: 'Tradução', subtitulo: 'Tradução literária fiel ao estilo',
    icon: Globe, cor: '#06b6d4', preco: 'R$ 29,99 / idioma', tipo: 'pago',
    descricaoFerramenta: 'Cole o texto e selecione o idioma. A IA preserva o estilo, tom e voz do autor.',
    autoFill: { tituloLivro: 'titulo', texto: 'capitulo_texto' },
    fields: [
      { type: 'text', key: 'tituloLivro', label: 'Título do livro', placeholder: 'Ex: Segredos do Sucesso' },
      { type: 'select', key: 'idiomaOrigem', label: 'Idioma de origem', options: ['Português (BR)', 'Português (PT)', 'Inglês', 'Espanhol', 'Francês', 'Italiano', 'Alemão'] },
      { type: 'select', key: 'idiomaDestino', label: 'Idioma de destino', options: ['Inglês (US)', 'Inglês (UK)', 'Espanhol (ES)', 'Espanhol (LATAM)', 'Francês', 'Italiano', 'Alemão', 'Japonês', 'Mandarim', 'Árabe'], required: true },
      { type: 'radio', key: 'estilo', label: 'Prioridade', options: [{ label: 'Fidelidade literal', value: 'literal' }, { label: 'Fluência natural', value: 'fluente' }, { label: 'Adaptação cultural', value: 'cultural' }] },
      { type: 'textarea', key: 'texto', label: 'Texto para traduzir', placeholder: 'Cole aqui o trecho a traduzir...', rows: 8, required: true },
    ],
    buildPrompt: (v) => `Traduza com qualidade literária:\n\nLIVRO: ${v.tituloLivro || 'Não informado'}\nDE: ${v.idiomaOrigem || 'Português (BR)'}\nPARA: ${v.idiomaDestino}\nPRIORIDADE: ${v.estilo || 'fluente'}\n\nTEXTO:\n${v.texto}\n\n1. TRADUÇÃO COMPLETA\n2. NOTAS DO TRADUTOR (adaptações culturais e escolhas)\n3. GLOSSÁRIO (termos sem equivalente direto)`,
    outputLabel: 'Tradução profissional',
  },
  'ilustracoes': {
    titulo: 'Ilustrações', subtitulo: 'Prompts para IA generativa',
    icon: Brush, cor: '#a78bfa', preco: 'R$ 9,99–14,99 / imagem', tipo: 'pago',
    descricaoFerramenta: 'Descreva a cena ou personagem e receba prompts prontos para Midjourney, DALL-E ou Leonardo AI.',
    autoFill: { tituloLivro: 'titulo' },
    fields: [
      { type: 'text', key: 'tituloLivro', label: 'Título do livro', placeholder: 'Ex: A Floresta Encantada' },
      { type: 'select', key: 'tipo', label: 'Tipo de ilustração', options: ['Cena narrativa', 'Personagem', 'Cenário/ambiente', 'Objeto especial', 'Mapa', 'Capa do livro', 'Ícone/símbolo'] },
      { type: 'radio', key: 'estilo', label: 'Estilo artístico', options: [{ label: 'Realista', value: 'realista' }, { label: 'Aquarela', value: 'aquarela' }, { label: 'Anime/Mangá', value: 'anime' }, { label: 'Cartoon', value: 'cartoon' }] },
      { type: 'tags', key: 'ferramenta', label: 'Ferramenta de IA', options: ['Midjourney', 'DALL-E 3', 'Leonardo AI', 'Stable Diffusion', 'Adobe Firefly'] },
      { type: 'textarea', key: 'descricao', label: 'Descreva o que quer ilustrar', placeholder: 'Ex: Uma jovem feiticeira de cabelos ruivos diante de um portal mágico na floresta à noite...', rows: 4, required: true },
      { type: 'select', key: 'humor', label: 'Atmosfera', options: ['Épico e grandioso', 'Mágico e sonhador', 'Sombrio e misterioso', 'Alegre e colorido', 'Melancólico', 'Tenso e dramático'] },
    ],
    buildPrompt: (v) => `Crie prompts profissionais de ilustração:\n\nLIVRO: ${v.tituloLivro || 'Não informado'}\nTIPO: ${v.tipo || 'Cena narrativa'}\nESTILO: ${v.estilo || 'realista'}\nFERRAMENTA: ${v.ferramenta || 'Midjourney'}\nDESCRIÇÃO: ${v.descricao}\nATMOSFERA: ${v.humor || 'Épico'}\n\n1. PROMPT PRINCIPAL em inglês (com parâmetros técnicos)\n2. PROMPT ALTERNATIVO (variação)\n3. NEGATIVE PROMPT\n4. DICAS TÉCNICAS: aspect ratio, seeds\n5. VERSÃO EM PORTUGUÊS`,
    outputLabel: 'Prompts de ilustração',
  },
  'novo-capitulo': {
    titulo: 'Criar novo capítulo', subtitulo: 'Capítulo completo com gancho',
    icon: PenTool, cor: '#4f7fff', creditos: '488 créditos', tipo: 'credito',
    descricaoFerramenta: 'Informe o contexto e a Aurora IA escreverá um capítulo completo com abertura, desenvolvimento e gancho.',
    autoFill: { tituloLivro: 'titulo', genero: 'genero' },
    fields: [
      { type: 'text', key: 'tituloCapitulo', label: 'Título do capítulo', placeholder: 'Ex: Capítulo 3 — A Grande Virada', required: true },
      { type: 'text', key: 'tituloLivro', label: 'Título do livro', placeholder: 'Ex: O Caminho do Sucesso' },
      { type: 'select', key: 'genero', label: 'Gênero', options: ['Autoajuda', 'Ficção', 'Romance', 'Thriller', 'Fantasia', 'Negócios', 'Educação', 'Biografia', 'Outro'] },
      { type: 'textarea', key: 'contexto', label: 'O que aconteceu até aqui?', placeholder: 'Resuma o que ocorreu nos capítulos anteriores...', rows: 3 },
      { type: 'textarea', key: 'objetivo', label: 'Objetivo deste capítulo', placeholder: 'O que deve revelar, ensinar ou fazer o leitor sentir?', rows: 2, required: true },
      { type: 'radio', key: 'extensao', label: 'Extensão', options: [{ label: 'Curto (~500 palavras)', value: 'curto' }, { label: 'Médio (~1000 palavras)', value: 'medio' }, { label: 'Longo (~1500 palavras)', value: 'longo' }] },
    ],
    buildPrompt: (v) => `Escreva um capítulo completo:\n\nCAPÍTULO: ${v.tituloCapitulo}\nLIVRO: ${v.tituloLivro || 'Não informado'}\nGÊNERO: ${v.genero || 'Não especificado'}\nCONTEXTO: ${v.contexto || 'Primeiro capítulo'}\nOBJETIVO: ${v.objetivo}\nEXTENSÃO: ${v.extensao || 'medio'}\n\nAbertura impactante (hook nos 2 primeiros parágrafos), desenvolvimento sólido, encerramento com gancho poderoso.`,
    outputLabel: 'Capítulo gerado',
  },
  'reescrever-capitulo': {
    titulo: 'Reescrever capítulo inteiro', subtitulo: 'Versão melhorada completa',
    icon: RefreshCw, cor: '#8b5cf6', creditos: '735 créditos', tipo: 'credito',
    descricaoFerramenta: 'Cole o capítulo atual, indique o problema e receba uma versão completamente reescrita.',
    autoFill: { tituloCapitulo: 'capitulo_titulo', texto: 'capitulo_texto' },
    fields: [
      { type: 'text', key: 'tituloCapitulo', label: 'Título do capítulo', placeholder: 'Ex: Capítulo 2 — O Encontro' },
      { type: 'tags', key: 'problema', label: 'O que não está funcionando?', options: ['Ritmo lento', 'Diálogos artificiais', 'Falta profundidade', 'Tom inadequado', 'Falta coesão', 'Muito longo', 'Muito superficial', 'Estrutura fraca'] },
      { type: 'radio', key: 'foco', label: 'Foco', options: [{ label: 'Manter conteúdo, melhorar forma', value: 'forma' }, { label: 'Aprofundar conteúdo', value: 'conteudo' }, { label: 'Reformulação completa', value: 'completo' }] },
      { type: 'textarea', key: 'instrucoes', label: 'Instruções específicas (opcional)', placeholder: 'Ex: Mais emocional, com detalhes sensoriais...' },
      { type: 'textarea', key: 'texto', label: 'Capítulo atual', placeholder: 'Cole o capítulo aqui...', rows: 8, required: true },
    ],
    buildPrompt: (v) => `Reescreva o capítulo com melhorias substanciais:\n\nCAPÍTULO: ${v.tituloCapitulo || 'Sem título'}\nPROBLEMAS: ${v.problema || 'Geral'}\nFOCO: ${v.foco || 'forma'}\nINSTRUÇÕES: ${v.instrucoes || 'Nenhuma'}\n\nTEXTO:\n${v.texto}\n\nReescreva completo. Após: seção "O QUE FOI MELHORADO" com principais mudanças.`,
    outputLabel: 'Capítulo reescrito',
  },
  'reescrever-secao': {
    titulo: 'Reescrever seção', subtitulo: 'Melhoria de trecho específico',
    icon: Scissors, cor: '#ec4899', creditos: '499 créditos', tipo: 'credito',
    descricaoFerramenta: 'Cole a seção e indique o objetivo. Receba a versão melhorada com explicação das mudanças.',
    autoFill: { texto: 'capitulo_texto' },
    fields: [
      { type: 'radio', key: 'objetivo', label: 'Objetivo da melhoria', options: [{ label: 'Mais fluidez', value: 'fluidade' }, { label: 'Mais impacto emocional', value: 'emocional' }, { label: 'Mais clareza', value: 'clareza' }, { label: 'Mais detalhes', value: 'detalhes' }] },
      { type: 'select', key: 'tom', label: 'Tom desejado', options: ['Manter o original', 'Mais formal', 'Mais casual', 'Mais poético', 'Mais direto', 'Mais dramático', 'Mais técnico'] },
      { type: 'textarea', key: 'instrucoes', label: 'Instruções adicionais (opcional)', placeholder: 'Ex: Adicione mais detalhes sensoriais, evite repetição...' },
      { type: 'textarea', key: 'texto', label: 'Seção a melhorar', placeholder: 'Cole aqui a seção...', rows: 7, required: true },
    ],
    buildPrompt: (v) => `Reescreva a seção:\n\nOBJETIVO: ${v.objetivo || 'fluidade'}\nTOM: ${v.tom || 'Manter o original'}\nINSTRUÇÕES: ${v.instrucoes || 'Nenhuma'}\n\nTEXTO:\n${v.texto}\n\n1. VERSÃO MELHORADA (completa)\n2. O QUE MUDOU (lista das alterações)`,
    outputLabel: 'Seção reescrita',
  },
  'reescrever-paragrafo': {
    titulo: 'Reescrever parágrafo', subtitulo: '3 variações criativas',
    icon: AlignLeft, cor: '#f97316', creditos: '348 créditos', tipo: 'credito',
    descricaoFerramenta: 'Cole o parágrafo e receba 3 versões: máximo impacto, máxima clareza e máxima emoção.',
    fields: [
      { type: 'select', key: 'contexto', label: 'Contexto do parágrafo', options: ['Abertura de capítulo', 'Cena de ação', 'Descrição de personagem', 'Descrição de cenário', 'Diálogo narrativo', 'Clímax', 'Conclusão', 'Reflexão', 'Outro'] },
      { type: 'textarea', key: 'texto', label: 'Parágrafo original', placeholder: 'Cole aqui o parágrafo...', rows: 5, required: true },
    ],
    buildPrompt: (v) => `Reescreva em 3 versões distintas:\n\nCONTEXTO: ${v.contexto || 'Geral'}\n\nPARÁGRAFO:\n${v.texto}\n\nVERSÃO 1 — IMPACTO MÁXIMO: surpresa, curiosidade ou forte impressão\nVERSÃO 2 — CLAREZA MÁXIMA: absolutamente compreensível e direto\nVERSÃO 3 — EMOÇÃO MÁXIMA: conexão emocional profunda, recursos sensoriais\n\nApós as 3: indique qual recomenda e por quê.`,
    outputLabel: '3 variações do parágrafo',
  },
  'corrigir-capitulo': {
    titulo: 'Corrigir texto do capítulo', subtitulo: 'Revisão ortográfica e gramatical',
    icon: Wrench, cor: '#00e5c3', creditos: '116 créditos', tipo: 'credito',
    descricaoFerramenta: 'Cole o texto e receba a versão corrigida com relatório detalhado de todas as correções feitas.',
    autoFill: { texto: 'capitulo_texto' },
    fields: [
      { type: 'tags', key: 'foco', label: 'Foco da revisão', options: ['Ortografia', 'Gramática', 'Pontuação', 'Concordância', 'Coesão', 'Repetição de palavras', 'Estilo', 'Todos'] },
      { type: 'select', key: 'norma', label: 'Norma', options: ['Português Brasileiro (BR)', 'Português Europeu (PT)'] },
      { type: 'textarea', key: 'texto', label: 'Texto para corrigir', placeholder: 'Cole o texto aqui...', rows: 8, required: true },
    ],
    buildPrompt: (v) => `Revisão completa do texto:\n\nFOCO: ${v.foco || 'Todos'}\nNORMA: ${v.norma || 'Português Brasileiro (BR)'}\n\nTEXTO:\n${v.texto}\n\n1. TEXTO CORRIGIDO (versão final limpa)\n2. RELATÓRIO (cada erro → correção → regra)\n3. ESTATÍSTICAS por categoria\n4. DICAS RECORRENTES para o autor`,
    outputLabel: 'Texto corrigido + relatório',
  },
  'analise-editorial': {
    titulo: 'Análise editorial', subtitulo: 'Relatório editorial profissional',
    icon: BarChart2, cor: '#facc15', creditos: '65 créditos', tipo: 'credito',
    descricaoFerramenta: 'Cole o capítulo e receba análise com scores, pontos fortes, fracos e sugestões concretas.',
    autoFill: { tituloCapitulo: 'capitulo_titulo', texto: 'capitulo_texto' },
    fields: [
      { type: 'text', key: 'tituloCapitulo', label: 'Título do capítulo', placeholder: 'Ex: Capítulo 1 — O Despertar' },
      { type: 'select', key: 'genero', label: 'Gênero', options: ['Ficção literária', 'Ficção popular', 'Romance', 'Thriller', 'Fantasia', 'Autoajuda', 'Negócios', 'Biografia', 'Educativo', 'Infantojuvenil'] },
      { type: 'radio', key: 'nivel', label: 'Nível de crítica', options: [{ label: 'Construtivo e gentil', value: 'gentil' }, { label: 'Equilibrado', value: 'equilibrado' }, { label: 'Crítico e exigente', value: 'critico' }] },
      { type: 'textarea', key: 'texto', label: 'Capítulo para análise', placeholder: 'Cole o capítulo aqui...', rows: 8, required: true },
    ],
    buildPrompt: (v) => `Análise editorial profissional:\n\nCAPÍTULO: ${v.tituloCapitulo || 'Não informado'}\nGÊNERO: ${v.genero || 'Ficção'}\nCRÍTICA: ${v.nivel || 'equilibrado'}\n\nTEXTO:\n${v.texto}\n\n📊 SCORES (0-10): estrutura, ritmo, personagens, diálogos, descrições, originalidade, engajamento, NOTA GERAL\n✅ PONTOS FORTES\n⚠️ PONTOS DE MELHORIA\n💡 SUGESTÕES CONCRETAS\n🎯 PRÓXIMOS PASSOS`,
    outputLabel: 'Relatório editorial',
  },
  'editar-texto-capa': {
    titulo: 'Editar texto da capa', subtitulo: 'Copywriting de impacto',
    icon: Type, cor: '#06b6d4', creditos: '498 créditos', tipo: 'credito',
    descricaoFerramenta: 'Informe o livro e receba título, subtítulo, tagline e contracapa com copywriting de alta conversão.',
    autoFill: { temaLivro: 'titulo', genero: 'genero', publico: 'publico' },
    fields: [
      { type: 'text', key: 'temaLivro', label: 'Tema / assunto do livro', placeholder: 'Ex: Como sair das dívidas em 12 meses', required: true },
      { type: 'select', key: 'genero', label: 'Gênero', options: ['Autoajuda', 'Finanças', 'Negócios', 'Romance', 'Ficção', 'Thriller', 'Fantasia', 'Educação', 'Saúde', 'Outro'] },
      { type: 'text', key: 'publico', label: 'Público-alvo', placeholder: 'Ex: Pessoas endividadas 25-45 anos' },
      { type: 'radio', key: 'tom', label: 'Tom do texto', options: [{ label: 'Motivacional', value: 'motivacional' }, { label: 'Técnico', value: 'tecnico' }, { label: 'Provocativo', value: 'provocativo' }, { label: 'Acolhedor', value: 'acolhedor' }] },
      { type: 'textarea', key: 'promessa', label: 'Promessa principal', placeholder: 'O que o leitor vai conquistar depois de ler?', rows: 2 },
    ],
    buildPrompt: (v) => `Crie todos os textos de capa:\n\nTEMA: ${v.temaLivro}\nGÊNERO: ${v.genero || 'Não especificado'}\nPÚBLICO: ${v.publico || 'Geral'}\nTOM: ${v.tom || 'motivacional'}\nPROMESSA: ${v.promessa || 'Não informada'}\n\n📌 5 TÍTULOS PRINCIPAIS\n📌 3 SUBTÍTULOS\n📌 5 TAGLINES (1 linha)\n📌 CONTRACAPA COMPLETA (120-150 palavras)\n📌 CONTRACAPA CURTA (60-80 palavras)\n📌 FRASE DE ABERTURA para dentro do livro\n\nPara cada item: estratégia de copywriting usada.`,
    outputLabel: 'Textos de capa completos',
  },
  'editar-estilo-capa': {
    titulo: 'Editar estilo da capa', subtitulo: 'Novas direções visuais',
    icon: Layers, cor: '#a78bfa', creditos: '720 créditos', tipo: 'credito',
    descricaoFerramenta: 'Informe o livro e receba concept board completo com 3 direções visuais para redesign da capa.',
    autoFill: { titulo: 'titulo', genero: 'genero', publicoAlvo: 'publico' },
    fields: [
      { type: 'text', key: 'titulo', label: 'Título do livro', placeholder: 'Ex: A Última Fronteira', required: true },
      { type: 'select', key: 'genero', label: 'Gênero', options: ['Ficção Científica', 'Fantasia', 'Thriller', 'Romance', 'Autoajuda', 'Negócios', 'Terror', 'Histórico', 'YA', 'Infantil'] },
      { type: 'text', key: 'publicoAlvo', label: 'Público-alvo', placeholder: 'Ex: Jovens adultos apreciadores de ficção científica' },
      { type: 'tags', key: 'problemas', label: 'Problemas da capa atual', options: ['Cores sem identidade', 'Tipografia fraca', 'Não representa o gênero', 'Visual desatualizado', 'Falta impacto', 'Muito genérico'] },
      { type: 'radio', key: 'direcao', label: 'Direção', options: [{ label: 'Evolução do atual', value: 'evolucao' }, { label: 'Mudança radical', value: 'radical' }, { label: 'Seguir tendências', value: 'tendencia' }] },
    ],
    buildPrompt: (v) => `Concept board para redesign da capa — 3 direções:\n\nLIVRO: ${v.titulo}\nGÊNERO: ${v.genero || 'Não especificado'}\nPÚBLICO: ${v.publicoAlvo || 'Geral'}\nPROBLEMAS: ${v.problemas || 'Geral'}\nDIREÇÃO: ${v.direcao || 'evolucao'}\n\nPara cada direção:\n🎨 NOME\n🖼️ CONCEITO VISUAL\n🎨 PALETA (5 cores HEX)\n✍️ TIPOGRAFIA\n📐 COMPOSIÇÃO\n🤖 PROMPT MIDJOURNEY em inglês`,
    outputLabel: 'Concept board visual',
  },
  'metadados': {
    titulo: 'Gerar metadados', subtitulo: 'SEO completo para publicação',
    icon: Database, cor: '#34d399', creditos: '260 créditos', tipo: 'credito',
    descricaoFerramenta: 'Informe os dados do livro e receba metadados SEO completos para Amazon KDP, Hotmart e buscadores.',
    autoFill: { titulo: 'titulo', autor: 'autor', genero: 'genero' },
    fields: [
      { type: 'text', key: 'titulo', label: 'Título do livro', placeholder: 'Ex: Finanças Pessoais do Zero', required: true },
      { type: 'text', key: 'autor', label: 'Nome do autor', placeholder: 'Ex: Maria Santos' },
      { type: 'select', key: 'genero', label: 'Gênero principal', options: ['Autoajuda', 'Finanças', 'Negócios', 'Romance', 'Ficção', 'Ficção Científica', 'Fantasia', 'Thriller', 'Terror', 'Educação', 'Saúde', 'Culinária', 'Outro'] },
      { type: 'select', key: 'plataforma', label: 'Plataforma principal', options: ['Amazon KDP', 'Hotmart', 'Eduzz', 'Kiwify', 'Google Play Books', 'Todas'] },
      { type: 'textarea', key: 'descricao', label: 'Descrição do livro', placeholder: 'Temas principais, público e diferenciais...', rows: 4, required: true },
    ],
    buildPrompt: (v) => `Metadados SEO completos:\n\nTÍTULO: ${v.titulo}\nAUTOR: ${v.autor || 'Não informado'}\nGÊNERO: ${v.genero || 'Não especificado'}\nPLATAFORMA: ${v.plataforma || 'Todas'}\nDESCRIÇÃO: ${v.descricao}\n\n📝 TÍTULO SEO (60 chars)\n📝 SUBTÍTULO SEO (100 chars)\n📄 DESCRIÇÃO CURTA (150 chars)\n📄 DESCRIÇÃO MÉDIA (300 palavras)\n📄 DESCRIÇÃO LONGA (500+ palavras)\n🔍 10 KEYWORDS PRINCIPAIS\n🔍 10 PALAVRAS DE CAUDA LONGA\n📂 CATEGORIAS BISAC\n🏷️ 20 TAGS\n🌐 SLUG URL`,
    outputLabel: 'Metadados SEO completos',
  },
  'buscar-substituir': {
    titulo: 'Buscar e substituir', subtitulo: 'Consistência em todo o manuscrito',
    icon: Search, cor: '#fb7185', creditos: '30 créditos', tipo: 'credito',
    descricaoFerramenta: 'Cole o texto, defina as substituições e receba o manuscrito corrigido com relatório completo.',
    autoFill: { texto: 'capitulo_texto' },
    fields: [
      { type: 'textarea', key: 'substituicoes', label: 'O que substituir? (um por linha: ORIGINAL → NOVO)', placeholder: 'João → João Silva\ncastelo → palácio\nfeiticeira → maga', rows: 4, required: true },
      { type: 'radio', key: 'caseSensitive', label: 'Sensibilidade', options: [{ label: 'Ignorar maiúsculas', value: 'ignorar' }, { label: 'Manter exato', value: 'exato' }] },
      { type: 'textarea', key: 'texto', label: 'Texto do manuscrito', placeholder: 'Cole o texto aqui...', rows: 8, required: true },
    ],
    buildPrompt: (v) => `Aplique as substituições:\n\nSUBSTITUIÇÕES:\n${v.substituicoes}\nSENSIBILIDADE: ${v.caseSensitive || 'ignorar'}\n\nTEXTO:\n${v.texto}\n\n1. TEXTO ATUALIZADO\n2. RELATÓRIO (quantas vezes cada termo foi substituído)\n3. ALERTAS (inconsistências geradas)\n4. SUGESTÕES ADICIONAIS`,
    outputLabel: 'Texto atualizado + relatório',
  },
}

// ─── Ebook Selector ───────────────────────────────────────────────────────────

function EbookSelector({
  cor,
  onSelect,
  selectedId,
}: {
  cor: string
  onSelect: (ebook: EbookOption | null) => void
  selectedId: string | null
}) {
  const [ebooks, setEbooks] = useState<EbookOption[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const selectedEbook = ebooks.find(e => e.id === selectedId)

  useEffect(() => {
    setLoading(true)
    fetch('/api/kit-ferramentas/ebooks')
      .then(r => r.json())
      .then(d => setEbooks(d.ebooks ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (ebooks.length === 0 && !loading) return null

  return (
    <div className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Library className="size-4" style={{ color: cor }} />
          <span className="text-sm font-semibold text-white">Trabalhar com um livro existente</span>
          <span className="text-xs text-[#3a4a66]">(opcional)</span>
        </div>
        {selectedEbook && (
          <button onClick={() => onSelect(null)} className="text-[#3a4a66] hover:text-white transition">
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-[#3a4a66]">
          <Loader2 className="size-3 animate-spin" /> Carregando seus livros...
        </div>
      ) : selectedEbook ? (
        <div className="flex items-center justify-between rounded-xl border border-[#2a3553] bg-[#0f1523] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: `${cor}20` }}>
              <FileText className="size-4" style={{ color: cor }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{selectedEbook.titulo}</p>
              <p className="text-xs text-[#3a4a66]">
                {selectedEbook.tipo === 'draft' ? 'Rascunho' : selectedEbook.tipo === 'livro' ? 'Livro completo' : 'Prévia'}
                {selectedEbook.capitulos && selectedEbook.capitulos.length > 0 && ` · ${selectedEbook.capitulos.length} capítulos`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="text-xs text-[#6b7a99] hover:text-white transition flex items-center gap-1"
          >
            Trocar <ChevronRight className="size-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between rounded-xl border border-dashed border-[#2a3553] px-4 py-3 text-sm text-[#6b7a99] transition hover:border-[#3a4a66] hover:text-white"
        >
          <span className="flex items-center gap-2">
            <Library className="size-4" />
            Selecionar um dos seus livros para auto-preencher os campos
          </span>
          <ChevronDown className="size-4 shrink-0" />
        </button>
      )}

      {/* Dropdown */}
      {open && (
        <div className="mt-2 rounded-xl border border-[#1c2438] bg-[#080b14] overflow-hidden">
          {ebooks.map(e => (
            <button
              key={e.id}
              onClick={() => { onSelect(e); setOpen(false) }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#0b0f1c] border-b border-[#1c2438] last:border-0"
            >
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: `${cor}18` }}>
                <FileText className="size-3.5" style={{ color: cor }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{e.titulo}</p>
                <p className="text-xs text-[#3a4a66]">
                  {e.tipo === 'draft' ? 'Rascunho' : e.tipo === 'livro' ? 'Livro completo' : 'Prévia'}
                  {e.capitulos && e.capitulos.length > 0 && ` · ${e.capitulos.length} caps`}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Chapter selector ─────────────────────────────────────────────────────────

function ChapterSelector({
  capitulos,
  cor,
  onSelect,
}: {
  capitulos: { numero: number; titulo: string; texto: string }[]
  cor: string
  onSelect: (titulo: string, texto: string) => void
}) {
  if (!capitulos || capitulos.length === 0) return null
  return (
    <div className="mt-2 rounded-xl border border-[#1c2438] bg-[#0b0f1c] overflow-hidden">
      <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#3a4a66]">Selecionar capítulo do livro</p>
      {capitulos.map(c => (
        <button
          key={c.numero}
          onClick={() => onSelect(c.titulo, c.texto)}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-[#0f1523] border-t border-[#1c2438]"
        >
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-[10px] font-bold" style={{ background: `${cor}20`, color: cor }}>
            {c.numero}
          </span>
          <span className="truncate text-xs text-[#c8d3f5]">{c.titulo}</span>
        </button>
      ))}
    </div>
  )
}

// ─── Field Renderer ───────────────────────────────────────────────────────────

function FieldRenderer({
  field, value, onChange, ebook, cor,
}: {
  field: Field
  value: string
  onChange: (v: string) => void
  ebook: EbookOption | null
  cor: string
}) {
  const [showChapters, setShowChapters] = useState(false)
  const base = "w-full rounded-xl border border-[#1c2438] bg-[#080b14] px-4 py-2.5 text-sm text-white placeholder:text-[#3a4a66] focus:border-[#2a3553] focus:outline-none transition"

  const hasChapters = ebook && ebook.capitulos && ebook.capitulos.length > 0
  const isChapterField = field.key === 'texto' || field.key === 'tituloCapitulo'

  if (field.type === 'text') return (
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} className={base} />
  )

  if (field.type === 'textarea') return (
    <div>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} rows={field.rows ?? 3}
        className={`${base} resize-none leading-relaxed`} />
      {hasChapters && isChapterField && (
        <div className="mt-1.5">
          <button
            type="button"
            onClick={() => setShowChapters(s => !s)}
            className="flex items-center gap-1.5 text-[11px] transition"
            style={{ color: cor }}
          >
            <Library className="size-3" />
            {showChapters ? 'Fechar capítulos' : `Usar capítulo do livro (${ebook!.capitulos!.length} disponíveis)`}
          </button>
          {showChapters && (
            <ChapterSelector
              capitulos={ebook!.capitulos!}
              cor={cor}
              onSelect={(titulo, texto) => {
                if (field.key === 'tituloCapitulo') onChange(titulo)
                else onChange(texto)
                setShowChapters(false)
              }}
            />
          )}
        </div>
      )}
    </div>
  )

  if (field.type === 'select') return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)} className={`${base} appearance-none pr-10 cursor-pointer`}>
        <option value="">Selecione...</option>
        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#3a4a66]" />
    </div>
  )

  if (field.type === 'radio') return (
    <div className="flex flex-wrap gap-2">
      {field.options.map(o => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)}
          className={`rounded-xl border px-4 py-2 text-xs font-medium transition ${value === o.value ? 'border-[#4f7fff50] bg-[#4f7fff15] text-[#4f7fff]' : 'border-[#1c2438] bg-[#0b0f1c] text-[#6b7a99] hover:border-[#2a3553] hover:text-white'}`}>
          {o.label}
        </button>
      ))}
    </div>
  )

  if (field.type === 'tags') {
    const selected = value ? value.split(',').map(s => s.trim()).filter(Boolean) : []
    const toggle = (opt: string) => {
      const next = selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]
      onChange(next.join(', '))
    }
    return (
      <div className="flex flex-wrap gap-2">
        {field.options.map(o => (
          <button key={o} type="button" onClick={() => toggle(o)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition ${selected.includes(o) ? 'border-[#4f7fff50] bg-[#4f7fff15] text-[#4f7fff]' : 'border-[#1c2438] bg-[#0b0f1c] text-[#6b7a99] hover:border-[#2a3553] hover:text-white'}`}>
            {o}
          </button>
        ))}
      </div>
    )
  }

  return null
}

// ─── Saved works panel ────────────────────────────────────────────────────────

function SavedWorksPanel({
  toolSlug,
  ebookId,
  cor,
  onLoad,
}: {
  toolSlug: string
  ebookId: string | null
  cor: string
  onLoad: (resultado: string) => void
}) {
  const [works, setWorks] = useState<SavedWork[]>([])
  const [open, setOpen] = useState(false)
  const key = `kit_save_${toolSlug}_${ebookId ?? 'sem-livro'}`

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) setWorks(JSON.parse(raw))
    } catch { /* ignore */ }
  }, [key])

  if (works.length === 0) return null

  return (
    <div className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] overflow-hidden">
      <button
        onClick={() => setOpen(s => !s)}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <Clock className="size-4" style={{ color: cor }} />
          <span className="text-sm font-semibold text-white">Trabalhos salvos</span>
          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: `${cor}20`, color: cor }}>
            {works.length}
          </span>
        </div>
        <ChevronDown className={`size-4 text-[#6b7a99] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-[#1c2438]">
          {works.map((w, i) => (
            <div key={i} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#1c2438] last:border-0">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-[#c8d3f5] truncate">
                  {w.ebookTitulo ? `📖 ${w.ebookTitulo}` : 'Sem livro vinculado'}
                </p>
                <p className="text-[10px] text-[#3a4a66]">{new Date(w.timestamp).toLocaleString('pt-BR')}</p>
              </div>
              <button
                onClick={() => { onLoad(w.resultado); setOpen(false) }}
                className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition hover:opacity-80"
                style={{ background: `${cor}20`, color: cor }}
              >
                Carregar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function FerramentaPage() {
  const params = useParams()
  const slug = params.ferramenta as string
  const tool = TOOLS[slug]

  const [values, setValues] = useState<Record<string, string>>({})
  const [resultado, setResultado] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [selectedEbook, setSelectedEbook] = useState<EbookOption | null>(null)
  const [saved, setSaved] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (streamingText || resultado) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [streamingText, resultado])

  // Auto-fill fields from selected ebook
  const handleSelectEbook = useCallback((ebook: EbookOption | null) => {
    setSelectedEbook(ebook)
    if (!ebook || !tool.autoFill) return

    const newValues: Record<string, string> = { ...values }
    for (const [fieldKey, ebookKey] of Object.entries(tool.autoFill)) {
      if (ebookKey === 'capitulo_titulo' || ebookKey === 'capitulo_texto') continue
      const val = ebook[ebookKey as keyof EbookOption]
      if (val && typeof val === 'string') {
        newValues[fieldKey] = val
      }
    }
    setValues(newValues)
  }, [tool, values])

  const saveWork = useCallback(() => {
    if (!resultado) return
    const key = `kit_save_${slug}_${selectedEbook?.id ?? 'sem-livro'}`
    try {
      const raw = localStorage.getItem(key)
      const existing: SavedWork[] = raw ? JSON.parse(raw) : []
      const newWork: SavedWork = {
        resultado,
        timestamp: new Date().toISOString(),
        ebookTitulo: selectedEbook?.titulo,
        formValues: values,
      }
      const updated = [newWork, ...existing].slice(0, 5)
      localStorage.setItem(key, JSON.stringify(updated))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch { /* ignore */ }
  }, [resultado, slug, selectedEbook, values])

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
  const outputText = streamingText || resultado

  async function gerarResultado() {
    if (!isFormValid || isLoading) return
    setIsLoading(true)
    setResultado('')
    setStreamingText('')
    setSaved(false)

    const prompt = tool.buildPrompt(values)
    try {
      const res = await fetch('/api/kit-ferramentas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ferramenta: slug, messages: [{ role: 'user', content: prompt }] }),
      })
      if (!res.ok || !res.body) throw new Error('Erro')
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
            <p className="text-xs text-[#6b7a99]">{selectedEbook ? `📖 ${selectedEbook.titulo}` : tool.subtitulo}</p>
          </div>
          <div className="shrink-0">
            {tool.tipo === 'pago'
              ? <span className="rounded-lg bg-[#4f7fff15] px-3 py-1 text-xs font-bold text-[#4f7fff]">{tool.preco}</span>
              : <span className="rounded-lg px-3 py-1 text-xs font-bold" style={{ background: `${tool.cor}18`, color: tool.cor }}>−{tool.creditos}</span>
            }
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-8 pb-16 md:px-8 space-y-5">

        {/* Ebook selector */}
        <EbookSelector cor={tool.cor} onSelect={handleSelectEbook} selectedId={selectedEbook?.id ?? null} />

        {/* Saved works */}
        <SavedWorksPanel
          toolSlug={slug}
          ebookId={selectedEbook?.id ?? null}
          cor={tool.cor}
          onLoad={(r) => { setResultado(r); setStreamingText('') }}
        />

        {/* Form */}
        {!resultado && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="size-4 mt-0.5 shrink-0" style={{ color: tool.cor }} />
                <p className="text-sm leading-relaxed text-[#8b99c0]">{tool.descricaoFerramenta}</p>
              </div>
            </div>

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
                    ebook={selectedEbook}
                    cor={tool.cor}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={gerarResultado}
              disabled={!isFormValid || isLoading}
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-bold text-white transition disabled:opacity-40"
              style={{ background: `linear-gradient(135deg, ${tool.cor}, ${tool.cor}99)`, boxShadow: `0 0 24px ${tool.cor}40` }}
            >
              {isLoading ? <><Loader2 className="size-4 animate-spin" /> Gerando com IA...</> : <><Wand2 className="size-4" /> Gerar com Aurora IA</>}
            </button>
          </div>
        )}

        {/* Streaming */}
        {isLoading && streamingText && (
          <div ref={resultRef} className="space-y-4">
            <div className="flex items-center gap-2 rounded-2xl border border-[#1c2438] bg-[#0b0f1c] px-5 py-3">
              <Loader2 className="size-4 animate-spin shrink-0" style={{ color: tool.cor }} />
              <span className="text-xs text-[#6b7a99]">Aurora IA gerando...</span>
            </div>
            <div className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-6">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-[#c8d3f5] font-sans">
                {streamingText}
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse align-middle" style={{ background: tool.cor }} />
              </pre>
            </div>
          </div>
        )}

        {/* Result */}
        {resultado && !isLoading && (
          <div ref={resultRef} className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: `${tool.cor}20` }}>
                  <Sparkles className="size-3.5" style={{ color: tool.cor }} />
                </div>
                <span className="text-sm font-semibold text-white">{tool.outputLabel}</span>
                {selectedEbook && (
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-medium text-[#6b7a99] border border-[#1c2438]">
                    📖 {selectedEbook.titulo}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={saveWork}
                  className="flex items-center gap-1.5 rounded-lg border border-[#1c2438] bg-[#0b0f1c] px-3 py-1.5 text-xs transition hover:text-white"
                  style={{ color: saved ? '#00e5c3' : '#6b7a99' }}
                >
                  {saved ? <><Check className="size-3.5" /> Salvo!</> : <><Save className="size-3.5" /> Salvar</>}
                </button>
                <button
                  onClick={() => { navigator.clipboard.writeText(resultado) }}
                  className="flex items-center gap-1.5 rounded-lg border border-[#1c2438] bg-[#0b0f1c] px-3 py-1.5 text-xs text-[#6b7a99] transition hover:text-white"
                >
                  <Copy className="size-3.5" /> Copiar
                </button>
                <button
                  onClick={() => { setResultado(''); setStreamingText('') }}
                  className="flex items-center gap-1.5 rounded-lg border border-[#1c2438] bg-[#0b0f1c] px-3 py-1.5 text-xs text-[#6b7a99] transition hover:text-white"
                >
                  <RefreshCw className="size-3.5" /> Refazer
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-[#1c2438] bg-[#0b0f1c] p-6">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-[#c8d3f5] font-sans">{resultado}</pre>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { setResultado(''); setStreamingText('') }}
                className="flex items-center gap-2 rounded-xl border border-[#1c2438] bg-[#0b0f1c] px-4 py-2.5 text-sm text-[#6b7a99] transition hover:text-white"
              >
                <ArrowLeft className="size-4" /> Ajustar e regerar
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([resultado], { type: 'text/plain' })
                  const a = document.createElement('a')
                  a.href = URL.createObjectURL(blob)
                  a.download = `${tool.titulo.replace(/\s+/g, '-').toLowerCase()}-${selectedEbook?.titulo?.replace(/\s+/g, '-').toLowerCase() ?? 'resultado'}.txt`
                  a.click()
                }}
                className="flex items-center gap-2 rounded-xl border border-[#1c2438] bg-[#0b0f1c] px-4 py-2.5 text-sm text-[#6b7a99] transition hover:text-white"
              >
                <Download className="size-4" /> Baixar .txt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
