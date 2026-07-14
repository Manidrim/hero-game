import { WEAPONS } from "../config/weapons.js";
import { addFloater } from "./floaters.js";

// Achète une arme avec de l'or si elle n'est pas déjà possédée. Renvoie true
// en cas d'achat effectif (pour équiper l'arme dans la foulée côté appelant).
export function buyWeapon(state, key) {
  const h = state.hero;
  const def = WEAPONS[key];
  const w = h.weapons[key];
  if (!def || !w || w.owned) return false;
  if (state.gold < def.cost) {
    addFloater(state, h.x, h.y - 20, "Pas assez d'or", "#ff6b6b");
    return false;
  }
  state.gold -= def.cost;
  w.owned = true;
  addFloater(state, h.x, h.y - 20, def.emoji + " " + def.name + " acheté !", "#ffe066");
  return true;
}
