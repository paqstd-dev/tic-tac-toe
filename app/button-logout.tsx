'use client'

import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

export const ButtonLogout = () => {
  return (
    <button
      onClick={() => signOut()}
      className="flex w-full cursor-pointer place-content-between self-center rounded-lg border border-red-500 p-4 text-center font-bold text-black transition duration-300 hover:bg-red-500 hover:text-white"
    >
      <p>Logout</p>
      <LogOut />
    </button>
  )
}
