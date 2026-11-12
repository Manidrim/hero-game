import { VEHICLE_TYPES, upgradeCost } from "../config/vehicles.js";
import { MAX_VEHICLE_LEVEL } from "../config/balance.js";
import { towerById } from "../domain/vehicles-build.js";
import { vehicleStats } from "../domain/vehicle-stats.js";
import { canUpgrade, sellValue } from "../domain/vehicles-upgrade.js";

// Synchronise le panneau d'inspection du véhicule sélectionné.
export function syncInspector(el, state) {
  const tower = towerById(state, state.selectedId);
  const sig = state.selectedId + "|" + (tower ? tower.level : 0) + "|" + (tower ? canUpgrade(state, tower) : 0);
  if (el._inspSig === sig) return;
  el._inspSig = sig;
  if (!tower) {
    el.inspector.innerHTML = '<p class="hint">Clique sur un véhicule posé pour l\'améliorer ou le revendre.</p>';
    return;
  }
  const def = VEHICLE_TYPES[tower.type];
  const stats = vehicleStats(state, tower);
  const maxed = tower.level >= MAX_VEHICLE_LEVEL;
  const upCost = maxed ? 0 : upgradeCost(def, tower.level);
  const rows = [];
  if (stats.damage > 0) rows.push(["⚔ Dégâts", Math.round(stats.damage * 10) / 10]);
  if (stats.range > 0) rows.push(["🎯 Portée", stats.range.toFixed(1) + " cases"]);
  if (stats.fireRate > 0) rows.push(["⚡ Cadence", stats.fireRate.toFixed(2) + "/s"]);
  if (stats.income > 0) rows.push(["💰 Revenu", "+" + stats.income.toFixed(1) + "€/s"]);
  if (stats.slow > 0) rows.push(["🧊 Ralentissement", Math.round(stats.slow * 100) + "%"]);
  el.inspector.innerHTML =
    '<div class="veh-head"><span class="ic">' + def.emoji + "</span>" +
    '<div><div class="nm">' + def.name + '</div>' +
    '<div class="lvl">Niveau ' + tower.level + " / " + MAX_VEHICLE_LEVEL + "</div></div></div>" +
    rows.map((r) => '<div class="row"><span>' + r[0] + '</span><b>' + r[1] + "</b></div>").join("") +
    '<div class="row"><span>💵 Investi</span><b>' + tower.invested + "€</b></div>" +
    '<div class="btnrow">' +
    '<button class="primary" data-action="upgrade" data-id="' + tower.id + '"' +
    (maxed || state.money < upCost ? " disabled" : "") + ">" +
    (maxed ? "⭐ MAX" : "⬆ " + upCost + "€") + "</button>" +
    '<button class="ghost" data-action="sell" data-id="' + tower.id + '">💸 ' + sellValue(tower) + "€</button>" +
    "</div>";
}
