import { weaponLevelUp } from "./weapon-leveling.js";

// Dépense un point d'arme du héros (gagné en montant de niveau) pour donner
// un niveau à une arme possédée. Renvoie true si le point a été dépensé.
export function grantWeaponLevel(state, key) {
  const h = state.hero;
  const w = h.weapons[key];
  if (h.weaponPoints <= 0 || !w || !w.owned) return false;
  h.weaponPoints--;
  weaponLevelUp(state, w);
  return true;
}
