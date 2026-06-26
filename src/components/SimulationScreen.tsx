import { type ReactNode, useEffect, useMemo, useState } from "react";
import { createCustomTeam, premierLeagueSimulationTeams } from "../data/premierLeagueTeams";
import type { Fixture, FormationSlot, LeagueTableRow, SimulationStep, Team } from "../types";
import { initializeLeagueTable, sortLeagueTable, updateLeagueTable } from "../utils/leagueTable";
import { generateSimulationSteps } from "../utils/scheduleGenerator";
import { simulateMatch } from "../utils/simulationEngine";
import { LeagueTable } from "./LeagueTable";
import { SeasonSchedule } from "./SeasonSchedule";
import { SeasonSummary } from "./SeasonSummary";
import { SimulationControls, type SimulationSpeed } from "./SimulationControls";

type SimulationScreenProps = {
  formationSlots: FormationSlot[];
  onRestartGame: () => void;
  onReturnToSquad: () => void;
  topNav: ReactNode;
};

const speedDelays: Record<SimulationSpeed, number> = {
  slow: 900,
  normal: 450,
  fast: 150,
};

const calculateCustomTeamRating = (formationSlots: FormationSlot[]): number => {
  const assignedPlayers = formationSlots
    .map((slot) => slot.assignedPlayer)
    .filter((player) => Boolean(player));

  if (assignedPlayers.length === 0) {
    return 0;
  }

  const total = assignedPlayers.reduce((sum, player) => sum + (player?.rating ?? 0), 0);
  return Math.round((total / assignedPlayers.length) * 10) / 10;
};

const createSeasonState = (teams: Team[]) => ({
  steps: generateSimulationSteps(teams),
  table: initializeLeagueTable(teams),
});

