type SimulationButtonProps = {
  isComplete: boolean;
  onSimulate: () => void;
};

export function SimulationButton({ isComplete, onSimulate }: SimulationButtonProps) {
  if (!isComplete) {
    return null;
  }

  return (
    <section className="panel simulation-panel">
      <button className="simulate-button" onClick={onSimulate}>
        Simulate Premier League Season
      </button>
    </section>
  );
}
