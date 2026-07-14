import { UPGRADE_RADIUS } from "../config/towers.js";
import { WEAPONS } from "../config/weapons.js";
import { weaponStats } from "../domain/weapon-stats.js";
import { drawBar } from "./bar.js";

// Dessine le héros, ses cercles de portée, son arme et sa barre de vie.
export function drawHero(ctx, state) {
  const h = state.hero;
  const ws = weaponStats(h);

  drawRangeCircles(ctx, h, ws.range);
  drawHeroBody(ctx, h);
  drawWeaponBadge(ctx, h);
  drawBar(ctx, h.x, h.y - 22, 30, h.hp / h.maxHp, "#63e6be");
}

function drawRangeCircles(ctx, h, range) {
  // Portée d'attaque (discrète) — dépend de l'arme équipée.
  ctx.strokeStyle = "rgba(255, 224, 102, 0.18)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(h.x, h.y, range, 0, Math.PI * 2);
  ctx.stroke();

  // Zone d'amélioration des tours (les tours à l'intérieur sont améliorables).
  ctx.strokeStyle = "rgba(99, 230, 190, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.arc(h.x, h.y, UPGRADE_RADIUS, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawHeroBody(ctx, h) {
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.arc(h.x, h.y, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "24px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🦸", h.x, h.y);
}

function drawWeaponBadge(ctx, h) {
  ctx.fillStyle = "#0f1226";
  ctx.beginPath();
  ctx.arc(h.x + 12, h.y + 11, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "12px serif";
  ctx.fillText(WEAPONS[h.weapon].emoji, h.x + 12, h.y + 12);
}
