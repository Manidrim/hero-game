import { speedOf } from "../domain/state.js";
import { xpForLevel } from "../config/meta.js";
import { SPEED_LEVELS } from "../config/balance.js";

// Met à jour le HUD : euros, vies, vague, éliminations, niveau/XP, boutons.
export function syncHud(el, state) {
  el.money.textContent = Math.floor(state.money);
  el.lives.textContent = state.lives;
  el.wave.textContent = state.wave;
  el.kills.textContent = state.kills;
  el.level.textContent = state.meta.level;
  el.points.textContent = state.meta.points;
  el.xpfill.style.width = Math.min(100, (state.meta.xp / xpForLevel(state.meta.level)) * 100) + "%";

  el["start-wave"].disabled = state.waveActive || state.gameOver;
  el["start-wave"].textContent = state.waveActive
    ? "🌊 Vague " + state.wave + "…"
    : "▶ Vague " + (state.wave + 1);
  el.speed.textContent = "⚡ x" + speedOf(state) + " / x" + SPEED_LEVELS[SPEED_LEVELS.length - 1];
  el.pause.textContent = state.paused ? "▶" : "⏸";
  el.auto.checked = state.auto;
}
