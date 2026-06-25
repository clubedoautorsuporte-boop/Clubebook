import PDFDocument from 'pdfkit'

export type CapituloDetalhado = {
  numero: number
  titulo: string
  descricao: string
  blocos: string[]
}

export type BriefingPlan = {
  titulo: string
  subtitulo: string
  autor: string
  capitulos: CapituloDetalhado[]
  promessa: string
  mensagem_final: string
}

const MARGIN = 72
const INDENT = 36

export async function generateEbookPdf(plan: BriefingPlan): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } })
    const chunks: Buffer[] = []
    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const W = doc.page.width - MARGIN * 2

    // ──────────────────────────────────────────────────────────────
    // PÁGINA 1 — CAPA
    // ──────────────────────────────────────────────────────────────
    doc.moveDown(9)

    doc.font('Helvetica-Bold').fontSize(32).fillColor('#000000')
      .text(plan.titulo, { align: 'center', width: W })

    doc.moveDown(0.4)

    doc.font('Helvetica-Bold').fontSize(18).fillColor('#000000')
      .text(plan.subtitulo, { align: 'center', width: W })

    doc.moveDown(0.4)

    doc.font('Helvetica-Bold').fontSize(13).fillColor('#000000')
      .text('por: ' + plan.autor, { align: 'center', width: W })

    // ──────────────────────────────────────────────────────────────
    // PÁGINA 2+ — RESUMO DOS CAPÍTULOS
    // ──────────────────────────────────────────────────────────────
    doc.addPage()

    plan.capitulos.forEach(function(cap) {
      var estimatedHeight = 60 + Math.ceil((cap.descricao || '').length / 80) * 16
      if (doc.y + estimatedHeight > doc.page.height - MARGIN) doc.addPage()

      doc.font('Helvetica-Bold').fontSize(12).fillColor('#000000')
        .text('Capítulo ' + cap.numero + ': ' + cap.titulo, { width: W, indent: INDENT })

      doc.moveDown(0.3)

      if (cap.descricao) {
        doc.font('Helvetica').fontSize(12).fillColor('#000000')
          .text(cap.descricao, { align: 'justify', width: W, indent: INDENT })
      }

      doc.moveDown(1)
    })

    // ──────────────────────────────────────────────────────────────
    // PRÓXIMAS PÁGINAS — ESTRUTURA DE BLOCOS (bilíngue)
    // ──────────────────────────────────────────────────────────────
    doc.addPage()

    doc.font('Helvetica').fontSize(12).fillColor('#000000')
      .text('Estrutura de capítulos e um breve resumo do conteúdo de cada um deles / ', {
        align: 'center',
        width: W,
      })

    doc.font('Helvetica-Bold').fontSize(12).fillColor('#000000')
      .text('Estructura de capítulos y un breve resumen del contenido de cada uno de ellos', {
        align: 'center',
        width: W,
      })

    doc.moveDown(1.2)

    plan.capitulos.forEach(function(cap) {
      var estimatedHeight = 30 + (cap.blocos ? cap.blocos.length : 0) * 55
      if (doc.y + estimatedHeight > doc.page.height - MARGIN) doc.addPage()

      doc.font('Helvetica-Bold').fontSize(12).fillColor('#000000')
        .text('Capítulo ' + cap.numero + ': ' + cap.titulo, { width: W, indent: INDENT })

      doc.moveDown(0.4)

      var blocos = cap.blocos && cap.blocos.length ? cap.blocos : []
      blocos.forEach(function(bloco, idx) {
        if (doc.y > doc.page.height - 100) doc.addPage()

        var blocoText = bloco.replace(/^Bloco\s+\d+:\s*/i, '')

        doc.font('Helvetica-Bold').fontSize(12).fillColor('#000000')
          .text('Bloco ' + (idx + 1) + ': ', { continued: true, width: W, indent: INDENT })

        doc.font('Helvetica').fontSize(12).fillColor('#000000')
          .text(blocoText, { align: 'justify', width: W })

        doc.moveDown(0.5)
      })

      doc.moveDown(0.6)
    })

    // ──────────────────────────────────────────────────────────────
    // PÁGINA — MENSAGEM MOTIVACIONAL (Aurora)
    // ──────────────────────────────────────────────────────────────
    doc.addPage()

    if (plan.mensagem_final) {
      var paragrafos = plan.mensagem_final.split('\n').filter(Boolean)
      paragrafos.forEach(function(paragrafo) {
        doc.font('Helvetica-BoldOblique').fontSize(12).fillColor('#000000')
          .text(paragrafo, { align: 'justify', width: W, indent: INDENT })
        doc.moveDown(0.9)
      })
    }

    // ──────────────────────────────────────────────────────────────
    // ÚLTIMA PÁGINA — CTA (PT + ES)
    // ──────────────────────────────────────────────────────────────
    doc.addPage()

    doc.moveDown(2)

    // PT linha 1
    doc.font('Helvetica').fontSize(14).fillColor('#000000')
      .text('Para gerar agora seu livro ', { align: 'center', width: W, continued: true })
    doc.font('Helvetica-Bold').fontSize(14)
      .text('"' + plan.titulo + '"', { continued: true })
    doc.font('Helvetica').fontSize(14)
      .text(', basta fazer o pagamento do pix', { continued: true })
    doc.font('Helvetica-Bold').fontSize(14)
      .text('\nclicando no link que está em seu\n', { align: 'center', width: W, continued: true })
    doc.font('Helvetica').fontSize(14)
      .text('WhatsApp.', { align: 'center', width: W })

    doc.moveDown(1.2)

    // PT linha 2
    doc.font('Helvetica').fontSize(14).fillColor('#000000')
      .text('Vou colocar a mão na massa aqui e ', { align: 'center', width: W, continued: true })
    doc.font('Helvetica-Bold').fontSize(14)
      .text('em menos de 1 hora', { continued: true })
    doc.font('Helvetica').fontSize(14)
      .text(', começando a contar assim que você fizer o pagamento, ', { continued: true })
    doc.font('Helvetica-Bold').fontSize(14)
      .text('seu livro irá chegar pronto, tanto em seu e-mail quanto no\nWhatsApp', { continued: true })
    doc.font('Helvetica').fontSize(14)
      .text('!', { align: 'center', width: W })

    doc.moveDown(2.5)

    // ES — versão em espanhol
    doc.font('Helvetica').fontSize(11).fillColor('#444444')
      .text(
        'Para generar ahora tu libro "' + plan.titulo + '", solo necesitas realizar el pago por pix haciendo clic en el enlace que está en tu WhatsApp.',
        { align: 'center', width: W }
      )

    doc.moveDown(0.8)

    doc.font('Helvetica').fontSize(11).fillColor('#444444')
      .text(
        'Voy a poner manos a la obra aquí y, en menos de 1 hora, contando a partir del momento en que realices el pago, tu libro llegará listo tanto a tu correo electrónico como a tu WhatsApp.',
        { align: 'center', width: W }
      )

    doc.end()
  })
}
