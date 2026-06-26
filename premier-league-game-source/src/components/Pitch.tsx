import type { FormationSlot as FormationSlotType, SpinResult } from "../types";
import { FormationSlot } from "./FormationSlot";

type PitchProps = {
  formationName: string | null;
  slots: FormationSlotType[];
  currentSpinResult: SpinResult | null;
  averageRating: number | null;
  onDropPlayer: (slotId: string, playerId: string) => void;
  onClickSlot: (slotId: string) => void;
};

export function Pitch({
  formationName,
  slots,
  currentSpinResult,
  averageRating,
  onDropPlayer,
  onClickSlot,
}: PitchProps) {
  return (
    <section className="pitch-shell">
      <div className="pitch-header">
        <span>{formationName ?? "Choose a formation"}</span>
        <div className="pitch-metrics">
          <strong>Avg OVR {averageRating ?? "--"}</strong>
          <strong>{slots.filter((slot) => slot.assignedPlayer).length}/11 filled</strong>
        </div>
      </div>
      <div className="pitch">
        <div className="center-circle" />
        <div className="center-line" />
        <div className="box box-top" />
        <div className="box box-bottom" />
        {slots.length === 0 && (
          <div className="empty-pitch-message">Select a formation to lay out the XI.</div>
        )}
        {slots.map((slot) => (
          <FormationSlot
            key={slot.id}
            slot={slot}
            isActive={currentSpinResult?.slotId === slot.id}
            onDropPlayer={onDropPlayer}
            onClickSlot={onClickSlot}
          />
        ))}
      </div>
    </section>
  );
}
