import { describe, it, expect } from "vitest";
import { createState } from "../src/domain/state.js";
import { makeEnemyDef, spawnEnemy } from "../src/domain/enemy-factory.js";
import { updateEnemies } from "../src/domain/enemy-movement.js";
import { WAYPOINTS } from "../src/config/path.js";

describe("updateEnemies", () => {
  it("fait avancer l'ennemi vers le point de passage suivant", () => {
    const state = createState();
    spawnEnemy(state, makeEnemyDef("basic", 20));
    const startX = state.enemies[0].x;
    updateEnemies(state, 0.1);
    expect(state.enemies[0].x).toBeGreaterThan(startX);
    expect(state.enemies[0].y).toBeCloseTo(WAYPOINTS[0].y);
  });

  it("fait perdre une vie quand un ennemi atteint la base", () => {
    const state = createState();
    spawnEnemy(state, makeEnemyDef("basic", 20));
    state.enemies[0].wp = WAYPOINTS.length; // au-delà du dernier waypoint
    updateEnemies(state, 0.1);
    expect(state.enemies).toHaveLength(0);
    expect(state.lives).toBe(19);
  });

  it("déclenche la fin de partie à court de vies", () => {
    const state = createState();
    state.lives = 1;
    spawnEnemy(state, makeEnemyDef("basic", 20));
    state.enemies[0].wp = WAYPOINTS.length;
    updateEnemies(state, 0.1);
    expect(state.lives).toBe(0);
    expect(state.gameOver).toBe(true);
  });
});
