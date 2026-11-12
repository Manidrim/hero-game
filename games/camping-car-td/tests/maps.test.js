import { describe, it, expect } from "vitest";
import { MAPS, findMap, buildPathSet, buildWaypoints } from "../src/config/maps.js";
import { COLS, ROWS } from "../src/config/grid.js";

describe("cartes", () => {
  it("chaque carte a un chemin continu et des points de passage", () => {
    for (const map of MAPS) {
      const set = buildPathSet(map.cells);
      expect(set.size).toBeGreaterThan(20);
      expect(buildWaypoints(map.cells)).toHaveLength(map.cells.length);
      // chaque case du chemin (dans la grille) touche une autre case du chemin
      for (const key of set) {
        const [c, r] = key.split(",").map(Number);
        const voisins = [[1, 0], [-1, 0], [0, 1], [0, -1]]
          .some(([dc, dr]) => set.has(c + dc + "," + (r + dr)));
        expect(voisins, `carte ${map.id} case ${key}`).toBe(true);
      }
    }
  });

  it("findMap retombe sur la première carte si l'id est inconnu", () => {
    expect(findMap("inconnue").id).toBe(MAPS[0].id);
    expect(findMap("foret").id).toBe("foret");
  });

  it("le chemin reste dans la grille sauf aux extrémités d'entrée/sortie", () => {
    const map = findMap("prairie");
    for (const key of buildPathSet(map.cells)) {
      const [c, r] = key.split(",").map(Number);
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThan(COLS);
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(ROWS);
    }
  });
});
