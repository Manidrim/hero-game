import { findMap } from "../config/maps.js";

// Affiche ou masque l'overlay de fin de partie (défaite) selon l'état.
export function syncOverlay(el, state) {
  if (!state.gameOver) {
    el.overlay.classList.add("hidden");
    return;
  }
  el.overlay.classList.remove("hidden");
  const map = findMap(state.mapId);
  el["overlay-title"].textContent = "💥 Partie terminée";
  el["overlay-text"].textContent =
    "Les vacanciers ont investi ton camping " + map.emoji + " à la vague " + state.wave +
    " (" + state.kills + " éliminations, niveau " + state.meta.level + ").";
  el["overlay-retry"].textContent = "🔁 Rejouer";
  el["overlay-maps"].textContent = "🗺️ Changer de carte";
}
