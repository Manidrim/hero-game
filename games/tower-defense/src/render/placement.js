import { TILE } from "../config/grid.js";
import { TOWER_TYPES } from "../config/towers.js";
import { canBuildAt } from "../domain/towers-build.js";

// Aperçu de placement d'une tour sous le curseur (case + portée + validité).
export function drawPlacementPreview(ctx, state) {
  if (!state.selectedType || !state.hoverCell) return;
  const { c, r } = state.hoverCell;
  const def = TOWER_TYPES[state.selectedType];
  const ok = canBuildAt(state, c, r);
  const cx = c * TILE + TILE / 2;
  const cy = r * TILE + TILE / 2;

  ctx.fillStyle = ok ? "rgba(99, 230, 190, 0.25)" : "rgba(255, 107, 107, 0.25)";
  ctx.fillRect(c * TILE, r * TILE, TILE, TILE);

  ctx.strokeStyle = ok ? "rgba(99, 230, 190, 0.6)" : "rgba(255, 107, 107, 0.7)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, def.range, 0, Math.PI * 2);
  ctx.stroke();
}
