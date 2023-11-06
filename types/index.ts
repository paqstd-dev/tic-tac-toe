type Coords = {
  x: number
  y: number
}

export type Square = {
  coords?: Coords
  item?: 'tic' | 'tac'
}

export type Field = Square[]
