import { selectType } from "../domain/towers-build.js";
import { cycleWeapon } from "../domain/weapon-switch.js";
import { startWave } from "../domain/waves.js";

// On se base sur `event.code`, c.-à-d. la POSITION PHYSIQUE de la touche,
// indépendamment de la disposition. KeyW/A/S/D correspondent ainsi à ZQSD sur
// AZERTY et à WASD sur QWERTY sans avoir besoin de détecter la disposition.
const MOVE_KEYS = {
  KeyW: [0, -1], KeyS: [0, 1], KeyA: [-1, 0], KeyD: [1, 0],
  ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
};
const BUILD_KEYS = { 1: "arrow", 2: "cannon", 3: "frost" };
const pressedKeys = new Set();

// Vecteur de déplacement courant, somme des touches directionnelles tenues.
export function readMoveVector() {
  let x = 0, y = 0;
  for (const code of pressedKeys) {
    const v = MOVE_KEYS[code];
    if (v) { x += v[0]; y += v[1]; }
  }
  return { x, y };
}

// Câble les écouteurs clavier sur l'état de jeu donné.
export function bindKeyboard(state) {
  window.addEventListener("keyup", (e) => pressedKeys.delete(e.code));
  // Si la fenêtre perd le focus, on relâche tout pour éviter un déplacement bloqué.
  window.addEventListener("blur", () => pressedKeys.clear());
  window.addEventListener("keydown", (e) => onKeyDown(e, state));
}

function onKeyDown(e, state) {
  if (MOVE_KEYS[e.code]) { pressedKeys.add(e.code); e.preventDefault(); }
  if (e.key === "Escape") selectType(state, state.selectedType); // désélectionne
  if (e.key === " " || e.key === "Enter") { startWave(state); e.preventDefault(); }
  if (BUILD_KEYS[e.key]) selectType(state, BUILD_KEYS[e.key]);
  if (e.key === "x" || e.key === "X") cycleWeapon(state); // changer d'arme
}
