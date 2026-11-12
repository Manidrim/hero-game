import { WIDTH } from "../config/grid.js";
import { FINAL_WAVE, AUTO_WAVE_DELAY } from "../config/balance.js";
import { waveQueue, waveReward, isBossWave } from "../config/waves.js";
import { spawnEnemy } from "./enemy-factory.js";
import { addFloater } from "./floaters.js";
import { addXp, unlockAchievement, gainsMultiplier, recordBestWave } from "./meta.js";

// Lance la vague suivante : prépare la file d'apparition des ennemis.
export function startWave(state) {
  if (state.waveActive || state.gameOver) return false;
  state.wave++;
  state.waveActive = true;
  state.spawnQueue = waveQueue(state.wave);
  state.spawnTimer = 0;
  recordBestWave(state);
  state.notifications.push({
    kind: "banner",
    text: isBossWave(state.wave)
      ? "🚌 Vague " + state.wave + " — BOSS !"
      : "🌊 Vague " + state.wave,
  });
  return true;
}

// Fait apparaître les ennemis de la file au rythme prévu.
export function advanceSpawns(state, dt) {
  if (!state.waveActive || state.spawnQueue.length === 0) return;
  state.spawnTimer += dt;
  while (state.spawnQueue.length && state.spawnQueue[0].at <= state.spawnTimer) {
    spawnEnemy(state, state.spawnQueue.shift().kind);
  }
}

// Termine la vague quand tout est nettoyé : prime, XP, succès, record,
// notification de victoire à la fin de campagne, et relance auto.
export function finishWaveIfCleared(state) {
  if (!state.waveActive || state.spawnQueue.length > 0 || state.enemies.length > 0) return;
  state.waveActive = false;
  const reward = Math.round(waveReward(state.wave) * gainsMultiplier(state));
  state.money += reward;
  state.meta.totalEarned += reward;
  addXp(state, state.wave * 3);
  addFloater(state, WIDTH / 2, 40, "Vague " + state.wave + " terminée ! +" + reward + "€", "#ffd43b");
  if (state.wave >= 10) unlockAchievement(state, "vague10");
  if (state.wave >= 25) unlockAchievement(state, "vague25");
  if (state.wave >= 50) unlockAchievement(state, "vague50");
  if (state.wave >= FINAL_WAVE) {
    unlockAchievement(state, "conquerant");
    if (!state.victoryNotified) {
      state.victoryNotified = true;
      state.notifications.push({ kind: "victory" });
    }
  }
  recordBestWave(state);
  if (state.auto) state.autoTimer = AUTO_WAVE_DELAY;
}
