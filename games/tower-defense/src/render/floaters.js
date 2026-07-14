// Dessine les textes flottants, avec fondu selon leur durée de vie restante.
export function drawFloaters(ctx, state) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const f of state.floaters) {
    ctx.globalAlpha = Math.max(0, Math.min(1, f.life));
    ctx.fillStyle = f.color;
    ctx.font = "bold 15px system-ui, sans-serif";
    ctx.fillText(f.text, f.x, f.y);
  }
  ctx.globalAlpha = 1;
}
