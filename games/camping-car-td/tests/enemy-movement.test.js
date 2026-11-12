import { describe, it, expect } from "vitest";
import { createState } from "../src/domain/state.js";
import { spawnEnemy } from "../src/domain/enemy-factory.js";
import { updateEnemies } from "../src/domain/enemy-movement.js";

describe("déplacement des ennemis", () => {
  it("l'ennemi avance le long du chemin", () => {
    const state = createState();
    state.wave = 1;
    spawnEnemy(state, "touriste");
    const e = state.enemies[0];
    const x0 = e.x;
    updateEnemies(state, 0.5); // 55 px/s * 0.5
    expect(e.x).toBeGreaterThan(x0);
    expect(e.dist).toBeGreaterThan(0);
    expect(state.gameOver).toBe(false);
  });

  it("un ennemi en bout de parcours fait perdre des vies", () => {
    const state = createState();
    state.wave = 1;
    spawnEnemy(state, "touriste");
    const e = state.enemies[0];
    const last = state.waypoints[state.waypoints.length - 1];
    e.x = last.x;
    e.y = last.y;
    e.wp = state.waypoints.length - 1;
    updateEnemies(state, 0.1);
    expect(state.enemies).toHaveLength(0);
    expect(state.lives).toBe(19);
    expect(state.gameOver).toBe(false);
  });

  it("la partie se termine quand les vies tombent à 0", () => {
    const state = createState();
    state.wave = 1;
    state.lives = 1;
    spawnEnemy(state, "boss"); // leak 5
    const e = state.enemies[0];
    const last = state.waypoints[state.waypoints.length - 1];
    e.x = last.x;
    e.y = last.y;
    e.wp = state.waypoints.length - 1;
    updateEnemies(state, 0.1);
    expect(state.lives).toBe(0);
    expect(state.gameOver).toBe(true);
    expect(state.won).toBe(false);
  });

  it("le ralentissement réduit la vitesse effective", () => {
    const state = createState();
    state.wave = 1;
    spawnEnemy(state, "touriste");
    const e = state.enemies[0];
    e.baseSpeed = 55; // fige la vitesse de base (aléatoire sinon)
    e.slowFactor = 0.5;
    e.slowTimer = 1;
    const x0 = e.x;
    updateEnemies(state, 0.5);
    expect(e.x - x0).toBeCloseTo(55 * 0.5 * 0.5, 5); // vitesse divisée par 2
  });
});
