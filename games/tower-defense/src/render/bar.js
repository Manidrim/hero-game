// Petite barre de progression (vie, etc.), centrée horizontalement en cx.
export function drawBar(ctx, cx, cy, width, ratio, color) {
  const clamped = Math.max(0, Math.min(1, ratio));
  const h = 4;
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(cx - width / 2, cy, width, h);
  ctx.fillStyle = color;
  ctx.fillRect(cx - width / 2, cy, width * clamped, h);
}
