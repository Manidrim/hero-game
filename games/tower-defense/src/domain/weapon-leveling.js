import { WEAPON_XP_GROWTH } from "../config/weapons.js";
import { addFloater } from "./floaters.js";

// Crédite de l'XP à l'arme équipée et gère ses montées de niveau. Chaque niveau
// gagné octroie un point à répartir (multiplicateur ou vitesse d'attaque).
export function grantWeaponXp(state, amount) {
  const h = state.hero;
  const w = h.weapons[h.weapon];
  w.xp += amount;
  while (w.xp >= w.xpNext) {
    w.xp -= w.xpNext;
    weaponLevelUp(state, w);
  }
}

function weaponLevelUp(state, w) {
  w.level++;
  w.points++;
  w.xpNext = Math.round(w.xpNext * WEAPON_XP_GROWTH);
  const h = state.hero;
  addFloater(state, h.x, h.y - 58, "Arme niv. " + w.level + " · +1 point", "#ffd43b");
}
