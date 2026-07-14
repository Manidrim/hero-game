import { WEAPON_ORDER } from "../config/weapons.js";

// Met à jour les statistiques d'éliminations du héros : total et détail par arme.
export function syncHeroKills(el, state) {
  el.heroKills.textContent = state.hero.kills;
  for (const key of WEAPON_ORDER) {
    el.killCounts[key].textContent = state.hero.weapons[key].kills;
  }
}
