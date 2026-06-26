import type { Fixture, Team } from "../types";
import { ScheduleMatchCard } from "./ScheduleMatchCard";

type SeasonScheduleProps = {
  fixtures: Fixture[];
  customTeamId: string;
  teamsById: Map<string, Team>;
  customTeamName: string;
};

export function SeasonSchedule({
  fixtures,
  customTeamId,
  teamsById,
  customTeamName,
}: SeasonScheduleProps) {
  return (
    <section className="panel season-schedule-panel">
      <div className="section-heading">
        <span>{customTeamName} Fixtures</span>
        <strong>40 matches</strong>
      </div>
      <div className="season-schedule-grid">
        {fixtures.map((fixture, index) => (
          <ScheduleMatchCard
            key={fixture.id}
            fixture={fixture}
            matchNumber={index + 1}
            customTeamId={customTeamId}
            teamsById={teamsById}
          />
        ))}
      </div>
    </section>
  );
}
