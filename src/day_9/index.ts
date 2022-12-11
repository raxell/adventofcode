import { readFileSync } from 'fs'
import { join } from 'path'

const input = readFileSync(join(__dirname, 'input.txt'), { encoding: 'utf-8' })

type Vector = { x: number; y: number }
type SerializedVector = `${number},${number}`

enum Direction {
  Up = 'U',
  Down = 'D',
  Left = 'L',
  Right = 'R',
}

const motions: { direction: Direction; steps: number }[] = input
  .split('\n')
  .filter(Boolean)
  .map((motion) => {
    const parts = motion.split(' ')

    return { direction: parts[0] as Direction, steps: Number(parts[1]) }
  })

const serializeVector = (p: Vector) => {
  return Object.values(p).join(',') as SerializedVector
}

const areAdjacent = (p1: Vector, p2: Vector) => {
  return Math.abs(p1.x - p2.x) <= 1 && Math.abs(p1.y - p2.y) <= 1
}

const moveTails = (head: Vector, tails: Vector[], visitedPositions: Set<SerializedVector>) => {
  const tail = tails[0]

  if (tail == null || areAdjacent(head, tail)) {
    return
  }

  const xOffset = head.x - tail.x
  const yOffset = head.y - tail.y
  const distance: Vector = { x: xOffset, y: yOffset }

  // Compute the distance "head - tail" to figure out where to move tail:
  // (T is in the origin (0, 0))
  //
  // H H H H H
  // H . . . H
  // H . T . H
  // H . . . H
  // H H H H H
  switch (serializeVector(distance)) {
    case '2,0':
      tail.x += 1
      break
    case '2,1':
    case '1,2':
    case '2,2':
      tail.x += 1
      tail.y += 1
      break
    case '0,2':
      tail.y += 1
      break
    case '-1,2':
    case '-2,1':
    case '-2,2':
      tail.x -= 1
      tail.y += 1
      break
    case '-2,0':
      tail.x -= 1
      break
    case '-2,-1':
    case '-1,-2':
    case '-2,-2':
      tail.x -= 1
      tail.y -= 1
      break
    case '0,-2':
      tail.y -= 1
      break
    case '1,-2':
    case '2,-1':
    case '2,-2':
      tail.x += 1
      tail.y -= 1
      break
    default:
      throw new Error('Invalid positions for head or tail')
  }

  visitedPositions.add(serializeVector(tails[tails.length - 1]))
  moveTails(tail, tails.slice(1), visitedPositions)
}

const computeVisitedPositions = (head: Vector, tails: Vector[]) => {
  const visitedPositions: Set<SerializedVector> = new Set()
  const start = tails[tails.length - 1]
  visitedPositions.add(serializeVector(start))

  for (const { direction, steps } of motions) {
    for (let i = 0; i < steps; i += 1) {
      switch (direction) {
        case Direction.Up:
          head.y += 1
          break
        case Direction.Down:
          head.y -= 1
          break
        case Direction.Left:
          head.x -= 1
          break
        case Direction.Right:
          head.x += 1
          break
      }

      moveTails(head, tails, visitedPositions)
    }
  }

  return visitedPositions.size
}

const answer1 = computeVisitedPositions(
  { x: 0, y: 0 },
  Array(1)
    .fill(null)
    .map(() => ({ x: 0, y: 0 })),
)

const answer2 = computeVisitedPositions(
  { x: 0, y: 0 },
  Array(9)
    .fill(null)
    .map(() => ({ x: 0, y: 0 })),
)

console.log(answer1)
console.log(answer2)
