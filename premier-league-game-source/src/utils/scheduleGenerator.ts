import type { Fixture, SimulationStep, Team } from "../types";

const shuffle = <T,>(items: T[]): T[] => {
  const nextItems = [...items];
  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [nextItems[index], nextItems[randomIndex]] = [nextItems[randomIndex], nextItems[index]];
  }
  return nextItems;
};

export const generateDoubleRoundRobinFixtures = (teams: Team[]): Fixture[] => {
  const fixtures: Fixture[] = [];

  teams.forEach((homeTeam, homeIndex) => {
    teams.slice(homeIndex + 1).forEach((awayTeam) => {
      fixtures.push({
        id: `${homeTeam.id}-home-${awayTeam.id}`,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        isCustomTeamFixture: homeTeam.id === "custom-team" || awayTeam.id === "custom-team",
        simulated: false,
      });
      fixtures.push({
        id: `${awayTeam.id}-home-${homeTeam.id}`,
        homeTeamId: awayTeam.id,
        awayTeamId: homeTeam.id,
        isCustomTeamFixture: homeTeam.id === "custom-team" || awayTeam.id === "custom-team",
        simulated: false,
      });
    });
  });

  return fixtures;
};

export const generateSimulationSteps = (teams: Team[]): SimulationStep[] => {
  const fixtures = generateDoubleRoundRobinFixtures(teams);
  const customFixtures = shuffle(fixtures.filter((fixture) => fixture.isCustomTeamFixture));
  const backgroundFixtures = shuffle(fixtures.filter((fixture) => !fixture.isCustomTeamFixture));
  const stepCount = customFixtures.length;

  return customFixtures.map((customFixture, index) => {
    const start = Math.floor((index * backgroundFixtures.length) / stepCount);
    const end = Math.floor(((index + 1) * backgroundFixtures.length) / stepCount);

    return {
      stepNumber: index + 1,
      customFixture: { ...customFixture, stepNumber: index + 1 },
      backgroundFixtures: backgroundFixtures.slice(start, end).map((fixture) => ({
        ...fixture,
        stepNumber: index + 1,
      })),
    };
  });
};
