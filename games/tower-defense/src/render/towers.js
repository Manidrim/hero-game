import { TOWER_TYPES, UPGRADE_RADIUS } from "../config/towers.js";
import { distance } from "../math/geometry.js";

// Dessine les tours, avec surbrillance de celles à portée du héros.
export function drawTowers(ctx, state) {
  const h = state.hero;
  for (const t of state.towers) {
    const def = TOWER_TYPES[t.type];
    if (distance(t.x, t.y, h.x, h.y) <= UPGRADE_RADIUS) {
      drawUpgradeHalo(ctx, t);
    }
    drawTowerBody(ctx, t, def);
    drawLevelBadge(ctx, t);
  }
}

// Anneau en pointillés autour des tours améliorables.
function drawUpgradeHalo(ctx, t) {
  ctx.strokeStyle = "rgba(99, 230, 190, 0.7)";
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(t.x, t.y, 19, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawTowerBody(ctx, t, def) {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.arc(t.x, t.y, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = def.color;
  ctx.beginPath();
  ctx.arc(t.x, t.y, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = "18px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(def.emoji, t.x, t.y + 1);
}

function drawLevelBadge(ctx, t) {
  ctx.fillStyle = "#0f1226";
  ctx.beginPath();
  ctx.arc(t.x + 11, t.y + 11, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#63e6be";
  ctx.font = "bold 10px system-ui, sans-serif";
  ctx.fillText(String(t.level), t.x + 11, t.y + 12);
}
