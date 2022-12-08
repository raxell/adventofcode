import { readFileSync } from 'fs'
import { join } from 'path'
import { assert } from '../utils/assert'

const input = readFileSync(join(__dirname, 'input.txt'), { encoding: 'utf-8' })

const [stacksDrawing, procedureDrawing] = input.split('\n\n')
const operations = procedureDrawing.split('\n').filter(Boolean)

// "[X] " is 4 characters length
const CRATE_CHAR_LENGTH = 4
const numberOfStacks = Math.ceil(stacksDrawing.split('\n')[0].length / CRATE_CHAR_LENGTH)

type Stack = string[]
type Stacks = { [key: string]: Stack }

const cloneStacks = (stacks: Stacks) => {
  return Object.entries(stacks).reduce((acc, [key, value]) => {
    return { ...acc, [key]: [...value] }
  }, {} as Stacks)
}

const topOfStacksToString = (stacks: Stacks) => {
  const topOfStacks: (string | undefined)[] = []

  for (let stackIndex = 1; stackIndex <= numberOfStacks; stackIndex += 1) {
    topOfStacks.push(stacks[String(stackIndex)].pop())
  }

  return topOfStacks.filter(Boolean).join('')
}

const initialStacks: Stacks = [...Array(numberOfStacks)].reduce(
  (acc, _, index) => ({ ...acc, [index + 1]: [] }),
  {} as Stacks,
)

for (const row of stacksDrawing.split('\n').reverse().slice(1)) {
  for (let index = 0; index < numberOfStacks; index += 1) {
    const stackIndex = index + 1
    // "[X] "
    //   ▲
    //   └── get this
    const crate = row.substr(index * CRATE_CHAR_LENGTH + 1, 1)

    if (crate !== ' ') {
      initialStacks[stackIndex].push(crate)
    }
  }
}

const operationRegex = /move (?<times>\d+) from (?<from>\d+) to (?<to>\d+)/
const parsedOperations: { from: string; to: string; times: number }[] = []

for (const operation of operations) {
  const match = operation.match(operationRegex)
  assert(match != null, 'Invalid operation format')
  assert(match.groups != null, 'Invalid operation format')
  const { from, to, times } = match.groups
  parsedOperations.push({ from, to, times: Number(times) })
}

const answer1Stacks = cloneStacks(initialStacks)
console.log(initialStacks)
console.log(answer1Stacks)

for (const { from, to, times } of parsedOperations) {
  for (let i = times; i > 0; i -= 1) {
    const crate = answer1Stacks[from].pop()
    assert(crate != null, 'Invalid operation')
    answer1Stacks[to].push(crate)
  }
}

const answer1 = topOfStacksToString(answer1Stacks)

const answer2Stacks = cloneStacks(initialStacks)

for (const { from, to, times } of parsedOperations) {
  const cratesToMove = []

  for (let i = times; i > 0; i -= 1) {
    const crate = answer2Stacks[from].pop()
    assert(crate != null, 'Invalid operation')
    cratesToMove.push(crate)
  }

  cratesToMove.reverse()
  answer2Stacks[to].push(...cratesToMove)
}

const answer2 = topOfStacksToString(answer2Stacks)

console.log(answer1)
console.log(answer2)
