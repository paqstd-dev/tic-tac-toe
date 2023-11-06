export const WEBSOCKET_PORT = Number(process.env.WEBSOCKET_PORT ?? '4000')
export const NEXT_APP_WEBSOCKET_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `${process.env.NEXT_PUBLIC_VERCEL_URL}:${WEBSOCKET_PORT}`
  : `http://localhost:${WEBSOCKET_PORT}`
