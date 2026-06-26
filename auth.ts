import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'

// IDs do Google OAuth são puramente numéricos, cuid começa com 'c' e tem letras
const isGoogleId = (id: unknown) => typeof id === 'string' && /^\d+$/.test(id)

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // ── Primeiro login: cria/atualiza usuário no banco ──────────────
      if (account && user?.email) {
        try {
          const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            update: { name: user.name, image: user.image },
            create: { email: user.email, name: user.name, image: user.image, credits: 1000 },
          })
          token.id = dbUser.id
          token.credits = dbUser.credits
          prisma.delivery.updateMany({
            where: { email: user.email, userId: null },
            data: { userId: dbUser.id },
          }).catch(() => {})
        } catch (e) {
          console.error('[auth] upsert error:', e)
        }
        return token
      }

      // ── Sessões legadas com Google OAuth ID (numérico) ───────────────
      // Roda UMA vez por sessão — após atualizar o cookie, nunca mais entra aqui
      if (isGoogleId(token.id) && token.email) {
        try {
          const dbUser = await prisma.user.upsert({
            where: { email: token.email as string },
            update: {},
            create: { email: token.email as string, name: token.name as string, image: token.picture as string, credits: 1000 },
            select: { id: true, credits: true },
          })
          token.id = dbUser.id
          token.credits = dbUser.credits
          prisma.delivery.updateMany({
            where: { email: token.email as string, userId: null },
            data: { userId: dbUser.id },
          }).catch(() => {})
        } catch (e) {
          console.error('[auth] legacy sync error:', e)
        }
      }

      return token
    },
    session({ session, token }) {
      if (session.user) {
        if (token.id) session.user.id = token.id as string
        if (token.credits) (session.user as { credits?: number }).credits = token.credits as number
      }
      return session
    },
  },
})
