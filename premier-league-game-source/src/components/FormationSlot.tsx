import type { FormationSlot as FormationSlotType } from "../types";

type FormationSlotProps = {
  slot: FormationSlotType;
  isActive: boolean;
  onDropPlayer: (slotId: string, playerId: string) => void;
  onClickSlot: (slotId: string) => void;
};

export function FormationSlot({
  slot,
  isActive,
  onDropPlayer,
  onClickSlot,
}: FormationSlotProps) {
  return (
    <button
      className={`slot ${slot.assignedPlayer ? "filled" : ""} ${
        isActive ? "active" : ""
      }`}
      style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const playerId = event.dataTransfer.getData("text/plain");
        onDropPlayer(slot.id, playerId);
      }}
      onClick={() => onClickSlot(slot.id)}
      type="button"
    >
      {slot.assignedPlayer ? (
        <>
          <strong>{slot.assignedPlayer.name}</strong>
          <span>{slot.assignedPlayer.rating} OVR</span>
          <span>{slot.assignedPlayer.nationality}</span>
          <em>{slot.assignedPlayer.assignedPosition}</em>
        </>
      ) : (
        <strong>{slot.label}</strong>
      )}
    </button>
  );
}
