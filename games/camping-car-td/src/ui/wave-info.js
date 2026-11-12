import { ENEMY_TYPES } from "../config/enemies.js";
import { wavePreview } from "../config/waves.js";

// Synchronise l'aperçu de la prochaine vague (effectifs par type d'ennemi).
export function syncWaveInfo(el, state) {
  const sig = String(state.wave) + "|" + state.gameOver;
  if (el._waveSig === sig) return;
  el._waveSig = sig;
  const counts = wavePreview(state.wave + 1);
  const entries = Object.entries(counts);
  el["wave-info"].innerHTML = entries.length
    ? entries
        .map(([kind, n]) => {
          const def = ENEMY_TYPES[kind];
          return '<div class="row"><span>' + def.emoji + " " + def.name + "</span><b>x" + n + "</b></div>";
        })
        .join("")
    : '<span class="hint">—</span>';
}
