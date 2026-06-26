import { formations } from "../data/formations";

type FormationSelectorProps = {
  selectedFormationId: string | null;
  onSelectFormation: (formationId: string) => void;
};

export function FormationSelector({
  selectedFormationId,
  onSelectFormation,
}: FormationSelectorProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <span>Formation</span>
      </div>
      <div className="formation-grid">
        {formations.map((formation) => (
          <button
            className={`formation-button ${
              selectedFormationId === formation.id ? "selected" : ""
            }`}
            key={formation.id}
            onClick={() => onSelectFormation(formation.id)}
          >
            {formation.name}
          </button>
        ))}
      </div>
    </section>
  );
}
