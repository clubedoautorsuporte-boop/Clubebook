export async function GET(req: Request) {
  const instanceId = process.env.ZAPI_INSTANCE_ID
  const token = process.env.ZAPI_TOKEN
  const clientToken = process.env.ZAPI_CLIENT_TOKEN

  if (!instanceId || !token) {
    return Response.json({ error: 'ZAPI_INSTANCE_ID ou ZAPI_TOKEN não configurado' }, { status: 500 })
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (clientToken) headers['Client-Token'] = clientToken

  // Testa status da instância
  const statusRes = await fetch(
    `https://api.z-api.io/instances/${instanceId}/token/${token}/status`,
    { headers },
  )
  const statusBody = await statusRes.text()

  // Testa envio real de mensagem — pega phone da query string
  const url = new URL(req.url)
  const phone = url.searchParams.get('phone') // ex: ?phone=5528999439891
  let sendResult: unknown = 'Passe ?phone=5528999439891 na URL para testar o envio'

  if (phone) {
    const sendRes = await fetch(
      `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ phone, message: 'Teste de envio Aurora IA ✓' }),
      },
    )
    sendResult = { status: sendRes.status, body: await sendRes.text() }
  }

  return Response.json({
    statusOk: statusRes.ok,
    statusResponse: statusBody,
    sendResult,
  })
}
