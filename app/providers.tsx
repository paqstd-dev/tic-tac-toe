'use client'

import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { SocketsProvider } from '@/lib/sockets/provider'

interface ProvidersProps {
  children: React.ReactNode
  session: Session | null
}

export default function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <SocketsProvider>{children}</SocketsProvider>
    </SessionProvider>
  )
}
