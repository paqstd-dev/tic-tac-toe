'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Step } from '@prisma/client'
import cn from 'classnames'
import { Circle, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { GameField } from '@/components/field'
import { useSocket } from '@/lib/sockets/hook'
import type { Field, Square } from '@/types'

interface GameProps {
  initialSteps: Step[]
  players: {
    id: number
    username: string
    item: 'tic' | 'tac'
  }[]
}

enum GameStatus {
  LOADING = 'Loading information...',
  WAITING_OPPONENT = "Waiting opponent's move",
  WAITING_YOU = 'Your move',
  WIN = 'You win!',
  LOSE = 'You lose!',
  DRAFT = 'Game draft!',
  CANCELED = 'Game canceled!',
  DISCONNECTED = 'Opponent disconnected!',
}

export const Game = ({ initialSteps, players }: GameProps) => {
  const { data: session } = useSession()
  const me = useMemo(() => players.find((p) => p.id === session?.user?.id), [session, players])

  // global state
  const { gameId } = useParams()
  const [field, setField] = useState<Field>([])

  // local state
  const [status, setStatus] = useState<GameStatus>(GameStatus.LOADING)
  const [disabled, setDisabled] = useState(true)

  const router = useRouter()

  const getStatus = useCallback(() => {
    if (field.length === 0) {
      return me?.item === 'tic' ? GameStatus.WAITING_YOU : GameStatus.WAITING_OPPONENT
    }
    if (field.at(-1)?.item === me?.item) return GameStatus.WAITING_OPPONENT

    return GameStatus.WAITING_YOU
  }, [me, field])

  // render initial field
  useEffect(() => {
    setField(
      initialSteps.map(
        (step: Step): Square => ({
          coords: {
            x: step.x,
            y: step.y,
          },
          item: step.item as 'tic' | 'tac',
        })
      )
    )
  }, [initialSteps])

  // online status and first render field
  const [online, setOnline] = useState(true)
  useEffect(() => {
    if (!online) {
      setStatus(GameStatus.DISCONNECTED)
    } else {
      const currentStatus = getStatus()

      setDisabled(currentStatus === GameStatus.WAITING_OPPONENT)
      setStatus(currentStatus)
    }
  }, [field, getStatus, online])

  // websockets
  const socket = useSocket()

  useEffect(() => {
    socket.emit('join-game', gameId)

    // hint: player 2
    const onNewStep = (step: Step) => {
      const square: Square = {
        coords: { x: step.x, y: step.y },
        item: step.item as 'tic' | 'tac',
      }
      setField((field) => [...field, square])
    }
    socket.on('get-step', onNewStep)

    // hint: player 2 leave from game
    const onPlayerDisconnect = () => {
      setOnline(false)
    }
    socket.on('player-offline', onPlayerDisconnect)

    const onPlayerConnect = () => {
      setOnline(true)
    }
    socket.on('player-online', onPlayerConnect)

    const onCanlededGame = () => {
      setStatus(GameStatus.CANCELED)
    }
    socket.on('canceled-game', onCanlededGame)

    const onEndGame = (status: 'tic' | 'tac' | 'draft') => {
      setStatus(
        status === 'draft' ? GameStatus.DRAFT : status === me?.item ? GameStatus.WIN : GameStatus.LOSE
      )
      setDisabled(true)
    }
    socket.on('end-game', onEndGame)

    return () => {
      socket.off('get-step', onNewStep)
      socket.off('player-offline', onPlayerDisconnect)
      socket.off('player-online', onPlayerConnect)
      socket.off('canceled-game', onCanlededGame)
      socket.off('end-game', onEndGame)
    }
  }, [gameId, me, socket])

  // hint: player 1 (you)
  const onClickSquare = (x: number, y: number) => {
    socket.emit('set-step', session?.user, gameId, x, y)
  }

  // hint: player1 (you)
  const exit = [GameStatus.WIN, GameStatus.LOSE, GameStatus.DRAFT].includes(status)
  const onCancelGame = () => {
    if (!exit) {
      socket.emit('cancel-game', gameId)
    }

    router.push('/')
  }

  return (
    <>
      <GameField field={field} disabled={disabled} onChange={onClickSquare} />

      <div className="mb-5 flex w-full max-w-xs flex-col items-center gap-3">
        <h1 className="text-2xl text-black">{status}</h1>

        <div className="flex w-full items-center gap-3">
          {players
            .map((player) => (
              <div
                key={player.id}
                className={cn('w-full rounded-md border p-2 font-bold', {
                  ['border-blue-100 bg-blue-50']: player.item === 'tic',
                  ['border-red-100 bg-red-50']: player.item === 'tac',
                })}
              >
                <div className="flex items-center justify-center gap-1">
                  {player.item === 'tic' && (
                    <X className="h-8 w-8 items-center rounded-md border border-blue-300 p-1 text-center text-blue-600" />
                  )}
                  {player.item === 'tac' && (
                    <Circle className="h-8 w-8 items-center rounded-md border border-red-300 p-1 text-center text-red-600" />
                  )}
                </div>

                <p className="text-center leading-5 text-gray-700">
                  {player.id !== session?.user.id ? player.username : 'You'}
                </p>
              </div>
            ))
            .reduce((prev, current) => (
              <>
                {prev}
                <span className="text-gray-600">vs</span>
                {current}
              </>
            ))}
        </div>
      </div>

      <button
        className="mb-10 w-full max-w-xs rounded-xl border-2 border-red-500 bg-transparent px-4 py-2 font-semibold text-black hover:border-transparent hover:bg-red-500 hover:text-white"
        onClick={onCancelGame}
      >
        {exit ? 'Exit' : 'Cancel'}
      </button>
    </>
  )
}
