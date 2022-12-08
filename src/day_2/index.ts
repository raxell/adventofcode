import { readFileSync } from 'fs'
import { join } from 'path'

const input = readFileSync(join(__dirname, 'input.txt'), { encoding: 'utf-8' })

enum OpponentResponse {
  Rock = 'A',
  Paper = 'B',
  Scissors = 'C',
}

enum MyResponse {
  Rock = 'X',
  Paper = 'Y',
  Scissors = 'Z',
}

enum Outcome {
  Lost = 'X',
  Draw = 'Y',
  Won = 'Z',
}

type MyResponseScore = 1 | 2 | 3
type OutcomeScore = 0 | 3 | 6

const myResponseToScore: { [key in MyResponse]: MyResponseScore } = {
  [MyResponse.Rock]: 1,
  [MyResponse.Paper]: 2,
  [MyResponse.Scissors]: 3,
}

const outcomeToScore: { [key in Outcome]: OutcomeScore } = {
  [Outcome.Lost]: 0,
  [Outcome.Draw]: 3,
  [Outcome.Won]: 6,
}

type Round = `${OpponentResponse} ${MyResponse}`
type Strategy = `${OpponentResponse} ${Outcome}`

// @ts-expect-error
const roundToOutcome: {
  [key in Round]: Outcome
} = {
  [`${OpponentResponse.Rock} ${MyResponse.Rock}`]: Outcome.Draw,
  [`${OpponentResponse.Rock} ${MyResponse.Paper}`]: Outcome.Won,
  [`${OpponentResponse.Rock} ${MyResponse.Scissors}`]: Outcome.Lost,
  [`${OpponentResponse.Paper} ${MyResponse.Rock}`]: Outcome.Lost,
  [`${OpponentResponse.Paper} ${MyResponse.Paper}`]: Outcome.Draw,
  [`${OpponentResponse.Paper} ${MyResponse.Scissors}`]: Outcome.Won,
  [`${OpponentResponse.Scissors} ${MyResponse.Rock}`]: Outcome.Won,
  [`${OpponentResponse.Scissors} ${MyResponse.Paper}`]: Outcome.Lost,
  [`${OpponentResponse.Scissors} ${MyResponse.Scissors}`]: Outcome.Draw,
}

// @ts-expect-error
const strategyToMyResponse: { [key in Strategy]: MyResponse } = {
  [`${OpponentResponse.Rock} ${Outcome.Lost}`]: MyResponse.Scissors,
  [`${OpponentResponse.Rock} ${Outcome.Draw}`]: MyResponse.Rock,
  [`${OpponentResponse.Rock} ${Outcome.Won}`]: MyResponse.Paper,
  [`${OpponentResponse.Paper} ${Outcome.Lost}`]: MyResponse.Rock,
  [`${OpponentResponse.Paper} ${Outcome.Draw}`]: MyResponse.Paper,
  [`${OpponentResponse.Paper} ${Outcome.Won}`]: MyResponse.Scissors,
  [`${OpponentResponse.Scissors} ${Outcome.Lost}`]: MyResponse.Paper,
  [`${OpponentResponse.Scissors} ${Outcome.Draw}`]: MyResponse.Scissors,
  [`${OpponentResponse.Scissors} ${Outcome.Won}`]: MyResponse.Rock,
}

const sum = (numbers: number[]) => numbers.reduce((acc, n) => acc + n, 0)

const answer1 = sum(
  input
    .split('\n')
    .filter(Boolean)
    .map((round) => {
      const myResponse = round.split(' ')[1] as MyResponse

      return myResponseToScore[myResponse] + outcomeToScore[roundToOutcome[round as Round]]
    }),
)

const answer2 = sum(
  input
    .split('\n')
    .filter(Boolean)
    .map((strategy) => {
      const outcome = strategy.split(' ')[1] as Outcome

      return myResponseToScore[strategyToMyResponse[strategy as Strategy]] + outcomeToScore[outcome]
    }),
)

console.log(answer1)
console.log(answer2)
