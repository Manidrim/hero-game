import { weaponStats } from "../domain/weapon-stats.js";

// Met à jour le HUD : or, vies, vague et statistiques du héros.
export function syncHud(el, state) {
  el.gold.textContent = state.gold;
  el.lives.textContent = state.lives;
  el.wave.textContent = state.wave;

  const h = state.hero;
  el.heroLevel.textContent = h.level;
  el.heroXpFill.style.width = Math.min(100, (h.xp / h.xpNext) * 100) + "%";

  const ws = weaponStats(h);
  el.heroDmg.textContent = Math.round(ws.damage);
  el.heroRange.textContent = Math.round(ws.range);
  el.heroHp.textContent = Math.round(h.hp) + "/" + h.maxHp;
  el.startWave.disabled = state.waveActive || state.gameOver;
}
