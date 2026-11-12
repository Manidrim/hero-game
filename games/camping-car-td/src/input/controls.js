import { SPEED_LEVELS } from "../config/balance.js";
import { selectVehicle } from "../domain/vehicles-build.js";
import { upgradeVehicle, sellVehicle } from "../domain/vehicles-upgrade.js";
import { spendTalentPoint } from "../domain/meta.js";
import { selectMap } from "../domain/maps.js";
import { wipeMeta, saveMeta } from "../domain/persistence.js";
import { closeModal } from "../ui/modal.js";
import { renderMapsModal } from "../ui/maps-modal.js";
import { renderTalentsModal } from "../ui/talents-modal.js";
import { renderAchievementsModal } from "../ui/achievements-modal.js";
import { renderHelpModal } from "../ui/help-modal.js";

// Câble tous les boutons et clics délégués (boutique, panneau, modales).
export function bindControls(el, state, actions) {
  el["start-wave"].addEventListener("click", () => actions.startWave());
  el.speed.addEventListener("click", () => cycleSpeed(state));
  el.pause.addEventListener("click", () => actions.togglePause());
  el.auto.addEventListener("change", (evt) => {
    state.auto = evt.target.checked;
  });
  el.maps.addEventListener("click", () => renderMapsModal(el, state));
  el.talents.addEventListener("click", () => renderTalentsModal(el, state));
  el.achievements.addEventListener("click", () => renderAchievementsModal(el, state));
  el.help.addEventListener("click", () => renderHelpModal(el));
  el.reset.addEventListener("click", () => actions.reset());
  el["overlay-retry"].addEventListener("click", () => actions.reset());
  el["overlay-maps"].addEventListener("click", () => renderMapsModal(el, state));
  el["modal-close"].addEventListener("click", () => closeModal(el));
  el["modal-backdrop"].addEventListener("click", (evt) => {
    if (evt.target === el["modal-backdrop"]) closeModal(el);
  });
  el["shop-list"].addEventListener("click", (evt) => {
    const card = evt.target.closest(".shop-card");
    if (card && !card.classList.contains("locked")) selectVehicle(state, card.dataset.type);
  });
  el.inspector.addEventListener("click", (evt) => {
    const btn = evt.target.closest("[data-action]");
    if (!btn || btn.disabled) return;
    if (btn.dataset.action === "upgrade") upgradeVehicle(state, Number(btn.dataset.id));
    if (btn.dataset.action === "sell") sellVehicle(state, Number(btn.dataset.id));
  });
  el["modal-body"].addEventListener("click", (evt) => onModalAction(evt, el, state, actions));
}

// Monte d'un cran la vitesse de jeu (x1 → x2 → x3 → x1), sauvegardée.
function cycleSpeed(state) {
  state.speedIndex = (state.speedIndex + 1) % SPEED_LEVELS.length;
  state.meta.speedIndex = state.speedIndex;
  saveMeta(state.meta);
}

// Actions déléguées dans le corps de la modale (cartes, talents, divers).
function onModalAction(evt, el, state, actions) {
  const btn = evt.target.closest("[data-action]");
  if (!btn || btn.disabled) return;
  const action = btn.dataset.action;
  if (action === "pick-map") {
    selectMap(state, btn.dataset.map);
    closeModal(el);
    actions.reset(btn.dataset.map);
  } else if (action === "talent") {
    spendTalentPoint(state, btn.dataset.talent);
    renderTalentsModal(el, state);
  } else if (action === "close-modal") {
    closeModal(el);
  } else if (action === "wipe-meta") {
    if (window.confirm("Effacer toute la progression (niveau, talents, succès, records) ?")) {
      state.meta = wipeMeta();
      closeModal(el);
      actions.reset();
    }
  }
}
