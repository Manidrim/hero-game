import { WEAPONS, WEAPON_ORDER, WEAPON_SWITCH_COOLDOWN } from "../config/weapons.js";
import { addFloater } from "./floaters.js";

// Équipe l'arme demandée si elle est débloquée et si le cooldown le permet.
export function switchWeapon(state, key) {
  const h = state.hero;
  const w = WEAPONS[key];
  if (!w || key === h.weapon) return;
  if (h.level < w.unlockLevel) {
    addFloater(state, h.x, h.y - 20, "🔒 Niveau " + w.unlockLevel + " requis", "#ff6b6b");
    return;
  }
  if (h.switchCd > 0) {
    addFloater(state, h.x, h.y - 20, "Arme en rechargement…", "#ff6b6b");
    return;
  }
  h.weapon = key;
  h.switchCd = WEAPON_SWITCH_COOLDOWN;
  h.cooldown = Math.max(h.cooldown, 0.2); // petit temps d'armement
  addFloater(state, h.x, h.y - 20, w.emoji + " " + w.name, "#ffe066");
}

// Passe à l'arme débloquée suivante (raccourci clavier).
export function cycleWeapon(state) {
  const h = state.hero;
  const unlocked = WEAPON_ORDER.filter((k) => h.level >= WEAPONS[k].unlockLevel);
  if (unlocked.length <= 1) return;
  const idx = unlocked.indexOf(h.weapon);
  switchWeapon(state, unlocked[(idx + 1) % unlocked.length]);
}
