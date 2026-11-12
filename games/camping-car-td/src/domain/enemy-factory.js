import { ENEMY_TYPES } from "../config/enemies.js";
import { hpMultiplier, bountyFor } from "../config/waves.js";

// Fait apparaître un ennemi du type `kind` à l'entrée du chemin de la carte.
export function spawnEnemy(state, kind) {
  const def = ENEMY_TYPES[kind];
  let hp = def.hp * hpMultiplier(state.wave);
  if (def.boss) hp *= 1 + 0.3 * (state.wave / 10 - 1);
  hp = Math.round(hp);
  const start = state.waypoints[0];
  const baseSpeed = def.speed * (0.95 + Math.random() * 0.1);
  state.enemies.push({
    id: state.nextEnemyId++,
    kind,
    def,
    x: start.x,
    y: start.y,
    wp: 1, // index du prochain point de passage
    hp,
    maxHp: hp,
    baseSpeed,
    speed: baseSpeed,
    bounty: bountyFor(def, state.wave),
    xp: def.xp,
    dist: 0, // distance parcourue (pour viser l'ennemi le plus avancé)
    slowFactor: 0,
    slowTimer: 0,
    hitFlash: 0,
  });
}
