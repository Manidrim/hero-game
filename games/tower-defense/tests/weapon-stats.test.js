import { describe, it, expect } from "vitest";
import { weaponStats, weaponMultiplier } from "../src/domain/weapon-stats.js";
import { createWeapons } from "../src/domain/weapon-state.js";
import { WEAPONS } from "../src/config/weapons.js";

function heroWith(overrides = {}) {
  return { damage: 14, range: 90, weapon: "smg", weapons: createWeapons(), ...overrides };
}

describe("weaponStats", () => {
  it("part d'un multiplicateur x1.0 et de la cadence de base de l'arme", () => {
    const s = weaponStats(heroWith());
    expect(s.multiplier).toBeCloseTo(1);
    expect(s.damage).toBeCloseTo(14);
    expect(s.range).toBeCloseTo(90);
    expect(s.fireRate).toBeCloseTo(0.7); // baseFireRate de la mitraillette
    expect(s.splash).toBe(0);
    expect(s.bulletSpeed).toBe(520);
  });

  it("l'attaque totale vaut les dégâts du héros × le multiplicateur (+0.1/point)", () => {
    const hero = heroWith();
    hero.weapons.smg.multiplierPoints = 5; // x1.5
    const s = weaponStats(hero);
    expect(weaponMultiplier(WEAPONS.smg, hero.weapons.smg)).toBeCloseTo(1.5);
    expect(s.damage).toBeCloseTo(14 * 1.5);
  });

  it("le bazooka et le sniper partent d'un multiplicateur de base élevé", () => {
    const bazooka = weaponStats(heroWith({ weapon: "bazooka" }));
    expect(bazooka.multiplier).toBeCloseTo(3);
    expect(bazooka.damage).toBeCloseTo(14 * 3);
    const sniper = weaponStats(heroWith({ weapon: "sniper" }));
    expect(sniper.multiplier).toBeCloseTo(6);
    expect(sniper.damage).toBeCloseTo(14 * 6);
  });

  it("les points de multiplicateur s'ajoutent au multiplicateur de base de l'arme", () => {
    const hero = heroWith({ weapon: "bazooka" });
    hero.weapons.bazooka.multiplierPoints = 5; // +0.5 → x3.5
    expect(weaponMultiplier(WEAPONS.bazooka, hero.weapons.bazooka)).toBeCloseTo(3.5);
  });

  it("les points de vitesse accélèrent le tir (délai plancher respecté)", () => {
    const hero = heroWith();
    hero.weapons.smg.speedPoints = 1;
    expect(weaponStats(hero).fireRate).toBeCloseTo(0.7 * 0.9);
    hero.weapons.smg.speedPoints = 50;
    expect(weaponStats(hero).fireRate).toBeCloseTo(0.15); // MIN_FIRE_RATE
  });

  it("le sniper double la portée du héros", () => {
    expect(weaponStats(heroWith({ weapon: "sniper" })).range).toBeCloseTo(180);
  });
});
