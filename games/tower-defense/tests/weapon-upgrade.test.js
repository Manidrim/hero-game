import { describe, it, expect } from "vitest";
import { createState } from "../src/domain/state.js";
import { allocateWeaponPoint } from "../src/domain/weapon-upgrade.js";

describe("allocateWeaponPoint", () => {
  it("investit un point dans le multiplicateur", () => {
    const state = createState();
    state.hero.weapons.smg.points = 2;
    allocateWeaponPoint(state, "smg", "multiplier");
    expect(state.hero.weapons.smg.multiplierPoints).toBe(1);
    expect(state.hero.weapons.smg.points).toBe(1);
  });

  it("investit un point dans la vitesse d'attaque", () => {
    const state = createState();
    state.hero.weapons.smg.points = 1;
    allocateWeaponPoint(state, "smg", "speed");
    expect(state.hero.weapons.smg.speedPoints).toBe(1);
    expect(state.hero.weapons.smg.points).toBe(0);
  });

  it("ne fait rien sans point disponible", () => {
    const state = createState();
    allocateWeaponPoint(state, "smg", "multiplier");
    expect(state.hero.weapons.smg.multiplierPoints).toBe(0);
  });

  it("ignore une statistique inconnue sans consommer de point", () => {
    const state = createState();
    state.hero.weapons.smg.points = 1;
    allocateWeaponPoint(state, "smg", "portee");
    expect(state.hero.weapons.smg.points).toBe(1);
  });
});
