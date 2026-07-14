import { distance } from "../math/geometry.js";

// Ennemi le plus proche de (x, y) dans la portée donnée, ou null.
export function nearestEnemy(enemies, x, y, range) {
  let best = null;
  let bestDist = range;
  for (const enemy of enemies) {
    const d = distance(enemy.x, enemy.y, x, y);
    if (d <= bestDist) {
      bestDist = d;
      best = enemy;
    }
  }
  return best ? { enemy: best, dist: bestDist } : null;
}
