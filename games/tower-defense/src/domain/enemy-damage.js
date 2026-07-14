import { SLOW_DURATION } from "../config/balance.js";
import { addFloater } from "./floaters.js";
import { grantXp } from "./leveling.js";

// Retire un ennemi vaincu : crédite l'or, l'XP et affiche un texte flottant.
export function killEnemy(state, index) {
  const e = state.enemies[index];
  state.enemies.splice(index, 1);
  state.gold += e.reward;
  addFloater(state, e.x, e.y, "+" + e.reward + "💰", "#ffd43b");
  grantXp(state, e.reward);
}

// Applique des dégâts à un ennemi ; le ralentit et le tue si nécessaire.
export function damageEnemy(state, index, damage, slow) {
  const e = state.enemies[index];
  e.hp -= damage;
  if (slow > 0) e.slowTimer = SLOW_DURATION;
  if (e.hp <= 0) killEnemy(state, index);
}
