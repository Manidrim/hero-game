// Dessine les ennemis : ombre, emoji, teinte de ralentissement, barre de PV.
export function drawEnemies(ctx, state) {
  for (const e of state.enemies) {
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(e.x, e.y + 11, 12, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    if (e.slowTimer > 0) {
      ctx.fillStyle = "rgba(120,200,255,0.35)";
      ctx.beginPath();
      ctx.arc(e.x, e.y, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.font = "26px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(e.def.emoji, e.x, e.y);
    if (e.hitFlash > 0) {
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.beginPath();
      ctx.arc(e.x, e.y, 14, 0, Math.PI * 2);
      ctx.fill();
    }
    drawHpBar(ctx, e);
  }
}

function drawHpBar(ctx, e) {
  const w = 30;
  const ratio = Math.max(0, e.hp / e.maxHp);
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(e.x - w / 2, e.y - 20, w, 5);
  ctx.fillStyle = ratio > 0.5 ? "#6ee7a0" : ratio > 0.25 ? "#ffd166" : "#ff6b6b";
  ctx.fillRect(e.x - w / 2 + 1, e.y - 19, (w - 2) * ratio, 3);
  if (e.def.boss) {
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#ffd166";
    ctx.fillText("BOSS", e.x, e.y - 24);
  }
}
