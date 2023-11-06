import NextAuth from 'next-auth'
import { authConfig } from '@/config/auth'

export default NextAuth(authConfig).auth

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/auth', '/game/:path*'],
}
