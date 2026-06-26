export type SimulationSpeed = "slow" | "normal" | "fast";

type SimulationControlsProps = {
  isSimulating: boolean;
  isPaused: boolean;
  isSeasonComplete: boolean;
  speed: SimulationSpeed;
  currentStep: number;
  totalSteps: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onSpeedChange: (speed: SimulationSpeed) => void;
};

const speedOptions: SimulationSpeed[] = ["slow", "normal", "fast"];

export function SimulationControls({
  isSimulating,
  isPaused,
  isSeasonComplete,
  speed,
  currentStep,
  totalSteps,
  onStart,
  onPause,
  onResume,
  onSpeedChange,
}: SimulationControlsProps) {
  const canStart = !isSimulating && currentStep === 0 && !isSeasonComplete;

  return (
    <section className="panel season-control-panel">
      <div className="section-heading">
        <span>Season Controls</span>
        <strong>{currentStep}/{totalSteps}</strong>
      </div>

      <div className="season-control-actions">
        {canStart && (
          <button className="primary-button season-button" onClick={onStart}>
            Start Season
          </button>
        )}
        {isSimulating && !isPaused && (
          <button className="season-secondary-button" onClick={onPause}>
            Pause
          </button>
        )}
        {isSimulating && isPaused && (
          <button className="primary-button season-button" onClick={onResume}>
            Resume
          </button>
        )}
      </div>

      <div className="speed-control" aria-label="Simulation speed">
        {speedOptions.map((option) => (
          <button
            key={option}
            className={speed === option ? "selected" : ""}
            onClick={() => onSpeedChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
