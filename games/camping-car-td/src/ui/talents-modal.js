import { TALENTS } from "../config/meta.js";
import { openModal } from "./modal.js";

// Modale de l'arbre de talents : un bloc par talent, avec rangs et bouton.
export function renderTalentsModal(el, state) {
  openModal(el, "🌳 Arbre de talents — " + state.meta.points + " point(s)", (body) => {
    const grid = document.createElement("div");
    grid.className = "talent-grid";
    for (const t of TALENTS) {
      const rank = state.meta.talents[t.id] || 0;
      const maxed = rank >= t.max;
      const card = document.createElement("div");
      card.className = "talent";
      card.innerHTML =
        '<div class="t-head"><span class="t-name">' + t.emoji + " " + t.name + "</span>" +
        '<span class="t-ranks">' + "●".repeat(rank) + "○".repeat(t.max - rank) + "</span></div>" +
        '<div class="t-desc">' + t.desc + "</div>" +
        '<button class="primary" data-action="talent" data-talent="' + t.id + '"' +
        (maxed || state.meta.points <= 0 ? " disabled" : "") + ">" +
        (maxed ? "MAX" : "+1 rang (1🌳)") + "</button>";
      grid.appendChild(card);
    }
    body.appendChild(grid);
  });
}
