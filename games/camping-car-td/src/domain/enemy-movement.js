import { WIDTH, HEIGHT } from "../config/grid.js";
import { addFloater } from "./floaters.js";
import { endGame } from "./game-over.js";

// Fait avancer les ennemis le long du chemin ; gère ralentissement, flash de
// touche et fuites en bout de parcours.
export function updateEnemies(state, dt) {
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const e = state.enemies[i];
    updateSlow(e, dt);
    if (e.hitFlash > 0) e.hitFlash -= dt;
    let remaining = e.speed * dt;
    while (remaining > 0 && e.wp < state.waypoints.length) {
      const target = state.waypoints[e.wp];
      const dx = target.x - e.x;
      const dy = target.y - e.y;
      const d = Math.hypot(dx, dy);
      if (d <= remaining) {
        e.x = target.x;
        e.y = target.y;
        e.dist += d;
        e.wp++;
        remaining -= d;
      } else {
        e.x += (dx / d) * remaining;
        e.y += (dy / d) * remaining;
        e.dist += remaining;
        remaining = 0;
      }
    }
    if (e.wp >= state.waypoints.length) reachBase(state, i);
  }
}

function updateSlow(e, dt) {
  if (e.slowTimer > 0) {
    e.slowTimer -= dt;
    e.speed = e.slowTimer > 0 ? e.baseSpeed * (1 - e.slowFactor) : e.baseSpeed;
  } else {
    e.speed = e.baseSpeed;
  }
}

// Un ennemi atteint la base : perte de vies, fin de partie si plus de vies.
function reachBase(state, index) {
  const e = state.enemies[index];
  state.enemies.splice(index, 1);
  state.lives -= e.def.leak;
  addFloater(state, WIDTH - 40, HEIGHT - 40, "-" + e.def.leak + " ❤️", "#ff6b6b");
  if (state.lives <= 0) {
    state.lives = 0;
    endGame(state, false);
  }
}
