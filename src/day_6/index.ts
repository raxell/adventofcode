import { readFileSync } from 'fs'
import { join } from 'path'

const input = readFileSync(join(__dirname, 'input.txt'), { encoding: 'utf-8' })

const getStartOfMarker = (stream: string, markerLength: number) => {
  for (let i = 0; i < stream.length - markerLength; i += 1) {
    const sequence = stream.slice(i, i + markerLength)

    if (new Set(sequence.split('')).size === markerLength) {
      return i + markerLength
    }
  }
}

const answer1 = getStartOfMarker(input, 4)
const answer2 = getStartOfMarker(input, 14)

console.log(answer1)
console.log(answer2)
