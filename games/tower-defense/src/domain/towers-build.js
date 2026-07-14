import { TILE, COLS, ROWS } from "../config/grid.js";
import { TOWER_TYPES } from "../config/towers.js";
import { pathSet } from "../config/path.js";
import { addFloater } from "./floaters.js";

// Peut-on construire la tour sélectionnée sur la case (c, r) ?
export function canBuildAt(state, c, r) {
  if (c < 0 || r < 0 || c >= COLS || r >= ROWS) return false;
  if (pathSet.has(c + "," + r)) return false;
  for (const t of state.towers) {
    if (t.c === c && t.r === r) return false;
  }
  if (!state.selectedType) return false;
  return state.gold >= TOWER_TYPES[state.selectedType].cost;
}

// Tente de construire sur la case (c, r) ; débite l'or et crée la tour.
export function tryBuild(state, c, r) {
  if (!canBuildAt(state, c, r)) {
    warnIfTooPoor(state, c, r);
    return;
  }
  const def = TOWER_TYPES[state.selectedType];
  state.gold -= def.cost;
  state.towers.push({
    id: state.nextTowerId++,
    type: state.selectedType,
    level: 1,
    c, r,
    x: c * TILE + TILE / 2,
    y: r * TILE + TILE / 2,
    cooldown: 0,
  });
}

function warnIfTooPoor(state, c, r) {
  if (state.selectedType && state.gold < TOWER_TYPES[state.selectedType].cost) {
    addFloater(state, c * TILE + TILE / 2, r * TILE + TILE / 2, "Pas assez d'or", "#ff6b6b");
  }
}

// Sélectionne / désélectionne un type de tour à construire.
export function selectType(state, type) {
  state.selectedType = state.selectedType === type ? null : type;
}
