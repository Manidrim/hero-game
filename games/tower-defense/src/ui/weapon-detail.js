import { WEAPONS } from "../config/weapons.js";
import { weaponStats, weaponMultiplier } from "../domain/weapon-stats.js";

// Synchronise le panneau de l'arme équipée : multiplicateur, cadence, points
// disponibles et disponibilité des boutons de répartition.
export function updateWeaponDetail(el, state) {
  const h = state.hero;
  const def = WEAPONS[h.weapon];
  const w = h.weapons[h.weapon];
  const ws = weaponStats(h);
  el.wdName.textContent = def.emoji + " " + def.name;
  el.wdLevel.textContent = "Niv. " + w.level;
  el.wdXpFill.style.width = Math.min(100, (w.xp / w.xpNext) * 100) + "%";
  el.wdMult.textContent = "×" + weaponMultiplier(w).toFixed(1);
  el.wdRate.textContent = (1 / ws.fireRate).toFixed(1) + "/s";
  el.wdPoints.textContent = w.points;
  el.weaponDetail.classList.toggle("has-points", w.points > 0 || h.weaponPoints > 0);
  el.allocMult.disabled = w.points <= 0;
  el.allocSpeed.disabled = w.points <= 0;
  el.wdHeroPoints.textContent = h.weaponPoints;
  el.grantLevel.disabled = h.weaponPoints <= 0;
}
