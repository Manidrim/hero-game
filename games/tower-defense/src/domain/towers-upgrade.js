import { UPGRADE_RADIUS, MAX_TOWER_LEVEL } from "../config/towers.js";
import { distance } from "../math/geometry.js";
import { upgradeCost } from "./tower-stats.js";
import { addFloater } from "./floaters.js";

// Tours à portée du héros (améliorables), triées par distance croissante.
export function nearbyTowers(state) {
  const h = state.hero;
  return state.towers
    .map((t) => ({ t, dist: distance(t.x, t.y, h.x, h.y) }))
    .filter((o) => o.dist <= UPGRADE_RADIUS)
    .sort((a, b) => a.dist - b.dist)
    .map((o) => o.t);
}

// Améliore une tour si le héros a assez d'or et qu'elle n'est pas au max.
export function upgradeTower(state, id) {
  const t = state.towers.find((x) => x.id === id);
  if (!t || t.level >= MAX_TOWER_LEVEL) return;
  const cost = upgradeCost(t);
  if (state.gold < cost) {
    addFloater(state, t.x, t.y, "Pas assez d'or", "#ff6b6b");
    return;
  }
  state.gold -= cost;
  t.level++;
  addFloater(state, t.x, t.y - 20, "Niveau " + t.level, "#63e6be");
  state.panelSig = null; // force la reconstruction du panneau
}
