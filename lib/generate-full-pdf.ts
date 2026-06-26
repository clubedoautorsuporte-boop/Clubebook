import PDFDocument from 'pdfkit'

export type FullChapter = {
  numero: number
  titulo: string
  content: string
}

export type FullBook = {
  titulo: string
  subtitulo: string
  autor: string
  capitulos: FullChapter[]
}

// Medidas A4
const PAGE_W = 595.28
const PAGE_H = 841.89
const ML = 80   // margem esquerda
const MR = 80   // margem direita
const MT = 80   // margem topo
const MB = 80   // margem rodapé
const TW = PAGE_W - ML - MR  // largura útil do texto

// Cores
const BLACK  = '#000000'
const DARK   = '#1a1a1a'
const GRAY   = '#555555'
const LGRAY  = '#888888'
const LINE   = '#cccccc'

// ── Fontes ────────────────────────────────────────────────────────
const F_BODY   = 'Times-Roman'
const F_BOLD   = 'Times-Bold'
const F_ITALIC = 'Times-Italic'
const F_HEAD   = 'Helvetica-Bold'
const F_SANS   = 'Helvetica'

export async function generateFullBookPdf(book: FullBook): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: MT, bottom: MB, left: ML, right: MR },
      info: {
        Title:    book.titulo,
        Author:   book.autor,
        Subject:  book.subtitulo,
        Creator:  'Clube do Autor IA',
        Producer: 'Aurora IA',
      },
    })

    const chunks: Buffer[] = []
    doc.on('data', (c: Buffer) => chunks.push(c))
    doc.on('end',  () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    let pageNumber = 0

    function newPage() {
      doc.addPage()
      pageNumber++
    }

    function pageFooter(label?: string) {
      const y = PAGE_H - 50
      doc.font(F_SANS).fontSize(8).fillColor(LGRAY)
      if (label) {
        doc.text(label, ML, y, { width: TW / 2, align: 'left' })
      }
      doc.text(String(pageNumber), ML, y, { width: TW, align: 'right' })
    }

    // ── CAPA ──────────────────────────────────────────────────────
    // Fundo branco, conteúdo centralizado verticalmente
    doc.fillColor(BLACK)

    const coverY = PAGE_H * 0.28

    // Linha decorativa topo
    doc.rect(ML, 60, TW, 2).fill(DARK)

    // Título principal
    doc.font(F_HEAD).fontSize(32).fillColor(BLACK)
       .text(book.titulo, ML, coverY, { width: TW, align: 'center', lineGap: 6 })

    // Linha separadora
    const afterTitle = doc.y + 20
    doc.rect(ML + TW * 0.25, afterTitle, TW * 0.5, 1).fill(DARK)

    // Subtítulo
    if (book.subtitulo) {
      doc.font(F_ITALIC).fontSize(14).fillColor(DARK)
         .text(book.subtitulo, ML, afterTitle + 18, { width: TW, align: 'center' })
    }

    // Autor
    doc.font(F_SANS).fontSize(12).fillColor(GRAY)
       .text(`por: ${book.autor}`, ML, doc.y + 24, { width: TW, align: 'center' })

    // Linha rodapé da capa
    doc.rect(ML, PAGE_H - 62, TW, 2).fill(DARK)
    doc.font(F_SANS).fontSize(8).fillColor(LGRAY)
       .text('Clube do Autor IA  ·  Aurora IA', ML, PAGE_H - 48, { width: TW, align: 'center' })

    // ── SUMÁRIO ───────────────────────────────────────────────────
    newPage()
    pageNumber = 1

    doc.font(F_HEAD).fontSize(22).fillColor(BLACK)
       .text('Sumário', ML, MT)

    doc.rect(ML, MT + 32, TW, 1.5).fill(DARK)

    let tocY = MT + 52

    book.capitulos.forEach((cap) => {
      // Garante espaço na página
      if (tocY > PAGE_H - MB - 60) {
        pageFooter()
        newPage()
        tocY = MT
      }

      // Número + título
      doc.font(F_BOLD).fontSize(11).fillColor(DARK)
         .text(`${cap.numero}.`, ML, tocY, { width: 24, continued: false })
      doc.font(F_BOLD).fontSize(11).fillColor(DARK)
         .text(cap.titulo, ML + 28, tocY, { width: TW - 28 })

      tocY = doc.y + 4

      // Preview do conteúdo (primeiras 120 chars)
      const preview = cap.content.replace(/\n/g, ' ').replace(/#+\s*/g, '').replace(/\*\*/g, '').slice(0, 140).trim()
      doc.font(F_ITALIC).fontSize(9).fillColor(LGRAY)
         .text(preview + '…', ML + 28, tocY, { width: TW - 28 })

      tocY = doc.y + 14

      // Linha separadora leve
      doc.rect(ML + 28, tocY - 6, TW - 28, 0.5).fill(LINE)
    })

    pageFooter()

    // ── CAPÍTULOS ─────────────────────────────────────────────────
    book.capitulos.forEach((cap) => {
      newPage()

      // Número do capítulo (menor, acima do título)
      doc.font(F_SANS).fontSize(10).fillColor(LGRAY)
         .text(`Capítulo ${cap.numero}`, ML, MT)

      // Linha decorativa
      doc.rect(ML, MT + 18, 40, 1.5).fill(DARK)

      // Título do capítulo
      doc.font(F_HEAD).fontSize(22).fillColor(BLACK)
         .text(cap.titulo, ML, MT + 30, { width: TW, lineGap: 4 })

      // Linha separadora abaixo do título
      doc.rect(ML, doc.y + 14, TW, 1).fill(LINE)

      let yPos = doc.y + 28

      const lines = cap.content.split('\n')

      for (const rawLine of lines) {
        const line = rawLine.trim()

        // Verifica se precisa de nova página
        if (yPos > PAGE_H - MB - 40) {
          pageFooter(book.titulo)
          newPage()
          yPos = MT
        }

        if (!line) {
          yPos += 8
          continue
        }

        // ## Seção principal
        if (line.startsWith('## ')) {
          if (yPos > PAGE_H - MB - 80) {
            pageFooter(book.titulo)
            newPage()
            yPos = MT
          }
          yPos += 16
          doc.font(F_HEAD).fontSize(14).fillColor(BLACK)
             .text(line.replace(/^## /, ''), ML, yPos, { width: TW })
          yPos = doc.y + 10
          // Linha fina sob a seção
          doc.rect(ML, yPos - 4, TW * 0.4, 0.75).fill(LINE)
          yPos += 4
          continue
        }

        // ### Sub-seção
        if (line.startsWith('### ')) {
          yPos += 10
          doc.font(F_BOLD).fontSize(12).fillColor(DARK)
             .text(line.replace(/^### /, ''), ML, yPos, { width: TW })
          yPos = doc.y + 6
          continue
        }

        // Lista com marcador
        if (/^[-*•]\s/.test(line)) {
          const item = line.replace(/^[-*•]\s+/, '')
          renderTextInline(doc, `•  ${item}`, ML + 16, yPos, TW - 16, DARK, 12, F_BODY, F_BOLD, 5)
          yPos = doc.y + 5
          continue
        }

        // Lista numerada
        if (/^\d+\.\s/.test(line)) {
          renderTextInline(doc, line, ML + 8, yPos, TW - 8, DARK, 12, F_BODY, F_BOLD, 5)
          yPos = doc.y + 5
          continue
        }

        // Bloco de citação (> texto)
        if (line.startsWith('> ')) {
          const quote = line.replace(/^> /, '')
          yPos += 6
          doc.rect(ML, yPos, 3, 20).fill(LGRAY)
          doc.font(F_ITALIC).fontSize(11).fillColor(GRAY)
             .text(quote, ML + 14, yPos, { width: TW - 14, lineGap: 4 })
          yPos = doc.y + 10
          continue
        }

        // Parágrafo normal — recuo de parágrafo clássico
        renderTextInline(doc, line, ML, yPos, TW, BLACK, 12, F_BODY, F_BOLD, 5)
        yPos = doc.y + 8
      }

      pageFooter(book.titulo)
    })

    doc.end()
  })
}

// ── Renderiza texto com **negrito** e _itálico_ inline ─────────────
function renderTextInline(
  doc: PDFKit.PDFDocument,
  text: string,
  x: number, y: number,
  width: number,
  color: string,
  fontSize: number,
  fontNormal: string,
  fontBold: string,
  lineGap: number,
) {
  // Divide em segmentos: normal | **bold** | _italic_
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/)

  if (parts.length === 1) {
    doc.font(fontNormal).fontSize(fontSize).fillColor(color)
       .text(text, x, y, { width, lineGap, align: 'justify' })
    return
  }

  let firstPart = true
  for (const part of parts) {
    if (!part) continue
    if (part.startsWith('**') && part.endsWith('**')) {
      doc.font(fontBold).fontSize(fontSize).fillColor(color)
         .text(part.slice(2, -2), firstPart ? x : undefined, firstPart ? y : undefined,
               { width, lineGap, continued: true, align: 'justify' })
    } else if (part.startsWith('_') && part.endsWith('_')) {
      doc.font('Times-Italic').fontSize(fontSize).fillColor(color)
         .text(part.slice(1, -1), firstPart ? x : undefined, firstPart ? y : undefined,
               { width, lineGap, continued: true, align: 'justify' })
    } else {
      doc.font(fontNormal).fontSize(fontSize).fillColor(color)
         .text(part, firstPart ? x : undefined, firstPart ? y : undefined,
               { width, lineGap, continued: true, align: 'justify' })
    }
    firstPart = false
  }
  doc.text('', { continued: false })
}
