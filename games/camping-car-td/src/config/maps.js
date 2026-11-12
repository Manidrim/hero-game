import { TILE, COLS, ROWS } from "./grid.js";

// Cartes jouables. `cells` = points de passage du chemin en coordonnées grille
// (les extrémités hors grille simulent l'entrée et la sortie du terrain).
export const MAPS = [
  {
    id: "prairie", name: "La Prairie", emoji: "🌾", unlock: 1,
    desc: "Un parcours en S, idéal pour débuter.",
    cells: [[-1, 6], [4, 6], [4, 2], [10, 2], [10, 9], [15, 9], [15, 4], [21, 4]],
  },
  {
    id: "foret", name: "La Forêt", emoji: "🌲", unlock: 3,
    desc: "Un zigzag serré qui avantage les longues portées.",
    cells: [[-1, 2], [6, 2], [6, 7], [2, 7], [2, 10], [12, 10], [12, 4], [17, 4], [17, 8], [21, 8]],
  },
  {
    id: "montagne", name: "La Montagne", emoji: "⛰️", unlock: 6,
    desc: "Une longue spirale : il faudra un gros arsenal.",
    cells: [[-1, 9], [3, 9], [3, 3], [8, 3], [8, 8], [13, 8], [13, 3], [18, 3], [18, 9], [21, 9]],
  },
];

// Carte par id (repli sur la première carte si id inconnu).
export function findMap(id) {
  return MAPS.find((m) => m.id === id) || MAPS[0];
}

// Ensemble des cases occupées par le chemin ("c,r"), non constructibles.
export function buildPathSet(cells) {
  const set = new Set();
  for (let i = 0; i < cells.length - 1; i++) {
    let [c0, r0] = cells[i];
    const [c1, r1] = cells[i + 1];
    const dc = Math.sign(c1 - c0);
    const dr = Math.sign(r1 - r0);
    while (c0 !== c1 || r0 !== r1) {
      if (c0 >= 0 && c0 < COLS && r0 >= 0 && r0 < ROWS) set.add(c0 + "," + r0);
      c0 += dc;
      r0 += dr;
    }
    if (c1 >= 0 && c1 < COLS && r1 >= 0 && r1 < ROWS) set.add(c1 + "," + r1);
  }
  return set;
}

// Points de passage en pixels (centres des cases, entrées/sorties hors champ).
export function buildWaypoints(cells) {
  return cells.map(([c, r]) => ({ x: c * TILE + TILE / 2, y: r * TILE + TILE / 2 }));
}
