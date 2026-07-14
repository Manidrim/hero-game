import { describe, it, expect } from "vitest";
import { weaponStats } from "../src/domain/weapon-stats.js";

const baseHero = { damage: 14, range: 90, fireRate: 0.5, weapon: "smg" };

describe("weaponStats", () => {
  it("applique les multiplicateurs de la mitraillette", () => {
    const s = weaponStats(baseHero);
    expect(s.damage).toBeCloseTo(14);
    expect(s.range).toBeCloseTo(90);
    expect(s.fireRate).toBeCloseTo(0.4);
    expect(s.splash).toBe(0);
    expect(s.bulletSpeed).toBe(520);
  });

  it("applique les multiplicateurs du bazooka (zone, cadence lente)", () => {
    const s = weaponStats({ ...baseHero, weapon: "bazooka" });
    expect(s.damage).toBeCloseTo(14 * 2.4);
    expect(s.fireRate).toBeCloseTo(1.5);
    expect(s.splash).toBe(60);
  });

  it("double la portée avec le sniper", () => {
    expect(weaponStats({ ...baseHero, weapon: "sniper" }).range).toBeCloseTo(180);
  });
});
