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
  addFloater(state, h.x, h.y - 20, "NIVEAU " + h.level + " !", "#63e6be");
}
