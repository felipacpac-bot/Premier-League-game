import type { LeagueTableRow as LeagueTableRowType } from "../types";
import { TeamLogo } from "./TeamLogo";

type LeagueTableRowProps = {
  row: LeagueTableRowType;
  position: number;
  isCustomTeam: boolean;
  isRelegationZone: boolean;
};

export function LeagueTableRow({
  row,
  position,
  isCustomTeam,
  isRelegationZone,
}: LeagueTableRowProps) {
  return (
    <tr className={`${isCustomTeam ? "custom-team-row" : ""} ${
      isRelegationZone ? "relegation-row" : ""
    }`}>
      <td>{position}</td>
      <td>
        <TeamLogo logo={row.logo} name={row.teamName} small />
      </td>
      <td className="club-cell">{row.teamName}</td>
      <td>{row.played}</td>
      <td>{row.wins}</td>
      <td>{row.draws}</td>
      <td>{row.losses}</td>
      <td className="points-column">{row.points}</td>
    </tr>
  );
}
