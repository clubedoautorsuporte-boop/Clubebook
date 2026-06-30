/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['pdfkit'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://sdk.mercadopago.com https://secure.mlstatic.com",
              "style-src 'self' 'unsafe-inline' https://secure.mlstatic.com",
              "font-src 'self' https://secure.mlstatic.com",
              "img-src 'self' data: blob: https://secure.mlstatic.com https://*.mlstatic.com https://api.qrserver.com",
              "connect-src 'self' https://va.vercel-scripts.com https://api.mercadopago.com https://www.mercadopago.com https://secure.mlstatic.com",
              "frame-src https://www.mercadopago.com https://secure.mlstatic.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
