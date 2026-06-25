import { getGoogleAccessToken } from './upload-to-drive'
import type { BriefingPlan } from './generate-pdf'

function buildHtml(plan: BriefingPlan, nomeAutor: string): string {
  const capitulosHtml = plan.capitulos
    .map(
      (cap) => `
      <h2>Capítulo ${cap.numero}: ${cap.titulo}</h2>
      <p>${cap.descricao ?? ''}</p>
      ${
        cap.blocos?.length
          ? cap.blocos
              .map((b, i) => {
                const texto = b.replace(/^Bloco\s+\d+:\s*/i, '')
                return `<p><strong>Bloco ${i + 1}:</strong> ${texto}</p>`
              })
              .join('')
          : ''
      }
    `,
    )
    .join('<hr/>')

  const mensagemHtml = (plan.mensagem_final ?? '')
    .split('\n')
    .filter(Boolean)
    .map((p) => `<p><em>${p}</em></p>`)
    .join('')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/></head>
<body>
<h1>${plan.titulo}</h1>
<h3>${plan.subtitulo}</h3>
<p><em>por: ${nomeAutor}</em></p>
<hr/>
<p><strong>✨ Promessa:</strong> ${plan.promessa}</p>
<hr/>
<h2>Sumário dos Capítulos</h2>
${capitulosHtml}
<hr/>
${mensagemHtml}
</body>
</html>`
}

export async function createGoogleDoc(plan: BriefingPlan, nomeAutor: string): Promise<string> {
  const token = await getGoogleAccessToken()
  const html = buildHtml(plan, nomeAutor)

  const metadata = {
    name: `Planejamento — ${plan.titulo}`,
    mimeType: 'application/vnd.google-apps.document',
  }

  const boundary = 'BRIEFING_DOC_BOUNDARY'
  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify(metadata),
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    '',
    html,
    `--${boundary}--`,
  ].join('\r\n')

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary="${boundary}"`,
      },
      body,
    },
  )

  const fileData = await uploadRes.json()
  console.log('[create-google-doc] drive response:', JSON.stringify(fileData))
  if (!uploadRes.ok || !fileData.id) {
    throw new Error(`Drive API error: ${JSON.stringify(fileData)}`)
  }
  const file = fileData as { id: string }

  await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}/permissions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: 'reader', type: 'anyone' }),
  })

  return `https://docs.google.com/document/d/${file.id}/edit`
}
