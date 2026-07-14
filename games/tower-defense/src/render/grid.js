import { TILE, COLS, ROWS } from "../config/grid.js";
import { pathSet } from "../config/path.js";

// Dessine le damier de fond (hors cases occupées par le chemin).
export function drawGrid(ctx) {
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      if (pathSet.has(c + "," + r)) continue;
      ctx.fillStyle = (c + r) % 2 === 0 ? "#153a22" : "#12331d";
      ctx.fillRect(c * TILE, r * TILE, TILE, TILE);
    }
  }
}
