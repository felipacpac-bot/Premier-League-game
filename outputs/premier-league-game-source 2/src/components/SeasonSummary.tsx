import type { LeagueTableRow } from "../types";

type SeasonSummaryProps = {
  customRow: LeagueTableRow | undefined;
  position: number;
  customTeamName: string;
};

const getOrdinal = (position: number): string => {
  const suffix = position % 10 === 1 && position % 100 !== 11
    ? "st"
    : position % 10 === 2 && position % 100 !== 12
      ? "nd"
      : position % 10 === 3 && position % 100 !== 13
        ? "rd"
        : "th";

  return `${position}${suffix}`;
};

export function SeasonSummary({ customRow, position, customTeamName }: SeasonSummaryProps) {
  if (!customRow) {
    return null;
  }

  return (
    <section className="panel season-summary">
      <strong>
        {customTeamName} finished {getOrdinal(position)} with {customRow.points} points.
      </strong>
      <span>
        {customRow.played} played, {customRow.wins} wins, {customRow.draws} draws,{" "}
        {customRow.losses} losses.
      </span>
    </section>
  );
}
