import { readFileSync } from 'fs'
import { join } from 'path'

const input = readFileSync(join(__dirname, 'input.txt'), { encoding: 'utf-8' })

const sum = (numbers: number[]) => numbers.reduce((acc, n) => acc + n, 0)

const caloriesPerElf = input
  .split('\n\n')
  .map((elfCalories) => elfCalories.split('\n'))
  .map((elfCalories) => sum(elfCalories.map(Number)))

const descSortedCaloriesPerElf = [...caloriesPerElf].sort((a, b) => b - a)

const answer1 = descSortedCaloriesPerElf[0]
const answer2 = sum(descSortedCaloriesPerElf.slice(0, 3))

console.log(answer1)
console.log(answer2)
