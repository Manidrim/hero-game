import { TILE } from "../config/grid.js";

// Dessine le chemin de terre, sa ligne centrale et les extrémités (entrée 🚪,
// base 🏠).
export function drawPath(ctx, state) {
  ctx.fillStyle = "#9b7b50";
  for (const key of state.pathSet) {
    const [c, r] = key.split(",").map(Number);
    ctx.fillRect(c * TILE + 2, r * TILE + 2, TILE - 4, TILE - 4);
  }
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 12]);
  ctx.beginPath();
  state.waypoints.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  ctx.stroke();
  ctx.setLineDash([]);
  const first = state.waypoints[0];
  const last = state.waypoints[state.waypoints.length - 1];
  ctx.font = "30px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🚪", first.x, first.y);
  ctx.fillText("🏠", last.x, last.y);
}
