import { createState, resetState } from "./domain/state.js";
import { update } from "./domain/tick.js";
import { startWave } from "./domain/waves.js";
import { draw } from "./render/scene.js";
import { queryElements } from "./ui/elements.js";
import { syncHud } from "./ui/hud.js";
import { syncShop } from "./ui/shop.js";
import { syncInspector } from "./ui/inspector.js";
import { syncWaveInfo } from "./ui/wave-info.js";
import { syncOverlay } from "./ui/overlay.js";
import { drainNotifications } from "./ui/toasts.js";
import { closeModal, isModalOpen } from "./ui/modal.js";
import { bindKeyboard } from "./input/keyboard.js";
import { bindMouse } from "./input/mouse.js";
import { bindControls } from "./input/controls.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const el = queryElements();
const state = createState();

// Recommence une partie sur une carte donnée (méta conservée).
function reset(mapId) {
  resetState(state, mapId);
}

const actions = {
  reset,
  startWave: () => startWave(state),
  togglePause: () => {
    state.paused = !state.paused;
  },
  isModalOpen: () => isModalOpen(el),
  closeModal: () => closeModal(el),
};

// Synchronise toute la couche UI (DOM) avec l'état courant.
function syncUI() {
  syncHud(el, state);
  syncShop(el, state);
  syncInspector(el, state);
  syncWaveInfo(el, state);
  syncOverlay(el, state);
  drainNotifications(el, state);
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  update(state, dt);
  draw(ctx, state);
  syncUI();
  requestAnimationFrame(loop);
}

bindKeyboard(state, actions);
bindMouse(canvas, state);
bindControls(el, state, actions);
requestAnimationFrame(loop);
