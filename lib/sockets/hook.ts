'use client'

import { createContext, useContext } from 'react'
import type { Socket } from 'socket.io'

export const SocketContext = createContext<Socket | undefined>(undefined)

export const useSocket = () => {
  const cx = useContext(SocketContext)

  if (cx === undefined) {
    throw new Error('useSocket must be within SocketProvider')
  }

  return cx
}
