import crypto from 'crypto'

export async function getGoogleAccessToken(): Promise<string> {
  // Opção 1: refresh token OAuth (usuário autorizado)
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.AUTH_GOOGLE_ID!,
        client_secret: process.env.AUTH_GOOGLE_SECRET!,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    })
    const data = (await res.json()) as { access_token?: string; error?: string; error_description?: string }
    console.log('[get-token] refresh response:', JSON.stringify({ ok: res.ok, error: data.error, has_token: !!data.access_token }))
    if (!res.ok || !data.access_token) {
      throw new Error(`Token refresh failed: ${data.error} — ${data.error_description}`)
    }
    return data.access_token
  }

  // Opção 2: service account JSON (legado)
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON!
  const key = JSON.parse(raw) as { client_email: string; private_key: string }
  const now = Math.floor(Date.now() / 1000)
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(
    JSON.stringify({
      iss: key.client_email,
      scope: 'https://www.googleapis.com/auth/drive',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    }),
  ).toString('base64url')
  const sign = crypto.createSign('RSA-SHA256')
  sign.update(`${header}.${payload}`)
  const signature = sign.sign(key.private_key, 'base64url')
  const jwt = `${header}.${payload}.${signature}`
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  })
  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

export async function uploadPdfToDrive(pdfBuffer: Buffer, fileName: string): Promise<string> {
  const token = await getGoogleAccessToken()

  const metadata: Record<string, unknown> = { name: fileName, mimeType: 'application/pdf' }
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID
  if (folderId) metadata.parents = [folderId]

  const boundary = '-------314159265358979323846'
  const delimiter = `\r\n--${boundary}\r\n`
  const closeDelimiter = `\r\n--${boundary}--`

  const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`
  const filePart = `${delimiter}Content-Type: application/pdf\r\nContent-Transfer-Encoding: base64\r\n\r\n${pdfBuffer.toString('base64')}${closeDelimiter}`
  const body = metadataPart + filePart

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

  const file = (await uploadRes.json()) as { id: string }
  const fileId = file.id

  // Torna o arquivo público (qualquer pessoa com o link pode ver)
  await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: 'reader', type: 'anyone' }),
  })

  return `https://drive.google.com/file/d/${fileId}/view`
}
