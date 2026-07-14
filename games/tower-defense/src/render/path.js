import { TILE } from "../config/grid.js";
import { WAYPOINTS } from "../config/path.js";

// Dessine le chemin des ennemis, la base à défendre et le portail de départ.
export function drawPath(ctx) {
  ctx.strokeStyle = "#5c4a2a";
  ctx.lineWidth = TILE * 0.7;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(WAYPOINTS[0].x, WAYPOINTS[0].y);
  for (let i = 1; i < WAYPOINTS.length; i++) {
    ctx.lineTo(WAYPOINTS[i].x, WAYPOINTS[i].y);
  }
  ctx.stroke();

  ctx.strokeStyle = "#6b5836";
  ctx.lineWidth = TILE * 0.5;
  ctx.stroke();

  const end = WAYPOINTS[WAYPOINTS.length - 1];
  ctx.font = "26px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🏰", end.x, end.y); // base à défendre
  ctx.fillText("🌀", WAYPOINTS[0].x + 6, WAYPOINTS[0].y); // portail de départ
}
