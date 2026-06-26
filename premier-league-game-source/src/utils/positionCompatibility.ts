const compatibilityMap: Record<string, string[]> = {
  GK: ["GK"],
  LB: ["LB", "LWB"],
  LWB: ["LWB", "LB", "LM"],
  RB: ["RB", "RWB"],
  RWB: ["RWB", "RB", "RM"],
  CB: ["CB"],
  CDM: ["CDM", "CM"],
  CM: ["CM", "CDM", "CAM"],
  CAM: ["CAM", "CM", "LAM", "RAM", "CF"],
  LAM: ["LAM", "CAM", "LW", "LM"],
  RAM: ["RAM", "CAM", "RW", "RM"],
  LM: ["LM", "LW", "LWB"],
  RM: ["RM", "RW", "RWB"],
  LW: ["LW", "LM", "LAM"],
  RW: ["RW", "RM", "RAM"],
  ST: ["ST", "CF"],
  CF: ["CF", "ST", "CAM"],
};

export const isPositionCompatible = (
  playerPositions: string[],
  targetPosition: string,
): boolean => {
  const normalizedTarget = targetPosition.toUpperCase();
  const compatiblePositions = compatibilityMap[normalizedTarget] ?? [normalizedTarget];

  return playerPositions.some((position) =>
    compatiblePositions.includes(position.toUpperCase()),
  );
};
