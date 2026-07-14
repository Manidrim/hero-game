import { addFloater } from "./floaters.js";

// Répartit un point disponible de l'arme dans une statistique :
// "multiplier" (multiplicateur de dégâts) ou "speed" (vitesse d'attaque).
export function allocateWeaponPoint(state, key, stat) {
  const w = state.hero.weapons[key];
  if (!w || w.points <= 0) return;
  if (stat === "multiplier") w.multiplierPoints++;
  else if (stat === "speed") w.speedPoints++;
  else return;
  w.points--;
  const h = state.hero;
  const label = stat === "multiplier" ? "Multiplicateur +0.1" : "Cadence améliorée";
  addFloater(state, h.x, h.y - 40, label, "#63e6be");
}
