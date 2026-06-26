import type { LeagueTableRow as LeagueTableRowType } from "../types";
import { LeagueTableRow } from "./LeagueTableRow";

type LeagueTableProps = {
  rows: LeagueTableRowType[];
  customTeamId: string;
};

export function LeagueTable({ rows, customTeamId }: LeagueTableProps) {
  return (
    <section className="league-table-shell">
      <div className="pitch-header league-table-header">
        <span>Premier League Table</span>
        <strong>21 clubs</strong>
      </div>
      <div className="league-table-scroll">
        <table className="league-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th></th>
              <th>Club</th>
              <th>P</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th className="points-column">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <LeagueTableRow
                key={row.teamId}
                row={row}
                position={index + 1}
                isCustomTeam={row.teamId === customTeamId}
                isRelegationZone={index + 1 >= 18 && index + 1 <= 21}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
