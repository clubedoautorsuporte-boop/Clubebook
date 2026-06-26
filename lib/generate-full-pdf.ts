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

const MARGIN = { top: 80, bottom: 80, left: 90, right: 72 }
const PAGE_W = 595.28 // A4
const TEXT_W = PAGE_W - MARGIN.left - MARGIN.right

export async function generateFullBookPdf(book: FullBook): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: MARGIN,
      info: {
        Title: book.titulo,
        Author: book.autor,
        Subject: book.subtitulo,
        Creator: 'Clube do Autor IA',
        Producer: 'Clube do Autor IA',
      },
    })

    const chunks: Buffer[] = []
    doc.on('data', (c: Buffer) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const pageNum = { n: 0 }

    // ── CAPA ───────────────────────────────────────────────────────────
    doc.rect(0, 0, PAGE_W, doc.page.height).fill('#0a0f1e')

    // Gradiente simulado com retângulos
    for (let i = 0; i < 60; i++) {
      const alpha = (i / 60) * 0.35
      doc.rect(0, doc.page.height * 0.4 + i * 4, PAGE_W, 4)
         .fill(`#1a3a6b`)
         .fillOpacity(alpha)
    }
    doc.fillOpacity(1)

    // Linha decorativa topo
    doc.rect(MARGIN.left, 60, 80, 3).fill('#00e5c3')

    // Título
    doc.font('Helvetica-Bold').fontSize(32).fill('#ffffff')
       .text(book.titulo, MARGIN.left, 100, { width: TEXT_W, lineGap: 6 })

    // Subtítulo
    if (book.subtitulo) {
      doc.font('Helvetica').fontSize(14).fill('#7fb3d3')
         .text(book.subtitulo, MARGIN.left, doc.y + 16, { width: TEXT_W })
    }

    // Linha divisória
    const yLine = doc.y + 32
    doc.rect(MARGIN.left, yLine, TEXT_W, 1).fill('#1c3a5e')

    // Autor
    doc.font('Helvetica').fontSize(12).fill('#a0c4d8')
       .text(`Por ${book.autor}`, MARGIN.left, yLine + 20)

    // Badge bottom
    doc.font('Helvetica').fontSize(9).fill('#00e5c3')
       .text('CLUBE DO AUTOR IA', MARGIN.left, doc.page.height - 60)

    doc.font('Helvetica').fontSize(9).fill('#3a5a7a')
       .text(`${book.capitulos.length} capítulos · Gerado com Aurora IA`, MARGIN.left, doc.page.height - 46)

    // ── SUMÁRIO ────────────────────────────────────────────────────────
    doc.addPage()
    pageNum.n = 1

    doc.rect(0, 0, PAGE_W, doc.page.height).fill('#080c18')
    doc.fillOpacity(1)

    doc.font('Helvetica-Bold').fontSize(22).fill('#ffffff')
       .text('Sumário', MARGIN.left, MARGIN.top)

    doc.rect(MARGIN.left, MARGIN.top + 34, 50, 2).fill('#00e5c3')

    let y = MARGIN.top + 60
    book.capitulos.forEach((cap) => {
      doc.font('Helvetica').fontSize(11).fill('#6b8fa8')
         .text(`${cap.numero}.`, MARGIN.left, y, { continued: false, width: 24 })
      doc.font('Helvetica-Bold').fontSize(11).fill('#d0e4f0')
         .text(cap.titulo, MARGIN.left + 28, y, { width: TEXT_W - 28 - 40 })
      y = doc.y + 10
      if (y > doc.page.height - MARGIN.bottom) {
        doc.addPage()
        doc.rect(0, 0, PAGE_W, doc.page.height).fill('#080c18')
        y = MARGIN.top
      }
    })

    // ── CAPÍTULOS ─────────────────────────────────────────────────────
    book.capitulos.forEach((cap) => {
      // Página de abertura do capítulo
      doc.addPage()
      doc.rect(0, 0, PAGE_W, doc.page.height).fill('#080c18')
      doc.fillOpacity(1)

      // Número do capítulo
      doc.font('Helvetica').fontSize(11).fill('#00e5c3')
         .text(`Capítulo ${cap.numero}`, MARGIN.left, MARGIN.top)

      doc.rect(MARGIN.left, MARGIN.top + 22, 60, 2).fill('#00e5c3')

      // Título do capítulo
      doc.font('Helvetica-Bold').fontSize(24).fill('#ffffff')
         .text(cap.titulo, MARGIN.left, MARGIN.top + 40, { width: TEXT_W, lineGap: 4 })

      // Conteúdo do capítulo
      const lines = cap.content.split('\n')
      let inParagraph = false
      let yPos = doc.y + 40

      const ensureSpace = (needed = 60) => {
        if (yPos > doc.page.height - MARGIN.bottom - needed) {
          doc.addPage()
          doc.rect(0, 0, PAGE_W, doc.page.height).fill('#080c18')
          // Número de página discreto no rodapé
          doc.font('Helvetica').fontSize(8).fill('#2a3a50')
             .text(`${book.titulo}  ·  Capítulo ${cap.numero}`, MARGIN.left, doc.page.height - 50, { width: TEXT_W })
          yPos = MARGIN.top
        }
      }

      for (const rawLine of lines) {
        const line = rawLine.trim()

        if (!line) {
          yPos += inParagraph ? 10 : 0
          inParagraph = false
          continue
        }

        // Subtítulo ## Heading
        if (line.startsWith('## ')) {
          ensureSpace(80)
          yPos += 20
          doc.font('Helvetica-Bold').fontSize(14).fill('#4f9fff')
             .text(line.replace(/^## /, ''), MARGIN.left, yPos, { width: TEXT_W })
          yPos = doc.y + 12
          inParagraph = false
          continue
        }

        // Subtítulo ### Sub-heading
        if (line.startsWith('### ')) {
          ensureSpace(60)
          yPos += 14
          doc.font('Helvetica-Bold').fontSize(12).fill('#00e5c3')
             .text(line.replace(/^### /, ''), MARGIN.left, yPos, { width: TEXT_W })
          yPos = doc.y + 8
          inParagraph = false
          continue
        }

        // Lista
        if (line.startsWith('- ') || line.startsWith('* ')) {
          ensureSpace(40)
          const bullet = line.replace(/^[-*] /, '')
          // Processa negrito inline
          renderInline(doc, `• ${bullet}`, MARGIN.left + 12, yPos, TEXT_W - 12, '#c8d8e8', 10.5)
          yPos = doc.y + 5
          inParagraph = false
          continue
        }

        // Numeração
        if (/^\d+\.\s/.test(line)) {
          ensureSpace(40)
          renderInline(doc, line, MARGIN.left + 12, yPos, TEXT_W - 12, '#c8d8e8', 10.5)
          yPos = doc.y + 5
          inParagraph = false
          continue
        }

        // Parágrafo normal
        ensureSpace(50)
        if (!inParagraph) yPos += 6
        renderInline(doc, line, MARGIN.left, yPos, TEXT_W, '#c8d8e8', 11)
        yPos = doc.y + 8
        inParagraph = true
      }
    })

    doc.end()
  })
}

// Renderiza texto com **negrito** inline
function renderInline(
  doc: PDFKit.PDFDocument,
  text: string,
  x: number, y: number,
  width: number,
  color: string,
  fontSize: number,
) {
  // Substituição simples: quebra em partes normal/bold
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  if (parts.length === 1) {
    // Sem negrito — renderiza direto com quebra de linha automática
    doc.font('Helvetica').fontSize(fontSize).fill(color)
       .text(text, x, y, { width, lineGap: 3 })
    return
  }

  // Tem negrito — usa continued para renderizar inline
  let first = true
  for (const part of parts) {
    if (!part) continue
    if (part.startsWith('**') && part.endsWith('**')) {
      const bold = part.slice(2, -2)
      doc.font('Helvetica-Bold').fontSize(fontSize).fill(color)
         .text(bold, first ? x : undefined, first ? y : undefined, { width, continued: true, lineGap: 3 })
    } else {
      doc.font('Helvetica').fontSize(fontSize).fill(color)
         .text(part, first ? x : undefined, first ? y : undefined, { width, continued: true, lineGap: 3 })
    }
    first = false
  }
  // Termina o continued
  doc.text('', { continued: false })
}
