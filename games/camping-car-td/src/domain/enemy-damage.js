import { addFloater } from "./floaters.js";
import { addEffect } from "./effects.js";
import { addXp, unlockAchievement, gainsMultiplier } from "./meta.js";

// Inflige des dégâts à un ennemi ; l'élimine si ses PV tombent à 0.
export function damageEnemy(state, enemy, amount) {
  enemy.hp -= amount;
  enemy.hitFlash = 0.12;
  if (enemy.hp <= 0) killEnemy(state, enemy);
}

// Élimination : prime, XP, compteurs de méta et succès.
function killEnemy(state, enemy) {
  state.enemies = state.enemies.filter((e) => e !== enemy);
  state.kills++;
  state.meta.totalKills++;
  const gain = Math.round(enemy.bounty * gainsMultiplier(state));
  state.money += gain;
  state.meta.totalEarned += gain;
  addXp(state, enemy.xp);
  addFloater(state, enemy.x, enemy.y - 14, "+" + gain + "€", "#ffd43b");
  addEffect(state, "boom", enemy.x, enemy.y);
  if (enemy.def.boss) {
    unlockAchievement(state, "boss");
    state.notifications.push({ kind: "toast", text: "🚌 Boss vaincu !", cls: "gold" });
  }
  unlockAchievement(state, "first_blood");
  if (state.meta.totalKills >= 100) unlockAchievement(state, "cent");
  if (state.meta.totalKills >= 1000) unlockAchievement(state, "mille");
  if (state.meta.totalEarned >= 5000) unlockAchievement(state, "riche");
}
