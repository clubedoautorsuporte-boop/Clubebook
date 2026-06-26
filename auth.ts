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
    async jwt({ token, user, account }) {
      // Primeiro login: cria/atualiza usuário no banco
      if (account && user?.email) {
        try {
          const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            update: { name: user.name, image: user.image },
            create: { email: user.email, name: user.name, image: user.image, credits: 1000 },
          })
          token.id = dbUser.id
          token.dbSynced = true
          // Vincula deliveries orphãos pelo email
          await prisma.delivery.updateMany({
            where: { email: user.email, userId: null },
            data: { userId: dbUser.id },
          }).catch(() => {})
        } catch (e) {
          console.error('[auth] upsert user error:', e)
        }
      }
      // Sessões existentes com ID antigo (Google OAuth ID): sincroniza com o banco pelo email
      if (!token.dbSynced && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({ where: { email: token.email as string } })
          if (dbUser) {
            token.id = dbUser.id
            token.dbSynced = true
            // Vincula deliveries sem userId pelo email
            await prisma.delivery.updateMany({
              where: { email: token.email as string, userId: null },
              data: { userId: dbUser.id },
            }).catch(() => {})
          } else {
            // Usuário não existe no banco ainda, cria agora
            const newUser = await prisma.user.create({
              data: { email: token.email as string, name: token.name as string, image: token.picture as string, credits: 1000 },
            })
            token.id = newUser.id
            token.dbSynced = true
          }
        } catch (e) {
          console.error('[auth] sync user error:', e)
        }
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id as string
      return session
    },
  },
})
