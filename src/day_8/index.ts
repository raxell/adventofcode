import { readFileSync } from 'fs'
import { join } from 'path'

const input = readFileSync(join(__dirname, 'input.txt'), { encoding: 'utf-8' })

const grid: number[][] = input
  .split('\n')
  .filter(Boolean)
  .map((row) => row.split('').map(Number))

type AuxGridCell = {
  top: number
  right: number
  bottom: number
  left: number
}

// Keep the highest tree found so far for each direction.
const auxGrid: AuxGridCell[][] = Array(grid.length)
  .fill(null)
  .map(() =>
    Array(grid[0].length)
      .fill(null)
      .map(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
  )

// Fill top and left directions
for (let i = 0; i < grid.length; i += 1) {
  for (let j = 0; j < grid[0].length; j += 1) {
    const prevTopHighest = auxGrid[i - 1]?.[j]?.top ?? -1
    const prevTop = grid[i - 1]?.[j] ?? -1
    auxGrid[i][j].top = Math.max(prevTopHighest, prevTop)

    const prevLeftHighest = auxGrid[i][j - 1]?.left ?? -1
    const prevLeft = grid[i][j - 1] ?? -1
    auxGrid[i][j].left = Math.max(prevLeftHighest, prevLeft)
  }
}

// Fill bottom and right directions
for (let i = grid.length - 1; i >= 0; i -= 1) {
  for (let j = grid[0].length - 1; j >= 0; j -= 1) {
    const prevBottomHighest = auxGrid[i + 1]?.[j]?.bottom ?? -1
    const prevBottom = grid[i + 1]?.[j] ?? -1
    auxGrid[i][j].bottom = Math.max(prevBottomHighest, prevBottom)

    const prevRightHighest = auxGrid[i][j + 1]?.right ?? -1
    const prevRight = grid[i][j + 1] ?? -1
    auxGrid[i][j].right = Math.max(prevRightHighest, prevRight)
  }
}

const treeScenicScore = (rowIndex: number, colIndex: number) => {
  const value = grid[rowIndex][colIndex]
  let top = 0
  let right = 0
  let bottom = 0
  let left = 0

  for (let i = rowIndex - 1; i >= 0; i -= 1) {
    if (grid[i][colIndex] < value || grid[i][colIndex] >= value) {
      top += 1

      if (grid[i][colIndex] >= value) {
        break
      }
    }
  }

  for (let i = rowIndex + 1; i < grid.length; i += 1) {
    if (grid[i][colIndex] < value || grid[i][colIndex] >= value) {
      bottom += 1

      if (grid[i][colIndex] >= value) {
        break
      }
    }
  }

  for (let j = colIndex - 1; j >= 0; j -= 1) {
    if (grid[rowIndex][j] < value || grid[rowIndex][j] >= value) {
      left += 1

      if (grid[rowIndex][j] >= value) {
        break
      }
    }
  }

  for (let j = colIndex + 1; j < grid[0].length; j += 1) {
    if (grid[rowIndex][j] < value || grid[rowIndex][j] >= value) {
      right += 1

      if (grid[rowIndex][j] >= value) {
        break
      }
    }
  }

  return top * right * bottom * left
}

let answer1 = 0
let answer2 = 0

for (let i = 0; i < grid.length; i += 1) {
  for (let j = 0; j < grid[0].length; j += 1) {
    const isVisibleFromTop = grid[i][j] > auxGrid[i][j].top
    const isVisibleFromRight = grid[i][j] > auxGrid[i][j].right
    const isVisibleFromBottom = grid[i][j] > auxGrid[i][j].bottom
    const isVisibleFromLeft = grid[i][j] > auxGrid[i][j].left

    if (isVisibleFromTop || isVisibleFromRight || isVisibleFromBottom || isVisibleFromLeft) {
      answer1 += 1
      answer2 = Math.max(answer2, treeScenicScore(i, j))
    }
  }
}

console.log(answer1)
console.log(answer2)
