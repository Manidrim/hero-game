import { ACHIEVEMENTS } from "../config/meta.js";
import { openModal } from "./modal.js";

// Modale des succès : liste complète, débloqués mis en évidence.
export function renderAchievementsModal(el, state) {
  const done = new Set(state.meta.achievements);
  openModal(el, "🏆 Succès (" + done.size + "/" + ACHIEVEMENTS.length + ")", (body) => {
    const list = document.createElement("div");
    for (const a of ACHIEVEMENTS) {
      const isDone = done.has(a.id);
      const row = document.createElement("div");
      row.className = "ach" + (isDone ? " done" : " locked");
      row.innerHTML =
        '<span class="a-emoji">' + a.emoji + "</span>" +
        '<span><span class="a-name">' + a.name + "</span>" +
        '<span class="a-desc">' + a.desc + "</span></span>" +
        '<span class="a-reward">' + (isDone ? "✔ +" + a.points + "🌳" : "🔒") + "</span>";
      list.appendChild(row);
    }
    body.appendChild(list);
  });
}
