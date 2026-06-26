import { matchProbabilityBands } from "../data/matchProbabilities";
import type { Fixture, MatchOutcome, MatchResult, ProbabilityBand, Team } from "../types";

type NormalizedProbabilities = {
  teamAWin: number;
  teamBWin: number;
  draw: number;
};

type SimulateMatchOptions = {
  boostLowerRatedTeam?: boolean;
};

const getProbabilityBand = (difference: number): ProbabilityBand => {
  const absoluteDifference = Math.abs(difference);
  return (
    matchProbabilityBands.find((band) => {
      const underMax = band.maxDifference === null || absoluteDifference < band.maxDifference;
      return absoluteDifference >= band.minDifference && underMax;
    }) ?? matchProbabilityBands[matchProbabilityBands.length - 1]
  );
};

const normalizeProbabilities = (
  probabilities: NormalizedProbabilities,
): NormalizedProbabilities => {
  const total = probabilities.teamAWin + probabilities.teamBWin + probabilities.draw;

  if (total === 100) {
    return probabilities;
  }

  if (total <= 0) {
    console.warn("Match probability total was invalid. Falling back to equal odds.");
    return { teamAWin: 33.34, teamBWin: 33.33, draw: 33.33 };
  }

  console.warn(`Match probabilities summed to ${total}. Normalizing to 100.`);
  return {
    teamAWin: (probabilities.teamAWin / total) * 100,
    teamBWin: (probabilities.teamBWin / total) * 100,
    draw: (probabilities.draw / total) * 100,
  };
};

const getMatchProbabilities = (teamA: Team, teamB: Team): NormalizedProbabilities => {
  const ratingDifference = teamA.averageOverallRating - teamB.averageOverallRating;
  const band = getProbabilityBand(ratingDifference);

  if (ratingDifference >= 0) {
    return normalizeProbabilities({
      teamAWin: band.higherRatedWin,
      teamBWin: band.lowerRatedWin,
      draw: band.draw,
    });
  }

  return normalizeProbabilities({
    teamAWin: band.lowerRatedWin,
    teamBWin: band.higherRatedWin,
    draw: band.draw,
  });
};

const applyLowerRatedBoost = (
  probabilities: NormalizedProbabilities,
  teamA: Team,
  teamB: Team,
): NormalizedProbabilities => {
  if (teamA.averageOverallRating === teamB.averageOverallRating) {
    return probabilities;
  }

  const teamAIsLowerRated = teamA.averageOverallRating < teamB.averageOverallRating;
  const boosted = { ...probabilities };

  if (teamAIsLowerRated) {
    boosted.teamAWin += 5;
    boosted.teamBWin = Math.max(0, boosted.teamBWin - 5);
  } else {
    boosted.teamBWin += 5;
    boosted.teamAWin = Math.max(0, boosted.teamAWin - 5);
  }

  return normalizeProbabilities(boosted);
};

export const weightedRandomResult = (
  probabilities: NormalizedProbabilities,
): MatchOutcome => {
  const randomValue = Math.random() * 100;

  if (randomValue < probabilities.teamAWin) {
    return "TEAM_A_WIN";
  }

  if (randomValue < probabilities.teamAWin + probabilities.draw) {
    return "DRAW";
  }

  return "TEAM_B_WIN";
};

const createPlaceholderScore = (outcome: MatchOutcome): { teamAScore: number; teamBScore: number } => {
  if (outcome === "DRAW") {
    const score = Math.floor(Math.random() * 3);
    return { teamAScore: score, teamBScore: score };
  }

  const winnerScore = 1 + Math.floor(Math.random() * 4);
  const loserScore = Math.floor(Math.random() * winnerScore);

  return outcome === "TEAM_A_WIN"
    ? { teamAScore: winnerScore, teamBScore: loserScore }
    : { teamAScore: loserScore, teamBScore: winnerScore };
};

export const simulateMatch = (
  fixture: Fixture,
  teams: Team[],
  options: SimulateMatchOptions = {},
): MatchResult => {
  const homeTeam = teams.find((team) => team.id === fixture.homeTeamId);
  const awayTeam = teams.find((team) => team.id === fixture.awayTeamId);

  if (!homeTeam || !awayTeam) {
    throw new Error(`Unable to simulate fixture ${fixture.id}; team was not found.`);
  }

  const baseProbabilities = getMatchProbabilities(homeTeam, awayTeam);
  const probabilities = options.boostLowerRatedTeam
    ? applyLowerRatedBoost(baseProbabilities, homeTeam, awayTeam)
    : baseProbabilities;
  const outcome = weightedRandomResult(probabilities);
  const { teamAScore, teamBScore } = createPlaceholderScore(outcome);

  if (outcome === "DRAW") {
    return {
      fixtureId: fixture.id,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      winnerTeamId: null,
      loserTeamId: null,
      isDraw: true,
      teamAResult: "D",
      teamBResult: "D",
      homeResult: "D",
      awayResult: "D",
      homeScore: teamAScore,
      awayScore: teamBScore,
    };
  }

  const homeWins = outcome === "TEAM_A_WIN";

  return {
    fixtureId: fixture.id,
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    winnerTeamId: homeWins ? homeTeam.id : awayTeam.id,
    loserTeamId: homeWins ? awayTeam.id : homeTeam.id,
    isDraw: false,
    teamAResult: homeWins ? "W" : "L",
    teamBResult: homeWins ? "L" : "W",
    homeResult: homeWins ? "W" : "L",
    awayResult: homeWins ? "L" : "W",
    homeScore: teamAScore,
    awayScore: teamBScore,
  };
};
