import type { Player } from "../types";

type PlayerCardProps = {
  player: Player;
  isUsed: boolean;
  isCompatible: boolean;
  isLocked: boolean;
  isSelected: boolean;
  onDragStart: (playerId: string) => void;
  onSelect: (playerId: string) => void;
};

export function PlayerCard({
  player,
  isUsed,
  isCompatible,
  isLocked,
  isSelected,
  onDragStart,
  onSelect,
}: PlayerCardProps) {
  const disabled = isUsed || isLocked;

  return (
    <article
      className={`player-card ${disabled ? "disabled" : ""} ${
        isSelected ? "selected" : ""
      } ${
        isCompatible ? "compatible" : "incompatible"
      }`}
      draggable={!disabled}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-pressed={isSelected}
      onClick={() => {
        if (!disabled) {
          onSelect(player.id);
        }
      }}
      onKeyDown={(event) => {
        if (!disabled && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onSelect(player.id);
        }
      }}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", player.id);
        event.dataTransfer.effectAllowed = "move";
        const dragPreview = event.currentTarget.cloneNode(true) as HTMLElement;
        dragPreview.classList.add("drag-preview");
        dragPreview.style.position = "fixed";
        dragPreview.style.left = "-9999px";
        dragPreview.style.top = "-9999px";
        document.body.appendChild(dragPreview);
        event.dataTransfer.setDragImage(dragPreview, 53, 36);
        window.setTimeout(() => dragPreview.remove(), 0);
        onDragStart(player.id);
      }}
    >
      <div className="rating-badge">{player.rating}</div>
      <div className="player-info">
        <strong>{player.name}</strong>
        <span>{player.nationality}</span>
      </div>
      <div className="position-tags">
        {player.positions.map((position) => (
          <span key={position}>{position}</span>
        ))}
      </div>
      {isUsed && <div className="player-note">Used</div>}
      {!isUsed && !isCompatible && <div className="player-note">Not compatible</div>}
    </article>
  );
}
