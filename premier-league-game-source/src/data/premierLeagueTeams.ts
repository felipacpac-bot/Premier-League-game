import type { Team } from "../types";

export const premierLeagueSimulationTeams: Team[] = [
  { id: "arsenal", name: "Arsenal", shortName: "ARS", logo: "ARS", averageOverallRating: 84 },
  { id: "liverpool", name: "Liverpool", shortName: "LIV", logo: "LIV", averageOverallRating: 84 },
  { id: "manchester-city", name: "Manchester City", shortName: "MCI", logo: "MCI", averageOverallRating: 84 },
  { id: "aston-villa", name: "Aston Villa", shortName: "AVL", logo: "AVL", averageOverallRating: 81 },
  { id: "chelsea", name: "Chelsea", shortName: "CHE", logo: "CHE", averageOverallRating: 81 },
  { id: "newcastle-united", name: "Newcastle United", shortName: "NEW", logo: "NEW", averageOverallRating: 81 },
  { id: "manchester-united", name: "Manchester United", shortName: "MUN", logo: "MUN", averageOverallRating: 80 },
  { id: "tottenham-hotspur", name: "Tottenham Hotspur", shortName: "TOT", logo: "TOT", averageOverallRating: 80 },
  { id: "crystal-palace", name: "Crystal Palace", shortName: "CRY", logo: "CRY", averageOverallRating: 79 },
  { id: "nottingham-forest", name: "Nottingham Forest", shortName: "NFO", logo: "NFO", averageOverallRating: 79 },
  { id: "everton", name: "Everton", shortName: "EVE", logo: "EVE", averageOverallRating: 78 },
  { id: "brighton-hove-albion", name: "Brighton & Hove Albion", shortName: "BHA", logo: "BHA", averageOverallRating: 78 },
  { id: "brentford", name: "Brentford", shortName: "BRE", logo: "BRE", averageOverallRating: 78 },
  { id: "fulham", name: "Fulham FC", shortName: "FUL", logo: "FUL", averageOverallRating: 78 },
  { id: "afc-bournemouth", name: "AFC Bournemouth", shortName: "BOU", logo: "BOU", averageOverallRating: 78 },
  { id: "west-ham-united", name: "West Ham United", shortName: "WHU", logo: "WHU", averageOverallRating: 77 },
  { id: "sunderland", name: "Sunderland", shortName: "SUN", logo: "SUN", averageOverallRating: 77 },
  { id: "leeds-united", name: "Leeds United", shortName: "LEE", logo: "LEE", averageOverallRating: 76 },
  { id: "burnley", name: "Burnley", shortName: "BUR", logo: "BUR", averageOverallRating: 75 },
  { id: "wolverhampton-wanderers", name: "Wolverhampton Wanderers", shortName: "WOL", logo: "WOL", averageOverallRating: 75 },
];

export const createCustomTeam = (
  averageOverallRating: number,
  name = "My FC",
  shortName = "MYF",
): Team => ({
  id: "custom-team",
  name,
  shortName,
  logo: shortName.slice(0, 3).toUpperCase(),
  averageOverallRating,
});
