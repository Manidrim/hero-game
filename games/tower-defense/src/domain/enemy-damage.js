import { SLOW_DURATION } from "../config/balance.js";
import { addFloater } from "./floaters.js";
import { grantXp } from "./leveling.js";
import { grantWeaponXp } from "./weapon-leveling.js";
import { recordHeroKill } from "./kill-stats.js";

// Retire un ennemi vaincu : crédite l'or, l'XP (héros et arme), comptabilise le
// coup selon sa source (`source`) et affiche un texte flottant.
export function killEnemy(state, index, source) {
  const e = state.enemies[index];
  state.enemies.splice(index, 1);
  state.gold += e.reward;
  addFloater(state, e.x, e.y, "+" + e.reward + "💰", "#ffd43b");
  grantXp(state, e.reward);
  grantWeaponXp(state, e.reward);
  if (source && source.type === "hero") recordHeroKill(state, source.weapon);
}

// Applique des dégâts à un ennemi ; le ralentit et le tue si nécessaire.
export function damageEnemy(state, index, damage, slow, source) {
  const e = state.enemies[index];
  e.hp -= damage;
  if (slow > 0) e.slowTimer = SLOW_DURATION;
  if (e.hp <= 0) killEnemy(state, index, source);
}
