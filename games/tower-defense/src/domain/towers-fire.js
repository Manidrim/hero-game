import { getTowerStats } from "./tower-stats.js";
import { nearestEnemy } from "./targeting.js";
import { spawnBullet } from "./bullets.js";

// Fait tirer chaque tour prête sur l'ennemi le plus proche à portée.
export function updateTowers(state, dt) {
  for (const t of state.towers) {
    t.cooldown -= dt;
    if (t.cooldown > 0) continue;
    const s = getTowerStats(t);
    const target = nearestEnemy(state.enemies, t.x, t.y, s.range);
    if (target) {
      spawnBullet(state, t.x, t.y, target.enemy, s.damage, s.bullet, s.splash, s.slow);
      t.cooldown = s.fireRate;
    }
  }
}
