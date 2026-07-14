import { WEAPON_ORDER, WEAPONS } from "../config/weapons.js";
import { addFloater } from "./floaters.js";

// Crédite de l'XP au héros et gère les montées de niveau successives.
export function grantXp(state, amount) {
  const h = state.hero;
  h.xp += amount;
  while (h.xp >= h.xpNext) {
    h.xp -= h.xpNext;
    levelUp(state);
  }
}

function levelUp(state) {
  const h = state.hero;
  h.level++;
  h.xpNext = Math.round(h.xpNext * 1.5);
  h.maxHp += 20;
  h.hp = h.maxHp;
  h.damage += 5;
  h.range += 6;
  h.fireRate = Math.max(0.18, h.fireRate * 0.95);
  addFloater(state, h.x, h.y - 20, "NIVEAU " + h.level + " !", "#63e6be");
  announceWeaponUnlock(state);
}

// Annonce le déblocage d'une arme atteinte à ce niveau.
function announceWeaponUnlock(state) {
  const h = state.hero;
  for (const key of WEAPON_ORDER) {
    const w = WEAPONS[key];
    if (w.unlockLevel === h.level) {
      addFloater(state, h.x, h.y - 40, "Arme débloquée : " + w.emoji + " " + w.name, "#ffe066");
    }
  }
}
