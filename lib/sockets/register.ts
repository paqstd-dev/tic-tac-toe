import type { Socket } from 'socket.io'

type EventName = string | symbol
type EventCallback = (socket: Socket, ...params: any[]) => void

type Event = {
  [eventName: EventName]: EventCallback
}

export const events: Event = {}

export const registerEvent = (eventName: EventName, callback: EventCallback) => {
  events[eventName] = callback
}
