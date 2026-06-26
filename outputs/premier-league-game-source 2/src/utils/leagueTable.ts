import type { LeagueTableRow, MatchResult, Team } from "../types";

export const initializeLeagueTable = (teams: Team[]): LeagueTableRow[] =>
  teams.map((team) => ({
    teamId: team.id,
    teamName: team.name,
    logo: team.logo,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
  }));

const applyResultToRow = (
  row: LeagueTableRow,
  resultCode: "W" | "L" | "D",
  goalsFor: number,
  goalsAgainst: number,
): LeagueTableRow => {
  const wins = row.wins + (resultCode === "W" ? 1 : 0);
  const draws = row.draws + (resultCode === "D" ? 1 : 0);
  const losses = row.losses + (resultCode === "L" ? 1 : 0);
  const nextGoalsFor = row.goalsFor + goalsFor;
  const nextGoalsAgainst = row.goalsAgainst + goalsAgainst;

  return {
    ...row,
    played: row.played + 1,
    wins,
    draws,
    losses,
    points: wins * 3 + draws,
    goalsFor: nextGoalsFor,
    goalsAgainst: nextGoalsAgainst,
    goalDifference: nextGoalsFor - nextGoalsAgainst,
  };
};

export const updateLeagueTable = (
  table: LeagueTableRow[],
  matchResult: MatchResult,
): LeagueTableRow[] =>
  table.map((row) => {
    if (row.teamId === matchResult.homeTeamId) {
      return applyResultToRow(
        row,
        matchResult.homeResult,
        matchResult.homeScore ?? 0,
        matchResult.awayScore ?? 0,
      );
    }

    if (row.teamId === matchResult.awayTeamId) {
      return applyResultToRow(
        row,
        matchResult.awayResult,
        matchResult.awayScore ?? 0,
        matchResult.homeScore ?? 0,
      );
    }

    return row;
  });

export const sortLeagueTable = (table: LeagueTableRow[]): LeagueTableRow[] =>
  [...table].sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }

    return a.teamName.localeCompare(b.teamName);
  });
