// Dessine les projectiles (plus gros pour les tirs à dégâts de zone).
export function drawBullets(ctx, state) {
  for (const b of state.bullets) {
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.splash > 0 ? 5 : 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
}
