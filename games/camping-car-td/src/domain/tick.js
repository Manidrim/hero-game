import { speedOf } from "./state.js";
import { advanceSpawns, finishWaveIfCleared, startWave } from "./waves.js";
import { updateEnemies } from "./enemy-movement.js";
import { updateTowers } from "./towers-fire.js";
import { updateEffects } from "./effects.js";
import { updateFloaters } from "./floaters.js";

// Avance la simulation d'un pas de temps `dt` (vitesse de jeu incluse).
// N'effectue aucune synchro DOM : c'est le rôle de la couche UI.
export function update(state, dt) {
  if (state.paused || state.gameOver) return;
  const step = dt * speedOf(state);
  advanceSpawns(state, step);
  updateTowers(state, step);
  updateEnemies(state, step);
  updateEffects(state, step);
  updateFloaters(state, step);
  finishWaveIfCleared(state);
  updateAuto(state, step);
}

// Relance automatique des vagues si l'option "auto" est cochée.
function updateAuto(state, dt) {
  if (state.waveActive || !state.auto || state.gameOver) return;
  state.autoTimer -= dt;
  if (state.autoTimer <= 0) startWave(state);
}
