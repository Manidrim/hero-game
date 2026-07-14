import { distance } from "../math/geometry.js";
import { DEFAULT_BULLET_SPEED } from "../config/balance.js";
import { damageEnemy } from "./enemy-damage.js";

// Crée un projectile ciblant un ennemi. `source` identifie l'auteur du tir
// (ex. { type: "hero", weapon }) pour attribuer les éliminations.
export function spawnBullet(state, x, y, target, damage, color, splash, slow, speed = DEFAULT_BULLET_SPEED, source = null) {
  state.bullets.push({ x, y, target, damage, color, splash, slow, speed, source });
}

// Fait avancer les projectiles et résout les impacts.
export function updateBullets(state, dt) {
  for (let i = state.bullets.length - 1; i >= 0; i--) {
    const b = state.bullets[i];

    // La cible est morte : le projectile disparaît.
    if (!state.enemies.includes(b.target)) {
      state.bullets.splice(i, 1);
      continue;
    }

    const dx = b.target.x - b.x;
    const dy = b.target.y - b.y;
    const dist = Math.hypot(dx, dy);
    const step = b.speed * dt;

    if (dist <= step + b.target.size) {
      applyHit(state, b);
      state.bullets.splice(i, 1);
    } else {
      b.x += (dx / dist) * step;
      b.y += (dy / dist) * step;
    }
  }
}

// Applique les dégâts d'un projectile : zone (splash) ou cible unique.
export function applyHit(state, b) {
  if (b.splash > 0) {
    for (let i = state.enemies.length - 1; i >= 0; i--) {
      const e = state.enemies[i];
      if (distance(e.x, e.y, b.target.x, b.target.y) <= b.splash) {
        damageEnemy(state, i, b.damage, b.slow, b.source);
      }
    }
  } else {
    const idx = state.enemies.indexOf(b.target);
    if (idx !== -1) damageEnemy(state, idx, b.damage, b.slow, b.source);
  }
}
