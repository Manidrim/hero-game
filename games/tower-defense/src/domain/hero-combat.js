import { weaponStats } from "./weapon-stats.js";
import { nearestEnemy } from "./targeting.js";
import { spawnBullet } from "./bullets.js";

// Régénération, cooldown de changement d'arme et tir automatique du héros.
export function updateHeroCombat(state, dt) {
  const h = state.hero;

  if (h.hp < h.maxHp) h.hp = Math.min(h.maxHp, h.hp + h.regen * dt);
  if (h.switchCd > 0) h.switchCd = Math.max(0, h.switchCd - dt);

  h.cooldown -= dt;
  if (h.cooldown <= 0) {
    const ws = weaponStats(h);
    const target = nearestEnemy(state.enemies, h.x, h.y, ws.range);
    if (target) {
      spawnBullet(state, h.x, h.y, target.enemy, ws.damage, ws.bullet, ws.splash, 0, ws.bulletSpeed);
      h.cooldown = ws.fireRate;
    }
  }
}
