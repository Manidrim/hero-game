import { TOWER_TYPES } from "../config/towers.js";

// Statistiques effectives d'une tour selon son niveau (1 → 10).
export function getTowerStats(t) {
  const def = TOWER_TYPES[t.type];
  const step = t.level - 1;
  return {
    range: def.range + 8 * step,
    damage: def.damage * Math.pow(1.22, step),
    fireRate: def.fireRate * Math.pow(0.93, step),
    splash: def.splash > 0 ? def.splash + 4 * step : 0,
    slow: def.slow > 0 ? Math.min(0.8, def.slow + 0.03 * step) : 0,
    bullet: def.bullet,
  };
}

// Coût pour faire passer une tour à son niveau suivant.
export function upgradeCost(t) {
  const def = TOWER_TYPES[t.type];
  return Math.round(def.cost * (0.8 + 0.5 * (t.level - 1)));
}
