import { LogIn } from 'lucide-react'
import Link from 'next/link'

export const ButtonAuth = () => {
  return (
    <Link
      href="/auth"
      className="flex w-full max-w-xs cursor-pointer place-content-between self-center rounded-lg bg-blue-500 p-4 text-center font-bold text-white transition duration-300 hover:bg-blue-600"
    >
      <p>Sign in to play</p>
      <LogIn />
    </Link>
  )
}
