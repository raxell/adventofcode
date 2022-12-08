import { readFileSync } from 'fs'
import { join } from 'path'
import { assert } from '../utils/assert'

const input = readFileSync(join(__dirname, 'input.txt'), { encoding: 'utf-8' })

const intersect = (...sets: Set<any>[]): Set<any> => {
  if (sets.length === 0) {
    return new Set()
  }

  if (sets.length === 1) {
    return sets[0]
  }

  return intersect(new Set([...sets[0]].filter((value) => sets[1].has(value))), ...sets.slice(2))
}

const isUpperCase = (char: string) => char === char.toUpperCase()

const getItemPriority = (item: string) => {
  return isUpperCase(item)
    ? 26 + item.charCodeAt(0) - 'A'.charCodeAt(0) + 1
    : item.charCodeAt(0) - 'a'.charCodeAt(0) + 1
}

const answer1 = input
  .split('\n')
  .filter(Boolean)
  .reduce((acc, rucksack) => {
    const compartment1 = new Set(rucksack.slice(0, rucksack.length / 2).split(''))
    const compartment2 = new Set(rucksack.slice(rucksack.length / 2).split(''))
    const intersection = intersect(compartment1, compartment2)
    assert(intersection.size === 1, 'No item of same type in compartments')
    const errorItem = [...intersection.values()][0]

    return acc + getItemPriority(errorItem)
  }, 0)

const answer2 = input
  .split('\n')
  .filter(Boolean)
  .reduce((acc, _rucksack, _index, rucksacks) => {
    if (acc.length >= rucksacks.length / 3) {
      return acc
    }

    const takeFrom = acc.length * 3
    return [...acc, rucksacks.slice(takeFrom, takeFrom + 3)]
  }, [] as string[][])
  .reduce((acc, group) => {
    const rucksack1 = new Set(group[0])
    const rucksack2 = new Set(group[1])
    const rucksack3 = new Set(group[2])
    const intersection = intersect(rucksack1, rucksack2, rucksack3)
    const badge = [...intersection.values()][0]
    assert(intersection.size === 1, 'No badge found')

    return acc + getItemPriority(badge)
  }, 0)

console.log(answer1)
console.log(answer2)
