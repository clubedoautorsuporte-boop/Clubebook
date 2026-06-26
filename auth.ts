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
      // No primeiro login, salva/atualiza o usuário no banco e usa o ID do banco
      if (account && user?.email) {
        try {
          const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            update: { name: user.name, image: user.image },
            create: {
              email: user.email,
              name: user.name,
              image: user.image,
              credits: 1000,
            },
          })
          token.id = dbUser.id
          // Vincula deliveries com mesmo email ao usuário
          await prisma.delivery.updateMany({
            where: { email: user.email, userId: null },
            data: { userId: dbUser.id },
          })
        } catch (e) {
          console.error('[auth] upsert user error:', e)
          token.id = user.id
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
