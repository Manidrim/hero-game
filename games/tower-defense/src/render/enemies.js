import { drawBar } from "./bar.js";

// Dessine les ennemis, leur contour de gel et leur barre de vie.
export function drawEnemies(ctx, state) {
  for (const e of state.enemies) {
    ctx.fillStyle = e.color;
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
    ctx.fill();

    if (e.slowTimer > 0) {
      ctx.strokeStyle = "#c3fae8";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    drawBar(ctx, e.x, e.y - e.size - 7, e.size * 2, e.hp / e.maxHp, "#ff6b6b");
  }
}
