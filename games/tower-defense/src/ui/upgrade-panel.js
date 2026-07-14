import { TOWER_TYPES, MAX_TOWER_LEVEL } from "../config/towers.js";
import { getTowerStats, upgradeCost } from "../domain/tower-stats.js";
import { nearbyTowers } from "../domain/towers-upgrade.js";

// Reconstruit le panneau des tours à proximité (uniquement si l'état a changé).
export function refreshUpgradePanel(el, state) {
  const list = nearbyTowers(state);
  const sig = panelSignature(list, state);
  if (sig === state.panelSig) return;
  state.panelSig = sig;

  if (list.length === 0) {
    el.nearbyTowers.innerHTML = "";
    el.nearbyHint.style.display = "";
    return;
  }
  el.nearbyHint.style.display = "none";
  el.nearbyTowers.innerHTML = list.map((t) => towerRow(t, state)).join("");
}

// Signature du panneau : évite de reconstruire le DOM inutilement.
function panelSignature(list, state) {
  return list
    .map((t) => {
      const maxed = t.level >= MAX_TOWER_LEVEL;
      const afford = !maxed && state.gold >= upgradeCost(t);
      return t.id + ":" + t.level + ":" + (maxed ? "m" : afford ? "1" : "0");
    })
    .join("|");
}

// Fragment HTML d'une ligne de tour améliorable.
function towerRow(t, state) {
  const def = TOWER_TYPES[t.type];
  const s = getTowerStats(t);
  const maxed = t.level >= MAX_TOWER_LEVEL;
  const cost = maxed ? 0 : upgradeCost(t);
  const afford = !maxed && state.gold >= cost;
  const btn = maxed
    ? `<button class="tr-up maxed" disabled>Max</button>`
    : `<button class="tr-up" data-id="${t.id}" ${afford ? "" : "disabled"}>+ ${cost}💰</button>`;
  return `
    <div class="tower-row">
      <span class="tr-emoji">${def.emoji}</span>
      <div class="tr-info">
        <div class="tr-name">${def.name} <span class="tr-lvl">Niv. ${t.level}/${MAX_TOWER_LEVEL}</span></div>
        <div class="tr-stats">Dég. ${Math.round(s.damage)} · Portée ${Math.round(s.range)}</div>
      </div>
      ${btn}
    </div>`;
}
