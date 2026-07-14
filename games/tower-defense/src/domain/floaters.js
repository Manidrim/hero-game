import { FLOATER_LIFE, FLOATER_RISE } from "../config/balance.js";

// Ajoute un texte flottant (or gagné, level up, avertissement…).
export function addFloater(state, x, y, text, color) {
  state.floaters.push({ x, y, text, color, life: FLOATER_LIFE });
}

// Fait monter et disparaître progressivement les textes flottants.
export function updateFloaters(state, dt) {
  for (let i = state.floaters.length - 1; i >= 0; i--) {
    const f = state.floaters[i];
    f.y -= FLOATER_RISE * dt;
    f.life -= dt;
    if (f.life <= 0) state.floaters.splice(i, 1);
  }
}
