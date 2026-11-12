import { describe, it, expect } from "vitest";
import { createState, resetState, speedOf } from "../src/domain/state.js";
import {
  addXp, spendTalentPoint, unlockAchievement, achievementBonuses,
  gainsMultiplier, recordBestWave, maxLives,
} from "../src/domain/meta.js";
import { xpForLevel } from "../src/config/meta.js";

describe("XP et niveaux", () => {
  it("monte de niveau et offre 2 points de talent par niveau", () => {
    const state = createState();
    const gained = addXp(state, xpForLevel(1) + 10);
    expect(gained).toEqual([2]);
    expect(state.meta.level).toBe(2);
    expect(state.meta.points).toBe(3); // 1 initial + 2
    expect(state.notifications.some((n) => n.kind === "levelup")).toBe(true);
  });

  it("ne monte pas de niveau sans assez d'XP", () => {
    const state = createState();
    expect(addXp(state, 10)).toEqual([]);
    expect(state.meta.level).toBe(1);
  });
});

describe("talents", () => {
  it("dépense un point dans un rang, jusqu'au max", () => {
    const state = createState();
    state.meta.points = 3;
    expect(spendTalentPoint(state, "degats")).toBe(true);
    expect(spendTalentPoint(state, "degats")).toBe(true);
    expect(spendTalentPoint(state, "degats")).toBe(true);
    expect(spendTalentPoint(state, "degats")).toBe(false); // max 3 rangs
    expect(state.meta.talents.degats).toBe(3);
    expect(state.meta.points).toBe(0);
    expect(spendTalentPoint(state, "portee")).toBe(false); // plus de points
  });

  it("le talent 'vies' augmente les vies de départ", () => {
    const state = createState();
    expect(maxLives(state)).toBe(20);
    state.meta.talents.vies = 2;
    expect(maxLives(state)).toBe(26);
  });
});

describe("succès", () => {
  it("se débloque une seule fois et offre ses points", () => {
    const state = createState();
    const def = unlockAchievement(state, "cent");
    expect(def.name).toBe("Cent campeurs");
    expect(state.meta.points).toBe(2); // 1 + 1
    expect(unlockAchievement(state, "cent")).toBeNull();
    expect(achievementBonuses(state.meta).dmgPct).toBe(5);
  });

  it("le multiplicateur de gains combine talent et succès", () => {
    const state = createState();
    state.meta.talents.gains = 1; // +12%
    unlockAchievement(state, "riche"); // +5%
    expect(gainsMultiplier(state)).toBeCloseTo(1.12 * 1.05);
  });
});

describe("records et état", () => {
  it("enregistre le record de vague de la carte active", () => {
    const state = createState();
    state.wave = 12;
    expect(recordBestWave(state)).toBe(true);
    expect(state.meta.best.prairie).toBe(12);
    state.wave = 8;
    expect(recordBestWave(state)).toBe(false);
    expect(state.meta.best.prairie).toBe(12);
  });

  it("resetState conserve la méta mais change de carte", () => {
    const state = createState();
    state.meta.level = 7;
    resetState(state, "foret");
    expect(state.meta.level).toBe(7);
    expect(state.mapId).toBe("foret");
    expect(state.money).toBe(260);
    expect(state.wave).toBe(0);
    expect(speedOf(state)).toBe(1);
  });
});
