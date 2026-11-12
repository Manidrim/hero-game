import { EFFECT_LIFE } from "../config/balance.js";

// Ajoute un effet visuel temporaire ("tracer" de tir ou "boom" d'élimination).
export function addEffect(state, kind, x, y, x2 = null, y2 = null) {
  state.effects.push({ kind, x, y, x2, y2, life: EFFECT_LIFE, maxLife: EFFECT_LIFE, r: 6, maxR: 22 });
}

// Fait vieillir les effets (et grossir les explosions) puis les retire.
export function updateEffects(state, dt) {
  for (const f of state.effects) {
    f.life -= dt;
    if (f.kind === "boom") f.r += (f.maxR - f.r) * dt * 8;
  }
  state.effects = state.effects.filter((f) => f.life > 0);
}
