import { WIDTH, HEIGHT } from "../config/grid.js";
import { drawGrid } from "./grid.js";
import { drawPath } from "./path.js";
import { drawVehicles } from "./vehicles.js";
import { drawEnemies } from "./enemies.js";
import { drawEffects } from "./effects.js";
import { drawFloaters } from "./floaters.js";
import { drawPlacementPreview } from "./placement.js";

// Rendu complet d'une frame, dans l'ordre des plans.
export function draw(ctx, state) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawGrid(ctx, state);
  drawPath(ctx, state);
  drawVehicles(ctx, state);
  drawEnemies(ctx, state);
  drawEffects(ctx, state);
  drawFloaters(ctx, state);
  drawPlacementPreview(ctx, state);
}
