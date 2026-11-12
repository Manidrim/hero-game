import { describe, it, expect } from "vitest";
import { createState } from "../src/domain/state.js";
import { startWave, advanceSpawns, finishWaveIfCleared } from "../src/domain/waves.js";
import { update } from "../src/domain/tick.js";
import { FINAL_WAVE } from "../src/config/balance.js";

describe("startWave / advanceSpawns", () => {
  it("lance la vague suivante et prépare la file d'apparition", () => {
    const state = createState();
    expect(startWave(state)).toBe(true);
    expect(state.wave).toBe(1);
    expect(state.waveActive).toBe(true);
    expect(state.spawnQueue.length).toBeGreaterThan(0);
  });

  it("ne relance pas une vague déjà active", () => {
    const state = createState();
    startWave(state);
    expect(startWave(state)).toBe(false);
    expect(state.wave).toBe(1);
  });

  it("fait apparaître les ennemis au fil du temps", () => {
    const state = createState();
    startWave(state);
    const total = state.spawnQueue.length;
    advanceSpawns(state, 100); // bien assez pour vider la file
    expect(state.spawnQueue).toHaveLength(0);
    expect(state.enemies).toHaveLength(total);
  });
});

describe("finishWaveIfCleared", () => {
  it("termine la vague, verse la prime et l'XP", () => {
    const state = createState();
    startWave(state);
    state.spawnQueue = [];
    state.enemies = [];
    const moneyBefore = state.money;
    finishWaveIfCleared(state);
    expect(state.waveActive).toBe(false);
    expect(state.money).toBe(moneyBefore + 23); // 20 + 1 * 3
    expect(state.meta.xp).toBe(3); // 1 * 3 XP
  });

  it("ne termine rien tant que des ennemis restent", () => {
    const state = createState();
    startWave(state);
    state.spawnQueue = [];
    state.enemies = [{ hp: 1 }];
    finishWaveIfCleared(state);
    expect(state.waveActive).toBe(true);
  });

  it("notifie la victoire à la fin de campagne et enregistre le record", () => {
    const state = createState();
    state.wave = FINAL_WAVE - 1;
    startWave(state); // vague 30
    state.spawnQueue = [];
    state.enemies = [];
    finishWaveIfCleared(state);
    expect(state.notifications.some((n) => n.kind === "victory")).toBe(true);
    expect(state.meta.achievements).toContain("conquerant");
    expect(state.meta.best.prairie).toBe(FINAL_WAVE);
  });
});

describe("boucle update", () => {
  it("fait tourner une vague complète de bout en bout", () => {
    const state = createState();
    state.auto = false;
    startWave(state);
    let steps = 0;
    while (state.waveActive && steps < 60 * 120) {
      update(state, 1 / 60);
      steps++;
    }
    expect(state.waveActive).toBe(false);
    expect(state.wave).toBe(1);
  });

  it("ne fait rien en pause", () => {
    const state = createState();
    state.paused = true;
    startWave(state);
    const before = state.spawnQueue.length;
    update(state, 1);
    expect(state.spawnQueue.length).toBe(before);
    expect(state.enemies).toHaveLength(0);
  });
});
