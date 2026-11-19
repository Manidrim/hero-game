import { describe, it, expect } from "vitest";
import { getTowerStats, upgradeCost } from "../src/domain/tower-stats.js";
import { MAX_TOWER_LEVEL } from "../src/config/towers.js";

describe("getTowerStats", () => {
  it("renvoie les stats de base au niveau 1", () => {
    const s = getTowerStats({ type: "arrow", level: 1 });
    expect(s.range).toBe(120);
    expect(s.damage).toBeCloseTo(8);
    expect(s.fireRate).toBeCloseTo(0.55);
    expect(s.splash).toBe(0);
  });

  it("fait monter dégâts et portée avec le niveau", () => {
    const s = getTowerStats({ type: "arrow", level: 3 });
    expect(s.range).toBe(120 + 8 * 2);
    expect(s.damage).toBeCloseTo(8 * Math.pow(1.22, 2));
    expect(s.fireRate).toBeCloseTo(0.55 * Math.pow(0.93, 2));
  });

  it("augmente le ralentissement du givre avec le niveau (borné à 0.8)", () => {
    const s = getTowerStats({ type: "frost", level: 10 });
    expect(s.slow).toBeCloseTo(0.77); // 0.5 + 0.03 * 9, sous le plafond de 0.8
    expect(s.slow).toBeLessThanOrEqual(0.8);
  });

  it("augmente la zone du canon avec le niveau", () => {
    expect(getTowerStats({ type: "cannon", level: 2 }).splash).toBe(45 + 4);
  });

  it("reste cohérent au niveau maximum (20) : dégâts/portée montent, cadence > 0", () => {
    const max = getTowerStats({ type: "arrow", level: MAX_TOWER_LEVEL });
    const lvl10 = getTowerStats({ type: "arrow", level: 10 });
    expect(max.damage).toBeCloseTo(8 * Math.pow(1.22, MAX_TOWER_LEVEL - 1));
    expect(max.range).toBe(120 + 8 * (MAX_TOWER_LEVEL - 1));
    expect(max.fireRate).toBeCloseTo(0.55 * Math.pow(0.93, MAX_TOWER_LEVEL - 1));
    expect(max.fireRate).toBeGreaterThan(0);
    expect(max.damage).toBeGreaterThan(lvl10.damage);
    expect(max.range).toBeGreaterThan(lvl10.range);
  });

  it("garde le ralentissement du givre plafonné à 0.8 au niveau maximum", () => {
    const s = getTowerStats({ type: "frost", level: MAX_TOWER_LEVEL });
    expect(s.slow).toBe(0.8);
  });
});

describe("upgradeCost", () => {
  it("calcule le coût d'amélioration selon le niveau", () => {
    expect(upgradeCost({ type: "arrow", level: 1 })).toBe(40);
    expect(upgradeCost({ type: "arrow", level: 2 })).toBe(65);
  });

  it("reste linéaire et positif jusqu'au niveau maximum", () => {
    const c19 = upgradeCost({ type: "arrow", level: MAX_TOWER_LEVEL - 1 });
    const c20 = upgradeCost({ type: "arrow", level: MAX_TOWER_LEVEL });
    expect(c19).toBe(490);
    expect(c20).toBe(515);
    expect(c20).toBeGreaterThan(c19);
  });
});
