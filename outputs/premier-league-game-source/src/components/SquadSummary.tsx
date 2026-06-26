import type { FormationSlot } from "../types";

type SquadSummaryProps = {
  slots: FormationSlot[];
};

export function SquadSummary({ slots }: SquadSummaryProps) {
  const filledSlots = slots.filter((slot) => slot.assignedPlayer);
  const ratingTotal = filledSlots.reduce(
    (total, slot) => total + (slot.assignedPlayer?.rating ?? 0),
    0,
  );
  const averageRating =
    filledSlots.length > 0 ? Math.round((ratingTotal / filledSlots.length) * 10) / 10 : 0;

  return (
    <section className="panel compact-panel">
      <div className="section-heading">
        <span>Progress</span>
      </div>
      <div className="progress-row">
        <strong>{filledSlots.length}/11</strong>
        <span>slots filled</span>
      </div>
      <div className="meter">
        <span style={{ width: `${(filledSlots.length / 11) * 100}%` }} />
      </div>
      <div className="progress-row">
        <strong>{averageRating || "--"}</strong>
        <span>average rating</span>
      </div>
    </section>
  );
}
