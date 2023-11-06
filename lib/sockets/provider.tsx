'use client'

import { io } from 'socket.io-client'
import { NEXT_APP_WEBSOCKET_URL } from '@/config'
import { SocketContext } from './hook'

export const SocketsProvider = ({ children }: React.PropsWithChildren) => {
  const socket = io(NEXT_APP_WEBSOCKET_URL)

  // @ts-expect-error value as socket object
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}
