export type PositionGroup = "GK" | "DEF" | "MID" | "ATT";

export type Player = {
  id: string;
  name: string;
  team: string;
  rating: number;
  nationality: string;
  positions: string[];
};

export type AssignedPlayer = Player & {
  assignedPosition: string;
};

export type FormationSlot = {
  id: string;
  label: string;
  group: PositionGroup;
  x: number;
  y: number;
  assignedPlayer: AssignedPlayer | null;
};

export type Formation = {
  id: string;
  name: string;
  slots: FormationSlot[];
};

export type SpinResult = {
  team: string;
  slotId: string;
  position: string;
};

export type Team = {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  averageOverallRating: number;
};

export type ProbabilityBand = {
  minDifference: number;
  maxDifference: number | null;
  higherRatedWin: number;
  lowerRatedWin: number;
  draw: number;
};

export type MatchOutcome = "TEAM_A_WIN" | "TEAM_B_WIN" | "DRAW";

export type MatchResultCode = "W" | "L" | "D";

export type MatchResult = {
  fixtureId: string;
  homeTeamId: string;
  awayTeamId: string;
  winnerTeamId: string | null;
  loserTeamId: string | null;
  isDraw: boolean;
  teamAResult: MatchResultCode;
  teamBResult: MatchResultCode;
  homeResult: MatchResultCode;
  awayResult: MatchResultCode;
  homeScore?: number;
  awayScore?: number;
};

export type Fixture = {
  id: string;
  stepNumber?: number;
  homeTeamId: string;
  awayTeamId: string;
  isCustomTeamFixture: boolean;
  simulated: boolean;
  result?: MatchResult;
};

export type SimulationStep = {
  stepNumber: number;
  customFixture: Fixture;
  backgroundFixtures: Fixture[];
};

export type LeagueTableRow = {
  teamId: string;
  teamName: string;
  logo: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
};
