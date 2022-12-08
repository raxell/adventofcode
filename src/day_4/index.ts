import { readFileSync } from "fs";
import { join } from "path";
import { assert } from "../utils/assert";

const input = readFileSync(join(__dirname, "input.txt"), { encoding: "utf-8" });

type Range = [number, number];
type Pair = [Range, Range];

// Check if one of the 2 given ranges is contained in the other
const rangeContains = ([a1, b1]: Range, [a2, b2]: Range) => {
  return (a2 >= a1 && b2 <= b1) || (a1 >= a2 && b1 <= b2);
};

// Check if the 2 given ranges overlaps
const rangesOverlap = ([a1, b1]: Range, [a2, b2]: Range) => {
  return (a2 <= b1 && b1 <= b2) || (a1 <= b2 && b2 <= b1);
};

const pairs = input
  .split("\n")
  .filter(Boolean)
  .reduce((acc, pair) => {
    const range1 = pair.split(",")[0].split("-").map(Number) as Range;
    const range2 = pair.split(",")[1].split("-").map(Number) as Range;
    assert(range1.length === 2, "Invalide range");
    assert(range2.length === 2, "Invalide range");

    return [...acc, [range1, range2] as Pair];
  }, [] as readonly Pair[]);

const answer1 = pairs.reduce((acc, [range1, range2]) => {
  if (rangeContains(range1, range2)) {
    return acc + 1;
  }

  return acc;
}, 0);

const answer2 = pairs.reduce((acc, [range1, range2]) => {
  if (rangesOverlap(range1, range2)) {
    return acc + 1;
  }

  return acc;
}, 0);

console.log(answer1);
console.log(answer2);
