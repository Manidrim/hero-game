import { createState, resetState } from "./domain/state.js";
import { update } from "./domain/tick.js";
import { draw } from "./render/scene.js";
import { queryElements } from "./ui/elements.js";
import { syncHud } from "./ui/hud.js";
import { updateWeaponUI } from "./ui/weapons.js";
import { updateWeaponDetail } from "./ui/weapon-detail.js";
import { refreshUpgradePanel } from "./ui/upgrade-panel.js";
import { syncBuildButtons } from "./ui/build-buttons.js";
import { syncOverlay } from "./ui/overlay.js";
import { bindKeyboard, readMoveVector } from "./input/keyboard.js";
import { bindMouse } from "./input/mouse.js";
import { bindControls } from "./input/controls.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const el = queryElements();
const state = createState();

// Recommence une partie en repartant d'un état neuf.
function reset() {
  resetState(state);
  el.nearbyTowers.innerHTML = "";
  el.nearbyHint.style.display = "";
}

// Synchronise toute la couche UI (DOM) avec l'état courant.
function syncUI() {
  syncHud(el, state);
  updateWeaponUI(el, state);
  updateWeaponDetail(el, state);
  refreshUpgradePanel(el, state);
  syncBuildButtons(el, state);
  syncOverlay(el, state);
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  update(state, dt, readMoveVector());
  draw(ctx, state);
  syncUI();
  requestAnimationFrame(loop);
}

bindKeyboard(state);
bindMouse(canvas, state);
bindControls(el, state, reset);
reset();
requestAnimationFrame(loop);
