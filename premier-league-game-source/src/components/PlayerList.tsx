import type { Player } from "../types";
import { PlayerCard } from "./PlayerCard";

type PlayerListProps = {
  players: Player[];
  usedPlayerIds: Set<string>;
  currentPosition: string | null;
  selectedPlayerId: string | null;
  isPositionCompatible: (positions: string[], targetPosition: string) => boolean;
  onDragStart: (playerId: string) => void;
  onSelectPlayer: (playerId: string) => void;
};

export function PlayerList({
  players,
  usedPlayerIds,
  currentPosition,
  selectedPlayerId,
  isPositionCompatible,
  onDragStart,
  onSelectPlayer,
}: PlayerListProps) {
  return (
    <section className="panel player-list-panel">
      <div className="section-heading">
        <span>Team Players</span>
      </div>
      {!currentPosition && (
        <p className="helper-copy">Spin first to load a Premier League squad list.</p>
      )}
      {currentPosition && players.length === 0 && (
        <p className="helper-copy">No mock players are available for this team yet.</p>
      )}
      <div className="player-list">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            isUsed={usedPlayerIds.has(player.id)}
            isSelected={selectedPlayerId === player.id}
            isCompatible={
              currentPosition
                ? isPositionCompatible(player.positions, currentPosition)
                : true
            }
            isLocked={!currentPosition}
            onDragStart={onDragStart}
            onSelect={onSelectPlayer}
          />
        ))}
      </div>
    </section>
  );
}
