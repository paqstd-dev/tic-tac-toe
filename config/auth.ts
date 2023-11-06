import { NextAuthConfig } from 'next-auth'

export const authConfig = {
  providers: [],
  pages: {
    signIn: '/auth',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      if (auth?.user) {
        if (nextUrl.pathname === '/auth') {
          return Response.redirect(new URL('/', nextUrl))
        }

        return true
      }

      return false
    },
    async session({ session, token }) {
      // @ts-expect-error custom session
      session.user = token.user
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
  },
} satisfies NextAuthConfig
