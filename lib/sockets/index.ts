import { Server } from 'socket.io'
import '@/app/sockets/events'
import { WEBSOCKET_PORT } from '@/config'
import { events } from './register'

const io = new Server(WEBSOCKET_PORT, {
  cors: {
    origin: '*',
  },
})

const osEvents = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM']
osEvents.forEach((eventType: string) => {
  // fallback for incorrect stop main process
  process.on(eventType, () => {
    io.close()
  })
})

console.log(`[socket.io] Started WebSockets server on ${WEBSOCKET_PORT} port.`)

Object.keys(events).map((eventName) => {
  console.log(`[socket.io] Register Event by name ${eventName} with callback.`)
})

io.on('connection', (socket) => {
  Object.entries(events).map(([eventName, callback]) => {
    socket.on(eventName, (...params) => callback(socket, ...params))
  })
})
