export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    import('@/lib/sockets')
  }
}