import { TILE, COLS, ROWS } from "../config/grid.js";
import { VEHICLE_TYPES } from "../config/vehicles.js";
import { addFloater } from "./floaters.js";

// Peut-on poser le véhicule en cours de placement sur la case (c, r) ?
export function canPlaceAt(state, c, r) {
  if (!state.placing) return false;
  if (c < 0 || r < 0 || c >= COLS || r >= ROWS) return false;
  if (state.pathSet.has(c + "," + r)) return false;
  if (state.towers.some((t) => t.c === c && t.r === r)) return false;
  return state.money >= VEHICLE_TYPES[state.placing].cost;
}

// Tente de poser le véhicule sélectionné sur (c, r) ; débite les euros.
export function tryPlace(state, c, r) {
  if (!canPlaceAt(state, c, r)) {
    warnIfTooPoor(state, c, r);
    return false;
  }
  const def = VEHICLE_TYPES[state.placing];
  state.money -= def.cost;
  state.towers.push({
    id: state.nextTowerId++,
    type: state.placing,
    level: 1,
    c, r,
    x: c * TILE + TILE / 2,
    y: r * TILE + TILE / 2,
    invested: def.cost, // euros investis (base du remboursement)
    cooldown: 0,
    flash: 0,
  });
  return true;
}

function warnIfTooPoor(state, c, r) {
  if (state.placing && state.money < VEHICLE_TYPES[state.placing].cost) {
    addFloater(state, c * TILE + TILE / 2, r * TILE + TILE / 2, "Pas assez d'euros", "#ff6b6b");
  }
}

// Sélectionne / désélectionne un type de véhicule à placer.
export function selectVehicle(state, type) {
  state.placing = state.placing === type ? null : type;
}

// Véhicule posé dont l'id est donné, ou null.
export function towerById(state, id) {
  return state.towers.find((t) => t.id === id) || null;
}
