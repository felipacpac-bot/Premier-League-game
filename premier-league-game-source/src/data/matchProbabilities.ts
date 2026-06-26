import type { ProbabilityBand } from "../types";

export const matchProbabilityBands: ProbabilityBand[] = [
  {
    minDifference: 0,
    maxDifference: 1,
    higherRatedWin: 34,
    lowerRatedWin: 33,
    draw: 33,
  },
  {
    minDifference: 1,
    maxDifference: 3,
    higherRatedWin: 40,
    lowerRatedWin: 30,
    draw: 30,
  },
  {
    minDifference: 3,
    maxDifference: 6,
    higherRatedWin: 70,
    lowerRatedWin: 20,
    draw: 10,
  },
  {
    minDifference: 6,
    maxDifference: null,
    higherRatedWin: 75,
    lowerRatedWin: 10,
    draw: 15,
  },
];
