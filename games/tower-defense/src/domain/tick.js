import { advanceSpawns, finishWaveIfCleared } from "./waves.js";
import { updateEnemies } from "./enemy-movement.js";
import { moveHero } from "./hero-movement.js";
import { updateHeroCombat } from "./hero-combat.js";
import { updateTowers } from "./towers-fire.js";
import { updateBullets } from "./bullets.js";
import { updateFloaters } from "./floaters.js";

// Avance la simulation d'un pas de temps `dt`. `moveVector` provient de l'input
// clavier. N'effectue aucune synchro DOM : c'est le rôle de la couche UI.
export function update(state, dt, moveVector) {
  if (state.gameOver) return;

  advanceSpawns(state, dt);
  updateEnemies(state, dt);
  moveHero(state, dt, moveVector);
  updateHeroCombat(state, dt);
  updateTowers(state, dt);
  updateBullets(state, dt);
  updateFloaters(state, dt);
  finishWaveIfCleared(state);
}
