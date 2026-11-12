import { TILE } from "../config/grid.js";
import { VEHICLE_TYPES } from "../config/vehicles.js";
import { distance } from "../math/geometry.js";
import { vehicleStats } from "./vehicle-stats.js";
import { furthestEnemy } from "./targeting.js";
import { damageEnemy } from "./enemy-damage.js";
import { addEffect } from "./effects.js";

// Fait agir tous les véhicules posés : revenus, auras de ralentissement, tirs.
export function updateTowers(state, dt) {
  for (const tower of state.towers) {
    const def = VEHICLE_TYPES[tower.type];
    const stats = vehicleStats(state, tower);
    if (stats.income > 0) earnIncome(state, stats.income * dt);
    if (def.slow) applySlowAura(state, tower, stats);
    else if (stats.damage > 0) fireAt(state, tower, stats, dt);
    if (tower.flash > 0) tower.flash -= dt;
  }
}

// Le food truck rapporte de l'argent en continu.
function earnIncome(state, amount) {
  state.money += amount;
  state.meta.totalEarned += amount;
}

// Le bivouac ralentit tous les ennemis dans sa portée.
function applySlowAura(state, tower, stats) {
  const rangePx = stats.range * TILE;
  for (const e of state.enemies) {
    if (distance(e.x, e.y, tower.x, tower.y) <= rangePx) {
      e.slowFactor = Math.max(e.slowFactor, stats.slow);
      e.slowTimer = 0.25;
    }
  }
}

// Tir sur l'ennemi le plus avancé dans la portée, quand le cooldown est fini.
function fireAt(state, tower, stats, dt) {
  tower.cooldown -= dt;
  if (tower.cooldown > 0) return;
  const target = furthestEnemy(state.enemies, tower.x, tower.y, stats.range * TILE);
  if (!target) {
    tower.cooldown = Math.min(tower.cooldown + 0.05, 0.1);
    return;
  }
  tower.cooldown = 1 / stats.fireRate;
  tower.flash = 0.08;
  damageEnemy(state, target, stats.damage);
  addEffect(state, "tracer", tower.x, tower.y - 8, target.x, target.y);
}
