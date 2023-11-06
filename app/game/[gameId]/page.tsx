import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Game } from './game'

interface PageProps {
  params: {
    gameId: string
  }
}

export default async function Page({ params: { gameId } }: PageProps) {
  const session = await auth()
  if (!session?.user) return null

  // check game is exist and players available
  const game = await prisma.game.findFirst({
    where: {
      id: gameId,
      users: { some: { id: session.user.id } },
    },
    select: {
      id: true,
      opponentId: true,
      status: true,
      users: {
        select: { id: true, username: true },
      },
    },
  })

  if (!game || game.status === 'ended' || game.status === 'canceled') notFound()

  // create players with data
  const players = game.users
    .map((player) => ({
      ...player,
      item: (player.id === game.opponentId ? 'tac' : 'tic') as 'tic' | 'tac',
    }))
    .sort((p1, p2) => Number(p2.item === 'tic') - Number(p1.item === 'tic'))

  // loading initial field state from db
  const steps = await prisma.step.findMany({
    where: {
      gameId: game.id,
    },
  })

  return <Game initialSteps={steps} players={players} />
}
