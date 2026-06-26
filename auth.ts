import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

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
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id as string
      return session
    },
  },
  events: {
    async signIn({ user }) {
      if (!user?.id || !user?.email) return
      // Vincula deliveries gerados com o mesmo email antes do cadastro
      await prisma.delivery.updateMany({
        where: { email: user.email, userId: null },
        data: { userId: user.id },
      }).catch(() => {/* não bloquear o login se falhar */})
    },
  },
})
