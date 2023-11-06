enum Status {
  winA = 'tic',
  winB = 'tac',
  draft = 'draft',
  pending = 'pending',
}

export const tictactoeCheckField = function (moves: number[][]): Status {
  // record and move on approach
  const rows = [0, 0, 0],
    cols = [0, 0, 0]
  let dia = 0,
    antiDia = 0,
    count = 0

  for (const [row, column] of moves) {
    // Let's assume 1 represents A, -1 represents B
    const value = count % 2 === 0 ? 1 : -1
    rows[row] += value
    cols[column] += value

    // row + column === 2, it is on the anti diagonal
    if (row + column === 2) {
      antiDia += value
    }

    // if row === column, it is on the main diagonal
    if (row === column) {
      dia += value
    }

    // check whether we have a result already
    if ([rows[row], cols[column], antiDia, dia].includes(3)) {
      return Status.winA
    } else if ([rows[row], cols[column], antiDia, dia].includes(-3)) {
      return Status.winB
    }
    count++
  }

  // Some moves are still left to be made
  if (count < 9) {
    return Status.pending
  }

  return Status.draft
}
