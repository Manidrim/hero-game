import { WIDTH, HEIGHT } from "../config/grid.js";
import { clamp } from "../math/geometry.js";

// Déplace le héros : priorité au clavier (moveVector non nul), sinon
// déplacement vers la cible souris.
export function moveHero(state, dt, moveVector) {
  const h = state.hero;
  if (moveVector.x !== 0 || moveVector.y !== 0) {
    moveByKeyboard(h, dt, moveVector);
  } else {
    moveToTarget(h, dt);
  }
}

function moveByKeyboard(h, dt, move) {
  const len = Math.hypot(move.x, move.y);
  h.x = clamp(h.x + (move.x / len) * h.speed * dt, 0, WIDTH);
  h.y = clamp(h.y + (move.y / len) * h.speed * dt, 0, HEIGHT);
  // On synchronise la cible souris pour que le héros ne soit pas rappelé.
  h.tx = h.x;
  h.ty = h.y;
}

function moveToTarget(h, dt) {
  const dx = h.tx - h.x;
  const dy = h.ty - h.y;
  const dist = Math.hypot(dx, dy);
  if (dist > 1) {
    const step = Math.min(dist, h.speed * dt);
    h.x += (dx / dist) * step;
    h.y += (dy / dist) * step;
  }
}
