import Link from 'next/link'
import { Toaster } from 'sonner'
import { auth } from '@/lib/auth'
import './globals.css'
import Providers from './providers'

interface RootLayoutProps {
  children: React.ReactNode
  modal: React.ReactNode
}

export default async function RootLayout({ children, modal }: RootLayoutProps) {
  const session = await auth()
  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          <section className="flex h-screen flex-col items-center p-6 duration-700">
            <Link href="/" className="inline-block max-w-xs self-center p-2 pb-5 text-2xl text-gray-700">
              Tic Tac Toe
            </Link>

            {children}
            {modal}

            <Toaster position="bottom-center" expand={true} richColors />
          </section>
        </Providers>
      </body>
    </html>
  )
}
