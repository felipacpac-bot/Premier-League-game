import type { Fixture, MatchResultCode, Team } from "../types";
import { TeamLogo } from "./TeamLogo";

type ScheduleMatchCardProps = {
  fixture: Fixture;
  matchNumber: number;
  customTeamId: string;
  teamsById: Map<string, Team>;
};

const getCustomResult = (fixture: Fixture, customTeamId: string): MatchResultCode | null => {
  if (!fixture.result) {
    return null;
  }

  return fixture.homeTeamId === customTeamId
    ? fixture.result.homeResult
    : fixture.result.awayResult;
};

export function ScheduleMatchCard({
  fixture,
  matchNumber,
  customTeamId,
  teamsById,
}: ScheduleMatchCardProps) {
  const opponentId =
    fixture.homeTeamId === customTeamId ? fixture.awayTeamId : fixture.homeTeamId;
  const opponent = teamsById.get(opponentId);
  const location = fixture.homeTeamId === customTeamId ? "Home" : "Away";
  const result = getCustomResult(fixture, customTeamId);

  return (
    <article className={`schedule-card ${result ? `result-${result.toLowerCase()}` : ""}`}>
      <div className="schedule-card-top">
        <span>#{matchNumber}</span>
        <strong>{result ?? location[0]}</strong>
      </div>
      {opponent && <TeamLogo logo={opponent.logo} name={opponent.name} small />}
      <div>
        <strong>{opponent?.shortName ?? opponentId}</strong>
        <span>{location}</span>
      </div>
    </article>
  );
}