export function SimulationScreen({
  formationSlots,
  onRestartGame,
  onReturnToSquad,
  topNav,
}: SimulationScreenProps) {
  const squadComplete =
    formationSlots.length > 0 && formationSlots.every((slot) => slot.assignedPlayer);
  const [customTeamName, setCustomTeamName] = useState("My FC");
  const [customShortName, setCustomShortName] = useState("MYF");
  const [pendingTeamName, setPendingTeamName] = useState("My FC");
  const [pendingShortName, setPendingShortName] = useState("MYF");
  const [showNameModal, setShowNameModal] = useState(true);
  const [showFinalModal, setShowFinalModal] = useState(false);

  const teams = useMemo(() => {
    const customRating = calculateCustomTeamRating(formationSlots);
    return [
      ...premierLeagueSimulationTeams,
      createCustomTeam(customRating, customTeamName, customShortName),
    ];
  }, [customShortName, customTeamName, formationSlots]);

  const [{ steps, table }, setSeasonState] = useState(() => createSeasonState(teams));
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [fixtures, setFixtures] = useState<Fixture[]>(() =>
    steps.map((step) => step.customFixture),
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSeasonComplete, setIsSeasonComplete] = useState(false);
  const [speed, setSpeed] = useState<SimulationSpeed>("normal");

  useEffect(() => {
    const nextSeason = createSeasonState(teams);
    setSeasonState(nextSeason);
    setFixtures(nextSeason.steps.map((step) => step.customFixture));
    setCurrentStepIndex(0);
    setIsSimulating(false);
    setIsPaused(false);
    setIsSeasonComplete(false);
    setShowFinalModal(false);
  }, [teams]);

  const sortedTable = useMemo(() => sortLeagueTable(table), [table]);
  const teamsById = useMemo(
    () => new Map(teams.map((team) => [team.id, team] as const)),
    [teams],
  );
  const customRow = sortedTable.find((row) => row.teamId === "custom-team");
  const customPosition = sortedTable.findIndex((row) => row.teamId === "custom-team") + 1;

  const simulateStep = (step: SimulationStep, currentTable: LeagueTableRow[]) => {
    const stepFixtures = [step.customFixture, ...step.backgroundFixtures];
    let nextTable = currentTable;
    const simulatedFixtures = stepFixtures.map((fixture) => {
      const result = simulateMatch(fixture, teams, {
        boostLowerRatedTeam: !fixture.isCustomTeamFixture,
      });
      nextTable = updateLeagueTable(nextTable, result);
      return { ...fixture, simulated: true, result };
    });

    const simulatedCustomFixture = simulatedFixtures[0];
    setFixtures((currentFixtures) =>
      currentFixtures.map((fixture) =>
        fixture.id === simulatedCustomFixture.id ? simulatedCustomFixture : fixture,
      ),
    );
    setSeasonState((current) => ({ ...current, table: nextTable }));
  };

  useEffect(() => {
    if (!isSimulating || isPaused || isSeasonComplete) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const step = steps[currentStepIndex];

      if (!step) {
        setIsSimulating(false);
        setIsSeasonComplete(true);
        return;
      }

      simulateStep(step, table);
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);

      if (nextIndex >= steps.length) {
        setIsSimulating(false);
        setIsSeasonComplete(true);
        setShowFinalModal(true);
      }
    }, speedDelays[speed]);

    return () => window.clearTimeout(timeoutId);
  }, [currentStepIndex, isPaused, isSeasonComplete, isSimulating, speed, steps, table]);

  if (!squadComplete) {
    return (
      <main className="app simulation-app">
        {topNav}
        <section className="panel simulation-blocked-panel">
          <div className="section-heading">
            <span>Season Simulation</span>
          </div>
          <h1>Complete your squad first.</h1>
          <p>The custom team needs all 11 players before it can enter the league.</p>
          <button className="primary-button season-button" onClick={onReturnToSquad}>
            Return to Squad
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app simulation-app">
      {topNav}
      <header className="app-header simulation-header">
        <div>
          <p>Premier League Season</p>
          <h1>My FC joins a 21-team double round-robin.</h1>
        </div>
        <button className="reset-button" onClick={onReturnToSquad}>
          Back to Squad
        </button>
      </header>

      <div className="simulation-layout">
        <aside className="simulation-left-column">
          <SimulationControls
            isSimulating={isSimulating}
            isPaused={isPaused}
            isSeasonComplete={isSeasonComplete}
            speed={speed}
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            onStart={() => setIsSimulating(true)}
            onPause={() => setIsPaused(true)}
            onResume={() => setIsPaused(false)}
            onSpeedChange={setSpeed}
          />
          {isSeasonComplete && (
            <SeasonSummary
              customRow={customRow}
              position={customPosition}
              customTeamName={customTeamName}
            />
          )}
          <SeasonSchedule
            fixtures={fixtures}
            customTeamId="custom-team"
            teamsById={teamsById}
            customTeamName={customTeamName}
          />
        </aside>

        <LeagueTable rows={sortedTable} customTeamId="custom-team" />
      </div>

      {showNameModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <form
            className="season-modal"
            onSubmit={(event) => {
              event.preventDefault();
              const normalizedName = pendingTeamName.trim() || "My FC";
              const normalizedShortName =
                pendingShortName.trim().slice(0, 3).toUpperCase() || "MYF";

              setCustomTeamName(normalizedName);
              setCustomShortName(normalizedShortName);
              setPendingTeamName(normalizedName);
              setPendingShortName(normalizedShortName);
              setShowNameModal(false);
            }}
          >
            <div className="section-heading">
              <span>Create Club</span>
            </div>
            <h2>Name your Premier League team</h2>
            <label>
              Team name
              <input
                value={pendingTeamName}
                onChange={(event) => setPendingTeamName(event.target.value)}
                maxLength={28}
              />
            </label>
            <label>
              3-letter abbreviation
              <input
                value={pendingShortName}
                onChange={(event) =>
                  setPendingShortName(event.target.value.toUpperCase().slice(0, 3))
                }
                maxLength={3}
              />
            </label>
            <button className="primary-button season-button" type="submit">
              Enter League
            </button>
          </form>
        </div>
      )}

      {showFinalModal && customRow && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <section className="season-modal final-modal">
            <div className="section-heading">
              <span>Season Complete</span>
            </div>
            <h2>
              {customPosition === 1
                ? "You Won The Premier League!"
                : customPosition >= 18
                  ? "you have been relegated"
                  : `${customTeamName} finished ${customPosition}${customPosition === 2 ? "nd" : customPosition === 3 ? "rd" : "th"}`}
            </h2>
            <p>
              {customTeamName}: {customRow.points} points, {customRow.wins} wins,{" "}
              {customRow.draws} draws, {customRow.losses} losses.
            </p>
            <button
              className="season-secondary-button"
              onClick={onRestartGame}
            >
              Restart Whole Game
            </button>
            <button
              className="primary-button season-button"
              onClick={() => setShowFinalModal(false)}
            >
              View Final Table
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
