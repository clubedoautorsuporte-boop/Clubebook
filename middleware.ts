import { type NextRequest, NextResponse } from 'next/server'

const BOT_AGENTS = [
  'curl',
  'python-requests',
  'python-urllib',
  'wget',
  'zgrab',
  'masscan',
  'sqlmap',
  'nikto',
  'scrapy',
  'go-http-client',
  'libwww-perl',
  'nmap',
]

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') ?? ''
  const uaLower = ua.toLowerCase()

  if (BOT_AGENTS.some((bot) => uaLower.includes(bot))) {
    return new NextResponse(null, { status: 403 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (
    siteUrl &&
    process.env.NODE_ENV === 'production' &&
    request.method === 'POST'
  ) {
    const origin = request.headers.get('origin')
    if (origin && origin !== siteUrl) {
      return new NextResponse(null, { status: 403 })
    }
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'

  const response = NextResponse.next()
  response.headers.set('x-client-ip', ip)
  return response
}

export const config = {
  matcher: ['/api/:path*'],
}
