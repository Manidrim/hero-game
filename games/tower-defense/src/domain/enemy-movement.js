import { WAYPOINTS } from "../config/path.js";
import { WIDTH, HEIGHT } from "../config/grid.js";
import { ENEMY_SLOW_FACTOR } from "../config/balance.js";
import { addFloater } from "./floaters.js";
import { endGame } from "./game-over.js";

// Fait avancer les ennemis le long du chemin ; gère le ralentissement.
export function updateEnemies(state, dt) {
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const e = state.enemies[i];
    applySlow(e, dt);

    const target = WAYPOINTS[e.wp];
    if (!target) { reachBase(state, i); continue; }

    const dx = target.x - e.x;
    const dy = target.y - e.y;
    const dist = Math.hypot(dx, dy);
    const step = e.speed * dt;

    if (dist <= step) {
      e.x = target.x;
      e.y = target.y;
      e.wp++;
      if (e.wp >= WAYPOINTS.length) reachBase(state, i);
    } else {
      e.x += (dx / dist) * step;
      e.y += (dy / dist) * step;
    }
  }
}

function applySlow(e, dt) {
  if (e.slowTimer > 0) {
    e.slowTimer -= dt;
    e.speed = e.baseSpeed * (e.slowTimer > 0 ? ENEMY_SLOW_FACTOR : 1);
  } else {
    e.speed = e.baseSpeed;
  }
}

// Un ennemi atteint la base : perte d'une vie, fin de partie si plus de vies.
function reachBase(state, index) {
  state.enemies.splice(index, 1);
  state.lives--;
  addFloater(state, WIDTH - 30, HEIGHT - 40, "-1 ❤️", "#ff6b6b");
  if (state.lives <= 0) {
    state.lives = 0;
    endGame(state, false);
  }
}
