import { WIDTH, HEIGHT } from "../config/grid.js";
import { drawGrid } from "./grid.js";
import { drawPath } from "./path.js";
import { drawTowers } from "./towers.js";
import { drawHero } from "./hero.js";
import { drawEnemies } from "./enemies.js";
import { drawBullets } from "./bullets.js";
import { drawFloaters } from "./floaters.js";
import { drawPlacementPreview } from "./placement.js";

// Rendu complet d'une frame, dans l'ordre des plans.
export function draw(ctx, state) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawGrid(ctx);
  drawPath(ctx);
  drawTowers(ctx, state);
  drawHero(ctx, state);
  drawEnemies(ctx, state);
  drawBullets(ctx, state);
  drawFloaters(ctx, state);
  drawPlacementPreview(ctx, state);
}
