import { describe, it, expect } from "vitest";
import { createState } from "../src/domain/state.js";
import { startWave, finishWaveIfCleared } from "../src/domain/waves.js";

function countKinds(queue) {
  return queue.reduce((acc, def) => {
    acc[def.kind] = (acc[def.kind] || 0) + 1;
    return acc;
  }, {});
}

describe("startWave", () => {
  it("prépare la première vague (uniquement des ennemis de base)", () => {
    const state = createState();
    startWave(state);
    expect(state.wave).toBe(1);
    expect(state.waveActive).toBe(true);
    expect(state.spawnQueue).toHaveLength(10); // 8 + 1 * 2
    expect(state.spawnQueue.every((d) => d.kind === "basic")).toBe(true);
  });

  it("introduit tanks et rapides à la vague 3", () => {
    const state = createState();
    state.wave = 2; // startWave incrémente → vague 3
    startWave(state);
    const kinds = countKinds(state.spawnQueue);
    expect(kinds.tank).toBe(3); // i = 0, 5, 10
    expect(kinds.fast).toBe(4); // i = 3, 6, 9, 12
  });

  it("ne relance pas une vague déjà active", () => {
    const state = createState();
    startWave(state);
    startWave(state);
    expect(state.wave).toBe(1);
  });
});

describe("finishWaveIfCleared", () => {
  it("termine la vague et verse la prime quand tout est nettoyé", () => {
    const state = createState();
    startWave(state);
    state.spawnQueue = [];
    state.enemies = [];
    const goldBefore = state.gold;
    finishWaveIfCleared(state);
    expect(state.waveActive).toBe(false);
    expect(state.gold).toBe(goldBefore + 45); // 40 + 1 * 5
  });
});
