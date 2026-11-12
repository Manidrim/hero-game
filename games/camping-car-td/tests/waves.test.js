import { describe, it, expect } from "vitest";
import {
  waveQueue, wavePreview, hpMultiplier, bountyFor, waveReward, isBossWave,
} from "../src/config/waves.js";
import { ENEMY_TYPES } from "../src/config/enemies.js";

describe("waveQueue", () => {
  it("la vague 1 ne contient que des touristes", () => {
    const q = waveQueue(1);
    expect(q).toHaveLength(8); // 6 + 1 * 2
    expect(q.every((e) => e.kind === "touriste")).toBe(true);
  });

  it("une vague de boss contient au moins un boss", () => {
    expect(isBossWave(10)).toBe(true);
    expect(isBossWave(9)).toBe(false);
    expect(waveQueue(10).some((e) => e.kind === "boss")).toBe(true);
    expect(waveQueue(20).filter((e) => e.kind === "boss")).toHaveLength(1);
  });

  it("n'utilise que des types débloqués à la vague donnée", () => {
    for (const e of waveQueue(2)) {
      expect(ENEMY_TYPES[e.kind].unlock).toBeLessThanOrEqual(2);
    }
  });
});

describe("équilibrage des vagues", () => {
  it("le multiplicateur de PV croît avec la vague", () => {
    expect(hpMultiplier(1)).toBe(1);
    expect(hpMultiplier(10)).toBeGreaterThan(hpMultiplier(5));
    expect(hpMultiplier(50)).toBeGreaterThan(hpMultiplier(10));
  });

  it("la prime et la récompense de vague augmentent", () => {
    expect(bountyFor(ENEMY_TYPES.touriste, 10)).toBeGreaterThan(ENEMY_TYPES.touriste.bounty);
    expect(waveReward(10)).toBeGreaterThan(waveReward(1));
  });

  it("l'aperçu totalise la file d'apparition", () => {
    const q = waveQueue(7);
    const preview = wavePreview(7);
    const total = Object.values(preview).reduce((s, n) => s + n, 0);
    expect(total).toBe(q.length);
  });
});
