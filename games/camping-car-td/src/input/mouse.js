import { TILE } from "../config/grid.js";
import { tryPlace } from "../domain/vehicles-build.js";

// Câble les écouteurs souris sur le canvas : survol, clic (poser/sélectionner),
// clic droit (annuler le placement).
export function bindMouse(canvas, state) {
  canvas.addEventListener("mousemove", (evt) => {
    const p = canvasPos(canvas, evt);
    state.hoverCell = { c: Math.floor(p.x / TILE), r: Math.floor(p.y / TILE) };
  });
  canvas.addEventListener("mouseleave", () => {
    state.hoverCell = null;
  });
  canvas.addEventListener("click", (evt) => onClick(canvas, state, evt));
  canvas.addEventListener("contextmenu", (evt) => {
    evt.preventDefault();
    state.placing = null;
  });
}

function onClick(canvas, state, evt) {
  if (state.gameOver) return;
  const p = canvasPos(canvas, evt);
  const c = Math.floor(p.x / TILE);
  const r = Math.floor(p.y / TILE);
  if (state.placing) {
    tryPlace(state, c, r);
    return;
  }
  const tower = state.towers.find((t) => t.c === c && t.r === r) || null;
  state.selectedId = tower ? tower.id : null;
}

// Convertit les coordonnées d'un événement souris en coordonnées canvas.
function canvasPos(canvas, evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (evt.clientX - rect.left) * (canvas.width / rect.width),
    y: (evt.clientY - rect.top) * (canvas.height / rect.height),
  };
}
