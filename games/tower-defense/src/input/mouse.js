import { TILE } from "../config/grid.js";
import { tryBuild } from "../domain/towers-build.js";

// Câble les écouteurs souris (survol, sortie, clic) sur le canvas.
export function bindMouse(canvas, state) {
  canvas.addEventListener("mousemove", (evt) => {
    const p = canvasPos(canvas, evt);
    state.hoverCell = { c: Math.floor(p.x / TILE), r: Math.floor(p.y / TILE) };
  });
  canvas.addEventListener("mouseleave", () => { state.hoverCell = null; });
  canvas.addEventListener("click", (evt) => onClick(canvas, state, evt));
}

function onClick(canvas, state, evt) {
  if (state.gameOver) return;
  const p = canvasPos(canvas, evt);
  if (state.selectedType) {
    tryBuild(state, Math.floor(p.x / TILE), Math.floor(p.y / TILE));
  } else {
    state.hero.tx = p.x; // déplacer le héros
    state.hero.ty = p.y;
  }
}

// Convertit les coordonnées d'un événement souris en coordonnées canvas.
function canvasPos(canvas, evt) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY,
  };
}
