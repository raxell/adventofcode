import { readFileSync } from 'fs'
import { join } from 'path'
import { assert } from '../utils/assert'

const input = readFileSync(join(__dirname, 'input.txt'), { encoding: 'utf-8' })

const TOTAL_SPACE = 70000000
const REQUIRED_SPACE = 30000000

type File = {
  name: string
  size: number
}

type Directory = {
  name: string
  size: number
  parent: Directory | null
  children: (File | Directory)[]
}

const computeDirectoriesSize = (root: Directory) => {
  root.size = root.children.reduce((acc, child) => {
    if ('children' in child) {
      return acc + computeDirectoriesSize(child)
    }

    return acc + child.size
  }, 0)

  return root.size
}

const buildDirectoriesTree = (terminalOutput: string[]) => {
  const root: Directory = { name: '/', size: 0, parent: null, children: [] }
  let currentNode: Directory | null = null

  const changeDirectory = (name: string) => {
    switch (name) {
      case '/':
        currentNode = root
        break
      case '..':
        assert(currentNode != null, 'Invalid "cd" command, cannot go up in the tree')
        currentNode = currentNode.parent
        break
      default: {
        const child = currentNode?.children.find((node) => node.name === name)
        assert(
          child != null && 'children' in child,
          `Invalid "cd" command, cannot cd into "${name}"`,
        )
        currentNode = child
      }
    }
  }

  const appendChild = (child: Directory | File) => {
    assert(currentNode != null, 'Cannot append to non-directory node')
    currentNode.children.push(child)
  }

  for (const line of terminalOutput) {
    const parts = line.split(' ')

    // command
    if (parts[0] === '$') {
      if (parts[1] === 'cd') {
        changeDirectory(parts[2])
        continue
      }
    }

    if (parts[0] === 'dir') {
      appendChild({
        name: parts[1],
        size: 0,
        parent: currentNode,
        children: [],
      })
      continue
    }

    if (/\d+/.test(parts[0])) {
      appendChild({
        name: parts[1],
        size: Number(parts[0]),
      })
    }
  }

  computeDirectoriesSize(root)

  return root
}

const traverseTree = (root: Directory | File, fn: (node: Directory | File) => void) => {
  fn(root)

  if ('children' in root) {
    root.children.forEach((child) => {
      traverseTree(child, fn)
    })
  }
}

const tree = buildDirectoriesTree(input.split('\n'))

let answer1 = 0

const sumIfSizeLte = (value: number) => (node: Directory | File) => {
  if ('children' in node && node.size <= value) {
    answer1 += node.size
  }
}

traverseTree(tree, sumIfSizeLte(100000))

const unusedSpace = TOTAL_SPACE - tree.size
const spaceToFree = REQUIRED_SPACE - unusedSpace

const candidateDeletions: Directory[] = []

const appendIfSizeGte = (value: number) => (node: Directory | File) => {
  if ('children' in node && node.size >= value) {
    candidateDeletions.push(node)
  }
}

traverseTree(tree, appendIfSizeGte(spaceToFree))

const answer2 = Math.min(...candidateDeletions.map(({ size }) => size))

console.log(answer1)
console.log(answer2)
