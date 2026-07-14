import { WEAPONS, WEAPON_ORDER, WEAPON_SWITCH_COOLDOWN } from "../config/weapons.js";
import { addFloater } from "./floaters.js";

// Équipe l'arme demandée si elle est possédée et si le cooldown le permet.
export function switchWeapon(state, key) {
  const h = state.hero;
  const def = WEAPONS[key];
  const w = h.weapons[key];
  if (!def || !w || !w.owned || key === h.weapon) return;
  if (h.switchCd > 0) {
    addFloater(state, h.x, h.y - 20, "Arme en rechargement…", "#ff6b6b");
    return;
  }
  h.weapon = key;
  h.switchCd = WEAPON_SWITCH_COOLDOWN;
  h.cooldown = Math.max(h.cooldown, 0.2); // petit temps d'armement
  addFloater(state, h.x, h.y - 20, def.emoji + " " + def.name, "#ffe066");
}

// Passe à l'arme possédée suivante (raccourci clavier).
export function cycleWeapon(state) {
  const h = state.hero;
  const owned = WEAPON_ORDER.filter((k) => h.weapons[k].owned);
  if (owned.length <= 1) return;
  const idx = owned.indexOf(h.weapon);
  switchWeapon(state, owned[(idx + 1) % owned.length]);
}
