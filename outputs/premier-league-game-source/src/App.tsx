import { useMemo, useRef, useState } from "react";
import { FormationSelector } from "./components/FormationSelector";
import { Pitch } from "./components/Pitch";
import { PlayerList } from "./components/PlayerList";
import { SimulationButton } from "./components/SimulationButton";
import { SimulationScreen } from "./components/SimulationScreen";
import { SpinnerPanel } from "./components/SpinnerPanel";
import { TopNav } from "./components/TopNav";
import { createFormationSlots, formations } from "./data/formations";
import { players, premierLeagueTeams } from "./data/players";
import type { FormationSlot, SpinResult } from "./types";
import { isPositionCompatible } from "./utils/positionCompatibility";

const randomItem = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

function App() {
  const spinTimeoutRef = useRef<number | null>(null);
  const [selectedFormationId, setSelectedFormationId] = useState<string | null>(null);
  const [formationSlots, setFormationSlots] = useState<FormationSlot[]>([]);
  const [currentSpinResult, setCurrentSpinResult] = useState<SpinResult | null>(null);
  const [usedPlayerIds, setUsedPlayerIds] = useState<Set<string>>(new Set());
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeView, setActiveView] = useState<"squad" | "simulation">("squad");
  const [activePage, setActivePage] = useState<"game" | "about">("game");
  const [statusMessage, setStatusMessage] = useState(
    "Choose a formation to begin your Premier League squad draft.",
  );

  const selectedFormationName = useMemo(
    () => formations.find((formation) => formation.id === selectedFormationId)?.name ?? null,
    [selectedFormationId],
  );

  const squadComplete =
    formationSlots.length > 0 && formationSlots.every((slot) => slot.assignedPlayer);

  const averageRating = useMemo(() => {
    const filledSlots = formationSlots.filter((slot) => slot.assignedPlayer);
    if (filledSlots.length === 0) {
      return null;
    }

    const total = filledSlots.reduce(
      (sum, slot) => sum + (slot.assignedPlayer?.rating ?? 0),
      0,
    );

    return Math.round((total / filledSlots.length) * 10) / 10;
  }, [formationSlots]);

  const availablePlayers = useMemo(() => {
    if (!currentSpinResult) {
      return [];
    }

    return players
      .filter((player) => player.team === currentSpinResult.team)
      .sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name));
  }, [currentSpinResult]);

  const clearSpinTimeout = () => {
    if (spinTimeoutRef.current !== null) {
      window.clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }
  };

  const handleSelectFormation = (formationId: string) => {
    clearSpinTimeout();
    setSelectedFormationId(formationId);
    setFormationSlots(createFormationSlots(formationId));
    setCurrentSpinResult(null);
    setSelectedPlayerId(null);
    setIsSpinning(false);
    setUsedPlayerIds(new Set());
    setStatusMessage("Formation selected. Spin for your first team and position.");
  };

  const handleSpin = () => {
    if (!selectedFormationId) {
      setStatusMessage("Pick a formation before spinning.");
      return;
    }

    if (currentSpinResult || isSpinning) {
      setStatusMessage("Place a valid player into the highlighted slot before spinning again.");
      return;
    }

    const openSlots = formationSlots.filter((slot) => !slot.assignedPlayer);
    if (openSlots.length === 0) {
      setStatusMessage("Your squad is complete. Simulation is ready when you are.");
      return;
    }

    setSelectedPlayerId(null);
    setIsSpinning(true);
    setStatusMessage("Spinning for a Premier League team and open position.");

    spinTimeoutRef.current = window.setTimeout(() => {
      const team = randomItem(premierLeagueTeams);
      const slot = randomItem(openSlots);
      setCurrentSpinResult({ team, slotId: slot.id, position: slot.label });
      setIsSpinning(false);
      spinTimeoutRef.current = null;
      setStatusMessage(`Draft a ${slot.label} from ${team} and drop him into the highlighted slot.`);
    }, 850);
  };

  const handlePlacePlayer = (slotId: string, playerId: string) => {
    const player = players.find((item) => item.id === playerId);
    const targetSlot = formationSlots.find((slot) => slot.id === slotId);

    if (!currentSpinResult) {
      setStatusMessage("Spin for a team and position before placing a player.");
      return;
    }

    if (!player || !targetSlot) {
      setStatusMessage("That drop could not be read. Try dragging the player again.");
      return;
    }

    if (slotId !== currentSpinResult.slotId) {
      setStatusMessage(`Wrong slot. The active draft position is ${currentSpinResult.position}.`);
      return;
    }

    if (targetSlot.assignedPlayer) {
      setStatusMessage("That slot is already filled.");
      return;
    }

    if (player.team !== currentSpinResult.team) {
      setStatusMessage(`This spin requires a player from ${currentSpinResult.team}.`);
      return;
    }

    if (usedPlayerIds.has(player.id)) {
      setStatusMessage(`${player.name} is already in your squad.`);
      return;
    }

    if (!isPositionCompatible(player.positions, currentSpinResult.position)) {
      setStatusMessage(`${player.name} cannot be placed at ${currentSpinResult.position}.`);
      return;
    }

    const nextSlots = formationSlots.map((slot) =>
      slot.id === slotId
        ? {
            ...slot,
            assignedPlayer: {
              ...player,
              assignedPosition: currentSpinResult.position,
            },
          }
        : slot,
    );

    const nextUsedPlayerIds = new Set(usedPlayerIds);
    nextUsedPlayerIds.add(player.id);
    const isNowComplete = nextSlots.every((slot) => slot.assignedPlayer);

    setFormationSlots(nextSlots);
    setUsedPlayerIds(nextUsedPlayerIds);
    setCurrentSpinResult(null);
    setSelectedPlayerId(null);
    setIsSpinning(false);
    setStatusMessage(
      isNowComplete
        ? "Squad complete. You can now simulate the Premier League season."
        : `${player.name} locked in at ${targetSlot.label}. Spin again for the next slot.`,
    );
  };

  const handleReset = () => {
    clearSpinTimeout();
    setSelectedFormationId(null);
    setFormationSlots([]);
    setCurrentSpinResult(null);
    setSelectedPlayerId(null);
    setIsSpinning(false);
    setUsedPlayerIds(new Set());
    setActiveView("squad");
    setStatusMessage("Choose a formation to begin your Premier League squad draft.");
  };

  const handleNavigate = (page: "game" | "about") => {
    setActivePage(page);
    if (page === "game") {
      setActiveView("squad");
    }
  };

  const canSpin = Boolean(selectedFormationId) && !currentSpinResult && !squadComplete && !isSpinning;

  if (activeView === "simulation") {
    return (
      <SimulationScreen
        formationSlots={formationSlots}
        onRestartGame={handleReset}
        onReturnToSquad={() => setActiveView("squad")}
        topNav={<TopNav activePage={activePage} onNavigate={handleNavigate} />}
      />
    );
  }

  if (activePage === "about") {
    return (
      <main className="app">
        <TopNav activePage={activePage} onNavigate={handleNavigate} />
        <section className="panel about-panel">
          <div className="section-heading">
            <span>About</span>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <TopNav activePage={activePage} onNavigate={handleNavigate} />
      <header className="app-header">
        <div>
          <p>Premier League Squad Draft</p>
          <h1>Build an XI by spin, scouting, and drag-and-drop.</h1>
        </div>
        <button className="reset-button" onClick={handleReset}>
          Reset
        </button>
      </header>

      <div className="game-layout">
        <aside className="left-column">
          <FormationSelector
            selectedFormationId={selectedFormationId}
            onSelectFormation={handleSelectFormation}
          />
          <SpinnerPanel
            canSpin={canSpin}
            currentSpinResult={currentSpinResult}
            isComplete={squadComplete}
            isSpinning={isSpinning}
            onSpin={handleSpin}
          />
          <section className={`status-panel ${squadComplete ? "complete" : ""}`}>
            {statusMessage}
          </section>
          <SimulationButton
            isComplete={squadComplete}
            onSimulate={() => {
              setActivePage("game");
              setActiveView("simulation");
            }}
          />
          <PlayerList
            players={availablePlayers}
            usedPlayerIds={usedPlayerIds}
            selectedPlayerId={selectedPlayerId}
            currentPosition={currentSpinResult?.position ?? null}
            isPositionCompatible={isPositionCompatible}
            onDragStart={setSelectedPlayerId}
            onSelectPlayer={(playerId) => {
              setSelectedPlayerId(playerId);
              const player = players.find((item) => item.id === playerId);
              setStatusMessage(
                player && currentSpinResult
                  ? `${player.name} selected. Drop him or click the highlighted ${currentSpinResult.position} slot.`
                  : "Spin for a team and position before selecting a player.",
              );
            }}
          />
        </aside>

        <Pitch
          formationName={selectedFormationName}
          slots={formationSlots}
          currentSpinResult={currentSpinResult}
          averageRating={averageRating}
          onDropPlayer={handlePlacePlayer}
          onClickSlot={(slotId) => {
            if (!selectedPlayerId) {
              setStatusMessage("Select or drag a player before placing him into a slot.");
              return;
            }

            handlePlacePlayer(slotId, selectedPlayerId);
          }}
        />
      </div>
    </main>
  );
}

export default App;
