import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// connection_limit=1 é essencial para ambientes serverless (Vercel)
// Cada função lambda usa apenas 1 conexão — evita esgotar o pool do Railway
function createPrismaClient() {
  const url = process.env.DATABASE_URL ?? ''
  const separator = url.includes('?') ? '&' : '?'
  return new PrismaClient({
    datasources: {
      db: { url: `${url}${separator}connection_limit=1&pool_timeout=0` },
    },
  })
}

export const prisma = globalThis.prisma ?? createPrismaClient()
globalThis.prisma = prisma
