import { TILE } from "../config/grid.js";
import { VEHICLE_TYPES } from "../config/vehicles.js";
import { vehicleStats } from "../domain/vehicle-stats.js";

// Dessine les véhicules posés, leurs auras, niveaux et la portée du sélectionné.
export function drawVehicles(ctx, state) {
  for (const t of state.towers) drawAura(ctx, state, t);
  for (const t of state.towers) drawVehicle(ctx, state, t);
  const selected = state.towers.find((t) => t.id === state.selectedId);
  if (selected) drawRangeCircle(ctx, state, selected);
}

// Aura bleue des bivouacs (ralentissement de zone).
function drawAura(ctx, state, tower) {
  const def = VEHICLE_TYPES[tower.type];
  if (!def.slow) return;
  const stats = vehicleStats(state, tower);
  ctx.fillStyle = "rgba(120,200,255,0.10)";
  ctx.strokeStyle = "rgba(120,200,255,0.35)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(tower.x, tower.y, stats.range * TILE, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawVehicle(ctx, state, tower) {
  const def = VEHICLE_TYPES[tower.type];
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(tower.x, tower.y + 14, 16, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "32px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(def.emoji, tower.x, tower.y + 2);
  if (tower.flash > 0) {
    ctx.fillStyle = "rgba(255,255,200,0.8)";
    ctx.beginPath();
    ctx.arc(tower.x, tower.y - 10, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  drawLevelPips(ctx, tower);
}

// Pastilles de niveau sous le véhicule.
function drawLevelPips(ctx, tower) {
  for (let i = 0; i < tower.level; i++) {
    ctx.fillStyle = "#ffd166";
    ctx.beginPath();
    ctx.arc(tower.x - (tower.level - 1) * 4 + i * 8, tower.y + 20, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Cercle de portée du véhicule sélectionné + surbrillance de sa case.
function drawRangeCircle(ctx, state, tower) {
  const stats = vehicleStats(state, tower);
  ctx.strokeStyle = "rgba(255,209,102,0.5)";
  ctx.fillStyle = "rgba(255,209,102,0.08)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(tower.x, tower.y, stats.range * TILE, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,209,102,0.9)";
  ctx.strokeRect(tower.c * TILE + 1, tower.r * TILE + 1, TILE - 2, TILE - 2);
}
