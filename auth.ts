import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'

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
    // Roda APENAS no login inicial (account presente) — zero queries nas demais requisições
    async jwt({ token, user, account }) {
      if (account && user?.email) {
        try {
          const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            update: { name: user.name, image: user.image },
            create: { email: user.email, name: user.name, image: user.image, credits: 1000 },
          })
          token.id = dbUser.id
          token.credits = dbUser.credits // guarda créditos no token — elimina query no layout
          // Vincula deliveries orphãos em background (não bloqueia o login)
          prisma.delivery.updateMany({
            where: { email: user.email, userId: null },
            data: { userId: dbUser.id },
          }).catch(() => {})
        } catch (e) {
          console.error('[auth] upsert error:', e)
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
