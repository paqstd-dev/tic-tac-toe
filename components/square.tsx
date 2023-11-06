'use client'

import { X, Circle } from 'lucide-react'
import type { Square } from '@/types'

interface FieldSquareProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, Square {}

export const FieldSquare = ({ item, ...props }: FieldSquareProps) => {
  const color = item === 'tic' ? '#2563eb' : '#dc2626'

  return (
    <button
      className="mb-4 flex h-20 w-20 items-center justify-center rounded-xl border-2 border-black bg-transparent bg-white bg-opacity-0 duration-300 hover:bg-gray-200"
      {...props}
    >
      {item === 'tic' && (
        <X className="pointer-events-none h-3/4 w-3/4 select-none duration-300" color={color} />
      )}
      {item === 'tac' && (
        <Circle className="pointer-events-none h-3/4 w-3/4 select-none duration-300" color={color} />
      )}
    </button>
  )
}
