import { TILE } from "../config/grid.js";
import { canPlaceAt } from "../domain/vehicles-build.js";
import { vehicleStats } from "../domain/vehicle-stats.js";

// Aperçu de placement : case survolée (verte/rouge) et portée du véhicule.
export function drawPlacementPreview(ctx, state) {
  if (!state.placing || !state.hoverCell) return;
  const { c, r } = state.hoverCell;
  const ok = canPlaceAt(state, c, r);
  ctx.fillStyle = ok ? "rgba(110,231,160,0.35)" : "rgba(255,107,107,0.35)";
  ctx.fillRect(c * TILE + 2, r * TILE + 2, TILE - 4, TILE - 4);
  if (!ok) return;
  const stats = vehicleStats(state, { type: state.placing, level: 1 });
  if (!stats.range) return;
  ctx.strokeStyle = "rgba(255,209,102,0.7)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc((c + 0.5) * TILE, (r + 0.5) * TILE, stats.range * TILE, 0, Math.PI * 2);
  ctx.stroke();
}
