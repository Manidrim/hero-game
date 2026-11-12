import { VEHICLE_TYPES } from "../config/vehicles.js";
import { achievementBonuses, gainsMultiplier } from "./meta.js";

// Statistiques effectives d'un véhicule posé : niveau + talents + succès.
export function vehicleStats(state, tower) {
  const def = VEHICLE_TYPES[tower.type];
  const talents = state.meta.talents;
  const bonus = achievementBonuses(state.meta);
  const level = tower.level;
  return {
    damage:
      (def.damage || 0) *
      Math.pow(1.4, level - 1) *
      (1 + 0.12 * (talents.degats || 0)) *
      (1 + bonus.dmgPct / 100),
    range:
      (def.range || 0) *
      (1 + 0.06 * (level - 1)) *
      (1 + 0.10 * (talents.portee || 0)),
    fireRate:
      (def.fireRate || 0) *
      (1 + 0.12 * (level - 1)) *
      (1 + 0.10 * (talents.cadence || 0)),
    slow: def.slow || 0,
    income: (def.income || 0) * Math.pow(1.5, level - 1) * gainsMultiplier(state),
  };
}
