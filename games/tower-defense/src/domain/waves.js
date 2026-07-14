import { makeEnemyDef, spawnEnemy } from "./enemy-factory.js";
import { addFloater } from "./floaters.js";
import { WIDTH } from "../config/grid.js";
import { SPAWN_INTERVAL, enemyCount, enemyBaseHp, waveReward } from "../config/balance.js";

// Lance la vague suivante : prépare la file d'apparition des ennemis.
export function startWave(state) {
  if (state.waveActive || state.gameOver) return;
  state.wave++;
  state.waveActive = true;

  const n = enemyCount(state.wave);
  const baseHp = enemyBaseHp(state.wave);
  const queue = [];
  for (let i = 0; i < n; i++) {
    queue.push(makeEnemyDef(enemyKind(state.wave, i), baseHp));
  }
  state.spawnQueue = queue;
  state.spawnTimer = 0;
}

// Type d'ennemi pour le i-ème d'une vague donnée.
function enemyKind(wave, i) {
  if (wave >= 3 && i % 5 === 0) return "tank";
  if (wave >= 2 && i % 3 === 0) return "fast";
  return "basic";
}

// Fait apparaître les ennemis de la file au rythme prévu.
export function advanceSpawns(state, dt) {
  if (!state.waveActive || state.spawnQueue.length === 0) return;
  state.spawnTimer -= dt;
  if (state.spawnTimer <= 0) {
    spawnEnemy(state, state.spawnQueue.shift());
    state.spawnTimer = SPAWN_INTERVAL;
  }
}

// Termine la vague quand tous les ennemis sont éliminés ; verse la prime.
export function finishWaveIfCleared(state) {
  if (state.waveActive && state.spawnQueue.length === 0 && state.enemies.length === 0) {
    state.waveActive = false;
    const reward = waveReward(state.wave);
    state.gold += reward;
    addFloater(state, WIDTH / 2, 40, "Vague terminée ! +" + reward + "💰", "#ffd43b");
  }
}
