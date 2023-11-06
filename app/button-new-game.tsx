'use client'

import { useState } from 'react'
import cn from 'classnames'
import { Gamepad2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useSocket } from '@/lib/sockets/hook'

export const ButtonNewGame = () => {
  const { status, data: session } = useSession()

  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const socket = useSocket()

  if (status === 'unauthenticated') return null

  const onClickNewGame = () => {
    setLoading(true)

    const timeout = setTimeout(() => {
      setLoading(false)
      socket.emit('cancel-new-game')

      toast.error('Failed to create a new game! Try again.')
    }, 10 * 1000)

    socket.emit('new-game', session?.user)
    socket.on('game-id', (gameId) => {
      clearTimeout(timeout)

      router.push(`/game/${gameId}`)
    })
  }

  return (
    <button
      className={cn(
        'flex w-full place-content-between self-center rounded-lg bg-green-500 p-4 text-center font-bold text-white transition duration-300 hover:bg-green-600',
        {
          'animate-pulse': loading,
        }
      )}
      disabled={loading}
      onClick={onClickNewGame}
    >
      {loading ? (
        <p>Loading ...</p>
      ) : (
        <>
          <p>New Game</p>
          <Gamepad2 />
        </>
      )}
    </button>
  )
}
