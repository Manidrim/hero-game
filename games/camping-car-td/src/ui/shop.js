import { VEHICLE_TYPES } from "../config/vehicles.js";

// Construit une ligne de stats pour une carte de véhicule.
function statLine(def) {
  if (def.income) return "💰 +" + def.income + "€/s";
  if (def.slow) return "🧊 ralenti " + Math.round(def.slow * 100) + "%";
  return "⚔" + def.damage + " 🎯" + def.range + " ⚡" + def.fireRate + "/s";
}

// Synchronise la boutique : reconstruction quand la structure change (niveau,
// sélection), puis simple mise à jour de l'abordabilité à chaque frame.
export function syncShop(el, state) {
  const sig = state.placing + "|" + state.meta.level;
  if (el._shopSig !== sig) {
    el._shopSig = sig;
    buildShop(el, state);
  }
  for (const entry of el._shopCards) {
    entry.card.classList.toggle("poor", !entry.locked && state.money < entry.def.cost);
    entry.card.classList.toggle("selected", state.placing === entry.def.id);
  }
}

function buildShop(el, state) {
  el["shop-list"].innerHTML = "";
  el._shopCards = [];
  for (const [id, def] of Object.entries(VEHICLE_TYPES)) {
    const locked = state.meta.level < def.unlock;
    const card = document.createElement("button");
    card.className = "shop-card" + (locked ? " locked" : "");
    card.dataset.type = id;
    card.innerHTML =
      '<span class="ic">' + def.emoji + "</span>" +
      '<span class="nm">' + def.name + "</span>" +
      '<span class="st">' + (locked ? "Débloqué niv. " + def.unlock : statLine(def) + " — " + def.desc) + "</span>" +
      '<span class="pr">' + (locked ? "🔒" : def.cost + " €") + "</span>";
    el["shop-list"].appendChild(card);
    el._shopCards.push({ def: { id, ...def }, card, locked });
  }
}
