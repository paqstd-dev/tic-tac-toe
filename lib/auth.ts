import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from '@/config/auth'
import { getUser } from '@/lib/user'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      // @ts-expect-error Custom session & credentials
      async authorize(credentials: { username: string; password: string }) {
        const user = await getUser(credentials)

        if (!user) {
          return null
        }

        return user
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
})
