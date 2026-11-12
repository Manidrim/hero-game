import { TILE, COLS, ROWS } from "../config/grid.js";

// Dessine l'herbe en damier et le décor (arbres, fleurs) des cases libres.
export function drawGrid(ctx, state) {
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      if (state.pathSet.has(c + "," + r)) continue;
      ctx.fillStyle = (c + r) % 2 === 0 ? "#35753f" : "#317039";
      ctx.fillRect(c * TILE, r * TILE, TILE, TILE);
    }
  }
  ctx.font = "22px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const d of state.deco) {
    ctx.fillText(d.emoji, (d.c + 0.5) * TILE, (d.r + 0.5) * TILE + 4);
  }
}
