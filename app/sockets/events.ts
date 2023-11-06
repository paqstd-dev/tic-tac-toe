import { prisma } from '@/lib/prisma'
import { registerEvent } from '@/lib/sockets/register'
import { tictactoeCheckField } from './utils'

interface EventSession {
  id: number
  username: string
}

const queue = new Map()

registerEvent('new-game', async (socket1, player1: EventSession) => {
  // check already in queue
  if (queue.has(socket1)) return

  // check free players in queue
  const free = queue.entries().next().value
  if (!free) {
    queue.set(socket1, player1)
    return
  }

  const [socket2, player2] = free

  // check if current player? (open new tab)
  if (player1.username === player2.username) return

  // if already exist player in queue create gameId and send for current
  // socket (player1) and player2 with emmit event
  const game = await prisma.game.create({
    data: {
      users: { connect: [{ id: player1.id }, { id: player2.id }] },
      opponentId: player1.id,
      status: 'started',
    },
    include: {
      users: true,
    },
  })

  // send each player gameId
  const eventName = 'game-id'
  socket1.emit(eventName, game.id)
  socket2.emit(eventName, game.id)

  // remove players from queue
  queue.delete(socket2)
})

registerEvent('cancel-new-game', async (socket) => {
  queue.delete(socket)
})

registerEvent('set-step', async (socket, player, gameId: string, coordX: number, coordY: number) => {
  // check all steps (full field)
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { steps: true, users: true },
  })
  if (!game || game.status === 'ended') return

  const lastStep = await prisma.step.findFirst({
    where: { gameId },
    orderBy: { id: 'desc' },
  })

  const nextStep = await prisma.step.create({
    data: {
      gameId,
      userId: player.id,
      item: lastStep?.item === 'tic' ? 'tac' : 'tic',
      x: coordX,
      y: coordY,
    },
  })

  socket.to(gameId).emit('get-step', nextStep)
  socket.emit('get-step', nextStep)

  const status = tictactoeCheckField([...game.steps.map(({ x, y }) => [x, y]), [coordX, coordY]])
  if (status !== 'pending') {
    await prisma.game.update({
      where: { id: gameId },
      data: { status: 'ended' },
    })

    socket.to(gameId).emit('end-game', status)
    socket.emit('end-game', status)
  }
})

registerEvent('join-game', async (socket, gameId) => {
  socket.join(gameId)
  socket.to(gameId).emit('player-online')
})

registerEvent('cancel-game', async (socket, gameId) => {
  await prisma.game.update({
    where: { id: gameId },
    data: { status: 'canceled' },
  })

  socket.to(gameId).emit('canceled-game')
})

registerEvent('disconnecting', async (socket) => {
  queue.delete(socket)

  // @ts-expect-error Rooms is list of sockets
  for (const room of socket.rooms) {
    if (room !== socket.id) {
      socket.to(room).emit('player-offline')
    }
  }
})
