import { WAYPOINTS } from "../config/path.js";

// Définition d'un ennemi selon son type et les PV de base de la vague.
export function makeEnemyDef(kind, baseHp) {
  if (kind === "fast") {
    return { kind, hp: baseHp * 0.6, speed: 105, reward: 8, color: "#ffd43b", size: 9 };
  }
  if (kind === "tank") {
    return { kind, hp: baseHp * 3.2, speed: 42, reward: 25, color: "#c92a2a", size: 15 };
  }
  return { kind, hp: baseHp, speed: 65, reward: 10, color: "#e64980", size: 11 };
}

// Ajoute un ennemi à l'état, positionné au portail de départ.
export function spawnEnemy(state, def) {
  state.enemies.push({
    x: WAYPOINTS[0].x,
    y: WAYPOINTS[0].y,
    wp: 1, // index du prochain point de passage
    hp: def.hp,
    maxHp: def.hp,
    speed: def.speed,
    baseSpeed: def.speed,
    reward: def.reward,
    color: def.color,
    size: def.size,
    slowTimer: 0,
  });
}
