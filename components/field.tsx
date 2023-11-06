'use client'

import { FieldSquare } from '@/components/square'
import type { Field } from '@/types'

interface GameFieldProps {
  field: Field
  disabled: boolean
  onChange?: (x: number, y: number) => void
}

export const GameField = ({ field, disabled, onChange }: GameFieldProps) => {
  return (
    <div className="flex h-2/4 max-w-xs flex-col content-center justify-center">
      <div className="self-center">
        <div className="max-w-xs text-3xl">
          {[...new Array(3)].map((_, coordY) => (
            <div className="-mb-2 flex gap-2" key={coordY}>
              {[...new Array(3)].map((_, coordX) => {
                const sp = field.find(
                  (square) => square?.coords?.x === coordX && square?.coords?.y === coordY
                )

                return (
                  <FieldSquare
                    key={coordX}
                    disabled={disabled}
                    onClick={() => onChange && !sp && onChange(coordX, coordY)}
                    {...sp}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
