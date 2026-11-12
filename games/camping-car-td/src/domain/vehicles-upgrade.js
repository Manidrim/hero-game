import { VEHICLE_TYPES, upgradeCost } from "../config/vehicles.js";
import { MAX_VEHICLE_LEVEL, SELL_RATIO } from "../config/balance.js";
import { towerById } from "./vehicles-build.js";
import { unlockAchievement } from "./meta.js";

// Amélioration possible (niveau max non atteint et coût abordable) ?
export function canUpgrade(state, tower) {
  if (!tower || tower.level >= MAX_VEHICLE_LEVEL) return false;
  return state.money >= upgradeCost(VEHICLE_TYPES[tower.type], tower.level);
}

// Améliore le véhicule d'id donné d'un niveau ; débite les euros.
export function upgradeVehicle(state, id) {
  const tower = towerById(state, id);
  if (!canUpgrade(state, tower)) return false;
  const cost = upgradeCost(VEHICLE_TYPES[tower.type], tower.level);
  state.money -= cost;
  tower.invested += cost;
  tower.level++;
  if (tower.level === MAX_VEHICLE_LEVEL) unlockAchievement(state, "etoiles");
  return true;
}

// Valeur de revente d'un véhicule (part des euros investis).
export function sellValue(tower) {
  return Math.round(tower.invested * SELL_RATIO);
}

// Revend le véhicule d'id donné ; crédite les euros. Retourne la valeur.
export function sellVehicle(state, id) {
  const tower = towerById(state, id);
  if (!tower) return 0;
  const value = sellValue(tower);
  state.money += value;
  state.towers = state.towers.filter((t) => t !== tower);
  if (state.selectedId === id) state.selectedId = null;
  return value;
}
