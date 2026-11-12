import { listMaps } from "../domain/maps.js";
import { openModal } from "./modal.js";

// Modale de choix de carte : une carte par entrée, avec record et cadenas.
export function renderMapsModal(el, state) {
  openModal(el, "🗺️ Choisis ta carte", (body) => {
    const grid = document.createElement("div");
    grid.className = "map-grid";
    for (const map of listMaps(state)) {
      const best = state.meta.best[map.id] || 0;
      const card = document.createElement("button");
      card.className = "map-card" + (map.locked ? " locked" : "") + (state.mapId === map.id ? " current" : "");
      card.disabled = map.locked;
      card.innerHTML =
        '<div class="m-emoji">' + map.emoji + "</div>" +
        '<div class="m-name">' + map.name + "</div>" +
        '<div class="m-desc">' + map.desc + "</div>" +
        '<div class="m-best">Record : ' + (best > 0 ? "🌊 vague " + best : "—") + "</div>" +
        (map.locked ? '<div class="m-lock">Débloquée au niveau ' + map.unlock + " ⭐</div>" : "");
      if (!map.locked) {
        card.dataset.action = "pick-map";
        card.dataset.map = map.id;
      }
      grid.appendChild(card);
    }
    const wipe = document.createElement("button");
    wipe.className = "ghost small wipe";
    wipe.dataset.action = "wipe-meta";
    wipe.textContent = "🗑 Réinitialiser toute la progression";
    body.appendChild(grid);
    body.appendChild(wipe);
  });
}
