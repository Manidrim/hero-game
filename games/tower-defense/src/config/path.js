import { TILE } from "./grid.js";

// Chemin suivi par les ennemis, exprimé en coordonnées de grille.
const PATH_CELLS = [
  [0, 2], [4, 2], [4, 10], [9, 10], [9, 4], [14, 4], [14, 12], [19, 12],
];

// Points de passage en pixels (centre des cases).
export const WAYPOINTS = PATH_CELLS.map(([c, r]) => ({
  x: c * TILE + TILE / 2,
  y: r * TILE + TILE / 2,
}));

// Ensemble des cases occupées par le chemin (non constructibles).
export const pathSet = buildPathSet();

function buildPathSet() {
  const cells = new Set();
  for (let i = 0; i < PATH_CELLS.length - 1; i++) {
    let [c0, r0] = PATH_CELLS[i];
    const [c1, r1] = PATH_CELLS[i + 1];
    const dc = Math.sign(c1 - c0);
    const dr = Math.sign(r1 - r0);
    while (c0 !== c1 || r0 !== r1) {
      cells.add(c0 + "," + r0);
      c0 += dc;
      r0 += dr;
    }
    cells.add(c1 + "," + r1);
  }
  return cells;
}
