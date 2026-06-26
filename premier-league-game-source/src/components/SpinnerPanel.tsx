import type { SpinResult } from "../types";

type SpinnerPanelProps = {
  canSpin: boolean;
  currentSpinResult: SpinResult | null;
  isComplete: boolean;
  isSpinning: boolean;
  onSpin: () => void;
};

export function SpinnerPanel({
  canSpin,
  currentSpinResult,
  isComplete,
  isSpinning,
  onSpin,
}: SpinnerPanelProps) {
  return (
    <section className="panel spinner-panel">
      <div className="section-heading">
        <span>Draft Spin</span>
      </div>

      <div className="spin-result">
        {currentSpinResult ? (
          <>
            <div className="spin-card spin-card-team">
              <span className="muted">Team</span>
              <strong>{currentSpinResult.team}</strong>
            </div>
            <div className="spin-card spin-card-position">
              <span className="muted">Position</span>
              <strong>{currentSpinResult.position}</strong>
            </div>
          </>
        ) : (
          <>
            <div className={`spin-card spin-card-team ${isSpinning ? "spinning" : ""}`}>
              <span className="muted">Team</span>
              <strong>{isComplete ? "DONE" : isSpinning ? "..." : "--"}</strong>
            </div>
            <div className={`spin-card spin-card-position ${isSpinning ? "spinning" : ""}`}>
              <span className="muted">Position</span>
              <strong>{isComplete ? "XI" : isSpinning ? "..." : "--"}</strong>
            </div>
          </>
        )}
      </div>

      <button className="primary-button" onClick={onSpin} disabled={!canSpin}>
        {isSpinning ? "Spinning" : "Spin Team & Position"}
      </button>
    </section>
  );
}
