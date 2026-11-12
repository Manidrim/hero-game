import { distance } from "../math/geometry.js";

// Ennemi le plus avancé (distance parcourue maximale) dans la portée autour
// de (x, y), ou null. C'est la cible prioritaire des véhicules.
export function furthestEnemy(enemies, x, y, range) {
  let best = null;
  let bestDist = -1;
  for (const e of enemies) {
    if (distance(e.x, e.y, x, y) <= range && e.dist > bestDist) {
      best = e;
      bestDist = e.dist;
    }
  }
  return best;
}
